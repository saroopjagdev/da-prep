import Stripe from "stripe";
import { PRO_PLAN, checkoutInput } from "@/lib/plans";
import { SITE_URL } from "@/lib/site";
import { admin, userFromRequest } from "@/lib/server/auth";

const priceId = () => process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRICE_MONTHLY;

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const parsed = checkoutInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please tick the three confirmations." }, { status: 400 });
  }
  const price = priceId();
  if (!key || !price) return Response.json({ error: "Payments are not configured." }, { status: 503 });
  const user = await userFromRequest(req);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });

  const { data: profile } = (await admin()?.from("profiles").select("plan, stripe_customer_id").eq("id", user.id).maybeSingle()) ?? {};
  // Never sell something they already have.
  if (profile?.plan === "pro") {
    return Response.json({ error: "You're already on Pro. Manage it from this page." }, { status: 409 });
  }

  const stripe = new Stripe(key);

  // The page shows the price from lib/plans.ts, so refuse to take money if the Stripe price is not the same thing.
  try {
    const p = await stripe.prices.retrieve(price);
    if (p.unit_amount !== PRO_PLAN.pence || p.currency !== PRO_PLAN.currency || p.recurring?.interval !== "month" || !p.active) {
      console.error("STRIPE_PRICE_ID does not match the plan shown on the site", { unit_amount: p.unit_amount, currency: p.currency });
      return Response.json({ error: "Payments are temporarily unavailable." }, { status: 503 });
    }
  } catch (e) {
    console.error("Could not read the Stripe price", e);
    return Response.json({ error: "Payments are temporarily unavailable." }, { status: 503 });
  }

  // Two checkout tabs could both complete before the webhook marks the first; ask Stripe directly as well.
  if (profile?.stripe_customer_id) {
    const subs = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: "all", limit: 10 });
    if (subs.data.some((s) => ["active", "trialing", "past_due", "incomplete"].includes(s.status))) {
      return Response.json({ error: "You already have a Pro subscription. Manage it from this page." }, { status: 409 });
    }
  }

  // The buyer's confirmations travel with the payment as a record of consent.
  const consent = {
    user_id: user.id,
    plan: "monthly",
    payer_adult_confirmed: "yes",
    immediate_start_requested: "yes",
    terms_accepted: "yes",
    confirmed_at: new Date().toISOString(),
  };
  const customer = profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email ?? undefined };
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    metadata: consent,
    subscription_data: { metadata: consent },
    success_url: `${SITE_URL}/pricing?success=1`,
    cancel_url: `${SITE_URL}/pricing`,
    ...customer,
  });
  return Response.json({ url: session.url });
}
