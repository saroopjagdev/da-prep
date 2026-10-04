import { isFunnelEvent } from "@/lib/funnel";
import { rateLimit } from "@/lib/rateLimit";
import { admin } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/guard";

/**
 * Adds one to today's count for a named funnel step (lib/funnel.ts). It stores a date, an event name and a number: no
 * user, no IP, no cookie. The IP is only used, in memory and for a minute, to rate-limit this endpoint. Always answers
 * 204 so a counting problem never shows up on the page.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { event?: unknown } | null;
  if (!isFunnelEvent(body?.event)) return new Response(null, { status: 400 });
  if (!(await rateLimit(`event:${clientIp(req)}`, 60))) return new Response(null, { status: 429 });

  const a = admin();
  if (a) {
    const { error } = await a.rpc("bump_funnel", { p_day: new Date().toISOString().slice(0, 10), p_event: body.event });
    if (error) console.error("funnel count failed", error.message);
  }
  return new Response(null, { status: 204 });
}
