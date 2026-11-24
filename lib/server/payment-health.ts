import Stripe from "stripe";
import type { Email } from "@/lib/alerts";
import { ADMIN_EMAILS } from "@/lib/server/admin-access";
import { sendWithResend, type SendFn } from "@/lib/server/alerts";
import { admin } from "@/lib/server/auth";
import { checkStripePrice, type PriceCheck } from "@/lib/server/stripe-price";

/**
 * Refusal labels that mean payments are broken. The others (unticked, signed-out, already-pro, already-subscribed) are
 * ordinary people saying no or being turned away, so they never raise the alarm.
 */
export const BROKEN_REFUSALS = ["price-unreadable", "price-mismatch", "stripe-error", "not-configured"] as const;

export type FunnelRow = { event: string; campaign: string; n: number };

export type HealthResult = {
  skipped?: string;
  ok: boolean;
  problems: string[];
  emailed: boolean;
};

export type HealthDeps = {
  /** Reads a price from Stripe and compares it with the plan the site shows. */
  checkPrice?: (priceId: string, plan: "monthly" | "pass") => Promise<PriceCheck>;
  /** Counter rows for the given UTC dates (YYYY-MM-DD), summed across source. */
  funnelRows?: (days: string[]) => Promise<FunnelRow[]>;
  send?: SendFn;
};

const utcDay = (d: Date) => d.toISOString().slice(0, 10);

/** Counter rows for the two UTC days a daily job covers. The funnel is stored by day, so this is "yesterday and today so far". */
async function readFunnelRows(days: string[]): Promise<FunnelRow[]> {
  const a = admin();
  if (!a) return [];
  const { data, error } = await a.from("funnel_daily").select("event, campaign, n").in("day", days).in("event", ["checkout_refused", "webhook_failed"]);
  if (error) throw new Error(`funnel_daily: ${error.message}`);
  return (data ?? []) as FunnelRow[];
}

/** Everyone who should hear about a payment problem: PAYMENT_ALERT_EMAIL when set (comma separated), otherwise the admins. */
export function alertRecipients(env: Record<string, string | undefined> = process.env): string[] {
  const set = (env.PAYMENT_ALERT_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return set.length ? set : [...ADMIN_EMAILS];
}

export function buildHealthEmail(problems: string[]): Email {
  const subject = `Level6 payments need attention (${problems.length} problem${problems.length === 1 ? "" : "s"})`;
  const text = [
    "The daily payment health check found:",
    "",
    ...problems.map((p) => `- ${p}`),
    "",
    "Checkout may be refusing customers. Check the Stripe key and price in Vercel, then the funnel counters on the admin page.",
  ].join("\n");
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const html = `<p>The daily payment health check found:</p><ul>${problems.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><p>Checkout may be refusing customers. Check the Stripe key and price in Vercel, then the funnel counters on the admin page.</p>`;
  return { subject, text, html, headers: {} };
}

/**
 * The daily payment health check. It reads the Stripe price the way checkout does, and counts checkouts the server refused
 * for a broken reason (and webhook updates that failed) over the last day or so. If anything is wrong it emails the
 * owners, so an expired key can no longer refuse every customer for days unnoticed. It never throws: the other daily
 * jobs run alongside it. It sends nothing when all is well.
 */
export async function runPaymentHealth(now = new Date(), deps: HealthDeps = {}): Promise<HealthResult> {
  const key = process.env.STRIPE_SECRET_KEY;
  const monthly = process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRICE_MONTHLY;
  const pass = process.env.STRIPE_PRICE_PASS;
  const production = process.env.VERCEL_ENV === "production";
  const problems: string[] = [];

  try {
    if (!key || !monthly) {
      // A missing key is only a fault where real customers pay.
      if (!production) return { skipped: "Payments are not configured here", ok: true, problems: [], emailed: false };
      problems.push(`Payments are not configured in production (${!key ? "STRIPE_SECRET_KEY" : "STRIPE_PRICE_ID"} is missing).`);
    } else {
      const stripe = new Stripe(key);
      const checkPrice = deps.checkPrice ?? ((id, plan) => checkStripePrice(stripe, id, plan));
      const monthlyCheck = await checkPrice(monthly, "monthly");
      if (!monthlyCheck.ok) problems.push(`The monthly Stripe price failed (${monthlyCheck.reason}): ${monthlyCheck.detail}`);
      if (pass) {
        const passCheck = await checkPrice(pass, "pass");
        if (!passCheck.ok) problems.push(`The Season Pass Stripe price failed (${passCheck.reason}): ${passCheck.detail}`);
      }
    }

    const yesterday = new Date(now.getTime() - 86_400_000);
    const rows = await (deps.funnelRows ?? readFunnelRows)([utcDay(yesterday), utcDay(now)]);
    const broken = rows.filter((r) => r.event === "checkout_refused" && (BROKEN_REFUSALS as readonly string[]).includes(r.campaign));
    const brokenCount = broken.reduce((t, r) => t + r.n, 0);
    if (brokenCount > 0) {
      const why = [...new Set(broken.map((r) => r.campaign))].join(", ");
      problems.push(`${brokenCount} checkout${brokenCount === 1 ? " was" : "s were"} refused for a payment fault in the last day or so (${why}).`);
    }
    const hooks = rows.filter((r) => r.event === "webhook_failed").reduce((t, r) => t + r.n, 0);
    if (hooks > 0) problems.push(`${hooks} Stripe webhook update${hooks === 1 ? "" : "s"} failed in the last day or so, so someone may have paid and stayed on Free.`);
  } catch (e) {
    // The check itself failing is worth knowing about too, but must not stop the other daily jobs.
    console.error("payment health check failed", (e as Error)?.message);
    problems.push(`The health check itself could not finish: ${(e as Error)?.message ?? "unknown error"}`);
  }

  if (!problems.length) return { ok: true, problems, emailed: false };

  console.error("payment health problems", JSON.stringify(problems));
  const send = deps.send ?? sendWithResend;
  const email = buildHealthEmail(problems);
  let emailed = false;
  for (const to of alertRecipients()) emailed = (await send(to, email)) || emailed;
  return { ok: false, problems, emailed };
}
