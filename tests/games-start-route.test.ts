import { beforeEach, describe, expect, it, vi } from "vitest";

const consumeGame = vi.fn();
vi.mock("@/lib/server/usage", () => ({ consumeGame: (...a: unknown[]) => consumeGame(...a) }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: async () => true }));

import { POST } from "@/app/api/games/start/route";

const call = () => POST(new Request("http://x/api/games/start", { method: "POST" }));

beforeEach(() => consumeGame.mockReset());

describe("POST /api/games/start", () => {
  it("lets a round start while the free allowance lasts", async () => {
    consumeGame.mockResolvedValue({ ok: true });
    const res = await call();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("refuses with 402 and the reason once the allowance is used up, so the page can offer Pro", async () => {
    consumeGame.mockResolvedValue({ ok: false, status: 402, error: "You've used your free game round." });
    const res = await call();
    expect(res.status).toBe(402);
    expect((await res.json()).error).toMatch(/free game round/);
  });

  it("needs sign-in when limits are on", async () => {
    consumeGame.mockResolvedValue({ ok: false, status: 401, error: "Create a free account to play practice games." });
    expect((await call()).status).toBe(401);
  });
});
