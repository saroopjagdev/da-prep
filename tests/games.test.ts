import { describe, expect, it } from "vitest";
import { GAMES, GAME_DISCLAIMER, PLAYABLE, getGame, gamesForText } from "@/lib/games/catalog";
import {
  BALLOON,
  CARD_TURNS,
  DECKS,
  KEY_ROUNDS,
  OFFERS,
  PARTNER_RETURNS,
  SPAN_MAX_MISSES,
  SPAN_START,
  TRUST,
  backTrials,
  balloonBursts,
  canMove,
  digitSequence,
  drawCard,
  goTrials,
  isSolved,
  minMoves,
  movePeg,
  netPerTen,
  nextSpan,
  scoreSignal,
  summariseBalloon,
  summariseKeys,
  summariseMoney,
  tileSequence,
  towerStart,
  trustReturn,
  wordTrials,
} from "@/lib/games/logic";
import { practiceLinks } from "@/lib/firms/glance";
import { getFirm } from "@/lib/firms";

describe("balloon", () => {
  it("is the same for the same seed and bursts somewhere between 1 and the maximum", () => {
    expect(balloonBursts(7)).toEqual(balloonBursts(7));
    expect(balloonBursts(7)).not.toEqual(balloonBursts(8));
    for (const b of balloonBursts(3, 500)) expect(b).toBeGreaterThanOrEqual(1), expect(b).toBeLessThanOrEqual(BALLOON.maxPumps);
  });
  it("banks only the balloons that did not burst", () => {
    const s = summariseBalloon([{ pumps: 4, popped: false }, { pumps: 9, popped: true }, { pumps: 6, popped: false }]);
    expect(s).toEqual({ banked: 50, pops: 1, avgPumpsKept: 5 });
  });
});

describe("card decks", () => {
  it("A and B lose over ten cards and C and D gain, as intended", () => {
    expect(netPerTen("A")).toBe(-250);
    expect(netPerTen("B")).toBe(-250);
    expect(netPerTen("C")).toBe(250);
    expect(netPerTen("D")).toBe(250);
  });
  it("every block of ten cards from a deck carries exactly that deck's gains and losses", () => {
    for (const deck of DECKS)
      for (let block = 0; block < 4; block++) {
        const cards = Array.from({ length: 10 }, (_, k) => drawCard(99, deck, block * 10 + k));
        expect(cards.reduce((s, c) => s + c.gain - c.loss, 0)).toBe(netPerTen(deck));
      }
    expect(CARD_TURNS).toBe(40);
  });
});

describe("tower", () => {
  it("starts with everything on the first peg, largest at the bottom", () => {
    expect(towerStart(3)).toEqual([[3, 2, 1], [], []]);
  });
  it("never lets a larger disc onto a smaller one, or move from an empty peg", () => {
    const p = movePeg(towerStart(3), 0, 1);
    expect(canMove(p, 0, 1)).toBe(false);
    expect(movePeg(p, 0, 1)).toBe(p);
    expect(canMove(p, 2, 0)).toBe(false);
    expect(canMove(p, 1, 1)).toBe(false);
  });
  it("can be solved in exactly the fewest moves by the standard method", () => {
    for (const n of [3, 4, 5]) {
      let pegs = towerStart(n);
      let moves = 0;
      const solve = (k: number, from: number, to: number, via: number) => {
        if (k === 0) return;
        solve(k - 1, from, via, to);
        expect(canMove(pegs, from, to)).toBe(true);
        pegs = movePeg(pegs, from, to);
        moves++;
        solve(k - 1, via, to, from);
      };
      solve(n, 0, 2, 1);
      expect(isSolved(pegs, n)).toBe(true);
      expect(moves).toBe(minMoves(n));
    }
  });
});

describe("memory spans", () => {
  it("makes sequences of the right length with no immediate repeats", () => {
    for (const len of [3, 7, 12]) {
      const d = digitSequence(5, len);
      expect(d).toHaveLength(len);
      expect(d.every((x, i) => x >= 0 && x <= 9 && x !== d[i - 1])).toBe(true);
      const t = tileSequence(5, len);
      expect(t.every((x, i) => x >= 0 && x <= 8 && x !== t[i - 1])).toBe(true);
    }
  });
  it("gets longer after a right answer and ends after two wrong ones", () => {
    let s = { length: SPAN_START, misses: 0, best: 0 };
    let step = nextSpan(s, true);
    expect(step).toMatchObject({ length: SPAN_START + 1, best: SPAN_START, done: false });
    s = step;
    step = nextSpan(s, false);
    expect(step).toMatchObject({ length: SPAN_START + 1, misses: 1, best: SPAN_START, done: false });
    step = nextSpan(step, false);
    expect(step.misses).toBe(SPAN_MAX_MISSES);
    expect(step.done).toBe(true);
  });
});

