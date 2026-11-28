// Rules and scoring for the practice games built from the published task types behind the commercial assessments
// (BART balloon, Tower of London, flanker, task switching, EEfRT effort choice, reward learning, lock timing). Pure, so it
// can be tested. See docs/research/game-assessments.md for what each design follows and how sure we are of it. None of it
// is any provider's own task, timing or scoring.
import { rng } from "@/lib/assess/rng";

/* ---------------------------------------------------------------- Balloon (BART, three colours) */

/** Three balloon colours with different burst ranges, as in the published BART (Lejuez 2002). Maxima are scaled down so a round is quick. */
export const BALLOON_COLOURS = [
  { id: "blue", label: "Blue", fill: "#3b82f6", max: 8 },
  { id: "orange", label: "Orange", fill: "#f97316", max: 16 },
  { id: "green", label: "Green", fill: "#22c55e", max: 32 },
] as const;
export type BalloonColour = (typeof BALLOON_COLOURS)[number]["id"];

/** 39 balloons as reported for pymetrics: 13 of each colour, in a shuffled order. 5p per pump. */
export const BALLOONS = { rounds: 39, perPumpPence: 5 } as const;

export type BalloonSpec = { colour: BalloonColour; burstAt: number };
export type BalloonRound = { colour: BalloonColour; pumps: number; popped: boolean };

/** Which balloon comes up and on which pump it bursts (uniform from 1 to its colour's maximum). Same seed, same balloons. */
export function balloonSet(seed: number, rounds: number = BALLOONS.rounds): BalloonSpec[] {
  const r = rng(seed);
  const colours = r.shuffle(Array.from({ length: rounds }, (_, i) => BALLOON_COLOURS[i % BALLOON_COLOURS.length]));
  return colours.map((c) => ({ colour: c.id, burstAt: r.int(1, c.max) }));
}

export function summariseBalloons(rounds: BalloonRound[], perPump: number = BALLOONS.perPumpPence) {
  const kept = rounds.filter((x) => !x.popped);
  const byColour = BALLOON_COLOURS.map((c) => {
    const k = kept.filter((x) => x.colour === c.id);
    return { colour: c.id, label: c.label, avgPumps: k.length ? k.reduce((s, x) => s + x.pumps, 0) / k.length : 0, pops: rounds.filter((x) => x.colour === c.id && x.popped).length, n: rounds.filter((x) => x.colour === c.id).length };
  });
  return {
    bankedPence: kept.reduce((s, x) => s + x.pumps * perPump, 0),
    pops: rounds.filter((x) => x.popped).length,
    avgPumpsKept: kept.length ? kept.reduce((s, x) => s + x.pumps, 0) / kept.length : 0,
    byColour,
  };
}

/* ---------------------------------------------------------------- Tower of London (planning to a target) */

/** Three pegs, each a list of disc numbers from bottom to top. Any number of discs fit on a peg; only the top disc moves. */
export type Stacks = number[][];
export const TOWER_DISCS = 5;
export const TOWER_DISTANCES = [2, 3, 3, 4, 4, 5, 6, 7] as const;

export const stacksKey = (s: Stacks) => s.map((p) => p.join(".")).join("|");

export function towerNeighbours(s: Stacks): Stacks[] {
  const out: Stacks[] = [];
  for (let from = 0; from < 3; from++) {
    if (!s[from].length) continue;
    for (let to = 0; to < 3; to++) {
      if (to === from) continue;
      const next = s.map((p) => [...p]);
      next[to].push(next[from].pop()!);
      out.push(next);
    }
  }
  return out;
}

export function towerMove(s: Stacks, from: number, to: number): Stacks {
  if (from === to || !s[from]?.length) return s;
  const next = s.map((p) => [...p]);
  next[to].push(next[from].pop()!);
  return next;
}

/** Fewest moves between two arrangements (every move can be undone, so the distance is the same both ways). */
export function towerDistances(from: Stacks): Map<string, { state: Stacks; d: number }> {
  const seen = new Map<string, { state: Stacks; d: number }>([[stacksKey(from), { state: from, d: 0 }]]);
  let frontier = [from];
  for (let d = 1; frontier.length; d++) {
    const nextFrontier: Stacks[] = [];
    for (const s of frontier)
      for (const n of towerNeighbours(s)) {
        const k = stacksKey(n);
        if (!seen.has(k)) {
          seen.set(k, { state: n, d });
          nextFrontier.push(n);
        }
      }
    frontier = nextFrontier;
  }
  return seen;
}

export type TowerPuzzle = { start: Stacks; target: Stacks; best: number };

/** Eight puzzles of rising difficulty: a target arrangement and a start exactly `best` moves from it. */
export function towerPuzzles(seed: number): TowerPuzzle[] {
  const r = rng(seed);
  return TOWER_DISTANCES.map((best) => {
    const discs = r.shuffle(Array.from({ length: TOWER_DISCS }, (_, i) => i));
    const target: Stacks = [[], [], []];
    for (const d of discs) target[r.int(0, 2)].push(d);
    const all = [...towerDistances(target).values()].filter((x) => x.d === best);
    return { start: r.pick(all).state, target, best };
  });
}

/* ---------------------------------------------------------------- Flanker (arrows) */

