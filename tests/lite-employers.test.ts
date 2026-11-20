import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { FIRMS } from "@/lib/firms";
import { LITE_EMPLOYERS, liteByTrackerName } from "@/lib/lite-employers";
import { opportunityRows } from "@/lib/opportunities";
import { SITE_URL } from "@/lib/site";

describe("short employer pages", () => {
  it("have unique slugs that never clash with a researched guide", () => {
    expect(new Set(LITE_EMPLOYERS.map((l) => l.slug)).size).toBe(LITE_EMPLOYERS.length);
    for (const l of LITE_EMPLOYERS) expect(FIRMS.some((f) => f.slug === l.slug), l.slug).toBe(false);
  });

  it("state where and when each fact was read", () => {
    for (const l of LITE_EMPLOYERS) {
      expect(l.source.startsWith("https://"), l.slug).toBe(true);
      expect(l.checked, l.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(l.summary.length, l.slug).toBeGreaterThan(60);
      expect(l.programmes.length, l.slug).toBeGreaterThan(0);
    }
  });

  it("only call a programme degree level when the page named a degree, Level 6 or Level 7", () => {
    for (const l of LITE_EMPLOYERS.filter((x) => x.verdict === "degree" || x.verdict === "mixed")) {
      const text = JSON.stringify(l.programmes) + (l.qualification ?? "");
      expect(/degree|level 6|level 7|graduate apprentice/i.test(text), l.slug).toBe(true);
    }
  });

  it("never name a degree apprenticeship among the programmes of an employer marked as having none", () => {
    for (const l of LITE_EMPLOYERS.filter((x) => x.verdict === "not-degree")) {
      expect(/degree apprentice/i.test(l.programmes.map((p) => p.name).join(" ")), l.slug).toBe(false);
      expect(/no degree|did not find|not .*degree/i.test(l.summary), l.slug).toBe(true);
    }
  });

  it("match a tracker row, so the live dates show on the page", () => {
    const rows = opportunityRows(new Date());
    for (const l of LITE_EMPLOYERS) {
      expect(rows.some((r) => r.name === (l.trackerName ?? l.name)), l.slug).toBe(true);
      expect(liteByTrackerName(l.trackerName ?? l.name)?.slug).toBe(l.slug);
    }
  });

  it("appear in the employer directory, which lists every row with a page of ours", () => {
    const withPage = opportunityRows(new Date()).filter((r) => r.pageSlug).map((r) => r.pageSlug);
    for (const l of LITE_EMPLOYERS) expect(withPage, l.slug).toContain(l.slug);
    // The closed Civil Service Fast Track profile stays reachable by its address but is deliberately not listed as an opportunity.
    for (const f of FIRMS.filter((x) => x.slug !== "civil-service-fast-track")) expect(withPage, f.slug).toContain(f.slug);
  });

  it("are linked from their tracker rows and listed in the sitemap", () => {
    const rows = opportunityRows(new Date());
    const urls = sitemap().map((u) => u.url);
    for (const l of LITE_EMPLOYERS) {
      expect(rows.find((r) => r.name === (l.trackerName ?? l.name))?.pageSlug, l.slug).toBe(l.slug);
      expect(urls, l.slug).toContain(`${SITE_URL}/employers/${l.slug}`);
    }
  });
});
