import { describe, expect, it } from "vitest";
import { CONFIDENCE_TEXT, prepTips, testFacts, testFamily, testSummary } from "@/lib/assess/about";
import { TESTS } from "@/lib/assess/tests";

describe("practice test pages: the text under the player", () => {
  it("every test gets a clear summary, preparation advice and a confidence statement", () => {
    for (const t of TESTS) {
      const s = testSummary(t);
      expect(s, t.id).not.toMatch(/NaN|undefined|null/);
      expect(s, t.id).toMatch(/This practice version has \d+ (questions|statements)/);
      expect(prepTips(t).length, t.id).toBeGreaterThanOrEqual(1);
      expect(CONFIDENCE_TEXT[t.confidence], t.id).toBeTruthy();
    }
  });

  it("puts the known tests in the right family, and leaves none unclassified", () => {
    const byId = Object.fromEntries(TESTS.map((t) => [t.id, testFamily(t)]));
    expect(byId["shl-numerical"]).toBe("numerical");
    expect(byId["shl-inductive"]).toBe("inductive");
    expect(byId["shl-deductive"]).toBe("deductive");
    expect(byId["scales-verbal"]).toBe("verbal");
    expect(byId["switch-challenge"]).toBe("switch");
    expect(byId["sjt-rate-each"]).toBe("situational");
    expect(Object.entries(byId).filter(([, f]) => f === "other").map(([id]) => id)).toEqual([]);
  });

  it("reports the real counts and timing, and the real calculator and going-back rules", () => {
    const num = TESTS.find((t) => t.id === "shl-numerical")!;
    const f = testFacts(num);
    expect(f.questions).toBe(10);
    expect(f.minutes).toBe(18);
    expect(f.calculator).toBe(true);
    expect(f.canGoBack).toBe(false);
    expect(testSummary(num)).toContain("18 minutes");
    expect(testSummary(num)).toContain("A calculator is provided.");
  });
});
