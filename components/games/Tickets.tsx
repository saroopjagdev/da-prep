"use client";

import { useMemo } from "react";
import { GameStage, Key, StageButton, useKeys, useTrialLoop, type TrialResponse } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { mean } from "@/lib/games/logic";
import { ticketTrials, type Ticket, type TicketShape } from "@/lib/games/tasks";

const COUNT = 80;
const HINT_TRIALS = 12;
const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "none");

function Shape({ shape }: { shape: TicketShape }) {
  const f = { fill: "#0f766e" };
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-label={`A ${shape}`} role="img">
      {shape === "circle" && <circle cx="50" cy="50" r="36" {...f} />}
      {shape === "oval" && <ellipse cx="50" cy="50" rx="42" ry="28" {...f} />}
      {shape === "square" && <rect x="16" y="16" width="68" height="68" {...f} />}
      {shape === "triangle" && <polygon points="50,12 90,86 10,86" {...f} />}
      {shape === "star" && <polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" {...f} />}
    </svg>
  );
}

function result(trials: Ticket[], res: TrialResponse[]): GameResult {
  const rows = trials.slice(0, res.length).map((t, i) => ({ t, ok: res[i].answer === t.answer, rt: res[i].rt }));
  const rt = (xs: typeof rows) => mean(xs.filter((x) => x.ok && x.rt !== null).map((x) => x.rt as number));
  const stay = rows.filter((x) => !x.t.switched);
  const sw = rows.filter((x) => x.t.switched);
  const cost = rt(sw) - rt(stay);
  return {
    headline: `${pct(rows.filter((x) => x.ok).length, rows.length)} correct`,
    stats: [
      { label: "Accuracy", value: pct(rows.filter((x) => x.ok).length, rows.length) },
      { label: "Speed when the rule stayed", value: `${Math.round(rt(stay))} ms` },
      { label: "Speed when the rule switched", value: `${Math.round(rt(sw))} ms` },
      { label: "Accuracy after a switch", value: pct(sw.filter((x) => x.ok).length, sw.length) },
    ],
    reading: [
      Number.isFinite(cost) && cost > 40 ? `Switching between the two rules cost you about ${Math.round(cost)} ms each time: normal, and the thing this task measures.` : "Switching rules cost you very little time: a flexible pattern.",
      rows.filter((x) => !x.ok).length > rows.length / 4 ? "Over a quarter of answers were wrong: slow slightly and read where the ticket is before judging it." : "Few mistakes: you kept both rules in mind.",
    ],
  };
}

export default function Tickets({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => ticketTrials(seed, COUNT), [seed]);
  const gaps = useMemo(() => [300], []);
  const { i, live, respond } = useTrialLoop({ count: COUNT, gaps, timeout: 2500, onEnd: (res) => onFinish(result(trials, res)) });
  const t = trials[i];
  useKeys((k) => {
    if (k === "q" || k === "Q" || k === "ArrowLeft") respond("L");
    if (k === "p" || k === "P" || k === "ArrowRight") respond("R");
  });
  const hint = i < HINT_TRIALS;
  return (
    <GameStage title="Tickets" left={`Ticket ${i + 1} of ${COUNT}`} progress={i / COUNT} status={hint ? "Top of the screen: is the number low (left) or high (right)? Bottom: does the shape have corners (right) or none (left)?" : "The reminders have gone. Where the ticket sits tells you what to judge."}>
      <div className="relative mx-auto h-64 max-w-sm rounded-2xl border border-white/20 bg-white/5">
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/25" aria-hidden="true" />
        {hint && (
          <>
            <span className="absolute left-3 top-2 text-xs font-semibold text-white/60">NUMBER: low ← → high</span>
            <span className="absolute bottom-2 left-3 text-xs font-semibold text-white/60">SHAPE: no corners ← → corners</span>
          </>
        )}
        {live && (
          <div className={`absolute left-1/2 grid w-40 -translate-x-1/2 place-items-center gap-1 rounded-xl bg-white py-3 shadow-lg ${t.where === "top" ? "top-7" : "bottom-7"}`} role="img" aria-label={`A ticket with the number ${t.number} and a ${t.shape}, ${t.where === "top" ? "at the top" : "at the bottom"}`}>
            <span className="text-3xl font-extrabold text-slate-800">{t.number}</span>
            <Shape shape={t.shape} />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <StageButton onClick={() => respond("L")} label="Left answer">
          ← Low / no corners <Key>Q</Key>
        </StageButton>
        <StageButton onClick={() => respond("R")} label="Right answer">
          High / corners → <Key>P</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}
