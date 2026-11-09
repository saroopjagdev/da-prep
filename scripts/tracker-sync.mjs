// Daily: apply what the watchers proved to lib/opportunities.ts (rules in tracker-sync-lib.mjs) and write a report of what
// still needs a person. Run by .github/workflows/watch-employers.yml after the two watchers; safe to run by hand.
//
// Run: node scripts/tracker-sync.mjs [--dry] [--today YYYY-MM-DD] [--report path]
// Reads data/watch/faa-state.json (government feed), data/watch/state.json (employer pages, today's run) and the earlier
// snapshots on the origin/watch-data branch (git history). Never edits anything but lib/opportunities.ts.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { arg, sleep, today as todayUtc } from "./lead-utils.mjs";
import { editEntries, staleRows, syncEntry } from "./tracker-sync-lib.mjs";

const FILE = "lib/opportunities.ts";
const DRY = process.argv.includes("--dry");
const TODAY = arg("--today", todayUtc());
const REPORT = arg("--report", "data/watch/sync-report.md");
/** If the feed holds fewer adverts than this it probably failed to load, so no row is changed from it. */
const MIN_FEED = 50;
const UA = "Level6PageWatch/1.0 (+https://www.level6.uk; confirms whether a cited government advert has closed)";

const json = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);
const faa = json("data/watch/faa-state.json");
const jobs = faa?.jobs && Object.keys(faa.jobs).length >= MIN_FEED && faa.checked === TODAY ? faa.jobs : null;
const pages = json("data/watch/state.json")?.pages ?? {};

// Snapshot history: the watcher commits state.json to origin/watch-data on every run ("Snapshot <date>").
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
let snaps = [];
try {
  snaps = git("log", "origin/watch-data", "--format=%H %cs").trim().split("\n").map((l) => l.split(" "));
} catch {
  console.log("No origin/watch-data history; page re-confirmation is off.");
}
const cache = new Map();
/** The page's signals in the newest snapshot taken strictly before `date` (so a change on the day it was read still shows). */
function history(url, date) {
  const snap = snaps.find(([, d]) => d < date);
  if (!snap) return null;
  if (!cache.has(snap[0])) {
    try {
      cache.set(snap[0], JSON.parse(git("show", `${snap[0]}:state.json`)).pages ?? {});
    } catch {
      cache.set(snap[0], {});
    }
  }
  return cache.get(snap[0])[url]?.signals ?? null;
}

async function closedPage(url) {
  await sleep(1000); // one request a second, like the watchers
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

const src = fs.readFileSync(FILE, "utf8");
const events = [];
const next = await editEntries(src, async (text) => {
  const r = await syncEntry(text, { today: TODAY, jobs, pages, history, closedPage });
  events.push(...r.events);
  return r.text;
});

const by = (k) => events.filter((e) => e.kind === k);
const stale = staleRows(next, TODAY);
const lines = [
  `# Tracker sync, ${TODAY}`,
  "",
  jobs ? "" : "The government feed was not read today (missing, too small or not from today), so no row was changed from it.\n",
  `Re-confirmed today: ${by("reconfirmed").length} from the government feed, ${by("page-unchanged").length} from unchanged employer pages.`,
  "",
  ...(by("date-changed").length ? ["## Closing date changed (from the government feed)", ...by("date-changed").map((e) => `- ${e.name}: ${e.detail}`), ""] : []),
  ...(by("closed-early").length ? ["## Closed early (the advert's own page says so)", ...by("closed-early").map((e) => `- ${e.name}: ${e.detail}`), ""] : []),
  ...(by("needs-person").length ? ["## Needs a person to read the page", ...by("needs-person").map((e) => `- ${e.name}: ${e.detail}`), ""] : []),
  ...(stale.length ? [`## Rows not checked in over 14 days (${stale.length})`, ...stale.map((s) => `- ${s.name}: last checked ${s.checked} (${s.age} days)${s.source ? ` ${s.source}` : ""}`), ""] : []),
];
fs.mkdirSync("data/watch", { recursive: true });
fs.writeFileSync(REPORT, lines.join("\n"));
console.log(lines.join("\n"));
if (next !== src && !DRY) fs.writeFileSync(FILE, next);
console.log(next === src ? "No change to lib/opportunities.ts." : DRY ? "(dry run: lib/opportunities.ts not written)" : "Updated lib/opportunities.ts.");
