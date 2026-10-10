import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/server/guard";
import { markApplied } from "@/lib/server/usage";

/**
 * The signed-in person followed an Apply link in the tracker. This is one of the three steps of the engagement reward
 * (see BONUS_EXTRA in lib/plans.ts). It costs nothing and only sets a flag on the account, once.
 */
export async function POST(req: Request) {
  if (!(await rateLimit(`applied:${clientIp(req)}`, 30, 60_000))) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  const r = await markApplied(req);
  if (!r.ok) return Response.json({ error: r.error }, { status: r.status });
  return Response.json({ ok: true });
}
