"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Runs a handler for key presses while the game is on screen. Held keys do not repeat. */
export function useKeys(handler: (key: string) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " ") e.preventDefault();
      ref.current(e.key);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
}

/** The shared look of every game: a dark stage with a title, a progress line and a status strip, so the stimulus stands out. */
export function GameStage({
  title,
  left,
  right,
  progress,
  status,
  children,
}: {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  /** 0 to 1. */
  progress?: number;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-navy text-white shadow-lg" aria-label={title}>
      <div className="flex items-center justify-between gap-3 px-5 pt-4 text-sm text-white/70">
        <span className="font-semibold text-white">{left ?? title}</span>
        <span className="tabular-nums">{right}</span>
      </div>
      {progress !== undefined && (
        <div className="mx-5 mt-3 h-1.5 rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Progress">
          <div className="h-full rounded-full bg-brand-500 transition-[width] duration-200" style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }} />
        </div>
      )}
      <div className="px-5 py-6">{children}</div>
      <p role="status" aria-live="polite" className="min-h-10 border-t border-white/10 px-5 py-2.5 text-center text-sm text-white/80">
        {status}
      </p>
    </section>
  );
}

/** A large, touch-friendly answer button for the dark stage. */
export function StageButton({ children, onClick, kind = "plain", disabled, label }: { children: ReactNode; onClick: () => void; kind?: "plain" | "primary"; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`min-w-28 rounded-xl px-6 py-3 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40 ${kind === "primary" ? "bg-brand-500 text-white hover:bg-brand-600" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"}`}
    >
      {children}
    </button>
  );
}

/** A small keyboard hint chip, shown on desktop. */
export const Key = ({ children }: { children: ReactNode }) => (
  <kbd className="hidden rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-xs font-semibold text-white/90 sm:inline">{children}</kbd>
);

export type TrialResponse = { answer: string | null; rt: number | null };

/**
 * A run of timed trials: a short gap, then the stimulus shows and waits for one answer or a timeout, then the next trial.
 * Answers made during a gap count as early presses. `gaps` has one pause (ms) per trial, so it must be stable between renders.
 */
export function useTrialLoop({ count, gaps, timeout, onEnd }: { count: number; gaps: readonly number[]; timeout: number; onEnd: (responses: TrialResponse[], early: number) => void }) {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const liveRef = useRef(false);
  const t0 = useRef(0);
  const responses = useRef<TrialResponse[]>([]);
  const early = useRef(0);
  const endRef = useRef(onEnd);
  useEffect(() => {
    endRef.current = onEnd;
  });

  const settle = useCallback(
    (answer: string | null) => {
      if (!liveRef.current) return;
      liveRef.current = false;
      setLive(false);
      responses.current.push({ answer, rt: answer === null ? null : performance.now() - t0.current });
      if (responses.current.length >= count) endRef.current(responses.current, early.current);
      else setI(responses.current.length);
    },
    [count],
  );

  useEffect(() => {
    let limit: number | undefined;
    const show = window.setTimeout(() => {
      t0.current = performance.now();
      liveRef.current = true;
      setLive(true);
      limit = window.setTimeout(() => settle(null), timeout);
    }, gaps[i] ?? gaps[gaps.length - 1] ?? 300);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(limit);
    };
  }, [i, gaps, timeout, settle]);

  const respond = useCallback(
    (answer: string) => {
      if (liveRef.current) settle(answer);
      else early.current++;
    },
    [settle],
  );
  return { i, live, respond };
}
