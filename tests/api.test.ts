import { beforeEach, describe, expect, it, vi } from "vitest";

const askJson = vi.fn();
const consumeInterview = vi.fn();
const consumeReview = vi.fn();

vi.mock("@/lib/ai", () => ({ askJson: (...a: unknown[]) => askJson(...a), mockEnabled: () => false }));
vi.mock("@/lib/server/usage", () => ({
  consumeInterview: (...a: unknown[]) => consumeInterview(...a),
  consumeReview: (...a: unknown[]) => consumeReview(...a),
}));

import { DELETE as deleteAccount } from "@/app/api/account/route";
import { POST as next } from "@/app/api/interview/next/route";
import { POST as score } from "@/app/api/interview/score/route";
import { POST as review } from "@/app/api/review/route";
import { POST as star } from "@/app/api/star/route";
import { POST as checkout } from "@/app/api/stripe/checkout/route";

let n = 0;
/** A request from a fresh IP each time, so the in-memory rate limiter doesn't leak between tests. */
function req(body: unknown, ip = `10.0.0.${++n}`, raw?: string) {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: raw ?? JSON.stringify(body),
  });
}

const ad = "Degree apprenticeship in software engineering at Example Ltd, working with the platform team.";
const turns = [
  { question: "Why us?", answer: "Because I like building things." },
  { question: "Teamwork?", answer: "I led a four person robotics team." },
];

beforeEach(() => {
  askJson.mockReset();
  consumeInterview.mockReset();
  consumeInterview.mockResolvedValue({ ok: true });
  consumeReview.mockReset();
  consumeReview.mockResolvedValue({ ok: true });
});

