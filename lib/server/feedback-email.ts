import { FEEDBACK_ASK_KIND, buildFeedbackEmail } from "@/lib/feedback-email";
import { ADMIN_EMAILS } from "@/lib/server/admin-access";
import { sendWithResend, type SendFn } from "@/lib/server/alerts";
import { admin } from "@/lib/server/auth";

/** Safety cap on one run, so a bug cannot send to everyone at once. */
export const MAX_FEEDBACK_ASKS_PER_RUN = 20;
/** Accounts between these ages (in days) are eligible: used it for a while, but not so long ago that it feels random. */
export const FEEDBACK_MIN_DAYS = 7;
export const FEEDBACK_MAX_DAYS = 30;

export type FeedbackAskResult = { skipped?: string; eligible: number; sent: number; failed: number };

/**
 * Sends the one "how is Level6 going?" email to accounts that have used something and never sent feedback. Does nothing
 * unless FEEDBACK_EMAILS_ENABLED is "true", so deploying this never emails anyone. Safe to run again: each account is
 * logged once it has been sent, and it shares the unsubscribe link (and so the stop) of the other emails.
 */
export async function runFeedbackAsks(send: SendFn = sendWithResend): Promise<FeedbackAskResult> {
  const none = { eligible: 0, sent: 0, failed: 0 };
  if (process.env.FEEDBACK_EMAILS_ENABLED !== "true") return { skipped: "FEEDBACK_EMAILS_ENABLED is not true", ...none };
  const a = admin();
  if (!a) return { skipped: "Supabase is not configured", ...none };
  if (!process.env.RESEND_API_KEY) return { skipped: "RESEND_API_KEY is not set", ...none };

  const { data, error } = await a.rpc("feedback_ask_candidates", { p_kind: FEEDBACK_ASK_KIND, p_min_days: FEEDBACK_MIN_DAYS, p_max_days: FEEDBACK_MAX_DAYS, p_exclude: [...ADMIN_EMAILS] });
  if (error) return { skipped: `feedback_ask_candidates: ${error.message}`, ...none };
  const people = (data ?? []) as { user_id: string; email: string }[];

  let sent = 0;
  let failed = 0;
  for (const p of people.slice(0, MAX_FEEDBACK_ASKS_PER_RUN)) {
    await a.from("alert_prefs").upsert({ user_id: p.user_id }, { onConflict: "user_id", ignoreDuplicates: true });
    const { data: pref } = await a.from("alert_prefs").select("token").eq("user_id", p.user_id).maybeSingle();
    if (!pref?.token) {
      failed++;
      continue;
    }
    if (await send(p.email, buildFeedbackEmail(pref.token))) {
      sent++;
      const { error: logError } = await a.from("nudge_sent").upsert({ user_id: p.user_id, kind: FEEDBACK_ASK_KIND }, { onConflict: "user_id,kind", ignoreDuplicates: true });
      if (logError) console.error("feedback ask log failed", logError.message);
    } else {
      failed++;
    }
  }
  return { eligible: people.length, sent, failed };
}
