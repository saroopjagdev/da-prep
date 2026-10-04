import { describe, expect, it, vi } from "vitest";
import { TESTS } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { homeStats, openNow } from "@/lib/home";
import { LOCAL_COLLECTIONS, RETURNING_HINT_SCRIPT, hasLocalActivity, shouldShowDashboard } from "@/lib/home-gate";
import { ALL_MOCKS } from "@/lib/mockprocess/definitions";
import { opportunityRows } from "@/lib/opportunities";
import { FREE_INTERVIEWS, FREE_REVIEWS } from "@/lib/plans";
import { streak } from "@/components/HomeDashboard";

const store = (o: Record<string, string>) => (k: string) => o[k] ?? null;

describe("who gets the dashboard", () => {
  it("is signed-in users and anyone with saved activity, nobody else", () => {
    expect(shouldShowDashboard({ signedIn: true, localActivity: false })).toBe(true);
    expect(shouldShowDashboard({ signedIn: false, localActivity: true })).toBe(true);
    expect(shouldShowDashboard({ signedIn: false, localActivity: false })).toBe(false);
  });

  it("counts a saved list only when it has something in it", () => {
    expect(hasLocalActivity(store({}))).toBe(false);
    expect(hasLocalActivity(store({ "da-prep:practice": "[]" }))).toBe(false);
    expect(hasLocalActivity(store({ "da-prep:practice": "not json" }))).toBe(false);
    expect(hasLocalActivity(store({ "da-prep:practice": '[{"id":"1"}]' }))).toBe(true);
    for (const c of LOCAL_COLLECTIONS) expect(hasLocalActivity(store({ [`da-prep:${c}`]: '[{"id":"1"}]' })), c).toBe(true);
    // Picking a sector alone is not activity.
    expect(hasLocalActivity(store({ "da-prep:sector": "finance" }))).toBe(false);
  });
});

describe("the pre-paint hint script", () => {
  function run(storage: Record<string, string>, search = "") {
    const attrs: Record<string, string> = {};
    const fake = new Proxy(
      { getItem: (k: string) => storage[k] ?? null },
      { ownKeys: () => ["getItem", ...Object.keys(storage)], getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }) },
    );
    new Function("localStorage", "document", "location", RETURNING_HINT_SCRIPT)(
      fake,
      { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } },
      { search },
    );
    return attrs["data-returning"];
  }

  it("marks a returning visitor (saved session or saved activity) and nobody else", () => {
    expect(run({})).toBeUndefined();
    expect(run({ "da-prep:sector": "finance" })).toBeUndefined();
    expect(run({ "sb-abc-auth-token": "{}" })).toBe("1");
    expect(run({ "da-prep:practice": '[{"id":"1"}]' })).toBe("1");
    expect(run({ "da-prep:practice": "[]" })).toBeUndefined();
  });

  it("lets /?pitch=1 show the pitch to a returning visitor", () => {
    expect(run({ "sb-abc-auth-token": "{}" }, "?pitch=1")).toBeUndefined();
  });

  it("does nothing when storage is blocked", () => {
    const blocked = new Proxy({}, { ownKeys: () => { throw new Error("blocked"); } });
    expect(() => new Function("localStorage", "document", "location", RETURNING_HINT_SCRIPT)(blocked, { documentElement: { setAttribute: vi.fn() } }, { search: "" })).not.toThrow();
  });
});

describe("home numbers are counted, not typed", () => {
  it("matches the data", () => {
    const s = homeStats();
    expect(s.guides).toBe(FIRMS.filter((f) => f.slug !== "civil-service-fast-track").length);
    expect(s.mocks).toBe(ALL_MOCKS.length);
    expect(s.tests).toBe(TESTS.length);
    expect(s.employers).toBe(opportunityRows().length);
    expect(s.guides).toBeGreaterThan(30);
  });

  it("lists only employers that are open now and have a guide", () => {
    const today = new Date("2026-10-10T12:00:00Z");
    const rows = opportunityRows(today);
    const list = openNow(today);
    expect(list.length).toBeGreaterThan(0);
    for (const o of list) expect(rows.find((x) => x.slug === o.slug)?.status, o.name).toBe("open");
  });

  it("has one definition of the free allowance", () => {
    expect(FREE_INTERVIEWS).toBe(2);
    expect(FREE_REVIEWS).toBe(2);
  });
});

describe("streak", () => {
  const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  it("counts consecutive days back from today or yesterday", () => {
    expect(streak([])).toBe(0);
    expect(streak([iso(0), iso(1), iso(2)])).toBe(3);
    expect(streak([iso(1), iso(2)])).toBe(2);
    expect(streak([iso(3)])).toBe(0);
  });
});
