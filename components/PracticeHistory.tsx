"use client";

import Link from "next/link";
import ProgressBar from "@/components/Progress";
import ScoreTrend from "@/components/ScoreTrend";
import { CATEGORY_INFO, type Category } from "@/lib/questions";
import { historyByTest, percentOf, skillSummary, startOfWeek, takenSince, weakestSections } from "@/lib/progress";
import type { PracticeRecord } from "@/lib/types";

const quizLabel = (key: string) => CATEGORY_INFO[key as Category]?.label;
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mins = (s?: number) => (s && s > 0 ? `${Math.max(1, Math.round(s / 60))} min` : null);

/** Every saved practice result: totals, where you are strongest and weakest, and each test's scores over time. */
export default function PracticeHistory({ items }: { items: PracticeRecord[] }) {
  if (items.length === 0) return null;
  const tests = historyByTest(items, quizLabel);
  const skills = skillSummary(items);
  const overall = Math.round(items.reduce((n, r) => n + percentOf(r), 0) / items.length);
  const thisWeek = takenSince(items, startOfWeek());
  const weakest = skills.length >= 2 ? skills[0] : null;
  const strongest = skills.length >= 2 ? skills[skills.length - 1] : null;

  return (
    <section className="space-y-5" aria-labelledby="practice-history">
      <h2 id="practice-history" className="text-lg font-bold">
        Practice tests
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Tests taken</p>
          <p className="mt-1 text-3xl font-bold">{items.length}</p>
          <p className="text-xs text-muted">{thisWeek} this week</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Average score</p>
          <p className="mt-1 text-3xl font-bold">{overall}%</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Practise next</p>
          <p className="mt-1 text-xl font-bold">{weakest ? weakest.skill : "Take a few more"}</p>
          {weakest && strongest && <p className="text-xs text-muted">Strongest: {strongest.skill}</p>}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="card space-y-3 p-4">
          <h3 className="font-semibold">By skill, weakest first</h3>
          <ul className="space-y-3">
            {skills.map((s) => (
              <li key={s.skill} className="space-y-1">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-medium">{s.skill}</span>
                  <span className="text-muted">
                    {s.avgPct}% average · latest {s.recentPct}% · {s.attempts} attempt{s.attempts === 1 ? "" : "s"}
                  </span>
                </div>
                <ProgressBar value={s.avgPct} label={`${s.skill} average`} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="space-y-4">
        {tests.map((t) => {
          const sectionsWeak = weakestSections(t.attempts);
          const newestFirst = [...t.attempts].reverse();
          return (
            <li key={t.key} className="card space-y-3 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted">
                  Last {percentOf(t.last)}% · best {t.bestPct}% · average {t.avgPct}% · {t.attempts.length} attempt{t.attempts.length === 1 ? "" : "s"}
                </p>
              </div>
              <ScoreTrend points={t.attempts.map((a) => ({ pct: percentOf(a), date: a.date }))} label={`${t.name} scores over time`} />
              {t.change !== null && (
                <p className={`text-sm font-medium ${t.change >= 0 ? "text-mint-600" : "text-coral-600"}`}>
                  {t.change === 0 ? "Level with your first attempt." : `${t.change > 0 ? "Up" : "Down"} ${Math.abs(t.change)} points since your first attempt.`}
                </p>
              )}
              {sectionsWeak.length >= 2 && (
                <p className="text-sm text-muted">
                  Weakest part: <span className="font-medium text-ink">{sectionsWeak[0].title}</span> ({sectionsWeak[0].pct}%). Strongest:{" "}
                  <span className="font-medium text-ink">{sectionsWeak[sectionsWeak.length - 1].title}</span> ({sectionsWeak[sectionsWeak.length - 1].pct}%).
                </p>
              )}
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-brand-700">All attempts</summary>
                <ul className="mt-2 divide-y divide-line text-sm">
                  {newestFirst.map((a) => (
                    <li key={a.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5">
                      <span>
                        {day(a.date)}
                        {a.via && <span className="text-muted"> · {a.via}</span>}
                      </span>
                      <span className="tabular-nums text-muted">
                        {a.score}/{a.total} ({percentOf(a)}%){mins(a.seconds) ? ` · ${mins(a.seconds)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-muted">
        <Link href="/tests" className="font-semibold text-brand-700 underline underline-offset-4">
          Take another practice test
        </Link>
      </p>
    </section>
  );
}
