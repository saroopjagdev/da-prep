// Deadline email alerts: which news is due for whom, and the email that carries it. Pure logic, no network. The sending
// and the database sit in lib/server/alerts.ts. Safe for client and server (the tracker uses alertKey).
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import type { OpportunityRow } from "@/lib/opportunities";
import { SITE_URL } from "@/lib/site";

/** The intake the alerts are about. Part of every "already sent" key, so next year's cycle sends afresh. */
export const ALERT_CYCLE = "2027";
/** "Closing soon" means this many days or fewer to go. */
export const CLOSING_SOON_DAYS = 7;
/** The most employers one person can follow. */
export const MAX_FOLLOWED = 60;

/** A stable id for an employer row: its guide slug when it has one, otherwise its name reduced to letters and digits. */
export const alertKey = (r: Pick<OpportunityRow, "slug" | "name">) => r.slug ?? r.name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");

export type Alert = {
  kind: "open" | "closing";
  key: string;
  name: string;
  slug?: string;
  applyUrl?: string;
  closes?: string;
  days?: number;
  /** Logged as sent once the email goes. Includes the "open" key when a closing-soon notice makes it redundant. */
  mark: string[];
};

export type Sub = { user_id: string; employer_key: string };
export type Sent = { user_id: string; event_key: string };

const DAY = 86_400_000;

/** Whole days from `today` (UTC) to a YYYY-MM-DD date. Negative once it has passed. */
export function daysUntil(iso: string, today: Date): number {
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - t) / DAY);
}

/**
 * The news due for each person who follows employers. An employer that is open gives one "now open" notice and, in the
 * last week before a known closing date, one "closing soon" notice, each once per cycle. When both are due at once only
 * the closing notice is sent. Employers that are not open give nothing, and neither do rolling ones past "open".
 */
export function dueAlerts(rows: OpportunityRow[], subs: Sub[], sent: Sent[], today: Date): Map<string, Alert[]> {
  const byKey = new Map(rows.map((r) => [alertKey(r), r]));
  const done = new Set(sent.map((s) => `${s.user_id}|${s.event_key}`));
  const out = new Map<string, Alert[]>();
  const push = (user: string, a: Alert) => out.set(user, [...(out.get(user) ?? []), a]);

  for (const s of subs) {
    const r = byKey.get(s.employer_key);
    if (!r || r.status !== "open") continue;
    const openKey = `${ALERT_CYCLE}:open:${s.employer_key}`;
    const closeKey = `${ALERT_CYCLE}:closing:${s.employer_key}`;
    const base = { key: s.employer_key, name: r.name, slug: r.slug, applyUrl: r.applyUrl ?? r.vacancyUrl, closes: r.closes || undefined };

    const days = r.closesIso && !r.rolling ? daysUntil(r.closesIso, today) : null;
    if (days !== null && days >= 0 && days <= CLOSING_SOON_DAYS && !done.has(`${s.user_id}|${closeKey}`)) {
      push(s.user_id, { ...base, kind: "closing", days, mark: [closeKey, openKey] });
    } else if (!done.has(`${s.user_id}|${openKey}`)) {
      push(s.user_id, { ...base, kind: "open", mark: [openKey] });
    }
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type Email = { subject: string; text: string; html: string; headers: Record<string, string> };

const line = (a: Alert) =>
  a.kind === "open"
    ? `${a.name} is now open for applications${a.closes ? `. It closes ${a.closes}` : ""}.`
    : `${a.name} closes ${a.days === 0 ? "today" : a.days === 1 ? "tomorrow" : `in ${a.days} days`}${a.closes ? ` (${a.closes})` : ""}.`;

/** The email for one person: all their news in one message, with a one-click way to stop. */
export function buildEmail(alerts: Alert[], unsubscribeToken: string, site = SITE_URL): Email {
  const unsub = `${site}/unsubscribe?t=${unsubscribeToken}`;
  const oneClick = `${site}/api/alerts/unsubscribe?t=${unsubscribeToken}`;
  const subject =
    alerts.length === 1 ? (alerts[0].kind === "open" ? `${alerts[0].name} is now open for applications` : line(alerts[0]).replace(/\.$/, "")) : `${alerts.length} updates on employers you follow`;

  const guide = (a: Alert) => (a.slug ? `${site}/employers/${a.slug}` : `${site}/opportunities`);
  const text = [
    ...alerts.flatMap((a) => [line(a), `  Our guide: ${guide(a)}`, ...(a.applyUrl ? [`  Apply on their site: ${a.applyUrl}`] : []), ""]),
    "Dates can change, so check the employer's own page before you apply.",
    "",
    `You are getting this because you chose to follow these employers on Level6. Stop all alerts with one click: ${unsub}`,
    `${OPERATOR_NAME}${CONTACT_EMAIL ? `, ${CONTACT_EMAIL}` : ""}`,
  ].join("\n");

  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:34rem;color:#14213d;line-height:1.5">
${alerts
  .map(
    (a) => `<p style="margin:0 0 4px"><strong>${esc(line(a))}</strong></p>
<p style="margin:0 0 16px"><a href="${esc(guide(a))}">Our guide</a>${a.applyUrl ? ` &middot; <a href="${esc(a.applyUrl)}">Apply on their site</a>` : ""}</p>`,
  )
  .join("\n")}
<p style="color:#555;font-size:14px">Dates can change, so check the employer&rsquo;s own page before you apply.</p>
<p style="color:#555;font-size:13px">You are getting this because you chose to follow these employers on Level6. <a href="${esc(unsub)}">Stop all alerts</a>.<br>${esc(OPERATOR_NAME)}${CONTACT_EMAIL ? `, ${esc(CONTACT_EMAIL)}` : ""}</p>
</div>`;

  return { subject, text, html, headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
