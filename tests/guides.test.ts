import { describe, expect, it } from "vitest";
import { GUIDES, guideBySlug } from "@/lib/guides";

describe("guides", () => {
  it("have unique slugs and working related links", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const g of GUIDES) for (const r of g.related) expect(guideBySlug(r), `${g.slug} -> ${r}`).toBeDefined();
  });
  it("have search-sized titles, descriptions and real content", () => {
    for (const g of GUIDES) {
      expect(g.seoTitle.length, g.slug).toBeLessThanOrEqual(65);
      expect(g.description.length, g.slug).toBeGreaterThan(60);
      expect(g.description.length, g.slug).toBeLessThanOrEqual(200);
      expect(g.sections.length, g.slug).toBeGreaterThanOrEqual(3);
      expect(g.cta.href.startsWith("/"), g.slug).toBe(true);
    }
  });
  it("give https sources for the guides that state specific rules or dates", () => {
    for (const slug of ["civil-service-judgement-test", "when-do-degree-apprenticeships-open"]) {
      const g = guideBySlug(slug)!;
      expect(g, slug).toBeDefined();
      expect(g.sources?.length ?? 0, slug).toBeGreaterThanOrEqual(2);
      for (const s of g.sources ?? []) expect(s.url.startsWith("https://"), `${slug} ${s.url}`).toBe(true);
    }
  });
  it("the Civil Service guide says the old Fast Track is closed and that the pass mark is not published", () => {
    const text = JSON.stringify(guideBySlug("civil-service-judgement-test"));
    expect(text).toMatch(/is closed/);
    expect(text).toMatch(/not published/);
    expect(text).toMatch(/not timed/);
  });
});
