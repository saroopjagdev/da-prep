"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Runner from "@/components/assess/Runner";
import QaStage, { type Turn } from "@/components/mock/QaStage";
import { postJson } from "@/lib/api";
import { percent, traitProfile } from "@/lib/assess/score";
import type { Test, TestResult } from "@/lib/assess/types";
import type { MockProcess, MockStage } from "@/lib/mockprocess/types";
import type { MockScoreOutput } from "@/lib/mockprocess/score";
import { useCollection } from "@/lib/store";
import type { MockRunRecord } from "@/lib/types";

type StageResult =
  | { kind: "info" }
  | { kind: "test"; name: string; ability: boolean; points: number; max: number; profile: { trait: string; percent: number }[] }
  | { kind: "qa"; name: string; mode: "video" | "interview" | "exercise"; turns: Turn[]; score?: MockScoreOutput; error?: string; pending?: boolean };

type Saved = { stageIdx: number; results: StageResult[]; startedAt: string; scoredOnce: boolean };
const storageKey = (firm: string) => `da-prep:mock-run:${firm}`;

function describeStage(s: MockStage) {
  if (s.kind === "info") return "Read";
  if (s.kind === "test") return "Test";
  return s.mode === "video" ? "Video answers" : s.mode === "exercise" ? "Exercise" : "Interview";
}

