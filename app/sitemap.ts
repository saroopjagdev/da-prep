import type { MetadataRoute } from "next";
import { TESTS } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { ALL_MOCKS } from "@/lib/mockprocess/definitions";
import { SECTOR_IDS } from "@/lib/sectors";
import { PUBLIC_PATHS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Firm pages carry a real "last verified" date; use it so crawlers see genuine freshness. Other pages omit it.
  const verified = new Map(FIRMS.map((f) => [`/employers/${f.slug}`, new Date(f.lastVerified)]));
  const paths = [
    ...PUBLIC_PATHS,
    ...SECTOR_IDS.map((id) => `/sectors/${id}`),
    ...FIRMS.map((f) => `/employers/${f.slug}`),
    ...TESTS.map((t) => `/tests/${t.id}`),
    ...ALL_MOCKS.map((m) => `/mock/${m.firm}`),
  ];
  return [...new Set(paths)].map((p) => ({
    url: `${SITE_URL}${p === "/" ? "" : p}`,
    lastModified: verified.get(p),
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
