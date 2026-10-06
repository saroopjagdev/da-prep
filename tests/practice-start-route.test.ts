import { beforeEach, describe, expect, it, vi } from "vitest";

const enforced = vi.fn();
const userFromRequest = vi.fn();
const rpc = vi.fn();
vi.mock("@/lib/server/guard", () => ({ limitsEnforced: () => enforced(), clientIp: () => "1.2.3.4" }));
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc: (...a: unknown[]) => rpc(...a) }), userFromRequest: (...a: unknown[]) => userFromRequest(...a) }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: async () => true }));

import { POST } from "@/app/api/practice/start/route";

const call = () => POST(new Request("http://x/api/practice/start", { method: "POST" }));

beforeEach(() => {
  enforced.mockReset().mockReturnValue(true);
  userFromRequest.mockReset().mockResolvedValue({ id: "u1" });
  rpc.mockReset().mockResolvedValue({ data: true, error: null });
});

describe("POST /api/practice/start", () => {
  it("counts a test for a signed-in person against this week's limit of two", async () => {
    const res = await call();
    expect(res.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("consume_practice", expect.objectContaining({ p_uid: "u1", p_limit: 2, p_period: expect.stringMatching(/^\d{4}-W\d{2}$/) }));
  });

  it("asks for an account when nobody is signed in", async () => {
    userFromRequest.mockResolvedValue(null);
    const res = await call();
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/free account/);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("refuses with a reason once the free tests are used", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await call();
    expect(res.status).toBe(402);
    expect((await res.json()).error).toMatch(/2 free practice tests/);
  });

  it("counts nothing when limits are off", async () => {
    enforced.mockReturnValue(false);
    expect((await call()).status).toBe(200);
    expect(rpc).not.toHaveBeenCalled();
  });
});
