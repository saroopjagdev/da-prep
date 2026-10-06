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
});
