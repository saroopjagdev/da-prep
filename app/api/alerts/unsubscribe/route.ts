import { rateLimit } from "@/lib/rateLimit";
import { admin } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/guard";

/**
 * Stops every deadline email for the person the private token in the email's link belongs to. It is a POST on purpose:
 * mail scanners follow links in emails, and following a link must never unsubscribe anyone. The unsubscribe page posts
 * here when the person presses its button, and mail apps post here for the one-click List-Unsubscribe header.
 */
export async function POST(req: Request) {
  if (!(await rateLimit(`unsub:${clientIp(req)}`, 20, 60_000))) return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return Response.json({ error: "That link is not valid." }, { status: 400 });

  const a = admin();
  if (!a) return Response.json({ error: "Alerts are not switched on." }, { status: 503 });
  const { data: pref } = await a.from("alert_prefs").select("user_id").eq("token", token).maybeSingle();
  if (!pref) return Response.json({ error: "That link is not valid." }, { status: 404 });

  const { error } = await a.from("alert_subscriptions").delete().eq("user_id", pref.user_id);
  if (error) return Response.json({ error: "Could not unsubscribe you. Please try again." }, { status: 500 });
  // Also stops the one-off first-steps email. Ignored if that column is not there yet: the deadline emails are already off.
  await a.from("alert_prefs").update({ nudges_off: true }).eq("user_id", pref.user_id);
  return Response.json({ ok: true });
}
