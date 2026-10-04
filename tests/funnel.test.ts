import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const limited = vi.fn();
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc: (...a: unknown[]) => rpc(...a) }) }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: (...a: unknown[]) => limited(...a) }));

import { POST } from "@/app/api/event/route";
import { FUNNEL_EVENTS, isFunnelEvent, track } from "@/lib/funnel";

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(new Request("http://x/api/event", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) }));

beforeEach(() => {
  rpc.mockReset().mockResolvedValue({ error: null });
  limited.mockReset().mockResolvedValue(true);
});

describe("POST /api/event", () => {
  it("counts a known step against today's date and nothing else", async () => {
    const res = await post({ event: "link_sent", userId: "u1", email: "a@b.c" }, { "x-forwarded-for": "203.0.113.9", cookie: "x=1" });
    expect(res.status).toBe(204);
    expect(rpc).toHaveBeenCalledTimes(1);
    const [fn, args] = rpc.mock.calls[0];
    expect(fn).toBe("bump_funnel");
    expect(Object.keys(args).sort()).toEqual(["p_day", "p_event"]);
    expect(args.p_event).toBe("link_sent");
    expect(args.p_day).toBe(new Date().toISOString().slice(0, 10));
  });

  it("refuses anything that is not on the list", async () => {
    for (const bad of [{ event: "page_view" }, { event: "" }, { event: 5 }, {}, null]) {
      expect((await post(bad)).status, JSON.stringify(bad)).toBe(400);
    }
    expect(rpc).not.toHaveBeenCalled();
  });

  it("is rate limited", async () => {
    limited.mockResolvedValue(false);
    expect((await post({ event: "landing_view" })).status).toBe(429);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("never shows a counting problem to the page", async () => {
    rpc.mockResolvedValue({ error: { message: "relation does not exist" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post({ event: "landing_view" })).status).toBe(204);
  });
});

describe("the list of steps", () => {
  it("is small and fixed", () => {
    expect(FUNNEL_EVENTS).toHaveLength(7);
    expect(isFunnelEvent("signed_in")).toBe(true);
    expect(isFunnelEvent("anything_else")).toBe(false);
  });
});

describe("track()", () => {
  it("sends only the event name, once per load when asked, and stores nothing", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const setItem = vi.fn();
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { setItem });
    track("landing_view", { oncePerLoad: true });
    track("landing_view", { oncePerLoad: true });
    track("hero_try_practice");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ event: "landing_view" });
    expect(setItem).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
