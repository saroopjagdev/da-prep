"use client";

import { useEffect, useRef, useState } from "react";
import Calculator from "@/components/assess/Calculator";
import ItemView from "@/components/assess/ItemView";
import StimulusView from "@/components/assess/StimulusView";
import { START_TARGET, nextTarget, pickAdaptive } from "@/lib/assess/adaptive";
import { serveIds, servedCount } from "@/lib/assess/sample";
import { blankResponse, scoreItem, scoreSection, summarise } from "@/lib/assess/score";
import type { Item, Response, Section, SectionResult, Test, TestResult } from "@/lib/assess/types";

type RunState = {
  startedAt: string;
  sectionIdx: number;
  phase: "intro" | "running";
  itemIdx: number;
  /** Ids in the order served: the whole section for fixed sections, built one at a time for adaptive ones. */
  served: string[];
  target: number;
  responses: Record<string, Response>;
  locked: string[];
  sectionStart: number;
  /** Absolute times (ms since epoch). A deadline, not a countdown, so background tabs and reloads cannot cheat or stall it. */
  sectionDeadline: number | null;
  itemDeadline: number | null;
  results: SectionResult[];
};

const storageKey = (testId: string) => `da-prep:assess-run:${testId}`;

const initState = (): RunState => ({
  startedAt: new Date().toISOString(),
  sectionIdx: 0,
  phase: "intro",
  itemIdx: 0,
  served: [],
  target: START_TARGET,
  responses: {},
  locked: [],
  sectionStart: 0,
  sectionDeadline: null,
  itemDeadline: null,
  results: [],
});

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function describeTiming(s: Section) {
  if (s.timing.mode === "untimed") return "Untimed";
  if (s.timing.mode === "recorded") return "No time limit, but your time is recorded: work quickly and accurately";
  if (s.timing.mode === "section") return `${Math.round(s.timing.seconds / 60)} minutes for the whole section`;
  return `${s.timing.seconds} seconds per question`;
}

function startSection(st: RunState, section: Section, now: number): RunState {
  const first = section.adaptive ? pickAdaptive(section.items, new Set(), START_TARGET) : section.items[0];
  return {
    ...st,
    phase: "running",
    itemIdx: 0,
    served: section.adaptive ? (first ? [first.id] : []) : serveIds(section),
    target: START_TARGET,
    sectionStart: now,
    sectionDeadline: section.timing.mode === "section" ? now + section.timing.seconds * 1000 : null,
    itemDeadline: section.timing.mode === "item" ? now + section.timing.seconds * 1000 : null,
  };
}

type Begin = () => Promise<{ ok: true } | { ok: false; message: string }>;