// `tests` holds only the tests this mock uses, passed from the server so the browser doesn't build every bank.
export default function MockRunner({ mock, firmName, tests }: { mock: MockProcess; firmName: string; tests: Record<string, Test> }) {
  // Start on the intro straight away (it doesn't depend on saved progress), so the page doesn't jump on load.
  const [phase, setPhase] = useState<"intro" | "stage" | "report">("intro");
  const [stageIdx, setStageIdx] = useState(0);
  const [results, setResults] = useState<StageResult[]>([]);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [saved, setSaved] = useState<Saved | null>(null);
  const scoredOnce = useRef(false);
  const savedRecord = useRef(false);
  const records = useCollection<MockRunRecord>("mocks");

  useEffect(() => {
    let s: Saved | null = null;
    try {
      const raw = localStorage.getItem(storageKey(mock.firm));
      s = raw ? (JSON.parse(raw) as Saved) : null;
    } catch {
      /* ignore */
    }
    // Reading localStorage needs the browser, so this cannot be initial state without a hydration mismatch.
    setSaved(s && s.stageIdx < mock.stages.length ? s : null);
    setPhase("intro");
  }, [mock]);

  useEffect(() => {
    if (phase !== "stage" && phase !== "report") return;
    try {
      // Pending scores cannot resume, so they are stored without the pending flag and can be retried.
      const clean = results.map((r) => (r.kind === "qa" ? { ...r, pending: false } : r));
      localStorage.setItem(storageKey(mock.firm), JSON.stringify({ stageIdx, results: clean, startedAt, scoredOnce: scoredOnce.current } satisfies Saved));
    } catch {
      /* ignore */
    }
  }, [phase, stageIdx, results, startedAt, mock.firm]);

  const advance = (idx: number, next: StageResult[]) => {
    setResults(next);
    if (idx + 1 >= mock.stages.length) setPhase("report");
    else {
      setStageIdx(idx + 1);
      setPhase("stage");
    }
  };

  async function score(index: number, stage: Extract<MockStage, { kind: "qa" }>, turns: Turn[], first: boolean) {
    try {
      const out = await postJson<MockScoreOutput>("/api/mock/score", {
        firmName,
        stageName: stage.name,
        mode: stage.mode,
        framework: mock.framework,
        turns: turns.map((t) => ({ prompt: t.prompt.slice(0, 2500), answer: t.answer })),
        first,
      });
      setResults((r) => r.map((x, i) => (i === index && x.kind === "qa" ? { ...x, score: out, pending: false, error: undefined } : x)));
    } catch (e) {
      setResults((r) => r.map((x, i) => (i === index && x.kind === "qa" ? { ...x, pending: false, error: (e as Error).message } : x)));
    }
  }

  function onTest(idx: number, stage: Extract<MockStage, { kind: "test" }>, r: TestResult) {
    const test = tests[stage.testId];
    const next = [...results.slice(0, idx), { kind: "test", name: stage.name, ability: test.kind === "ability", points: r.points, max: r.max, profile: test.kind === "trait" ? traitProfile(test, r) : [] } as StageResult];
    advance(idx, next);
  }

  function onQa(idx: number, stage: Extract<MockStage, { kind: "qa" }>, turns: Turn[]) {
    const first = !scoredOnce.current;
    scoredOnce.current = true;
    const next = [...results.slice(0, idx), { kind: "qa", name: stage.name, mode: stage.mode, turns, pending: true } as StageResult];
    advance(idx, next);
    void score(idx, stage, turns, first);
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey(mock.firm));
    } catch {
      /* ignore */
    }
    scoredOnce.current = false;
    savedRecord.current = false;
    setResults([]);
    setStageIdx(0);
    setStartedAt(new Date().toISOString());
    setSaved(null);
  }

  // Save a compact record once every stage has been scored (or failed).
  const settled = phase === "report" && results.every((r) => r.kind !== "qa" || Boolean(r.score || r.error));
  type Scored = { name: string; kind: "test" | "qa"; score?: number };
  const scored = results.flatMap<Scored>((r) => {
    if (r.kind === "test" && r.ability) return [{ name: r.name, kind: "test", score: percent(r.points, r.max) ?? undefined }];
    if (r.kind === "qa") return [{ name: r.name, kind: "qa", score: r.score ? Math.round(r.score.overall) : undefined }];
    return [];
  });
  const numeric = scored.map((s) => s.score).filter((s): s is number => s !== undefined);
  const overall = numeric.length ? Math.round(numeric.reduce((a, b) => a + b, 0) / numeric.length) : undefined;

  useEffect(() => {
    if (!settled || savedRecord.current) return;
    savedRecord.current = true;
    records.update((p) => [
      { id: crypto.randomUUID(), date: new Date().toISOString(), firm: mock.firm, title: mock.title, overall, stages: scored.map(({ name, kind, score }) => ({ name, kind, score })) },
      ...p,
    ]);
    // Runs once when the report settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled]);

  // A scoring request can be lost (tab closed, reload, network drop), leaving a stage with neither a score nor an
  // error. When the report opens, score any such stage again so it never shows as an empty card.
  useEffect(() => {
    if (phase !== "report") return;
    results.forEach((r, i) => {
      const stage = mock.stages[i];
      if (r.kind !== "qa" || stage.kind !== "qa" || r.score || r.error || r.pending) return;
      setResults((all) => all.map((x, j) => (j === i && x.kind === "qa" ? { ...x, pending: true } : x)));
      void score(i, stage, r.turns, false);
    });
    // score() only reads values that are stable for a run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, results]);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="page-title">{mock.title}</h1>
        {mock.notes.map((n) => (
          <p key={n} className="callout bg-brand-50 text-sm">{n}</p>
        ))}
        <p className="text-sm text-muted">
          Marked against: <strong>{mock.framework.name}</strong>. Each answer is scored by AI, which can be wrong or
          inconsistent, so treat the feedback as practice rather than a prediction of the firm&apos;s decision.
        </p>
        <ol className="space-y-2">
          {mock.stages.map((s, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white p-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>
              <span className="flex-1 font-medium">{s.name}</span>
              <span className="chip text-xs">{describeStage(s)}</span>
              {s.note && <span className="chip text-xs">Approximate</span>}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3">
          {saved ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setResults(saved.results);
                  setStageIdx(saved.stageIdx);
                  setStartedAt(saved.startedAt);
                  scoredOnce.current = saved.scoredOnce;
                  setPhase("stage");
                }}
              >
                Resume at stage {saved.stageIdx + 1}
              </button>
              <button className="btn btn-secondary" onClick={() => { reset(); setPhase("stage"); }}>
                Start over
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => { reset(); setPhase("stage"); }}>
              Start the mock process
            </button>
          )}
          <Link href={`/employers/${mock.firm}`} className="btn btn-secondary">
            Read the {firmName} guide
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "stage") {
    const stage = mock.stages[stageIdx];
    const header = (
      <p className="mx-auto mb-3 max-w-3xl text-xs font-semibold text-muted">
        {firmName} mock process · stage {stageIdx + 1} of {mock.stages.length}
      </p>
    );
    if (stage.kind === "info") {
      return (
        <div className="mx-auto max-w-2xl space-y-4">
          {header}
          <h1 className="page-title">{stage.name}</h1>
          <p>{stage.summary}</p>
          {stage.tips.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {stage.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {stage.note && <p className="callout bg-brand-50 text-sm">{stage.note}</p>}
          <button className="btn btn-primary" onClick={() => advance(stageIdx, [...results.slice(0, stageIdx), { kind: "info" }])}>
            Continue
          </button>
        </div>
      );
    }
    if (stage.kind === "test") {
      const test = tests[stage.testId];
      return (
        <div>
          {header}
          <h2 className="mx-auto mb-2 max-w-3xl font-bold">{stage.name}</h2>
          {stage.note && <p className="callout mx-auto mb-3 max-w-3xl bg-brand-50 text-sm">{stage.note}</p>}
          <Runner key={stageIdx} test={test} onComplete={(r) => onTest(stageIdx, stage, r)} />
        </div>
      );
    }
    return (
      <div>
        {header}
        <QaStage key={stageIdx} stage={stage} onDone={(turns) => onQa(stageIdx, stage, turns)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="page-title">{mock.title}: report</h1>
        {overall !== undefined ? (
          <>
            <p className="text-5xl font-bold tabular-nums">{overall}</p>
            <p className="lead">average across scored stages</p>
          </>
        ) : (
          <p className="lead">{settled ? "No stages could be scored." : "Scoring your answers…"}</p>
        )}
      </div>
      <p className="callout bg-brand-50 text-sm">
        This is practice. Real employers use their own marking, norm groups and pass marks, none of which are published, so
        this average does not predict the firm&apos;s decision.
      </p>

      <ol className="space-y-4">
        {mock.stages.map((s, i) => {
          const r = results[i];
          if (!r || r.kind === "info") return null;
          return (
            <li key={i} className="card space-y-2 p-4 text-sm">
              <h2 className="font-bold">
                {i + 1}. {s.name}
              </h2>
              {r.kind === "test" && (
                <>
                  {r.ability ? (
                    <p>
                      Score: <strong>{r.points % 1 === 0 ? r.points : r.points.toFixed(1)} / {r.max}</strong> ({percent(r.points, r.max)}%)
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {r.profile.slice(0, 3).map((p) => (
                        <li key={p.trait} className="flex justify-between">
                          <span>{p.trait}</span>
                          <span className="tabular-nums">{p.percent}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.kind === "test" && s.note && <p className="text-xs text-muted">{s.note}</p>}
                </>
              )}
              {r.kind === "qa" && (
                <>
                  {r.pending && <p role="status" className="text-muted">Scoring…</p>}
                  {r.error && (
                    <p role="alert" className="text-coral-600">
                      {r.error}
                      {!/free interviews|practice limit/.test(r.error) && (
                        <>
                          {" "}
                          <button
                            className="underline"
                            onClick={() => {
                              setResults((all) => all.map((x, j) => (j === i && x.kind === "qa" ? { ...x, pending: true, error: undefined } : x)));
                              savedRecord.current = false;
                              void score(i, s as Extract<MockStage, { kind: "qa" }>, r.turns, false);
                            }}
                          >
                            Try scoring again
                          </button>
                        </>
                      )}
                    </p>
                  )}
                  {r.score && (
                    <>
                      <p>
                        Score: <strong>{Math.round(r.score.overall)} / 100</strong>
                      </p>
                      <p>{r.score.summary}</p>
                      {r.score.strengths.length > 0 && (
                        <p>
                          <strong>Strengths:</strong> {r.score.strengths.join(" · ")}
                        </p>
                      )}
                      {r.score.improvements.length > 0 && (
                        <p>
                          <strong>To improve:</strong> {r.score.improvements.join(" · ")}
                        </p>
                      )}
                      <details>
                        <summary className="cursor-pointer font-medium">Feedback on each answer</summary>
                        <ul className="mt-2 space-y-3">
                          {r.turns.map((t, n) => (
                            <li key={n} className="space-y-1 border-t border-line pt-2">
                              <p className="font-medium">{t.prompt.split("\n")[0].slice(0, 160)}</p>
                              <p className="whitespace-pre-line text-muted">{t.answer || "(no answer)"}</p>
                              <p>
                                <strong>{r.score!.turns[n]?.score ?? 0}/10.</strong> {r.score!.turns[n]?.feedback}
                              </p>
                              <p className="callout bg-brand-50">{r.score!.turns[n]?.betterAnswer}</p>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex justify-center gap-3">
        <button className="btn btn-primary" onClick={() => { reset(); setPhase("intro"); }}>
          Run it again
        </button>
        <Link href="/employers" className="btn btn-secondary">
          All employers
        </Link>
      </div>
    </div>
  );
}
