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

/**
 * The free trial of Pro: one per person, card taken at the start, then the monthly price is charged automatically
 * unless they cancel first. It is a Stripe subscription trial, so the account is on Pro for the whole trial.
 */
export const TRIAL_DAYS = 2;
export const TRIAL_TEXT = `${TRIAL_DAYS} days free, then ${PRO_PLAN.price} until you cancel`;

/**
 * Daily caps while someone is on the trial, below Pro's fair-use limits so a throwaway trial cannot run up a bill.
 * Keys are the AI route names passed to guardAi; a route not listed keeps its normal cap. `total` replaces the
 * normal daily ceiling of AI calls across all routes. Past the trial, normal Pro fair use applies again.
 */
export const TRIAL_DAILY_CAPS = {
  total: 60,
  routes: { score: 5, mockscore: 8, next: 40, cv: 10, review: 10, star: 20, extract: 20, transcribe: 60 } as Record<string, number>,
};

/** Everything the buyer must confirm before checkout. The server re-checks these and records them with the payment. */
export const checkoutInput = z.object({
  payerAdult: z.literal(true),
  startNow: z.literal(true),
  acceptTerms: z.literal(true),
  /** Start with the free trial. The server only honours this when the account has not had a trial or subscription. */
  trial: z.boolean().optional(),
});

export { CONTACT_EMAIL as CONTACT, OPERATOR_NAME as OPERATOR } from "@/lib/legal";

/** What the free plan includes each period. The pricing page, the home page and the server limits all read these. */
export const FREE_INTERVIEWS = 1; // marked AI mock interviews a week (text or video, with feedback out of 100)
export const FREE_MOCK_PROCESSES = 0; // whole firm mock processes a week: these are Pro
export const FREE_PRACTICE_PER_WEEK = 2; // practice tests a week, counted on the account when a test is started
export const FREE_REVIEWS = 2; // statement, answer or CV reviews a week
