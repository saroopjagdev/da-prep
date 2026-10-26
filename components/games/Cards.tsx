"use client";

import { useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import { CARD_START, CARD_TURNS, DECKS, drawCard, netPerTen, type Deck } from "@/lib/games/logic";

function result(picks: Deck[], total: number): GameResult {
  const count = (d: Deck) => picks.filter((p) => p === d).length;
  const good = count("C") + count("D");
  const late = picks.slice(-15);
  const lateGood = late.filter((p) => p === "C" || p === "D").length;
  const first = picks.slice(0, 15).filter((p) => p === "C" || p === "D").length;
  const reading = [
    `You drew ${good} of ${picks.length} cards from decks C and D, the two that pay less per card but cost less over time (each nets about +${netPerTen("C")} per ten cards). A and B net about ${netPerTen("A")}.`,
    lateGood > first + 1
      ? "In your last 15 cards you favoured the steadier decks more than at the start: you learned from the losses."
      : lateGood < first - 1
        ? "You leaned towards the steadier decks early and drifted away from them later."
        : "Your choice of decks stayed about the same from start to finish.",
  ];
  return {
    headline: `You finished on ${total} points`,
    stats: [
      { label: "Final points", value: String(total) },
      { label: "Deck A / B / C / D", value: DECKS.map(count).join(" / ") },
      { label: "Steadier decks (C and D)", value: `${good} of ${picks.length}` },
      { label: "Steadier decks in last 15 draws", value: `${lateGood} of ${late.length}` },
    ],
    reading,
  };
}

export default function Cards({ seed, onFinish }: GameProps) {
  const [picks, setPicks] = useState<Deck[]>([]);
  const [total, setTotal] = useState(CARD_START);
  const [last, setLast] = useState("");

  function pick(deck: Deck) {
    const { gain, loss } = drawCard(seed, deck, picks.filter((p) => p === deck).length);
    const all = [...picks, deck];
    const points = total + gain - loss;
    setLast(`Deck ${deck}: you won ${gain}${loss ? ` and lost ${loss}` : ""}.`);
    setTotal(points);
    if (all.length >= CARD_TURNS) onFinish(result(all, points));
    else setPicks(all);
  }

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Four decks">
      <p className="text-sm text-muted">
        Card {picks.length + 1} of {CARD_TURNS}
      </p>
      <p className="text-2xl font-bold tabular-nums" aria-label={`${total} points`}>
        {total} points
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DECKS.map((d) => (
          <button key={d} type="button" className="btn btn-secondary !h-28 !text-xl" onClick={() => pick(d)} aria-label={`Draw a card from deck ${d}`}>
            Deck {d}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {last}
      </p>
    </section>
  );
}
