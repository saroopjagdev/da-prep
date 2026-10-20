import { cleanCampaign, isFunnelEvent, isSource } from "@/lib/funnel";
import { rateLimit } from "@/lib/rateLimit";
import { admin } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/guard";

/**
 * Adds one to today's count for a named funnel step (lib/funnel.ts), split by a coarse source label from a fixed list.
 * It stores a date, an event name, a source and a number: no user, no IP, no cookie. The IP is only used, in memory
 * and for a minute, to rate-limit this endpoint. Always answers 204 so a counting problem never shows up on the page.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { event?: unknown; source?: unknown; campaign?: unknown } | null;
  if (!isFunnelEvent(body?.event)) return new Response(null, { status: 400 });
  if (!(await rateLimit(`event:${clientIp(req)}`, 60))) return new Response(null, { status: 429 });
  // Anything not on the list is counted as "other", so a bad or missing source never loses the count.
  const source = isSource(body.source) ? body.source : "other";

  const campaign = cleanCampaign(body.campaign);
  const day = new Date().toISOString().slice(0, 10);

  const a = admin();
  if (a) {
    let { error } = await a.rpc("bump_funnel", { p_day: day, p_event: body.event, p_source: source, p_campaign: campaign });
    // Until the campaign migration is applied the four-argument function does not exist; count without the campaign.
    if (error) ({ error } = await a.rpc("bump_funnel", { p_day: day, p_event: body.event, p_source: source }));
    if (error) console.error("funnel count failed", error.message);
  }
  return new Response(null, { status: 204 });
}
