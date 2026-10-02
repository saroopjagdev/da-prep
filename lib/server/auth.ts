import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { supabaseOrigin } from "@/lib/supabase-url";

let adminClient: SupabaseClient | null = null;

/** Service-role client. Server only. Null when Supabase isn't configured. */
export function admin(): SupabaseClient | null {
  const url = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return (adminClient ??= createClient(url, key, { auth: { persistSession: false } }));
}

export async function userFromRequest(req: Request): Promise<User | null> {
  const a = admin();
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!a || !token) return null;
  const { data, error } = await a.auth.getUser(token);
  return error ? null : data.user;
}
