"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import { CONTACT, OPERATOR, PLANS, type PlanId } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

const FREE = [
  "2 AI mock interviews a month",
  "2 statement or answer reviews a week",
  "Unlimited practice tests, tracker, stories bank, guides",
  "Progress history",
];
const PRO = [
  "AI mock interviews and firm mock processes, within fair-use limits (up to 25 marked interviews a day)",
  "Statement and answer reviews, within fair-use limits (up to 40 a day)",
  "Everything in Free",
];

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Pre-contract information and the cancellation wording are a draft for legal review before launch (docs/LAUNCH.md).
export default function Pricing() {
  const { enabled, user } = useAuth();
  const [profile, setProfile] = useState<{ plan: "free" | "pro"; pro_until: string | null } | null>(null);
  const [choice, setChoice] = useState<PlanId>("pass");
  const [payerAdult, setPayerAdult] = useState(false);
  const [startNow, setStartNow] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Reading the URL needs the browser, so this can't be initial state without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess(new URLSearchParams(window.location.search).get("success"));
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase()
      ?.from("profiles")
      .select("plan, pro_until")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile({ plan: (data?.plan as "free" | "pro") ?? "free", pro_until: (data?.pro_until as string | null) ?? null }));
  }, [user]);

  const subscribed = profile?.plan === "pro";
  const passUntil = profile?.pro_until && new Date(profile.pro_until) > new Date() ? profile.pro_until : null;
  const ready = payerAdult && startNow && acceptTerms;

  async function checkout() {
    setError("");
    setBusy(true);
    try {
      const { url } = await postJson<{ url: string }>("/api/stripe/checkout", { plan: choice, payerAdult, startNow, acceptTerms });
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

  const plan = PLANS[choice];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="page-title">Plans</h1>
      {success && (
        <p role="status" className="callout bg-mint-50 text-mint-600">
          Thanks! Your {success === "pass" ? "3-month pass" : "Pro plan"} will be active within a minute or two.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <section className="card space-y-2 p-4">
          <h2 className="font-semibold">Free</h2>
          <p className="text-2xl font-bold">£0</p>
          <ul className="list-disc pl-5 text-sm">
            {FREE.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        {(Object.keys(PLANS) as PlanId[]).map((id) => (
          <label
            key={id}
            className={`card block cursor-pointer space-y-2 p-4 ${choice === id ? "ring-2 ring-brand-500" : ""}`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-semibold">{PLANS[id].name}</span>
              <input type="radio" name="plan" className="h-4 w-4 accent-brand-600" checked={choice === id} onChange={() => setChoice(id)} />
            </span>
            <span className="block text-2xl font-bold">{PLANS[id].price}</span>
            <span className="block text-sm text-muted">{PLANS[id].summary}</span>
            <ul className="list-disc pl-5 text-sm">
              {PRO.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </label>
        ))}
      </div>

      {subscribed ? (
        <section className="card space-y-2 p-4">
          <p className="font-medium text-mint-600">You&apos;re on Pro monthly.</p>
          <button onClick={manage} className="btn btn-secondary">
            Manage or cancel subscription
          </button>
        </section>
      ) : !(enabled && user) ? (
        <p className="text-sm text-muted">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          to buy Pro.
        </p>
      ) : (
        <section className="card space-y-4 p-5" aria-labelledby="before-you-pay">
          {passUntil && (
            <p className="callout bg-mint-50 text-mint-600">
              Your 3-month pass runs until {fmtDate(passUntil)}. Another pass adds 3 months to the end of it.
            </p>
          )}
          <h2 id="before-you-pay" className="text-lg font-semibold">
            Before you pay
          </h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="font-semibold">You&apos;re buying</dt>
            <dd>
              {plan.name}: {plan.price}. Prices are in pounds sterling.
            </dd>
            <dt className="font-semibold">What you get</dt>
            <dd>{PRO.slice(0, 2).join(". ")}.</dd>
            <dt className="font-semibold">How billing works</dt>
            <dd>{plan.summary}</dd>
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
              <span>
                The person paying is 18 or over. (If you&apos;re under 18, ask a parent or guardian to pay.)
              </span>
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
          <button onClick={checkout} disabled={!ready || busy} className="btn btn-primary">
            {busy ? "Opening secure payment…" : `Continue to payment: ${plan.price}`}
          </button>
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
