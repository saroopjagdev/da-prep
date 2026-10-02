import { describe, expect, it } from "vitest";
import { SJT, buildSjt } from "@/lib/assess/banks/sjt";
import { TRAITS, TRAIT_BANK, buildTraits } from "@/lib/assess/banks/traits";
import { VERBAL_TF, VERBAL_TF_STIMULI } from "@/lib/assess/banks/verbal-tf";
import { validateItem } from "@/lib/assess/validate";

describe("verbal true/false/cannot say bank", () => {
  it("has 48 valid statements over 8 passages", () => {
    expect(VERBAL_TF).toHaveLength(48);
    expect(Object.keys(VERBAL_TF_STIMULI)).toHaveLength(8);
    for (const item of VERBAL_TF) {
      expect(validateItem(item), item.id).toEqual([]);
      expect(VERBAL_TF_STIMULI[item.stimulus!], item.id).toBeDefined();
    }
  });

  it("each passage has two of each answer", () => {
    for (const g of Object.keys(VERBAL_TF_STIMULI)) {
      const answers = VERBAL_TF.filter((i) => i.stimulus === g).map((i) => (i.kind === "tf-cannot-say" ? i.answer : -1));
      expect([0, 1, 2].map((a) => answers.filter((x) => x === a).length), g).toEqual([2, 2, 2]);
    }
  });

  it("statements are not copied verbatim from the passage", () => {
    for (const item of VERBAL_TF) {
      const stim = VERBAL_TF_STIMULI[item.stimulus!];
      if (stim.type !== "text") throw new Error("expected text");
      expect(stim.body.includes(item.prompt), item.id).toBe(false);
    }
  });
});

describe("situational judgement bank", () => {
  it("has 24 most/least, 12 rate-each and 10 ranking items, all valid", () => {
    expect(SJT.mostLeast).toHaveLength(24);
    expect(SJT.rateEach).toHaveLength(12);
    expect(SJT.rank).toHaveLength(10);
    for (const item of [...SJT.mostLeast, ...SJT.rateEach, ...SJT.rank]) expect(validateItem(item), item.id).toEqual([]);
  });

  it("every rate-each scenario uses the whole rating scale once", () => {
    for (const item of SJT.rateEach) {
      if (item.kind !== "rate-each") throw new Error("expected rate-each");
      expect([...item.ratings].sort(), item.id).toEqual([0, 1, 2, 3]);
    }
  });

  it("best answers are not always in the same position", () => {
    const positions = SJT.mostLeast.map((i) => (i.kind === "most-least" ? i.most : -1));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });

  it("ranking items never show the options already in the right order", () => {
    for (const item of SJT.rank) {
      if (item.kind !== "rank") throw new Error("expected rank");
      expect(item.order, item.id).not.toEqual(item.order.map((_, k) => k));
    }
  });

  it("has no duplicate scenarios or options within a scenario", () => {
    const all = [...SJT.mostLeast, ...SJT.rateEach, ...SJT.rank];
    for (const i of all) {
      const opts = i.kind === "rate-each" ? i.actions : i.kind === "most-least" || i.kind === "rank" ? i.options : [];
      expect(new Set(opts).size, i.id).toBe(opts.length);
    }
    for (const pool of [SJT.mostLeast, SJT.rateEach]) {
      const prompts = pool.map((i) => i.prompt);
      expect(new Set(prompts).size).toBe(prompts.length);
    }
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildSjt())).toBe(JSON.stringify(SJT));
  });
});

describe("trait bank", () => {
  it("has 20 likert items and 12 forced-choice blocks, all valid", () => {
    expect(TRAIT_BANK.likert).toHaveLength(20);
    expect(TRAIT_BANK.forcedChoice).toHaveLength(12);
    for (const item of [...TRAIT_BANK.likert, ...TRAIT_BANK.forcedChoice]) expect(validateItem(item), item.id).toEqual([]);
  });

  it("every trait is measured by both formats and has a reverse-keyed item", () => {
    for (const t of TRAITS) {
      expect(TRAIT_BANK.likert.some((i) => i.kind === "likert" && i.trait === t), t).toBe(true);
      expect(TRAIT_BANK.likert.some((i) => i.kind === "likert" && i.trait === t && i.reverse), t).toBe(true);
      expect(TRAIT_BANK.forcedChoice.some((i) => i.kind === "forced-choice" && i.statements.some((s) => s.trait === t)), t).toBe(true);
    }
  });

  it("forced-choice blocks never repeat a trait within a block", () => {
    for (const item of TRAIT_BANK.forcedChoice) {
      if (item.kind !== "forced-choice") throw new Error("expected forced-choice");
      expect(new Set(item.statements.map((s) => s.trait)).size, item.id).toBe(item.statements.length);
    }
  });

  it("traits appear about equally often across forced-choice blocks", () => {
    const counts = new Map<string, number>();
    for (const item of TRAIT_BANK.forcedChoice) if (item.kind === "forced-choice") for (const s of item.statements) counts.set(s.trait, (counts.get(s.trait) ?? 0) + 1);
    expect(Math.max(...counts.values()) - Math.min(...counts.values())).toBeLessThanOrEqual(1);
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildTraits())).toBe(JSON.stringify(TRAIT_BANK));
  });
});

