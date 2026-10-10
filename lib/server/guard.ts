import { rateLimit } from "@/lib/rateLimit";
import { admin, userFromRequest } from "@/lib/server/auth";

/** Hard ceiling on AI calls per signed-in user per day, Pro included. Bounds spend if a client misbehaves. */
export const DAILY_AI_CALLS = 150;

/** Best-effort client IP. Vercel sets x-real-ip / overwrites x-forwarded-for; take the first hop only. */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** `userId` is set when limits are enforced (the caller is then always signed in). */
type Guard = { ok: true; userId: string | null } | { ok: false; response: Response };

const deny = (error: string, status: number): Guard => ({ ok: false, response: Response.json({ error }, { status }) });

/**
 * Whether sign-in and usage limits apply. On by default in production whenever accounts are configured, so a
 * missing ENFORCE_LIMITS can't silently open the AI routes to everyone; set ENFORCE_LIMITS=false to opt out.
 * Elsewhere (local development, self-hosting without accounts) it is off unless ENFORCE_LIMITS=true.
 */
export function limitsEnforced(): boolean {
  const flag = process.env.ENFORCE_LIMITS;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

const DAY_MS = 86_400_000;

/**
 * Front door for every route that spends OpenAI money.
 * When limits are enforced the caller must be signed in and is held to a daily budget across all AI routes, plus an
 * optional daily cap for this route (`perDay`, for the expensive marking calls). The per-minute rate limit is keyed
 * on the user id when known, otherwise on the client IP.
 */
export async function guardAi(req: Request, name: string, perMinute = 20, perDay?: number): Promise<Guard> {
  const enforce = limitsEnforced();
  let who = clientIp(req);
  let userId: string | null = null;
  if (enforce) {
    const a = admin();
    if (!a) return deny("Usage limits are enabled but Supabase is not configured.", 500);
    const user = await userFromRequest(req);
    if (!user) return deny("Sign in to use this feature.", 401);
    who = userId = user.id;
    const { data, error } = await a.rpc("consume_ai_call", {
      p_uid: user.id,
      p_day: new Date().toISOString().slice(0, 10),
      p_limit: DAILY_AI_CALLS,
    });
    if (error) {
      console.error(error);
      return deny("Could not check your allowance.", 500);
    }
    if (!data) return deny("You've reached today's practice limit. Try again tomorrow.", 429);
    if (perDay && !(await rateLimit(`day:${name}:${who}`, perDay, DAY_MS))) {
      return deny("You've reached today's limit for this feature. Try again tomorrow.", 429);
    }
  }
  if (!(await rateLimit(`${name}:${who}`, perMinute))) return deny("Too many requests, slow down.", 429);
  return { ok: true, userId };
}
