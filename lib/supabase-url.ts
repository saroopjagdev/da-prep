/**
 * The Supabase project's base address (https://xyz.supabase.co). People sometimes paste the REST endpoint
 * (…/rest/v1/) or add a trailing slash; the client and the security policy both need the bare origin, so reduce
 * whatever was configured to that. Returns undefined when it isn't a valid URL.
 */
export function supabaseOrigin(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    return new URL(raw.trim()).origin;
  } catch {
    return undefined;
  }
}
