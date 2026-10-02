// Original inductive reasoning items: find the rule in a sequence of numbers, letters, letter-number pairs or symbols
// and choose what comes next. Families are generated; tests recompute each answer with generic rule detectors that
// only look at the displayed sequence, so they are independent of how the item was made.

import { mcqOptions, rng, type Rng } from "@/lib/assess/rng";
import type { Item } from "@/lib/assess/types";

const D = (n: number): 1 | 2 | 3 | 4 | 5 => Math.max(1, Math.min(5, n)) as 1 | 2 | 3 | 4 | 5;
const letter = (i: number) => String.fromCharCode(65 + ((i % 26) + 26) % 26);
const SHAPES = ["▲", "■", "●", "◆", "★", "▼"];
const ARROWS = ["↑", "→", "↓", "←"];

type Built = { prompt: string; correct: string; distractors: string[]; why: string; difficulty: number };

const arithmetic = (r: Rng, n: number): Built => {
  const start = r.int(2, 30);
  const step = r.pick([3, 4, 5, 6, 7, 9, 11, -3, -4, -6]);
  const seq = Array.from({ length: 6 }, (_, i) => start + step * i);
  const shown = seq.slice(0, 5);
  const next = seq[5];
  return {
    prompt: `${shown.join(", ")}, ?`,
    correct: String(next),
    distractors: [next + step, next - 1, next + 1, shown[4] + (Math.abs(step) + 1) * Math.sign(step), next + 2 * Math.sign(step)].map(String),
    why: `The sequence changes by ${step > 0 ? "+" : ""}${step} each time, so the next term is ${shown[4]} ${step > 0 ? "+" : "−"} ${Math.abs(step)} = ${next}.`,
    difficulty: 1 + (n % 2),
  };
};

const geometric = (r: Rng, n: number): Built => {
  const start = r.int(1, 5);
  const m = r.pick([2, 3, 2, 3]);
  const seq = Array.from({ length: 5 }, (_, i) => start * m ** i);
  const next = start * m ** 5 > 5000 ? 0 : start * m ** 5;
  const shown = next ? seq : seq.slice(0, 4);
  const answer = next || seq[4];
  return {
    prompt: `${shown.slice(0, next ? 5 : 4).join(", ")}, ?`,
    correct: String(answer),
    distractors: [answer + m, answer - shown[shown.length - 1], shown[shown.length - 1] + m * 2, answer + 1, answer * 2, shown[shown.length - 1] * (m + 1)].map(String),
    why: `Each term is the previous one multiplied by ${m}, so the next term is ${shown[shown.length - 1]} × ${m} = ${answer}.`,
    difficulty: 2 + (n % 2),
  };
};

const growingStep = (r: Rng, n: number): Built => {
  const start = r.int(1, 12);
  const firstStep = r.pick([1, 2, 3]);
  const seq = [start];
  for (let i = 0; i < 5; i++) seq.push(seq[i] + firstStep + i);
  const shown = seq.slice(0, 5);
  const next = seq[5];
  return {
    prompt: `${shown.join(", ")}, ?`,
    correct: String(next),
    distractors: [next + 1, next - 1, shown[4] + (shown[4] - shown[3]), next + 3, next + 2].map(String),
    why: `The gaps grow by 1 each time (${shown.slice(1).map((v, i) => v - shown[i]).join(", ")}, then ${next - shown[4]}), so the next term is ${shown[4]} + ${next - shown[4]} = ${next}.`,
    difficulty: 3 + (n % 2),
  };
};

const alternating = (r: Rng): Built => {
  const a0 = r.int(2, 20);
  const aStep = r.pick([2, 3, 4, 5]);
  const b0 = r.int(40, 80);
  const bStep = r.pick([-2, -3, -4, -5]);
  const seq: number[] = [];
  for (let i = 0; i < 4; i++) seq.push(a0 + aStep * i, b0 + bStep * i);
  const shown = seq.slice(0, 7);
  const next = seq[7];
  return {
    prompt: `${shown.join(", ")}, ?`,
    correct: String(next),
    distractors: [next + 1, next - 1, shown[6] + aStep, next + 4, next - 3, shown[6] + bStep].map(String),
    why: `Two interleaved sequences: the odd positions rise by ${aStep}, the even positions fall by ${-bStep}. The next term continues the second sequence: ${shown[5]} − ${-bStep} = ${next}.`,
    difficulty: 4,
  };
};

const letters = (r: Rng, n: number): Built => {
  const start = r.int(0, 8);
  const step = r.pick([2, 3, 4]);
  const seq = Array.from({ length: 6 }, (_, i) => letter(start + step * i));
  return {
    prompt: `${seq.slice(0, 5).join(", ")}, ?`,
    correct: seq[5],
    distractors: [letter(start + step * 5 + 1), letter(start + step * 5 - 1), letter(start + step * 5 + 2), letter(start + step * 4 + step - 2), letter(start + step * 5 + 3)],
    why: `Each letter moves ${step} places on in the alphabet, so after ${seq[4]} comes ${seq[5]}.`,
    difficulty: 2 + (n % 2),
  };
};

