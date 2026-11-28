import { describe, expect, it } from "vitest";
import {
  BALLOONS,
  BALLOON_COLOURS,
  EEFRT,
  LOCK,
  TOWER_DISCS,
  TOWER_DISTANCES,
  arrowSets,
  balloonSet,
  effortTrials,
  hasCorners,
  lengthTrials,
  lockSpec,
  segmentAt,
  stacksKey,
  summariseBalloons,
  summariseLengths,
  ticketTrials,
  towerDistances,
  towerMove,
  towerPuzzles,
} from "@/lib/games/tasks";

describe("balloon (three colours)", () => {
  it("has 39 balloons, 13 of each colour, bursting within that colour's range, and is the same for the same seed", () => {
    const set = balloonSet(5);
    expect(set).toHaveLength(BALLOONS.rounds);
    expect(balloonSet(5)).toEqual(set);
    expect(balloonSet(6)).not.toEqual(set);
    for (const c of BALLOON_COLOURS) {
      const mine = set.filter((b) => b.colour === c.id);
      expect(mine).toHaveLength(13);
      for (const b of mine) {
        expect(b.burstAt).toBeGreaterThanOrEqual(1);
        expect(b.burstAt).toBeLessThanOrEqual(c.max);
      }
    }
  });
  it("banks only balloons that did not burst, and averages per colour", () => {
    const s = summariseBalloons([
      { colour: "blue", pumps: 4, popped: false },
      { colour: "blue", pumps: 9, popped: true },
      { colour: "green", pumps: 6, popped: false },
    ]);
    expect(s.bankedPence).toBe(50);
    expect(s.pops).toBe(1);
    expect(s.avgPumpsKept).toBe(5);
    expect(s.byColour.find((c) => c.colour === "blue")).toMatchObject({ avgPumps: 4, pops: 1, n: 2 });
  });
});

describe("tower of london", () => {
  it("moves only the top disc and never off an empty peg", () => {
    const s = [[0, 1], [2], []];
    expect(towerMove(s, 0, 2)).toEqual([[0], [2], [1]]);
    expect(towerMove(s, 2, 0)).toBe(s);
    expect(towerMove(s, 1, 1)).toBe(s);
  });
  it("finds the fewest moves by breadth-first search, the same in both directions", () => {
    const a = [[0, 1, 2, 3, 4], [], []];
    const b = [[], [], [4, 3, 2, 1, 0]];
    const d = towerDistances(a).get(stacksKey(b))!.d;
    expect(towerDistances(b).get(stacksKey(a))!.d).toBe(d);
    expect(towerDistances(a).get(stacksKey(a))!.d).toBe(0);
  });
  it("makes eight puzzles of rising difficulty whose start is exactly the stated number of moves from the target", () => {
    const puzzles = towerPuzzles(11);
    expect(puzzles.map((p) => p.best)).toEqual([...TOWER_DISTANCES]);
    for (const p of puzzles) {
      expect(p.start.flat().sort()).toEqual(Array.from({ length: TOWER_DISCS }, (_, i) => i));
      expect(towerDistances(p.target).get(stacksKey(p.start))!.d).toBe(p.best);
    }
    expect(towerPuzzles(11)).toEqual(puzzles);
  });
});

describe("arrows", () => {
  it("answers the middle arrow for blue or black sets and the side arrows for red ones", () => {
    for (const s of arrowSets(2, 300, true)) {
      expect(s.rule).toBe(s.colour === "red" ? "sides" : "middle");
      expect(s.answer).toBe(s.rule === "middle" ? s.middle : s.sides);
      expect(s.congruent).toBe(s.middle === s.sides);
    }
  });
  it("always answers the middle arrow when there is no colour rule, with about half conflicting", () => {
    const sets = arrowSets(4, 400, false);
    expect(sets.every((s) => s.rule === "middle" && s.answer === s.middle)).toBe(true);
    const conflicting = sets.filter((s) => !s.congruent).length;
    expect(conflicting).toBeGreaterThan(140);
    expect(conflicting).toBeLessThan(260);
  });
});

describe("tickets", () => {
  it("asks about the number at the top and the shape at the bottom, and marks where the rule switched", () => {
    const t = ticketTrials(3, 200);
    for (const [i, x] of t.entries()) {
      if (x.where === "top") expect(x.answer).toBe(x.number < 5 ? "L" : "R");
      else expect(x.answer).toBe(hasCorners(x.shape) ? "R" : "L");
      expect(x.switched).toBe(i > 0 && t[i - 1].where !== x.where);
    }
    expect(t.some((x) => x.switched)).toBe(true);
    expect(t.some((x) => !x.switched)).toBe(true);
  });
});

describe("lock", () => {
  it("finds the segment under the pointer, wrapping round the dial", () => {
    expect(segmentAt(0)).toBe(0);
    expect(segmentAt(35)).toBe(0);
    expect(segmentAt(36)).toBe(1);
    expect(segmentAt(359)).toBe(LOCK.segments - 1);
    expect(segmentAt(360 + 40)).toBe(1);
    expect(segmentAt(-1)).toBe(LOCK.segments - 1);
  });
  it("gets quicker with each lock and always highlights a real segment", () => {
    for (let i = 0; i < LOCK.locks; i++) {
      const s = lockSpec(9, i);
      expect(s.target).toBeGreaterThanOrEqual(0);
      expect(s.target).toBeLessThan(LOCK.segments);
      if (i > 0) expect(s.speed).toBeGreaterThan(lockSpec(9, i - 1).speed);
    }
  });
});

describe("easy or hard (effort for reward)", () => {
  it("uses the published win chances and hard rewards, and each trial's draw is fixed", () => {
    const t = effortTrials(1, 24);
    expect(new Set(t.map((x) => `${x.probability}|${x.hardReward}`)).size).toBe(24);
    for (const x of t) {
      expect(EEFRT.probabilities).toContain(x.probability);
      expect(EEFRT.rewards).toContain(x.hardReward);
    }
    expect(effortTrials(1, 24)).toEqual(t);
    expect(EEFRT.easy.presses).toBe(30);
    expect(EEFRT.hard.presses).toBe(100);
  });
  it("wins more often at higher chances over many draws", () => {
    let low = 0, high = 0;
    for (let seed = 0; seed < 200; seed++)
      for (const x of effortTrials(seed, 24)) {
        if (x.probability === 0.12 && x.wins) low++;
        if (x.probability === 0.88 && x.wins) high++;
      }
    expect(high).toBeGreaterThan(low * 3);
  });
});

describe("lengths (reward learning)", () => {
  it("pays the rich side about three times in four and the other about one in four", () => {
    const t = lengthTrials(8, 4000, "long");
    const rate = (long: boolean) => t.filter((x) => x.long === long && x.rewarded).length / t.filter((x) => x.long === long).length;
    expect(rate(true)).toBeGreaterThan(0.7);
    expect(rate(true)).toBeLessThan(0.8);
    expect(rate(false)).toBeGreaterThan(0.2);
    expect(rate(false)).toBeLessThan(0.3);
  });
  it("scores accuracy and how much more often long was said than the faces required", () => {
    const t = [{ long: true, rewarded: true }, { long: false, rewarded: false }, { long: false, rewarded: true }, { long: true, rewarded: false }];
    const s = summariseLengths(t, [true, true, false, true]);
    expect(s.accuracy).toBe(0.75);
    expect(s.longShare).toBe(0.75);
    expect(s.bias).toBe(0.25);
  });
});
