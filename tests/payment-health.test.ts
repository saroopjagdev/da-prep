import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PASS_PLAN, PRO_PLAN } from "@/lib/plans";
import { BROKEN_REFUSALS, alertRecipients, buildHealthEmail, runPaymentHealth, type FunnelRow } from "@/lib/server/payment-health";
import { priceMatchesPlan } from "@/lib/server/stripe-price";

const NOW = new Date("2026-11-23T07:00:00Z");
const ok = async () => ({ ok: true as const });
const rows = (r: FunnelRow[]) => async () => r;

describe("payment health check", () => {
  const send = vi.fn(async () => true);
  beforeEach(() => {
    send.mockClear();
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
    vi.stubEnv("STRIPE_PRICE_ID", "price_monthly");
    vi.stubEnv("STRIPE_PRICE_PASS", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("PAYMENT_ALERT_EMAIL", "owner@example.com");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("says nothing when the price is fine and nothing broke", async () => {
    const r = await runPaymentHealth(NOW, { checkPrice: ok, funnelRows: rows([]), send });
    expect(r).toEqual({ ok: true, problems: [], emailed: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("emails when the Stripe price cannot be read (an expired key)", async () => {
    const checkPrice = async () => ({ ok: false as const, reason: "price-unreadable" as const, detail: "Expired API Key provided" });
    const r = await runPaymentHealth(NOW, { checkPrice, funnelRows: rows([]), send });
    expect(r.ok).toBe(false);
    expect(r.problems[0]).toMatch(/price-unreadable.*Expired/);
    expect(send).toHaveBeenCalledWith("owner@example.com", expect.objectContaining({ subject: expect.stringContaining("need attention") }));
    expect(r.emailed).toBe(true);
  });

  it("also checks the Season Pass price when one is set", async () => {
    vi.stubEnv("STRIPE_PRICE_PASS", "price_pass");
    const seen: string[] = [];
    const checkPrice = async (id: string, plan: "monthly" | "pass") => {
      seen.push(`${id}:${plan}`);
      return plan === "pass" ? { ok: false as const, reason: "price-mismatch" as const, detail: "wrong amount" } : { ok: true as const };
    };
    const r = await runPaymentHealth(NOW, { checkPrice, funnelRows: rows([]), send });
    expect(seen).toEqual(["price_monthly:monthly", "price_pass:pass"]);
    expect(r.problems).toHaveLength(1);
    expect(r.problems[0]).toMatch(/Season Pass/);
  });

  it("counts only checkouts refused for a payment fault", async () => {
    const r = await runPaymentHealth(NOW, {
      checkPrice: ok,
      funnelRows: rows([
        { event: "checkout_refused", campaign: "price-unreadable", n: 3 },
        { event: "checkout_refused", campaign: "stripe-error", n: 1 },
        { event: "checkout_refused", campaign: "already-pro", n: 40 },
        { event: "checkout_refused", campaign: "signed-out", n: 9 },
        { event: "checkout_refused", campaign: "unticked", n: 5 },
      ]),
      send,
    });
    expect(r.ok).toBe(false);
    expect(r.problems).toHaveLength(1);
    expect(r.problems[0]).toMatch(/^4 checkouts were refused/);
    expect(r.problems[0]).toMatch(/price-unreadable, stripe-error/);
  });

  it("does not alarm on ordinary refusals alone", async () => {
    const r = await runPaymentHealth(NOW, { checkPrice: ok, funnelRows: rows([{ event: "checkout_refused", campaign: "already-pro", n: 12 }]), send });
    expect(r.ok).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports failed webhook updates", async () => {
    const r = await runPaymentHealth(NOW, { checkPrice: ok, funnelRows: rows([{ event: "webhook_failed", campaign: "db-error", n: 1 }]), send });
    expect(r.ok).toBe(false);
    expect(r.problems[0]).toMatch(/^1 Stripe webhook update failed/);
  });

  it("asks for yesterday and today", async () => {
    const funnelRows = vi.fn(async () => []);
    await runPaymentHealth(NOW, { checkPrice: ok, funnelRows, send });
    expect(funnelRows).toHaveBeenCalledWith(["2026-11-22", "2026-11-23"]);
  });

  it("treats a missing key as a fault in production but not elsewhere", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const prod = await runPaymentHealth(NOW, { funnelRows: rows([]), send });
    expect(prod.ok).toBe(false);
    expect(prod.problems[0]).toMatch(/STRIPE_SECRET_KEY is missing/);

    vi.stubEnv("VERCEL_ENV", "preview");
    send.mockClear();
    const preview = await runPaymentHealth(NOW, { funnelRows: rows([]), send });
    expect(preview.skipped).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });

  it("never throws when the check itself breaks, and says so", async () => {
    const funnelRows = async () => {
      throw new Error("db down");
    };
    const r = await runPaymentHealth(NOW, { checkPrice: ok, funnelRows, send });
    expect(r.ok).toBe(false);
    expect(r.problems[0]).toMatch(/could not finish: db down/);
    expect(send).toHaveBeenCalled();
  });

  it("reports emailed: false when the email could not be sent", async () => {
    const failing = vi.fn(async () => false);
    const r = await runPaymentHealth(NOW, { checkPrice: async () => ({ ok: false, reason: "price-unreadable", detail: "x" }), funnelRows: rows([]), send: failing });
    expect(r.ok).toBe(false);
    expect(r.emailed).toBe(false);
  });
});

describe("alert recipients and email", () => {
  it("uses PAYMENT_ALERT_EMAIL when set, otherwise the admins", () => {
    expect(alertRecipients({ PAYMENT_ALERT_EMAIL: " a@x.com, b@x.com " })).toEqual(["a@x.com", "b@x.com"]);
    expect(alertRecipients({}).length).toBeGreaterThan(0);
  });
  it("lists every problem and escapes markup", () => {
    const e = buildHealthEmail(["one", "<b>two</b>"]);
    expect(e.subject).toContain("2 problems");
    expect(e.text).toContain("- one");
    expect(e.html).toContain("&lt;b>two&lt;/b>");
  });
  it("only counts real faults as broken", () => {
    expect([...BROKEN_REFUSALS]).not.toContain("already-pro");
    expect([...BROKEN_REFUSALS]).toContain("price-unreadable");
  });
});

describe("priceMatchesPlan", () => {
  const monthly = { unit_amount: PRO_PLAN.pence, currency: PRO_PLAN.currency, recurring: { interval: "month" } as never, active: true };
  const pass = { unit_amount: PASS_PLAN.pence, currency: PASS_PLAN.currency, recurring: null, active: true };
  it("accepts the right monthly and pass prices", () => {
    expect(priceMatchesPlan(monthly, "monthly")).toBe(true);
    expect(priceMatchesPlan(pass, "pass")).toBe(true);
  });
  it("rejects wrong amounts, inactive prices and mixed-up plans", () => {
    expect(priceMatchesPlan({ ...monthly, unit_amount: 1 }, "monthly")).toBe(false);
    expect(priceMatchesPlan({ ...monthly, active: false }, "monthly")).toBe(false);
    expect(priceMatchesPlan(monthly, "pass")).toBe(false);
    expect(priceMatchesPlan(pass, "monthly")).toBe(false);
  });
});
