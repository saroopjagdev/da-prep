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

  it("gives Pro no fixed allowance", async () => {
    rows.profiles = { plan: "pro" };
    expect(await (await call()).json()).toEqual({ plan: "pro", enforced: true });
  });
});
