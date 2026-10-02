import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { askJson } from "@/lib/ai";
import { scoreOutput, scoreSystem, scoreUser } from "@/lib/interview";
import { reviewOutput, reviewSystem, reviewUser } from "@/lib/writing";

type InterviewCase = { id: string; context: string; question: string; answer: string; band: [number, number]; mustNot: string[] };
type StatementCase = {
  id: string;
  kind: "statement" | "answer";
  band: [number, number];
  text?: string;
  jobAd?: string;
  repeatOf?: string;
  repeat?: number;
};

const dir = path.resolve(import.meta.dirname, "../evals");
const interview = JSON.parse(fs.readFileSync(path.join(dir, "interview-cases.json"), "utf8")) as {
  contexts: Record<string, string>;
  cases: InterviewCase[];
};
const statements = JSON.parse(fs.readFileSync(path.join(dir, "statement-cases.json"), "utf8")) as { cases: StatementCase[] };

const statementText = (c: StatementCase) => {
  if (c.text) return c.text;
  const base = statements.cases.find((s) => s.id === c.repeatOf)?.text ?? "";
  return Array(c.repeat ?? 1).fill(base).join("\n\n").slice(0, 6000);
};

describe("eval sets are well formed", () => {
  it("interview cases", () => {
    expect(interview.cases.length).toBeGreaterThanOrEqual(30);
    for (const c of interview.cases) {
      expect(interview.contexts[c.context], c.id).toBeTruthy();
      expect(c.band[0]).toBeLessThanOrEqual(c.band[1]);
      expect(c.answer.length).toBeLessThanOrEqual(4000);
    }
    expect(new Set(interview.cases.map((c) => c.id)).size).toBe(interview.cases.length);
  });
  it("statement cases", () => {
    for (const c of statements.cases) {
      const t = statementText(c);
      expect(t.length, c.id).toBeGreaterThanOrEqual(50);
      expect(t.length, c.id).toBeLessThanOrEqual(6000);
    }
  });
});

/**
 * Live run against the real model. Costs money (roughly 5-10p for the whole set), so it only runs when asked:
 *   RUN_EVALS=1 OPENAI_API_KEY=... npx vitest run tests/evals.test.ts
 * Each case is marked twice to check consistency. Results are written to evals/results/.
 */
const live = process.env.RUN_EVALS === "1" && !!process.env.OPENAI_API_KEY;

describe.skipIf(!live)("live AI evaluation", () => {
  it(
    "interview marking stays in band, consistent and safe",
    async () => {
      const rows = [];
      for (const c of interview.cases) {
        const turns = [{ question: c.question, answer: c.answer }];
        const runs = [];
        for (let i = 0; i < 2; i++) {
          const out = await askJson({ system: scoreSystem(), user: scoreUser(interview.contexts[c.context], turns), schema: scoreOutput, maxTokens: 10000 });
          runs.push({ score: out.turns[0]?.score, feedback: out.turns[0]?.feedback, better: out.turns[0]?.betterAnswer, summary: out.summary });
        }
        const scores = runs.map((r) => r.score);
        const inBand = scores.every((s) => s >= c.band[0] && s <= c.band[1]);
        const spread = Math.max(...scores) - Math.min(...scores);
        const text = JSON.stringify(runs).toLowerCase();
        const leaks = /system prompt|you are a friendly, realistic/.test(text) || (c.id === "personal-data" && /07700|example road/.test(runs.map((r) => r.better).join(" ").toLowerCase()));
        rows.push({ id: c.id, band: c.band, scores, inBand, spread, leaks, runs });
      }
      write("interview", rows);
      const failures = rows.filter((r) => !r.inBand || r.spread > 2 || r.leaks).map((r) => r.id);
      expect(failures, `out of band, inconsistent or leaking: ${failures.join(", ")}`).toEqual([]);
    },
    30 * 60_000,
  );

  it(
    "statement review stays in band and consistent",
    async () => {
      const rows = [];
      for (const c of statements.cases) {
        const runs = [];
        for (let i = 0; i < 2; i++) {
          const out = await askJson({ system: reviewSystem(c.kind), user: reviewUser(statementText(c), c.jobAd), schema: reviewOutput, maxTokens: 6000 });
          runs.push(out);
        }
        const scores = runs.map((r) => r.score);
        rows.push({ id: c.id, band: c.band, scores, inBand: scores.every((s) => s >= c.band[0] && s <= c.band[1]), spread: Math.max(...scores) - Math.min(...scores), runs });
      }
      write("statement", rows);
      const failures = rows.filter((r) => !r.inBand || r.spread > 2).map((r) => r.id);
      expect(failures, `out of band or inconsistent: ${failures.join(", ")}`).toEqual([]);
    },
    30 * 60_000,
  );
});

function write(name: string, rows: unknown[]) {
  const out = path.join(dir, "results");
  fs.mkdirSync(out, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  fs.writeFileSync(path.join(out, `${name}-${stamp}.json`), JSON.stringify({ model: process.env.OPENAI_MODEL || "default", rows }, null, 2));
}
