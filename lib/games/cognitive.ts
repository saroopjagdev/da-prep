// Rules for the ability-style practice games reported for HireVue (Numerosity) and Aon (the Digit and Grid challenges).
// Pure, so it can be tested. Prep sites describe these games; neither provider publishes rules, timing or scoring, so
// these follow the descriptions and are not the real thing. See docs/research/game-assessments.md.
import { rng } from "@/lib/assess/rng";

/* ---------------------------------------------------------------- Numerosity (arithmetic selection) */

export const NUMEROSITY = { seconds: 180, perRoundSeconds: 15 } as const;
export type Op = "+" | "−" | "×" | "÷";

/** Addition first, division last, three levels each: the order prep sources report. */
export const opForLevel = (level: number): Op => (["+", "−", "×", "÷"] as const)[Math.min(3, Math.floor((level - 1) / 3))];

export const applyOp = (a: number, b: number, op: Op): number | null => {
  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  return b !== 0 && a % b === 0 ? a / b : null;
};

export type NumerosityRound = { level: number; op: Op; target: number; numbers: number[]; answer: [number, number] };

/** A target and eight numbers. Exactly one pair of them (in either order) reaches the target with the operation shown. */
export function numerosityRound(seed: number, level: number): NumerosityRound {
  const r = rng(seed * 131 + level * 7919);
  const op = opForLevel(level);
  const span = 6 + level * 2;
  for (let attempt = 0; attempt < 400; attempt++) {
    let a = r.int(2, span);
    let b = r.int(2, span);
    if (op === "÷") {
      b = r.int(2, 4 + Math.floor(level / 2));
      a = b * r.int(2, 5 + level);
    }
    const target = applyOp(a, b, op);
    if (target === null || target <= 0) continue;
    const pool = new Set<number>([a, b]);
    const top = op === "÷" ? Math.max(a, 20) : span + 4;
    while (pool.size < 8) pool.add(r.int(2, top));
    const numbers = r.shuffle([...pool]);
    const hits: [number, number][] = [];
    const commutes = op === "+" || op === "×";
    for (let i = 0; i < numbers.length; i++) for (let j = commutes ? i + 1 : 0; j < numbers.length; j++) if (i !== j && applyOp(numbers[i], numbers[j], op) === target) hits.push([numbers[i], numbers[j]]);
    if (hits.length === 1) return { level, op, target, numbers, answer: hits[0] };
  }
  throw new Error(`Could not build a numerosity round for level ${level}`);
}

export const numerosityCorrect = (round: NumerosityRound, picked: [number, number]) => applyOp(picked[0], picked[1], round.op) === round.target;

/* ---------------------------------------------------------------- Digit challenge (equation gaps) */

export type DigitOp = "+" | "−" | "×";
export type DigitPuzzle = { numbers: number[]; ops: DigitOp[]; result: number };

/** Written order, with × done before + and −. */
export function evalExpression(numbers: number[], ops: readonly DigitOp[]): number {
  const terms: number[] = [numbers[0]];
  const signs: ("+" | "−")[] = [];
  ops.forEach((op, i) => {
    const n = numbers[i + 1];
    if (op === "×") terms[terms.length - 1] *= n;
    else {
      signs.push(op);
      terms.push(n);
    }
  });
  return terms.reduce((sum, t, i) => (i === 0 ? t : signs[i - 1] === "+" ? sum + t : sum - t), 0);
}

/** An equation with 2 to 4 blanks and a result; any fill of different digits from 1 to 9 that reaches the result is right. */
export function digitPuzzle(seed: number, level: number): DigitPuzzle {
  const r = rng(seed * 977 + level * 104729);
  const blanks = Math.min(4, 2 + Math.floor(level / 2));
  for (let attempt = 0; attempt < 500; attempt++) {
    const numbers = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, blanks);
    const ops = Array.from({ length: blanks - 1 }, () => r.pick(["+", "−", "×"] as const));
    const result = evalExpression(numbers, ops);
    if (result > 0) return { numbers, ops, result };
  }
  throw new Error("Could not build a digit puzzle");
}

export function digitFillCorrect(p: DigitPuzzle, fill: (number | null)[]): boolean {
  if (fill.length !== p.numbers.length || fill.some((d) => d === null || d < 1 || d > 9)) return false;
  if (new Set(fill).size !== fill.length) return false;
  return evalExpression(fill as number[], p.ops) === p.result;
}

/* ---------------------------------------------------------------- Grid challenge (memory with symmetry questions) */

export const GRID = { size: 4, symmetrySize: 6, setSizes: [2, 3, 3, 4, 4, 5] } as const;
export type SymmetryQuestion = { pattern: boolean[][]; symmetric: boolean };
export type GridTrial = { cells: number[]; symmetry: SymmetryQuestion[] };

/** A pattern on a square grid, mirror-symmetric left to right or, if `symmetric` is false, with one cell flipped to break it. */
export function symmetryPattern(seed: number, symmetric: boolean, size: number = GRID.symmetrySize): boolean[][] {
  const r = rng(seed);
  const half = size / 2;
  const grid = Array.from({ length: size }, () => {
    const left = Array.from({ length: half }, () => r.next() < 0.45);
    return [...left, ...[...left].reverse()];
  });
  if (!symmetric) {
    const row = r.int(0, size - 1);
    const col = r.int(0, half - 1);
    grid[row][col] = !grid[row][col];
  }
  return grid;
}

export const isSymmetric = (g: boolean[][]) => g.every((row) => row.every((v, i) => v === row[row.length - 1 - i]));

/** Cells to remember (in order, no repeats), each followed by a symmetry question. */
export function gridTrial(seed: number, index: number): GridTrial {
  const r = rng(seed * 31 + index * 6151);
  const n = GRID.setSizes[index % GRID.setSizes.length];
  const cells = r.shuffle(Array.from({ length: GRID.size * GRID.size }, (_, i) => i)).slice(0, n);
  const symmetry = cells.map((_, k) => {
    const symmetric = r.next() < 0.5;
    return { pattern: symmetryPattern(seed + index * 101 + k * 13, symmetric), symmetric };
  });
  return { cells, symmetry };
}

/** Cells recalled in the right place in the right order. */
export const gridRecallScore = (shown: number[], recalled: number[]) => shown.filter((c, i) => recalled[i] === c).length;
