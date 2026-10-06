import { describe, expect, it } from "vitest";
import { NUMERICAL, buildNumerical } from "@/lib/assess/banks/numerical";
import { validateItem } from "@/lib/assess/validate";

describe("numerical bank", () => {
  it("has 64 valid items", () => {
    expect(NUMERICAL.items).toHaveLength(64);
    for (const item of NUMERICAL.items) expect(validateItem(item), item.id).toEqual([]);
  });

  it("every item points at its own stimulus", () => {
    for (const item of NUMERICAL.items) {
      expect(item.stimulus, item.id).toBe(item.id);
      expect(NUMERICAL.stimuli[item.id], item.id).toBeDefined();
    }
  });

  it("every key matches an independent recomputation from the stimulus", () => {
    for (const item of NUMERICAL.items) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const recomputed = NUMERICAL.checks[item.id](NUMERICAL.stimuli[item.id]);
      expect(item.options[item.answer], item.id).toBe(recomputed);
    }
  });

  it("the keyed option is unique and there are five options", () => {
    for (const item of NUMERICAL.items) {
      if (item.kind !== "mcq") continue;
      expect(item.options, item.id).toHaveLength(5);
      expect(item.options.filter((o) => o === item.options[item.answer]), item.id).toHaveLength(1);
    }
  });

  it("covers a spread of difficulties", () => {
    const levels = new Set(NUMERICAL.items.map((i) => i.difficulty));
    expect(levels.size).toBeGreaterThanOrEqual(4);
    expect(NUMERICAL.items.filter((i) => (i.difficulty ?? 3) >= 4).length).toBeGreaterThanOrEqual(8);
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildNumerical().items)).toBe(JSON.stringify(NUMERICAL.items));
  });
});
