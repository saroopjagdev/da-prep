import { FREE_INTERVIEWS, FREE_PRACTICE_PER_WEEK, FREE_REVIEWS } from "@/lib/plans";
import { admin, userFromRequest } from "@/lib/server/auth";
import { limitsEnforced } from "@/lib/server/guard";
import { isoWeek } from "@/lib/server/usage";

/**
 * What the signed-in person has left of the free allowances, for the dashboard. Read-only: it never counts a use.
 * Pro has no fixed free allowance (it runs on fair-use limits), so it returns the plan only.
 */
export async function GET(req: Request) {
  if (!limitsEnforced()) return Response.json({ plan: "free", enforced: false });
  const a = admin();
  const user = await userFromRequest(req);
  if (!a || !user) return Response.json({ error: "Sign in to see your allowance." }, { status: 401 });

  const [{ data: profile }, { data: week }] = await Promise.all([
    a.from("profiles").select("plan, trial_used, trial_ends_at, stripe_customer_id").eq("id", user.id).maybeSingle(),
    a.from("usage").select("interviews, reviews, practice").eq("user_id", user.id).eq("period", isoWeek()).maybeSingle(),
  ]);
  if (profile?.plan === "pro") {
    // On the free trial of Pro: say when it ends so the app can show a countdown. A trial cannot be started again.
    const ends = profile.trial_ends_at && Date.parse(profile.trial_ends_at) > Date.now() ? profile.trial_ends_at : null;
    return Response.json(ends ? { plan: "pro", enforced: true, trial: { eligible: false, used: true, endsAt: ends } } : { plan: "pro", enforced: true });
  }
  return Response.json({
    plan: "free",
    enforced: true,
    interviews: { used: week?.interviews ?? 0, limit: FREE_INTERVIEWS },
    reviews: { used: week?.reviews ?? 0, limit: FREE_REVIEWS },
    practice: { used: week?.practice ?? 0, limit: FREE_PRACTICE_PER_WEEK },
    // Eligible for the free trial of Pro: never had one and never subscribed (the checkout re-checks this with Stripe).
    trial: { eligible: !profile?.trial_used && !profile?.stripe_customer_id, used: Boolean(profile?.trial_used) },
  });
}
