// Structured data (JSON-LD) builders. Only schema types Google still supports for these pages: Organization, WebSite,
// BreadcrumbList and Article. FAQPage rich results were withdrawn by Google in 2026, so we do not mark up FAQs.

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const CONTEXT = "https://schema.org";

/** Absolute URL for a site path. */
export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

const publisher = () => ({ "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: abs("/level6-logo.svg") });

export const organizationLd = () => ({ "@context": CONTEXT, ...publisher(), description: SITE_DESCRIPTION });

export const websiteLd = () => ({ "@context": CONTEXT, "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "en-GB" });

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

/** An article-style page with a real "last verified" date, so freshness is stated, not implied. */
export const articleLd = ({ headline, description, path, dateModified }: { headline: string; description: string; path: string; dateModified: string }) => ({
  "@context": CONTEXT,
  "@type": "Article",
  headline: headline.slice(0, 110),
  description,
  mainEntityOfPage: abs(path),
  dateModified,
  inLanguage: "en-GB",
  author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  publisher: publisher(),
});

/** Serialise for a <script type="application/ld+json"> tag. Escaping "<" stops any text from closing the tag early. */
export const serialiseLd = (data: object | object[]) => JSON.stringify(data).replace(/</g, "\\u003c");