describe("flashback", () => {
  it("marks a trial a match only when it repeats the shape before it", () => {
    const t = backTrials(11, 300, 1, 0.3);
    expect(t[0].match).toBe(false);
    t.forEach((x, i) => {
      if (i > 0) expect(x.match).toBe(x.shape === t[i - 1].shape);
    });
    const share = t.filter((x) => x.match).length / (t.length - 1);
    expect(share).toBeGreaterThan(0.2);
    expect(share).toBeLessThan(0.4);
  });
  it("scores hits, misses, false alarms and correct rejections", () => {
    const trials = [{ match: false }, { match: true }, { match: true }, { match: false }];
    expect(scoreSignal(trials, [false, true, false, true])).toEqual({ hits: 1, misses: 1, falseAlarms: 1, correctRejections: 1, accuracy: 0.5 });
  });
});

describe("go / no-go and colour words", () => {
  it("has the intended share of no-go shapes and sensible waits", () => {
    const t = goTrials(2, 400);
    const noGo = t.filter((x) => !x.go).length / t.length;
    expect(noGo).toBeGreaterThan(0.18);
    expect(noGo).toBeLessThan(0.32);
    expect(t.every((x) => x.wait >= 500 && x.wait <= 1400 && x.shape === (x.go ? "circle" : "square"))).toBe(true);
  });
  it("makes colour-word trials where congruent means the word matches the ink", () => {
    for (const t of wordTrials(4, 200)) expect(t.congruent).toBe(t.word === t.ink);
  });
});

describe("money exchange", () => {
  it("triples what is sent and returns a fixed share, never more than was received", () => {
    for (let r = 0; r < TRUST.rounds; r++)
      for (let s = 0; s <= TRUST.endowment; s++) {
        const back = trustReturn(s, r);
        expect(back).toBeGreaterThanOrEqual(0);
        expect(back).toBeLessThanOrEqual(s * TRUST.multiplier);
      }
    expect(trustReturn(10, 0)).toBe(Math.round(30 * PARTNER_RETURNS[0]));
    expect(trustReturn(0, 3)).toBe(0);
  });
  it("summarises sending and how low offers were treated", () => {
    const accepted = OFFERS.map((o) => o >= 4);
    const s = summariseMoney([2, 4, 6], accepted);
    expect(s.avgSent).toBe(4);
    expect(s.acceptedLow).toBe(0);
    expect(s.lowOffers).toBe(OFFERS.filter((o) => o <= 3).length);
    expect(s.earned).toBe(OFFERS.filter((o) => o >= 4).reduce((a, b) => a + b, 0));
  });
});

describe("keypress", () => {
  it("separates presses when told to press from presses while told to wait", () => {
    const presses = KEY_ROUNDS.map((r) => (r.cue === "press" ? 30 : 2));
    const s = summariseKeys(presses);
    expect(s.perSecond).toBe(5);
    expect(s.whileWaiting).toBe(4);
    expect(s.steadiness).toBe(0);
  });
});

describe("the catalog", () => {
  it("has unique ids, a source and a plain description for every game, and the disclaimer says the key things", () => {
    expect(new Set(GAMES.map((g) => g.id)).size).toBe(GAMES.length);
    for (const g of GAMES) {
      expect(g.sources.length).toBeGreaterThan(0);
      expect(g.how.length).toBeGreaterThan(0);
      expect(g.reportedWith.length).toBeGreaterThan(0);
      expect(g.about.length).toBeGreaterThan(30);
      for (const s of g.sources) expect(() => new URL(s)).not.toThrow();
    }
    expect(GAME_DISCLAIMER).toMatch(/not affiliated/i);
    expect(PLAYABLE.length).toBe(GAMES.length - 1);
  });

  it("suggests games only for stages that mention a game-based assessment", () => {
    expect(gamesForText("Online assessment (SHL) Numerical reasoning, 18 questions")).toEqual([]);
    expect(gamesForText("Video interview, 3 questions")).toEqual([]);
    const shores = gamesForText("Online assessment (Arctic Shores) Game-style behavioural assessment").map((g) => g.id);
    expect(shores).toEqual(["balloon", "reaction", "sequence"]);
    expect(gamesForText("Pymetrics games").map((g) => g.id)).toContain("cards");
    expect(gamesForText("Aon switchChallenge game").map((g) => g.id)).toContain("switch");
    expect(gamesForText("An interactive game or task-based assessment").length).toBeGreaterThan(0);
    expect(gamesForText("Anything game related").length).toBeLessThanOrEqual(6);
    expect(getGame("switch")?.href).toBe("/tests/switch-challenge");
  });

  it("adds the matching games to an employer whose process names them, and none to one that does not", () => {
    const airbus = practiceLinks(getFirm("airbus")!).filter((l) => l.href.startsWith("/games/"));
    expect(airbus.length).toBeGreaterThan(0);
    for (const l of airbus) expect(getGame(l.href.replace("/games/", ""))).toBeTruthy();
    const none = practiceLinks(getFirm("hsbc")!).filter((l) => l.href.startsWith("/games/"));
    expect(none).toEqual([]);
  });
});
