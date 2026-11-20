// When to ask a member for feedback inside the site. Pure and shared: the banner (components/FeedbackAsk.tsx) keeps the
// state in this browser and asks these questions of it. Nothing here identifies anyone and nothing leaves the browser.
//
// The ask is a small banner, never a popup, on a screen where the person has just got something useful (a marked
// practice test, interview, CV or statement review). It is deliberately hard to annoy with:
//  - not before the person has had a second useful result, so it is never the first thing they meet;
//  - at most once every 30 days, and at most 3 times in all;
//  - "Maybe later" asks again in 2 weeks; "Don't ask again" and sending feedback stop it for good;
//  - it is never shown to someone who has already sent feedback (checked against their account, so a new device is fine).

export const MIN_MOMENTS = 2;
export const SHOW_DELAY_MS = 8_000;
export const DAY = 86_400_000;
/** Shown and ignored: the next ask is at least this far off. */
export const GAP_DAYS = 30;
/** "Maybe later": the next ask is this far off. */
export const LATER_DAYS = 14;
/** The most times anyone is ever asked in this browser. */
export const MAX_ASKS = 3;

export type AskState = {
  /** Useful results seen on this browser (one per results screen shown). */
  moments: number;
  /** How many times the banner has been shown. */
  shown: number;
  /** Earliest time (ms since epoch) it may be shown again; 0 for any time. */
  nextAt: number;
  /** "Don't ask again", or feedback was sent. */
  stopped: boolean;
};

export const FRESH: AskState = { moments: 0, shown: 0, nextAt: 0, stopped: false };

export function shouldAsk(s: AskState, now: number, alreadySent: boolean): boolean {
  if (alreadySent || s.stopped) return false;
  if (s.moments < MIN_MOMENTS || s.shown >= MAX_ASKS) return false;
  return now >= s.nextAt;
}

export const afterMoment = (s: AskState): AskState => ({ ...s, moments: s.moments + 1 });
/** The banner went up. If it is ignored, this is also what keeps it away for the next 30 days. */
export const afterShown = (s: AskState, now: number): AskState => ({ ...s, shown: s.shown + 1, nextAt: now + GAP_DAYS * DAY });
export const afterLater = (s: AskState, now: number): AskState => ({ ...s, nextAt: now + LATER_DAYS * DAY });
export const afterNever = (s: AskState): AskState => ({ ...s, stopped: true });

/** Rating links in the banner and the email: the same three, equally prominent, for everyone. */
export const RATING_CHOICES = [
  { label: "Great", rating: 5 },
  { label: "OK", rating: 3 },
  { label: "Not great", rating: 2 },
] as const;

/** The rating a ?r= link carries, or undefined if it is anything else. */
export function ratingFromParam(v: string | null | undefined): number | undefined {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined;
}

export function parseState(raw: string | null): AskState {
  try {
    const v = JSON.parse(raw ?? "null") as Partial<AskState> | null;
    if (!v || typeof v !== "object") return FRESH;
    const n = (x: unknown) => (typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : 0);
    return { moments: n(v.moments), shown: n(v.shown), nextAt: n(v.nextAt), stopped: v.stopped === true };
  } catch {
    return FRESH;
  }
}
