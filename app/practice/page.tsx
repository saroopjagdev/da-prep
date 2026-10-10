"use client";

import { useEffect, useMemo, useState } from "react";
import AreaTabs from "@/components/AreaTabs";
import Progress from "@/components/Progress";
import ScoreRing from "@/components/ScoreRing";
import { useSector } from "@/lib/prefs";
import SaveScorePrompt from "@/components/SaveScorePrompt";
import PracticeLimitCard from "@/components/PracticeLimitCard";
import RequireAccount from "@/components/RequireAccount";
import { usePracticeAllowance } from "@/components/usePracticeAllowance";
import { track } from "@/lib/funnel";
import { CATEGORY_INFO, questionsFor, type Category, type Question } from "@/lib/questions";
import { SECTOR_BY_ID } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import type { PracticeRecord } from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_INFO) as Category[];

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function PracticeInner() {
  const results = useCollection<PracticeRecord>("practice");
  const allow = usePracticeAllowance();
  const { sector } = useSector();
  const [category, setCategory] = useState<Category | null>(null);
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timed, setTimed] = useState(true);
  const [left, setLeft] = useState(0);
  const [log, setLog] = useState<{ q: Question; picked: number | null }[]>([]);

  const info = category ? CATEGORY_INFO[category] : null;
  const q = qs[i];
  const total = qs.length;

  const [beginError, setBeginError] = useState<string | null>(null);

  async function begin(c: Category) {
    if (allow.blocked) return;
    setBeginError(null);
    const r = await allow.begin();
    if (!r.ok) return setBeginError(r.message);
    setCategory(c);
    setQs(shuffle(questionsFor(c)));
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setLog([]);
    setLeft(CATEGORY_INFO[c].secondsPerQuestion);
  }

  function next(finalScore: number) {
    // Timed out without choosing: record it so it shows up in the review.
    if (picked === null) setLog((l) => [...l, { q, picked: null }]);
    if (i + 1 >= total) {
      setDone(true);
      if (results.items.length === 0) track("first_practice");
      results.update((p) => [
        { id: crypto.randomUUID(), date: new Date().toISOString(), category: category!, score: finalScore, total, testId: `quiz:${category}` },
        ...p,
      ]);
    } else {
      setI(i + 1);
      setPicked(null);
      setLeft(info!.secondsPerQuestion);
    }
  }

  const answered = picked !== null;
  const timeUp = timed && !answered && left <= 0;

  useEffect(() => {
    if (!category || done || !timed || answered) return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [category, done, timed, answered, i]);

  // Options are fixed per question; shuffle once per question so the answer position varies.
  const order = useMemo(() => (q ? shuffle(q.options.map((_, idx) => idx)) : []), [q]);
  const keepOrder = category !== "sjt";
  const display = keepOrder ? q?.options.map((_, idx) => idx) ?? [] : order;

  function choose(idx: number) {
    if (answered || timeUp) return;
    setPicked(idx);
    setLog((l) => [...l, { q, picked: idx }]);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  if (!category || !info) {
    return (
      <div className="space-y-6">
        <AreaTabs area="tests" current="/practice" />
        <div className="space-y-2">
          <h1 className="page-title">Practice tests</h1>
          <p className="lead max-w-2xl">
            Original practice questions in the styles employers often use. They won&apos;t match any real test, but the
            skills carry over.
          </p>
        </div>
        {allow.blocked && <PracticeLimitCard limit={allow.limit} />}
        {beginError && (
          <p role="alert" className="callout bg-coral-50 text-sm">
            {beginError}
          </p>
        )}
        {allow.known && !allow.unlimited && !allow.blocked && (
          <p className="text-sm text-muted">
            {allow.left} of {allow.limit} free practice tests left. Pro is unlimited.
          </p>
        )}
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="accent-brand-600" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
          Timed (per question)
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => begin(c)}
              disabled={allow.blocked}
              className="card card-hover animate-fade-up p-5 text-left disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="flex items-center gap-2 font-bold">
                {CATEGORY_INFO[c].label}
                {sector && SECTOR_BY_ID[sector].tests.includes(c) && (
                  <span className="rounded-md bg-mint-50 px-2 py-0.5 text-xs font-semibold text-mint-600">
                    Recommended for {SECTOR_BY_ID[sector].name.toLowerCase()}
                  </span>
                )}
              </span>
              <p className="mt-1 text-sm text-muted">{CATEGORY_INFO[c].blurb}</p>
              <p className="mt-3 inline-block rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {questionsFor(c).length} questions
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const missed = log.filter((l) => l.picked !== l.q.answer);
    return (
      <div className="mx-auto max-w-3xl space-y-8 py-4">
        <div className="space-y-5 text-center">
          <div className="flex justify-center">
            <ScoreRing value={score} max={total} size={150} label={`of ${total}`} />
          </div>
          <h1 className="page-title">{info.label}</h1>
          <p className="lead">
            {score / total >= 0.8
              ? "Excellent. You're well prepared for this format."
              : score / total >= 0.5
                ? "Good start. Review the ones you missed below and try again."
                : "Keep practising. Every attempt helps."}
          </p>
          <SaveScorePrompt />
          <div className="flex justify-center gap-3">
            <button onClick={() => begin(category)} className="btn btn-primary">
              Try again
            </button>
            <button onClick={() => setCategory(null)} className="btn btn-secondary">
              Choose another
            </button>
          </div>
        </div>

        {missed.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-bold">
              Review: {missed.length} to revisit
            </h2>
            <ul className="space-y-3">
              {missed.map(({ q: mq, picked: p }) => (
                <li key={mq.id} className="card space-y-2 p-4 text-sm">
                  <p className="whitespace-pre-line font-medium">{mq.prompt}</p>
                  <p className="text-coral-600">
                    <strong>Your answer:</strong> {p === null ? "No answer (time ran out)" : mq.options[p]}
                  </p>
                  <p className="text-mint-600">
                    <strong>Correct answer:</strong> {mq.options[mq.answer]}
                  </p>
                  <p className="callout bg-brand-50">{mq.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="callout bg-mint-50 text-center font-medium text-mint-600">Full marks. Nothing to review.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-muted">
          <p>
            {info.label}: question {i + 1} of {total}
          </p>
          {/* Announce only the key moments, not every tick. */}
          <p className="sr-only" aria-live="assertive">
            {timed && !answered ? (left === 10 ? "10 seconds left" : left <= 0 ? "Time is up" : "") : ""}
          </p>
          {timed && !answered && (
            <p
              role="timer"
              aria-label="Time left"
              className={`rounded-md px-3 py-1 text-base font-semibold tabular-nums ${
                left <= 10 ? "animate-pulse bg-coral-50 text-coral-600" : "bg-brand-50 text-brand-700"
              }`}
            >
              {Math.max(left, 0)}s
            </p>
          )}
        </div>
        <Progress value={i} max={total} label="Test progress" />
      </div>
      <div key={q.id} className="card animate-pop p-6">
        <p className="whitespace-pre-line text-lg font-medium leading-relaxed">{q.prompt}</p>
      </div>
      <ul className="space-y-2.5">
        {display.map((idx, n) => {
          const correct = idx === q.answer;
          const style = answered
            ? correct
              ? "border-mint-600 bg-mint-50"
              : idx === picked
                ? "border-coral-600 bg-coral-50"
                : "border-line bg-white opacity-60"
            : "border-line bg-white hover:border-brand-500";
          return (
            <li key={idx} className="animate-fade-up">
              <button
                onClick={() => choose(idx)}
                disabled={answered || timeUp}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm font-medium transition-all ${style}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-xs font-bold text-brand-700">
                  {String.fromCharCode(65 + n)}
                </span>
                {q.options[idx]}
                {answered && correct && <span className="sr-only"> (correct answer)</span>}
                {answered && !correct && idx === picked && <span className="sr-only"> (your answer, incorrect)</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {(answered || timeUp) && (
        <div className="animate-fade-up space-y-3" role="status">
          {timeUp && <p className="text-sm font-semibold text-coral-600">Time&apos;s up.</p>}
          <p className="callout bg-brand-50">
            <strong>{picked === q.answer ? "Correct. " : "Answer: " + q.options[q.answer] + ". "}</strong>
            {q.explanation}
          </p>
          <button onClick={() => next(score)} className="btn btn-primary">
            {i + 1 >= total ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Practice() {
  return (
    <RequireAccount what="take practice tests">
      <PracticeInner />
    </RequireAccount>
  );
}
