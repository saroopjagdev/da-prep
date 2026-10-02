import { beforeEach, describe, expect, it, vi } from "vitest";

let event: unknown;
let badSig = false;
const subsList = vi.fn();
const subsCancel = vi.fn();
const piRetrieve = vi.fn();
const piUpdate = vi.fn();
const sessionCreate = vi.fn();
vi.mock("stripe", () => ({
  default: class {
    webhooks = {
      constructEvent: () => {
        if (badSig) throw new Error("bad");
        return event;
      },
    };
    subscriptions = { list: subsList, cancel: subsCancel };
    paymentIntents = { retrieve: piRetrieve, update: piUpdate };
    checkout = { sessions: { create: sessionCreate } };
  },
}));

const calls: { op: string; table: string; args: unknown[] }[] = [];
let dbError: unknown = null;
let profileRow: unknown = null;
const chain = (table: string, op: string, args: unknown[]) => {
  calls.push({ op, table, args });
  const result = { error: dbError, data: profileRow };
  const p: Record<string, unknown> = {
    eq: (...a: unknown[]) => (calls.push({ op: "eq", table, args: a }), p),
    maybeSingle: async () => result,
    then: (res: (v: unknown) => unknown) => Promise.resolve(result).then(res),
  };
  return p;
};
const rpc = vi.fn(async () => ({ data: "2027-01-02T00:00:00Z", error: null }));
const fakeDb = {
  rpc,
  from: (table: string) => ({
    upsert: (...a: unknown[]) => chain(table, "upsert", a),
    update: (...a: unknown[]) => chain(table, "update", a),
    delete: (...a: unknown[]) => chain(table, "delete", a),
    select: (...a: unknown[]) => chain(table, "select", a),
  }),
  auth: { admin: { deleteUser: async () => ({ error: null }) } },
};
vi.mock("@/lib/server/auth", () => ({ admin: () => fakeDb, userFromRequest: async () => ({ id: "u1", email: "a@b.c" }) }));

import { DELETE as deleteAccount } from "@/app/api/account/route";
import { POST as checkout } from "@/app/api/stripe/checkout/route";
import { POST as webhook } from "@/app/api/stripe/webhook/route";

const hook = () => webhook(new Request("http://x/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": "s" }, body: "{}" }));

beforeEach(() => {
  calls.length = 0;
  dbError = null;
  badSig = false;
  profileRow = null;
  subsList.mockReset();
  subsCancel.mockReset();
  piRetrieve.mockReset();
  piUpdate.mockReset();
  rpc.mockClear();
  sessionCreate.mockReset();
  sessionCreate.mockResolvedValue({ url: "https://checkout.stripe.test/s" });
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_x");
});

