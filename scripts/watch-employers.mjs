// Weekly watcher for the Opportunities list. Re-reads the employer's own careers pages we already cite, pulls out the
// sentences that talk about opening, closing and deadlines, and reports what changed since last time. It does NOT edit
// any dates: a person (or Claude) reads the flagged page and updates lib/opportunities.ts or lib/firms/*.ts.
//
// Run: node scripts/watch-employers.mjs [--state path] [--report path] [--only text]
// Writes the state file (default data/watch/state.json) and a markdown report (default data/watch/report.md).
// Polite by design: identifies itself, honours robots.txt, one request a second, skips anything that blocks us.

import fs from "node:fs";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const STATE = arg("--state", "data/watch/state.json");
const REPORT = arg("--report", "data/watch/report.md");
const ONLY = arg("--only", "");
const UA = "Level6PageWatch/1.0 (+https://www.level6.uk; checks public careers pages for changed dates)";
const SKIP_HOSTS = /wikijob|thestudentroom|glassdoor|reddit|fishbowl|targetjobs|ratemyapprentice|practiceaptitude|assessmentday|prospects|linkedin|facebook|instagram/i;
const SIGNAL = /\b(open|opens|opened|opening|close|closes|closed|closing|deadline|applications?|apply|intake|2026|2027|january|february|march|april|september|october|november|december|rolling|register)\b/i;

const read = (f) => fs.readFileSync(f, "utf8");

/** Every careers page we already cite: each window's source plus each firm's official links. */
function targets() {
  const out = new Map();
  const add = (name, url) => {
    if (!/^https?:\/\//.test(url) || SKIP_HOSTS.test(url)) return;
    const key = url.split("#")[0];
    if (!out.has(key)) out.set(key, name);
  };
  const opp = read("lib/opportunities.ts");
  for (const m of opp.matchAll(/name:\s*"([^"]+)",\s*\n\s*source:\s*"(https?:[^"]+)"/g)) add(m[1], m[2]);
  for (const m of opp.matchAll(/slug:\s*"([^"]+)",\s*\n(?:[^\n]*\n){0,3}?\s*source:\s*"(https?:[^"]+)"/g)) add(m[1], m[2]);
  for (const f of fs.readdirSync("lib/firms")) {
    if (!f.endsWith(".ts")) continue;
    const src = read(path.join("lib/firms", f));
    const slug = (src.match(/slug:\s*"([^"]+)"/) ?? [])[1];
    if (!slug) continue;
    const block = (src.match(/officialLinks:\s*\[([\s\S]*?)\]/) ?? [])[1] ?? "";
    for (const u of block.matchAll(/"(https?:[^"]+)"/g)) add(slug, u[1]);
    // officialLinks often name constants; resolve those too
    for (const c of block.matchAll(/\b([A-Z][A-Z0-9_]+)\b/g)) {
      const def = src.match(new RegExp(`const ${c[1]}\\s*=\\s*"(https?:[^"]+)"`));
      if (def) add(slug, def[1]);
    }
  }
  return [...out].map(([url, name]) => ({ url, name })).filter((t) => !ONLY || t.url.includes(ONLY) || t.name.includes(ONLY));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const robotsCache = new Map();

async function allowed(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    let rules = [];
    try {
      const r = await fetch(`${u.origin}/robots.txt`, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(10000) });
      if (r.ok) {
        let applies = false;
        for (const line of (await r.text()).split(/\r?\n/)) {
          const [k, ...v] = line.split(":");
          const key = k.trim().toLowerCase(), val = v.join(":").trim();
          if (key === "user-agent") applies = val === "*";
          else if (applies && key === "disallow" && val) rules.push(val);
        }
      }
    } catch {
      rules = [];
    }
    robotsCache.set(u.origin, rules);
  }
  return !robotsCache.get(u.origin).some((p) => (u.pathname + u.search).startsWith(p));
}

function signals(html) {
  const text = html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(br|\/p|\/li|\/h\d|\/div|\/tr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&apos;/g, "'");
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 25 && l.length < 400 && SIGNAL.test(l) && /\b(20(2[5-9]))\b|open|clos|deadline|rolling|register/i.test(l));
  return [...new Set(lines)].slice(0, 40);
}

const state = fs.existsSync(STATE) ? JSON.parse(read(STATE)) : { pages: {} };
const changed = [], fresh = [], failed = [], blocked = [];
const list = targets();
console.log(`${list.length} pages to check`);

for (const t of list) {
  try {
    if (!(await allowed(t.url))) {
      blocked.push(t);
      continue;
    }
    const r = await fetch(t.url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!r.ok) {
      failed.push({ ...t, why: `HTTP ${r.status}` });
      continue;
    }
    const sig = signals(await r.text());
    const prev = state.pages[t.url];
    const now = new Date().toISOString().slice(0, 10);
    if (!prev) fresh.push({ ...t, count: sig.length });
    else {
      const added = sig.filter((s) => !prev.signals.includes(s));
      const removed = prev.signals.filter((s) => !sig.includes(s));
      if (added.length || removed.length) changed.push({ ...t, added, removed, since: prev.checked });
    }
    state.pages[t.url] = { name: t.name, checked: now, signals: sig };
  } catch (e) {
    failed.push({ ...t, why: e.name === "TimeoutError" ? "timeout" : e.message });
  }
  await sleep(1000);
}

// Window entries that have not been re-read lately.
const opp = read("lib/opportunities.ts");
const old = [...opp.matchAll(/checked:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]).filter((d) => Date.now() - Date.parse(d) > 14 * 864e5);

const lines = [`# Employer page watch, ${new Date().toISOString().slice(0, 10)}`, ""];
lines.push(`Checked ${list.length} pages: ${changed.length} changed, ${fresh.length} first-time baselines, ${failed.length} failed, ${blocked.length} disallowed by robots.txt.`, "");
if (changed.length) {
  lines.push("## Changed (read the page, then update the dates)", "");
  for (const c of changed) {
    lines.push(`### ${c.name} (since ${c.since})`, c.url, "");
    for (const a of c.added.slice(0, 6)) lines.push(`- NEW: ${a}`);
    for (const x of c.removed.slice(0, 4)) lines.push(`- GONE: ${x}`);
    lines.push("");
  }
}
if (failed.length) lines.push("## Failed", "", ...failed.map((f) => `- ${f.name}: ${f.url} (${f.why})`), "");
if (old.length) lines.push(`## Stale entries`, "", `${old.length} entries in lib/opportunities.ts were last checked more than 14 days ago.`, "");
fs.mkdirSync(path.dirname(STATE), { recursive: true });
fs.writeFileSync(STATE, JSON.stringify(state, null, 1));
fs.writeFileSync(REPORT, lines.join("\n"));
console.log(lines.slice(0, 3).join("\n"));
