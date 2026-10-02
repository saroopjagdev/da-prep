import { limitsEnforced } from "@/lib/server/guard";

export const dynamic = "force-dynamic";

/** Liveness probe for uptime monitors. Reports which integrations are configured, never their values. */
export function GET() {
  return Response.json({
    ok: true,
    ai: Boolean(process.env.OPENAI_API_KEY),
    accounts: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    payments: Boolean(process.env.STRIPE_SECRET_KEY),
    // The Pro price and the webhook secret must both be set for checkout and plan updates to work.
    paymentsReady: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET && (process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRICE_MONTHLY),
    ),
    // Practice sessions are signed with PASS_SECRET; without it they fall back to the service-role key.
    passSecret: Boolean(process.env.PASS_SECRET),
    contactSet: Boolean(process.env.NEXT_PUBLIC_OPERATOR_NAME && process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    limits: limitsEnforced(),
    sharedRateLimit: Boolean(process.env.UPSTASH_REDIS_REST_URL),
  });
}
