import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const askJson = vi.fn();
const rpc = vi.fn();
const userFromRequest = vi.fn();

vi.mock("@/lib/ai", () => ({
  askJson: (...a: unknown[]) => askJson(...a),
  mockEnabled: () => false,
  transcribeAudio: async () => "I led a team.",
  transcribeModel: () => "test",
}));
vi.mock("@/lib/server/auth", () => ({ admin: () => ({ rpc, from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }) }) }), userFromRequest: (...a: unknown[]) => userFromRequest(...a) }));

import { POST as next } from "@/app/api/interview/next/route";
import { POST as score } from "@/app/api/interview/score/route";
import { POST as mockScore } from "@/app/api/mock/score/route";
import { POST as transcribe } from "@/app/api/transcribe/route";
import { guardAi, limitsEnforced } from "@/lib/server/guard";
import { PASS_HEADER, issuePass, readPass, requirePass } from "@/lib/server/pass";

const ad = "Degree apprenticeship in software engineering at Example Ltd, working with the platform team.";
const turn = { question: "Why us?", answer: "Because I like building things." };

let n = 0;
function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer t", "x-forwarded-for": `10.1.0.${++n}`, ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv("PASS_SECRET", "test-secret");
  askJson.mockReset();
  rpc.mockReset();
  rpc.mockResolvedValue({ data: true, error: null }); // daily budget and free allowance both available
  userFromRequest.mockReset();
  userFromRequest.mockResolvedValue({ id: `user-${n}` });
});
afterEach(() => vi.unstubAllEnvs());

describe("practice passes", () => {
  it("round-trips for the right user and kind only", () => {
    const p = issuePass("u1", "interview")!;
    expect(readPass(p.pass, "u1", ["interview"])).not.toBeNull();
    expect(readPass(p.pass, "u2", ["interview"])).toBeNull();
    expect(readPass(p.pass, "u1", ["mock"])).toBeNull();
  });

  it("rejects tampered, foreign-key and expired passes", () => {
    const p = issuePass("u1", "interview")!;
    const [body, mac] = p.pass.split(".");
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, "base64url").toString()), u: "u2" })).toString("base64url");
    expect(readPass(`${forged}.${mac}`, "u2", ["interview"])).toBeNull();
    vi.stubEnv("PASS_SECRET", "another-secret");
    expect(readPass(p.pass, "u1", ["interview"])).toBeNull();
    vi.stubEnv("PASS_SECRET", "test-secret");
    expect(readPass(p.pass, "u1", ["interview"], p.expires + 1)).toBeNull();
    expect(readPass("garbage", "u1", ["interview"])).toBeNull();
    expect(readPass(null, "u1", ["interview"])).toBeNull();
  });

  it("caps the calls one pass can make", async () => {
    const p = issuePass("cap-user", "interview")!;
    const r = () => new Request("http://x", { headers: { [PASS_HEADER.interview]: p.pass } });
    let allowed = 0;
    for (let i = 0; i < 40; i++) if ((await requirePass(r(), "cap-user", ["interview"])) === null) allowed++;
    expect(allowed).toBe(30);
  });
});

describe("limits switch", () => {
  it("is on in production with accounts configured unless explicitly off", () => {
    vi.stubEnv("ENFORCE_LIMITS", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "k");
    expect(limitsEnforced()).toBe(true);
    vi.stubEnv("ENFORCE_LIMITS", "false");
    expect(limitsEnforced()).toBe(false);
  });

  it("is off in development and without accounts unless explicitly on", () => {
    vi.stubEnv("ENFORCE_LIMITS", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(limitsEnforced()).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(limitsEnforced()).toBe(false);
    vi.stubEnv("ENFORCE_LIMITS", "true");
    expect(limitsEnforced()).toBe(true);
  });

  it("applies a per-route daily cap", async () => {
    vi.stubEnv("ENFORCE_LIMITS", "true");
    userFromRequest.mockResolvedValue({ id: "daily-user" });
    expect((await guardAi(req({}), "t-day", 100, 2)).ok).toBe(true);
    expect((await guardAi(req({}), "t-day", 100, 2)).ok).toBe(true);
    const third = await guardAi(req({}), "t-day", 100, 2);
    expect(third.ok).toBe(false);
    if (!third.ok) expect(third.response.status).toBe(429);
  });
});

describe("routes require the pass when limits are enforced", () => {
  beforeEach(() => vi.stubEnv("ENFORCE_LIMITS", "true"));

  it("interview: first question issues a pass; later questions and marking need it", async () => {
    askJson.mockResolvedValue({ question: "Tell me about a project." });
    const first = await next(req({ jobAd: ad, stage: "competency", history: [] }));
    expect(first.status).toBe(200);
    const body = await first.json();
    expect(body).toMatchObject({ question: "Tell me about a project.", kind: "interview" });
    expect(typeof body.pass).toBe("string");

    // Faking history without a pass no longer gets a free question.
    const faked = await next(req({ jobAd: ad, stage: "competency", history: [turn] }));
    expect(faked.status).toBe(403);

    askJson.mockResolvedValue({ question: "Tell me about a challenge." });
    const withPass = await next(req({ jobAd: ad, stage: "competency", history: [turn] }, { [PASS_HEADER.interview]: body.pass }));
    expect(withPass.status).toBe(200);
    expect(await withPass.json()).toEqual({ question: "Tell me about a challenge." });

    expect((await score(req({ jobAd: ad, stage: "competency", turns: [turn] }))).status).toBe(403);
  });

  it("a pass belongs to one user", async () => {
    const p = issuePass("someone-else", "interview")!;
    const res = await next(req({ jobAd: ad, stage: "competency", history: [turn] }, { [PASS_HEADER.interview]: p.pass }));
    expect(res.status).toBe(403);
  });

  it("mock process: later stages need the pass from the first scored stage", async () => {
    const input = {
      firmName: "Example",
      stageName: "Video interview",
      mode: "video",
      framework: { name: "Values", items: ["Integrity"] },
      turns: [{ prompt: "Why us?", answer: "Because I like building things." }],
    };
    const res = await mockScore(req({ ...input, first: false }));
    expect(res.status).toBe(403);
    expect(askJson).not.toHaveBeenCalled();
  });

  it("transcription needs an interview or mock pass", async () => {
    const form = () => {
      const f = new FormData();
      f.append("audio", new File([new Uint8Array(100)], "a.webm", { type: "audio/webm" }));
      return f;
    };
    const mk = (headers: Record<string, string>) =>
      new Request("http://localhost/api/transcribe", { method: "POST", headers: { authorization: "Bearer t", "x-forwarded-for": `10.2.0.${++n}`, ...headers }, body: form() });
    userFromRequest.mockResolvedValue({ id: "tx-user" });
    expect((await transcribe(mk({}))).status).toBe(403);
    const p = issuePass("tx-user", "mock")!;
    expect((await transcribe(mk({ [PASS_HEADER.mock]: p.pass }))).status).toBe(200);
  });
});
