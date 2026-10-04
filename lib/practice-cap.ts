// A soft weekly cap on free practice tests, counted on this device. Practice runs in the browser with no account, so this
// cannot be enforced against someone who clears site data; it is a clear nudge toward Pro, not a lock. Pro is unlimited.

import { isoWeek } from "@/lib/week";

const KEY = "da-prep:practice-week";
type Stored = { week: string; n: number };

type Store = Pick<Storage, "getItem" | "setItem">;

/** Completed practice tests this ISO week (zero in a new week or when nothing readable is stored). */
export function usedThisWeek(store: Pick<Storage, "getItem">, now = new Date()): number {
  try {
    const v = JSON.parse(store.getItem(KEY) ?? "null") as Stored | null;
    return v && v.week === isoWeek(now) && Number.isFinite(v.n) && v.n > 0 ? Math.floor(v.n) : 0;
  } catch {
    return 0;
  }
}

/** Count one completed practice test; returns the new total for the week. */
export function recordUse(store: Store, now = new Date()): number {
  const n = usedThisWeek(store, now) + 1;
  try {
    store.setItem(KEY, JSON.stringify({ week: isoWeek(now), n } satisfies Stored));
  } catch {
    /* storage blocked: the cap simply does not apply on this device */
  }
  return n;
}
