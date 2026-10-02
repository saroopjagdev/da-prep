// Rotating selection for pooled sections, so repeat attempts see different items.
import type { Section } from "@/lib/assess/types";

const shuffle = <T,>(xs: T[], rand: () => number): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Item ids to serve for one attempt: every item, or a random selection when the section has `sample`. */
export function serveIds(section: Section, rand: () => number = Math.random): string[] {
  const all = section.items.map((i) => i.id);
  if (!section.sample || section.sample.count >= all.length) return all;
  const { count, byStimulus } = section.sample;
  if (!byStimulus) return shuffle(all, rand).slice(0, count);
  const groups = new Map<string, string[]>();
  for (const i of section.items) {
    const key = i.stimulus ?? i.id;
    groups.set(key, [...(groups.get(key) ?? []), i.id]);
  }
  const out: string[] = [];
  for (const g of shuffle([...groups.values()], rand)) {
    if (out.length >= count) break;
    out.push(...g);
  }
  return section.sample.exact ? out.slice(0, count) : out;
}

/** Number of items one attempt serves. */
export const servedCount = (section: Section) =>
  section.adaptive ? Math.min(section.adaptive.count, section.items.length) : section.sample ? Math.min(section.sample.count, section.items.length) : section.items.length;
