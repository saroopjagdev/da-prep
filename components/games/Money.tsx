"use client";

import { useState } from "react";
import type { GameProps, GameResult } from "@/components/games/types";
import { OFFERS, TRUST, mean, summariseMoney, trustReturn } from "@/lib/games/logic";

function result(sent: number[], accepted: boolean[]): GameResult {
  const s = summariseMoney(sent, accepted);
  const half = Math.floor(sent.length / 2);
  const early = mean(sent.slice(0, half));
  const late = mean(sent.slice(half));
  return {
    headline: `You sent ${s.avgSent.toFixed(1)} of ${TRUST.endowment} on average`,
    stats: [
      { label: "Average sent to partner", value: `${s.avgSent.toFixed(1)} of ${TRUST.endowment}` },
      { label: "Sent: first half, then second half", value: `${early.toFixed(1)}, then ${late.toFixed(1)}` },
      { label: "Offers accepted", value: `${accepted.filter(Boolean).length} of ${accepted.length}` },
      { label: "Low offers (3 or under) accepted", value: `${s.acceptedLow} of ${s.lowOffers}` },
    ],
    reading: [
      s.avgSent >= 7 ? "You trusted your partner with most of your money: a high-trust pattern." : s.avgSent <= 3 ? "You kept most of your money: a low-trust pattern." : "You sent a middling amount: a mixed pattern.",
      late < early - 1 ? "You sent less in the second half, after seeing how your partner behaved: you adjusted." : late > early + 1 ? "You sent more in the second half: your trust grew as you played." : "Your trust stayed steady as you played.",
      s.acceptedLow === s.lowOffers ? "You accepted every low offer, taking something over nothing." : s.acceptedLow === 0 ? "You rejected every low offer, even at a cost to yourself: fairness mattered more than the money." : "You accepted some low offers and rejected others.",
    ],
  };
}

export default function Money({ onFinish }: GameProps) {
  const [part, setPart] = useState<1 | 2>(1);
  const [round, setRound] = useState(0);
  const [amount, setAmount] = useState(5);
  const [sent, setSent] = useState<number[]>([]);
  const [accepted, setAccepted] = useState<boolean[]>([]);
  const [note, setNote] = useState("");
  const [total, setTotal] = useState(0);

  function send() {
    const back = trustReturn(amount, round);
    const gain = TRUST.endowment - amount + back;
    setTotal(total + gain);
    setNote(`You sent ${amount}. It became ${amount * TRUST.multiplier}. Your partner sent back ${back}, so you kept ${gain} this round.`);
    setSent([...sent, amount]);
    if (round + 1 >= TRUST.rounds) setPart(2);
    setRound(round + 1 >= TRUST.rounds ? 0 : round + 1);
  }

  function decide(ok: boolean) {
    const all = [...accepted, ok];
    setNote(ok ? `You accepted ${OFFERS[round]}.` : "You rejected the offer: you both get nothing.");
    if (all.length >= OFFERS.length) onFinish(result(sent, all));
    else {
      setAccepted(all);
      setRound(round + 1);
    }
  }

  return (
    <section className="card space-y-4 p-5 text-center" aria-label="Money exchange">
      {part === 1 ? (
        <>
          <p className="text-sm text-muted">
            Part 1 · Round {round + 1} of {TRUST.rounds} · Kept so far {total}
          </p>
          <p>You have {TRUST.endowment}. How much do you send to your partner? It is multiplied by {TRUST.multiplier} on the way.</p>
          <div className="mx-auto max-w-sm space-y-2">
            <label htmlFor="send" className="block text-sm font-medium">
              Send: <strong className="tabular-nums">{amount}</strong>
            </label>
            <input id="send" type="range" min={0} max={TRUST.endowment} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
          <button type="button" className="btn btn-primary" onClick={send}>
            Send {amount}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted">
            Part 2 · Offer {round + 1} of {OFFERS.length}
          </p>
          <p>
            Your partner has 10 to split. They offer you <strong>{OFFERS[round]}</strong> and keep {10 - OFFERS[round]}. If you reject, you both get nothing.
          </p>
          <div className="flex justify-center gap-3">
            <button type="button" className="btn btn-primary" onClick={() => decide(true)}>
              Accept
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => decide(false)}>
              Reject
            </button>
          </div>
        </>
      )}
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {note}
      </p>
    </section>
  );
}
