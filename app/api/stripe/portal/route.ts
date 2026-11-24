import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";
import { admin, userFromRequest } from "@/lib/server/auth";

/** Stripe-hosted page where a subscriber can cancel, update their card and see invoices. */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Payments are not configured." }, { status: 503 });
  const user = await userFromRequest(req);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });

  const { data: profile } = (await admin()?.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle()) ?? {};
  if (!profile?.stripe_customer_id) {
    return Response.json({ error: "No subscription to manage." }, { status: 404 });
  }
  try {
    const session = await new Stripe(key).billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${SITE_URL}/pricing`,
    });
    return Response.json({ url: session.url });
  } catch (e) {
    // Without this a Stripe error (an expired key, or the portal not set up) ended as an unexplained 500 with no trace.
    console.error("Could not open the Stripe billing portal", e);
    return Response.json({ error: "We couldn't open the billing page. Please try again, or email us and we'll sort it." }, { status: 502 });
  }
}
