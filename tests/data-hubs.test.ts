import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";
import { LITE_EMPLOYERS } from "@/lib/lite-employers";
import { allQuestions, questionsByType, sourceHost, topCompetencies } from "@/lib/question-hub";
import { pct, recruitmentStats } from "@/lib/recruitment-stats";
import { PUBLIC_PATHS } from "@/lib/site";

describe("reported interview questions hub", () => {
  const all = allQuestions();
  it("collects every reported question from the employer guides, once each, with a source", () => {
    const expected = FIRMS.reduce((n, f) => n + new Set(f.questions.map((q) => q.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())).size, 0);
    expect(all.length).toBe(expected);
    expect(all.length).toBeGreaterThan(100);
    for (const q of all) {
      expect(q.source.startsWith("https://"), `${q.slug} ${q.question}`).toBe(true);
      expect(q.question.length).toBeGreaterThan(10);
    }
  });

  it("groups by type without losing or duplicating a question, and names the themes", () => {
    const groups = questionsByType();
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(all.length);
    expect(topCompetencies(3).length).toBe(3);
    expect(topCompetencies(3)[0].count).toBeGreaterThanOrEqual(topCompetencies(3)[1].count);
  });

  it("shows where a source is hosted", () => {
    expect(sourceHost("https://www.thestudentroom.co.uk/showthread.php?t=1")).toBe("thestudentroom.co.uk");
  });
});

describe("how employers recruit: the counts", () => {
  const s = recruitmentStats();
  it("are consistent with the profiles they come from", () => {
    expect(s.employers).toBe(FIRMS.filter((f) => f.slug !== "civil-service-fast-track").length);
    for (const k of ["onlineAssessment", "videoInterview", "assessmentCentre", "rolling", "degreeLevel"] as const) {
      expect(s[k], k).toBeGreaterThanOrEqual(0);
      expect(s[k], k).toBeLessThanOrEqual(s.employers);
    }
    expect(s.stagesMin).toBeLessThanOrEqual(s.stagesMedian);
    expect(s.stagesMedian).toBeLessThanOrEqual(s.stagesMax);
    expect(s.reportedQuestions).toBe(allQuestions().length);
  });

  it("split the short employer pages by level, so the four groups add up", () => {
    expect(s.short.degree + s.short.mixed + s.short.notDegree + s.short.unclear).toBe(LITE_EMPLOYERS.length);
    expect(s.short.total).toBe(LITE_EMPLOYERS.length);
  });

  it("only count a test provider when a guide actually names it", () => {
    for (const p of s.providers) expect(p.firms).toBeGreaterThan(0);
    expect(pct(1, 3)).toBe(33);
    expect(pct(0, 0)).toBe(0);
  });

  it("are in the sitemap and navigation", () => {
    expect(PUBLIC_PATHS).toContain("/interview-questions");
    expect(PUBLIC_PATHS).toContain("/how-employers-recruit");
  });
});
