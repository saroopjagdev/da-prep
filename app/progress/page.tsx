"use client";

import PracticeHistory from "@/components/PracticeHistory";
import RequireAccount from "@/components/RequireAccount";
import Link from "next/link";
import ProgressBar from "@/components/Progress";
import { STAGE_LABEL } from "@/lib/interview";
import { useCollection } from "@/lib/store";
import type { PracticeRecord, SessionRecord } from "@/lib/types";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const STAR_KEYS = ["situation", "task", "action", "result"] as const;

function ProgressInner() {
  const sessions = useCollection<SessionRecord>("sessions");
  const practice = useCollection<PracticeRecord>("practice");

  const list = sessions.items;
  const chronological = [...list].reverse();
  const recent = chronological.slice(-10);
  const avg = list.length ? Math.round(list.reduce((s, x) => s + x.overall, 0) / list.length) : null;
  const best = list.length ? Math.max(...list.map((s) => s.overall)) : null;
  const change = chronological.length >= 2 ? chronological[chronological.length - 1].overall - chronological[0].overall : null;

  // How often each STAR part is present across every answer that has detailed feedback.
  const answers = list.flatMap((s) => s.turns.filter((t) => t.star));
  const coverage = STAR_KEYS.map((k) => ({
    key: k,
    pct: answers.length ? Math.round((answers.filter((t) => t.star![k]).length / answers.length) * 100) : 0,
  }));
  const weakest = answers.length >= 3 ? [...coverage].sort((a, b) => a.pct - b.pct)[0] : null;

  const empty = sessions.loaded && practice.loaded && !list.length && !practice.items.length;

  return (
    <div className="space-y-8">
      <h1 className="page-title">Your progress</h1>
      {empty && (
        <p className="text-muted">
          Nothing yet. Try a <Link href="/interview" className="underline">mock interview</Link> or a{" "}
          <Link href="/practice" className="underline">practice test</Link>.
        </p>
      )}

      {list.length > 0 && (
        <>
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Interview summary">
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Interviews</p>
              <p className="mt-1 text-3xl font-bold">{list.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Average / best</p>
              <p className="mt-1 text-3xl font-bold">
                {avg} <span className="text-base font-medium text-muted">/ {best}</span>
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Since your first</p>
              <p className={`mt-1 text-3xl font-bold ${change === null ? "" : change >= 0 ? "text-mint-600" : "text-coral-600"}`}>
                {change === null ? "n/a" : `${change >= 0 ? "+" : ""}${change}`}
              </p>
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <h2 className="font-bold">Recent scores</h2>
            <ul className="space-y-2" aria-label="Recent interview scores, oldest first">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center gap-3 text-sm">
                  <span className="w-14 shrink-0 text-muted">{fmt(s.date)}</span>
                  <ProgressBar value={s.overall} label={`Score ${s.overall} out of 100`} className="flex-1" />
                  <span className="w-10 text-right font-semibold">{s.overall}</span>
                </li>
              ))}
            </ul>
          </section>

          {answers.length > 0 && (
            <section className="card space-y-4 p-5">
              <div>
                <h2 className="font-bold">STAR coverage</h2>
                <p className="text-sm text-muted">
                  How often each part appeared across {answers.length} answers.
                  {weakest && (
                    <>
                      {" "}
                      Focus next on the <strong className="text-ink">{weakest.key}</strong>.
                    </>
                  )}
                </p>
              </div>
              <ul className="space-y-2">
                {coverage.map((c) => (
                  <li key={c.key} className="flex items-center gap-3 text-sm">
                    <span className="w-20 shrink-0 capitalize">{c.key}</span>
                    <ProgressBar value={c.pct} label={`${c.key} present in ${c.pct} percent of answers`} className="flex-1" />
                    <span className="w-10 text-right font-semibold">{c.pct}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="font-bold">All interviews</h2>
            <ul className="space-y-3">
              {list.map((s) => (
                <li key={s.id} className="card">
                  <details>
                    <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4">
                      <span>
                        <span className="font-semibold">
                          {fmt(s.date)} · {STAGE_LABEL[s.stage] ?? s.stage} · {s.mode}
                        </span>
                        <span className="block text-sm text-muted">{s.jobSnippet}…</span>
                      </span>
                      <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">{s.overall}/100</span>
                    </summary>
                    <div className="space-y-4 border-t border-line p-4 text-sm">
                      <p>{s.summary}</p>
                      {(s.strengths?.length || s.improvements?.length) && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {s.strengths && (
                            <div>
                              <p className="font-semibold text-mint-600">What worked</p>
                              <ul className="mt-1 list-disc space-y-1 pl-5">
                                {s.strengths.map((x, i) => <li key={i}>{x}</li>)}
                              </ul>
                            </div>
                          )}
                          {s.improvements && (
                            <div>
                              <p className="font-semibold text-sun-600">To improve</p>
                              <ul className="mt-1 list-disc space-y-1 pl-5">
                                {s.improvements.map((x, i) => <li key={i}>{x}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {s.nextSteps?.length ? (
                        <div>
                          <p className="font-semibold">Next things to practise</p>
                          <ol className="mt-1 list-decimal space-y-1 pl-5">
                            {s.nextSteps.map((x, i) => <li key={i}>{x}</li>)}
                          </ol>
                        </div>
                      ) : null}
                      {s.turns.map((t, i) => (
                        <div key={i} className="space-y-1.5 rounded-lg bg-background p-3">
                          <p className="font-semibold">
                            Q{i + 1}. {t.question} <span className="font-normal text-muted">({t.score}/10)</span>
                          </p>
                          <p className="text-muted">
                            <strong className="text-ink">You said:</strong> {t.answer}
                          </p>
                          {t.feedback && <p>{t.feedback}</p>}
                          {t.star && (
                            <p className="flex flex-wrap gap-1.5 text-xs font-semibold">
                              {STAR_KEYS.map((k) => (
                                <span
                                  key={k}
                                  className={`rounded-md px-2 py-0.5 capitalize ${t.star![k] ? "bg-mint-50 text-mint-600" : "bg-coral-50 text-coral-600"}`}
                                >
                                  {t.star![k] ? "✓" : "✗"} {k}
                                </span>
                              ))}
                            </p>
                          )}
                          {t.betterAnswer && (
                            <p className="callout bg-brand-50">
                              <strong>Stronger answer:</strong> {t.betterAnswer}
                            </p>
                          )}
                        </div>
                      ))}
                      <button
                        className="text-xs font-semibold text-coral-600 underline"
                        onClick={() => {
                          if (confirm("Delete this interview from your history?")) {
                            sessions.update((p) => p.filter((x) => x.id !== s.id));
                          }
                        }}
                      >
                        Delete this interview
                      </button>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <PracticeHistory items={practice.items} />
    </div>
  );
}

export default function Progress() {
  return (
    <RequireAccount what="see your progress">
      <ProgressInner />
    </RequireAccount>
  );
}
