"use client";

import { useMemo, useState } from "react";
import { GameStage, Key, StageButton, useKeys, useTrialLoop, type TrialResponse } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { lengthTrials, summariseLengths, type LengthTrial } from "@/lib/games/tasks";

const COUNT = 60;
const pct = (x: number) => `${Math.round(x * 100)}%`;

function Face({ long }: { long: boolean }) {
  const w = long ? 48 : 34;
  return (
    <svg viewBox="0 0 140 140" className="h-40 w-40" role="img" aria-label="A cartoon face with a mouth">
      <circle cx="70" cy="70" r="62" fill="#fde68a" stroke="#f59e0b" strokeWidth="3" />
      <circle cx="48" cy="56" r="7" fill="#1f2937" />
      <circle cx="92" cy="56" r="7" fill="#1f2937" />
      <rect x={70 - w / 2} y="92" width={w} height="8" rx="4" fill="#7c2d12" />
    </svg>
  );
}

function result(trials: LengthTrial[], res: TrialResponse[]): GameResult {
  const said = res.map((r) => r.answer === "long");
  const s = summariseLengths(trials, said);
  return {
    headline: `${pct(s.accuracy)} correct`,
    stats: [
      { label: "Accuracy", value: pct(s.accuracy) },
      { label: "Said long", value: pct(s.longShare) },
      { label: "Long mouths shown", value: pct(s.longShare - s.bias) },
      { label: "Lean towards long", value: `${s.bias >= 0 ? "+" : ""}${Math.round(s.bias * 100)} points` },
    ],
    reading: [
      s.bias > 0.1 ? "You said long more often than the faces required: you followed the side that paid out more." : s.bias < -0.1 ? "You said short more often than the faces required." : "You answered long and short in line with the faces: little pull from the rewards.",
      "In this task one answer pays out more often when it is right. Noticing that, and whether you let it override what you see, is what is being looked at.",
    ],
  };
}

/** Reward learning: a face with a long or short mouth, a reward that is more likely for one of the two answers. */
export default function Lengths({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => lengthTrials(seed, COUNT), [seed]);
  const gaps = useMemo(() => [600], []);
  const [points, setPoints] = useState(0);
  const [note, setNote] = useState("");
  const { i, live, respond } = useTrialLoop({ count: COUNT, gaps, timeout: 2200, onEnd: (res) => onFinish(result(trials, res)) });

  function answer(a: "long" | "short") {
    if (!live) return;
    const t = trials[i];
    const correct = (a === "long") === t.long;
    if (correct && t.rewarded) {
      setPoints((p) => p + 1);
      setNote("+1 point");
    } else setNote(correct ? "Correct, no point this time" : "No point");
    respond(a);
  }
  useKeys((k) => {
    if (k === "ArrowLeft") answer("short");
    if (k === "ArrowRight") answer("long");
  });
  return (
    <GameStage title="Lengths" left={`Face ${i + 1} of ${COUNT}`} right={`${points} points`} progress={i / COUNT} status={note || "Is the mouth short or long? Points are paid for right answers, but not always."}>
      <div className="grid h-48 place-items-center">{live && <Face long={trials[i].long} />}</div>
      <div className="flex justify-center gap-3">
        <StageButton onClick={() => answer("short")}>
          ← Short <Key>←</Key>
        </StageButton>
        <StageButton onClick={() => answer("long")}>
          Long → <Key>→</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}
