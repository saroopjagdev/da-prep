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

/** Lowest rating whose comment can be offered for showing on the site. Lower ratings are still collected in full. */
export const MIN_SHOWABLE_RATING = 4;
export const canOfferQuote = (rating: number | undefined) => rating === undefined || rating >= MIN_SHOWABLE_RATING;

export const feedbackInput = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    message: z.string().trim().min(1, "Write a sentence or two first.").max(MAX_MESSAGE, `Please keep it under ${MAX_MESSAGE} characters.`),
    mayQuote: z.boolean().default(false),
    displayName: z.string().trim().max(MAX_NAME, `Keep the name under ${MAX_NAME} characters.`).optional(),
  })
  .refine((v) => !v.mayQuote || Boolean(v.displayName), { message: "Add the name you want shown, or untick the permission.", path: ["displayName"] })
  // Every rating is welcome and read. Only 4 and 5 star (or unrated) comments can be offered for the site, so a low rating
  // is feedback for us to act on and never a candidate to be shown. The form hides the permission box; this is the backstop.
  .transform((v) => (canOfferQuote(v.rating) ? v : { ...v, mayQuote: false, displayName: undefined }));

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
