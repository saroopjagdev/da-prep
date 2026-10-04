// Prints the anonymous signup funnel for the last N days (default 14), from the funnel_daily table.
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. Run: node scripts/funnel.mjs [days]
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z0-9_]+\s*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const base = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");

const days = Number(process.argv[2] ?? 14);
const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
const res = await fetch(`${base}/rest/v1/funnel_daily?select=day,event,n&day=gte.${since}&order=day.desc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const rows = await res.json();

const events = ["landing_view", "hero_signup_submit", "hero_try_practice", "link_sent", "signed_in", "first_practice", "first_mock"];
const byDay = {};
for (const r of rows) (byDay[r.day] ??= {})[r.event] = r.n;
const pad = (s, n) => String(s).padEnd(n);
console.log(pad("day", 12) + events.map((e) => pad(e, 20)).join(""));
for (const d of Object.keys(byDay).sort().reverse()) console.log(pad(d, 12) + events.map((e) => pad(byDay[d][e] ?? 0, 20)).join(""));

const t = (e) => rows.filter((r) => r.event === e).reduce((s, r) => s + r.n, 0);
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : "n/a");
console.log(`\nLast ${days} days: ${t("landing_view")} landing views, ${t("hero_signup_submit")} signup submits (${pct(t("hero_signup_submit"), t("landing_view"))}), ${t("link_sent")} emails sent, ${t("signed_in")} signed in (${pct(t("signed_in"), t("link_sent"))} of emails sent), ${t("hero_try_practice")} tried a practice test (${pct(t("hero_try_practice"), t("landing_view"))}).`);
