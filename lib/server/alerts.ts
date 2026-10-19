import { buildEmail, dueAlerts, type Email, type Sent, type Sub } from "@/lib/alerts";
import { opportunityRows } from "@/lib/opportunities";
import { admin } from "@/lib/server/auth";

/** Sender and reply address. Any address at level6.uk works once the domain is verified in Resend. */
export const ALERT_FROM = "Level6 <alerts@level6.uk>";
/** Safety cap on one run, below Resend's free daily limit, so a bug cannot burn the allowance. */
export const MAX_EMAILS_PER_RUN = 80;

export type SendFn = (to: string, email: Email) => Promise<boolean>;

/** Sends one email through Resend. Never throws: a failure is logged and reported as false. */
export const sendWithResend: SendFn = async (to, email) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const reply = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: ALERT_FROM, to: [to], ...(reply ? { reply_to: reply } : {}), subject: email.subject, text: email.text, html: email.html, headers: email.headers }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) console.error("alert email failed", res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (e) {
    console.error("alert email failed", (e as Error).message);
    return false;
  }
};

/** Every row of a table, 1,000 at a time (the API returns at most that many per request). */
async function all<T>(table: string, columns: string): Promise<T[]> {
  const a = admin()!;
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await a.from(table).select(columns).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) return out;
  }
}

export type RunResult = { skipped?: string; due: number; sent: number; failed: number };

/**
 * The daily job: email each person the news due for the employers they follow, and log it so it is never sent twice.
 * Safe to run again at any time: whatever was already sent is skipped.
 */
export async function runAlerts(now = new Date(), send: SendFn = sendWithResend): Promise<RunResult> {
  const a = admin();
  if (!a) return { skipped: "Supabase is not configured", due: 0, sent: 0, failed: 0 };
  if (!process.env.RESEND_API_KEY) return { skipped: "RESEND_API_KEY is not set", due: 0, sent: 0, failed: 0 };

  const [subs, sent] = await Promise.all([all<Sub>("alert_subscriptions", "user_id, employer_key"), all<Sent>("alert_sent", "user_id, event_key")]);
  const due = dueAlerts(opportunityRows(now), subs, sent, now);

  let ok = 0, failed = 0;
  for (const [userId, alerts] of due) {
    if (ok + failed >= MAX_EMAILS_PER_RUN) break;
    const { data: u } = await a.auth.admin.getUserById(userId);
    const to = u.user?.email;
    if (!to || !u.user?.email_confirmed_at) continue;

    await a.from("alert_prefs").upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
    const { data: pref } = await a.from("alert_prefs").select("token").eq("user_id", userId).maybeSingle();
    if (!pref?.token) {
      failed++;
      continue;
    }

    if (await send(to, buildEmail(alerts, pref.token))) {
      ok++;
      const rows = [...new Set(alerts.flatMap((x) => x.mark))].map((event_key) => ({ user_id: userId, event_key }));
      const { error } = await a.from("alert_sent").upsert(rows, { onConflict: "user_id,event_key", ignoreDuplicates: true });
      if (error) console.error("alert log failed", error.message);
    } else {
      failed++;
    }
  }
  return { due: due.size, sent: ok, failed };
}
