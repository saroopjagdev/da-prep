"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { chargeDate, timeLeft } from "@/components/TrialOffer";
import { useUsage } from "@/components/useUsage";
import { postJson } from "@/lib/api";
import { track } from "@/lib/funnel";
import { CONTACT, FREE_INTERVIEWS, FREE_PRACTICE_PER_WEEK, FREE_REVIEWS, OPERATOR, PRO_PLAN, TRIAL_DAYS } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

const FREE = [
  `${FREE_PRACTICE_PER_WEEK} practice tests a week`,
  `${FREE_REVIEWS} CV, cover letter and statement reviews a week`,
  `${FREE_INTERVIEWS} AI mock interview a week, marked out of 100 with feedback`,
  "Your own tracker, saved and synced",
  "Your scores and progress, kept for you",
];
const PRO = [
  "Unlimited practice tests",
  "Unlimited AI mock interviews, within fair-use limits (up to 25 marked interviews a day)",
  "Every firm mock process, stage by stage",
  "CV and statement review, within fair-use limits (up to 40 a day)",
  "Everything in Free",
];

// Pre-contract information and the cancellation wording are a draft for legal review before launch (docs/LAUNCH.md).
export default function Pricing() {
  const { enabled, user } = useAuth();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [payerAdult, setPayerAdult] = useState(false);
  const [startNow, setStartNow] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const usage = useUsage();
  const trialEligible = Boolean(usage?.trial?.eligible);
  const trialEndsAt = usage?.plan === "pro" ? usage.trial?.endsAt : undefined;
  // When the card would first be charged if the trial started now. Needs the browser's clock, so it is set after mount.
  const [chargeAt, setChargeAt] = useState("");

  useEffect(() => {
    track("pricing_view", { oncePerLoad: true });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock only exists in the browser
    setChargeAt(new Date(Date.now() + TRIAL_DAYS * 86_400_000).toISOString());
  }, []);

  useEffect(() => {
    // Reading the URL needs the browser, so this can't be initial state without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess(new URLSearchParams(window.location.search).has("success"));
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase()
      ?.from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setPlan((data?.plan as "free" | "pro") ?? "free"));
  }, [user]);

  const ready = payerAdult && startNow && acceptTerms;

  async function checkout(trial: boolean) {
    setError("");
    setBusy(true);
    try {
      track("checkout_start");
      const { url } = await postJson<{ url: string }>("/api/stripe/checkout", { payerAdult, startNow, acceptTerms, trial });
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  async function manage() {
    setError("");
    try {
      const { url } = await postJson<{ url: string }>("/api/stripe/portal");
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="page-title">Plans</h1>
      {success && (
        <p role="status" className="callout bg-mint-50 text-mint-600">
          {typeof window !== "undefined" && new URLSearchParams(window.location.search).has("trial")
            ? `Your ${TRIAL_DAYS}-day free trial is starting. Pro will be active within a minute or two.`
            : "Thanks! Your Pro plan will be active within a minute or two."}
        </p>
      )}
      {trialEligible && enabled && user && (
        <section className="card space-y-2 border-brand-600 bg-brand-50 p-5" aria-label="Free trial of Pro">
          <h2 className="text-xl font-bold tracking-tight">Try Pro free for {TRIAL_DAYS} days</h2>
          <p className="text-sm">
            Unlimited practice tests, unlimited AI mock interviews and every firm mock process, on top of everything in Free.
            You enter a card to start. {TRIAL_DAYS} days free, then {PRO_PLAN.price} unless you cancel before the trial ends.
          </p>
        </section>
      )}
      {trialEndsAt && (
        <section role="status" className="card space-y-1 border-brand-600 bg-brand-50 p-5">
          <h2 className="text-lg font-bold">You&apos;re on the free trial: {timeLeft(trialEndsAt)} left</h2>
          <p className="text-sm">
            Your card is charged {PRO_PLAN.price.replace(" a month", "")} on {chargeDate(trialEndsAt)}, then every month, unless you cancel before then.
          </p>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card space-y-2 p-4">
          <h2 className="font-semibold">Free account</h2>
          <p className="text-2xl font-bold">£0</p>
          <p className="text-sm text-muted">Needs an email address, no card. The opportunities tracker and employer guides need no account.</p>
          <ul className="list-disc pl-5 text-sm">
            {FREE.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section className="card space-y-2 p-4 ring-2 ring-brand-500">
          <h2 className="font-semibold">{PRO_PLAN.name}</h2>
          <p className="text-2xl font-bold">{PRO_PLAN.price}</p>
          <p className="text-sm text-muted">{PRO_PLAN.summary}</p>
          <ul className="list-disc pl-5 text-sm">
            {PRO.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      </div>

      {plan === "pro" ? (
        <section className="card space-y-2 p-4">
          <p className="font-medium text-mint-600">You&apos;re on Pro.</p>
          <button onClick={manage} className="btn btn-secondary">
            Manage or cancel subscription
          </button>
        </section>
      ) : !(enabled && user) ? (
        <p className="text-sm text-muted">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          to start your free {TRIAL_DAYS}-day Pro trial or buy Pro.
        </p>
      ) : (
        <section className="card space-y-4 p-5" aria-labelledby="before-you-pay">
          <h2 id="before-you-pay" className="text-lg font-semibold">
            Before you pay
          </h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="font-semibold">You&apos;re buying</dt>
            <dd>
              {PRO_PLAN.name}: {PRO_PLAN.price}. Prices are in pounds sterling.
            </dd>
            {trialEligible && (
              <>
                <dt className="font-semibold">Free trial</dt>
                <dd>
                  {TRIAL_DAYS} days free if you start with the trial. You enter a card now.{" "}
                  {chargeAt
                    ? `If you do not cancel before ${chargeDate(chargeAt)}, your card is charged ${PRO_PLAN.price.replace(" a month", "")} then, and every month after, until you cancel.`
                    : `If you do not cancel before the trial ends, your card is charged ${PRO_PLAN.price.replace(" a month", "")}, and every month after, until you cancel.`}{" "}
                  You can cancel any time from this page. The free trial is once per person.
                </dd>
              </>
            )}
            <dt className="font-semibold">What you get</dt>
            <dd>{PRO.slice(0, 3).join(". ")}.</dd>
            <dt className="font-semibold">How billing works</dt>
            <dd>{PRO_PLAN.summary}</dd>
            <dt className="font-semibold">Starting and cancelling</dt>
            <dd>
              Pro starts as soon as payment goes through. You have 14 days to cancel. Because you&apos;re asking Pro to
              start straight away, if you cancel within those 14 days we&apos;ll refund you minus a fair amount for the
              time you&apos;ve already had Pro.
            </dd>
            <dt className="font-semibold">Who you&apos;re buying from</dt>
            <dd>
              {OPERATOR}
              {CONTACT && (
                <>
                  {" "}
                  · <a href={`mailto:${CONTACT}`} className="underline">{CONTACT}</a>
                </>
              )}
              . Payments are handled securely by Stripe; we never see your card details.
            </dd>
          </dl>
          <fieldset className="space-y-2 text-sm">
            <legend className="sr-only">Confirm before paying</legend>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 accent-brand-600" checked={payerAdult} onChange={(e) => setPayerAdult(e.target.checked)} />
              <span>The person paying is 18 or over. (If you&apos;re under 18, ask a parent or guardian to pay.)</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 accent-brand-600" checked={startNow} onChange={(e) => setStartNow(e.target.checked)} />
              <span>
                I want Pro to start straight away, and I understand that if I cancel within 14 days I&apos;ll get a refund
                minus a fair amount for the time I&apos;ve used.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 accent-brand-600" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              <span>
                I&apos;ve read this summary and agree to the{" "}
                <Link href="/terms" className="underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  privacy notice
                </Link>
                .
              </span>
            </label>
          </fieldset>
          <div className="flex flex-wrap items-center gap-3">
            {trialEligible ? (
              <>
                <button onClick={() => checkout(true)} disabled={!ready || busy} className="btn btn-primary">
                  {busy ? "Opening secure payment…" : `Start my ${TRIAL_DAYS}-day free trial`}
                </button>
                <button onClick={() => checkout(false)} disabled={!ready || busy} className="btn btn-secondary">
                  Subscribe now without the trial: {PRO_PLAN.price}
                </button>
              </>
            ) : (
              <button onClick={() => checkout(false)} disabled={!ready || busy} className="btn btn-primary">
                {busy ? "Opening secure payment…" : `Continue to payment: ${PRO_PLAN.price}`}
              </button>
            )}
          </div>
          {!ready && <p className="text-xs text-muted">Tick all three boxes to continue.</p>}
        </section>
      )}
      {error && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {error}
        </p>
      )}
      <p className="text-xs text-muted">
        Limits and payments only apply when this site is configured with accounts and payments. Otherwise everything is
        free.
      </p>
    </div>
  );
}
