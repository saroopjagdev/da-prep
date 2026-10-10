// Shared by the vacancy-source watchers (ApprenticeHub, Find an apprenticeship). These sources are LEADS, not truth:
// they tell us which employers and roles to go and read on the employer's own page. Nothing here edits lib/*.
import fs from "node:fs";

export const read = (f) => fs.readFileSync(f, "utf8");
export const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const today = () => new Date().toISOString().slice(0, 10);

/** Lower-case letters and digits only, so "J.P. Morgan", "JP Morgan" and "jp-morgan" compare equal. */
export const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(plc|ltd|limited|llp|uk|group|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Every employer we already list or track, by normalised name: names and slugs from lib/listings.ts and lib/opportunities.ts. */
export function knownEmployers() {
  const known = new Set();
  const listings = read("lib/listings.ts");
  for (const m of listings.matchAll(/^([^|\n`]{2,60})\|[a-z]+\|/gm)) known.add(norm(m[1]));
  const opp = read("lib/opportunities.ts");
  for (const m of opp.matchAll(/\b(?:name|slug):\s*"([^"]+)"/g)) known.add(norm(m[1]));
  known.delete("");
  return known;
}

/** True when a vacancy's employer looks like one we already list (either name contains the other). */
export function isKnown(known, employer) {
  const n = norm(employer);
  if (!n) return false;
  if (known.has(n)) return true;
  for (const k of known) if (k.length >= 4 && n.length >= 4 && (n.includes(k) || k.includes(n))) return true;
  return false;
}

/** Diff two {id: record} maps. Records are compared on the fields given. */
export function diff(prev, now, fields) {
  const added = [], removed = [], changed = [];
  for (const [id, r] of Object.entries(now)) {
    const p = prev[id];
    if (!p) added.push(r);
    else {
      const ch = fields.filter((f) => (p[f] ?? "") !== (r[f] ?? ""));
      if (ch.length) changed.push({ ...r, changes: ch.map((f) => `${f}: ${p[f] || "none"} -> ${r[f] || "none"}`) });
    }
  }
  for (const [id, p] of Object.entries(prev)) if (!now[id]) removed.push(p);
  return { added, removed, changed };
}

/** Group records by employer for the report, biggest first. */
export const byEmployer = (rows) => {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.employer)) m.set(r.employer, []);
    m.get(r.employer).push(r);
  }
  return [...m].sort((a, b) => b[1].length - a[1].length);
};
