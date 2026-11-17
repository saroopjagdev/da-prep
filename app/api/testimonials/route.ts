import { publicComments } from "@/lib/feedback";
import { admin } from "@/lib/server/auth";

/**
 * The comments chosen to be shown on the site. Public, cached for a few minutes, and it returns only the words and the
 * name the person chose: never an account id, rating, email or date. An empty list means nothing is shown.
 */
export async function GET() {
  const db = admin();
  const empty = () => Response.json({ comments: [] }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  if (!db) return empty();
  const { data, error } = await db
    .from("feedback")
    .select("id,message,display_name,may_quote,featured")
    .eq("featured", true)
    .eq("may_quote", true)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return empty();
  return Response.json({ comments: publicComments(data ?? []) }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
