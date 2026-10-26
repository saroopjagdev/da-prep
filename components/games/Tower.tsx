"use client";

import { useEffect, useRef, useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import { isSolved, minMoves, movePeg, towerStart, canMove, type Pegs } from "@/lib/games/logic";

const LEVELS = [3, 4, 5];
/** Milliseconds from a steady clock; called only from event handlers. */
const clock = () => performance.now();
type Round = { disks: number; moves: number; seconds: number; firstMove: number };

function result(rounds: Round[]): GameResult {
  const extra = rounds.reduce((s, r) => s + (r.moves - minMoves(r.disks)), 0);
  const slowStart = rounds.filter((r) => r.firstMove >= 4).length;
  return {
    headline: extra === 0 ? "Every level in the fewest moves" : `${extra} move${extra === 1 ? "" : "s"} more than the fewest possible`,
    stats: rounds.map((r) => ({ label: `${r.disks} discs`, value: `${r.moves} moves (fewest ${minMoves(r.disks)}), ${r.seconds}s` })),
    reading: [
      extra === 0 ? "You found the shortest route each time." : "Extra moves usually mean a plan had to be undone. Planning the first few moves before you start tends to cut them.",
      slowStart > 0 ? `You paused for 4 seconds or more before your first move on ${slowStart} level${slowStart === 1 ? "" : "s"}: planning first.` : "You started each level quickly, with little time before the first move.",
    ],
  };
}

export default function Tower({ onFinish }: GameProps) {
  const [level, setLevel] = useState(0);
  const disks = LEVELS[level];
  const [pegs, setPegs] = useState<Pegs>(() => towerStart(LEVELS[0]));
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [note, setNote] = useState("");
  const rounds = useRef<Round[]>([]);
  const t0 = useRef(0);
  const first = useRef<number | null>(null);

  useEffect(() => {
    t0.current = clock();
    first.current = null;
  }, [level]);

  function choose(i: number) {
    // Thinking time: from the level appearing to the first peg chosen.
    if (first.current === null) first.current = (clock() - t0.current) / 1000;
    if (held === null) {
      if (pegs[i].length) setHeld(i);
      return;
    }
    if (held === i) {
      setHeld(null);
      return;
    }
    if (!canMove(pegs, held, i)) {
      setNote("A larger disc cannot go on a smaller one.");
      setHeld(null);
      return;
    }
    const next = movePeg(pegs, held, i);
    const n = moves + 1;
    setHeld(null);
    setNote("");
    if (isSolved(next, disks)) {
      rounds.current.push({ disks, moves: n, seconds: Math.round((clock() - t0.current) / 1000), firstMove: first.current ?? 0 });
      first.current = null;
      if (level + 1 >= LEVELS.length) {
        onFinish(result(rounds.current));
        return;
      }
      setLevel(level + 1);
      setPegs(towerStart(LEVELS[level + 1]));
      setMoves(0);
      setNote(`Level ${level + 1} done in ${n} moves.`);
    } else {
      setPegs(next);
      setMoves(n);
    }
  }

  return (
    <section className="card space-y-4 p-5" aria-label="Tower">
      <p className="text-center text-sm text-muted">
        Level {level + 1} of {LEVELS.length}: {disks} discs · {moves} moves (fewest possible: {minMoves(disks)})
      </p>
      <div className="grid grid-cols-3 gap-3">
        {pegs.map((peg, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            aria-label={`Peg ${i + 1}${i === 2 ? " (target)" : ""}, ${peg.length ? `top disc size ${peg[peg.length - 1]}` : "empty"}${held === i ? ", selected" : ""}`}
            className={`flex h-56 flex-col-reverse items-center gap-1 rounded-xl border-2 p-2 ${held === i ? "border-brand-600 bg-brand-50" : "border-line"} ${i === 2 ? "bg-mint-50" : ""}`}
          >
            {peg.map((d) => (
              <span key={d} className="block h-6 rounded bg-brand-600" style={{ width: `${30 + d * 14}%` }} aria-hidden="true" />
            ))}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-center text-sm">
        {note || (held !== null ? "Now choose where to put it." : "Choose a peg to pick up its top disc. Move the whole stack to the right-hand peg.")}
      </p>
    </section>
  );
}
