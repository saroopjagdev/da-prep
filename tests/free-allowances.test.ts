import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const upsert = vi.fn();
let counts: Record<string, unknown> | null = null;
vi.mock("@/lib/server/guard", () => ({ limitsEnforced: () => true }));
vi.mock("@/lib/server/auth", () => ({
  admin: () => ({
    rpc: (...a: unknown[]) => rpc(...a),
    from: () => ({
      select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: counts }) }) }) }),
      upsert: (...a: unknown[]) => upsert(...a),
    }),
  }),
  userFromRequest: async () => ({ id: "u1" }),
}));

import { BONUS_EXTRA, FREE_INTERVIEWS, FREE_MOCK_PROCESSES, FREE_PERIOD, FREE_PRACTICE, FREE_REVIEWS } from "@/lib/plans";
import { consumeInterview, consumeMockProcess, consumePractice, consumeReview, markApplied } from "@/lib/server/usage";

const req = new Request("http://x/api");

beforeEach(() => {
  counts = null;
  rpc.mockReset().mockResolvedValue({ data: true, error: null });
  upsert.mockReset().mockResolvedValue({ error: null });
});

describe("free allowances", () => {
  it("gives free accounts one of each in total, not per week", async () => {
    expect([FREE_INTERVIEWS, FREE_PRACTICE, FREE_REVIEWS]).toEqual([1, 1, 1]);
    await consumeInterview(req);
    await consumePractice(req);
    await consumeReview(req);
    expect(rpc).toHaveBeenCalledWith("consume_interview", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 1 });
    expect(rpc).toHaveBeenCalledWith("consume_practice", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 1 });
    expect(rpc).toHaveBeenCalledWith("consume_review", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 1 });
  });

  it("keeps whole firm mock processes for Pro, bonus or not", async () => {
    expect(FREE_MOCK_PROCESSES).toBe(0);
    counts = { applied: true, interviews: 1, practice: 1 };
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await consumeMockProcess(req);
    expect(rpc).toHaveBeenCalledWith("consume_interview", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 0 });
    expect(res).toMatchObject({ ok: false, status: 402 });
    expect((res as { error: string }).error).toMatch(/part of Pro/);
  });

  it("says the free one is used, with how to unlock more, and no reset", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await consumeInterview(req);
    expect(res).toMatchObject({ ok: false, status: 402 });
    const error = (res as { error: string }).error;
    expect(error).toMatch(/used your free mock interview\./);
    expect(error).toMatch(/Apply to an employer through the tracker/);
    expect(error).not.toMatch(/Monday|this week/);
  });
});

describe("the engagement reward", () => {
  it("adds 2 more of each once the account has applied via the tracker, taken an interview and started a practice test", async () => {
    counts = { applied: true, interviews: 1, practice: 1 };
    await consumeInterview(req);
    await consumePractice(req);
    await consumeReview(req);
    for (const fn of ["consume_interview", "consume_practice", "consume_review"]) {
      expect(rpc).toHaveBeenCalledWith(fn, { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 1 + BONUS_EXTRA });
    }
  });

  it.each([
    ["has not applied via the tracker", { applied: false, interviews: 1, practice: 1 }],
    ["has not taken an interview", { applied: true, interviews: 0, practice: 1 }],
    ["has not started a practice test", { applied: true, interviews: 1, practice: 0 }],
    ["has done nothing yet", null],
  ])("does not unlock it when the account %s", async (_label, c) => {
    counts = c;
    await consumePractice(req);
    expect(rpc).toHaveBeenCalledWith("consume_practice", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 1 });
  });

  it("records the tracker click-through on the lifetime row, once per account", async () => {
    expect(await markApplied(req)).toEqual({ ok: true });
    expect(upsert).toHaveBeenCalledWith({ user_id: "u1", period: FREE_PERIOD, applied: true }, { onConflict: "user_id,period" });
  });

  it("reports a failed save", async () => {
    upsert.mockResolvedValue({ error: { message: "boom" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await markApplied(req)).toMatchObject({ ok: false, status: 500 });
  });
});
