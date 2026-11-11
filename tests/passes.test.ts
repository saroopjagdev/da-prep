import { beforeEach, describe, expect, it, vi } from "vitest";

const calls: { op: string; args: unknown[] }[] = [];
let result: { data: { id: string }[] | null; error: { message: string } | null } = { data: [], error: null };
let hasAdmin = true;
const chain: Record<string, unknown> = {
  update: (...a: unknown[]) => (calls.push({ op: "update", args: a }), chain),
  eq: (...a: unknown[]) => (calls.push({ op: "eq", args: a }), chain),
  lt: (...a: unknown[]) => (calls.push({ op: "lt", args: a }), chain),
  select: async (...a: unknown[]) => (calls.push({ op: "select", args: a }), result),
};
vi.mock("@/lib/server/auth", () => ({ admin: () => (hasAdmin ? { from: () => chain } : null) }));

import { expirePasses } from "@/lib/server/passes";

beforeEach(() => {
  calls.length = 0;
  result = { data: [], error: null };
  hasAdmin = true;
});

describe("ending Season Passes", () => {
  it("moves Pro accounts whose end date has passed back to free, and says how many", async () => {
    result = { data: [{ id: "a" }, { id: "b" }], error: null };
    const now = new Date("2027-09-01T05:00:00Z");
    expect(await expirePasses(now)).toEqual({ expired: 2 });
    expect(calls).toEqual([
      { op: "update", args: [{ plan: "free", pro_until: null }] },
      { op: "eq", args: ["plan", "pro"] },
      { op: "lt", args: ["pro_until", now.toISOString()] },
      { op: "select", args: ["id"] },
    ]);
  });

  it("does nothing when accounts are not configured, and reports a failed update without throwing", async () => {
    hasAdmin = false;
    expect(await expirePasses()).toEqual({ expired: 0 });
    hasAdmin = true;
    result = { data: null, error: { message: "boom" } };
    expect(await expirePasses()).toEqual({ expired: 0, error: "boom" });
  });

  it("never throws, so it cannot stop the deadline emails that share the daily job", async () => {
    chain.update = () => {
      throw new Error("database down");
    };
    expect(await expirePasses()).toEqual({ expired: 0, error: "database down" });
  });
});
