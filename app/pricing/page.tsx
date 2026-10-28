"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import ParentShare from "@/components/ParentShare";
import { postJson } from "@/lib/api";
import { track } from "@/lib/funnel";
import { BONUS_EXTRA, FREE_INTERVIEWS, FREE_PRACTICE, FREE_REVIEWS, PRO_PLAN } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

const FREE = [
  `${FREE_PRACTICE} practice test`,
  `${FREE_REVIEWS} CV, cover letter or statement review`,
  `${FREE_INTERVIEWS} AI mock interview, marked out of 100 with feedback`,
  `${BONUS_EXTRA} more of each when you do any two of: apply through the tracker, take a mock interview, start a practice test`,
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
  const [startNow, setStartNow] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Reading the URL needs the browser, so this can't be initial state without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess(new URLSearchParams(window.location.search).has("success"));
    track("pricing_view", { oncePerLoad: true });
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

  const ready = startNow && acceptTerms;

  async function checkout() {
    setError("");
    setBusy(true);
    track("checkout_start");
    try {
      const { url } = await postJson<{ url: string }>("/api/stripe/checkout", { startNow, acceptTerms });
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
      <div className="space-y-2">
        <h1 className="page-title">Plans</h1>
        <p className="lead">Free is enough to look around, track your applications and try each tool once. Pro is for when you have specific employers to prepare for.</p>
      </div>
      {success && (
        <p role="status" className="callout bg-mint-50 text-mint-600">
          Thanks! Your Pro plan will be active within a minute or two.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card space-y-2 p-4">
          <h2 className="font-semibold">Free account</h2>
          <p className="text-2xl font-bold">£0</p>
          <p className="text-sm text-muted">Needs an email address, no card. These are yours to use in total; they do not renew. The list of who is open and the employer guides need no account; the tracker needs a free one.</p>
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

      <section className="space-y-2" aria-labelledby="who">
        <h2 id="who" className="text-lg font-semibold">
          Is Pro for you?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card space-y-1 p-4">
            <p className="font-semibold">Free is enough if you are</p>
            <ul className="list-disc pl-5 text-sm">
              <li>still choosing which employers to go for</li>
              <li>tracking deadlines and getting alerts</li>
              <li>trying each tool once to see how it works</li>
            </ul>
          </div>
          <div className="card space-y-1 p-4 ring-2 ring-brand-500">
            <p className="font-semibold">Pro is for you if you</p>
            <ul className="list-disc pl-5 text-sm">
              <li>are applying to specific employers and want to run each one&apos;s real stages</li>
              <li>have an online test, video interview or assessment centre coming up</li>
              <li>want to redo answers until your score moves, not see one result</li>
              <li>would rather pay for the weeks you need it: it is monthly and you can cancel any time</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card space-y-2 p-5" aria-labelledby="example">
        <h2 id="example" className="text-lg font-semibold">
          What marked feedback looks like
        </h2>
        <p className="text-xs text-muted">An invented example to show the format, not a real student&apos;s answer.</p>
        <p className="text-sm">
          <strong>Question:</strong> Tell us about a time you worked in a team. <strong>Score: 68 out of 100.</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Strength:</strong> a clear situation and a specific action you took yourself.
          </li>
          <li>
            <strong>To improve:</strong> the result is missing. Say what changed and how you know, with a number if you can.
          </li>
          <li>
            <strong>STAR check:</strong> Situation ✓ Task ✓ Action ✓ Result ✗
          </li>
        </ul>
        <p className="text-sm text-muted">Free accounts get one marked mock interview. Pro gives you as many as you want.</p>
      </section>

      {plan === "pro" ? (
        <section className="card space-y-2 p-4">
          <p className="font-medium text-mint-600">You&apos;re on Pro.</p>
          <button onClick={manage} className="btn btn-secondary">
            Manage or cancel subscription
          </button>
        </section>
      ) : !(enabled && user) ? (
        <section className="card space-y-3 p-4">
          <p className="text-sm">
            Create a free account or sign in to buy Pro. It takes a minute, and the tracker and deadline emails are free.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login?mode=signup" className="btn btn-primary">
              Create a free account or sign in
            </Link>
            <ParentShare />
          </div>
        </section>
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
            . Pro is bought by an adult: you must be 18 or over, or a parent or guardian must have agreed and be paying.
          </p>
          <fieldset className="space-y-2 text-sm">
            <legend className="sr-only">Confirm before paying</legend>
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
          {!ready && <p className="text-xs text-muted">Tick both boxes to continue.</p>}
          <div className="border-t border-line pt-3">
            <p className="mb-2 text-sm text-muted">Not paying yourself? Send a parent or guardian a short explanation.</p>
            <ParentShare />
          </div>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="faq">
        <h2 id="faq" className="text-lg font-semibold">
          Questions
        </h2>
        {[
          ["Can I cancel?", "Yes, any time from this page. Pro stays on until the end of the month you have paid for, and you have a 14-day right to cancel (see the terms)."],
          ["What happens to my tracker if I stop paying?", "Nothing. Your tracker, notes and scores stay on your free account."],
          ["I'm under 18. Can I buy it?", "Pro is bought by an adult, so a parent or guardian must agree and pay. The button above sends them a short explanation."],
          ["Do I need Pro to use the tracker?", "No. The tracker and deadline emails are free with an account."],
        ].map(([q, a]) => (
          <details key={q} className="rounded-lg border border-line px-3 py-2 text-sm">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-muted">{a}</p>
          </details>
        ))}
      </section>
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
