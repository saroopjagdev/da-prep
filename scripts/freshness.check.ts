// Content freshness check: lists pages whose facts were read from an employer or official page a while ago and haven't been
// re-read since. Not part of `npm test` (it would start failing on its own as time passes). It runs every month from
// .github/workflows/freshness.yml, which opens one rolling issue when something is stale, and can be run by hand with
// `npm run check:freshness`. FRESHNESS_DAYS overrides the researched-guide limit; SHORT_PAGE_DAYS the limit for the short
// employer pages, provider pages and guides that quote official sources (pay, requirements, funding rules change faster).
import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";
import { PROVIDERS } from "@/lib/games/providers";
import { GUIDES } from "@/lib/guides";
import { LITE_EMPLOYERS } from "@/lib/lite-employers";

const MAX_AGE_DAYS = Number(process.env.FRESHNESS_DAYS ?? 150);
const SHORT_PAGE_DAYS = Number(process.env.SHORT_PAGE_DAYS ?? 90);
const DAY = 86_400_000;
const age = (iso: string) => Math.floor((Date.now() - Date.parse(iso)) / DAY);

function report(title: string, rows: { id: string; date: string }[], limit: number) {
  const stale = rows.map((r) => ({ ...r, age: age(r.date) })).filter((r) => r.age > limit).sort((a, b) => b.age - a.age);
  if (stale.length) console.log(`${title} (older than ${limit} days):\n` + stale.map((s) => `  ${s.id}: read ${s.date} (${s.age} days ago)`).join("\n"));
  return stale;
}

describe("content freshness", () => {
  it(`every employer guide was verified in the last ${MAX_AGE_DAYS} days`, () => {
    expect(report("Re-check these employer guides", FIRMS.map((f) => ({ id: f.slug, date: f.lastVerified })), MAX_AGE_DAYS)).toEqual([]);
  });

  it(`every short employer page was read in the last ${SHORT_PAGE_DAYS} days`, () => {
    expect(report("Re-read these short employer pages", LITE_EMPLOYERS.map((l) => ({ id: `${l.slug} (${l.source})`, date: l.checked })), SHORT_PAGE_DAYS)).toEqual([]);
  });

  it(`every provider page had its sources read in the last ${SHORT_PAGE_DAYS} days`, () => {
    expect(report("Re-read the sources for these provider pages", PROVIDERS.map((p) => ({ id: p.id, date: p.checked })), SHORT_PAGE_DAYS)).toEqual([]);
  });

  it(`every guide that quotes official sources was updated in the last ${SHORT_PAGE_DAYS * 2} days`, () => {
    const sourced = GUIDES.filter((g) => (g.sources?.length ?? 0) > 0);
    expect(report("Re-read these guides' sources", sourced.map((g) => ({ id: g.slug, date: g.updated })), SHORT_PAGE_DAYS * 2)).toEqual([]);
  });
});