describe("POST /api/interview/next", () => {
  it("rejects bad input and malformed JSON", async () => {
    expect((await next(req({ jobAd: "short", stage: "motivation", history: [] }))).status).toBe(400);
    expect((await next(req(null, undefined, "not json"))).status).toBe(400);
    expect(askJson).not.toHaveBeenCalled();
  });

  it("returns the generated question and passes the sector into the prompt", async () => {
    askJson.mockResolvedValue({ question: "Tell me about a project." });
    const res = await next(req({ jobAd: ad, stage: "competency", sector: "digital", history: [] }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ question: "Tell me about a project." });
    const system = (askJson.mock.calls[0][0] as { system: string }).system;
    expect(system).toContain("Sector: Digital and technology");
  });

  it("counts only the first question of an interview against the allowance", async () => {
    askJson.mockResolvedValue({ question: "Q" });
    await next(req({ jobAd: ad, stage: "motivation", history: [] }));
    expect(consumeInterview).toHaveBeenCalledTimes(1);
    await next(req({ jobAd: ad, stage: "motivation", history: [turns[0]] }));
    expect(consumeInterview).toHaveBeenCalledTimes(1);
  });

  it("blocks the interview when the free allowance is used up", async () => {
    consumeInterview.mockResolvedValue({ ok: false, status: 402, error: "Free limit reached." });
    const res = await next(req({ jobAd: ad, stage: "motivation", history: [] }));
    expect(res.status).toBe(402);
    expect((await res.json()).error).toMatch(/Free limit/);
    expect(askJson).not.toHaveBeenCalled();
  });

  it("returns a friendly 500 when the model call fails", async () => {
    askJson.mockRejectedValue(new Error("upstream down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await next(req({ jobAd: ad, stage: "motivation", history: [] }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/Could not generate/);
  });

  it("rate limits repeated calls from one IP", async () => {
    askJson.mockResolvedValue({ question: "Q" });
    const body = { jobAd: ad, stage: "motivation", history: [turns[0]] };
    const statuses: number[] = [];
    for (let i = 0; i < 22; i++) statuses.push((await next(req(body, "9.9.9.9"))).status);
    expect(statuses.slice(0, 20).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(20)).toEqual([429, 429]);
  }, 20_000); // 22 sequential route calls; slow when the database test runs alongside
});

describe("POST /api/interview/score", () => {
  const good = {
    overall: 70,
    summary: "ok",
    strengths: ["a"],
    improvements: ["b"],
    rubric: { structure: 3, specificity: 2, motivation: 4, firmKnowledge: 1, commercialAwareness: 2, values: 3 },
    nextSteps: ["one", "two", "three", "four"],
    turns: turns.map(() => ({
      score: 6,
      feedback: "f",
      star: { situation: true, task: true, action: true, result: false },
      betterAnswer: "x",
    })),
  };

  it("validates input", async () => {
    expect((await score(req({ jobAd: ad, stage: "competency", turns: [] }))).status).toBe(400);
  });

  it("marks against an employer profile when no advert is given", async () => {
    askJson.mockResolvedValue(good);
    const res = await score(req({ stage: "commercial", turns, firm: "morgan-stanley", programme: 0 }));
    expect(res.status).toBe(200);
    const call = askJson.mock.calls.at(-1)![0] as { user: string; system: string };
    expect(call.user).toContain("<employer_profile>");
    expect(call.user).toContain("Morgan Stanley");
    expect(call.system).toContain("firmKnowledge");
  });

  it("rejects an unknown employer with no advert", async () => {
    expect((await score(req({ stage: "competency", turns, firm: "not-a-firm" }))).status).toBe(400);
  });

  it("returns the marked result", async () => {
    askJson.mockResolvedValue(good);
    const res = await score(req({ jobAd: ad, stage: "competency", turns }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.overall).toBe(70);
    expect(body.nextSteps).toEqual(["one", "two", "three"]);
  });

  it("fails safely if the model returns the wrong number of answers", async () => {
    askJson.mockResolvedValue({ ...good, turns: good.turns.slice(0, 1) });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await score(req({ jobAd: ad, stage: "competency", turns }));
    expect(res.status).toBe(500);
  });

  it("has a tighter rate limit than question generation", async () => {
    askJson.mockResolvedValue(good);
    const body = { jobAd: ad, stage: "competency", turns };
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) statuses.push((await score(req(body, "8.8.8.8"))).status);
    expect(statuses.slice(0, 6).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(6)).toEqual([429, 429]);
  });
});

describe("writing helpers", () => {
  it("STAR builder validates and returns the structured answer", async () => {
    expect((await star(req({ notes: "x" }))).status).toBe(400);
    const out = { situation: "s", task: "t", action: "a", result: "r", tip: "tip" };
    askJson.mockResolvedValue(out);
    const res = await star(req({ notes: "I led the robotics club build and we finished early.", competency: "Teamwork" }));
    expect(await res.json()).toEqual(out);
  });

  it("statement review validates kind and length", async () => {
    expect((await review(req({ kind: "poem", text: "x".repeat(80) }))).status).toBe(400);
    expect((await review(req({ kind: "statement", text: "too short" }))).status).toBe(400);
    askJson.mockResolvedValue({ score: 6, summary: "s", strengths: [], improvements: [], rewrittenOpening: "o" });
    expect((await review(req({ kind: "statement", text: "x".repeat(80) }))).status).toBe(200);
  });

  it("statement review uses the employer, question and word limit", async () => {
    askJson.mockResolvedValue({ score: 6, summary: "s", strengths: [], improvements: [], rewrittenOpening: "o", criteria: { answersQuestion: 3, evidence: 2, tailoring: 2, values: 2, structure: 4 } });
    const text = Array(40).fill("word").join(" ");
    const res = await review(req({ kind: "answer", text, firm: "jp-morgan", question: "What one trait makes you a unique candidate?", wordLimit: 30 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ wordCount: 40, wordLimit: 30 });
    const call = askJson.mock.calls.at(-1)![0] as { user: string; system: string };
    expect(call.user).toContain("<employer_profile>");
    expect(call.user).toContain("<question>");
    expect(call.system).toMatch(/over the limit/);
    expect(call.system).toContain("tailoring");
  });
});

describe("billing and account endpoints without configuration", () => {
  it("checkout reports payments aren't configured", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("STRIPE_PRICE_ID", "");
    vi.stubEnv("STRIPE_PRICE_PASS", "");
    expect((await checkout(req({ plan: "pass", payerAdult: true, startNow: true, acceptTerms: true }))).status).toBe(503);
    vi.unstubAllEnvs();
  });

  it("account deletion requires a signed-in user", async () => {
    const res = await deleteAccount(new Request("http://localhost/api/account", { method: "DELETE" }));
    expect(res.status).toBe(401);
  });

  it("statement review stops when the free allowance is used", async () => {
    consumeReview.mockResolvedValue({ ok: false, status: 402, error: "Used up." });
    const res = await review(req({ kind: "statement", text: "x".repeat(80) }));
    expect(res.status).toBe(402);
    expect(askJson).not.toHaveBeenCalled();
  });
});
