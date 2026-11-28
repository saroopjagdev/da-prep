"use client";

import { useState } from "react";
import { GameStage, StageButton } from "@/components/games/stage";
import type { GameProps, GameResult } from "@/components/games/types";
import { OFFERS, TRUST, ULTIMATUM, mean, partnerAccepts, trustReturn } from "@/lib/games/logic";

/** Money Exchange 1: trust. Send some of 10 (it triples), and a partner decides how much to send back. */
export function MoneyTrust({ onFinish }: GameProps) {
  const [round, setRound] = useState(0);
  const [amount, setAmount] = useState(5);
  const [sent, setSent] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [total, setTotal] = useState(0);

  function send() {
    const back = trustReturn(amount, round);
    const gain = TRUST.endowment - amount + back;
    const all = [...sent, amount];
    const kept = total + gain;
    if (all.length >= TRUST.rounds) {
      const half = Math.floor(all.length / 2);
      const early = mean(all.slice(0, half));
      const late = mean(all.slice(half));
      const avg = mean(all);
      const res: GameResult = {
        headline: `You sent ${avg.toFixed(1)} of ${TRUST.endowment} on average`,
        stats: [
          { label: "Average sent to partner", value: `${avg.toFixed(1)} of ${TRUST.endowment}` },
          { label: "Sent: first half, then second half", value: `${early.toFixed(1)}, then ${late.toFixed(1)}` },
          { label: "Kept in total", value: String(kept) },
          { label: "Sent nothing in", value: `${all.filter((x) => x === 0).length} rounds` },
        ],
        reading: [
          avg >= 7 ? "You trusted your partner with most of your money: a high-trust pattern." : avg <= 3 ? "You kept most of your money: a low-trust pattern." : "You sent a middling amount: a mixed pattern.",
          late < early - 1 ? "You sent less in the second half, after seeing how your partner behaved: you adjusted." : late > early + 1 ? "You sent more in the second half: your trust grew as you played." : "Your trust stayed steady as you played.",
        ],
      };
      onFinish(res);
      return;
    }
    setSent(all);
    setTotal(kept);
    setRound(round + 1);
    setNote(`You sent ${amount}. It became ${amount * TRUST.multiplier}. Your partner sent back ${back}, so you kept ${gain} this round.`);
  }

  return (
    <GameStage title="Money Exchange 1" left={`Round ${round + 1} of ${TRUST.rounds}`} right={`Kept so far ${total}`} progress={round / TRUST.rounds} status={note || "There is no right amount. Choose what you would honestly do."}>
      <div className="mx-auto max-w-sm space-y-5 text-center">
        <p>
          You have <strong>{TRUST.endowment}</strong>. How much do you send to your partner? It is multiplied by {TRUST.multiplier} on the way, and they decide how much to send back.
        </p>
        <div className="space-y-2">
          <label htmlFor="send" className="block text-sm font-medium text-white/80">
            Send: <strong className="text-2xl tabular-nums text-white">{amount}</strong>
          </label>
          <input id="send" type="range" min={0} max={TRUST.endowment} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-teal-400" />
        </div>
        <StageButton kind="primary" onClick={send}>
          Send {amount}
        </StageButton>
      </div>
    </GameStage>
  );
}

