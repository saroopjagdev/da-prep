import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const limited = vi.fn();
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc: (...a: unknown[]) => rpc(...a) }) }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: (...a: unknown[]) => limited(...a) }));

import { POST } from "@/app/api/event/route";
import { FUNNEL_EVENTS, SOURCES, campaignFrom, cleanCampaign, entryEvent, isFunnelEvent, isSource, sourceFrom, track } from "@/lib/funnel";

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
    expect(Object.keys(args).sort()).toEqual(["p_campaign", "p_day", "p_event", "p_source"]);
    expect(args.p_event).toBe("link_sent");
    expect(args.p_source).toBe("other"); // none was sent
    expect(args.p_day).toBe(new Date().toISOString().slice(0, 10));
  });

  it("keeps a source from the list and files anything else under other", async () => {
    await post({ event: "visit_employer", source: "tiktok" });
    await post({ event: "visit_employer", source: "evil-<script>" });
    await post({ event: "visit_employer", source: 5 });
    expect(rpc.mock.calls.map(([, a]) => a.p_source)).toEqual(["tiktok", "other", "other"]);
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
    expect(FUNNEL_EVENTS).toHaveLength(23);
    expect(new Set(FUNNEL_EVENTS).size).toBe(FUNNEL_EVENTS.length);
    expect(isFunnelEvent("signed_in")).toBe(true);
    expect(isFunnelEvent("anything_else")).toBe(false);
  });
});

describe("track()", () => {
  it("sends only the event name and a source label, once per load when asked, and stores nothing", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const setItem = vi.fn();
    vi.stubGlobal("window", { location: { search: "?utm_source=school", hostname: "www.level6.uk", pathname: "/" } });
    vi.stubGlobal("document", { referrer: "https://www.google.com/" });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { setItem });
    track("landing_view", { oncePerLoad: true });
    track("landing_view", { oncePerLoad: true });
    track("hero_try_practice");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ event: "landing_view", source: "school", campaign: "" });
    expect(setItem).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe("traffic source", () => {
  const own = "www.level6.uk";
  it("prefers a utm_source on the link when it is on the list, and files unknown ones under other", () => {
    expect(sourceFrom("https://www.google.com/", "?utm_source=school", own)).toBe("school");
    expect(sourceFrom("", "?utm_source=TikTok", own)).toBe("tiktok");
    expect(sourceFrom("", "?utm_source=made-up-thing", own)).toBe("other");
    expect(sourceFrom("", "?utm_source=share", own)).toBe("share");
  });

  it("reads the referrer's host for the big channels", () => {
    expect(sourceFrom("https://www.google.co.uk/search?q=x", "", own)).toBe("google");
    expect(sourceFrom("https://www.bing.com/", "", own)).toBe("bing");
    expect(sourceFrom("https://www.tiktok.com/@x", "", own)).toBe("tiktok");
    expect(sourceFrom("https://l.instagram.com/?u=x", "", own)).toBe("instagram");
    expect(sourceFrom("https://www.reddit.com/r/x", "", own)).toBe("reddit");
    expect(sourceFrom("https://lnkd.in/abc", "", own)).toBe("linkedin");
    expect(sourceFrom("https://www.thestudentroom.co.uk/forum", "", own)).toBe("studentroom");
    expect(sourceFrom("https://some-school.example.org/careers", "", own)).toBe("other");
  });

  it("treats no referrer, our own site and a malformed referrer as direct", () => {
    expect(sourceFrom("", "", own)).toBe("direct");
    expect(sourceFrom("https://www.level6.uk/employers/airbus", "", own)).toBe("direct");
    expect(sourceFrom("not a url", "", own)).toBe("direct");
  });

  it("does not mistake look-alike hosts for a channel", () => {
    expect(sourceFrom("https://notgoogle.example.com/", "", own)).toBe("other");
    expect(sourceFrom("https://tiktok.com.evil.example/", "", own)).toBe("other");
  });

  it("has a fixed, duplicate-free list of sources that includes the fallbacks", () => {
    expect(new Set(SOURCES).size).toBe(SOURCES.length);
    for (const s of ["direct", "other", "share"]) expect(isSource(s)).toBe(true);
    expect(isSource("evil")).toBe(false);
  });

  it("says which kind of page a visit began on", () => {
    expect(entryEvent("/")).toBe("visit_home");
    expect(entryEvent("/employers/airbus")).toBe("visit_employer");
    expect(entryEvent("/learn/hirevue")).toBe("visit_guide");
    expect(entryEvent("/deadlines")).toBe("visit_guide");
    expect(entryEvent("/tests/shl-numerical")).toBe("visit_tool");
    expect(entryEvent("/opportunities")).toBe("visit_tool");
    expect(entryEvent("/terms")).toBe("visit_other");
  });

  it("includes the new steps in the event list", () => {
    for (const e of ["pricing_view", "limit_hit", "checkout_start", "apply_click", "share_click", "visit_employer"]) expect(isFunnelEvent(e)).toBe(true);
  });
});

describe("campaign label", () => {
  it("is read from utm_campaign and cleaned to a short harmless label", () => {
    expect(campaignFrom("?utm_source=tiktok&utm_campaign=Bio Link!")).toBe("bio-link");
    expect(campaignFrom("?utm_campaign=<script>x</script>")).toBe("script-x-script");
    expect(campaignFrom("?utm_campaign=" + "a".repeat(100))).toHaveLength(40);
    expect(campaignFrom("")).toBe("");
    expect(cleanCampaign(5)).toBe("");
  });

  it("is counted with the step, and falls back to the old function if the migration is not applied yet", async () => {
    await post({ event: "visit_home", source: "tiktok", campaign: "Video 3" });
    expect(rpc.mock.calls[0][1]).toMatchObject({ p_source: "tiktok", p_campaign: "video-3" });
    rpc.mockReset().mockResolvedValueOnce({ error: { message: "no function" } }).mockResolvedValueOnce({ error: null });
    expect((await post({ event: "visit_home", source: "tiktok", campaign: "x" })).status).toBe(204);
    expect(rpc.mock.calls[1][1]).toEqual({ p_day: expect.any(String), p_event: "visit_home", p_source: "tiktok" });
  });
});
