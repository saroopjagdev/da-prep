// Prints the anonymous funnel for the last N days (default 14), from the funnel_daily table: the daily steps, then where
// visits came from (the source label on each count) and how each channel converts.
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
const res = await fetch(`${base}/rest/v1/funnel_daily?select=day,event,source,n&day=gte.${since}&order=day.desc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const rows = await res.json();

const pad = (s, n) => String(s).padEnd(n);
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : "n/a");
const sum = (list, e) => list.filter((r) => r.event === e).reduce((s, r) => s + r.n, 0);

// Daily steps. Rows are split by source, so add them up per day and event.
const steps = ["landing_view", "hero_signup_submit", "gate_view", "signed_in", "first_practice", "first_mock", "pricing_view", "limit_hit", "checkout_start", "apply_click", "share_click"];
const byDay = {};
for (const r of rows) {
  const d = (byDay[r.day] ??= {});
  d[r.event] = (d[r.event] ?? 0) + r.n;
}
console.log(pad("day", 12) + steps.map((e) => pad(e, 19)).join(""));
for (const d of Object.keys(byDay).sort().reverse()) console.log(pad(d, 12) + steps.map((e) => pad(byDay[d][e] ?? 0, 19)).join(""));

console.log(
  `\nLast ${days} days: ${sum(rows, "landing_view")} landing views, ${sum(rows, "hero_signup_submit")} signup submits (${pct(sum(rows, "hero_signup_submit"), sum(rows, "landing_view"))}), ` +
    `${sum(rows, "signed_in")} signed in, ${sum(rows, "pricing_view")} pricing views, ${sum(rows, "limit_hit")} upgrade prompts shown, ${sum(rows, "checkout_start")} checkouts started.`,
);

// Where visits began and how they came. A visit is counted once, on the page it began on (visit_* events).
const visits = rows.filter((r) => r.event.startsWith("visit_"));
if (visits.length) {
  const sources = [...new Set(visits.map((r) => r.source || "(before tracking)"))];
  const total = visits.reduce((s, r) => s + r.n, 0);
  console.log(`\nVisits by source (${total} in total, from the day source tracking began):`);
  console.log(pad("source", 18) + pad("visits", 9) + pad("share", 8) + pad("home", 8) + pad("employer", 10) + pad("guide", 8) + pad("tool", 8) + "signup submits (home page visitors)");
  const rowsFor = (s) => visits.filter((r) => (r.source || "(before tracking)") === s);
  const table = sources
    .map((s) => ({ s, v: rowsFor(s) }))
    .map(({ s, v }) => ({ s, n: v.reduce((a, r) => a + r.n, 0), v }))
    .sort((a, b) => b.n - a.n);
  for (const { s, n, v } of table) {
    const submits = rows.filter((r) => r.event === "hero_signup_submit" && (r.source || "(before tracking)") === s).reduce((a, r) => a + r.n, 0);
    const home = sum(v, "visit_home");
    console.log(pad(s, 18) + pad(n, 9) + pad(pct(n, total), 8) + pad(home, 8) + pad(sum(v, "visit_employer"), 10) + pad(sum(v, "visit_guide"), 8) + pad(sum(v, "visit_tool"), 8) + `${submits} (${pct(submits, home)})`);
  }
}
