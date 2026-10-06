import { describe, expect, it } from "vitest";
import { historyByTest, nameOf, percentOf, recordFor, skillOf, skillSummary, startOfWeek, takenSince, weakestSections } from "@/lib/progress";
import { getTest } from "@/lib/assess/tests";
import type { TestResult } from "@/lib/assess/types";
import type { PracticeRecord } from "@/lib/types";

const rec = (over: Partial<PracticeRecord>): PracticeRecord => ({ id: Math.random().toString(36), date: "2026-10-01T10:00:00Z", category: "Test", score: 5, total: 10, ...over });

describe("saving a result", () => {
  it("keeps the test id, each marked section and the time used", () => {
    const test = getTest("hsbc-simulate")!;
    const result: TestResult = {
      testId: test.id,
      startedAt: "2026-10-06T10:00:00Z",
      finishedAt: "2026-10-06T10:30:00Z",
      sections: test.sections.map((s, i) => ({ sectionId: s.id, points: i === 4 ? 0 : 2, max: i === 4 ? 0 : 4, answered: 4, total: 4, secondsUsed: 120 })),
      points: 8,
      max: 16,
      responses: {},
    };
    const r = recordFor(test, result, "HSBC mock process");
    expect(r).toMatchObject({ testId: "hsbc-simulate", category: test.name, score: 8, total: 16, seconds: 600, via: "HSBC mock process" });
    // The unmarked work-style tile is left out.
    expect(r.sections).toHaveLength(4);
    expect(r.sections![0]).toMatchObject({ points: 2, max: 4 });
  });
});

describe("skills", () => {
  it("are read from the test id, the quiz category or, for older records, the test name", () => {
    expect(skillOf({ testId: "shl-numerical", category: "x" })).toBe("Numerical reasoning");
    expect(skillOf({ testId: "scales-verbal-full", category: "x" })).toBe("Verbal reasoning");
    expect(skillOf({ testId: "capp-critical", category: "x" })).toBe("Critical reasoning");
    expect(skillOf({ testId: "switch-challenge", category: "x" })).toBe("Logical reasoning");
    expect(skillOf({ testId: "hsbc-simulate", category: "x" })).toBe("Situational judgement");
    expect(skillOf({ testId: "quiz:logical", category: "logical" })).toBe("Logical reasoning");
    expect(skillOf({ category: "numerical" })).toBe("Numerical reasoning");
    expect(skillOf({ category: "Numerical reasoning (SHL Verify Interactive style)" })).toBe("Numerical reasoning");
    expect(skillOf({ category: "Job simulation: a day in commercial banking" })).toBe("Situational judgement");
  });
});

describe("history by test", () => {
  const items = [
    rec({ id: "c", testId: "shl-numerical", category: "Numerical reasoning (SHL)", date: "2026-10-03T10:00:00Z", score: 8, total: 10 }),
    rec({ id: "a", testId: "shl-numerical", category: "Numerical reasoning (SHL)", date: "2026-10-01T10:00:00Z", score: 5, total: 10 }),
    rec({ id: "b", testId: "capp-verbal", category: "Verbal (Cappfinity)", date: "2026-10-02T10:00:00Z", score: 6, total: 12 }),
    rec({ id: "q", category: "numerical", date: "2026-10-04T10:00:00Z", score: 4, total: 5 }),
  ];
  const label = (k: string) => ({ numerical: "Numerical reasoning" })[k];

  it("groups attempts per test, oldest first, newest test first, and works out the change", () => {
    const h = historyByTest(items, label);
    expect(h.map((t) => t.name)).toEqual(["Quick quiz: Numerical reasoning", "Numerical reasoning (SHL)", "Verbal (Cappfinity)"]);
    const shl = h.find((t) => t.key === "shl-numerical")!;
    expect(shl.attempts.map((a) => a.id)).toEqual(["a", "c"]);
    expect(shl).toMatchObject({ bestPct: 80, avgPct: 65, change: 30 });
    expect(h.find((t) => t.key === "capp-verbal")!.change).toBeNull();
  });

  it("ranks skills weakest first", () => {
    const s = skillSummary(items);
    expect(s[0]).toMatchObject({ skill: "Verbal reasoning", avgPct: 50 });
    expect(s[s.length - 1].skill).toBe("Numerical reasoning");
    expect(percentOf({ score: 1, total: 0 })).toBe(0);
  });

  it("names quick quiz results and leaves test names alone", () => {
    expect(nameOf({ category: "numerical" }, label)).toBe("Quick quiz: Numerical reasoning");
    expect(nameOf({ testId: "shl-numerical", category: "Numerical reasoning (SHL)" }, label)).toBe("Numerical reasoning (SHL)");
  });
});

describe("weakest sections", () => {
  it("adds up section scores across attempts, only for multi-section tests", () => {
    const sec = (title: string, points: number, max: number) => ({ id: title, title, points, max });
    const a = rec({ sections: [sec("Tile 1", 3, 4), sec("Tile 2", 1, 4)] });
    const b = rec({ sections: [sec("Tile 1", 4, 4), sec("Tile 2", 2, 4)] });
    expect(weakestSections([a, b])).toEqual([
      { title: "Tile 2", pct: 38 },
      { title: "Tile 1", pct: 88 },
    ]);
    expect(weakestSections([rec({ sections: [sec("Only", 1, 2)] })])).toEqual([]);
  });
});

describe("this week", () => {
  it("starts on Monday and counts results since then", () => {
    const wed = new Date(2026, 9, 7, 15, 0); // Wednesday 7 October 2026, local time
    const mon = startOfWeek(wed);
    expect([mon.getDay(), mon.getDate(), mon.getHours()]).toEqual([1, 5, 0]);
    const items = [rec({ date: new Date(2026, 9, 6, 9).toISOString() }), rec({ date: new Date(2026, 9, 2, 9).toISOString() })];
    expect(takenSince(items, mon)).toBe(1);
  });
});
