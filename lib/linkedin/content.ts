// Builds the day's LinkedIn post from the tracker. Pure: no network, no database, so it can be tested and previewed.
//
// Every number and date in a post comes from a tracker row, and a row is only used while it passes the freshness gate:
// an official source, read within MAX_AGE_DAYS. A day with nothing that passes the gate gets no post, not a vaguer one.
import { SITE_URL } from "@/lib/site";
import type { OpportunityRow } from "@/lib/opportunities";

/** A row's dates are not used once the employer's page was last read longer ago than this. */
export const MAX_AGE_DAYS = 14;
/** How many employers one post names. */
export const MAX_NAMES = 5;
/** Closing within this many days counts as "closing soon". */
export const CLOSING_WINDOW_DAYS = 14;

export type PostKind = "closing-soon" | "now-open" | "opening-soon";
export type Draft = { kind: PostKind; /** One per kind per day: the unit of "already posted". */ key: string; text: string; names: string[]; link: string };
export type Pick = { draft: Draft } | { skip: string };

const DAY = 86_400_000;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);

/** Monday to Friday only (the readers are teachers, careers advisers, parents and employers); the kind rotates by weekday. */
const BY_WEEKDAY: Record<number, PostKind[]> = {
  1: ["now-open", "closing-soon", "opening-soon"],
  2: ["closing-soon", "now-open", "opening-soon"],
  3: ["opening-soon", "now-open", "closing-soon"],
  4: ["closing-soon", "now-open", "opening-soon"],
  5: ["now-open", "closing-soon", "opening-soon"],
};

/** Official source and read recently enough. Rows that fail are never named in a post. */
export function passesGate(r: OpportunityRow, today: string): boolean {
  return r.confidence === "official" && Boolean(r.checked) && daysBetween(today, r.checked!) <= MAX_AGE_DAYS && daysBetween(today, r.checked!) >= 0;
}

function candidates(kind: PostKind, rows: OpportunityRow[], today: string): OpportunityRow[] {
  const fresh = rows.filter((r) => passesGate(r, today));
  const byClose = (a: OpportunityRow, b: OpportunityRow) => (a.closesIso ?? "9999").localeCompare(b.closesIso ?? "9999") || a.name.localeCompare(b.name);
  if (kind === "closing-soon")
    return fresh.filter((r) => r.status === "open" && r.closesIso && daysBetween(r.closesIso, today) >= 0 && daysBetween(r.closesIso, today) <= CLOSING_WINDOW_DAYS).sort(byClose);
  if (kind === "now-open") return fresh.filter((r) => r.status === "open" && (r.closesIso || r.rolling)).sort(byClose);
  return fresh.filter((r) => r.status === "opening-soon" && r.opens).sort((a, b) => a.opens.localeCompare(b.opens) || a.name.localeCompare(b.name));
}

const HEADLINE: Record<PostKind, string> = {
  "closing-soon": "Degree apprenticeship applications closing in the next two weeks",
  "now-open": "Degree apprenticeship applications open right now",
  "opening-soon": "Degree apprenticeships opening soon",
};

function line(kind: PostKind, r: OpportunityRow): string {
  if (kind === "opening-soon") return `• ${r.name}: opens ${r.opens}`;
  if (r.closesIso) return `• ${r.name}: closes ${r.closes}`;
  return `• ${r.name}: rolling, closes when full`;
}

export function linkFor(kind: PostKind, date: string): string {
  return `${SITE_URL}/deadlines?utm_source=linkedin&utm_campaign=${kind}&utm_content=${date}`;
}

export function buildPost(kind: PostKind, rows: OpportunityRow[], today: string): Draft | null {
  const chosen = candidates(kind, rows, today).slice(0, MAX_NAMES);
  if (chosen.length === 0) return null;
  const link = linkFor(kind, today);
  const text = [
    HEADLINE[kind],
    "",
    ...chosen.map((r) => line(kind, r)),
    "",
    "Every date links back to the employer's own page, with the day we last checked it. The full list is free to read, print or pin on a careers wall:",
    link,
    "",
    "#DegreeApprenticeships #Apprenticeships #SchoolLeavers #CareersAdvice",
  ].join("\n");
  return { kind, key: `${kind}:${today}`, text, names: chosen.map((r) => r.name), link };
}

/** The post for a day, or the reason there is none. `posted` says whether a key has already gone out. */
export function pickPost(rows: OpportunityRow[], now: Date, posted: (key: string) => boolean = () => false): Pick {
  const today = isoDay(now);
  const order = BY_WEEKDAY[now.getUTCDay()];
  if (!order) return { skip: "weekend: no post" };
  for (const kind of order) {
    const draft = buildPost(kind, rows, today);
    if (draft && !posted(draft.key)) return { draft };
    if (draft) return { skip: `already posted ${draft.key}` };
  }
  return { skip: "no tracker rows pass the freshness gate for any post type today" };
}
