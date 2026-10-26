"use client";

import Link from "next/link";
import { useState } from "react";
import Balloon from "@/components/games/Balloon";
import Cards from "@/components/games/Cards";
import { DigitSpan, Sequence } from "@/components/games/Spans";
import { Flashback, Keypress, Reaction, Stroop } from "@/components/games/Speed";
import Money from "@/components/games/Money";
import Tower from "@/components/games/Tower";
import type { GameComponent, GameResult } from "@/components/games/types";
import { GAME_DISCLAIMER, GAMES, type Game } from "@/lib/games/catalog";
import { track } from "@/lib/funnel";

const COMPONENTS: Record<string, GameComponent> = {
  balloon: Balloon,
  cards: Cards,
  tower: Tower,
  "digit-span": DigitSpan,
  sequence: Sequence,
  flashback: Flashback,
  reaction: Reaction,
  keypress: Keypress,
  money: Money,
  stroop: Stroop,
};

type Phase = { name: "intro" } | { name: "play"; seed: number } | { name: "done"; result: GameResult };

/** One game from start to finish: how it works, the game itself, then your numbers and what to try next. */
export default function GamePlayer({ game }: { game: Game }) {
  const [phase, setPhase] = useState<Phase>({ name: "intro" });
  const Play = COMPONENTS[game.id];
  if (!Play) return null;
  const others = GAMES.filter((g) => g.id !== game.id).slice(0, 4);

  if (phase.name === "play") {
    return (
      <div className="space-y-3">
        <Play
          seed={phase.seed}
          onFinish={(result) => {
            track("game_complete");
            setPhase({ name: "done", result });
          }}
        />
        <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
      </div>
    );
  }

  if (phase.name === "done") {
    const { result } = phase;
    return (
      <div className="space-y-5">
        <section className="card space-y-3 p-5" aria-label="Your result">
          <h2 className="text-xl font-bold tracking-tight">{result.headline}</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {result.stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-brand-50 p-3">
                <dt className="text-xs uppercase tracking-wide text-muted">{s.label}</dt>
                <dd className="text-lg font-bold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.reading.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            {game.kind === "traits"
              ? "This style of task has no right or wrong answers: employers look at your pattern of choices, not a pass mark."
              : "Employers do not publish pass marks for tasks like this, so use your numbers to compare your own attempts."}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => setPhase({ name: "play", seed: Date.now() % 1_000_000_000 })}>
              Play again
            </button>
            <Link href="/games" className="btn btn-secondary">
              All games
            </Link>
          </div>
        </section>

        <section className="space-y-2" aria-label="Try another game">
          <h2 className="font-semibold">Try another</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {others.map((g) => (
              <li key={g.id}>
                <Link href={g.href ?? `/games/${g.id}`} className="card block p-3 hover:ring-2 hover:ring-brand-500">
                  <span className="font-semibold">{g.name}</span>
                  <span className="block text-sm text-muted">{g.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
      </div>
    );
  }

  return (
    <section className="card space-y-4 p-5" aria-label={`${game.name}: how it works`}>
      <p>{game.about}</p>
      <div>
        <h2 className="font-semibold">How to play</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {game.how.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-muted">About {game.minutes} minutes. Use a laptop or tablet if you can, in a quiet place. {game.kind === "traits" ? "There are no right or wrong answers." : "Work quickly but carefully."}</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          track("game_start");
          setPhase({ name: "play", seed: Date.now() % 1_000_000_000 });
        }}
      >
        Start
      </button>
      <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
    </section>
  );
}
