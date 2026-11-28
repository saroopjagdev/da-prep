"use client";

import { useMemo, useState } from "react";
import { GameStage, Key, StageButton, useKeys } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { mean } from "@/lib/games/logic";
import { BALLOONS, BALLOON_COLOURS, balloonSet, summariseBalloons, type BalloonRound } from "@/lib/games/tasks";

const pounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;

function result(rounds: BalloonRound[]): GameResult {
  const s = summariseBalloons(rounds);
  const afterPop = rounds.filter((_, i) => i > 0 && rounds[i - 1].popped);
  const afterBank = rounds.filter((_, i) => i > 0 && !rounds[i - 1].popped);
  const colours = s.byColour.filter((c) => c.avgPumps > 0);
  const reading = [
    s.avgPumpsKept < 3
      ? "You banked early, which keeps money safe but leaves some unclaimed: a cautious pattern."
      : s.avgPumpsKept > 10
        ? "You pushed far before banking, which can pay well but risks more bursts: a bold pattern."
        : "You banked after a moderate number of pumps: a balanced pattern.",
  ];
  if (colours.length === 3) {
    const lo = colours.reduce((a, b) => (a.avgPumps < b.avgPumps ? a : b));
    const hi = colours.reduce((a, b) => (a.avgPumps > b.avgPumps ? a : b));
    reading.push(
      hi.avgPumps > lo.avgPumps * 1.5
        ? `You pumped ${hi.label.toLowerCase()} balloons much further than ${lo.label.toLowerCase()} ones: you learned that the colours behave differently.`
        : "You pumped each colour to a similar level: it may be worth watching whether the colours burst at different points.",
    );
  }
  if (afterPop.length && afterBank.length) {
    const p = mean(afterPop.map((x) => x.pumps));
    const b = mean(afterBank.map((x) => x.pumps));
    reading.push(p < b - 1 ? "After a burst you pumped less on the next balloon: you adjusted to what just happened." : p > b + 1 ? "After a burst you pumped more on the next balloon: you pushed harder after a loss." : "A burst did not change how much you pumped next.");
  }
  return {
    headline: `You banked ${pounds(s.bankedPence)}`,
    stats: [
      { label: "Money banked", value: pounds(s.bankedPence) },
      { label: "Balloons burst", value: `${s.pops} of ${rounds.length}` },
      { label: "Average pumps before banking", value: s.avgPumpsKept ? s.avgPumpsKept.toFixed(1) : "none banked" },
      ...s.byColour.map((c) => ({ label: `${c.label}: average pumps banked`, value: c.avgPumps ? c.avgPumps.toFixed(1) : "none banked" })),
    ],
    reading,
  };
}

export default function Balloon({ seed, onFinish }: GameProps) {
  const set = useMemo(() => balloonSet(seed), [seed]);
  const [round, setRound] = useState(0);
  const [pumps, setPumps] = useState(0);
  const [done, setDone] = useState<BalloonRound[]>([]);
  const [note, setNote] = useState("");

  const spec = set[round];
  const colour = BALLOON_COLOURS.find((c) => c.id === spec.colour)!;
  const banked = summariseBalloons(done).bankedPence;
  const held = pumps * BALLOONS.perPumpPence;

  function next(rec: BalloonRound, message: string) {
    const all = [...done, rec];
    setNote(message);
    setPumps(0);
    if (all.length >= BALLOONS.rounds) onFinish(result(all));
    else {
      setDone(all);
      setRound(round + 1);
    }
  }
  function pump() {
    const n = pumps + 1;
    if (n >= spec.burstAt) next({ colour: spec.colour, pumps: n, popped: true }, `Bang! The balloon burst and its ${pounds(n * BALLOONS.perPumpPence)} is gone.`);
    else setPumps(n);
  }
  function bank() {
    if (pumps > 0) next({ colour: spec.colour, pumps, popped: false }, `Banked ${pounds(held)}.`);
  }
  useKeys((k) => {
    if (k === " " || k === "ArrowUp") pump();
    if (k === "b" || k === "B" || k === "Enter") bank();
  });

  const r = 34 + Math.min(pumps, 24) * 3.6;
  return (
    <GameStage title="Balloon bank" left={`Balloon ${round + 1} of ${BALLOONS.rounds}`} right={`Banked ${pounds(banked)}`} progress={round / BALLOONS.rounds} status={note || "Each balloon colour bursts in its own pattern."}>
      <div className="grid place-items-center">
        <svg viewBox="0 0 220 240" className="h-60 w-full max-w-xs" role="img" aria-label={`A ${colour.label.toLowerCase()} balloon holding ${pounds(held)}`}>
          <defs>
            <radialGradient id="bshine" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="45%" stopColor={colour.fill} />
              <stop offset="100%" stopColor={colour.fill} stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <path d={`M110 ${112 + r * 1.12} l-7 12 h14 z`} fill={colour.fill} />
          <path d={`M110 ${124 + r * 1.12} q-10 25 4 55 q8 18 -2 38`} fill="none" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="110" cy="112" rx={r} ry={r * 1.12} fill="url(#bshine)" />
          <text x="110" y="120" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" stroke="rgba(0,0,0,.25)" strokeWidth="0.6">
            {pounds(held)}
          </text>
        </svg>
        <p className="text-sm font-semibold text-white/80">{colour.label} balloon</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <StageButton kind="primary" onClick={pump}>
          Pump <Key>Space</Key>
        </StageButton>
        <StageButton onClick={bank} disabled={pumps === 0}>
          Bank {pounds(held)} <Key>B</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}