export default function Runner({ test, onComplete, onExit, onBegin }: { test: Test; onComplete: (r: TestResult) => void; onExit?: () => void; onBegin?: Begin }) {
  const [st, setSt] = useState<RunState | null>(null);
  const [beginning, setBeginning] = useState(false);
  const [beginError, setBeginError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [calcOpen, setCalcOpen] = useState(false);
  const finished = useRef(false);

  // Restore an unfinished run (the deadline keeps running while the tab was closed, as in a real test).
  useEffect(() => {
    let restored: RunState | null = null;
    try {
      const raw = localStorage.getItem(storageKey(test.id));
      const parsed = raw ? (JSON.parse(raw) as RunState) : null;
      if (parsed && parsed.sectionIdx < test.sections.length) restored = parsed;
    } catch {
      /* storage unavailable: start fresh */
    }
    // Reading localStorage needs the browser, so this cannot be initial state without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSt(restored ?? initState());
  }, [test]);

  useEffect(() => {
    if (!st || finished.current) return;
    try {
      localStorage.setItem(storageKey(test.id), JSON.stringify(st));
    } catch {
      /* ignore */
    }
  }, [st, test.id]);

  const running = st?.phase === "running";
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  function complete(results: SectionResult[], base: RunState) {
    finished.current = true;
    try {
      localStorage.removeItem(storageKey(test.id));
    } catch {
      /* ignore */
    }
    setSt(null);
    onComplete(summarise(test, base.startedAt, results, base.responses));
  }

  function finishSection(cur: RunState) {
    const section = test.sections[cur.sectionIdx];
    const t = Date.now();
    // Anything the candidate reached but never answered is recorded as blank.
    const responses = { ...cur.responses };
    for (const id of cur.served.slice(0, cur.itemIdx + 1)) {
      const item = section.items.find((i) => i.id === id);
      if (item && !(id in responses)) responses[id] = blankResponse(item);
    }
    const result = scoreSection(section, responses, Math.round((t - cur.sectionStart) / 1000), section.adaptive ? undefined : cur.served);
    const results = [...cur.results, result];
    if (cur.sectionIdx + 1 >= test.sections.length) return complete(results, { ...cur, responses });
    setSt({ ...cur, responses, results, sectionIdx: cur.sectionIdx + 1, phase: "intro", itemIdx: 0, served: [], sectionDeadline: null, itemDeadline: null });
  }

  function goNext(cur: RunState) {
    const section = test.sections[cur.sectionIdx];
    const item = section.items.find((i) => i.id === cur.served[cur.itemIdx]) as Item;
    const responses = { ...cur.responses };
    if (!(item.id in responses)) responses[item.id] = blankResponse(item);
    const withResponses = { ...cur, responses };
    const t = Date.now();

    let served = cur.served;
    let target = cur.target;
    let last = cur.itemIdx + 1 >= cur.served.length;
    if (section.adaptive && last) {
      if (cur.served.length >= section.adaptive.count) return finishSection(withResponses);
      const sc = scoreItem(item, responses[item.id]);
      target = nextTarget(cur.target, sc.max > 0 ? sc.points === sc.max : null);
      const next = pickAdaptive(section.items, new Set(cur.served), target);
      if (!next) return finishSection(withResponses);
      served = [...cur.served, next.id];
      last = false;
    }
    if (last) return finishSection(withResponses);
    setSt({
      ...withResponses,
      served,
      target,
      itemIdx: cur.itemIdx + 1,
      itemDeadline: section.timing.mode === "item" ? t + section.timing.seconds * 1000 : null,
    });
  }

  // Deadlines: end the section, or move on from an item, when time runs out.
  useEffect(() => {
    if (!st || st.phase !== "running" || finished.current) return;
    // Expiry is an external event (the clock), so reacting to it from an effect is the intended pattern here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (st.sectionDeadline !== null && now >= st.sectionDeadline) finishSection(st);
    else if (st.itemDeadline !== null && now >= st.itemDeadline) goNext(st);
    // finishSection/goNext close over test and onComplete, which are stable for a run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, st]);

  // Until the saved run has been read (first paint), show the first section's intro with Start disabled,
  // so the page doesn't jump when the browser state arrives.
  if (!st || st.phase === "intro") {
    const idx = st?.sectionIdx ?? 0;
    const section = test.sections[idx];
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm font-semibold text-muted">
          {test.name}: section {idx + 1} of {test.sections.length}
        </p>
        <h1 className="page-title">{section.title}</h1>
        {idx === 0 && test.approximate && (
          <p className="callout bg-brand-50 text-sm">
            This replicates the published format of {test.replicates}, with original questions. Some details are not
            published by the provider, so timing and difficulty are approximate.
          </p>
        )}
        <p className="whitespace-pre-line">{section.instructions}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>{describeTiming(section)}</li>
          <li>
            {section.adaptive
              ? `${section.adaptive.count} questions, adapting to your answers`
              : `${servedCount(section)} questions${section.sample ? ", a different selection each attempt" : ""}`}
          </li>
          <li>{section.allowBack && !section.adaptive ? "You can go back to earlier questions" : "You cannot go back once you move on"}</li>
          <li>{section.calculator ? "A calculator is provided" : "No calculator"}</li>
        </ul>
        <div className="flex gap-3">
          <button
            className="btn btn-primary"
            disabled={!st || beginning}
            onClick={async () => {
              if (!st) return;
              // The first section of a fresh run is where a free practice test is counted against the weekly allowance.
              if (onBegin && idx === 0) {
                setBeginning(true);
                setBeginError(null);
                const r = await onBegin();
                setBeginning(false);
                if (!r.ok) return setBeginError(r.message);
              }
              setSt(startSection(st, section, Date.now()));
            }}
          >
            Start
          </button>
          {onExit && (
            <button className="btn btn-secondary" onClick={onExit}>
              Back
            </button>
          )}
        </div>
        {beginError && (
          <p role="alert" className="callout bg-coral-50 text-sm">
            {beginError}
          </p>
        )}
      </div>
    );
  }

  const section = test.sections[st.sectionIdx];
  const item = section.items.find((i) => i.id === st.served[st.itemIdx]);
  if (!item) return null;
  const total = section.adaptive ? servedCount(section) : st.served.length;
  const response = st.responses[item.id] ?? blankResponse(item);
  const locked = st.locked.includes(item.id);
  const deadline = st.itemDeadline ?? st.sectionDeadline;
  const remaining = deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));
  const announce = remaining !== null && [60, 30, 10].includes(remaining) ? `${remaining} seconds left` : "";
  const canBack = section.allowBack && !section.adaptive && section.timing.mode !== "item" && st.itemIdx > 0;
  const lastItem = section.adaptive ? st.served.length >= total : st.itemIdx + 1 >= st.served.length;
  const stimulus = item.stimulus ? section.stimuli?.[item.stimulus] : undefined;
  const sc = locked ? scoreItem(item, response) : null;

  const quit = () => {
    try {
      localStorage.removeItem(storageKey(test.id));
    } catch {
      /* ignore */
    }
    finished.current = true;
    setSt(null);
    onExit?.();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-muted">
        <h1>
          {section.title}: question {st.itemIdx + 1} of {total}
        </h1>
        <div className="flex items-center gap-2">
          {section.calculator && (
            <button type="button" className="btn btn-secondary px-3 py-1 text-sm" aria-expanded={calcOpen} onClick={() => setCalcOpen((v) => !v)}>
              Calculator
            </button>
          )}
          {section.timing.mode === "recorded" && (
            <p role="timer" aria-label="Time taken" aria-live="off" className="rounded-md bg-soft px-3 py-1 text-base tabular-nums text-muted">
              {mmss(Math.max(0, Math.floor((now - st.sectionStart) / 1000)))}
            </p>
          )}
          {remaining !== null && (
            <p
              role="timer"
              aria-label="Time left"
              className={`rounded-md px-3 py-1 text-base tabular-nums ${remaining <= 10 ? "bg-coral-50 text-coral-600" : "bg-brand-50 text-brand-700"}`}
            >
              {mmss(remaining)}
            </p>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>

      <div className={calcOpen ? "grid gap-4 md:grid-cols-[1fr_15rem]" : ""}>
        <div className="space-y-4">
          {stimulus && <StimulusView stimulus={stimulus} />}
          <p className="whitespace-pre-line text-lg font-medium leading-relaxed">{item.prompt}</p>
          <ItemView item={item} response={response} locked={locked} onChange={(r) => setSt({ ...st, responses: { ...st.responses, [item.id]: r } })} />
        </div>
        {calcOpen && (
          <aside aria-label="Calculator">
            <Calculator />
          </aside>
        )}
      </div>

      {locked && sc && (
        <div role="status" className="callout bg-brand-50">
          <strong>{sc.max > 0 && sc.points === sc.max ? "Correct. " : "Not quite. "}</strong>
          {item.explanation}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {canBack && (
          <button className="btn btn-secondary" onClick={() => setSt({ ...st, itemIdx: st.itemIdx - 1 })}>
            Back
          </button>
        )}
        {section.showFeedback && !locked ? (
          <button className="btn btn-primary" onClick={() => setSt({ ...st, locked: [...st.locked, item.id] })}>
            Check answer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => goNext(st)}>
            {lastItem ? (st.sectionIdx + 1 >= test.sections.length ? "Finish" : "Finish section") : "Next"}
          </button>
        )}
        <button className="btn btn-secondary ml-auto" onClick={quit}>
          Quit test
        </button>
      </div>
    </div>
  );
}
