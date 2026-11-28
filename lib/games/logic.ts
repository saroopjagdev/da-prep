// The rules and scoring behind the practice games, kept free of React so they can be tested. Everything here follows the
// published idea of each task type (card decks, digit span, n-back, go/no-go, Corsi blocks, a trust and fairness game,
// Stroop). The balloon, tower and other task-style games are in lib/games/tasks.ts. Nothing here is any provider's actual task, timing or scoring.
import { rng, type Rng } from "@/lib/assess/rng";

export const makeRng = (seed: number): Rng => rng(seed);

/* ---------------------------------------------------------------- Card decks (learning under risk) */

export type Deck = "A" | "B" | "C" | "D";
export const DECKS: Deck[] = ["A", "B", "C", "D"];
export const CARD_TURNS = 40;
export const CARD_START = 2000;

// A and B pay more per card but cost more over ten cards (net -250); C and D pay less and cost less (net +250). A's
// losses are frequent and small, B's rare and large; C's frequent and small, D's rare and larger.
const GAIN: Record<Deck, number> = { A: 100, B: 100, C: 50, D: 50 };
const LOSSES: Record<Deck, number[]> = { A: [150, 200, 250, 300, 350], B: [1250], C: [50, 50, 50, 50, 50], D: [250] };

/** What the n-th card (from 0) of a deck pays and costs. Each block of ten has the deck's losses in a shuffled place. */
export function drawCard(seed: number, deck: Deck, n: number): { gain: number; loss: number } {
  const block = Math.floor(n / 10);
  const r = rng(seed + DECKS.indexOf(deck) * 7919 + block * 104729);
  const slots = r.shuffle(Array.from({ length: 10 }, (_, i) => i));
  const at = slots.indexOf(n % 10);
  return { gain: GAIN[deck], loss: at < LOSSES[deck].length ? LOSSES[deck][at] : 0 };
}

export const netPerTen = (deck: Deck) => 10 * GAIN[deck] - LOSSES[deck].reduce((s, x) => s + x, 0);

/* ---------------------------------------------------------------- Digit span and block sequences (memory) */

export function digitSequence(seed: number, length: number): number[] {
  const r = rng(seed);
  const out: number[] = [];
  while (out.length < length) {
    const d = r.int(0, 9);
    if (d !== out.at(-1)) out.push(d);
  }
  return out;
}

/** A sequence of tiles to remember, never the same tile twice in a row. */
export function tileSequence(seed: number, length: number, tiles = 9): number[] {
  const r = rng(seed);
  const out: number[] = [];
  while (out.length < length) {
    const t = r.int(0, tiles - 1);
    if (t !== out.at(-1)) out.push(t);
  }
  return out;
}

export type SpanState = { length: number; misses: number; best: number };
export const SPAN_START = 3;
export const SPAN_MAX_MISSES = 2;
export const SPAN_MAX_LENGTH = 12;

/** Longer after a correct recall; the game ends after two wrong ones, or at the longest length. */
export function nextSpan(s: SpanState, correct: boolean): SpanState & { done: boolean } {
  const best = correct ? Math.max(s.best, s.length) : s.best;
  const misses = correct ? s.misses : s.misses + 1;
  const length = correct ? s.length + 1 : s.length;
  return { length, misses, best, done: misses >= SPAN_MAX_MISSES || length > SPAN_MAX_LENGTH };
}

/* ---------------------------------------------------------------- Flashback (1-back matching) */

export const SHAPES = ["circle", "square", "triangle", "diamond", "star", "cross"] as const;
export type Shape = (typeof SHAPES)[number];

/** A run of shapes where a known share repeat the one `n` back. Returns the shapes and which are matches. */
export function backTrials(seed: number, count: number, n = 1, matchShare = 0.3): { shape: Shape; match: boolean }[] {
  const r = rng(seed);
  const out: { shape: Shape; match: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const before = i >= n ? out[i - n].shape : undefined;
    const match = before !== undefined && r.next() < matchShare;
    const shape = match ? before! : r.pick(SHAPES.filter((s) => s !== before));
    out.push({ shape, match });
  }
  return out;
}

/** The level structure of Flashback: shapes to compare with the one 1, then 2, then 3 back. Counted only from within each level. */
export const NBACK_LEVELS = [
  { n: 1, count: 20 },
  { n: 2, count: 25 },
  { n: 3, count: 400 },
] as const;

export type NBackTrial = { shape: Shape; match: boolean; n: number; first: boolean };

export function nBackRun(seed: number): NBackTrial[] {
  return NBACK_LEVELS.flatMap((lv, k) => backTrials(seed + k * 31, lv.count, lv.n).map((t, i) => ({ ...t, n: lv.n, first: i === 0 })));
}

