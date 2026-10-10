// Weekly lead finder from ApprenticeHub's public job list (https://apprenticeshub.com/jobs). Reads the job records the
// page itself ships in its HTML, keeps only facts (employer, role, level, place, deadline, status and the link to the
// ORIGINAL posting), and reports what is new, gone or changed since last time, plus employers we do not list yet.
// It does NOT copy their descriptions, and it does NOT edit lib/*: a person reads the employer's own page and updates it.
//
// Run: node scripts/watch-apprenticeshub.mjs [--state path] [--report path]
// Polite by design: identifies itself, honours robots.txt, a single request. The site's /api/ is disallowed, so we only
// read what the page itself delivers (the first 48 open roles and 48 reference-only roles of the list).
import fs from "node:fs";
import path from "node:path";
import { arg, byEmployer, diff, isKnown, knownEmployers, today } from "./lead-utils.mjs";

const STATE = arg("--state", "data/watch/hub-state.json");
const REPORT = arg("--report", "data/watch/hub-report.md");
const SOURCE = arg("--source", "https://apprenticeshub.com/jobs");
const UA = "Level6PageWatch/1.0 (+https://www.level6.uk; weekly check of public job list for new employers and changed deadlines)";

const url = new URL(SOURCE);
const robots = await fetch(`${url.origin}/robots.txt`, { headers: { "User-Agent": UA } }).then((r) => (r.ok ? r.text() : ""), () => "");
let applies = false;
for (const line of robots.split(/\r?\n/)) {
  const [k, ...v] = line.split(":");
  const key = k.trim().toLowerCase(), val = v.join(":").trim();
  if (key === "user-agent") applies = val === "*";
  else if (applies && key === "disallow" && val && url.pathname.startsWith(val)) {
    console.error(`robots.txt disallows ${SOURCE}; not fetching.`);
    process.exit(0);
  }
}

const res = await fetch(SOURCE, { headers: { "User-Agent": UA, Accept: "text/html" }, signal: AbortSignal.timeout(30000) });
if (!res.ok) throw new Error(`${SOURCE} answered HTTP ${res.status}`);
const html = await res.text();

/** The Next.js app streams its server data as self.__next_f.push([1,"..."]) chunks; join them and pull out each "jobs" array. */
function jobBlocks(page) {
  const chunks = [...page.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)<\/script>/g)].map((m) => JSON.parse(`"${m[1]}"`));
  const text = chunks.join("");
  const out = [];
  for (const m of text.matchAll(/"(initial\w+)":\{"jobs":\[/g)) {
    // Parse the array by bracket matching so we do not depend on what follows it.
    const start = m.index + m[0].length - 1;
    let depth = 0, inStr = false, esc = false;
    for (let j = start; j < text.length; j++) {
      const c = text[j];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
      } else if (c === '"') inStr = true;
      else if (c === "[") depth++;
      else if (c === "]" && --depth === 0) {
        out.push({ block: m[1], jobs: JSON.parse(text.slice(start, j + 1)) });
        break;
      }
    }
  }
  return out;
}

const jobs = jobBlocks(html).flatMap((b) => b.jobs);
if (!jobs.length) throw new Error("No job records found on the page: its layout has probably changed, so this parser needs updating.");

/** Dates come in as ISO, dd/mm/yyyy or words ("Ongoing", "Not provided", "$undefined"). Keep real dates as ISO, drop the rest. */
const isoDate = (v) => {
  const t = String(v ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
};
const link = (v) => (/^https?:\/\//.test(String(v ?? "")) ? v : "");

// Facts only. Descriptions and requirements are theirs; we link to the original posting instead.
const now = {};
for (const j of jobs) {
  now[j.id] = {
    id: j.id,
    employer: j.company_name || j.company,
    title: j.title,
    level: String(j.level ?? ""),
    location: j.location ?? "",
    deadline: isoDate(j.closing_date) || isoDate(j.deadline),
    status: j.application_status ?? "",
    apply: link(j.apply_url),
  };
}

const prev = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")).jobs ?? {} : null;
const known = knownEmployers();
const d = prev ? diff(prev, now, ["deadline", "status"]) : { added: [], removed: [], changed: [] };
const all = Object.values(now);
const unknown = byEmployer(all.filter((r) => !isKnown(known, r.employer)));
const open = all.filter((r) => r.status !== "reference_only");
const lines = [`# ApprenticeHub lead check, ${today()}`, ""];
lines.push(
  `Read ${all.length} role records (${open.length} open or closing soon, ${all.length - open.length} reference only) from ${SOURCE}. ` +
    `${prev ? `Since last time: ${d.added.length} new, ${d.removed.length} gone, ${d.changed.length} changed.` : "First run: this is the baseline."}`,
  "",
  "These are leads. Read the employer's own page (the apply link) before changing anything in lib/opportunities.ts or lib/firms/.",
  "",
);
const row = (r) => `- ${r.employer}: ${r.title} (level ${r.level}, ${r.location || "location n/a"}, ${r.deadline ? "closes " + r.deadline : "no date given"}, ${r.status}) ${r.apply || "(no link)"}`;
if (unknown.length) {
  lines.push("## Employers we do not list yet", "");
  for (const [emp, rows] of unknown) lines.push(`### ${emp} (${rows.length})`, ...rows.slice(0, 4).map(row), "");
}
if (d.changed.length) lines.push("## Deadline or status changed", "", ...d.changed.map((r) => `- ${r.employer}: ${r.title}: ${r.changes.join("; ")} ${r.apply}`), "");
if (d.added.length) lines.push("## New roles", "", ...d.added.map(row), "");
if (d.removed.length) lines.push("## No longer shown", "", ...d.removed.map((r) => `- ${r.employer}: ${r.title}`), "");
// The soonest deadline per employer helps spot dates we have wrong or do not have.
const soon = byEmployer(open.filter((r) => r.deadline)).map(([emp, rows]) => [emp, rows.map((r) => r.deadline).sort()[0]]);
if (soon.length) lines.push("## Earliest listed deadline per employer", "", ...soon.map(([e, dl]) => `- ${e}: ${dl}${isKnown(known, e) ? "" : " (not in our list)"}`), "");

fs.mkdirSync(path.dirname(STATE), { recursive: true });
fs.writeFileSync(STATE, JSON.stringify({ checked: today(), jobs: now }, null, 1));
fs.writeFileSync(REPORT, lines.join("\n"));
console.log(lines.slice(0, 3).join("\n"));
