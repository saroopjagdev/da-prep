"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import {
  INKS,
  KEY_ROUNDS,
  backTrials,
  goTrials,
  mean,
  scoreSignal,
  summariseKeys,
  wordTrials,
  type Ink,
  type Shape,
} from "@/lib/games/logic";

/** Runs a handler for these keys while the game is on screen. */
function useKeys(handler: (key: string) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      ref.current(e.key);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
}

function ShapeIcon({ shape, className = "h-28 w-28" }: { shape: Shape; className?: string }) {
  const common = { fill: "#2563eb" };
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label={`A ${shape}`} role="img">
      {shape === "circle" && <circle cx="50" cy="50" r="38" {...common} />}
      {shape === "square" && <rect x="14" y="14" width="72" height="72" {...common} />}
      {shape === "triangle" && <polygon points="50,10 92,88 8,88" {...common} />}
      {shape === "diamond" && <polygon points="50,6 94,50 50,94 6,50" {...common} />}
      {shape === "star" && <polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" {...common} />}
      {shape === "cross" && <polygon points="36,8 64,8 64,36 92,36 92,64 64,64 64,92 36,92 36,64 8,64 8,36 36,36" {...common} />}
    </svg>
  );
}

const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "none");

/* ------------------------------------------------------------------ Flashback */

const FLASH_SECONDS = 180;