/** Money Exchange 2: fairness. Answer offers, and propose splits of 10. A refusal leaves both with nothing. */
export function MoneyShare({ onFinish }: GameProps) {
  const [round, setRound] = useState(0);
  const [offer, setOffer] = useState(4);
  const [note, setNote] = useState("");
  const [answers, setAnswers] = useState<{ low: boolean; accepted: boolean }[]>([]);
  const [proposals, setProposals] = useState<{ offered: number; accepted: boolean }[]>([]);
  const [earned, setEarned] = useState(0);

  const responding = round % 2 === 0;
  const respIdx = Math.floor(round / 2);
  const propIdx = Math.floor(round / 2);

  function advance(nextAnswers = answers, nextProposals = proposals, gain = 0) {
    const total = earned + gain;
    setEarned(total);
    if (round + 1 >= ULTIMATUM.rounds) {
      const low = nextAnswers.filter((a) => a.low);
      const accLow = low.filter((a) => a.accepted).length;
      const avgOffer = mean(nextProposals.map((p) => p.offered));
      onFinish({
        headline: `You earned ${total} of a possible ${ULTIMATUM.pot * ULTIMATUM.rounds}`,
        stats: [
          { label: "Offers you accepted", value: `${nextAnswers.filter((a) => a.accepted).length} of ${nextAnswers.length}` },
          { label: "Low offers (3 or under) accepted", value: `${accLow} of ${low.length}` },
          { label: "Average amount you offered", value: `${avgOffer.toFixed(1)} of ${ULTIMATUM.pot}` },
          { label: "Your proposals accepted", value: `${nextProposals.filter((p) => p.accepted).length} of ${nextProposals.length}` },
        ],
        reading: [
          low.length && accLow === low.length ? "You accepted every low offer, taking something over nothing." : accLow === 0 && low.length ? "You rejected every low offer, even at a cost to yourself: fairness mattered more than the money." : "You accepted some low offers and rejected others.",
          avgOffer >= 5 ? "You offered an even split or better: a generous pattern." : avgOffer <= 3 ? "You offered little and risked rejection: a self-interested pattern." : "You offered a moderate share: a balanced pattern.",
        ],
      });
      return;
    }
    setAnswers(nextAnswers);
    setProposals(nextProposals);
    setRound(round + 1);
  }

  function decide(ok: boolean) {
    const o = OFFERS[respIdx % OFFERS.length];
    setNote(ok ? `You accepted ${o} and your partner kept ${ULTIMATUM.pot - o}.` : "You rejected the offer: you both get nothing.");
    advance([...answers, { low: o <= 3, accepted: ok }], proposals, ok ? o : 0);
  }
  function propose() {
    const ok = partnerAccepts(offer, propIdx);
    setNote(ok ? `Your partner accepted. You keep ${ULTIMATUM.pot - offer}, they get ${offer}.` : "Your partner rejected it: you both get nothing.");
    advance(answers, [...proposals, { offered: offer, accepted: ok }], ok ? ULTIMATUM.pot - offer : 0);
  }

  return (
    <GameStage title="Money Exchange 2" left={`Round ${round + 1} of ${ULTIMATUM.rounds}`} right={`Earned ${earned}`} progress={round / ULTIMATUM.rounds} status={note || "If an offer is rejected, both of you get nothing."}>
      {responding ? (
        <div className="mx-auto max-w-sm space-y-5 text-center">
          <p>
            Your partner has {ULTIMATUM.pot} to split. They offer you <strong className="text-2xl">{OFFERS[respIdx % OFFERS.length]}</strong> and keep {ULTIMATUM.pot - OFFERS[respIdx % OFFERS.length]}.
          </p>
          <div className="flex justify-center gap-3">
            <StageButton kind="primary" onClick={() => decide(true)}>
              Accept
            </StageButton>
            <StageButton onClick={() => decide(false)}>Reject</StageButton>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-sm space-y-5 text-center">
          <p>
            You have {ULTIMATUM.pot} to split. How much do you offer your partner? If they reject it, you both get nothing.
          </p>
          <div className="space-y-2">
            <label htmlFor="offer" className="block text-sm font-medium text-white/80">
              Offer: <strong className="text-2xl tabular-nums text-white">{offer}</strong> (you keep {ULTIMATUM.pot - offer})
            </label>
            <input id="offer" type="range" min={0} max={ULTIMATUM.pot} value={offer} onChange={(e) => setOffer(Number(e.target.value))} className="w-full accent-teal-400" />
          </div>
          <StageButton kind="primary" onClick={propose}>
            Offer {offer}
          </StageButton>
        </div>
      )}
    </GameStage>
  );
}