describe("stripe webhook", () => {
  it("rejects a bad signature", async () => {
    badSig = true;
    expect((await hook()).status).toBe(400);
  });

  it("upgrades to pro when a subscription checkout is paid", async () => {
    event = { type: "checkout.session.completed", data: { object: { mode: "subscription", payment_status: "paid", client_reference_id: "u1", customer: "cus_1" } } };
    expect((await hook()).status).toBe(200);
    expect(calls[0]).toMatchObject({ op: "upsert", table: "profiles", args: [{ id: "u1", plan: "pro", stripe_customer_id: "cus_1" }] });
  });

  it("does not grant anything until the payment is actually paid", async () => {
    event = { type: "checkout.session.completed", data: { object: { mode: "payment", payment_status: "unpaid", client_reference_id: "u1", customer: "cus_1", payment_intent: "pi_1" } } };
    expect((await hook()).status).toBe(200);
    expect(calls).toHaveLength(0);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("extends the pass by 3 months once, even if Stripe sends the event twice", async () => {
    event = { type: "checkout.session.completed", data: { object: { mode: "payment", payment_status: "paid", client_reference_id: "u1", customer: "cus_1", payment_intent: "pi_1" } } };
    piRetrieve.mockResolvedValueOnce({ id: "pi_1", metadata: { user_id: "u1" } });
    expect((await hook()).status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("extend_pro_pass", { p_uid: "u1", p_months: 3 });
    expect(piUpdate).toHaveBeenCalledWith("pi_1", { metadata: { user_id: "u1", pass_applied: "yes" } });
    piRetrieve.mockResolvedValueOnce({ id: "pi_1", metadata: { user_id: "u1", pass_applied: "yes" } });
    await hook();
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("grants a pass paid later by bank transfer", async () => {
    event = { type: "checkout.session.async_payment_succeeded", data: { object: { mode: "payment", payment_status: "paid", client_reference_id: "u1", payment_intent: "pi_2" } } };
    piRetrieve.mockResolvedValueOnce({ id: "pi_2", metadata: {} });
    await hook();
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["active", "pro"],
    ["trialing", "pro"],
    ["past_due", "pro"],
    ["unpaid", "free"],
    ["canceled", "free"],
    ["incomplete_expired", "free"],
  ])("subscription.updated %s -> %s", async (status, plan) => {
    event = { type: "customer.subscription.updated", data: { object: { customer: "cus_1", status } } };
    await hook();
    expect(calls[0]).toMatchObject({ op: "update", args: [{ plan }] });
  });

  it("downgrades on subscription.deleted even if status looks active", async () => {
    event = { type: "customer.subscription.deleted", data: { object: { customer: "cus_1", status: "active" } } };
    await hook();
    expect(calls[0]).toMatchObject({ op: "update", args: [{ plan: "free" }] });
  });

  it("returns 500 when the database write fails so Stripe retries", async () => {
    dbError = { message: "boom" };
    event = { type: "checkout.session.completed", data: { object: { mode: "subscription", payment_status: "paid", client_reference_id: "u1", customer: "cus_1" } } };
    expect((await hook()).status).toBe(500);
  });

  it("takes the 3 months back once when a pass is fully refunded", async () => {
    event = { type: "charge.refunded", data: { object: { refunded: true, payment_intent: "pi_1" } } };
    piRetrieve.mockResolvedValueOnce({ id: "pi_1", metadata: { user_id: "u1", plan: "pass", pass_applied: "yes" } });
    expect((await hook()).status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("shorten_pro_pass", { p_uid: "u1", p_months: 3 });
    piRetrieve.mockResolvedValueOnce({ id: "pi_1", metadata: { user_id: "u1", plan: "pass", pass_applied: "yes", pass_refunded: "yes" } });
    await hook();
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("ignores partial refunds and refunds of other payments", async () => {
    event = { type: "charge.refunded", data: { object: { refunded: false, payment_intent: "pi_1" } } };
    piRetrieve.mockResolvedValue({ id: "pi_1", metadata: { user_id: "u1", plan: "pass", pass_applied: "yes" } });
    await hook();
    event = { type: "charge.refunded", data: { object: { refunded: true, payment_intent: "pi_3" } } };
    piRetrieve.mockResolvedValue({ id: "pi_3", metadata: { user_id: "u1", plan: "monthly" } });
    await hook();
    expect(rpc).not.toHaveBeenCalled();
  });

  it("finds the user from subscription metadata when present", async () => {
    event = { type: "customer.subscription.updated", data: { object: { customer: "cus_1", status: "canceled", metadata: { user_id: "u9" } } } };
    await hook();
    expect(calls[0]).toMatchObject({ op: "update", args: [{ plan: "free" }] });
    expect(calls[1]).toMatchObject({ op: "eq", args: ["id", "u9"] });
  });

  it("ignores unrelated events", async () => {
    event = { type: "invoice.paid", data: { object: {} } };
    expect((await hook()).status).toBe(200);
    expect(calls).toHaveLength(0);
  });
});

describe("account deletion", () => {
  const del = () => deleteAccount(new Request("http://x/api/account", { method: "DELETE" }));

  it("cancels live subscriptions before deleting data", async () => {
    profileRow = { stripe_customer_id: "cus_1" };
    subsList.mockResolvedValue({ data: [{ id: "sub_a", status: "active" }, { id: "sub_b", status: "canceled" }] });
    const res = await del();
    expect(res.status).toBe(200);
    expect(subsCancel).toHaveBeenCalledTimes(1);
    expect(subsCancel).toHaveBeenCalledWith("sub_a");
  });

  it("does not delete anything if cancelling fails", async () => {
    profileRow = { stripe_customer_id: "cus_1" };
    subsList.mockRejectedValue(new Error("stripe down"));
    const res = await del();
    expect(res.status).toBe(502);
    expect(calls.some((c) => c.op === "delete")).toBe(false);
  });

  it("deletes data tables for users without a subscription", async () => {
    const res = await del();
    expect(res.status).toBe(200);
    expect(calls.filter((c) => c.op === "delete").map((c) => c.table)).toEqual(["user_data", "usage", "ai_usage"]);
  });
});

describe("checkout", () => {
  const buy = (body: unknown) => checkout(new Request("http://x/api/stripe/checkout", { method: "POST", body: JSON.stringify(body) }));
  const ok = { payerAdult: true, startNow: true, acceptTerms: true };
  beforeEach(() => {
    vi.stubEnv("STRIPE_PRICE_MONTHLY", "price_month");
    vi.stubEnv("STRIPE_PRICE_PASS", "price_pass");
  });

  it("refuses without all three confirmations", async () => {
    expect((await buy({ plan: "pass", payerAdult: true, startNow: true })).status).toBe(400);
    expect((await buy({ plan: "pass", ...ok, payerAdult: false })).status).toBe(400);
    expect((await buy({ plan: "lifetime", ...ok })).status).toBe(400);
    expect(sessionCreate).not.toHaveBeenCalled();
  });

  it("sells the pass as a one-off payment and records consent", async () => {
    const res = await buy({ plan: "pass", ...ok });
    expect(res.status).toBe(200);
    const arg = sessionCreate.mock.calls[0][0];
    expect(arg).toMatchObject({ mode: "payment", line_items: [{ price: "price_pass", quantity: 1 }], client_reference_id: "u1" });
    expect(arg.metadata).toMatchObject({ plan: "pass", payer_adult_confirmed: "yes", immediate_start_requested: "yes", terms_accepted: "yes" });
    expect(arg.payment_intent_data.metadata.user_id).toBe("u1");
  });

  it("sells monthly as a subscription", async () => {
    await buy({ plan: "monthly", ...ok });
    expect(sessionCreate.mock.calls[0][0]).toMatchObject({ mode: "subscription", line_items: [{ price: "price_month", quantity: 1 }] });
  });

  it("asks Stripe for live subscriptions before selling another", async () => {
    profileRow = { plan: "free", pro_until: null, stripe_customer_id: "cus_1" };
    subsList.mockResolvedValueOnce({ data: [{ id: "sub_1", status: "active" }] });
    expect((await buy({ plan: "monthly", ...ok })).status).toBe(409);
    subsList.mockResolvedValueOnce({ data: [{ id: "sub_1", status: "canceled" }] });
    expect((await buy({ plan: "monthly", ...ok })).status).toBe(200);
  });

  it("blocks overlapping purchases", async () => {
    profileRow = { plan: "pro", pro_until: null };
    expect((await buy({ plan: "pass", ...ok })).status).toBe(409);
    profileRow = { plan: "free", pro_until: new Date(Date.now() + 30 * 86_400_000).toISOString() };
    expect((await buy({ plan: "monthly", ...ok })).status).toBe(409);
    expect((await buy({ plan: "pass", ...ok })).status).toBe(200);
  });
});
