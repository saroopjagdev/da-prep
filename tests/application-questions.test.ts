import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AI_RULES, COMMON_QUESTIONS, countWords, firmQuestions } from "@/lib/application-questions";
import { FIRMS, getFirm } from "@/lib/firms";

describe("application questions for statement review", () => {
  it("pulls reported questions with word limits from the firm profile", () => {
    const jpm = firmQuestions(getFirm("jp-morgan")!);
    expect(jpm.map((q) => q.text)).toContain("What one trait makes you a unique candidate?");
    expect(jpm.every((q) => q.limit === 500)).toBe(true);
    const rr = firmQuestions(getFirm("rolls-royce")!);
    expect(rr.length).toBe(3);
    expect(rr[0].text).toBe("Why do you want to start a career with us?");
    expect(rr.every((q) => q.limit === 300)).toBe(true);
  });

  it("only returns real questions, each with a source", () => {
    for (const f of FIRMS) for (const q of firmQuestions(f)) {
      expect(q.source, f.slug).toMatch(/^https:\/\//);
      expect(q.text.length, f.slug).toBeGreaterThan(10);
    }
    for (const q of COMMON_QUESTIONS) expect(q.common).toBe(true);
  });

  it("counts words", () => {
    expect(countWords("  one two\nthree  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });

  it("cites every employer AI rule from a profile that exists", () => {
    for (const r of AI_RULES) {
      expect(getFirm(r.slug), r.slug).toBeDefined();
      expect(r.source).toMatch(/^https:\/\//);
    }
    const profiles = readdirSync("lib/firms").map((f) => readFileSync(`lib/firms/${f}`, "utf8")).join("\n");
    for (const r of AI_RULES) expect(profiles.includes(r.source), r.source).toBe(true);
  });
});
