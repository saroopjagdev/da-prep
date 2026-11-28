"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameStage, Key, StageButton, useKeys } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { EEFRT, effortTrials, type EffortTrial } from "@/lib/games/tasks";

type Choice = "easy" | "hard";
type Done = { trial: EffortTrial; choice: Choice; completed: boolean };
type Phase = { name: "choose" } | { name: "work"; choice: Choice; presses: number; startedAt: number } | { name: "outcome"; text: string };

const money = (n: number) => `£${n.toFixed(2)}`;

function result(done: Done[]): GameResult {
  const hard = done.filter((d) => d.choice === "hard");
  const band = (p: number) => {
    const xs = done.filter((d) => d.trial.probability === p);
    return xs.length ? `${xs.filter((d) => d.choice === "hard").length} of ${xs.length}` : "none";
  };
  const earned = done.reduce((s, d) => s + (d.completed && d.trial.wins ? (d.choice === "hard" ? d.trial.hardReward : EEFRT.easy.reward) : 0), 0);
  const bigHard = done.filter((d) => d.trial.hardReward >= 3);
  const smallHard = done.filter((d) => d.trial.hardReward < 2);
  const hardRate = (xs: Done[]) => (xs.length ? xs.filter((d) => d.choice === "hard").length / xs.length : 0);
  return {
    headline: `${hard.length} of ${done.length} hard tasks chosen`,
    stats: [
      { label: "Hard tasks chosen", value: `${hard.length} of ${done.length}` },
      { label: "Hard when a win was unlikely (12%)", value: band(0.12) },
      { label: "Hard when a win was likely (88%)", value: band(0.88) },
      { label: "Earned", value: money(earned) },
    ],
    reading: [
      hardRate(bigHard) > hardRate(smallHard) + 0.2 ? "You chose the hard task more when the reward was large: effort followed the payoff." : hard.length === 0 ? "You always took the easy task: a low-effort pattern, but it kept the money safe." : "Your choices did not change much with the size of the reward.",
      "Employers look at how you trade effort against reward and risk. There is no correct number of hard tasks.",
    ],
  };
}

export default function Effort({ seed, onFinish }: GameProps) {
  const trials = useMemo(() => effortTrials(seed), [seed]);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>({ name: "choose" });
  const [left, setLeft] = useState(0);
  const done = useRef<Done[]>([]);
  const t = trials[i];

  function next(extra: Done) {
    done.current.push(extra);
    if (done.current.length >= trials.length) onFinish(result(done.current));
    else {
      setI(done.current.length);
      setPhase({ name: "choose" });
    }
  }
  function choose(choice: Choice) {
    if (phase.name !== "choose") return;
    setPhase({ name: "work", choice, presses: 0, startedAt: performance.now() });
  }
  function settle(choice: Choice, completed: boolean) {
    const text = completed ? (t.wins ? `Done. You won ${money(choice === "hard" ? t.hardReward : EEFRT.easy.reward)}.` : "Done, but this round paid nothing.") : "Time ran out. No reward.";
    setPhase({ name: "outcome", text });
    window.setTimeout(() => next({ trial: t, choice, completed }), 1400);
  }
  function press() {
    if (phase.name !== "work") return;
    const need = EEFRT[phase.choice].presses;
    const presses = phase.presses + 1;
    if (presses >= need) settle(phase.choice, true);
    else setPhase({ ...phase, presses });
  }
  useKeys((k) => {
    if (k === "e" || k === "E") choose("easy");
    if (k === "i" || k === "I" || k === "h" || k === "H") choose("hard");
    if (k === " ") press();
  });

  const working = phase.name === "work" ? phase : null;
  useEffect(() => {
    if (!working) return;
    const limit = EEFRT[working.choice].ms;
    const startedAt = working.startedAt;
    const id = window.setInterval(() => {
      const remaining = limit - (performance.now() - startedAt);
      setLeft(Math.max(0, Math.ceil(remaining / 1000)));
      if (remaining <= 0) {
        window.clearInterval(id);
        settle(working.choice, false);
      }
    }, 200);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [working?.choice, working?.startedAt]);

  const need = working ? EEFRT[working.choice].presses : 0;
  return (
    <GameStage title="Easy or Hard" left={`Round ${i + 1} of ${trials.length}`} right={working ? `${left}s left` : undefined} progress={i / trials.length} status={phase.name === "outcome" ? phase.text : phase.name === "work" ? `Press Space ${need - phase.presses} more times.` : "Choose a task, then press Space as fast as you can."}>
      {phase.name === "work" ? (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">{phase.choice === "hard" ? "Hard task" : "Easy task"}: press Space</p>
          <div className="mx-auto h-5 max-w-sm overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={need} aria-valuenow={phase.presses} aria-label="Presses">
            <div className="h-full bg-brand-500" style={{ width: `${(phase.presses / need) * 100}%` }} />
          </div>
          <StageButton kind="primary" onClick={press}>
            Press <Key>Space</Key>
          </StageButton>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-4 text-center ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/60">Easy</p>
              <p className="text-2xl font-bold">{money(EEFRT.easy.reward)}</p>
              <p className="text-sm text-white/70">{EEFRT.easy.presses} presses in {EEFRT.easy.ms / 1000}s</p>
              <p className="text-sm text-white/70">Always pays</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/60">Hard</p>
              <p className="text-2xl font-bold">{money(t.hardReward)}</p>
              <p className="text-sm text-white/70">{EEFRT.hard.presses} presses in {EEFRT.hard.ms / 1000}s</p>
              <p className="text-sm text-white/70">{Math.round(t.probability * 100)}% chance it pays</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <StageButton onClick={() => choose("easy")} disabled={phase.name !== "choose"}>
              Easy <Key>E</Key>
            </StageButton>
            <StageButton kind="primary" onClick={() => choose("hard")} disabled={phase.name !== "choose"}>
              Hard <Key>I</Key>
            </StageButton>
          </div>
        </div>
      )}
    </GameStage>
  );
}
