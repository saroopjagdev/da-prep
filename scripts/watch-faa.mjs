// Weekly lead finder from the government's Find an apprenticeship "Display Advert API" (the official vacancies feed).
// Pulls live vacancies, keeps the degree-level ones (level 6 and 7), and reports which employers and roles are new, gone
// or have a changed closing date since last time, plus employers we do not list yet. It does NOT edit lib/*.
//
// Needs a free subscription key (request it at https://developer.apprenticeships.education.gov.uk/, sign in with GOV.UK
// One Login, subscribe to "Display Advert API"). Set it as FAA_API_KEY. Without a key this exits quietly, so the weekly
// workflow is safe to run before the key exists.
//
// Run: node scripts/watch-faa.mjs [--state path] [--report path] [--days 60] [--dump path]
//   --dump writes the first raw response to a file, to check the field names below against the real schema.
//
// Endpoint, paging and filter names come from the API's public page (GET /vacancy, PageNumber, PageSize, Sort,
// PostedInLastNumberOfDays). The two header names and the response field names are NOT published on that page; they are
// read here defensively, and the "UNVERIFIED" markers show what to confirm against display-advert-api.json.
import fs from "node:fs";
import path from "node:path";
import { arg, byEmployer, diff, isKnown, knownEmployers, sleep, today } from "./lead-utils.mjs";

const KEY = process.env.FAA_API_KEY;
if (!KEY) {
  console.log("FAA_API_KEY is not set; skipping the Find an apprenticeship check.");
  process.exit(0);
}

const STATE = arg("--state", "data/watch/faa-state.json");
const REPORT = arg("--report", "data/watch/faa-report.md");
const DAYS = Number(arg("--days", "0")); // 0 = every live vacancy
const DUMP = arg("--dump", "");
const BASE = arg("--base", "https://api.apprenticeships.education.gov.uk/vacancies/vacancy"); // --base is for tests against a fake server
const PAGE_SIZE = 100;
const MAX_PAGES = 60; // safety cap: 6,000 vacancies
const UA = "Level6PageWatch/1.0 (+https://www.level6.uk; weekly check of the official vacancies feed)";
const HEADERS = {
  "User-Agent": UA,
  Accept: "application/json",
  "Ocp-Apim-Subscription-Key": KEY, // confirmed on the API's page: the key goes in this header
  "X-Version": "2", // confirmed on the developer hub: send X-Version: 2 with every request (a missing one returns 404)
};

const pick = (o, ...keys) => {
  for (const k of keys) {
    const v = k.split(".").reduce((x, p) => (x == null ? x : x[p]), o);
    if (v != null && v !== "") return v;
  }
  return "";
};

/** Level 6 and 7 are degree and master's-level apprenticeships. The level can arrive as a number, "6", or text like "Degree (level 6)". */
const degreeLevel = (v) => {
  const m = String(v ?? "").match(/\b([2-7])\b/);
  return m ? Number(m[1]) : /degree|master/i.test(String(v)) ? 6 : 0;
};

async function page(n) {
  const qs = new URLSearchParams({ PageNumber: String(n), PageSize: String(PAGE_SIZE), Sort: "AgeDesc" });
  if (DAYS > 0) qs.set("PostedInLastNumberOfDays", String(DAYS));
  const r = await fetch(`${BASE}?${qs}`, { headers: HEADERS, signal: AbortSignal.timeout(30000) });
  if (r.status === 401 || r.status === 403) throw new Error(`The API refused the key (HTTP ${r.status}). Check FAA_API_KEY and that the subscription covers the Display Advert API.`);
  if (!r.ok) throw new Error(`The API answered HTTP ${r.status} for page ${n}`);
  return r.json();
}

const raw = [];
let first = true;
for (let n = 1; n <= MAX_PAGES; n++) {
  const body = await page(n);
  if (first && DUMP) {
    fs.mkdirSync(path.dirname(DUMP), { recursive: true });
    fs.writeFileSync(DUMP, JSON.stringify(body, null, 1));
    console.log(`Wrote a raw sample to ${DUMP}`);
  }
  first = false;
  const list = Array.isArray(body) ? body : (body.vacancies ?? body.items ?? body.results ?? []);
  raw.push(...list);
  const total = pick(body, "total", "totalFound", "totalCount", "pagination.total");
  if (!list.length || list.length < PAGE_SIZE || (total && raw.length >= Number(total))) break;
  await sleep(500);
}
if (!raw.length) throw new Error("The API returned no vacancies: the response shape has probably differed from what this script expects. Re-run with --dump to inspect it.");

const now = {};
for (const v of raw) {
  const level = degreeLevel(pick(v, "apprenticeshipLevel", "course.level", "level", "courseLevel"));
  if (level < 6) continue;
  const id = String(pick(v, "vacancyReference", "reference", "id"));
  if (!id) continue;
  now[id] = {
    id,
    employer: String(pick(v, "employerName", "employer.name", "employer")),
    title: String(pick(v, "title", "vacancyTitle")),
    level: String(level),
    location: String(pick(v, "address.addressLine4", "address.postcode", "location", "town", "address.town")),
    deadline: String(pick(v, "closingDate", "closing_date")).slice(0, 10),
    posted: String(pick(v, "postedDate", "startDate")).slice(0, 10),
    apply: String(pick(v, "vacancyUrl", "applicationUrl", "url")),
  };
}
if (!Object.keys(now).length) throw new Error(`${raw.length} vacancies came back but none were level 6 or 7 with a reference: the field names probably differ. Re-run with --dump.`);

const prev = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")).jobs ?? {} : null;
const known = knownEmployers();
const d = prev ? diff(prev, now, ["deadline"]) : { added: [], removed: [], changed: [] };
const all = Object.values(now);
const unknown = byEmployer(all.filter((r) => r.employer && !isKnown(known, r.employer)));
const lines = [`# Find an apprenticeship check, ${today()}`, ""];
lines.push(
  `${raw.length} live vacancies read, ${all.length} at degree level (6 or 7). ` +
    `${prev ? `Since last time: ${d.added.length} new, ${d.removed.length} gone or closed, ${d.changed.length} with a changed closing date.` : "First run: this is the baseline."}`,
  "",
  "These are leads. Read the employer's own page before changing anything in lib/opportunities.ts or lib/firms/.",
  "",
);
const row = (r) => `- ${r.employer}: ${r.title} (level ${r.level}, ${r.location || "location n/a"}, ${r.deadline ? "closes " + r.deadline : "no date"}) ${r.apply}`;
if (unknown.length) {
  lines.push("## Employers we do not list yet", "");
  for (const [emp, rows] of unknown.slice(0, 80)) lines.push(`### ${emp} (${rows.length})`, ...rows.slice(0, 3).map(row), "");
}
if (d.changed.length) lines.push("## Closing date changed", "", ...d.changed.map((r) => `- ${r.employer}: ${r.title}: ${r.changes.join("; ")} ${r.apply}`), "");
if (prev && d.added.length) {
  const mine = d.added.filter((r) => isKnown(known, r.employer));
  if (mine.length) lines.push("## New roles at employers we list", "", ...mine.map(row), "");
}
const goneMine = d.removed.filter((r) => isKnown(known, r.employer));
if (prev && goneMine.length) lines.push("## Gone or closed at employers we list", "", ...goneMine.map((r) => `- ${r.employer}: ${r.title}`), "");

fs.mkdirSync(path.dirname(STATE), { recursive: true });
fs.writeFileSync(STATE, JSON.stringify({ checked: today(), jobs: now }, null, 1));
fs.writeFileSync(REPORT, lines.join("\n"));
console.log(lines.slice(0, 3).join("\n"));
