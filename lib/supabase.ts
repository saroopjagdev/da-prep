import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseOrigin } from "@/lib/supabase-url";

const url = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase env vars are present. Without them the app runs local-only. */
export const cloudEnabled = Boolean(url && anon);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient | null {
  if (!cloudEnabled) return null;
  return (client ??= createClient(url!, anon!));
}
