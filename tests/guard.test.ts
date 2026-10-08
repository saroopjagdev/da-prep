import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const userFromRequest = vi.fn();
let trialEndsAt: string | null = null;
vi.mock("@/lib/server/auth", () => ({
  admin: () => ({ rpc, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { trial_ends_at: trialEndsAt } }) }) }) }) }),
  userFromRequest: (...a: unknown[]) => userFromRequest(...a) }));

import { clientIp, guardAi } from "@/lib/server/guard";

const req = (headers: Record<string, string> = {}) => new Request("http://x/api", { method: "POST", headers });

describe("guardAi", () => {
  beforeEach(() => {
    rpc.mockReset();
    userFromRequest.mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("allows anonymous callers when limits are not enforced", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "false");
    expect((await guardAi(req(), "t-open")).ok).toBe(true);
  });

  it("rejects anonymous callers with 401 when enforced", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "true");
    userFromRequest.mockResolvedValue(null);
    const g = await guardAi(req(), "t-anon");
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(401);
  });

  it("returns 429 once the daily budget is spent", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "true");
    userFromRequest.mockResolvedValue({ id: "u1" });
    rpc.mockResolvedValue({ data: false, error: null });
    const g = await guardAi(req(), "t-budget");
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(429);
  });

  it("allows a signed-in user within budget", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "true");
    userFromRequest.mockResolvedValue({ id: "u2" });
    rpc.mockResolvedValue({ data: true, error: null });
    expect((await guardAi(req(), "t-ok")).ok).toBe(true);
  });

  it("rate limits per user", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "true");
    userFromRequest.mockResolvedValue({ id: "u3" });
    rpc.mockResolvedValue({ data: true, error: null });
    expect((await guardAi(req(), "t-rl", 1)).ok).toBe(true);
    const second = await guardAi(req(), "t-rl", 1);
    expect(second.ok).toBe(false);
  });
});

describe("guardAi during the free trial of Pro", () => {
  beforeEach(() => {
    rpc.mockReset().mockResolvedValue({ data: true, error: null });
    userFromRequest.mockReset().mockResolvedValue({ id: "trial-user" });
    vi.stubEnv("ENFORCE_LIMITS", "true");
  });
  afterEach(() => {
    trialEndsAt = null;
    vi.unstubAllEnvs();
  });
  const future = () => new Date(Date.now() + 3_600_000).toISOString();

  it("uses the lower daily total on a trial and the normal total otherwise", async () => {
    trialEndsAt = future();
    await guardAi(req(), "t-trial-total");
    expect(rpc).toHaveBeenLastCalledWith("consume_ai_call", expect.objectContaining({ p_limit: 60 }));
    trialEndsAt = new Date(Date.now() - 1000).toISOString(); // trial over: back to normal Pro fair use
    await guardAi(req(), "t-trial-total");
    expect(rpc).toHaveBeenLastCalledWith("consume_ai_call", expect.objectContaining({ p_limit: 150 }));
    trialEndsAt = null;
    await guardAi(req(), "t-trial-total");
    expect(rpc).toHaveBeenLastCalledWith("consume_ai_call", expect.objectContaining({ p_limit: 150 }));
  });

  it("caps marked interviews at 5 a day on a trial, below the normal 25", async () => {
    trialEndsAt = future();
    userFromRequest.mockResolvedValue({ id: "trial-cap-user" });
    for (let i = 0; i < 5; i++) expect((await guardAi(req(), "score", 100, 25)).ok).toBe(true);
    const sixth = await guardAi(req(), "score", 100, 25);
    expect(sixth.ok).toBe(false);
    if (!sixth.ok) expect(sixth.response.status).toBe(429);
  });

  it("leaves the normal 25 a day for Pro members who are not on a trial", async () => {
    userFromRequest.mockResolvedValue({ id: "pro-cap-user" });
    for (let i = 0; i < 6; i++) expect((await guardAi(req(), "score", 100, 25)).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("prefers x-real-ip and uses the first forwarded hop", () => {
    expect(clientIp(req({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIp(req({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" }))).toBe("2.2.2.2");
    expect(clientIp(req())).toBe("local");
  });
});
