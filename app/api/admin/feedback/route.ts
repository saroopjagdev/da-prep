import { adminFromRequest } from "@/lib/server/admin-access";
import { admin } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/** All feedback, newest first, for choosing comments to show. Admins only; anyone else gets a 404. No account ids or emails. */
export async function GET(req: Request) {
  if (!(await adminFromRequest(req))) return new Response(null, { status: 404 });
  const db = admin();
  if (!db) return Response.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data, error } = await db.from("feedback").select("id,created_at,rating,message,may_quote,display_name,featured").order("created_at", { ascending: false }).limit(300);
  if (error) return Response.json({ error: "Could not load feedback." }, { status: 500 });
  return Response.json({ feedback: data ?? [] });
}

/** Choose a comment for the site, or take it down again. Only comments whose author gave permission and a name can be chosen. */
export async function POST(req: Request) {
  if (!(await adminFromRequest(req))) return new Response(null, { status: 404 });
  const db = admin();
  if (!db) return Response.json({ error: "Supabase is not configured." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { id?: unknown; featured?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.featured !== "boolean") return Response.json({ error: "Say which comment and whether to show it." }, { status: 400 });

  let q = db.from("feedback").update({ featured: body.featured }).eq("id", body.id);
  if (body.featured) q = q.eq("may_quote", true).not("display_name", "is", null);
  const { data, error } = await q.select("id");
  if (error) return Response.json({ error: "Could not save that." }, { status: 500 });
  if (!data?.length) return Response.json({ error: "That comment cannot be shown: the author did not give permission." }, { status: 409 });
  return Response.json({ ok: true });
}
