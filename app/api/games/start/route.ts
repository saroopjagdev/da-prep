import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/server/guard";
import { consumeGame } from "@/lib/server/usage";

/**
 * Counts one practice game round against the signed-in person's free allowance (Pro is not counted). Called when a
 * round is started or replayed. Nothing here spends AI money; it keeps the count on the account, so clearing site data
 * does not reset it.
 */
export async function POST(req: Request) {
  if (!(await rateLimit(`games:${clientIp(req)}`, 30, 60_000))) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  const r = await consumeGame(req);
  if (!r.ok) return Response.json({ error: r.error }, { status: r.status });
  return Response.json({ ok: true });
}
