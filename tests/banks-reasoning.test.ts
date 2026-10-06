import { describe, expect, it } from "vitest";
import { DEDUCTIVE, validArrangements } from "@/lib/assess/banks/deductive";
import { INDUCTIVE, buildInductive } from "@/lib/assess/banks/inductive";
import { NUMERICAL_TF, buildNumericalTf } from "@/lib/assess/banks/numerical-tf";
import { validateItem } from "@/lib/assess/validate";

describe("numerical true/false/cannot say bank", () => {
  it("has 192 valid statements in 32 groups sharing a table, across four themes", () => {
    expect(NUMERICAL_TF.items).toHaveLength(192);
    expect(Object.keys(NUMERICAL_TF.stimuli)).toHaveLength(32);
    const titles = new Set(Object.values(NUMERICAL_TF.stimuli).map((s) => (s.type === "table" ? s.title : "")));
    expect(titles.size).toBe(4);
    for (const item of NUMERICAL_TF.items) {
      expect(validateItem(item), item.id).toEqual([]);
      expect(NUMERICAL_TF.stimuli[item.stimulus!], item.id).toBeDefined();
    }
  });

  it("every key matches a recomputation from the table", () => {
    for (const item of NUMERICAL_TF.items) {
      if (item.kind !== "tf-cannot-say") throw new Error("expected tf");
      expect(NUMERICAL_TF.checks[item.id](NUMERICAL_TF.stimuli[item.stimulus!]), item.id).toBe(item.answer);
    }
  });

  it("never repeats a statement within a table", () => {
    for (const id of Object.keys(NUMERICAL_TF.stimuli)) {
      const texts = NUMERICAL_TF.items.filter((i) => i.stimulus === id).map((i) => i.prompt);
      expect(new Set(texts).size, id).toBe(texts.length);
    }
  });

  it("uses all three answers", () => {
    const answers = new Set(NUMERICAL_TF.items.map((i) => (i.kind === "tf-cannot-say" ? i.answer : -1)));
    expect(answers).toEqual(new Set([0, 1, 2]));
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildNumericalTf().items)).toBe(JSON.stringify(NUMERICAL_TF.items));
  });
});

// Generic rule detectors that look only at the displayed terms.
const nums = (s: string) => (s.match(/-?\d+/g) ?? []).map(Number);
function detectNumberNext(t: number[]): number | null {
  const d = t.slice(1).map((v, i) => v - t[i]);
  if (d.every((x) => x === d[0])) return t[t.length - 1] + d[0];
  if (t.every((v) => v !== 0) && t.slice(1).every((v, i) => v / t[i] === t[1] / t[0])) return t[t.length - 1] * (t[1] / t[0]);
  const dd = d.slice(1).map((v, i) => v - d[i]);
  if (dd.length && dd.every((x) => x === dd[0])) return t[t.length - 1] + d[d.length - 1] + dd[0];
  const odd = t.filter((_, i) => i % 2 === 0);
  const even = t.filter((_, i) => i % 2 === 1);
  const od = odd.slice(1).map((v, i) => v - odd[i]);
  const ed = even.slice(1).map((v, i) => v - even[i]);
  if (od.length > 1 && ed.length > 1 && od.every((x) => x === od[0]) && ed.every((x) => x === ed[0])) {
    const nextIsOdd = t.length % 2 === 0;
    return nextIsOdd ? odd[odd.length - 1] + od[0] : even[even.length - 1] + ed[0];
  }
  return null;
}

describe("inductive bank", () => {
  it("has 28 valid items with five unique options", () => {
    expect(INDUCTIVE).toHaveLength(28);
    for (const item of INDUCTIVE) {
      expect(validateItem(item), item.id).toEqual([]);
      if (item.kind === "mcq") expect(item.options, item.id).toHaveLength(5);
    }
  });

  it("number sequences: the key is the next term under an independently detected rule", () => {
    const numeric = INDUCTIVE.filter((i) => /^ind-(arith|geo|grow|alt)-/.test(i.id));
    expect(numeric).toHaveLength(15);
    for (const item of numeric) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const shown = nums(item.prompt.split("\n\n")[1].replace("?", ""));
      expect(String(detectNumberNext(shown)), item.id).toBe(item.options[item.answer]);
    }
  });

  it("letter sequences: constant step through the alphabet", () => {
    const letterItems = INDUCTIVE.filter((i) => i.id.startsWith("ind-letters-"));
    expect(letterItems).toHaveLength(3);
    for (const item of letterItems) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const shown = item.prompt.split("\n\n")[1].replace(", ?", "").split(", ").map((c) => c.charCodeAt(0));
      const step = shown[1] - shown[0];
      expect(shown.every((v, i) => i === 0 || v - shown[i - 1] === step), item.id).toBe(true);
      expect(item.options[item.answer].charCodeAt(0) % 26, item.id).toBe((shown[shown.length - 1] + step) % 26 === 0 ? 0 : (shown[shown.length - 1] + step) % 26);
    }
  });

  it("symbol cycles: the key continues the repeating pattern", () => {
    const symbolItems = INDUCTIVE.filter((i) => i.id.startsWith("ind-symbols-"));
    expect(symbolItems).toHaveLength(3);
    for (const item of symbolItems) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const shown = item.prompt.split("\n\n")[1].replace("?", "").trim().split(/\s+/);
      const period = [3, 4].find((p) => shown.every((s, i) => s === shown[i % p]))!;
      expect(item.options[item.answer], item.id).toBe(shown[shown.length % period]);
    }
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildInductive())).toBe(JSON.stringify(INDUCTIVE));
  });
});

