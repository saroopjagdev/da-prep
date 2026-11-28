"use client";

import { useMemo, useRef, useState } from "react";
import { GameStage } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { stacksKey, towerMove, towerPuzzles, type Stacks } from "@/lib/games/tasks";

/** Milliseconds from a steady clock; called only from event handlers. */
const clock = () => performance.now();
type Round = { best: number; moves: number; seconds: number; firstMove: number };

const DISC = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
const NAMES = ["red", "amber", "green", "blue", "purple"];

function result(rounds: Round[]): GameResult {
  const extra = rounds.reduce((s, r) => s + (r.moves - r.best), 0);
  const perfect = rounds.filter((r) => r.moves === r.best).length;
  const slowStart = rounds.filter((r) => r.firstMove >= 5).length;
  return {
    headline: extra === 0 ? "Every puzzle in the fewest moves" : `${perfect} of ${rounds.length} puzzles in the fewest moves`,
    stats: [
      { label: "Puzzles solved", value: `${rounds.length} of ${rounds.length}` },
      { label: "Extra moves in total", value: String(extra) },
      { label: "Average time before the first move", value: `${(rounds.reduce((s, r) => s + r.firstMove, 0) / rounds.length).toFixed(1)}s` },
      { label: "Total time", value: `${rounds.reduce((s, r) => s + r.seconds, 0)}s` },
    ],
    reading: [
      extra === 0 ? "You found the shortest route every time." : "Extra moves usually mean a plan had to be undone. Planning the whole route before the first move tends to cut them.",
      slowStart > 0 ? `You paused for 5 seconds or more before your first move on ${slowStart} puzzle${slowStart === 1 ? "" : "s"}: planning first.` : "You started each puzzle quickly, with little thinking time before the first move.",
    ],
  };
}

function Board({ stacks, held, onPick, label, small }: { stacks: Stacks; held?: number | null; onPick?: (i: number) => void; label: string; small?: boolean }) {
  return (
    <div className="space-y-1.5">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/60">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {stacks.map((peg, i) => (
          <button
            key={i}
            type="button"
            disabled={!onPick}
            onClick={() => onPick?.(i)}
            aria-label={`${label}, peg ${i + 1}: ${peg.length ? `${peg.map((d) => NAMES[d]).join(", ")} from the bottom` : "empty"}${held === i ? ", selected" : ""}`}
            className={`relative flex flex-col-reverse items-center justify-start gap-1 rounded-lg border-2 px-2 pb-2 pt-1 ${small ? "h-36" : "h-52"} ${held === i ? "border-white bg-white/15" : "border-white/20 bg-white/5"} ${onPick ? "hover:bg-white/10" : ""}`}
          >
            <span className="pointer-events-none absolute inset-x-1/2 bottom-0 top-3 w-1 -translate-x-1/2 rounded bg-white/15" aria-hidden="true" />
            {peg.map((d) => (
              <span key={d} className={`relative block w-4/5 rounded-md shadow ${small ? "h-5" : "h-7"}`} style={{ background: DISC[d] }} aria-hidden="true" />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Tower({ seed, onFinish }: GameProps) {
  const puzzles = useMemo(() => towerPuzzles(seed), [seed]);
  const [level, setLevel] = useState(0);
  const [stacks, setStacks] = useState<Stacks>(puzzles[0].start);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [note, setNote] = useState("");
  const rounds = useRef<Round[]>([]);
  const t0 = useRef<number | null>(null);
  const first = useRef<number | null>(null);
  const p = puzzles[level];

  function choose(i: number) {
    const now = clock();
    t0.current ??= now;
    if (held === null) {
      if (stacks[i].length) setHeld(i);
      return;
    }
    if (held === i) {
      setHeld(null);
      return;
    }
    first.current ??= (now - t0.current) / 1000;
    const next = towerMove(stacks, held, i);
    const n = moves + 1;
    setHeld(null);
    if (stacksKey(next) === stacksKey(p.target)) {
      rounds.current.push({ best: p.best, moves: n, seconds: Math.round((now - t0.current) / 1000), firstMove: first.current ?? 0 });
      t0.current = null;
      first.current = null;
      if (level + 1 >= puzzles.length) {
        onFinish(result(rounds.current));
        return;
      }
      setLevel(level + 1);
      setStacks(puzzles[level + 1].start);
      setMoves(0);
      setNote(n === p.best ? `Solved in ${n}: the fewest possible.` : `Solved in ${n} moves (fewest possible: ${p.best}).`);
    } else {
      setStacks(next);
      setMoves(n);
      setNote("");
    }
  }

  return (
    <GameStage title="Tower" left={`Puzzle ${level + 1} of ${puzzles.length}`} right={`${moves} moves (fewest possible: ${p.best})`} progress={level / puzzles.length} status={note || (held !== null ? "Now choose where to put it." : "Choose a peg to lift its top disc. Make the left board match the target.")}>
      <div className="grid gap-4 sm:grid-cols-[1fr_0.6fr]">
        <Board stacks={stacks} held={held} onPick={choose} label="Your board" />
        <Board stacks={p.target} label="Target" small />
      </div>
    </GameStage>
  );
}

