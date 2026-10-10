import { admin, userFromRequest } from "@/lib/server/auth";
import { BONUS_EXTRA, FREE_INTERVIEWS, FREE_MOCK_PROCESSES, FREE_PERIOD, FREE_PRACTICE, FREE_REVIEWS, withBonus } from "@/lib/plans";
import { limitsEnforced } from "@/lib/server/guard";

export { FREE_INTERVIEWS, FREE_REVIEWS };

const UNLOCK_HINT = `Apply to an employer through the tracker, and do a mock interview and a practice test, to unlock ${BONUS_EXTRA} more of each.`;

type Result = { ok: true } | { ok: false; status: number; error: string };

/** Count one use against a free allowance. Only enforced when limits are enforced (see limitsEnforced); otherwise always allowed. */
async function consume(
  req: Request,
  rpc: "consume_interview" | "consume_review" | "consume_practice",
  period: string,
  base: number,
  signIn: string,
  used: string,
  /** Whether the engagement reward adds to this allowance (not for whole mock processes, which stay Pro). */
  bonus = true,
): Promise<Result> {
  if (!limitsEnforced()) return { ok: true };
  const a = admin();
  if (!a) return { ok: false, status: 500, error: "Usage limits are enabled but Supabase is not configured." };
  const user = await userFromRequest(req);
  if (!user) return { ok: false, status: 401, error: signIn };
  let limit = base;
  if (bonus) {
    const { data: counts } = await a.from("usage").select("interviews, practice, applied").eq("user_id", user.id).eq("period", period).maybeSingle();
    limit = withBonus(base, counts);
  }
  const { data, error } = await a.rpc(rpc, { p_uid: user.id, p_period: period, p_limit: limit });
  if (error) {
    console.error(error);
    return { ok: false, status: 500, error: "Could not check your allowance." };
  }
  if (!data) return { ok: false, status: 402, error: used };
  return { ok: true };
}

/** Count one AI mock interview against the caller's free allowance. */
export const consumeInterview = (req: Request) =>
  consume(
    req,
    "consume_interview",
    FREE_PERIOD,
    FREE_INTERVIEWS,
    "Sign in to start an interview.",
    `You've used your free mock interview${FREE_INTERVIEWS === 1 ? "" : "s"}. ${UNLOCK_HINT} Or upgrade to Pro for more mock interviews (fair-use limits apply).`,
  );

/** Count one whole firm mock process against the caller's free allowance (none: mock processes are part of Pro). */
export const consumeMockProcess = (req: Request) =>
  consume(
    req,
    "consume_interview",
    FREE_PERIOD,
    FREE_MOCK_PROCESSES,
    "Sign in to run a mock process.",
    "Firm mock processes are part of Pro (£9.99 a month). Upgrade to run one.",
    false,
  );

/** Count one practice test against the caller's free allowance. */
export const consumePractice = (req: Request) =>
  consume(
    req,
    "consume_practice",
    FREE_PERIOD,
    FREE_PRACTICE,
    "Create a free account to take practice tests.",
    `You've used your free practice test${FREE_PRACTICE === 1 ? "" : "s"}. ${UNLOCK_HINT} Or upgrade to Pro for unlimited practice.`,
  );

/** Count one statement or answer review against the caller's free allowance. */
export const consumeReview = (req: Request) =>
  consume(
    req,
    "consume_review",
    FREE_PERIOD,
    FREE_REVIEWS,
    "Sign in to get a review.",
    `You've used your free review${FREE_REVIEWS === 1 ? "" : "s"}. ${UNLOCK_HINT} Or upgrade to Pro for more (fair-use limits apply).`,
  );

/**
 * Record that this account followed an Apply link in the tracker (one of the three steps of the engagement reward).
 * Stored on the lifetime usage row. When limits are not enforced there is nothing to record.
 */
export async function markApplied(req: Request): Promise<Result> {
  if (!limitsEnforced()) return { ok: true };
  const a = admin();
  if (!a) return { ok: false, status: 500, error: "Usage limits are enabled but Supabase is not configured." };
  const user = await userFromRequest(req);
  if (!user) return { ok: false, status: 401, error: "Sign in to track applications." };
  const { error } = await a.from("usage").upsert({ user_id: user.id, period: FREE_PERIOD, applied: true }, { onConflict: "user_id,period" });
  if (error) {
    console.error(error);
    return { ok: false, status: 500, error: "Could not save that." };
  }
  return { ok: true };
}
