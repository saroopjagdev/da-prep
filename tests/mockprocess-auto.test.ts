import { describe, expect, it } from "vitest";
import { getTest } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { autoMock, classify, testsFor } from "@/lib/mockprocess/auto";
import { ALL_MOCKS, MOCKS } from "@/lib/mockprocess/definitions";

const auto = ALL_MOCKS.slice(MOCKS.length);

describe("generated mock processes", () => {
  it("cover nearly every researched firm, exactly once", () => {
    const slugs = ALL_MOCKS.map((m) => m.firm);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(ALL_MOCKS.length).toBeGreaterThanOrEqual(36);
    expect(ALL_MOCKS.length).toBeLessThanOrEqual(FIRMS.length);
    expect(slugs).not.toContain("civil-service-fast-track"); // a closed scheme
  });

  it.each(auto.map((m) => [m.firm, m] as const))("%s follows the firm's stages in order and uses real tests", (slug, m) => {
    const firm = FIRMS.find((f) => f.slug === slug)!;
    const orders = new Set(firm.stages.map((s) => s.order));
    const seq = m.stages.map((s) => s.stageOrder).filter((o): o is number => o !== undefined);
    expect(seq).toEqual([...seq].sort((a, b) => a - b));
    for (const s of m.stages) {
      if (s.stageOrder !== undefined) expect(orders.has(s.stageOrder), `${s.name}: stageOrder ${s.stageOrder}`).toBe(true);
      if (s.kind === "test") expect(getTest(s.testId), `${s.name}: ${s.testId}`).toBeDefined();
    }
    expect(m.stages.length).toBeGreaterThanOrEqual(3);
    expect(m.stages.some((s) => s.kind !== "info"), "nothing to practise").toBe(true);
    expect(m.framework.items.length).toBeGreaterThan(0);
  });

  it.each(auto.map((m) => [m.firm, m] as const))("%s has clean, non-duplicate questions and says they are practice questions", (_slug, m) => {
    for (const s of m.stages) {
      if (s.kind !== "qa") continue;
      const texts = s.prompts.map((p) => p.text.trim());
      expect(texts.length, s.name).toBeGreaterThan(0);
      expect(new Set(texts).size, `${s.name}: duplicate prompts`).toBe(texts.length);
      for (const t of texts) {
        expect(t.length, `${s.name}: "${t}"`).toBeGreaterThan(15);
        expect(t, "a research annotation leaked into a prompt").not.toMatch(/Note:|\(reported|single report|candidate report/i);
      }
      expect(s.answerSeconds).toBeGreaterThan(0);
    }
    expect(m.notes.join(" ")).toMatch(/not the firm's real questions/);
  });

  it("never replicates a game-based stage as a test, and says it is not simulated", () => {
    const santander = ALL_MOCKS.find((m) => m.firm === "santander")!;
    const games = santander.stages.find((s) => /game/i.test(s.name))!;
    expect(games.kind).toBe("info");
    for (const m of auto) for (const s of m.stages) if (s.kind === "info" && /game/i.test(s.name)) expect(s.note, `${m.firm}: ${s.name}`).toBeDefined();
  });
});

describe("classify and testsFor", () => {
  const stage = (name: string, format = "", provider?: string) => ({ order: 1, name, format, provider, tips: [], source: "x", confidence: "official" as const });
  const f = FIRMS.find((x) => x.slug === "ubs")!;

  it("sorts stages by what they are", () => {
    expect(classify(stage("Online application"))).toBe("info");
    expect(classify(stage("Recruiter call and role-relevant assessment"))).toBe("info");
    expect(classify(stage("On-demand video interview"))).toBe("video");
    expect(classify(stage("Virtual assessment centre"))).toBe("exercise");
    expect(classify(stage("Final interview"))).toBe("interview");
    expect(classify(stage("Online tests"))).toBe("tests");
    expect(classify(stage("Offer"))).toBe("info");
  });

  it("matches tests from what the stage says, not from loose words in its description", () => {
    expect(testsFor(stage("Online tests", "Numerical and verbal reasoning"), f).map((t) => t.id)).toEqual(["shl-numerical", "scales-verbal"]);
    expect(testsFor(stage("Work scenarios assessment", "Shows how you use the core skills and behaviours"), f).map((t) => t.id)).toEqual(["work-scenarios"]);
    expect(testsFor(stage("Online assessment games", "", "Arctic Shores"), f)).toEqual([]);
    expect(testsFor(stage("Online assessment"), f)).toEqual([]);
  });

  it("returns null for a profile too thin to simulate", () => {
    expect(autoMock({ ...f, stages: f.stages.slice(0, 2) })).toBeNull();
  });
});
