import { servedCount } from "@/lib/assess/sample";
import type { Item, Response, Section, SectionResult, Test, TestResult } from "./types";

export type ItemScore = { points: number; max: number; answered: boolean; traits?: Record<string, number> };

/** The empty response for an item, used for skipped or timed-out items. */
export function blankResponse(item: Item): Response {
  switch (item.kind) {
    case "mcq":
    case "tf-cannot-say":
      return { kind: item.kind, choice: null };
    case "most-least":
    case "forced-choice":
      return { kind: item.kind, most: null, least: null };
    case "rate-each":
      return { kind: "rate-each", ratings: item.actions.map(() => null) };
    case "rank":
      return { kind: "rank", order: null };
    case "numeric":
      return { kind: "numeric", value: null };
    case "written":
      return { kind: "written", text: null };
    case "likert":
      return { kind: "likert", value: null };
  }
}

/** Fraction of option pairs the candidate put in the same relative order as the key (1 = perfect, 0 = reversed). */
export function rankConcordance(key: number[], given: number[]): number {
  const pos = new Map(given.map((opt, i) => [opt, i]));
  let agree = 0;
  let pairs = 0;
  for (let a = 0; a < key.length; a++) {
    for (let b = a + 1; b < key.length; b++) {
      pairs++;
      const pa = pos.get(key[a]);
      const pb = pos.get(key[b]);
      if (pa !== undefined && pb !== undefined && pa < pb) agree++;
    }
  }
  return pairs ? agree / pairs : 0;
}

/** Read a typed number, ignoring £, %, commas and spaces. Returns null when it isn't a number. */
export function parseNumber(s: string | null): number | null {
  if (s === null) return null;
  const clean = s.replace(/[£$€%,\s]/g, "");
  if (!/^-?\d*\.?\d+$/.test(clean)) return null;
  return Number(clean);
}

/**
 * Score one response.
 * Partial-credit rules are our approximation: vendors publish no scoring keys.
 * - most-least: one point for each of the two picks that matches the key.
 * - rate-each: full point for the keyed rating, half a point when one step away.
 * - rank: fraction of pairs in the right relative order.
 */
export function scoreItem(item: Item, r: Response): ItemScore {
  if (r.kind !== item.kind) throw new Error(`Response kind ${r.kind} does not match item kind ${item.kind}`);
  switch (item.kind) {
    case "mcq": {
      const c = (r as Extract<Response, { kind: "mcq" }>).choice;
      return { points: c === item.answer ? 1 : 0, max: 1, answered: c !== null };
    }
    case "tf-cannot-say": {
      const c = (r as Extract<Response, { kind: "tf-cannot-say" }>).choice;
      return { points: c === item.answer ? 1 : 0, max: 1, answered: c !== null };
    }
    case "most-least": {
      const x = r as Extract<Response, { kind: "most-least" }>;
      const points = (x.most === item.most ? 1 : 0) + (x.least === item.least ? 1 : 0);
      return { points, max: 2, answered: x.most !== null || x.least !== null };
    }
    case "rate-each": {
      const x = r as Extract<Response, { kind: "rate-each" }>;
      let points = 0;
      item.ratings.forEach((key, i) => {
        const given = x.ratings[i];
        if (given === null || given === undefined) return;
        const diff = Math.abs(given - key);
        points += diff === 0 ? 1 : diff === 1 ? 0.5 : 0;
      });
      return { points, max: item.ratings.length, answered: x.ratings.some((v) => v !== null) };
    }
    case "rank": {
      const x = r as Extract<Response, { kind: "rank" }>;
      return { points: x.order ? rankConcordance(item.order, x.order) : 0, max: 1, answered: x.order !== null };
    }
    case "numeric": {
      const v = parseNumber((r as Extract<Response, { kind: "numeric" }>).value);
      const ok = v !== null && Math.abs(v - item.answer) <= (item.tolerance ?? 0) + 1e-9;
      return { points: ok ? 1 : 0, max: 1, answered: v !== null };
    }
    case "written": {
      const t = (r as Extract<Response, { kind: "written" }>).text;
      return { points: 0, max: 0, answered: Boolean(t && t.trim()) };
    }
    case "likert": {
      const x = r as Extract<Response, { kind: "likert" }>;
      if (x.value === null) return { points: 0, max: 0, answered: false };
      const v = item.reverse ? 6 - x.value : x.value;
      return { points: 0, max: 0, answered: true, traits: { [item.trait]: v } };
    }
    case "forced-choice": {
      const x = r as Extract<Response, { kind: "forced-choice" }>;
      const traits: Record<string, number> = {};
      if (x.most !== null) traits[item.statements[x.most].trait] = (traits[item.statements[x.most].trait] ?? 0) + 1;
      if (x.least !== null) traits[item.statements[x.least].trait] = (traits[item.statements[x.least].trait] ?? 0) - 1;
      return { points: 0, max: 0, answered: x.most !== null || x.least !== null, traits };
    }
  }
}