describe("deductive bank", () => {
  it("has 32 valid scheduling puzzles", () => {
    expect(DEDUCTIVE.items).toHaveLength(32);
    for (const item of DEDUCTIVE.items) expect(validateItem(item), item.id).toEqual([]);
  });

  it("every puzzle has exactly one possible day for the question, and it is the key", () => {
    for (const item of DEDUCTIVE.items) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const m = DEDUCTIVE.meta[item.id];
      const days = new Set(validArrangements(m.constraints).map((p) => p[m.target]));
      expect(days.size, item.id).toBe(1);
      expect([...days][0], item.id).toBe(item.answer);
    }
  });

  it("puzzles are satisfiable and not trivially short", () => {
    for (const m of Object.values(DEDUCTIVE.meta)) {
      expect(validArrangements(m.constraints).length).toBeGreaterThan(0);
      expect(m.constraints.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("never states the answer, never repeats a rule, and every rule is needed", () => {
    for (const item of DEDUCTIVE.items) {
      const m = DEDUCTIVE.meta[item.id];
      const texts = m.constraints.map((c) => c.text);
      expect(new Set(texts).size, item.id).toBe(texts.length);
      expect(texts.some((t) => t.toLowerCase().startsWith(`${m.tasks[m.target]} is on `)), item.id).toBe(false);
      m.constraints.forEach((c, i) => {
        const without = m.constraints.filter((_, j) => j !== i);
        expect(new Set(validArrangements(without).map((p) => p[m.target])).size, `${item.id} rule ${i + 1}`).toBeGreaterThan(1);
      });
    }
  });

  it("spans difficulty 2 to 5 and explains every ruled-out day", () => {
    const levels = new Set(DEDUCTIVE.items.map((i) => i.difficulty));
    for (const d of [2, 3, 4, 5]) expect(levels.has(d as 2 | 3 | 4 | 5)).toBe(true);
    for (const item of DEDUCTIVE.items) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      const notLines = (item.explanation.match(/Not (Monday|Tuesday|Wednesday|Thursday|Friday):/g) ?? []).length;
      expect(notLines, item.id).toBe(4);
    }
  });

  it("the prompt lists every constraint the solver used", () => {
    for (const item of DEDUCTIVE.items) {
      for (const c of DEDUCTIVE.meta[item.id].constraints) expect(item.prompt, item.id).toContain(c.text);
    }
  });
});

describe("no repeated questions", () => {
  it.each([
    ["inductive", INDUCTIVE],
    ["deductive", DEDUCTIVE.items],
  ] as const)("%s prompts are all different", (_name, items) => {
    const prompts = items.map((i) => i.prompt);
    expect(new Set(prompts).size).toBe(prompts.length);
  });
});

describe("switch puzzles", () => {
  it("have exactly one code that produces the output", async () => {
    const { SWITCH, applySwitch } = await import("@/lib/assess/banks/switch");
    expect(SWITCH).toHaveLength(48);
    for (const item of SWITCH) {
      if (item.kind !== "mcq") throw new Error("expected mcq");
      expect(validateItem(item), item.id).toEqual([]);
      const lines = item.prompt.split("\n");
      const input = lines[0].replace("Input: ", "").split(" ");
      const twoStep = lines.length === 4;
      const middle = twoStep ? applySwitch(input, lines[1].match(/switch (\d{4})/)![1]) : input;
      const output = lines[twoStep ? 2 : 1].split(": ")[1];
      const producing = item.options.filter((code) => applySwitch(middle, code).join(" ") === output);
      expect(producing, item.id).toEqual([item.options[item.answer]]);
      expect(item.options.includes("1234"), item.id).toBe(false);
    }
  });
});
