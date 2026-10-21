import { NUDGE_KIND, buildNudgeEmail } from "@/lib/nudges";
import { ADMIN_EMAILS } from "@/lib/server/admin-access";
import { sendWithResend, type SendFn } from "@/lib/server/alerts";
import { admin } from "@/lib/server/auth";

/** Safety cap on one run, so a bug cannot send to everyone at once. */
export const MAX_NUDGES_PER_RUN = 20;
/** Accounts between these ages (in days) are eligible: old enough to have had a chance, recent enough to still care. */
export const NUDGE_MIN_DAYS = 2;
export const NUDGE_MAX_DAYS = 14;

export type NudgeResult = { skipped?: string; eligible: number; sent: number; failed: number };

/**
 * Sends the one "first steps" email to accounts that have used nothing yet. Does nothing unless NUDGES_ENABLED is
 * "true", so deploying this never emails anyone. Safe to run again: each account is logged once it has been sent.
 */
export async function runNudges(send: SendFn = sendWithResend): Promise<NudgeResult> {
  const none = { eligible: 0, sent: 0, failed: 0 };
  if (process.env.NUDGES_ENABLED !== "true") return { skipped: "NUDGES_ENABLED is not true", ...none };
  const a = admin();
  if (!a) return { skipped: "Supabase is not configured", ...none };
  if (!process.env.RESEND_API_KEY) return { skipped: "RESEND_API_KEY is not set", ...none };

  const { data, error } = await a.rpc("nudge_candidates", { p_kind: NUDGE_KIND, p_min_days: NUDGE_MIN_DAYS, p_max_days: NUDGE_MAX_DAYS, p_exclude: [...ADMIN_EMAILS] });
  if (error) return { skipped: `nudge_candidates: ${error.message}`, ...none };
  const people = (data ?? []) as { user_id: string; email: string }[];

  let sent = 0;
  let failed = 0;
  for (const p of people.slice(0, MAX_NUDGES_PER_RUN)) {
    await a.from("alert_prefs").upsert({ user_id: p.user_id }, { onConflict: "user_id", ignoreDuplicates: true });
    const { data: pref } = await a.from("alert_prefs").select("token").eq("user_id", p.user_id).maybeSingle();
    if (!pref?.token) {
      failed++;
      continue;
    }
    if (await send(p.email, buildNudgeEmail(pref.token))) {
      sent++;
      const { error: logError } = await a.from("nudge_sent").upsert({ user_id: p.user_id, kind: NUDGE_KIND }, { onConflict: "user_id,kind", ignoreDuplicates: true });
      if (logError) console.error("nudge log failed", logError.message);
    } else {
      failed++;
    }
  }
  return { eligible: people.length, sent, failed };
}
