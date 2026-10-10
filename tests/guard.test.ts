import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const userFromRequest = vi.fn();
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc }), userFromRequest: (...a: unknown[]) => userFromRequest(...a) }));

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

describe("clientIp", () => {
  it("prefers x-real-ip and uses the first forwarded hop", () => {
    expect(clientIp(req({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIp(req({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" }))).toBe("2.2.2.2");
    expect(clientIp(req())).toBe("local");
  });
});
