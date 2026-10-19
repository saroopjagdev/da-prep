import { ALERT_CYCLE, MAX_FOLLOWED, alertKey } from "@/lib/alerts";
import { opportunityRows } from "@/lib/opportunities";
import { rateLimit } from "@/lib/rateLimit";
import { admin, userFromRequest } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/guard";

/**
 * The employers the signed-in person follows for deadline emails (GET), and following or unfollowing one (POST). The
 * employer must be one in the tracker, and the name is taken from there, never from the request.
 */
async function who(req: Request) {
  const a = admin();
  const user = await userFromRequest(req);
  if (!a || !user) return null;
  return { a, user };
}

export async function GET(req: Request) {
  const w = await who(req);
  if (!w) return Response.json({ error: "Sign in to follow employers." }, { status: 401 });
  const { data, error } = await w.a.from("alert_subscriptions").select("employer_key").eq("user_id", w.user.id);
  if (error) return Response.json({ error: "Could not load your alerts." }, { status: 500 });
  return Response.json({ keys: (data ?? []).map((r) => r.employer_key as string) });
}

export async function POST(req: Request) {
  if (!admin()) return Response.json({ error: "Alerts are not switched on." }, { status: 503 });
  if (!(await rateLimit(`alerts:${clientIp(req)}`, 60, 60_000))) return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  const w = await who(req);
  if (!w) return Response.json({ error: "Sign in to follow employers." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { key?: unknown; on?: unknown } | null;
  if (typeof body?.key !== "string" || typeof body.on !== "boolean") return Response.json({ error: "Say which employer and whether to follow it." }, { status: 400 });

  if (!body.on) {
    const { error } = await w.a.from("alert_subscriptions").delete().eq("user_id", w.user.id).eq("employer_key", body.key);
    if (error) return Response.json({ error: "Could not save that." }, { status: 500 });
    return Response.json({ ok: true });
  }

  const row = opportunityRows(new Date()).find((r) => alertKey(r) === body.key);
  if (!row) return Response.json({ error: "We do not have that employer in the tracker." }, { status: 404 });

  const { count } = await w.a.from("alert_subscriptions").select("employer_key", { count: "exact", head: true }).eq("user_id", w.user.id);
  if ((count ?? 0) >= MAX_FOLLOWED) return Response.json({ error: `You can follow up to ${MAX_FOLLOWED} employers.` }, { status: 409 });

  const { error } = await w.a.from("alert_subscriptions").upsert({ user_id: w.user.id, employer_key: body.key, employer_name: row.name }, { onConflict: "user_id,employer_key" });
  if (error) return Response.json({ error: "Could not save that." }, { status: 500 });

  // Someone following an employer that is already open should hear when it is closing, not be told it is open.
  if (row.status === "open") {
    await w.a.from("alert_sent").upsert({ user_id: w.user.id, event_key: `${ALERT_CYCLE}:open:${body.key}` }, { onConflict: "user_id,event_key", ignoreDuplicates: true });
  }
  return Response.json({ ok: true });
}
