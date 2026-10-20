import { beforeEach, describe, expect, it, vi } from "vitest";

const userFromRequest = vi.fn();
const tables: Record<string, unknown[]> = {};
const query = (name: string) => {
  const q: Record<string, unknown> = {};
  for (const m of ["select", "gte", "order"]) q[m] = () => q;
  q.range = async () => ({ data: tables[name] ?? [], error: null });
  return q;
};
vi.mock("@/lib/server/auth", () => ({
  admin: () => ({ from: (n: string) => query(n), auth: { admin: { getUserById: async (id: string) => ({ data: { user: { email: `${id}@x.test` } } }) } } }),
  userFromRequest: (...a: unknown[]) => userFromRequest(...a),
}));

import { GET } from "@/app/api/admin/stats/route";
import { isAdminEmail } from "@/lib/server/admin-access";

const call = () => GET(new Request("http://x/api/admin/stats?days=30"));
const confirmed = (email: string) => ({ id: "u", email, email_confirmed_at: "2026-01-01" });

beforeEach(() => {
  userFromRequest.mockReset();
  tables.funnel_daily = [{ day: "2026-10-19", event: "visit_home", source: "tiktok", campaign: "bio", n: 3 }];
  tables.profiles = [
    { id: "a", plan: "pro", stripe_customer_id: "cus_1", created_at: "2026-10-01T00:00:00Z" },
    { id: "b", plan: "free", stripe_customer_id: null, created_at: "2026-10-02T00:00:00Z" },
    { id: "c", plan: "free", stripe_customer_id: "cus_2", created_at: "2026-10-03T00:00:00Z" },
  ];
});

describe("admin access", () => {
  it("matches the two admin emails regardless of case", () => {
    expect(isAdminEmail("SSJagdev@outlook.com")).toBe(true);
    expect(isAdminEmail("benhumphreys15@gmail.com")).toBe(true);
    expect(isAdminEmail("saroopjagdev@gmail.com")).toBe(true);
    expect(isAdminEmail("saroopjagdev@gmail.com.evil.test")).toBe(false);
    expect(isAdminEmail("someone@else.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});

describe("GET /api/admin/stats", () => {
  it("cannot be widened by an ADMIN_EMAILS environment variable", () => {
    vi.stubEnv("ADMIN_EMAILS", "someone@else.com");
    expect(isAdminEmail("someone@else.com")).toBe(false);
    vi.unstubAllEnvs();
  });

  it("is a 404 for signed-out people, other users, and unconfirmed admin emails", async () => {
    userFromRequest.mockResolvedValue(null);
    expect((await call()).status).toBe(404);
    userFromRequest.mockResolvedValue(confirmed("someone@else.com"));
    expect((await call()).status).toBe(404);
    userFromRequest.mockResolvedValue({ id: "u", email: "ssjagdev@outlook.com", email_confirmed_at: null });
    expect((await call()).status).toBe(404);
  });

  it("gives an admin the funnel, signups and the users with a Stripe customer id", async () => {
    userFromRequest.mockResolvedValue(confirmed("benhumphreys15@gmail.com"));
    const res = await call();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totals).toEqual({ accounts: 3, pro: 1, everPaid: 2 });
    expect(body.paying.map((p: { email: string; plan: string }) => [p.email, p.plan])).toEqual([
      ["a@x.test", "pro"],
      ["c@x.test", "free"],
    ]);
    expect(body.funnel[0]).toMatchObject({ source: "tiktok", campaign: "bio", n: 3 });
  });
});
