// Feedback from members, and the comments chosen to be shown on the site.
// Everyone is asked the same way and can send feedback whatever they think; a rating never decides who sees what.
import { z } from "zod";
import { redact } from "@/lib/redact";

export const MAX_MESSAGE = 1000;
export const MAX_NAME = 40;
/** How many pieces of feedback one account can send in total. */
export const MAX_PER_USER = 5;
/** How many chosen comments the site shows at most. */
export const MAX_SHOWN = 6;

export const feedbackInput = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    message: z.string().trim().min(1, "Write a sentence or two first.").max(MAX_MESSAGE, `Please keep it under ${MAX_MESSAGE} characters.`),
    mayQuote: z.boolean().default(false),
    displayName: z.string().trim().max(MAX_NAME, `Keep the name under ${MAX_NAME} characters.`).optional(),
  })
  .refine((v) => !v.mayQuote || Boolean(v.displayName), { message: "Add the name you want shown, or untick the permission.", path: ["displayName"] });

export type FeedbackInput = z.infer<typeof feedbackInput>;

/** What the public site is allowed to see of a chosen comment: the words and the name the person chose, nothing else. */
export type PublicComment = { id: string; quote: string; name: string };

type Row = { id: string; message: string; display_name: string | null; may_quote: boolean; featured: boolean };

/**
 * The comments safe to show: chosen by an admin, with the person's permission and a name. Contact details that slipped
 * into a comment are removed as a second line of defence (the admin who chooses a comment reads it first).
 */
export function publicComments(rows: Row[]): PublicComment[] {
  return rows
    .filter((r) => r.featured && r.may_quote && r.display_name && r.message.trim())
    .slice(0, MAX_SHOWN)
    .map((r) => ({ id: r.id, quote: redact(r.message.trim()), name: r.display_name!.trim() }));
}
