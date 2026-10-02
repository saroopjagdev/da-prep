// Content freshness check: lists employer guides that haven't been re-verified recently. Not part of `npm test`
// (it would start failing on its own as time passes); run it before each application season with
// `npm run check:freshness`. MAX_AGE_DAYS can be overridden with FRESHNESS_DAYS.
import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";

const MAX_AGE_DAYS = Number(process.env.FRESHNESS_DAYS ?? 150);
const DAY = 86_400_000;

describe("employer guide freshness", () => {
  it(`every guide was verified in the last ${MAX_AGE_DAYS} days`, () => {
    const stale = FIRMS.map((f) => ({ slug: f.slug, age: Math.floor((Date.now() - Date.parse(f.lastVerified)) / DAY), lastVerified: f.lastVerified }))
      .filter((f) => f.age > MAX_AGE_DAYS)
      .sort((a, b) => b.age - a.age);
    if (stale.length) console.log("Re-check these guides:\n" + stale.map((s) => `  ${s.slug}: last verified ${s.lastVerified} (${s.age} days ago)`).join("\n"));
    expect(stale).toEqual([]);
  });
});
