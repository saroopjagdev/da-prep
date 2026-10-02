// The paid plan: one cancellable monthly subscription. The price shown on the site comes from here, and checkout
// refuses to run if the Stripe price (STRIPE_PRICE_ID) does not match it, so the two can never silently disagree.
import { z } from "zod";

export const PRO_PLAN = {
  name: "Pro monthly",
  price: "£9.99 a month",
  pence: 999,
  currency: "gbp",
  summary:
    "Renews every month until you cancel. Cancel any time from your account; Pro stays on until the end of the month you've paid for.",
} as const;

/** Everything the buyer must confirm before checkout. The server re-checks these and records them with the payment. */
export const checkoutInput = z.object({
  payerAdult: z.literal(true),
  startNow: z.literal(true),
  acceptTerms: z.literal(true),
});

export { CONTACT_EMAIL as CONTACT, OPERATOR_NAME as OPERATOR } from "@/lib/legal";
