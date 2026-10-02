// Original deductive reasoning items: scheduling puzzles. Five tasks go on five different weekdays, a set of
// constraints is given, and the candidate works out which day one task falls on. Each puzzle is generated from a hidden
// valid week and constraints are added until every valid arrangement agrees on the answer, so the key is provable
// (tests re-solve each puzzle by brute force over all 120 arrangements).

import { rng, type Rng } from "@/lib/assess/rng";
import type { Item } from "@/lib/assess/types";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const TASK_SETS: string[][] = [
  ["the stock check", "the safety audit", "the client call", "the team briefing", "the payroll run"],
  ["the delivery run", "the maintenance visit", "the training session", "the inspection", "the budget review"],
  ["the product demo", "the supplier meeting", "the data backup", "the site tour", "the quality review"],
  ["the fire drill", "the stock take", "the apprentice review", "the customer survey", "the equipment check"],
];

/** pos[i] is the weekday index (0-4) of task i. */
export type Constraint = { text: string; test: (pos: number[]) => boolean };
export type DeductiveMeta = { constraints: Constraint[]; target: number; tasks: string[] };

function allPermutations(n: number): number[][] {
  const out: number[][] = [];
  const rec = (cur: number[], rest: number[]) => {
    if (!rest.length) return void out.push(cur);
    rest.forEach((v, i) => rec([...cur, v], [...rest.slice(0, i), ...rest.slice(i + 1)]));
  };
  rec([], Array.from({ length: n }, (_, i) => i));
  return out;
}
const PERMS = allPermutations(5);

export const validArrangements = (constraints: Constraint[]) => PERMS.filter((p) => constraints.every((c) => c.test(p)));

/** True when the constraint fixes the asked-about task to one day outright, which would give the answer away. */
const statesTarget = (c: Constraint, tasks: string[], target: number) =>
  c.text.toLowerCase().startsWith(`${tasks[target]} is on `);

/** Drop rules that aren't needed: the answer must stay unique without them. Keeps puzzles tight. */
function prune(constraints: Constraint[], target: number): Constraint[] {
  let kept = [...constraints];
  for (const c of constraints) {
    const without = kept.filter((k) => k !== c);
    if (without.length >= 3 && new Set(validArrangements(without).map((p) => p[target])).size === 1) kept = without;
  }
  return kept;
}

/** Why each other day is impossible: a single rule that rules it out, or "no arrangement fits" when it takes several. */
function explain(constraints: Constraint[], tasks: string[], target: number, answer: number): { text: string; combined: number } {
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const lines: string[] = [];
  let combined = 0;
  for (let d = 0; d < 5; d++) {
    if (d === answer) continue;
    const onD = PERMS.filter((p) => p[target] === d);
    const idx = constraints.findIndex((c) => onD.every((p) => !c.test(p)));
    if (idx >= 0) {
      lines.push(`Not ${DAYS[d]}: rule ${idx + 1} rules it out.`);
      continue;
    }
    combined++;
    let pair: [number, number] | null = null;
    for (let i = 0; i < constraints.length && !pair; i++)
      for (let j = i + 1; j < constraints.length && !pair; j++)
        if (onD.every((p) => !(constraints[i].test(p) && constraints[j].test(p)))) pair = [i + 1, j + 1];
    lines.push(
      pair
        ? `Not ${DAYS[d]}: rules ${pair[0]} and ${pair[1]} can't both be true if it is on ${DAYS[d]}.`
        : `Not ${DAYS[d]}: with it on ${DAYS[d]}, there is no way to place the other tasks so that every rule holds.`,
    );
  }
  const fits = validArrangements(constraints);
  const sample = fits.length === 1 ? ` The only week that fits: ${fits[0].map((day, i) => [day, i] as const).sort((a, b) => a[0] - b[0]).map(([day, i]) => `${DAYS[day].slice(0, 3)} ${tasks[i].replace(/^the /, "")}`).join(", ")}.` : "";
  return { text: `${cap(tasks[target])} is on ${DAYS[answer]}. ${lines.join(" ")}${sample}`, combined };
}

