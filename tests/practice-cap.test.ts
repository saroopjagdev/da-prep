import { describe, expect, it } from "vitest";
import { recordUse, usedThisWeek } from "@/lib/practice-cap";
import { FREE_PRACTICE_PER_WEEK } from "@/lib/plans";
import { isoWeek } from "@/lib/week";

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};
const MON = new Date("2026-10-05T09:00:00Z"); // week 41
const NEXT_MON = new Date("2026-10-12T09:00:00Z"); // week 42

describe("free practice cap (per device, per ISO week)", () => {
  it("starts at zero and counts completed tests", () => {
    const s = memory();
    expect(usedThisWeek(s, MON)).toBe(0);
    expect(recordUse(s, MON)).toBe(1);
    expect(recordUse(s, MON)).toBe(2);
    expect(usedThisWeek(s, MON)).toBe(2);
  });

  it("is used up after the free number and resets on Monday", () => {
    const s = memory();
    for (let i = 0; i < FREE_PRACTICE_PER_WEEK; i++) recordUse(s, MON);
    expect(usedThisWeek(s, MON)).toBe(FREE_PRACTICE_PER_WEEK);
    expect(usedThisWeek(s, new Date("2026-10-11T23:00:00Z"))).toBe(FREE_PRACTICE_PER_WEEK); // still Sunday
    expect(usedThisWeek(s, NEXT_MON)).toBe(0);
    expect(recordUse(s, NEXT_MON)).toBe(1);
  });

  it("ignores damaged or blocked storage instead of throwing", () => {
    expect(usedThisWeek({ getItem: () => "not json" })).toBe(0);
    expect(usedThisWeek({ getItem: () => { throw new Error("blocked"); } })).toBe(0);
    expect(() => recordUse({ getItem: () => null, setItem: () => { throw new Error("blocked"); } })).not.toThrow();
    expect(usedThisWeek({ getItem: () => JSON.stringify({ week: isoWeek(MON), n: -5 }) }, MON)).toBe(0);
  });
});
