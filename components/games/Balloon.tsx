"use client";

import { useMemo, useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import { BALLOON, balloonBursts, mean, summariseBalloon, type BalloonRound } from "@/lib/games/logic";

function result(rounds: BalloonRound[]): GameResult {
  const s = summariseBalloon(rounds);
  const afterPop = rounds.filter((_, i) => i > 0 && rounds[i - 1].popped);
  const afterBank = rounds.filter((_, i) => i > 0 && !rounds[i - 1].popped);
  const reading = [
    s.avgPumpsKept < 6
      ? "You banked early, which keeps points safe but leaves points unclaimed: a cautious pattern."
      : s.avgPumpsKept > 15
        ? "You pushed far before banking, which can pay well but risks more bursts: a bold pattern."
        : "You banked after a moderate number of pumps: a balanced pattern.",
  ];
  if (afterPop.length && afterBank.length) {
    const p = mean(afterPop.map((x) => x.pumps));
    const b = mean(afterBank.map((x) => x.pumps));
    reading.push(
      p < b - 1
        ? "After a burst you pumped less on the next balloon: you adjusted to what just happened."
        : p > b + 1
          ? "After a burst you pumped more on the next balloon: you pushed harder after a loss."
          : "A burst did not change how much you pumped next.",
    );
  }
  return {
    headline: `You banked ${s.banked} points`,
    stats: [
      { label: "Points banked", value: String(s.banked) },
      { label: "Balloons burst", value: `${s.pops} of ${rounds.length}` },
      { label: "Average pumps before banking", value: s.avgPumpsKept ? s.avgPumpsKept.toFixed(1) : "none banked" },
      { label: "Most pumps on one balloon", value: String(Math.max(...rounds.map((r) => r.pumps))) },
    ],
    reading,
  };
}

export default function Balloon({ seed, onFinish }: GameProps) {
  const bursts = useMemo(() => balloonBursts(seed), [seed]);
  const [round, setRound] = useState(0);
  const [pumps, setPumps] = useState(0);
  const [done, setDone] = useState<BalloonRound[]>([]);
  const [note, setNote] = useState("");

  const banked = summariseBalloon(done).banked;
  const held = pumps * BALLOON.perPump;

  function next(rec: BalloonRound, message: string) {
    const all = [...done, rec];
    setNote(message);
    setPumps(0);
    if (all.length >= BALLOON.rounds) onFinish(result(all));
    else {
      setDone(all);
      setRound(round + 1);
    }
  }

  function pump() {
    const n = pumps + 1;
    if (n >= bursts[round]) next({ pumps: n, popped: true }, `Bang! Balloon ${round + 1} burst and its ${n * BALLOON.perPump} points are gone.`);
    else setPumps(n);
  }

  const size = 36 + pumps * 4.5;
  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Balloon bank">
      <p className="text-sm text-muted">
        Balloon {round + 1} of {BALLOON.rounds} · Banked {banked} points
      </p>
      <svg viewBox="0 0 200 180" className="mx-auto h-48 w-full max-w-xs" role="img" aria-label={`A balloon holding ${held} points`}>
        <ellipse cx="100" cy="90" rx={size} ry={size * 1.12} fill="#e11d48" opacity="0.85" />
        <line x1="100" y1={90 + size * 1.12} x2="100" y2="178" stroke="#64748b" strokeWidth="2" />
        <text x="100" y="97" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
          {held}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={pump}>
          Pump
        </button>
        <button type="button" className="btn btn-secondary" disabled={pumps === 0} onClick={() => next({ pumps, popped: false }, `Banked ${held} points.`)}>
          Bank {held}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {note}
      </p>
    </section>
  );
}
