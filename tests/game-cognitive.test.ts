import { describe, expect, it } from "vitest";
import { GRID, NUMEROSITY, applyOp, digitFillCorrect, digitPuzzle, evalExpression, gridRecallScore, gridTrial, isSymmetric, numerosityCorrect, numerosityRound, opForLevel, symmetryPattern } from "@/lib/games/cognitive";

describe("numerosity", () => {
  it("moves from addition to division as the level rises", () => {
    expect([1, 3, 4, 6, 7, 9, 10, 12].map(opForLevel)).toEqual(["+", "+", "−", "−", "×", "×", "÷", "÷"]);
    expect(NUMEROSITY.seconds).toBe(180);
  });
  it("builds rounds with exactly one pair that reaches the target, at every level, deterministically", () => {
    for (let level = 1; level <= 12; level++)
      for (const seed of [1, 2, 3]) {
        const round = numerosityRound(seed, level);
        expect(numerosityRound(seed, level)).toEqual(round);
        expect(round.numbers).toHaveLength(8);
        expect(new Set(round.numbers).size).toBe(8);
        const commutes = round.op === "+" || round.op === "×";
        let hits = 0;
        round.numbers.forEach((a, i) => round.numbers.forEach((b, j) => (commutes ? j > i : j !== i) && applyOp(a, b, round.op) === round.target && hits++));
        expect(hits).toBe(1);
        expect(numerosityCorrect(round, round.answer)).toBe(true);
      }
  });
  it("does not allow inexact division", () => {
    expect(applyOp(7, 2, "÷")).toBeNull();
    expect(applyOp(8, 2, "÷")).toBe(4);
  });
});

describe("digit challenge", () => {
  it("evaluates multiplication before addition and subtraction", () => {
    expect(evalExpression([2, 3, 4], ["+", "×"])).toBe(14);
    expect(evalExpression([9, 2, 3], ["−", "×"])).toBe(3);
    expect(evalExpression([2, 3, 4], ["×", "+"])).toBe(10);
  });
  it("makes puzzles with 2 to 4 blanks that their own numbers solve, and rejects repeats and incomplete fills", () => {
    for (let level = 0; level < 9; level++) {
      const p = digitPuzzle(5, level);
      expect(p.numbers.length).toBeGreaterThanOrEqual(2);
      expect(p.numbers.length).toBeLessThanOrEqual(4);
      expect(p.result).toBeGreaterThan(0);
      expect(digitFillCorrect(p, p.numbers)).toBe(true);
      expect(digitFillCorrect(p, p.numbers.map(() => p.numbers[0]))).toBe(false);
      expect(digitFillCorrect(p, [...p.numbers.slice(1), null])).toBe(false);
    }
  });
  it("accepts another fill that also reaches the result", () => {
    const p = { numbers: [2, 3], ops: ["+" as const], result: 5 };
    expect(digitFillCorrect(p, [3, 2])).toBe(true);
    expect(digitFillCorrect(p, [1, 4])).toBe(true);
    expect(digitFillCorrect(p, [1, 3])).toBe(false);
  });
});

describe("grid challenge", () => {
  it("makes symmetric patterns symmetric and asymmetric ones not", () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(isSymmetric(symmetryPattern(seed, true))).toBe(true);
      expect(isSymmetric(symmetryPattern(seed, false))).toBe(false);
    }
  });
  it("shows set sizes 2 to 5 of different cells, each followed by one symmetry question", () => {
    for (let i = 0; i < GRID.setSizes.length; i++) {
      const t = gridTrial(3, i);
      expect(new Set(t.cells).size).toBe(t.cells.length);
      expect(t.symmetry).toHaveLength(t.cells.length);
      for (const q of t.symmetry) expect(isSymmetric(q.pattern)).toBe(q.symmetric);
    }
    expect(gridTrial(3, 5).cells).toHaveLength(5);
  });
  it("scores only cells recalled in the right place in the right order", () => {
    expect(gridRecallScore([4, 7, 1], [4, 7, 1])).toBe(3);
    expect(gridRecallScore([4, 7, 1], [4, 1, 7])).toBe(1);
    expect(gridRecallScore([4, 7, 1], [])).toBe(0);
  });
});
