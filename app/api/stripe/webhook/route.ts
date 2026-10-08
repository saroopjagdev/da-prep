import Stripe from "stripe";
import { admin } from "@/lib/server/auth";

// Subscription states that should keep Pro access. past_due keeps it while Stripe retries the card.
const ACTIVE = new Set<Stripe.Subscription.Status>(["active", "trialing", "past_due"]);

const idOf = (c: string | { id: string } | null) => (typeof c === "string" ? c : (c?.id ?? null));

/** When the free trial ends (ISO), or null when the subscription is not in a trial. */
const trialEnd = (sub: Stripe.Subscription | null) =>
  sub && sub.status === "trialing" && sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

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
    if (uid && s.mode === "subscription" && s.payment_status === "paid") {
      ({ error } = await db.from("profiles").upsert({ id: uid, plan: "pro", stripe_customer_id: idOf(s.customer) }));
    } else if (uid && s.mode === "subscription" && s.payment_status === "no_payment_required") {
      // A free trial: nothing is due yet, the card is saved and the first charge happens when the trial ends. Pro starts now.
      const subId = typeof s.subscription === "string" ? s.subscription : (s.subscription?.id ?? null);
      const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
      ({ error } = await db.from("profiles").upsert({
        id: uid,
        plan: "pro",
        stripe_customer_id: idOf(s.customer),
        trial_used: true,
        trial_ends_at: trialEnd(sub),
      }));
    }
  } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customer = idOf(sub.customer);
    const plan = event.type === "customer.subscription.updated" && ACTIVE.has(sub.status) ? "pro" : "free";
    // Prefer the user id stored on the subscription; fall back to the customer link.
    const uid = sub.metadata?.user_id;
    // trial_ends_at only holds a date while the subscription is in its trial; the end of the trial (to active) clears it.
    const patch = { plan, trial_ends_at: event.type === "customer.subscription.updated" ? trialEnd(sub) : null };
    if (uid) ({ error } = await db.from("profiles").update(patch).eq("id", uid));
    else if (customer) ({ error } = await db.from("profiles").update(patch).eq("stripe_customer_id", customer));
  }
  if (error) {
    // A non-2xx makes Stripe retry, so a transient database failure doesn't leave someone paid but on Free.
    console.error(error);
    return Response.json({ error: "Could not update the plan." }, { status: 500 });
  }
  return Response.json({ received: true });
}
