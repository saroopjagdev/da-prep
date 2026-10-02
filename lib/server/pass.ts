import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { rateLimit } from "@/lib/rateLimit";

/**
 * Practice passes. When a free allowance is charged (the first question of an interview, the first scored stage of
 * a mock process) the server issues a signed pass. Follow-up AI calls for that practice session must present it,
 * so a client can't skip the charge by faking history, and each pass only covers one session's worth of calls.
 */
export type PassKind = "interview" | "mock";

const RULES: Record<PassKind, { ttlMs: number; maxCalls: number }> = {
  // 5 questions plus repeats, marking (and one retry), and transcriptions with re-records.
  interview: { ttlMs: 6 * 3600_000, maxCalls: 30 },
  // A mock process can be resumed over several days; stages, re-records and transcriptions add up.
  mock: { ttlMs: 14 * 86400_000, maxCalls: 80 },
};

export const PASS_HEADER: Record<PassKind, string> = { interview: "x-pass-interview", mock: "x-pass-mock" };

type Payload = { u: string; k: PassKind; n: string; e: number };

function secret(): string | null {
  return process.env.PASS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (body: string, key: string) => createHmac("sha256", key).update(body).digest("base64url");

/** Create a pass for this user and kind. Returns null when no signing secret is configured. */
export function issuePass(userId: string, kind: PassKind, now = Date.now()): { pass: string; kind: PassKind; expires: number } | null {
  const key = secret();
  if (!key) return null;
  const payload: Payload = { u: userId, k: kind, n: randomBytes(12).toString("base64url"), e: now + RULES[kind].ttlMs };
  const body = b64(JSON.stringify(payload));
  return { pass: `${body}.${sign(body, key)}`, kind, expires: payload.e };
}

/** Verify a pass's signature, owner, kind and expiry. Does not count a use. */
export function readPass(token: string | null, userId: string, kinds: PassKind[], now = Date.now()): Payload | null {
  const key = secret();
  if (!token || !key) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = Buffer.from(sign(body, key));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (p.u !== userId || !kinds.includes(p.k) || typeof p.e !== "number" || p.e < now) return null;
    return p;
  } catch {
    return null;
  }
}

/**
 * Require a valid pass of one of `kinds` on the request, and count one use against it.
 * Returns a Response to send back when the pass is missing, invalid or used up, otherwise null.
 */
export async function requirePass(req: Request, userId: string, kinds: PassKind[]): Promise<Response | null> {
  for (const kind of kinds) {
    const p = readPass(req.headers.get(PASS_HEADER[kind]), userId, [kind]);
    if (!p) continue;
    const rule = RULES[p.k];
    if (await rateLimit(`pass:${p.n}`, rule.maxCalls, rule.ttlMs)) return null;
    return Response.json({ error: "This practice session has reached its limit. Start a new one." }, { status: 429 });
  }
  return Response.json({ error: "Your practice session has expired. Start a new one to continue." }, { status: 403 });
}