/** `said[i]` is true when "same" was pressed for trial i. */
export function scoreSignal(trials: { match: boolean }[], said: boolean[]) {
  let hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;
  trials.forEach((t, i) => {
    if (t.match) {
      if (said[i]) hits++;
      else misses++;
    } else if (said[i]) falseAlarms++;
    else correctRejections++;
  });
  const total = trials.length;
  return { hits, misses, falseAlarms, correctRejections, accuracy: total ? (hits + correctRejections) / total : 0 };
}

/* ---------------------------------------------------------------- Go / no-go (reaction and restraint) */

export type GoTrial = { go: boolean; shape: "circle" | "square"; wait: number };

/** Mostly "go" shapes with a minority of "no-go" ones, each after a short random wait (milliseconds). */
export function goTrials(seed: number, count: number, noGoShare = 0.25, waitMin = 500, waitMax = 1400): GoTrial[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const go = r.next() >= noGoShare;
    return { go, shape: go ? "circle" : "square", wait: r.int(waitMin, waitMax) };
  });
}

/* ---------------------------------------------------------------- Colour words (attention and restraint) */

export const INKS = ["red", "green", "blue", "yellow"] as const;
export type Ink = (typeof INKS)[number];
export type WordTrial = { word: Ink; ink: Ink; congruent: boolean };

export function wordTrials(seed: number, count: number, congruentShare = 0.4): WordTrial[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const word = r.pick(INKS);
    const congruent = r.next() < congruentShare;
    return { word, ink: congruent ? word : r.pick(INKS.filter((x) => x !== word)), congruent };
  });
}

/* ---------------------------------------------------------------- Money exchange (trust and fairness) */

export const TRUST = { rounds: 10, endowment: 10, multiplier: 3 } as const;

/** How much of what was sent (after tripling) the partner returns, round by round. Mixed, so no one rule fits. */
export const PARTNER_RETURNS = [0.5, 0.2, 0.5, 0.35, 0.5, 0.1, 0.4, 0.5, 0.25, 0.45];

export function trustReturn(sent: number, round: number): number {
  return Math.round(sent * TRUST.multiplier * PARTNER_RETURNS[round % PARTNER_RETURNS.length]);
}

/** The share of 10 offered to you in each of the fairness rounds. */
export const OFFERS = [5, 2, 4, 1, 3];

export function summariseMoney(sent: number[], accepted: boolean[]) {
  const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
  const low = OFFERS.map((o, i) => ({ o, ok: accepted[i] })).filter((x) => x.o <= 3 && x.ok !== undefined);
  return {
    avgSent: avg(sent),
    acceptedLow: low.filter((x) => x.ok).length,
    lowOffers: low.length,
    earned: accepted.reduce((s, ok, i) => s + (ok ? OFFERS[i] : 0), 0),
  };
}

/* ---------------------------------------------------------------- Press-as-fast-as-you-can (speed and instructions) */

export type KeyRound = { cue: "press" | "wait"; seconds: number };
export const KEY_ROUNDS: KeyRound[] = [
  { cue: "press", seconds: 6 },
  { cue: "wait", seconds: 4 },
  { cue: "press", seconds: 6 },
  { cue: "wait", seconds: 4 },
  { cue: "press", seconds: 6 },
];

export function summariseKeys(presses: number[]) {
  const fast = KEY_ROUNDS.map((r, i) => ({ r, n: presses[i] ?? 0 })).filter((x) => x.r.cue === "press");
  const wait = KEY_ROUNDS.map((r, i) => ({ r, n: presses[i] ?? 0 })).filter((x) => x.r.cue === "wait");
  const seconds = fast.reduce((s, x) => s + x.r.seconds, 0);
  return {
    perSecond: seconds ? fast.reduce((s, x) => s + x.n, 0) / seconds : 0,
    whileWaiting: wait.reduce((s, x) => s + x.n, 0),
    steadiness: fast.length ? Math.max(...fast.map((x) => x.n)) - Math.min(...fast.map((x) => x.n)) : 0,
  };
}

export const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

/* ---------------------------------------------------------------- Money exchange 2 (proposing and responding) */

/** Ten rounds: odd ones you answer an offer (the five offers above), even ones you propose a split of 10 and the partner decides. */
export const ULTIMATUM = { rounds: 10, pot: 10 } as const;
/** The smallest share of 10 the partner will take in each proposing round. A refusal leaves both with nothing. */
export const PARTNER_MINIMUMS = [3, 2, 4, 3, 2];
export const partnerAccepts = (offered: number, proposalIndex: number) => offered >= PARTNER_MINIMUMS[proposalIndex % PARTNER_MINIMUMS.length];
