"use client";

import { useEffect, useMemo, useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import { SPAN_START, digitSequence, nextSpan, tileSequence, type SpanState } from "@/lib/games/logic";

type Trial = { length: number; ok: boolean };

function spanResult(what: string, unit: string, best: number, trials: Trial[]): GameResult {
  const right = trials.filter((t) => t.ok).length;
  return {
    headline: best ? `You recalled ${best} ${unit}` : `No ${what} recalled in full`,
    stats: [
      { label: `Longest ${what}`, value: best ? `${best} ${unit}` : "none" },
      { label: "Correct recalls", value: `${right} of ${trials.length}` },
    ],
    reading: [
      best >= 7 ? `Seven or more ${unit} is a long span for a task like this.` : best >= 5 ? `Five or six ${unit} is a typical span for a simple task like this.` : `Under five ${unit}: spans often grow with practice and with chunking.`,
      "Memory tasks like this are often adaptive: they get harder as you get things right, so there is no fixed target to hit.",
    ],
  };
}

/** Shared flow: show a sequence, collect an answer, make it longer after a right one, stop after two wrong ones. */
function useSpan(onFinish: GameProps["onFinish"], what: string, unit: string) {
  const [state, setState] = useState<SpanState>({ length: SPAN_START, misses: 0, best: 0 });
  const [trials, setTrials] = useState<Trial[]>([]);
  const [phase, setPhase] = useState<"show" | "recall" | "feedback">("show");
  const [feedback, setFeedback] = useState("");

  function submit(correct: boolean, said: string) {
    const step = nextSpan(state, correct);
    const all = [...trials, { length: state.length, ok: correct }];
    setTrials(all);
    if (step.done) {
      onFinish(spanResult(what, unit, step.best, all));
      return;
    }
    setState({ length: step.length, misses: step.misses, best: step.best });
    setFeedback(correct ? "Correct." : `Not quite. It was ${said}.`);
    setPhase("feedback");
  }
  return { state, trials, phase, setPhase, feedback, submit };
}

export function DigitSpan({ seed, onFinish }: GameProps) {
  const { state, trials, phase, setPhase, feedback, submit } = useSpan(onFinish, "string", "digits");
  const digits = useMemo(() => digitSequence(seed + trials.length * 31, state.length), [seed, trials.length, state.length]);
  const [shown, setShown] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (phase !== "show") return;
    const timers: number[] = [];
    let i = 0;
    const next = () => {
      if (i >= digits.length) {
        setShown(null);
        setPhase("recall");
        return;
      }
      setShown(digits[i]);
      timers.push(
        window.setTimeout(() => {
          setShown(null);
          i++;
          timers.push(window.setTimeout(next, 250));
        }, 800),
      );
    };
    timers.push(window.setTimeout(next, 700));
    return () => timers.forEach(window.clearTimeout);
  }, [phase, digits, setPhase]);

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Digit span">
      <p className="text-sm text-muted">
        {state.length} digits · {state.misses} wrong so far (the game ends at 2)
      </p>
      {phase === "show" && (
        <p className="grid h-24 place-items-center text-6xl font-bold tabular-nums" aria-live="assertive" aria-label={shown === null ? "" : `Digit ${shown}`}>
          {shown ?? ""}
        </p>
      )}
      {phase === "recall" && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const typed = answer.replace(/\D/g, "");
            const said = digits.join(" ");
            setAnswer("");
            submit(typed === digits.join(""), said);
          }}
        >
          <label className="block text-sm font-medium" htmlFor="span-answer">
            Type the digits in order
          </label>
          <input id="span-answer" className="input mx-auto w-48 text-center text-2xl tracking-widest" inputMode="numeric" autoComplete="off" autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <div>
            <button className="btn btn-primary" type="submit">
              Check
            </button>
          </div>
        </form>
      )}
      {phase === "feedback" && (
        <div className="space-y-3">
          <p role="status">{feedback}</p>
          <button className="btn btn-primary" autoFocus onClick={() => setPhase("show")}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export function Sequence({ seed, onFinish }: GameProps) {
  const { state, trials, phase, setPhase, feedback, submit } = useSpan(onFinish, "sequence", "tiles");
  const seq = useMemo(() => tileSequence(seed + trials.length * 37, state.length), [seed, trials.length, state.length]);
  const [lit, setLit] = useState<number | null>(null);
  const [taps, setTaps] = useState<number[]>([]);

  useEffect(() => {
    if (phase !== "show") return;
    const timers: number[] = [];
    let i = 0;
    const next = () => {
      if (i >= seq.length) {
        setLit(null);
        setPhase("recall");
        return;
      }
      setLit(seq[i]);
      timers.push(
        window.setTimeout(() => {
          setLit(null);
          i++;
          timers.push(window.setTimeout(next, 250));
        }, 650),
      );
    };
    timers.push(window.setTimeout(next, 700));
    return () => timers.forEach(window.clearTimeout);
  }, [phase, seq, setPhase]);

  function tap(t: number) {
    if (phase !== "recall") return;
    const all = [...taps, t];
    if (all.length < seq.length) {
      setTaps(all);
      return;
    }
    setTaps([]);
    submit(all.every((x, i) => x === seq[i]), seq.map((x) => x + 1).join(", "));
  }

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Block sequence">
      <p className="text-sm text-muted">
        {state.length} tiles · {state.misses} wrong so far (the game ends at 2)
      </p>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, t) => (
          <button
            key={t}
            type="button"
            disabled={phase !== "recall"}
            onClick={() => tap(t)}
            aria-label={`Tile ${t + 1}${lit === t ? ", lit" : ""}`}
            className={`h-20 rounded-xl border-2 ${lit === t ? "border-brand-600 bg-brand-600" : taps.includes(t) ? "border-brand-300 bg-brand-50" : "border-line bg-white"}`}
          />
        ))}
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {phase === "show" ? "Watch the order…" : phase === "recall" ? `Tap the tiles in the same order (${taps.length} of ${seq.length}).` : feedback}
      </p>
      {phase === "feedback" && (
        <button className="btn btn-primary" autoFocus onClick={() => setPhase("show")}>
          Next
        </button>
      )}
    </section>
  );
}
