// "Break it" tests: throw malformed, oversized and hostile input at every API route and check none of them crash
// (no 500s), none reach the AI with bad input, and none leak internal error details.
import { beforeEach, describe, expect, it, vi } from "vitest";

const askJson = vi.fn();
const transcribeAudio = vi.fn();
vi.mock("@/lib/ai", () => ({
  askJson: (...a: unknown[]) => askJson(...a),
  transcribeAudio: (...a: unknown[]) => transcribeAudio(...a),
  transcribeModel: () => "test",
  mockEnabled: () => false,
}));
vi.mock("@/lib/server/usage", () => ({ consumeInterview: async () => ({ ok: true }), consumeReview: async () => ({ ok: true }) }));

import { POST as next } from "@/app/api/interview/next/route";
import { POST as score } from "@/app/api/interview/score/route";
import { POST as mockScore } from "@/app/api/mock/score/route";
import { POST as review } from "@/app/api/review/route";
import { POST as star } from "@/app/api/star/route";
import { POST as checkout } from "@/app/api/stripe/checkout/route";
import { POST as webhook } from "@/app/api/stripe/webhook/route";
import { POST as transcribe } from "@/app/api/transcribe/route";

let n = 0;
const req = (raw: string | undefined, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `172.16.0.${++n}`, ...headers },
    body: raw,
  });

const ROUTES = { next, score, mockScore, review, star, checkout } as const;

const HOSTILE: [string, string | undefined][] = [
  ["no body", undefined],
  ["empty string", ""],
  ["not JSON", "{oops"],
  ["JSON null", "null"],
  ["JSON array", "[1,2,3]"],
  ["number", "42"],
  ["wrong types", JSON.stringify({ jobAd: 5, stage: ["x"], history: "nope", text: {}, kind: 1, plan: null })],
  ["prototype pollution", JSON.stringify({ __proto__: { admin: true }, constructor: { prototype: { x: 1 } } })],
  ["huge text", JSON.stringify({ jobAd: "x".repeat(200_000), text: "x".repeat(200_000), stage: "motivation", history: [], kind: "statement" })],
  ["deep nesting", JSON.stringify(JSON.parse("[".repeat(500) + "]".repeat(500)))],
  ["too many turns", JSON.stringify({ jobAd: "A degree apprenticeship advert long enough.", stage: "motivation", history: Array(50).fill({ question: "q", answer: "a" }) })],
  ["bad firm slug", JSON.stringify({ stage: "motivation", history: [], firm: "../../etc/passwd" })],
];

beforeEach(() => {
  askJson.mockReset();
  askJson.mockResolvedValue({});
  transcribeAudio.mockReset();
});

describe("API routes survive hostile input", () => {
  for (const [name, route] of Object.entries(ROUTES)) {
    it.each(HOSTILE)(`${name}: %s gives a clean 4xx`, async (_label, raw) => {
      const res = await route(req(raw));
      expect(res.status, `${name}`).toBeGreaterThanOrEqual(400);
      expect(res.status, `${name}`).toBeLessThan(500);
      const body = await res.text();
      expect(body).not.toMatch(/at \w+ \(|node_modules|stack|TypeError|SyntaxError/);
      expect(askJson).not.toHaveBeenCalled();
    });
  }
});

describe("the AI output is never trusted blindly", () => {
  it("a model reply that doesn't match the schema becomes a clean error", async () => {
    askJson.mockRejectedValue(new Error("Model returned an invalid response"));
    const res = await star(req(JSON.stringify({ notes: "I led my school's robotics club and we won a regional prize." })));
    expect(res.status).toBe(500);
    expect(await res.text()).not.toMatch(/stack|Model returned/);
  });
});

describe("webhook and uploads", () => {
  it("the webhook refuses unsigned or unconfigured requests", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect((await webhook(req("{}"))).status).toBe(503);
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_x");
    expect((await webhook(req("{}"))).status).toBe(503); // no admin client or signature
    vi.unstubAllEnvs();
  });

  it("transcription rejects missing, empty, oversized and non-audio uploads", async () => {
    const send = (form?: FormData) =>
      transcribe(new Request("http://localhost/api/transcribe", { method: "POST", headers: { "x-forwarded-for": `172.17.0.${++n}` }, body: form }));
    expect((await send()).status).toBe(400);
    const empty = new FormData();
    empty.set("audio", new File([], "a.webm", { type: "audio/webm" }));
    expect((await send(empty)).status).toBe(400);
    const big = new FormData();
    big.set("audio", new File([new Uint8Array(9 * 1024 * 1024)], "a.webm", { type: "audio/webm" }));
    expect((await send(big)).status).toBe(413);
    const exe = new FormData();
    exe.set("audio", new File([new Uint8Array(10)], "a.exe", { type: "application/x-msdownload" }));
    expect((await send(exe)).status).toBe(415);
    expect(transcribeAudio).not.toHaveBeenCalled();
  });
});
