// Paid plans, as agreed with the owner: a cancellable monthly subscription and a one-off 3-month pass that does not
// renew. Prices here are what the site shows; the Stripe prices (STRIPE_PRICE_MONTHLY, STRIPE_PRICE_PASS) must match.
import { z } from "zod";

export type PlanId = "monthly" | "pass";

export const PLANS: Record<PlanId, { name: string; price: string; pence: number; summary: string; renews: boolean; months?: number }> = {
  monthly: {
    name: "Pro monthly",
    price: "£17 a month",
    pence: 1700,
    summary: "Renews every month until you cancel. Cancel any time from your account; Pro stays on until the end of the month you've paid for.",
    renews: true,
  },
  pass: {
    name: "Pro 3-month pass",
    price: "£30 one-off",
    pence: 3000,
    summary: "One payment for 3 months of Pro. It does not renew and you won't be charged again. Buying another pass adds 3 months to the end of the current one.",
    renews: false,
    months: 3,
  },
};

/** Everything the buyer must confirm before checkout. The server re-checks these and records them with the payment. */
export const checkoutInput = z.object({
  plan: z.enum(["monthly", "pass"]),
  payerAdult: z.literal(true),
  startNow: z.literal(true),
  acceptTerms: z.literal(true),
});

export { CONTACT_EMAIL as CONTACT, OPERATOR_NAME as OPERATOR } from "@/lib/legal";
