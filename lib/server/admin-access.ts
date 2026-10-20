import { userFromRequest } from "@/lib/server/auth";

/** The only accounts that can open the admin analytics page. ADMIN_EMAILS (comma separated) replaces this list. */
const DEFAULT_ADMINS = ["ssjagdev@outlook.com", "benhumphreys15@gmail.com"];

export function adminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ADMINS;
}

export const isAdminEmail = (email: string | null | undefined): boolean => !!email && adminEmails().includes(email.trim().toLowerCase());

/** The signed-in admin for this request, or null. The email must be confirmed, so nobody can sign up as an admin. */
export async function adminFromRequest(req: Request) {
  const user = await userFromRequest(req);
  return user && user.email_confirmed_at && isAdminEmail(user.email) ? user : null;
}
