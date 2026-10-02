import Stripe from "stripe";
import { PLANS } from "@/lib/plans";
import { admin } from "@/lib/server/auth";

// Subscription states that should keep Pro access. past_due keeps it while Stripe retries the card.
const ACTIVE = new Set<Stripe.Subscription.Status>(["active", "trialing", "past_due"]);

const idOf = (c: string | { id: string } | null) => (typeof c === "string" ? c : (c?.id ?? null));

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const db = admin();
  const sig = req.headers.get("stripe-signature");
  if (!key || !secret || !db || !sig) {
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return Response.json({ error: "Bad signature" }, { status: 400 });
  }

  let error: unknown = null;
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object as Stripe.Checkout.Session;
    const uid = s.client_reference_id ?? s.metadata?.user_id ?? null;
    // Only grant Pro once the money has actually arrived (bank-based methods can complete as "unpaid" first).
    if (uid && s.payment_status === "paid") {
      const customer = idOf(s.customer);
      if (s.mode === "payment") {
        // One-off 3-month pass: extend from the later of now or the current end date. Stripe can deliver the same
        // event twice, so a session is only applied once (its id is recorded on the payment intent's metadata).
        const piId = idOf(s.payment_intent);
        const pi = piId ? await stripe.paymentIntents.retrieve(piId) : null;
        if (!pi?.metadata?.pass_applied) {
          const res = await db.rpc("extend_pro_pass", { p_uid: uid, p_months: PLANS.pass.months ?? 3 });
          error = res.error;
          if (!error && pi) await stripe.paymentIntents.update(pi.id, { metadata: { ...pi.metadata, pass_applied: "yes" } });
        }
        if (!error && customer) ({ error } = await db.from("profiles").update({ stripe_customer_id: customer }).eq("id", uid));
      } else {
        ({ error } = await db.from("profiles").upsert({ id: uid, plan: "pro", stripe_customer_id: customer }));
      }
    }
  } else if (event.type === "charge.refunded") {
    // A fully refunded pass gives its 3 months back (only once, tracked on the payment intent).
    const charge = event.data.object as Stripe.Charge;
    const piId = idOf(charge.payment_intent);
    const pi = piId ? await stripe.paymentIntents.retrieve(piId) : null;
    const uid = pi?.metadata?.user_id;
    if (charge.refunded && pi && uid && pi.metadata.plan === "pass" && pi.metadata.pass_applied === "yes" && !pi.metadata.pass_refunded) {
      const res = await db.rpc("shorten_pro_pass", { p_uid: uid, p_months: PLANS.pass.months ?? 3 });
      error = res.error;
      if (!error) await stripe.paymentIntents.update(pi.id, { metadata: { ...pi.metadata, pass_refunded: "yes" } });
    }
  } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customer = idOf(sub.customer);
    const plan = event.type === "customer.subscription.updated" && ACTIVE.has(sub.status) ? "pro" : "free";
    // Prefer the user id stored on the subscription; fall back to the customer link.
    const uid = sub.metadata?.user_id;
    if (uid) ({ error } = await db.from("profiles").update({ plan }).eq("id", uid));
    else if (customer) ({ error } = await db.from("profiles").update({ plan }).eq("stripe_customer_id", customer));
  }
  if (error) {
    // A non-2xx makes Stripe retry, so a transient database failure doesn't leave someone paid but on Free.
    console.error(error);
    return Response.json({ error: "Could not update the plan." }, { status: 500 });
  }
  return Response.json({ received: true });
}
