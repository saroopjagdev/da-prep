import type Stripe from "stripe";
import { PASS_PLAN, PRO_PLAN } from "@/lib/plans";

export type PricePlan = "monthly" | "pass";

export type PriceCheck = { ok: true } | { ok: false; reason: "price-unreadable" | "price-mismatch"; detail: string };

/** Does a Stripe price describe the plan the site shows? The page takes its price from lib/plans.ts, so the two must agree. */
export function priceMatchesPlan(p: Pick<Stripe.Price, "unit_amount" | "currency" | "recurring" | "active">, plan: PricePlan): boolean {
  return plan === "pass"
    ? p.unit_amount === PASS_PLAN.pence && p.currency === PASS_PLAN.currency && !p.recurring && p.active
    : p.unit_amount === PRO_PLAN.pence && p.currency === PRO_PLAN.currency && p.recurring?.interval === "month" && p.active;
}

/**
 * Reads a price from Stripe and says whether it is the one the site advertises. Used before every checkout and by the
 * daily payment health check, so both fail for the same reasons. Never throws.
 */
export async function checkStripePrice(stripe: Pick<Stripe, "prices">, priceId: string, plan: PricePlan): Promise<PriceCheck> {
  try {
    const p = await stripe.prices.retrieve(priceId);
    if (priceMatchesPlan(p, plan)) return { ok: true };
    return { ok: false, reason: "price-mismatch", detail: `unit_amount ${p.unit_amount} ${p.currency}, active ${p.active}` };
  } catch (e) {
    return { ok: false, reason: "price-unreadable", detail: (e as Error)?.message ?? "unknown error" };
  }
}