export type Dir = "L" | "R";
export type ArrowColour = "blue" | "black" | "red";
/** `rule`: which arrows to answer. The colour of the set tells you in the pymetrics-style task; always the middle one in the Arctic Shores-style one. */
export type ArrowSet = { colour: ArrowColour; rule: "middle" | "sides"; middle: Dir; sides: Dir; answer: Dir; congruent: boolean };

const flip = (d: Dir): Dir => (d === "L" ? "R" : "L");

/** Sets of five arrows. With `colourRule`, red sets mean answer the side arrows and blue or black sets the middle one. */
export function arrowSets(seed: number, count: number, colourRule: boolean): ArrowSet[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const colour: ArrowColour = colourRule ? r.pick(["blue", "black", "red"] as const) : "blue";
    const rule = colour === "red" ? "sides" : "middle";
    const middle: Dir = r.next() < 0.5 ? "L" : "R";
    const congruent = r.next() < 0.5;
    const sides = congruent ? middle : flip(middle);
    return { colour, rule, middle, sides, answer: rule === "middle" ? middle : sides, congruent };
  });
}

/* ---------------------------------------------------------------- Tickets (task switching) */

export const TICKET_SHAPES = ["circle", "oval", "square", "triangle", "star"] as const;
export type TicketShape = (typeof TICKET_SHAPES)[number];
/** Shapes with no corners get the left answer, shapes with corners the right one. */
export const hasCorners = (s: TicketShape) => s === "square" || s === "triangle" || s === "star";

export type Ticket = { where: "top" | "bottom"; number: number; shape: TicketShape; answer: Dir; switched: boolean };

/** A ticket at the top asks whether the number is low (1 to 4, left) or high (6 to 9, right); at the bottom, whether the shape has corners. */
export function ticketTrials(seed: number, count: number): Ticket[] {
  const r = rng(seed);
  const out: Ticket[] = [];
  for (let i = 0; i < count; i++) {
    const where = r.next() < 0.5 ? "top" : "bottom";
    const number = r.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    const shape = r.pick(TICKET_SHAPES);
    const answer: Dir = where === "top" ? (number < 5 ? "L" : "R") : hasCorners(shape) ? "R" : "L";
    out.push({ where, number, shape, answer, switched: i > 0 && out[i - 1].where !== where });
  }
  return out;
}

/* ---------------------------------------------------------------- Lock (timing a rotating dial) */

export const LOCK = { locks: 4, segments: 10, maxPresses: 14 } as const;

/** A lock's highlighted number and how fast its dial turns (degrees a second); each lock is quicker than the last. */
export function lockSpec(seed: number, i: number): { target: number; speed: number } {
  const r = rng(seed + i * 977);
  return { target: r.int(0, LOCK.segments - 1), speed: 150 + i * 45 };
}

/** Which segment of the dial the pointer is on, with 0 at the top turning clockwise. */
export const segmentAt = (angle: number, segments: number = LOCK.segments) => Math.floor((((angle % 360) + 360) % 360) / (360 / segments));

/* ---------------------------------------------------------------- Easy or Hard (effort for reward, EEfRT) */

/** The published design (Treadway 2009): easy is 30 presses in 7 seconds for 1.00; hard is 100 presses in 21 seconds for 1.24 to 4.30, at 12%, 50% or 88% to win. */
export const EEFRT = {
  easy: { presses: 30, ms: 7000, reward: 1 },
  hard: { presses: 100, ms: 21000 },
  probabilities: [0.12, 0.5, 0.88],
  rewards: [1.24, 1.68, 2.11, 2.55, 2.99, 3.43, 3.86, 4.3],
  trials: 10,
} as const;

export type EffortTrial = { probability: number; hardReward: number; wins: boolean };

/** Trials drawn from the 24 combinations of win chance and hard reward, each trial's draw fixed in advance. */
export function effortTrials(seed: number, count: number = EEFRT.trials): EffortTrial[] {
  const r = rng(seed);
  const combos = EEFRT.probabilities.flatMap((p) => EEFRT.rewards.map((v) => ({ probability: p, hardReward: v })));
  return r.shuffle(combos).slice(0, count).map((c) => ({ ...c, wins: r.next() < c.probability }));
}

/* ---------------------------------------------------------------- Lengths (reward learning) */

export type LengthTrial = { long: boolean; rewarded: boolean };

/** A face with a long or short mouth. Right answers are paid more often for the "rich" one (75%) than the other (25%), so a bias can build. */
export function lengthTrials(seed: number, count: number, rich: "long" | "short" = "long"): LengthTrial[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const long = r.next() < 0.5;
    const isRich = (rich === "long") === long;
    return { long, rewarded: r.next() < (isRich ? 0.75 : 0.25) };
  });
}

/** How accurate each response was, and how much more often "long" was said than the mix of faces would give. */
export function summariseLengths(trials: LengthTrial[], saidLong: boolean[]) {
  const n = Math.min(trials.length, saidLong.length);
  const correct = trials.slice(0, n).filter((t, i) => t.long === saidLong[i]).length;
  const longShare = n ? saidLong.slice(0, n).filter(Boolean).length / n : 0;
  const longFaces = n ? trials.slice(0, n).filter((t) => t.long).length / n : 0;
  return { n, accuracy: n ? correct / n : 0, longShare, bias: longShare - longFaces };
}
