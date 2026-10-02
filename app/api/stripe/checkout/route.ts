import Stripe from "stripe";
import { PLANS, checkoutInput } from "@/lib/plans";
import { SITE_URL } from "@/lib/site";
import { admin, userFromRequest } from "@/lib/server/auth";

const priceFor = (plan: "monthly" | "pass") =>
  plan === "monthly" ? process.env.STRIPE_PRICE_MONTHLY || process.env.STRIPE_PRICE_ID : process.env.STRIPE_PRICE_PASS;

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const parsed = checkoutInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please choose a plan and tick the three confirmations." }, { status: 400 });
  }
  const { plan } = parsed.data;
  const price = priceFor(plan);
  if (!key || !price) return Response.json({ error: "Payments are not configured." }, { status: 503 });
  const user = await userFromRequest(req);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });

  const { data: profile } =
    (await admin()?.from("profiles").select("plan, pro_until, stripe_customer_id").eq("id", user.id).maybeSingle()) ?? {};
  const passUntil = profile?.pro_until && new Date(profile.pro_until) > new Date() ? new Date(profile.pro_until) : null;
  // Never sell something that overlaps what they already have.
  if (profile?.plan === "pro") {
    return Response.json({ error: "You're already on Pro monthly. Manage it from this page." }, { status: 409 });
  }
  if (plan === "monthly" && passUntil) {
    const until = passUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    return Response.json({ error: `Your 3-month pass runs until ${until}. You can subscribe after it ends.` }, { status: 409 });
  }

  // Two checkout tabs could both complete before the webhook marks the first; ask Stripe directly as well.
  const stripe = new Stripe(key);
  if (plan === "monthly" && profile?.stripe_customer_id) {
    const subs = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: "all", limit: 10 });
    if (subs.data.some((s) => ["active", "trialing", "past_due", "incomplete"].includes(s.status))) {
      return Response.json({ error: "You already have a Pro subscription. Manage it from this page." }, { status: 409 });
    }
  }

  // The buyer's confirmations travel with the payment as a record of consent.
  const consent = {
    user_id: user.id,
    plan,
    payer_adult_confirmed: "yes",
    immediate_start_requested: "yes",
    terms_accepted: "yes",
    confirmed_at: new Date().toISOString(),
  };
  const customer = profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email ?? undefined };
  const common = {
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    metadata: consent,
    success_url: `${SITE_URL}/pricing?success=${plan}`,
    cancel_url: `${SITE_URL}/pricing`,
    ...customer,
  };
  const session =
    plan === "monthly"
      ? await stripe.checkout.sessions.create({ ...common, mode: "subscription", subscription_data: { metadata: consent } })
      : await stripe.checkout.sessions.create({
          ...common,
          mode: "payment",
          // Create a customer for one-off payments too, so receipts and any later subscription share one record.
          ...(profile?.stripe_customer_id ? {} : { customer_creation: "always" as const }),
          payment_intent_data: { metadata: consent, description: PLANS.pass.name },
        });
  return Response.json({ url: session.url });
}