export function Flashback({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => backTrials(seed, 400), [seed]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(FLASH_SECONDS);
  const said = useRef<boolean[]>([]);
  const started = useRef(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const n = said.current.length;
    const s = scoreSignal(trials.slice(0, n), said.current);
    const matches = s.hits + s.misses;
    const result: GameResult = {
      headline: `${pct(s.hits + s.correctRejections, n)} correct over ${n} shapes`,
      stats: [
        { label: "Shapes answered", value: String(n) },
        { label: "Repeats spotted", value: `${s.hits} of ${matches}` },
        { label: "False alarms (said Same wrongly)", value: String(s.falseAlarms) },
        { label: "Accuracy", value: pct(s.hits + s.correctRejections, n) },
      ],
      reading: [
        s.falseAlarms > s.misses ? "You leaned towards saying Same: you caught most repeats but flagged some that were not." : s.misses > s.falseAlarms ? "You leaned towards saying Different: you rarely made false alarms but missed some repeats." : "Your mistakes were evenly split between missed repeats and false alarms.",
        n < 60 ? "You answered fewer than 60 shapes: a steadier rhythm would let you see more." : "You kept a good pace through the three minutes.",
      ],
    };
    onFinish(result);
  }, [trials, onFinish]);

  useEffect(() => {
    started.current = performance.now();
    const id = window.setInterval(() => {
      const remaining = FLASH_SECONDS - (performance.now() - started.current) / 1000;
      setLeft(Math.max(0, Math.ceil(remaining)));
      if (remaining <= 0) {
        window.clearInterval(id);
        finish();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [finish]);

  function answer(same: boolean) {
    if (finished.current) return;
    said.current.push(same);
    setI(said.current.length);
  }
  useKeys((k) => {
    if (k === "s" || k === "S" || k === "ArrowLeft") answer(true);
    if (k === "d" || k === "D" || k === "ArrowRight") answer(false);
  });

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Flashback">
      <p className="text-sm text-muted">
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} left · {i} answered
      </p>
      <div className="grid place-items-center">
        <ShapeIcon shape={trials[i].shape} />
      </div>
      <div className="flex justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => answer(true)}>
          Same (S)
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => answer(false)}>
          Different (D)
        </button>
      </div>
      <p className="text-xs text-muted">Is this the same shape as the one just before it? The first shape has nothing before it, so it is Different.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ Shape reaction */

type Outcome = { go: boolean; pressed: boolean; rt: number | null };

export function Reaction({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => goTrials(seed, 40), [seed]);
  const [i, setI] = useState(0);
  const [showing, setShowing] = useState(false);
  const outcomes = useRef<Outcome[]>([]);
  const early = useRef(0);
  const onset = useRef(0);
  const showingRef = useRef(false);

  const record = useCallback(
    (o: Outcome) => {
      outcomes.current.push(o);
      showingRef.current = false;
      setShowing(false);
      if (outcomes.current.length >= trials.length) {
        const all = outcomes.current;
        const hits = all.filter((x) => x.go && x.pressed);
        const misses = all.filter((x) => x.go && !x.pressed).length;
        const falseAlarms = all.filter((x) => !x.go && x.pressed).length;
        const noGo = all.filter((x) => !x.go).length;
        const rt = mean(hits.map((x) => x.rt!));
        onFinish({
          headline: hits.length ? `Average reaction ${Math.round(rt)} ms` : "No green circles caught",
          stats: [
            { label: "Average reaction (green circle)", value: hits.length ? `${Math.round(rt)} ms` : "none" },
            { label: "Green circles caught", value: `${hits.length} of ${all.filter((x) => x.go).length}` },
            { label: "Pressed for a red square", value: `${falseAlarms} of ${noGo}` },
            { label: "Pressed too early", value: String(early.current) },
          ],
          reading: [
            falseAlarms > noGo / 3 ? "You pressed for several red squares: you favoured speed over restraint." : "You held back on most red squares: restraint was good.",
            early.current > 2 ? "Several early presses: waiting for the shape is part of the task." : misses > 3 ? "You missed several green circles: a little more readiness would help." : "Good control: few early presses and few misses.",
          ],
        });
        return;
      }
      setI(outcomes.current.length);
    },
    [trials.length, onFinish],
  );

  useEffect(() => {
    const t = trials[i];
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        onset.current = performance.now();
        showingRef.current = true;
        setShowing(true);
        timers.push(window.setTimeout(() => record({ go: t.go, pressed: false, rt: null }), 900));
      }, t.wait),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [i, trials, record]);

  function press() {
    if (!showingRef.current) {
      early.current++;
      return;
    }
    const t = trials[outcomes.current.length];
    record({ go: t.go, pressed: true, rt: performance.now() - onset.current });
  }
  useKeys((k) => k === " " && press());

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Shape reaction">
      <p className="text-sm text-muted">
        Shape {i + 1} of {trials.length}
      </p>
      <div className="grid h-40 place-items-center">
        {showing && (trials[i].go ? <span className="block h-28 w-28 rounded-full bg-mint-600" role="img" aria-label="Green circle: press now" /> : <span className="block h-28 w-28 bg-coral-600" role="img" aria-label="Red square: do not press" />)}
      </div>
      <button type="button" className="btn btn-primary !h-16 w-full max-w-xs !text-lg" onClick={press}>
        Press (Space)
      </button>
      <p className="text-xs text-muted">Green circle: press as fast as you can. Red square: do nothing.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ Keypress */

export function Keypress({ onFinish }: GameProps) {
  const [round, setRound] = useState(0);
  const [left, setLeft] = useState<number>(KEY_ROUNDS[0].seconds);
  const presses = useRef<number[]>(KEY_ROUNDS.map(() => 0));
  const [count, setCount] = useState(0);
  const roundRef = useRef(0);

  useEffect(() => {
    const started = performance.now();
    const id = window.setInterval(() => {
      let t = (performance.now() - started) / 1000;
      let r = 0;
      while (r < KEY_ROUNDS.length && t >= KEY_ROUNDS[r].seconds) {
        t -= KEY_ROUNDS[r].seconds;
        r++;
      }
      if (r >= KEY_ROUNDS.length) {
        window.clearInterval(id);
        const s = summariseKeys(presses.current);
        onFinish({
          headline: `${s.perSecond.toFixed(1)} presses a second`,
          stats: [
            { label: "Speed when told to press", value: `${s.perSecond.toFixed(1)} a second` },
            { label: "Presses while told to wait", value: String(s.whileWaiting) },
            { label: "Gap between best and worst press round", value: `${s.steadiness} presses` },
          ],
          reading: [
            s.whileWaiting === 0 ? "You stopped every time you were told to wait: good instruction-following." : "You pressed during a Wait round: the task checks whether you can stop on cue.",
            s.steadiness <= 8 ? "Your speed was consistent from round to round." : "Your speed varied noticeably between rounds.",
          ],
        });
        return;
      }
      roundRef.current = r;
      setRound(r);
      setLeft(Math.ceil(KEY_ROUNDS[r].seconds - t));
      setCount(presses.current[r]);
    }, 100);
    return () => window.clearInterval(id);
  }, [onFinish]);

  function press() {
    presses.current[roundRef.current]++;
    setCount(presses.current[roundRef.current]);
  }
  useKeys((k) => k === " " && press());

  const cue = KEY_ROUNDS[Math.min(round, KEY_ROUNDS.length - 1)].cue;
  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Keypress">
      <p className="text-sm text-muted">
        Round {Math.min(round + 1, KEY_ROUNDS.length)} of {KEY_ROUNDS.length} · {left}s
      </p>
      <p className={`text-4xl font-bold ${cue === "press" ? "text-mint-700" : "text-coral-600"}`} role="status" aria-live="assertive">
        {cue === "press" ? "PRESS" : "WAIT"}
      </p>
      <button type="button" className="btn btn-primary !h-24 w-full max-w-xs !text-xl" onClick={press}>
        Press (Space)
      </button>
      <p className="text-xs text-muted" aria-hidden="true">
        {cue === "press" ? `${count} presses this round` : "Do not press"}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ Colour words */

const INK_HEX: Record<Ink, string> = { red: "#dc2626", green: "#16a34a", blue: "#2563eb", yellow: "#a16207" };
const WORDS = 40;

export function Stroop({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => wordTrials(seed, WORDS), [seed]);
  const [i, setI] = useState(0);
  const log = useRef<{ ok: boolean; rt: number; congruent: boolean }[]>([]);
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = performance.now();
  }, [i]);

  function pick(ink: Ink) {
    const t = trials[i];
    log.current.push({ ok: ink === t.ink, rt: performance.now() - shownAt.current, congruent: t.congruent });
    if (log.current.length >= trials.length) {
      const all = log.current;
      const part = (c: boolean) => all.filter((x) => x.congruent === c);
      const rtOf = (c: boolean) => mean(part(c).filter((x) => x.ok).map((x) => x.rt));
      const right = all.filter((x) => x.ok).length;
      onFinish({
        headline: `${right} of ${all.length} correct`,
        stats: [
          { label: "Correct", value: `${right} of ${all.length}` },
          { label: "Average time, word matches ink", value: `${Math.round(rtOf(true))} ms` },
          { label: "Average time, word differs from ink", value: `${Math.round(rtOf(false))} ms` },
          { label: "Wrong when word differs", value: `${part(false).filter((x) => !x.ok).length} of ${part(false).length}` },
        ],
        reading: [
          rtOf(false) > rtOf(true) ? `You were about ${Math.round(rtOf(false) - rtOf(true))} ms slower when the word and ink disagreed. That slowdown is normal; it is what the task is built to show.` : "You were no slower when the word and ink disagreed.",
        ],
      });
      return;
    }
    setI(log.current.length);
  }
  useKeys((k) => {
    const n = Number(k);
    if (n >= 1 && n <= 4) pick(INKS[n - 1]);
  });

  const t = trials[i];
  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Colour words">
      <p className="text-sm text-muted">
        Word {i + 1} of {trials.length}
      </p>
      <p className="grid h-28 place-items-center text-6xl font-extrabold uppercase" style={{ color: INK_HEX[t.ink] }}>
        <span aria-label={`The word ${t.word}, in ${t.ink} ink`}>{t.word}</span>
      </p>
      <p className="text-sm font-medium">What colour is the ink?</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {INKS.map((ink, n) => (
          <button key={ink} type="button" className="btn btn-secondary capitalize" onClick={() => pick(ink)}>
            {ink} ({n + 1})
          </button>
        ))}
      </div>
    </section>
  );
}
