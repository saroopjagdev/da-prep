import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE = ["/api/", "/admin", "/tracker", "/stories", "/progress", "/login"];

// Bulk training scrapers. They crawl every page for no referral traffic and cost server time. Search engines and the
// assistants that cite pages in answers (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot) stay allowed.
const SCRAPERS = ["CCBot", "Bytespider", "Amazonbot", "meta-externalagent", "Diffbot", "ImagesiftBot", "Omgilibot", "PetalBot", "DataForSeoBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: SCRAPERS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
