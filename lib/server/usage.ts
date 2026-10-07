import { admin, userFromRequest } from "@/lib/server/auth";
import { FREE_INTERVIEWS, FREE_MOCK_PROCESSES, FREE_PRACTICE_PER_WEEK, FREE_REVIEWS } from "@/lib/plans";
import { isoWeek } from "@/lib/week";
import { limitsEnforced } from "@/lib/server/guard";

export { FREE_INTERVIEWS, FREE_REVIEWS, isoWeek };

type Result = { ok: true } | { ok: false; status: number; error: string };

/** Count one use against a free allowance. Only enforced when limits are enforced (see limitsEnforced); otherwise always allowed. */
async function consume(
  req: Request,
  rpc: "consume_interview" | "consume_review" | "consume_practice",
  period: string,
  limit: number,
  signIn: string,
  used: string,
): Promise<Result> {
  if (!limitsEnforced()) return { ok: true };
  const a = admin();
  if (!a) return { ok: false, status: 500, error: "Usage limits are enabled but Supabase is not configured." };
  const user = await userFromRequest(req);
  if (!user) return { ok: false, status: 401, error: signIn };
  const { data, error } = await a.rpc(rpc, { p_uid: user.id, p_period: period, p_limit: limit });
  if (error) {
    console.error(error);
    return { ok: false, status: 500, error: "Could not check your allowance." };
  }
  if (!data) return { ok: false, status: 402, error: used };
  return { ok: true };
}

/** Count one AI mock interview against the caller's weekly free allowance. */
export const consumeInterview = (req: Request) =>
  consume(
    req,
    "consume_interview",
    isoWeek(),
    FREE_INTERVIEWS,
    "Sign in to start an interview.",
    `You've used your ${FREE_INTERVIEWS} free mock interview this week. It resets on Monday, or upgrade to Pro for unlimited mock interviews (fair-use limits apply).`,
  );

/** Count one whole firm mock process against the caller's weekly free allowance (none: mock processes are part of Pro). */
export const consumeMockProcess = (req: Request) =>
  consume(
    req,
    "consume_interview",
    isoWeek(),
    FREE_MOCK_PROCESSES,
    "Sign in to run a mock process.",
    "Firm mock processes are part of Pro (£9.99 a month). Upgrade to run one. A free mock interview is included each week.",
  );

/** Count one practice test against the caller's weekly free allowance. */
export const consumePractice = (req: Request) =>
  consume(
    req,
    "consume_practice",
    isoWeek(),
    FREE_PRACTICE_PER_WEEK,
    "Create a free account to take practice tests.",
    `You've used your ${FREE_PRACTICE_PER_WEEK} free practice tests this week. They reset on Monday, or upgrade to Pro for unlimited practice.`,
  );

/** Count one statement or answer review against the caller's weekly free allowance. */
export const consumeReview = (req: Request) =>
  consume(
    req,
    "consume_review",
    isoWeek(),
    FREE_REVIEWS,
    "Sign in to get a review.",
    `You've used your ${FREE_REVIEWS} free reviews this week. They reset on Monday, or upgrade to Pro for more (fair-use limits apply).`,
  );