describe("Cappfinity-style banks", () => {
  it("are valid and computed keys match the tables", async () => {
    const { CAPP_NUMERICAL } = await import("@/lib/assess/banks/capp-numerical");
    const { CAPP_VERBAL, CAPP_CRITICAL } = await import("@/lib/assess/banks/capp-verbal");
    for (const item of [...CAPP_NUMERICAL.items, ...CAPP_VERBAL, ...CAPP_CRITICAL]) expect(validateItem(item), item.id).toEqual([]);
    for (const item of CAPP_NUMERICAL.items) {
      const got = CAPP_NUMERICAL.checks[item.id](CAPP_NUMERICAL.stimuli[item.stimulus!]);
      const key = item.kind === "numeric" ? item.answer : item.kind === "rank" ? item.order : item.kind === "mcq" ? item.answer : null;
      expect(got, item.id).toEqual(key);
    }
    expect(new Set(CAPP_NUMERICAL.items.map((i) => i.kind))).toEqual(new Set(["numeric", "rank", "mcq"]));
  });

  it("never shows ranking options already in order and spreads correct answers", async () => {
    const { CAPP_NUMERICAL } = await import("@/lib/assess/banks/capp-numerical");
    const { CAPP_VERBAL, CAPP_CRITICAL } = await import("@/lib/assess/banks/capp-verbal");
    const all = [...CAPP_NUMERICAL.items, ...CAPP_VERBAL, ...CAPP_CRITICAL];
    for (const i of all) if (i.kind === "rank") expect(i.order, i.id).not.toEqual(i.order.map((_, k) => k));
    const mcqPositions = new Set(all.flatMap((i) => (i.kind === "mcq" && i.options.length === 4 ? [i.answer] : [])));
    expect(mcqPositions.size).toBeGreaterThan(2);
  });

  it("covers all five critical reasoning styles four times each", async () => {
    const { CAPP_CRITICAL } = await import("@/lib/assess/banks/capp-verbal");
    for (const style of ["lc", "brd", "arg", "tf", "as"]) expect(CAPP_CRITICAL.filter((i) => i.id.startsWith(`capp-cr-${style}`)), style).toHaveLength(4);
  });
});

describe("job simulations", () => {
  it("are valid, cover mixed response types and include a written reply", async () => {
    const { AUDIT_SIM, BANKING_SIM } = await import("@/lib/assess/banks/job-sim");
    for (const sim of [BANKING_SIM, AUDIT_SIM]) {
      for (const item of sim.items) {
        expect(validateItem(item), item.id).toEqual([]);
        expect(sim.stimuli[item.stimulus!]?.type, item.id).toBe("email");
        if (item.kind === "rank") expect(item.order, item.id).not.toEqual(item.order.map((_, k) => k));
        if (item.kind === "rate-each") expect([...item.ratings].sort(), item.id).toEqual([0, 1, 2, 3]);
      }
      const kinds = new Set(sim.items.map((i) => i.kind));
      for (const k of ["rank", "mcq", "most-least", "numeric", "written", "rate-each"]) expect(kinds.has(k as never), k).toBe(true);
    }
  });

  it("does not mark written replies but records that they were answered", async () => {
    const { BANKING_SIM } = await import("@/lib/assess/banks/job-sim");
    const { scoreItem } = await import("@/lib/assess/score");
    const w = BANKING_SIM.items.find((i) => i.kind === "written")!;
    expect(scoreItem(w, { kind: "written", text: "Hi Dana" })).toEqual({ points: 0, max: 0, answered: true });
    expect(scoreItem(w, { kind: "written", text: "  " }).answered).toBe(false);
  });

  it("is linked from firms reported to use simulations", async () => {
    const { practiceLinks } = await import("@/lib/firms/glance");
    const { getFirm } = await import("@/lib/firms");
    expect(practiceLinks(getFirm("hsbc")!).map((l) => l.href)).toContain("/tests/job-sim-banking");
    expect(practiceLinks(getFirm("deloitte")!).map((l) => l.href)).toContain("/tests/job-sim-audit");
  });
});
