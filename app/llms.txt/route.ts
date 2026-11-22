import { buildLlmsTxt } from "@/lib/llms";

export const revalidate = 86400;

/** A short plain-text index of the site for AI assistants (the llms.txt convention). */
export function GET() {
  return new Response(buildLlmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
