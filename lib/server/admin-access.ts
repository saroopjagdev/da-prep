import { userFromRequest } from "@/lib/server/auth";

/**
 * The only accounts that can open the admin analytics page. It is a fixed list in code on purpose: no environment
 * variable or database row can add to it, so changing who has access means a reviewed change here.
 */
const ADMINS: readonly string[] = ["ssjagdev@outlook.com", "benhumphreys15@gmail.com", "saroopjagdev@gmail.com"];

export const isAdminEmail = (email: string | null | undefined): boolean => !!email && ADMINS.includes(email.trim().toLowerCase());

/** The signed-in admin for this request, or null. The email must be confirmed, so nobody can sign up as an admin. */
export async function adminFromRequest(req: Request) {
  const user = await userFromRequest(req);
  return user && user.email_confirmed_at && isAdminEmail(user.email) ? user : null;
}
