import { BONUS_EXTRA, FREE_INTERVIEWS, FREE_PERIOD, FREE_PRACTICE, FREE_REVIEWS, bonusSteps, bonusUnlocked, withBonus } from "@/lib/plans";
import { admin, userFromRequest } from "@/lib/server/auth";
import { limitsEnforced } from "@/lib/server/guard";

/**
 * What the signed-in person has left of the free allowances, for the dashboard. Read-only: it never counts a use.
 * Limits already include the engagement reward once it is unlocked; `bonus` says how far along the three steps are.
 * Pro has no fixed free allowance (it runs on fair-use limits), so it returns the plan only.
 */
export async function GET(req: Request) {
  if (!limitsEnforced()) return Response.json({ plan: "free", enforced: false });
  const a = admin();
  const user = await userFromRequest(req);
  if (!a || !user) return Response.json({ error: "Sign in to see your allowance." }, { status: 401 });

  const [{ data: profile }, { data: counts }] = await Promise.all([
    a.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    a.from("usage").select("interviews, reviews, practice, applied").eq("user_id", user.id).eq("period", FREE_PERIOD).maybeSingle(),
  ]);
  if (profile?.plan === "pro") return Response.json({ plan: "pro", enforced: true });
  return Response.json({
    plan: "free",
    enforced: true,
    interviews: { used: counts?.interviews ?? 0, limit: withBonus(FREE_INTERVIEWS, counts) },
    reviews: { used: counts?.reviews ?? 0, limit: withBonus(FREE_REVIEWS, counts) },
    practice: { used: counts?.practice ?? 0, limit: withBonus(FREE_PRACTICE, counts) },
    bonus: { unlocked: bonusUnlocked(counts), extra: BONUS_EXTRA, steps: bonusSteps(counts) },
  });
}
