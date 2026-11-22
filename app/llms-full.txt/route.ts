import { buildLlmsFullTxt } from "@/lib/llms";

export const revalidate = 86400;

/** The text of the guides, provider questions and employer summaries as one plain-text file for AI assistants. */
export function GET() {
  return new Response(buildLlmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
