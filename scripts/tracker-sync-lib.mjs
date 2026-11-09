// The rules that keep lib/opportunities.ts current without a person typing dates. Pure: the CLI (tracker-sync.mjs) feeds
// it the day's evidence and writes the result. A row is only changed when a source we already cite proves the change:
//   1. Find an apprenticeship advert (a government page we cite as the row's source):
//        - still listed, same closing date    -> the row is re-confirmed today;
//        - still listed, different date       -> the closing date (and the same date in the note) is updated;
//        - no longer listed, and the advert's own page says "closed on <date>" -> the row is closed with that date.
//   2. An employer page we cite: if the sentences about opening and closing are word for word what they were in the
//      snapshot taken before the day a person last read the page, the row is still true and is re-confirmed today.
// Everything else (a page that changed, one that cannot be read, a row with no earlier snapshot) is left alone and listed
// for a person. Nothing here ever infers a date.

export const MAX_AGE_DAYS = 14;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-12-07" -> "7 December 2026" (the wording used in the notes). */
export const longDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};
export const isoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s ?? "");
export const daysBetween = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000);

/** The date in "This apprenticeship closed on Friday 30 October 2026." as YYYY-MM-DD, or null. */
export function closedOn(text) {
  const m = String(text).match(/closed on (?:[A-Za-z]+day )?(\d{1,2}) ([A-Za-z]+) (\d{4})/i);
  if (!m) return null;
  const month = MONTHS.findIndex((n) => n.toLowerCase() === m[2].toLowerCase());
  return month < 0 ? null : `${m[3]}-${String(month + 1).padStart(2, "0")}-${String(Number(m[1])).padStart(2, "0")}`;
}

const line = (k) => new RegExp(`^(    ${k}: )(.*?)(,?)(\\r?)$`, "m");
export function getField(text, k) {
  const m = text.match(line(k));
  if (!m) return undefined;
  try {
    return JSON.parse(m[2]);
  } catch {
    return m[2];
  }
}
export const setField = (text, k, v) => text.replace(line(k), (_, a, _b, c, d) => `${a}${JSON.stringify(v)}${c}${d}`);

/** Runs `fn` (async) on each top-level object literal ("  {" ... "  },") of the file and rebuilds it, keeping line endings. */
export async function editEntries(src, fn) {
  const re = /^  \{\r?\n[\s\S]*?^  \},?(?=\r?\n)/gm;
  const found = [...src.matchAll(re)];
  let out = "";
  let at = 0;
  for (const m of found) {
    out += src.slice(at, m.index) + (await fn(m[0]));
    at = m.index + m[0].length;
  }
  return out + src.slice(at);
}

const sameSignals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * One entry. ctx = {
 *   today: "YYYY-MM-DD",
 *   jobs: {id: {deadline}} | null     the Find an apprenticeship feed (null when it could not be read: nothing is changed)
 *   pages: {url: {checked, signals}}  today's employer page watch
 *   history(url, beforeDate): signals | null   the page's signals in the last snapshot taken before that date
 *   closedPage(url): Promise<string|null>      the text of a Find an apprenticeship advert page
 * }
 * Returns { text, events } where each event is {name, kind, detail}.
 */
export async function syncEntry(text, ctx) {
  const checked = getField(text, "checked");
  if (!checked) return { text, events: [] };
  const name = getField(text, "name") ?? getField(text, "slug") ?? "?";
  const source = getField(text, "source");
  const ev = (kind, detail) => ({ name, kind, detail });
  const bump = (t) => setField(t, "checked", ctx.today);

  const faa = typeof source === "string" ? source.match(/findapprenticeship\.service\.gov\.uk\/apprenticeship\/reference\/(\d+)/) : null;
  if (faa) {
    if (!ctx.jobs) return { text, events: [] };
    const job = ctx.jobs[faa[1]];
    const closes = getField(text, "closes");
    if (!isoDate(closes)) return { text, events: [] }; // a range or label: a person reads it
    if (job && isoDate(job.deadline)) {
      if (job.deadline === closes) return { text: bump(text), events: [ev("reconfirmed", `advert still listed, closes ${longDate(closes)}`)] };
      let t = setField(text, "closes", job.deadline);
      const note = getField(t, "note");
      if (typeof note === "string") t = setField(t, "note", note.split(longDate(closes)).join(longDate(job.deadline)));
      return { text: bump(t), events: [ev("date-changed", `closing date ${closes} -> ${job.deadline}`)] };
    }
    if (!job && closes >= ctx.today) {
      const page = await ctx.closedPage(source);
      const iso = page ? closedOn(page) : null;
      if (!iso) return { text, events: [ev("needs-person", "advert no longer listed, but its page does not say it closed")] };
      let t = setField(text, "closes", iso);
      t = setField(t, "state", "closed");
      t = setField(t, "note", `Find an apprenticeship says this advert closed on ${longDate(iso)}. Check the employer's careers page for the next intake.`);
      return { text: bump(t), events: [ev("closed-early", `advert closed on ${iso}; the row said it closed ${closes}`)] };
    }
    return { text, events: [] };
  }

  if (typeof source === "string" && /^https?:/.test(source)) {
    const url = source.split("#")[0];
    const page = ctx.pages[url];
    if (!page || page.checked !== ctx.today) return { text, events: [ev("needs-person", "page could not be read today")] };
    const before = ctx.history(url, checked);
    if (!before) return { text, events: [ev("needs-person", "no earlier snapshot of this page to compare with")] };
    if (sameSignals(before, page.signals)) return { text: bump(text), events: [ev("page-unchanged", "opening and closing wording unchanged since it was last read")] };
    return { text, events: [ev("needs-person", "the page's wording about dates has changed since it was last read")] };
  }
  // A researched firm with no `source` line: its pages are the firm's official links, which the watcher stores under the slug.
  // Every one of them must have been read today and be unchanged, otherwise a person looks.
  const slug = getField(text, "slug");
  if (slug && !source) {
    const mine = Object.entries(ctx.pages).filter(([, p]) => p.name === slug);
    if (!mine.length) return { text, events: [ev("needs-person", "none of the firm's official pages is being watched")] };
    const unread = mine.filter(([, p]) => p.checked !== ctx.today);
    if (unread.length) return { text, events: [ev("needs-person", `${unread.length} of the firm's ${mine.length} official pages could not be read today`)] };
    const changed = mine.filter(([url, p]) => {
      const before = ctx.history(url, checked);
      return !before || !sameSignals(before, p.signals);
    });
    if (changed.length) return { text, events: [ev("needs-person", `${changed.length} of the firm's ${mine.length} official pages changed, or have no earlier snapshot, since it was last read`)] };
    return { text: bump(text), events: [ev("page-unchanged", `all ${mine.length} official pages unchanged since it was last read`)] };
  }
  return { text, events: [] };
}

/** Rows still older than MAX_AGE_DAYS after the sync, oldest first, for the report. */
export function staleRows(src, today) {
  const out = [];
  for (const m of src.matchAll(/^  \{\r?\n[\s\S]*?^  \},?(?=\r?\n)/gm)) {
    const checked = getField(m[0], "checked");
    if (!checked) continue;
    const age = daysBetween(today, checked);
    const closes = getField(m[0], "closes");
    if (isoDate(closes) && closes < today) continue; // closed by date: nothing to keep fresh
    if (age > MAX_AGE_DAYS) out.push({ name: getField(m[0], "name") ?? getField(m[0], "slug") ?? "?", checked, age, source: getField(m[0], "source") });
  }
  return out.sort((a, b) => b.age - a.age);
}
