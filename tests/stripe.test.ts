import { beforeEach, describe, expect, it, vi } from "vitest";

let event: unknown;
let badSig = false;
const subsList = vi.fn();
const subsCancel = vi.fn();
const sessionCreate = vi.fn();
const priceRetrieve = vi.fn();
vi.mock("stripe", () => ({
  default: class {
    webhooks = {
      constructEvent: () => {
        if (badSig) throw new Error("bad");
        return event;
      },
    };
    subscriptions = { list: subsList, cancel: subsCancel };
    checkout = { sessions: { create: sessionCreate } };
    prices = { retrieve: priceRetrieve };
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
const fakeDb = {
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
const goodPrice = { id: "price_pro", active: true, unit_amount: 999, currency: "gbp", recurring: { interval: "month" } };

beforeEach(() => {
  calls.length = 0;
  dbError = null;
  badSig = false;
  profileRow = null;
  subsList.mockReset();
  subsCancel.mockReset();
  sessionCreate.mockReset();
  sessionCreate.mockResolvedValue({ url: "https://checkout.stripe.test/s" });
  priceRetrieve.mockReset();
  priceRetrieve.mockResolvedValue(goodPrice);
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
    event = { type: "checkout.session.completed", data: { object: { mode: "subscription", payment_status: "unpaid", client_reference_id: "u1", customer: "cus_1" } } };
    expect((await hook()).status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it("grants Pro when a bank-based payment succeeds later", async () => {
    event = { type: "checkout.session.async_payment_succeeded", data: { object: { mode: "subscription", payment_status: "paid", client_reference_id: "u1", customer: "cus_1" } } };
    await hook();
    expect(calls[0]).toMatchObject({ op: "upsert", args: [{ id: "u1", plan: "pro" }] });
  });

  it("never grants Pro for a one-off payment: only subscriptions are sold", async () => {
    event = { type: "checkout.session.completed", data: { object: { mode: "payment", payment_status: "paid", client_reference_id: "u1", customer: "cus_1" } } };
    expect((await hook()).status).toBe(200);
    expect(calls).toHaveLength(0);
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

  it("finds the user from subscription metadata when present", async () => {
    event = { type: "customer.subscription.updated", data: { object: { customer: "cus_1", status: "canceled", metadata: { user_id: "u9" } } } };
    await hook();
    expect(calls[0]).toMatchObject({ op: "update", args: [{ plan: "free" }] });
    expect(calls[1]).toMatchObject({ op: "eq", args: ["id", "u9"] });
  });

  it("ignores unrelated events, including refunds", async () => {
    for (const type of ["invoice.paid", "charge.refunded"]) {
      event = { type, data: { object: {} } };
      expect((await hook()).status).toBe(200);
    }
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
    vi.stubEnv("STRIPE_PRICE_ID", "price_pro");
    vi.stubEnv("STRIPE_PRICE_MONTHLY", "");
  });

  it("refuses without all three confirmations", async () => {
    expect((await buy({ payerAdult: true, startNow: true })).status).toBe(400);
    expect((await buy({ ...ok, payerAdult: false })).status).toBe(400);
    expect((await buy({})).status).toBe(400);
    expect(sessionCreate).not.toHaveBeenCalled();
  });

  it("sells the monthly subscription and records consent", async () => {
    const res = await buy(ok);
    expect(res.status).toBe(200);
    const arg = sessionCreate.mock.calls[0][0];
    expect(arg).toMatchObject({ mode: "subscription", line_items: [{ price: "price_pro", quantity: 1 }], client_reference_id: "u1" });
    expect(arg.metadata).toMatchObject({ plan: "monthly", payer_adult_confirmed: "yes", immediate_start_requested: "yes", terms_accepted: "yes" });
    expect(arg.subscription_data.metadata.user_id).toBe("u1");
  });

  it("is not configured without a price", async () => {
    vi.stubEnv("STRIPE_PRICE_ID", "");
    expect((await buy(ok)).status).toBe(503);
  });

  it.each([
    ["wrong amount (the old £17 price)", { ...goodPrice, unit_amount: 1700 }],
    ["wrong currency", { ...goodPrice, currency: "usd" }],
    ["one-off, not recurring", { ...goodPrice, recurring: null }],
    ["yearly, not monthly", { ...goodPrice, recurring: { interval: "year" } }],
    ["archived price", { ...goodPrice, active: false }],
  ])("refuses to take money when the Stripe price is a mismatch: %s", async (_name, price) => {
    priceRetrieve.mockResolvedValue(price);
    expect((await buy(ok)).status).toBe(503);
    expect(sessionCreate).not.toHaveBeenCalled();
  });

  it("refuses if the price cannot be read from Stripe", async () => {
    priceRetrieve.mockRejectedValue(new Error("no such price"));
    expect((await buy(ok)).status).toBe(503);
    expect(sessionCreate).not.toHaveBeenCalled();
  });

  it("asks Stripe for live subscriptions before selling another", async () => {
    profileRow = { plan: "free", stripe_customer_id: "cus_1" };
    subsList.mockResolvedValueOnce({ data: [{ id: "sub_1", status: "active" }] });
    expect((await buy(ok)).status).toBe(409);
    subsList.mockResolvedValueOnce({ data: [{ id: "sub_1", status: "canceled" }] });
    expect((await buy(ok)).status).toBe(200);
  });

  it("will not sell Pro to someone who already has it", async () => {
    profileRow = { plan: "pro" };
    expect((await buy(ok)).status).toBe(409);
    expect(sessionCreate).not.toHaveBeenCalled();
  });
});
