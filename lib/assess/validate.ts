import { servedCount } from "./sample";
import type { Item, Section, Stimulus, Test } from "./types";

const TRAIT_KINDS = new Set(["likert", "forced-choice"]);
const isInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n);

function validateStimulus(id: string, s: Stimulus): string[] {
  const p: string[] = [];
  if (s.type === "table") {
    if (s.columns.length < 2) p.push(`stimulus ${id}: table needs at least two columns`);
    s.rows.forEach((r, i) => r.length !== s.columns.length && p.push(`stimulus ${id}: row ${i} has ${r.length} cells for ${s.columns.length} columns`));
  } else if (s.type === "chart") {
    if (!s.labels.length || !s.series.length) p.push(`stimulus ${id}: chart needs labels and a series`);
    s.series.forEach((ser) => ser.values.length !== s.labels.length && p.push(`stimulus ${id}: series ${ser.name} has ${ser.values.length} values for ${s.labels.length} labels`));
  } else if (s.type === "email") {
    if (!s.from.trim() || !s.subject.trim() || !s.body.trim()) p.push(`stimulus ${id}: email needs a sender, subject and body`);
    s.table?.rows.forEach((r, i) => r.length !== s.table!.columns.length && p.push(`stimulus ${id}: table row ${i} has ${r.length} cells for ${s.table!.columns.length} columns`));
  } else if (!s.body.trim()) p.push(`stimulus ${id}: empty text`);
  return p;
}

export function validateItem(item: Item): string[] {
  const p: string[] = [];
  const tag = `item ${item.id}`;
  if (!item.prompt.trim()) p.push(`${tag}: empty prompt`);
  if (!TRAIT_KINDS.has(item.kind) && item.explanation.trim().length < 10) p.push(`${tag}: explanation too short`);
  switch (item.kind) {
    case "mcq":
      if (item.options.length < 2) p.push(`${tag}: needs at least two options`);
      if (new Set(item.options).size !== item.options.length) p.push(`${tag}: duplicate options`);
      if (!isInt(item.answer) || item.answer < 0 || item.answer >= item.options.length) p.push(`${tag}: answer out of range`);
      break;
    case "tf-cannot-say":
      if (![0, 1, 2].includes(item.answer)) p.push(`${tag}: answer must be 0, 1 or 2`);
      break;
    case "most-least":
      if (item.options.length < 3) p.push(`${tag}: needs at least three options`);
      if (item.most === item.least) p.push(`${tag}: most and least must differ`);
      for (const k of [item.most, item.least]) if (!isInt(k) || k < 0 || k >= item.options.length) p.push(`${tag}: most/least out of range`);
      break;
    case "rate-each":
      if (item.actions.length < 2) p.push(`${tag}: needs at least two actions`);
      if (item.ratings.length !== item.actions.length) p.push(`${tag}: ratings must match actions`);
      if (!item.ratings.every((r) => isInt(r) && r >= 0 && r <= 3)) p.push(`${tag}: ratings must be integers 0-3`);
      break;
    case "rank": {
      const n = item.options.length;
      if (n < 3) p.push(`${tag}: needs at least three options`);
      const sorted = [...item.order].sort((a, b) => a - b);
      if (sorted.length !== n || !sorted.every((v, i) => v === i)) p.push(`${tag}: order must be a permutation of the options`);
      break;
    }
    case "numeric":
      if (!Number.isFinite(item.answer)) p.push(`${tag}: answer must be a number`);
      if (item.tolerance !== undefined && !(item.tolerance >= 0)) p.push(`${tag}: tolerance must be zero or more`);
      break;
    case "written":
      if (item.checklist.length < 2) p.push(`${tag}: needs a checklist of at least two points`);
      break;
    case "likert":
      if (!item.trait.trim()) p.push(`${tag}: missing trait`);
      break;
    case "forced-choice":
      if (item.statements.length < 3) p.push(`${tag}: needs at least three statements`);
      if (item.statements.some((s) => !s.trait.trim() || !s.text.trim())) p.push(`${tag}: statement missing text or trait`);
      break;
  }
  return p;
}

export function validateSection(section: Section): string[] {
  const p: string[] = [];
  if (!section.items.length) p.push(`section ${section.id}: no items`);
  if ((section.timing.mode === "section" || section.timing.mode === "item") && !(section.timing.seconds > 0)) p.push(`section ${section.id}: timing must be positive`);
  if (section.adaptive && (section.adaptive.count < 1 || section.adaptive.count > section.items.length)) {
    p.push(`section ${section.id}: adaptive count must be between 1 and the pool size`);
  }
  if (section.adaptive && section.allowBack) p.push(`section ${section.id}: adaptive sections cannot allow going back`);
  for (const [id, s] of Object.entries(section.stimuli ?? {})) p.push(...validateStimulus(id, s));
  for (const item of section.items) {
    p.push(...validateItem(item));
    if (item.stimulus && !section.stimuli?.[item.stimulus]) p.push(`item ${item.id}: unknown stimulus ${item.stimulus}`);
  }
  return p;
}

export function validateTest(test: Test): string[] {
  const p: string[] = [];
  if (!test.sections.length) p.push(`test ${test.id}: no sections`);
  if (!test.sources.length) p.push(`test ${test.id}: no sources`);
  const ids = test.sections.flatMap((s) => s.items.map((i) => i.id));
  if (new Set(ids).size !== ids.length) p.push(`test ${test.id}: duplicate item ids`);
  for (const s of test.sections) {
    p.push(...validateSection(s));
    for (const i of s.items) {
      const isTrait = TRAIT_KINDS.has(i.kind);
      if (test.kind === "ability" && isTrait) p.push(`item ${i.id}: trait item in an ability test`);
      if (test.kind === "trait" && !isTrait) p.push(`item ${i.id}: ability item in a trait test`);
    }
  }
  return p;
}

/** Declared total working time in seconds (sections only; item-timed sections count per served item). */
export function totalSeconds(test: Test): number {
  return test.sections.reduce((sum, s) => {
    if (s.timing.mode === "section") return sum + s.timing.seconds;
    if (s.timing.mode === "item") return sum + s.timing.seconds * servedCount(s);
    return sum;
  }, 0);
}
