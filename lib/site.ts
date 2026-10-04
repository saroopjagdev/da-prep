import type { Metadata } from "next";

/** Canonical site URL for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Level6";
export const SITE_DESCRIPTION =
  "AI mock interviews, practice tests and an application tracker for UK degree apprenticeships.";

/**
 * Title, description, canonical URL and share preview for one page. Child segments replace the whole `openGraph`
 * object rather than merging it, so the site-wide fields are repeated here. `title` goes through the root
 * template, so pass it without the site name.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
    },
  };
}

/** Public, indexable pages. Personal tools (tracker, stories, progress, account) are excluded. */
export const PUBLIC_PATHS = [
  "/",
  "/interview",
  "/practice",
  "/tests",
  "/mock",
  "/review",
  "/cv",
  "/sectors",
  "/guide",
  "/learn",
  "/tips",
  "/timeline",
  "/opportunities",
  "/sectors/finance/calendar",
  "/sectors/finance/myths",
  "/faq",
  "/pricing",
  "/privacy",
  "/terms",
  "/accessibility",
];
