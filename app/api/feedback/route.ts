import { MAX_PER_USER, feedbackInput } from "@/lib/feedback";
import { rateLimit } from "@/lib/rateLimit";
import { admin, userFromRequest } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/guard";
import { screenText } from "@/lib/server/safety";

/**
 * Feedback from a signed-in member. Everyone can send it whatever they think of Level6: the rating is stored but never
 * decides what happens next. Nothing is shown publicly from here; an admin chooses comments separately, and only ones
 * whose author ticked the permission.
 */
export async function POST(req: Request) {
  const db = admin();
  if (!db) return Response.json({ error: "Feedback is not switched on." }, { status: 503 });
  if (!(await rateLimit(`feedback:${clientIp(req)}`, 20, 60_000))) return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  const user = await userFromRequest(req);
  if (!user) return Response.json({ error: "Sign in to send feedback." }, { status: 401 });
  if (!(await rateLimit(`feedback-user:${user.id}`, 5, 3_600_000))) return Response.json({ error: "You have sent a few already. Please try again later." }, { status: 429 });

  const parsed = feedbackInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Please check what you wrote." }, { status: 400 });
  const { rating, message, mayQuote, displayName } = parsed.data;

  const blocked = await screenText(message, displayName);
  if (blocked) return blocked;

  const { count } = await db.from("feedback").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  if ((count ?? 0) >= MAX_PER_USER) return Response.json({ error: "You have sent all the feedback we can take from one account. Thank you." }, { status: 409 });

  const { error } = await db.from("feedback").insert({
    user_id: user.id,
    rating: rating ?? null,
    message,
    may_quote: mayQuote,
    display_name: mayQuote ? displayName : null,
  });
  if (error) return Response.json({ error: "Could not save that. Please try again." }, { status: 500 });
  return Response.json({ ok: true });
}