function candidateConstraint(r: Rng, sol: number[], tasks: string[], usedOnDay: boolean): Constraint | null {
  const a = r.int(0, 4);
  let b = r.int(0, 4);
  while (b === a) b = r.int(0, 4);
  const T = (i: number) => tasks[i];
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const kind = r.pick(["before", "before", "notDay", "notDay", "immediately", "notAdjacent", "onDay"] as const);
  if (kind === "before" && sol[a] < sol[b]) return { text: `${cap(T(a))} is earlier in the week than ${T(b)}.`, test: (p) => p[a] < p[b] };
  if (kind === "notDay") {
    const d = r.int(0, 4);
    if (sol[a] !== d) return { text: `${cap(T(a))} is not on ${DAYS[d]}.`, test: (p) => p[a] !== d };
  }
  if (kind === "immediately" && sol[b] === sol[a] + 1) return { text: `${cap(T(b))} is the day immediately after ${T(a)}.`, test: (p) => p[b] === p[a] + 1 };
  if (kind === "notAdjacent" && Math.abs(sol[a] - sol[b]) > 1) return { text: `${cap(T(a))} and ${T(b)} are not on consecutive days.`, test: (p) => Math.abs(p[a] - p[b]) > 1 };
  if (kind === "onDay" && !usedOnDay) return { text: `${cap(T(a))} is on ${DAYS[sol[a]]}.`, test: (p) => p[a] === sol[a] };
  return null;
}

export type DeductiveBank = { items: Item[]; meta: Record<string, DeductiveMeta> };

export function buildDeductive(count = 16): DeductiveBank {
  const items: Item[] = [];
  const meta: Record<string, DeductiveMeta> = {};
  // Spread the bank across difficulty 2-5 so the adaptive runner has easier and harder puzzles to move between.
  // After enough seeds, any difficulty is accepted so the build always finishes.
  const quota: Record<number, number> = { 2: Math.ceil(count / 4), 3: Math.ceil(count / 4), 4: Math.ceil(count / 4), 5: Math.ceil(count / 4) };
  const relaxAt = 20000 + 20000;
  let seed = 20000;
  while (items.length < count) {
    seed++;
    const r = rng(seed);
    const tasks = TASK_SETS[items.length % TASK_SETS.length];
    const sol = r.shuffle([0, 1, 2, 3, 4]);
    const target = r.int(0, 4);
    const constraints: Constraint[] = [];
    let usedOnDay = false;
    for (let guard = 0; guard < 200 && constraints.length < 7; guard++) {
      const c = candidateConstraint(r, sol, tasks, usedOnDay);
      if (!c || statesTarget(c, tasks, target) || constraints.some((k) => k.text === c.text)) continue;
      // Every rule must narrow things down; a rule that rules nothing out is noise.
      if (validArrangements([...constraints, c]).length === validArrangements(constraints).length) continue;
      if (c.text.includes(" is on ")) usedOnDay = true;
      constraints.push(c);
      const days = new Set(validArrangements(constraints).map((p) => p[target]));
      if (days.size === 1 && constraints.length >= 3) break;
    }
    const days = new Set(validArrangements(constraints).map((p) => p[target]));
    if (days.size !== 1 || constraints.length < 3) continue; // retry with another seed
    const rules = prune(constraints, target);
    const answer = [...days][0];
    const id = `ded-${items.length + 1}`;
    const why = explain(rules, tasks, target, answer);
    // Harder when more days can only be eliminated by combining rules, and when there are more rules to hold in mind.
    const difficulty = Math.min(5, Math.max(2, 1 + why.combined + (rules.length >= 5 ? 1 : 0))) as 2 | 3 | 4 | 5;
    if (quota[difficulty] <= 0 && seed < relaxAt) continue;
    quota[difficulty]--;
    items.push({
      id,
      kind: "mcq",
      prompt:
        `Five tasks are each scheduled on a different day, Monday to Friday: ${tasks.join(", ")}.\n\n` +
        `${rules.map((c, i) => `${i + 1}. ${c.text}`).join("\n")}\n\n` +
        `On which day is ${tasks[target]} scheduled?`,
      options: [...DAYS],
      answer,
      explanation: why.text,
      difficulty,
    });
    meta[id] = { constraints: rules, target, tasks };
  }
  return { items, meta };
}

export const DEDUCTIVE = buildDeductive();
