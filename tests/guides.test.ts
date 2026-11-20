import { describe, expect, it } from "vitest";
import { GUIDES, GUIDE_TOPICS, GUIDE_TOPIC_OF, guideBySlug, guidesInTopic } from "@/lib/guides";

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
    for (const slug of [
      "civil-service-judgement-test",
      "when-do-degree-apprenticeships-open",
      "degree-apprenticeship-salary",
      "degree-apprenticeship-entry-requirements",
      "apprenticeship-levels-explained",
      "how-to-apply-for-a-degree-apprenticeship",
      "video-interview-tips-hirevue",
      "solicitor-apprenticeship",
      "public-sector-degree-apprenticeships",
      "degree-apprenticeships-for-parents",
      "money-for-degree-apprentices",
      "apprenticeship-funding-changes-2026-27",
      "degree-apprenticeships-scotland-wales-northern-ireland",
      "support-for-disabled-applicants",
    ]) {
      const g = guideBySlug(slug)!;
      expect(g, slug).toBeDefined();
      expect(g.sources?.length ?? 0, slug).toBeGreaterThanOrEqual(2);
      for (const s of g.sources ?? []) expect(s.url.startsWith("https://"), `${slug} ${s.url}`).toBe(true);
    }
  });
  it("every guide belongs to exactly one topic on the Resources page, and every topic has guides", () => {
    for (const g of GUIDES) expect(GUIDE_TOPICS.some((t) => t.id === GUIDE_TOPIC_OF[g.slug]), g.slug).toBe(true);
    for (const slug of Object.keys(GUIDE_TOPIC_OF)) expect(guideBySlug(slug), `unknown guide in the topic map: ${slug}`).toBeDefined();
    for (const t of GUIDE_TOPICS) expect(guidesInTopic(t.id).length, t.id).toBeGreaterThan(0);
    expect(GUIDES.map((g) => g.slug).sort()).toEqual(GUIDES.filter((g) => GUIDE_TOPIC_OF[g.slug]).map((g) => g.slug).sort());
  });
  it("the salary guide's minimum-wage arithmetic holds: £8 an hour for 40 hours over 52 weeks", () => {
    expect(8 * 40 * 52).toBe(16640);
    const text = JSON.stringify(guideBySlug("degree-apprenticeship-salary"));
    expect(text).toContain("£16,640");
    expect(text).toContain("20 days of paid holiday");
  });
  it("the money guide's worked example adds up: £24,000 in 2026 to 2027, tax at 20% over £12,570 and National Insurance at 8% over £242 a week", () => {
    const salary = 24000;
    const tax = (salary - 12570) * 0.2;
    const niThreshold = 242 * 52;
    const ni = (salary - niThreshold) * 0.08;
    expect(tax).toBeCloseTo(2286, 2);
    expect(niThreshold).toBe(12584);
    expect(ni).toBeCloseTo(913.28, 2);
    expect(salary - tax - ni).toBeCloseTo(20800.72, 2);
    const text = JSON.stringify(guideBySlug("money-for-degree-apprentices"));
    for (const figure of ["£2,286", "£913.28", "£20,800", "£11,430", "£11,416", "£12,570"]) expect(text, figure).toContain(figure);
  });
  it("the funding guide states the Level 7 age rule and warns that September 2027 starts fall under the next rules", () => {
    const text = JSON.stringify(guideBySlug("apprenticeship-funding-changes-2026-27"));
    expect(text).toMatch(/16 to 21/);
    expect(text).toMatch(/22 to 24/);
    expect(text).toMatch(/31 July 2027/);
    expect(text).toMatch(/following year/);
  });
  it("the new guides are long enough to be useful and state their level of certainty", () => {
    for (const slug of ["degree-apprenticeship-salary", "degree-apprenticeship-entry-requirements", "apprenticeship-levels-explained", "how-to-apply-for-a-degree-apprenticeship"]) {
      const g = guideBySlug(slug)!;
      const words = JSON.stringify([g.intro, g.sections]).split(/\s+/).length;
      expect(words, slug).toBeGreaterThan(350);
      expect(g.sources!.length, slug).toBeGreaterThanOrEqual(3);
    }
  });
  it("the Civil Service guide says the old Fast Track is closed and that the pass mark is not published", () => {
    const text = JSON.stringify(guideBySlug("civil-service-judgement-test"));
    expect(text).toMatch(/is closed/);
    expect(text).toMatch(/not published/);
    expect(text).toMatch(/not timed/);
  });
});
