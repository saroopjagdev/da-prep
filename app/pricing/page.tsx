"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import { BONUS_EXTRA, FREE_INTERVIEWS, FREE_PRACTICE, FREE_REVIEWS, PRO_PLAN } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

const FREE = [
  `${FREE_PRACTICE} practice test`,
  `${FREE_REVIEWS} CV, cover letter or statement review`,
  `${FREE_INTERVIEWS} AI mock interview, marked out of 100 with feedback`,
  `${BONUS_EXTRA} more of each when you apply to an employer through the tracker, take a mock interview and start a practice test`,
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

  async function checkout() {
    setError("");
    setBusy(true);
    try {
      const { url } = await postJson<{ url: string }>("/api/stripe/checkout", { payerAdult, startNow, acceptTerms });
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
          Thanks! Your Pro plan will be active within a minute or two.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card space-y-2 p-4">
          <h2 className="font-semibold">Free account</h2>
          <p className="text-2xl font-bold">£0</p>
          <p className="text-sm text-muted">Needs an email address, no card. These are yours to use in total; they do not renew. The opportunities tracker and employer guides need no account.</p>
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
          to buy Pro.
        </p>
      ) : (
        <section className="card space-y-4 p-5" aria-labelledby="before-you-pay">
          <h2 id="before-you-pay" className="text-lg font-semibold">
            Before you pay
          </h2>
          <p className="text-sm">
            {PRO_PLAN.name}: {PRO_PLAN.price}, renewing until you cancel. Pro starts as soon as payment goes through, and you can
            cancel any time from this page. Full details, including your 14-day right to cancel and who you&apos;re buying
            from, are in the{" "}
            <Link href="/terms" className="underline">
              terms
            </Link>
            .
          </p>
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
          <button onClick={checkout} disabled={!ready || busy} className="btn btn-primary">
            {busy ? "Opening secure payment…" : `Continue to payment: ${PRO_PLAN.price}`}
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
