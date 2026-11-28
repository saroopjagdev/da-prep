"use client";

import { useMemo } from "react";
import { GameStage, Key, StageButton, useKeys, useTrialLoop, type TrialResponse } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { goTrials, mean, type GoTrial } from "@/lib/games/logic";

const COUNT = 120;

function result(trials: GoTrial[], res: TrialResponse[], early: number): GameResult {
  const rows = trials.slice(0, res.length).map((t, i) => ({ t, pressed: res[i].answer !== null, rt: res[i].rt }));
  const go = rows.filter((x) => x.t.go);
  const stop = rows.filter((x) => !x.t.go);
  const hits = go.filter((x) => x.pressed);
  const falseAlarms = stop.filter((x) => x.pressed).length;
  const rt = mean(hits.map((x) => x.rt as number));
  return {
    headline: hits.length ? `Average reaction ${Math.round(rt)} ms, ${falseAlarms} wrong presses` : "No red circles caught",
    stats: [
      { label: "Average reaction (red circle)", value: hits.length ? `${Math.round(rt)} ms` : "none" },
      { label: "Red circles caught", value: `${hits.length} of ${go.length}` },
      { label: "Pressed for a green circle", value: `${falseAlarms} of ${stop.length}` },
      { label: "Pressed too early", value: String(early) },
    ],
    reading: [
      falseAlarms > stop.length / 3 ? "You pressed for several green circles: you favoured speed over restraint." : "You held back on most green circles: restraint was good.",
      early > 4 ? "Several early presses: wait for the circle before you react." : go.length - hits.length > 6 ? "You missed several red circles: a little more readiness would help." : "Good control: few early presses and few misses.",
    ],
  };
}

/** Go / no-go: press for the red circle, hold back for the green one. Reported for pymetrics Stop and HireVue Pulse. */
export default function Stop({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => goTrials(seed, COUNT, 0.25, 250, 650), [seed]);
  const gaps = useMemo(() => trials.map((t) => t.wait), [trials]);
  const { i, live, respond } = useTrialLoop({ count: COUNT, gaps, timeout: 700, onEnd: (res, early) => onFinish(result(trials, res, early)) });
  useKeys((k) => k === " " && respond("press"));
  const t = trials[i];
  return (
    <GameStage title="Stop" left={`Circle ${i + 1} of ${COUNT}`} progress={i / COUNT} status="Red circle: press as fast as you can. Green circle: do nothing.">
      <div className="grid h-44 place-items-center">
        {live && <span className={`block h-32 w-32 rounded-full shadow-lg ${t.go ? "bg-red-500" : "bg-green-500"}`} role="img" aria-label={t.go ? "Red circle: press now" : "Green circle: do not press"} />}
      </div>
      <div className="flex justify-center">
        <StageButton kind="primary" onClick={() => respond("press")}>
          Press <Key>Space</Key>
        </StageButton>
      </div>
    </GameStage>
  );
}
