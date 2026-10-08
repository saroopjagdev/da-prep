import { beforeEach, describe, expect, it, vi } from "vitest";

const enforced = vi.fn();
const userFromRequest = vi.fn();
const rows: Record<string, unknown> = {};
const table = (name: string) => ({
  select: () => ({
    eq: () => ({
      eq: () => ({ maybeSingle: async () => ({ data: rows[name] ?? null }) }),
      maybeSingle: async () => ({ data: rows[name] ?? null }),
    }),
  }),
});
vi.mock("@/lib/server/guard", () => ({ limitsEnforced: () => enforced() }));
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ from: (n: string) => table(n) }), userFromRequest: (...a: unknown[]) => userFromRequest(...a) }));

import { GET } from "@/app/api/usage/route";

const call = () => GET(new Request("http://x/api/usage"));

beforeEach(() => {
  enforced.mockReset().mockReturnValue(true);
  userFromRequest.mockReset().mockResolvedValue({ id: "u1" });
  for (const k of Object.keys(rows)) delete rows[k];
});

describe("GET /api/usage", () => {
  it("needs a signed-in user when limits are on", async () => {
    userFromRequest.mockResolvedValue(null);
    expect((await call()).status).toBe(401);
  });

  it("reports nothing to count when limits are off", async () => {
    enforced.mockReturnValue(false);
    expect(await (await call()).json()).toEqual({ plan: "free", enforced: false });
  });

  it("returns what the free plan has used and its limits", async () => {
    // The week's row holds the interview, review and practice counts.
    rows.usage = { interviews: 1, reviews: 2, practice: 1 };
    rows.profiles = { plan: "free" };
    const body = await (await call()).json();
    expect(body).toMatchObject({ plan: "free", enforced: true, interviews: { used: 1, limit: 1 }, reviews: { used: 2, limit: 2 }, practice: { used: 1, limit: 2 } });
  });

  it("offers the free trial once: only to accounts that never had one or subscribed", async () => {
    rows.profiles = { plan: "free" };
    expect((await (await call()).json()).trial).toEqual({ eligible: true, used: false });
    rows.profiles = { plan: "free", trial_used: true };
    expect((await (await call()).json()).trial).toEqual({ eligible: false, used: true });
    rows.profiles = { plan: "free", stripe_customer_id: "cus_1" };
    expect((await (await call()).json()).trial.eligible).toBe(false);
  });

  it("reports when a running trial ends, and nothing once it is over", async () => {
    const ends = new Date(Date.now() + 3_600_000).toISOString();
    rows.profiles = { plan: "pro", trial_used: true, trial_ends_at: ends };
    expect(await (await call()).json()).toEqual({ plan: "pro", enforced: true, trial: { eligible: false, used: true, endsAt: ends } });
    rows.profiles = { plan: "pro", trial_used: true, trial_ends_at: new Date(Date.now() - 1000).toISOString() };
    expect(await (await call()).json()).toEqual({ plan: "pro", enforced: true });
  });

  it("gives Pro no fixed allowance", async () => {
    rows.profiles = { plan: "pro" };
    expect(await (await call()).json()).toEqual({ plan: "pro", enforced: true });
  });
});
