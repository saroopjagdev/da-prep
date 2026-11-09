import { cleanCampaign, type FunnelEvent, type ServerFunnelEvent } from "@/lib/funnel";
import { admin } from "@/lib/server/auth";

/**
 * Add one to today's anonymous count for a step (the same daily counters the browser feeds), from the server. `label` is a
 * short reason, kept in the campaign column. Never throws and never holds up a response for long: a counting problem must
 * not stop someone paying. The source is "other" because no visitor is involved.
 */
export async function countServer(event: FunnelEvent | ServerFunnelEvent, label = ""): Promise<void> {
  try {
    const a = admin();
    if (!a) return;
    const { error } = await a.rpc("bump_funnel", { p_day: new Date().toISOString().slice(0, 10), p_event: event, p_source: "other", p_campaign: cleanCampaign(label) });
    if (error) console.error("funnel count failed", error.message);
  } catch (e) {
    console.error("funnel count failed", (e as Error)?.message);
  }
}
