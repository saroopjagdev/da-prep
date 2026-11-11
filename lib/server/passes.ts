import { admin } from "@/lib/server/auth";

/**
 * Ends Season Passes that have run out: any Pro account with a pro_until in the past goes back to free. Monthly
 * subscribers have no pro_until, so they are never touched. Safe to run again. Called by the daily job, so it never
 * throws: a problem here must not stop the deadline emails that run alongside it.
 */
export async function expirePasses(now = new Date()): Promise<{ expired: number; error?: string }> {
  try {
    const a = admin();
    if (!a) return { expired: 0 };
    const { data, error } = await a.from("profiles").update({ plan: "free", pro_until: null }).eq("plan", "pro").lt("pro_until", now.toISOString()).select("id");
    if (error) {
      console.error("expire passes failed", error.message);
      return { expired: 0, error: error.message };
    }
    return { expired: data?.length ?? 0 };
  } catch (e) {
    console.error("expire passes failed", (e as Error)?.message);
    return { expired: 0, error: (e as Error)?.message ?? "failed" };
  }
}
