import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";
import { FINANCE_CALENDAR, FINANCE_MYTHS } from "@/lib/finance";
import { PUBLIC_PATHS } from "@/lib/site";

// Every link must already appear in our research notes or firm profiles, so nothing is cited that wasn't researched.
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
const research = [...files("docs/research"), ...files("lib/firms"), "lib/directory.ts"].map((f) => readFileSync(f, "utf8")).join("\n");
const ALSO_CHECKED = new Set(["https://www.apprenticeships.gov.uk/apprentices"]); // confirmed by search on 2026-10-02

describe("finance calendar and myths", () => {
  const entries = FINANCE_CALENDAR.flatMap((m) => m.entries);

  it("has sourced entries that link to real firm guides", () => {
    expect(entries.length).toBeGreaterThan(15);
    const slugs = new Set(FIRMS.map((f) => f.slug));
    for (const e of entries) {
      expect(e.source, e.firm).toMatch(/^https:\/\/\S+$/);
      if (e.slug) expect(slugs.has(e.slug), e.slug).toBe(true);
    }
  });

  it("only cites links that are in our research", () => {
    const urls = [...entries.map((e) => e.source), ...FINANCE_MYTHS.flatMap((m) => m.sources.map((s) => s.href))];
    for (const u of urls) expect(research.includes(u) || ALSO_CHECKED.has(u), u).toBe(true);
  });

  it("gives every myth a reality and at least one source", () => {
    expect(FINANCE_MYTHS.length).toBeGreaterThanOrEqual(6);
    for (const m of FINANCE_MYTHS) {
      expect(m.reality.length, m.myth).toBeGreaterThan(60);
      expect(m.sources.length, m.myth).toBeGreaterThan(0);
    }
  });

  it("lists the finance pages in the sitemap", () => {
    for (const p of ["/sectors/finance/calendar", "/sectors/finance/myths"]) expect(PUBLIC_PATHS).toContain(p);
  });
});