function addTraits(into: Record<string, number>, from?: Record<string, number>) {
  for (const [k, v] of Object.entries(from ?? {})) into[k] = (into[k] ?? 0) + v;
}

export function scoreSection(section: Section, responses: Record<string, Response>, secondsUsed: number, servedIds?: string[]): SectionResult {
  let points = 0;
  let max = 0;
  let answered = 0;
  const traits: Record<string, number> = {};
  const served = section.items.filter((i) => i.id in responses);
  for (const item of served) {
    const s = scoreItem(item, responses[item.id]);
    points += s.points;
    max += s.max;
    if (s.answered) answered++;
    addTraits(traits, s.traits);
  }
  // Items selected for this attempt but not reached (time ran out) still count towards the maximum. Items a rotating
  // section did not select this time do not.
  const chosen = servedIds ? new Set(servedIds) : null;
  const unserved = section.adaptive ? [] : section.items.filter((i) => !(i.id in responses) && (!chosen || chosen.has(i.id)));
  for (const item of unserved) max += scoreItem(item, blankResponse(item)).max;
  return {
    sectionId: section.id,
    points,
    max,
    answered,
    total: servedIds && !section.adaptive ? servedIds.length : servedCount(section),
    secondsUsed,
    traits: Object.keys(traits).length ? traits : undefined,
  };
}

/** Combine section results. Trait totals are summed across sections. */
export function summarise(test: Test, startedAt: string, sections: SectionResult[], responses: Record<string, Response>): TestResult {
  const traits: Record<string, number> = {};
  for (const s of sections) addTraits(traits, s.traits);
  return {
    testId: test.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    sections,
    points: sections.reduce((a, s) => a + s.points, 0),
    max: sections.reduce((a, s) => a + s.max, 0),
    traits: Object.keys(traits).length ? traits : undefined,
    responses,
  };
}

/**
 * Turn raw trait totals into 0-100 scores. The possible range per trait comes from the items that measure it:
 * each likert item contributes 1-5, each forced-choice block contributes -1 (least like me) to +1 (most like me).
 * Traits with no answered items are omitted. These are profile positions, not norm-referenced scores.
 */
export function traitProfile(test: Test, result: TestResult): { trait: string; percent: number }[] {
  const range = new Map<string, { min: number; max: number }>();
  const widen = (trait: string, min: number, max: number) => {
    const r = range.get(trait) ?? { min: 0, max: 0 };
    range.set(trait, { min: r.min + min, max: r.max + max });
  };
  for (const section of test.sections) {
    for (const item of section.items) {
      if (!(item.id in result.responses)) continue;
      if (item.kind === "likert") widen(item.trait, 1, 5);
      if (item.kind === "forced-choice") for (const s of item.statements) widen(s.trait, -1, 1);
    }
  }
  // A forced-choice block gives each statement at most one of +1/-1, so only count one block-worth per trait appearance.
  return [...range.entries()]
    .filter(([trait]) => result.traits && trait in result.traits)
    .map(([trait, { min, max }]) => ({
      trait,
      percent: max === min ? 50 : Math.round((((result.traits![trait] ?? 0) - min) / (max - min)) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
}

/** Percentage 0-100, or null when there is nothing to mark (trait tests). */
export const percent = (points: number, max: number) => (max > 0 ? Math.round((points / max) * 100) : null);
