import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";
import { firmBriefing, firmOptions } from "@/lib/firms/context";
import { RUBRIC, STAGES, STAGE_LABEL, THEMES, nextInput, nextQuestionSystem, nextQuestionUser, scoreInput, scoreSystem, scoreUser, themesFor } from "@/lib/interview";

const turn = { question: "Why us?", answer: "Because..." };

describe("firm-aware interviews", () => {
  it("accepts an employer instead of an advert, but needs one or the other", () => {
    expect(nextInput.safeParse({ stage: "commercial", history: [], firm: "ubs" }).success).toBe(true);
    expect(nextInput.safeParse({ jobAd: "", stage: "commercial", history: [] }).success).toBe(false);
    expect(scoreInput.safeParse({ stage: "ethics", turns: [turn], firm: "citi", programme: 1 }).success).toBe(true);
    expect(nextInput.safeParse({ stage: "motivation", history: [], firm: "Bad Slug!" }).success).toBe(false);
  });

  it("labels every interview type and has five distinct themes for each", () => {
    for (const s of STAGES) {
      expect(STAGE_LABEL[s], s).toBeTruthy();
      expect(new Set(THEMES[s]).size, s).toBe(5);
    }
  });

  it("uses finance technical themes only for finance", () => {
    expect(themesFor("technical", "finance").join(" ")).toMatch(/Bank Rate/);
    expect(themesFor("technical", "digital")).toBe(THEMES.technical);
    expect(nextQuestionSystem("technical", "finance", 1)).toMatch(/Bank Rate/);
  });

  it("builds a briefing from the chosen programme with reported questions for the stage", () => {
    const b = firmBriefing("morgan-stanley", 2, "motivation")!;
    expect(b).toContain("Morgan Stanley");
    expect(b).toContain("Operations Graduate Apprenticeship");
    expect(b).toContain("Put clients first");
    expect(b).toContain("Why Morgan Stanley?");
    expect(firmBriefing("morgan-stanley", 0, "strengths")).not.toContain("reported at this employer");
    expect(firmBriefing("nope", 0, "motivation")).toBeUndefined();
    expect(firmBriefing("ubs", 99, "motivation")).toContain(FIRMS.find((f) => f.slug === "ubs")!.programmes[0].name);
  });

  it("keeps every briefing a sensible size", () => {
    for (const f of FIRMS) for (const s of STAGES) expect(firmBriefing(f.slug, 0, s)!.length, f.slug).toBeLessThanOrEqual(5000);
  });

  it("puts the briefing in the prompts and tells the model to use it", () => {
    const b = firmBriefing("ubs", 0, "competency");
    expect(nextQuestionUser("", undefined, [], b)).toContain("<employer_profile>");
    expect(nextQuestionUser("", undefined, [])).not.toContain("<employer_profile>");
    expect(nextQuestionSystem("competency", "finance", 0, false, true)).toMatch(/employer profile/);
    expect(scoreUser("", [turn], b)).toContain("UBS");
  });

  it("asks the marker for every rubric area and three next steps", () => {
    const sys = scoreSystem();
    for (const [k] of RUBRIC) expect(sys).toContain(`"${k}"`);
    expect(sys).toMatch(/exactly 3/);
  });

  it("offers finance employers in their own group, including the new banks", () => {
    const opts = firmOptions();
    const finance = opts.filter((o) => o.group === "finance").map((o) => o.slug);
    for (const s of ["goldman-sachs", "jp-morgan", "morgan-stanley", "bank-of-america", "ubs", "fca"]) expect(finance, s).toContain(s);
    expect(finance).not.toContain("airbus");
    expect(opts.find((o) => o.slug === "kpmg")?.group).toBe("professional");
    expect(opts.some((o) => o.slug === "civil-service-fast-track")).toBe(false);
    for (const o of opts) expect(o.programmes.length, o.slug).toBeGreaterThan(0);
  });
});
