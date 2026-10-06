import { describe, expect, it } from "vitest";
import { SJT } from "@/lib/assess/banks/sjt";
import { SJT_HARD } from "@/lib/assess/banks/sjt-hard";
import { validateItem } from "@/lib/assess/validate";

const all = [...SJT_HARD.mostLeast, ...SJT_HARD.rateEach, ...SJT_HARD.rank];

describe("stretch situational judgement bank", () => {
  it("has 24 most/least, 12 rate-each and 10 ranking items, all valid", () => {
    expect(SJT_HARD.mostLeast).toHaveLength(24);
    expect(SJT_HARD.rateEach).toHaveLength(12);
    expect(SJT_HARD.rank).toHaveLength(10);
    for (const item of all) expect(validateItem(item), item.id).toEqual([]);
  });

  it("ids are unique and no scenario repeats the foundation bank", () => {
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length);
    const foundation = new Set([...SJT.mostLeast, ...SJT.rateEach, ...SJT.rank].map((i) => i.prompt));
    for (const i of all) expect(foundation.has(i.prompt), i.id).toBe(false);
  });

  it("the best answer is not given away by being the longest option", () => {
    // The foundation bank has the best answer longest 90% of the time; chance with four options is 25%.
    const longest = SJT_HARD.mostLeast.filter((i) => {
      if (i.kind !== "most-least") return false;
      const lens = i.options.map((o) => o.length);
      return lens[i.most] === Math.max(...lens);
    }).length;
    expect(longest / SJT_HARD.mostLeast.length).toBeLessThanOrEqual(0.4);
  });

  it("best answers do not all open with the same word, and the worst answers are not all passive", () => {
    const first = (t: string) => t.split(/\s+/)[0].toLowerCase();
    const counts = new Map<string, number>();
    for (const i of SJT_HARD.mostLeast) {
      if (i.kind !== "most-least") continue;
      const w = first(i.options[i.most]);
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    expect(Math.max(...counts.values()) / SJT_HARD.mostLeast.length).toBeLessThanOrEqual(0.3);
  });

  it("the most and least picks differ, and the correct positions are spread", () => {
    const most = new Set<number>();
    const least = new Set<number>();
    for (const i of SJT_HARD.mostLeast) {
      if (i.kind !== "most-least") throw new Error("expected most-least");
      expect(i.most, i.id).not.toBe(i.least);
      expect(i.options).toHaveLength(4);
      most.add(i.most);
      least.add(i.least);
    }
    expect(most.size).toBeGreaterThanOrEqual(3);
    expect(least.size).toBeGreaterThanOrEqual(3);
  });

  it("rate-each ratings span at least two levels and use only the 0 to 3 scale", () => {
    for (const i of SJT_HARD.rateEach) {
      if (i.kind !== "rate-each") throw new Error("expected rate-each");
      expect(i.actions, i.id).toHaveLength(4);
      for (const r of i.ratings) expect([0, 1, 2, 3], i.id).toContain(r);
      expect(Math.max(...i.ratings) - Math.min(...i.ratings), i.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("the best-rated rate-each action is neither always the longest nor always the shortest", () => {
    const longest = SJT_HARD.rateEach.filter((i) => {
      if (i.kind !== "rate-each") return false;
      const lens = i.actions.map((a) => a.length);
      return lens[i.ratings.indexOf(Math.max(...i.ratings))] === Math.max(...lens);
    }).length;
    expect(longest / SJT_HARD.rateEach.length).toBeLessThanOrEqual(0.5);
    expect(longest / SJT_HARD.rateEach.length).toBeGreaterThanOrEqual(0.1);
  });

  it("ranking items have four distinct options and never show the right order", () => {
    for (const i of SJT_HARD.rank) {
      if (i.kind !== "rank") throw new Error("expected rank");
      expect(i.options, i.id).toHaveLength(4);
      expect(new Set(i.options).size, i.id).toBe(4);
      expect(i.order, i.id).not.toEqual([0, 1, 2, 3]);
    }
  });
});
