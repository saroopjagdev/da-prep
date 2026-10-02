import { describe, expect, it } from "vitest";
import { generateMetadata as employerMeta } from "@/app/employers/[slug]/page";
import { generateMetadata as mockMeta } from "@/app/mock/[firm]/page";
import { generateMetadata as sectorMeta } from "@/app/sectors/[slug]/page";
import { generateMetadata as testMeta } from "@/app/tests/[id]/page";
import { TESTS } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { MOCKS } from "@/lib/mockprocess/definitions";
import { SECTOR_IDS } from "@/lib/sectors";
import { pageMeta } from "@/lib/site";

type Meta = { title?: unknown; description?: unknown; alternates?: { canonical?: unknown } | null };

async function collect<T>(keys: T[], fn: (k: T) => Promise<Meta>) {
  return Promise.all(keys.map(fn));
}

describe("page metadata", () => {
  it("pageMeta repeats the site-wide share fields and sets a canonical path", () => {
    const m = pageMeta({ title: "X", description: "Y", path: "/x" });
    expect(m.alternates?.canonical).toBe("/x");
    expect(m.openGraph).toMatchObject({ siteName: "Level6", locale: "en_GB", title: "X | Level6", description: "Y", url: "/x" });
  });

  it.each([
    ["employers", () => collect(FIRMS.map((f) => f.slug), (slug) => employerMeta({ params: Promise.resolve({ slug }) }))],
    ["tests", () => collect(TESTS.map((t) => t.id), (id) => testMeta({ params: Promise.resolve({ id }) }))],
    ["sectors", () => collect([...SECTOR_IDS], (slug) => sectorMeta({ params: Promise.resolve({ slug }) }))],
    ["mocks", () => collect(MOCKS.map((m) => m.firm), (firm) => mockMeta({ params: Promise.resolve({ firm }) }))],
  ])("every %s page has its own title, description and canonical URL", async (_name, run) => {
    const metas = await run();
    const titles = metas.map((m) => String(m.title));
    const descriptions = metas.map((m) => String(m.description));
    expect(new Set(titles).size).toBe(metas.length);
    expect(new Set(descriptions).size).toBe(metas.length);
    for (const m of metas) {
      expect(String(m.title)).not.toMatch(/Level6/); // the root template adds the site name
      expect(String(m.description).length).toBeGreaterThan(50);
      expect(String(m.description).length).toBeLessThanOrEqual(300);
      expect(m.alternates?.canonical).toMatch(/^\//);
    }
  });
});
