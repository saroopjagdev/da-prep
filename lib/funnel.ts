// Anonymous funnel counters: a handful of named steps, counted per day, with nothing that identifies a person.
// Safe for client and server. The server side is app/api/event/route.ts; the table is funnel_daily.

export const FUNNEL_EVENTS = [
  "landing_view", // a new visitor was shown the landing page
  "hero_signup_submit", // they pressed Get started free
  "hero_try_practice", // retired: the practice test now needs an account
  "gate_view", // someone without an account reached a tool that needs one
  "link_sent", // we sent a sign-in email
  "signed_in", // they arrived back from the email and are signed in
  "first_practice", // first practice test completed on a device
  "first_mock", // first mock interview completed on a device
  "account_created", // an account was created with a password
  "pricing_view", // the Plans page was opened
  "trial_view", // the free trial offer was shown to someone who can still have it
  "trial_click", // they pressed a button to start the free trial
  "checkout_start", // they went on to Stripe checkout (trial or not)
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const isFunnelEvent = (v: unknown): v is FunnelEvent => typeof v === "string" && (FUNNEL_EVENTS as readonly string[]).includes(v);

const sent = new Set<string>();

/**
 * Count one step. Fire and forget; failures are ignored. Nothing is stored in the browser: the same event is only sent
 * once per page load (a module-level Set), and the request carries no identifier.
 */
export function track(event: FunnelEvent, opts: { oncePerLoad?: boolean } = {}) {
  if (typeof window === "undefined") return;
  if (opts.oncePerLoad) {
    if (sent.has(event)) return;
    sent.add(event);
  }
  try {
    void fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event }), keepalive: true }).catch(() => {});
  } catch {
    /* counting must never get in the way */
  }
}
