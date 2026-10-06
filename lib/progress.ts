// Practice test history: group saved results by test, work out trends, and roll them up into skills so the Progress page
// can say where someone is improving and what to practise next. Pure functions over the saved PracticeRecord list.

import type { Test, TestResult } from "@/lib/assess/types";
import type { PracticeRecord } from "@/lib/types";

/** A saved result for one finished test (ability tests only: work-style questionnaires have no score). */
export function recordFor(test: Test, result: TestResult, via?: string): PracticeRecord {
  const sections = result.sections
    .filter((s) => s.max > 0)
    .map((s) => ({ id: s.sectionId, title: test.sections.find((x) => x.id === s.sectionId)?.title ?? s.sectionId, points: Math.round(s.points * 10) / 10, max: s.max }));
  return {
    id: crypto.randomUUID(),
    date: result.finishedAt,
    category: test.name,
    score: Math.round(result.points * 10) / 10,
    total: result.max,
    testId: test.id,
    sections,
    seconds: result.sections.reduce((n, s) => n + s.secondsUsed, 0),
    ...(via ? { via } : {}),
  };
}

export const percentOf = (r: Pick<PracticeRecord, "score" | "total">) => (r.total > 0 ? Math.round((100 * r.score) / r.total) : 0);

const QUIZ_KEYS = ["sjt", "numerical", "verbal", "logical"];

/** The broad skill a result belongs to, from its test id, or for older records from the quiz category or test name. */
export function skillOf(r: Pick<PracticeRecord, "testId" | "category">): string {
  const id = r.testId?.startsWith("quiz:") ? r.testId.slice(5) : (r.testId ?? (QUIZ_KEYS.includes(r.category) ? r.category : ""));
  const text = `${id} ${r.category}`.toLowerCase();
  if (/critical/.test(text)) return "Critical reasoning";
  if (/verbal|scales-verbal/.test(text)) return "Verbal reasoning";
  if (/numerical/.test(text)) return "Numerical reasoning";
  if (/inductive|deductive|switch|logical|sequence/.test(text)) return "Logical reasoning";
  if (/sjt|situational|scenario|simulat|day in|day on/.test(text)) return "Situational judgement";
  return "Other";
}

/** What to call a result in lists: the test name, or "Quick quiz: ..." for the short quiz. */
export function nameOf(r: Pick<PracticeRecord, "testId" | "category">, quizLabel: (key: string) => string | undefined): string {
  const quiz = r.testId?.startsWith("quiz:") ? r.testId.slice(5) : !r.testId && QUIZ_KEYS.includes(r.category) ? r.category : null;
  return quiz ? `Quick quiz: ${quizLabel(quiz) ?? quiz}` : r.category;
}

export type TestHistory = {
  key: string;
  name: string;
  skill: string;
  /** Oldest first. */
  attempts: PracticeRecord[];
  last: PracticeRecord;
  bestPct: number;
  avgPct: number;
  /** Points change from the first attempt to the latest, or null with a single attempt. */
  change: number | null;
};

const byDate = (a: PracticeRecord, b: PracticeRecord) => Date.parse(a.date) - Date.parse(b.date);

/** One entry per test, most recently taken first. */
export function historyByTest(items: PracticeRecord[], quizLabel: (key: string) => string | undefined): TestHistory[] {
  const groups = new Map<string, PracticeRecord[]>();
  for (const r of items) {
    const key = r.testId ?? r.category;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()]
    .map(([key, rs]): TestHistory => {
      const attempts = [...rs].sort(byDate);
      const pcts = attempts.map(percentOf);
      return {
        key,
        name: nameOf(attempts[0], quizLabel),
        skill: skillOf(attempts[0]),
        attempts,
        last: attempts[attempts.length - 1],
        bestPct: Math.max(...pcts),
        avgPct: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
        change: attempts.length >= 2 ? pcts[pcts.length - 1] - pcts[0] : null,
      };
    })
    .sort((a, b) => byDate(b.last, a.last));
}

export type SkillSummary = { skill: string; attempts: number; avgPct: number; recentPct: number };

/** Average score per skill, weakest first. `recentPct` is the average of the latest three attempts in that skill. */
export function skillSummary(items: PracticeRecord[]): SkillSummary[] {
  const groups = new Map<string, PracticeRecord[]>();
  for (const r of items) groups.set(skillOf(r), [...(groups.get(skillOf(r)) ?? []), r]);
  return [...groups.entries()]
    .filter(([skill]) => skill !== "Other")
    .map(([skill, rs]): SkillSummary => {
      const sorted = [...rs].sort(byDate);
      const avg = (xs: PracticeRecord[]) => Math.round(xs.reduce((n, r) => n + percentOf(r), 0) / xs.length);
      return { skill, attempts: rs.length, avgPct: avg(rs), recentPct: avg(sorted.slice(-3)) };
    })
    .sort((a, b) => a.avgPct - b.avgPct);
}

/** Results taken in the current ISO week's Monday-to-Sunday window. */
export function takenSince(items: PracticeRecord[], since: Date): number {
  return items.filter((r) => Date.parse(r.date) >= since.getTime()).length;
}

/** Marked sections across a test's attempts, as a percentage, weakest first (only for tests with two or more sections). */
export function weakestSections(attempts: PracticeRecord[]): { title: string; pct: number }[] {
  const totals = new Map<string, { points: number; max: number }>();
  for (const a of attempts) {
    if ((a.sections?.length ?? 0) < 2) continue;
    for (const s of a.sections!) {
      const t = totals.get(s.title) ?? { points: 0, max: 0 };
      totals.set(s.title, { points: t.points + s.points, max: t.max + s.max });
    }
  }
  return [...totals.entries()].map(([title, t]) => ({ title, pct: Math.round((100 * t.points) / t.max) })).sort((a, b) => a.pct - b.pct);
}

/** Monday 00:00 (local time) of the week containing `now`. */
export function startOfWeek(now = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
