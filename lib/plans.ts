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

/**
 * What the free plan includes, in total per account (not per week or month). The pricing page, the home page and the
 * server limits all read these. Every count is kept against FREE_PERIOD, a single row per account.
 */
export const FREE_PERIOD = "lifetime";
export const FREE_INTERVIEWS = 1; // marked AI mock interviews (text or video, with feedback out of 100)
export const FREE_MOCK_PROCESSES = 0; // whole firm mock processes: these are Pro
export const FREE_PRACTICE = 1; // practice tests, counted on the account when a test is started
export const FREE_REVIEWS = 1; // statement, answer or CV reviews

/**
 * The engagement reward: a free account that has tried the product properly gets BONUS_EXTRA more of each allowance
 * above (interviews, practice tests, reviews), once. "Tried it properly" is all three of: applying to an employer
 * through the tracker (following its Apply link), taking a marked mock interview, and starting a practice test. Mock
 * processes stay Pro-only. The server checks this on every use, from the counts on the account.
 */
export const BONUS_EXTRA = 2;

export type BonusCounts = { applied?: boolean | null; interviews?: number | null; practice?: number | null } | null | undefined;

/** Which of the three steps are done, from the account's lifetime counts. */
export const bonusSteps = (c: BonusCounts) => ({
  applied: Boolean(c?.applied),
  interview: (c?.interviews ?? 0) >= 1,
  practice: (c?.practice ?? 0) >= 1,
});

export const bonusUnlocked = (c: BonusCounts) => {
  const s = bonusSteps(c);
  return s.applied && s.interview && s.practice;
};

/** An allowance with the reward added once it is unlocked. */
export const withBonus = (base: number, c: BonusCounts) => base + (bonusUnlocked(c) ? BONUS_EXTRA : 0);
