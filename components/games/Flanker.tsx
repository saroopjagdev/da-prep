"use client";

import { useMemo } from "react";
import { GameStage, Key, StageButton, useKeys, useTrialLoop, type TrialResponse } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { mean } from "@/lib/games/logic";
import { arrowSets, type ArrowColour, type ArrowSet, type Dir } from "@/lib/games/tasks";

const INK: Record<ArrowColour, string> = { blue: "#2563eb", black: "#0f172a", red: "#dc2626" };
const NAME: Record<ArrowColour, string> = { blue: "BLUE", black: "BLACK", red: "RED" };
const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "none");

function result(sets: ArrowSet[], res: TrialResponse[], colourRule: boolean): GameResult {
  const rows = sets.slice(0, res.length).map((s, i) => ({ s, ok: res[i].answer === s.answer, rt: res[i].rt }));
  const rtOf = (xs: typeof rows) => mean(xs.filter((x) => x.ok && x.rt !== null).map((x) => x.rt as number));
  const con = rows.filter((x) => x.s.congruent);
  const inc = rows.filter((x) => !x.s.congruent);
  const cost = rtOf(inc) - rtOf(con);
  const correct = rows.filter((x) => x.ok).length;
  const stats = [
    { label: "Accuracy", value: pct(correct, rows.length) },
    { label: "Average speed (correct)", value: `${Math.round(rtOf(rows))} ms` },
    { label: "Speed when arrows agreed", value: `${Math.round(rtOf(con))} ms` },
    { label: "Speed when arrows conflicted", value: `${Math.round(rtOf(inc))} ms` },
  ];
  if (colourRule) {
    const sides = rows.filter((x) => x.s.rule === "sides");
    const mid = rows.filter((x) => x.s.rule === "middle");
    stats.push({ label: "Red sets (side arrows) correct", value: pct(sides.filter((x) => x.ok).length, sides.length) }, { label: "Blue or black sets (middle arrow) correct", value: pct(mid.filter((x) => x.ok).length, mid.length) });
  }
  return {
    headline: `${pct(correct, rows.length)} correct, ${Math.round(rtOf(rows))} ms on average`,
    stats,
    reading: [
      Number.isFinite(cost) && cost > 40 ? `You were about ${Math.round(cost)} ms slower when the surrounding arrows conflicted: the usual pattern, and a sign of how much the distractors pull.` : "Conflicting arrows barely slowed you: good focus on the target.",
      colourRule ? "Half the skill here is switching rules between sets. Mistakes on red sets usually mean the middle-arrow habit carried over." : "Speed and accuracy trade off: pushing for speed raises errors on conflicting sets.",
    ],
  };
}

function Arrow({ dir, colour, size }: { dir: Dir; colour: ArrowColour; size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className={dir === "R" ? "" : "-scale-x-100"}>
      <path d="M4 20h26M20 8l12 12-12 12" fill="none" stroke={INK[colour]} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Flanker({ seed, onFinish, colourRule, count, title, keys }: GameProps & { colourRule: boolean; count: number; title: string; keys: "arrows" | "qp" }) {
  const sets = useMemo(() => arrowSets(seed, count, colourRule), [seed, count, colourRule]);
  const gaps = useMemo(() => [350], []);
  const { i, live, respond } = useTrialLoop({ count, gaps, timeout: 1500, onEnd: (res) => onFinish(result(sets, res, colourRule)) });
  const s = sets[i];
  useKeys((k) => {
    const left = keys === "arrows" ? k === "ArrowLeft" : k === "q" || k === "Q";
    const right = keys === "arrows" ? k === "ArrowRight" : k === "p" || k === "P";
    if (left) respond("L");
    if (right) respond("R");
  });
  const order: Dir[] = [s.sides, s.sides, s.middle, s.sides, s.sides];
  return (
    <GameStage title={title} left={`Set ${i + 1} of ${count}`} progress={i / count} status={colourRule ? "Blue or black: answer the middle arrow. Red: answer the side arrows." : "Answer the direction of the middle arrow."}>
      <div className="mx-auto grid h-36 max-w-sm place-items-center rounded-2xl bg-white">
        {live ? (
          <div className="flex items-center gap-1" role="img" aria-label={`Five ${s.colour} arrows`}>
            {order.map((d, k) => (
              <Arrow key={k} dir={d} colour={s.colour} size={k === 2 ? 52 : 44} />
            ))}
          </div>
        ) : (
          <span className="h-3 w-3 rounded-full bg-slate-300" aria-hidden="true" />
        )}
      </div>
      {colourRule && live && <p className="mt-2 text-center text-xs font-semibold tracking-wide text-white/60">{NAME[s.colour]} SET</p>}
      <div className="mt-5 flex justify-center gap-3">
        <StageButton onClick={() => respond("L")} label="Left">
          ← Left <Key>{keys === "arrows" ? "←" : "Q"}</Key>
        </StageButton>
        <StageButton onClick={() => respond("R")} label="Right">
          Right → <Key>{keys === "arrows" ? "→" : "P"}</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}

/** pymetrics-style Arrows: the colour of the set says which arrows to answer. */
export const Arrows = (p: GameProps) => <Flanker {...p} colourRule count={90} title="Arrows" keys="arrows" />;
/** Arctic Shores-style Direction: always answer the middle arrow, with Q and P. */
export const Direction = (p: GameProps) => <Flanker {...p} colourRule={false} count={80} title="Direction" keys="qp" />;
