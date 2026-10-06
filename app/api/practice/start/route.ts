import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/server/guard";
import { consumePractice } from "@/lib/server/usage";

/**
 * Counts one practice test against the signed-in person's free weekly allowance (Pro is not counted). Called when a
 * test is started. Nothing here spends AI money; it only keeps the weekly count on the account, so clearing site data
 * does not reset it.
 */
export async function POST(req: Request) {
  if (!(await rateLimit(`practice:${clientIp(req)}`, 30, 60_000))) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  const r = await consumePractice(req);
  if (!r.ok) return Response.json({ error: r.error }, { status: r.status });
  return Response.json({ ok: true });
}
