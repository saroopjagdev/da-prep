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
 * The Season Pass: one payment, Pro until the end of the application year, no renewal. Off until a Stripe price exists
 * (STRIPE_PRICE_PASS, checked against this like the monthly price) and NEXT_PUBLIC_PASS_ENABLED is "true", so deploying
 * this changes nothing on its own. The daily job (lib/server/passes.ts) ends it after `until`.
 */
export const PASS_PLAN = {
  name: "Season Pass",
  price: "£39",
  pence: 3900,
  currency: "gbp",
  /** The last day of Pro on a pass (inclusive), and how it reads on the site. */
  until: "2027-08-31",
  untilText: "31 August 2027",
  summary: "One payment. Pro until 31 August 2027. It does not renew, so there is nothing to cancel.",
} as const;

/** Whether the pass is offered on the site. The server also needs STRIPE_PRICE_PASS before it will take payment. */
export const passOffered = () => process.env.NEXT_PUBLIC_PASS_ENABLED === "true";

/** Everything the buyer must confirm before checkout. The server re-checks these and records them with the payment. */
export const checkoutInput = z.object({
  startNow: z.literal(true),
  acceptTerms: z.literal(true),
  /** Which plan: the monthly subscription (default) or the one-off Season Pass. */
  plan: z.enum(["monthly", "pass"]).default("monthly"),
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
export const FREE_GAMES = 1; // practice game rounds, counted on the account when a round is started
export const FREE_STORIES = 1; // AI-drafted STAR stories (saving and editing your own stories stays free)

/**
 * The engagement reward: a free account that has tried the product properly gets BONUS_EXTRA more of each allowance
 * above (interviews, practice tests, reviews, game rounds, story drafts), once. "Tried it properly" is any TWO of: applying to an employer
 * through the tracker (following its Apply link), taking a marked mock interview, and starting a practice test. (It was
 * all three until 19 October 2026; nobody got there, because people who track and people who practise are different
 * groups.) Mock processes stay Pro-only. The server checks this on every use, from the counts on the account.
 */
export const BONUS_EXTRA = 2;
export const BONUS_STEPS_NEEDED = 2;

export type BonusCounts = { applied?: boolean | null; interviews?: number | null; practice?: number | null } | null | undefined;

/** Which of the three steps are done, from the account's lifetime counts. */
export const bonusSteps = (c: BonusCounts) => ({
  applied: Boolean(c?.applied),
  interview: (c?.interviews ?? 0) >= 1,
  practice: (c?.practice ?? 0) >= 1,
});

/** How many of the three steps are done. */
export const bonusDone = (c: BonusCounts) => Object.values(bonusSteps(c)).filter(Boolean).length;

export const bonusUnlocked = (c: BonusCounts) => bonusDone(c) >= BONUS_STEPS_NEEDED;

/** An allowance with the reward added once it is unlocked. */
export const withBonus = (base: number, c: BonusCounts) => base + (bonusUnlocked(c) ? BONUS_EXTRA : 0);
