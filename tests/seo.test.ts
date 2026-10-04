import { describe, expect, it } from "vitest";
import { generateMetadata as employerMeta } from "@/app/employers/[slug]/page";
import { generateMetadata as mockMeta } from "@/app/mock/[firm]/page";
import { generateMetadata as sectorMeta } from "@/app/sectors/[slug]/page";
import { generateMetadata as testMeta } from "@/app/tests/[id]/page";
import { TESTS } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { ALL_MOCKS } from "@/lib/mockprocess/definitions";
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
    ["mocks", () => collect(ALL_MOCKS.map((m) => m.firm), (firm) => mockMeta({ params: Promise.resolve({ firm }) }))],
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

import sitemap from "@/app/sitemap";
import { abs, articleLd, breadcrumbLd, organizationLd, serialiseLd, websiteLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

describe("structured data", () => {
  it("builds valid breadcrumb lists with absolute URLs and 1-based positions", () => {
    const ld = breadcrumbLd([{ name: "Home", path: "/" }, { name: "Employers", path: "/employers" }, { name: "Barclays", path: "/employers/barclays" }]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[0].item).toBe(SITE_URL);
    expect(ld.itemListElement[2].item).toBe(`${SITE_URL}/employers/barclays`);
  });

  it("describes the organisation and site", () => {
    expect(organizationLd()).toMatchObject({ "@type": "Organization", name: "Level6", url: SITE_URL });
    expect(websiteLd()).toMatchObject({ "@type": "WebSite", name: "Level6", inLanguage: "en-GB" });
  });

  it("firm articles carry a real last-verified date and a short headline", () => {
    const ld = articleLd({ headline: "x".repeat(200), description: "d", path: "/employers/barclays", dateModified: "2026-10-02" });
    expect(ld.dateModified).toBe("2026-10-02");
    expect(ld.headline.length).toBeLessThanOrEqual(110);
    expect(ld.mainEntityOfPage).toBe(abs("/employers/barclays"));
  });

  it("serialises safely: text can never close the script tag", () => {
    const out = serialiseLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });

  it("does not use FAQPage markup (Google withdrew those rich results)", () => {
    expect(serialiseLd([organizationLd(), websiteLd()])).not.toContain("FAQPage");
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("has no duplicate URLs and uses the canonical www host", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u.startsWith(SITE_URL)).toBe(true);
  });

  it("gives every firm page its verified date", () => {
    const firm = entries.filter((e) => e.url.includes("/employers/") && e.url !== `${SITE_URL}/employers`);
    expect(firm.length).toBeGreaterThan(30);
    for (const e of firm) expect(e.lastModified, e.url).toBeInstanceOf(Date);
  });

  it("excludes the private tool pages", () => {
    for (const p of ["/tracker", "/stories", "/progress", "/login"]) expect(entries.some((e) => e.url === `${SITE_URL}${p}`), p).toBe(false);
  });
});

describe("private pages are not indexed", () => {
  it.each(["stories", "progress", "login"])("%s layout sets noindex", async (name) => {
    const mod = (await import(`@/app/${name}/layout`)) as { metadata: { robots?: { index?: boolean } } };
    expect(mod.metadata.robots?.index).toBe(false);
  });
});
