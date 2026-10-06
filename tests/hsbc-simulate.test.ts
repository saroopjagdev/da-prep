import { describe, expect, it } from "vitest";
import { HSBC_SIMULATE, HSBC_SIMULATE_QUESTIONS } from "@/lib/assess/banks/hsbc-simulate";
import { getTest } from "@/lib/assess/tests";
import { validateTest } from "@/lib/assess/validate";
import { getMock } from "@/lib/mockprocess/definitions";

const COGNITIVE = new Set(["mcq", "numeric", "tf-cannot-say"]);

describe("HSBC Simulate-style replica", () => {
  it("follows the reported tile structure: 4, 4, 10, 9 and 11 questions, 38 in all", () => {
    expect(HSBC_SIMULATE.map((t) => t.tile.items.length)).toEqual([4, 4, 10, 9, 11]);
    expect(HSBC_SIMULATE_QUESTIONS).toBe(38);
    expect(HSBC_SIMULATE.map((t) => t.title.split(":")[1].trim())).toEqual([
      "Project Kick-Off",
      "Global Engagement",
      "Data Monitoring",
      "Navigating Competing Commitments",
      "Pause and Reflect",
    ]);
  });

  it("has about 16 cognitive questions and 22 judgement or work-style questions", () => {
    const items = HSBC_SIMULATE.flatMap((t) => t.tile.items);
    expect(items.filter((i) => COGNITIVE.has(i.kind))).toHaveLength(16);
    expect(items.filter((i) => !COGNITIVE.has(i.kind))).toHaveLength(22);
  });

  it("is a valid test and is the stage the HSBC mock process uses", () => {
    const test = getTest("hsbc-simulate")!;
    expect(test).toBeDefined();
    expect(validateTest(test)).toEqual([]);
    const stages = getMock("hsbc")!.stages.filter((s) => s.kind === "test");
    expect(stages.map((s) => (s as { testId: string }).testId)).toContain("hsbc-simulate");
  });

  it("has computed answers that match the tables", () => {
    const find = (id: string) => HSBC_SIMULATE.flatMap((t) => t.tile.items).find((i) => i.id === id)!;
    expect((find("hs-3-3") as { answer: number }).answer).toBe(2400);
    expect((find("hs-3-5") as { answer: number }).answer).toBe(258);
    expect((find("hs-4-1") as { answer: number }).answer).toBe(205);
    expect((find("hs-4-3") as { answer: number }).answer).toBe(2);
    const q = find("hs-4-4") as { options: string[]; answer: number };
    expect(q.options[q.answer]).toBe("95 minutes");
  });
});