const letterNumber = (r: Rng): Built => {
  const start = r.int(0, 6);
  const ls = r.pick([1, 2]);
  const ns = r.pick([2, 3, 5]);
  const n0 = r.int(1, 6);
  const term = (i: number) => `${letter(start + ls * i)}${n0 + ns * i}`;
  return {
    prompt: `${[0, 1, 2, 3, 4].map(term).join(", ")}, ?`,
    correct: term(5),
    distractors: [`${letter(start + ls * 5)}${n0 + ns * 5 + 1}`, `${letter(start + ls * 5 + 1)}${n0 + ns * 5}`, `${letter(start + ls * 4)}${n0 + ns * 5}`, `${letter(start + ls * 5)}${n0 + ns * 4}`, `${letter(start + ls * 5 + 2)}${n0 + ns * 5 - 1}`],
    why: `Two rules run together: the letter moves ${ls} place${ls > 1 ? "s" : ""} on, and the number goes up by ${ns}. The next pair is ${term(5)}.`,
    difficulty: 3,
  };
};

const symbolCycle = (r: Rng, n: number): Built => {
  const cycle = n % 2 ? r.shuffle(ARROWS).slice(0, 4) : r.shuffle(SHAPES).slice(0, r.pick([3, 4]));
  const start = r.int(0, cycle.length - 1);
  const seq = Array.from({ length: 7 }, (_, i) => cycle[(start + i) % cycle.length]);
  const shown = seq.slice(0, 6);
  const next = seq[6];
  const others = [...new Set([...ARROWS, ...SHAPES])].filter((s) => s !== next);
  return {
    prompt: `${shown.join("  ")}  ?`,
    correct: next,
    distractors: r.shuffle(others).slice(0, 6),
    why: `The symbols repeat in a cycle of ${cycle.length} (${cycle.join(" ")}). After ${shown[5]} the cycle continues with ${next}.`,
    difficulty: 2 + (n % 2),
  };
};

const dotGrowth = (r: Rng, n: number): Built => {
  const start = r.int(1, 3);
  const step = r.pick([1, 2]);
  const counts = Array.from({ length: 5 }, (_, i) => start + step * i);
  const dots = (k: number) => "●".repeat(k);
  return {
    prompt: `${counts.slice(0, 4).map(dots).join("   ")}   ?`,
    correct: `${counts[4]} dots`,
    distractors: [`${counts[4] + 1} dots`, `${counts[4] - 1} dots`, `${counts[3]} dots`, `${counts[4] + 2} dots`, `${counts[3] * 2} dots`],
    why: `Each group has ${step} more dot${step > 1 ? "s" : ""} than the one before (${counts.slice(0, 4).join(", ")}), so the next group has ${counts[4]}.`,
    difficulty: 1 + (n % 2),
  };
};

const FAMILIES: [string, (r: Rng, n: number) => Built][] = [
  ["arith", arithmetic],
  ["geo", geometric],
  ["grow", growingStep],
  ["alt", alternating],
  ["letters", letters],
  ["letnum", letterNumber],
  ["symbols", symbolCycle],
  ["dots", dotGrowth],
];

// More of the harder families, so a strong candidate in an adaptive run does not run out of hard items.
const PER_FAMILY: Record<string, number> = { arith: 2, geo: 3, grow: 5, alt: 5, letters: 3, letnum: 5, symbols: 3, dots: 2 };

export function buildInductive(): Item[] {
  const items: Item[] = [];
  const seen = new Set<string>();
  FAMILIES.forEach(([name, gen], fi) => {
    for (let n = 0; n < PER_FAMILY[name]; n++) {
      // Re-roll if a seed happens to produce a sequence already in the bank.
      let attempt = 0;
      let r = rng(9000 + fi * 100 + n);
      let b = gen(r, n);
      while (seen.has(b.prompt) && attempt < 50) {
        attempt++;
        r = rng(9000 + fi * 100 + n + attempt * 7919);
        b = gen(r, n);
      }
      seen.add(b.prompt);
      const { options, answer } = mcqOptions(r, b.correct, b.distractors);
      items.push({
        id: `ind-${name}-${n + 1}`,
        kind: "mcq",
        prompt: `What comes next in the sequence?\n\n${b.prompt}`,
        options,
        answer,
        explanation: b.why,
        difficulty: D(b.difficulty),
      });
    }
  });
  return items;
}

export const INDUCTIVE = buildInductive();
