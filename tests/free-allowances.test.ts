import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
vi.mock("@/lib/server/guard", () => ({ limitsEnforced: () => true }));
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc: (...a: unknown[]) => rpc(...a) }), userFromRequest: async () => ({ id: "u1" }) }));

import { FREE_INTERVIEWS, FREE_MOCK_PROCESSES, FREE_PERIOD } from "@/lib/plans";
import { consumeInterview, consumeMockProcess } from "@/lib/server/usage";

const req = new Request("http://x/api");

beforeEach(() => rpc.mockReset().mockResolvedValue({ data: true, error: null }));

describe("free AI allowances", () => {
  it("gives free accounts two marked mock interviews in total, not per week", async () => {
    expect(FREE_INTERVIEWS).toBe(2);
    await consumeInterview(req);
    expect(rpc).toHaveBeenCalledWith("consume_interview", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 2 });
  });

  it("keeps whole firm mock processes for Pro, whatever the interview allowance is", async () => {
    expect(FREE_MOCK_PROCESSES).toBe(0);
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await consumeMockProcess(req);
    expect(rpc).toHaveBeenCalledWith("consume_interview", { p_uid: "u1", p_period: FREE_PERIOD, p_limit: 0 });
    expect(res).toMatchObject({ ok: false, status: 402 });
    expect((res as { error: string }).error).toMatch(/part of Pro/);
  });

  it("says when the free interviews are used, without promising a reset", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await consumeInterview(req);
    expect(res).toMatchObject({ ok: false, status: 402 });
    expect((res as { error: string }).error).toMatch(/used your 2 free mock interviews/);
    expect((res as { error: string }).error).not.toMatch(/Monday|this week/);
  });
});
