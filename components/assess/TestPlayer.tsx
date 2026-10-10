"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PracticeLimitCard from "@/components/PracticeLimitCard";
import RequireAccount from "@/components/RequireAccount";
import { usePracticeAllowance } from "@/components/usePracticeAllowance";
import { track } from "@/lib/funnel";
import Runner from "@/components/assess/Runner";
import StimulusView from "@/components/assess/StimulusView";
import { describeKey, describeResponse } from "@/lib/assess/describe";
import { percent, scoreItem, traitProfile } from "@/lib/assess/score";
import { recordFor } from "@/lib/progress";
import type { Test, TestResult } from "@/lib/assess/types";
import { useCollection } from "@/lib/store";
import type { PracticeRecord } from "@/lib/types";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Results({ test, result, onRetry, after }: { test: Test; result: TestResult; onRetry: () => void; after?: React.ReactNode }) {
  const pct = percent(result.points, result.max);
  const profile = test.kind === "trait" ? traitProfile(test, result) : [];
  const missed = test.sections.flatMap((s) =>
    s.items
      .filter((i) => i.id in result.responses)
      .map((item) => ({ item, section: s, score: scoreItem(item, result.responses[item.id]) }))
      .filter((x) => x.score.max > 0 && x.score.points < x.score.max),
  );

  const written = test.sections.flatMap((s) => s.items.filter((i) => i.kind === "written" && i.id in result.responses).map((item) => ({ item })));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="page-title">{test.name}</h1>
        {pct !== null ? (
          <>
            <p className="text-5xl font-bold tabular-nums">
              {result.points % 1 === 0 ? result.points : result.points.toFixed(1)} / {result.max}
            </p>
            <p className="lead">{pct}% correct</p>
          </>
        ) : (
          <p className="lead">Your work-style profile</p>
        )}
      </div>

      {pct !== null && (
        <>
          <ul className="space-y-1 text-sm">
            {result.sections.map((s) => (
              <li key={s.sectionId} className="flex justify-between border-b border-line py-1.5">
                <span>
                  {test.sections.find((x) => x.id === s.sectionId)?.title}: {s.answered} of {s.total} answered
                </span>
                <span className="tabular-nums text-muted">{mmss(s.secondsUsed)} used</span>
              </li>
            ))}
          </ul>
          <p className="callout bg-brand-50 text-sm">
            Real employers compare your score with other candidates (a norm group) and set their own pass marks, and
            neither is published. We can show how many you got right, but not whether it would pass.
          </p>
        </>
      )}

      {profile.length > 0 && (
        <section className="space-y-3">
          <ul className="space-y-3">
            {profile.map((p) => (
              <li key={p.trait}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{p.trait}</span>
                  <span className="tabular-nums">{p.percent}</span>
                </div>
                <div role="meter" aria-label={p.trait} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.percent} className="h-2.5 rounded-full bg-brand-50">
                  <div className="h-full rounded-full" style={{ width: `${p.percent}%`, background: "#2563eb" }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="callout bg-brand-50 text-sm">
            There are no right or wrong answers, and this is a short practice questionnaire, not a validated personality
            assessment. Use it to think about which strengths you can back up with examples. Employers weigh these
            questionnaires differently, and honest answers matter more than a particular profile.
          </p>
        </section>
      )}

      {written.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold">Your written replies</h2>
          <p className="text-sm text-muted">These aren&apos;t marked automatically. Compare each reply with the checklist.</p>
          <ul className="space-y-3">
            {written.map(({ item }) => (
              <li key={item.id} className="card space-y-2 p-4 text-sm">
                <p className="whitespace-pre-line font-medium">{item.prompt}</p>
                <p className="whitespace-pre-line rounded-md bg-soft p-3">{describeResponse(item, result.responses[item.id])}</p>
                <p className="font-semibold">A strong reply would:</p>
                <p className="whitespace-pre-line">{describeKey(item)}</p>
                <p className="callout bg-brand-50">{item.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {missed.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold">Review: {missed.length} to revisit</h2>
          <ul className="space-y-3">
            {missed.map(({ item, section, score }) => {
              const stim = item.stimulus ? section.stimuli?.[item.stimulus] : undefined;
              return (
                <li key={item.id} className="card space-y-2 p-4 text-sm">
                  {stim && <StimulusView stimulus={stim} />}
                  <p className="whitespace-pre-line font-medium">{item.prompt}</p>
                  <p className="whitespace-pre-line text-coral-600">
                    <strong>Your answer:</strong> {describeResponse(item, result.responses[item.id])}
                  </p>
                  <p className="whitespace-pre-line text-mint-600">
                    <strong>Best answer:</strong> {describeKey(item)}
                  </p>
                  {score.max > 1 && (
                    <p className="text-muted">
                      You scored {score.points} of {score.max} on this item.
                    </p>
                  )}
                  <p className="callout bg-brand-50">{item.explanation}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {pct !== null && missed.length === 0 && (
        <p className="callout bg-mint-50 text-center font-medium text-mint-600">Full marks on every question you reached.</p>
      )}

      {after}
      <div className="flex justify-center gap-3">
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
        <Link href="/tests" className="btn btn-secondary">
          All tests
        </Link>
      </div>
    </div>
  );
}

function Player({ test }: { test: Test }) {
  const [result, setResult] = useState<TestResult | null>(null);
  const [run, setRun] = useState(0);
  const practice = useCollection<PracticeRecord>("practice");
  const router = useRouter();
  const allow = usePracticeAllowance();

  function done(r: TestResult) {
    setResult(r);
    if (test.kind === "ability") {
      if (practice.items.length === 0) track("first_practice");
      practice.update((p) => [recordFor(test, r), ...p]);
    }
  }

  if (result) {
    // The section with the lowest share of marks, when the test has more than one to compare.
    const scored = result.sections.filter((s) => s.max > 0);
    const weakest = scored.length > 1 ? scored.reduce((a, b) => (a.points / a.max <= b.points / b.max ? a : b)) : null;
    const weakestTitle = weakest ? test.sections.find((x) => x.id === weakest.sectionId)?.title : undefined;
    return (
      <Results
        test={test}
        result={result}
        onRetry={() => {
          setResult(null);
          setRun((n) => n + 1);
        }}
        after={
          allow.known && !allow.unlimited ? (
            <aside className="callout bg-brand-50 text-sm" aria-label="Your free practice tests">
              <p className="font-semibold">
                {allow.left > 0
                  ? `${allow.left} free practice test${allow.left === 1 ? "" : "s"} left.`
                  : "You have used your free practice tests."}
              </p>
              {weakest && weakestTitle && (
                <p className="mt-1">
                  Your weakest section was <strong>{weakestTitle}</strong> ({percent(weakest.points, weakest.max)}%). Retaking this kind of test is the quickest way to improve it.
                </p>
              )}
              <p className="mt-1 text-muted">Pro gives unlimited practice tests, AI mock interviews marked out of 100, and every firm mock process.</p>
              <Link href="/pricing" className="btn btn-primary mt-3">
                See Pro
              </Link>
            </aside>
          ) : null
        }
      />
    );
  }
  if (allow.blocked) return <PracticeLimitCard limit={allow.limit} />;
  return <Runner key={run} test={test} onComplete={done} onExit={() => router.push("/tests")} onBegin={allow.begin} />;
}

export default function TestPlayer({ test }: { test: Test }) {
  return (
    <RequireAccount what="take this practice test">
      <Player test={test} />
    </RequireAccount>
  );
}
