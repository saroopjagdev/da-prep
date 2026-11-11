import Stripe from "stripe";
import { PASS_PLAN, PRO_PLAN, checkoutInput } from "@/lib/plans";
import { SITE_URL } from "@/lib/site";
import { admin, userFromRequest } from "@/lib/server/auth";
import { countServer } from "@/lib/server/funnel";

const priceId = () => process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRICE_MONTHLY;

/** Say no, and count why (anonymously, in the daily funnel counters), so a checkout that never reaches Stripe is visible. */
async function refuse(reason: string, error: string, status: number) {
  await countServer("checkout_refused", reason);
  return Response.json({ error, reason }, { status });
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const parsed = checkoutInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return refuse("unticked", "Please tick both confirmations.", 400);
  // The Season Pass has its own Stripe price; until STRIPE_PRICE_PASS is set it cannot be bought.
  const plan = parsed.data.plan;
  const price = plan === "pass" ? process.env.STRIPE_PRICE_PASS : priceId();
  if (!key || !price) return refuse("not-configured", "Payments are not configured.", 503);
  const user = await userFromRequest(req);
  if (!user) return refuse("signed-out", "Sign in first.", 401);

  const { data: profile } = (await admin()?.from("profiles").select("plan, stripe_customer_id").eq("id", user.id).maybeSingle()) ?? {};
  // Never sell something they already have.
  if (profile?.plan === "pro") return refuse("already-pro", "You're already on Pro. Manage it from this page.", 409);

  const stripe = new Stripe(key);

  // The page shows the price from lib/plans.ts, so refuse to take money if the Stripe price is not the same thing.
  try {
    const p = await stripe.prices.retrieve(price);
    const matches =
      plan === "pass"
        ? p.unit_amount === PASS_PLAN.pence && p.currency === PASS_PLAN.currency && !p.recurring && p.active
        : p.unit_amount === PRO_PLAN.pence && p.currency === PRO_PLAN.currency && p.recurring?.interval === "month" && p.active;
    if (!matches) {
      console.error("STRIPE_PRICE_ID does not match the plan shown on the site", { unit_amount: p.unit_amount, currency: p.currency });
      return refuse("price-mismatch", "Payments are temporarily unavailable.", 503);
    }
  } catch (e) {
    console.error("Could not read the Stripe price", e);
    return refuse("price-unreadable", "Payments are temporarily unavailable.", 503);
  }

  // Two checkout tabs could both complete before the webhook marks the first; ask Stripe directly as well.
  if (plan === "monthly" && profile?.stripe_customer_id) {
    const subs = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: "all", limit: 10 });
    if (subs.data.some((s) => ["active", "trialing", "past_due", "incomplete"].includes(s.status))) {
      return refuse("already-subscribed", "You already have a Pro subscription. Manage it from this page.", 409);
    }
  }

  // The buyer's confirmations travel with the payment as a record of consent.
  const consent = {
    user_id: user.id,
    plan,
    immediate_start_requested: "yes",
    terms_accepted: "yes",
    confirmed_at: new Date().toISOString(),
  };
  const customer = profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email ?? undefined };
  try {
    const common = {
      line_items: [{ price, quantity: 1 }],
      client_reference_id: user.id,
      metadata: consent,
      success_url: `${SITE_URL}/pricing?success=1`,
      cancel_url: `${SITE_URL}/pricing`,
      ...customer,
    };
    const session = await stripe.checkout.sessions.create(
      plan === "pass"
        ? // One payment, no renewal. The metadata is copied onto the charge so a full refund can end the pass.
          { ...common, mode: "payment", payment_intent_data: { metadata: consent }, ...(profile?.stripe_customer_id ? {} : { customer_creation: "always" as const }) }
        : { ...common, mode: "subscription", subscription_data: { metadata: consent } },
    );
    await countServer("checkout_session", plan === "pass" ? "pass" : "");
    return Response.json({ url: session.url });
  } catch (e) {
    // Before this, a Stripe error here ended as an unexplained 500 and left no trace.
    console.error("Could not create the Stripe checkout session", e);
    return refuse("stripe-error", "Payments are temporarily unavailable. Please try again.", 502);
  }
}
