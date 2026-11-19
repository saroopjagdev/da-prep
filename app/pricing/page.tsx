"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import ParentShare from "@/components/ParentShare";
import StudentComments from "@/components/StudentComments";
import { postJson } from "@/lib/api";
import { track } from "@/lib/funnel";
import {
  BONUS_EXTRA,
  FREE_GAMES,
  FREE_INTERVIEWS,
  FREE_PRACTICE,
  FREE_REVIEWS,
  FREE_STORIES,
  PASS_PER_MONTH_PENCE,
  PASS_PLAN,
  PASS_SAVING_PENCE,
  PRO_PLAN,
  passOffered,
} from "@/lib/plans";
import { supabase } from "@/lib/supabase";

const pounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;

// The cards say the point in a line each; the detail sits in the comparison table below them.
const FREE_POINTS = [
  "Your own tracker and deadline emails",
  `${FREE_PRACTICE} practice test, ${FREE_INTERVIEWS} marked mock interview, ${FREE_REVIEWS} CV review, ${FREE_GAMES} game round and ${FREE_STORIES} AI-drafted story`,
  `${BONUS_EXTRA} more of each when you do any two of: apply through the tracker, take a mock interview, start a practice test`,
];
const PRO_POINTS = ["Unlimited practice tests and games", "AI mock interviews and CV reviews, within fair use", "Every firm mock process, stage by stage"];
const COMPARE: [string, string, string][] = [
  ["Tracker, deadline emails, employer guides", "Included", "Included"],
  ["Practice tests", `${FREE_PRACTICE} (+${BONUS_EXTRA})`, "Unlimited"],
  ["Mock interviews, marked out of 100", `${FREE_INTERVIEWS} (+${BONUS_EXTRA})`, "Up to 25 a day"],
  ["CV and statement reviews, AI stories", `${FREE_REVIEWS} (+${BONUS_EXTRA})`, "Up to 40 a day"],
  ["Practice games", `${FREE_GAMES} (+${BONUS_EXTRA})`, "Unlimited"],
  ["Firm mock processes", "Not included", "Included"],
];

// Pre-contract information and the cancellation wording are a draft for legal review before launch (docs/LAUNCH.md).
export default function Pricing() {
  const { enabled, user } = useAuth();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  // When the end date is set the plan is a Season Pass (nothing to cancel); monthly subscribers have none.
  const [proUntil, setProUntil] = useState<string | null>(null);
  // The Season Pass is offered first when it is switched on: it is the fit for a student who needs Pro for one application season.
  const [choice, setChoice] = useState<"monthly" | "pass">(passOffered() ? "pass" : "monthly");
  const [startNow, setStartNow] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Reading the URL needs the browser, so this can't be initial state without a hydration mismatch.
    const back = new URLSearchParams(window.location.search).has("success");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess(back);
    track("pricing_view", { oncePerLoad: true });
    // Back from the payment page. The server counts pro_started when the payment is confirmed; this is the browser's side of it.
    if (back) track("checkout_return", { oncePerLoad: true });
  }, []);

  useEffect(() => {
    if (!user) return;
    const sb = supabase();
    sb?.from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setPlan((data?.plan as "free" | "pro") ?? "free"));
    // The pass end date is a separate read: it lives in a column added by the Season Pass migration, and if that is not
    // there yet this just returns nothing, so a Pro member is never shown as free because of it.
    sb?.from("profiles")
      .select("pro_until")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProUntil((data?.pro_until as string | null) ?? null));
  }, [user]);

  const ready = startNow && acceptTerms;
  const pass = choice === "pass" && passOffered();

  async function checkout() {
    setError("");
    setBusy(true);
    track("checkout_start");
    try {
      const { url } = await postJson<{ url: string }>("/api/stripe/checkout", { startNow, acceptTerms, plan: choice });
      window.location.href = url;
    } catch (e) {
      // The label is the HTTP status, or "network" when the request never got an answer. The server counts the reason.
      const status = (e as { status?: number })?.status;
      track("checkout_error", { label: status ? `http-${status}` : "network" });
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
        <p className="lead">Start free. Go Pro when you have specific employers to prepare for.</p>
      </div>
      {success && (
        <p role="status" className="callout bg-mint-50 text-mint-600">
          Thanks! Your Pro plan will be active within a minute or two.
        </p>
      )}

      {passOffered() && (
        <fieldset>
          <legend className="sr-only">Choose how to pay for Pro</legend>
          <div className="inline-flex rounded-xl border border-line bg-white p-1 text-sm" role="radiogroup" aria-label="Choose how to pay for Pro">
            {(
              [
                ["pass", `${PASS_PLAN.name} · ${PASS_PLAN.lengthText}`],
                ["monthly", "Monthly"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1.5 font-semibold focus-within:ring-2 focus-within:ring-brand-500 ${choice === k ? "bg-brand-600 text-white" : "text-ink/75 hover:text-ink"}`}>
                <input type="radio" name="plan" className="sr-only" checked={choice === k} onChange={() => setChoice(k)} />
                {label}
                {k === "pass" && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${choice === k ? "bg-white/20" : "bg-sun-50 text-sun-700"}`}>Best value</span>}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card space-y-2 p-4">
          <h2 className="font-semibold">Free account</h2>
          <p className="text-2xl font-bold">£0</p>
          <p className="text-sm text-muted">No card. Yours to use in total, not renewed each month.</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {FREE_POINTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section className="card space-y-2 p-4 ring-2 ring-brand-500">
          <h2 className="font-semibold">{pass ? `Pro · ${PASS_PLAN.name}` : "Pro"}</h2>
          <p className="text-2xl font-bold">{pass ? `${PASS_PLAN.price} once` : PRO_PLAN.price}</p>
          <p className="text-sm text-muted">
            {pass
              ? `About ${pounds(PASS_PER_MONTH_PENCE)} a month for ${PASS_PLAN.lengthText}. Saves ${pounds(PASS_SAVING_PENCE)} against monthly. No renewal, so nothing to cancel.`
              : "Renews every month until you cancel. Pro stays on until the end of the month you've paid for."}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {PRO_POINTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
            <li>Everything in Free</li>
          </ul>
        </section>
      </div>

      {plan === "pro" ? (
        <section className="card space-y-2 p-4">
          <p className="font-medium text-mint-600">You&apos;re on Pro.</p>
          {proUntil ? (
            <p className="text-sm text-muted">
              Your {PASS_PLAN.name} runs until {new Date(proUntil).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. It does not renew.
            </p>
          ) : (
            <button onClick={manage} className="btn btn-secondary">
              Manage or cancel subscription
            </button>
          )}
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
            {pass
              ? `${PASS_PLAN.name}: ${PASS_PLAN.price} once, Pro for ${PASS_PLAN.lengthText}, no renewal.`
              : `${PRO_PLAN.name}: ${PRO_PLAN.price}, renewing until you cancel, which you can do any time from this page.`}{" "}
            Pro starts as soon as payment goes through. Full details, including your 14-day right to cancel and who you&apos;re buying from, are in the{" "}
            <Link href="/terms" className="underline">
              terms
            </Link>
            .
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
            {busy ? "Opening secure payment…" : `Continue to payment: ${pass ? PASS_PLAN.price : PRO_PLAN.price}`}
          </button>
          {!ready && <p className="text-xs text-muted">Tick both boxes to continue.</p>}
          <p className="text-xs text-muted">Secure payment by Stripe. 14-day right to cancel.</p>
          <div className="border-t border-line pt-3">
            <p className="mb-2 text-sm text-muted">Not paying yourself? Send a parent or guardian a short explanation.</p>
            <ParentShare />
          </div>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="compare">
        <h2 id="compare" className="text-lg font-semibold">
          What each plan includes
        </h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Free and Pro compared</caption>
            <thead className="bg-navy/5 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-3 py-2">
                  &nbsp;
                </th>
                <th scope="col" className="px-3 py-2">
                  Free
                </th>
                <th scope="col" className="px-3 py-2">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([what, free, pro]) => (
                <tr key={what} className="border-t border-line">
                  <th scope="row" className="px-3 py-2 font-medium">
                    {what}
                  </th>
                  <td className="px-3 py-2 text-muted">{free}</td>
                  <td className="px-3 py-2 font-medium">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">(+{BONUS_EXTRA}) means that many more once you do any two of: apply through the tracker, take a mock interview, start a practice test.</p>
      </section>

      <section className="space-y-1" aria-labelledby="who">
        <h2 id="who" className="text-lg font-semibold">
          Is Pro for you?
        </h2>
        <p className="text-sm">
          Free is plenty while you are choosing employers. Go Pro when you have an online test, video interview or assessment centre coming up and want to redo answers until your score moves.
        </p>
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
      </section>

      <StudentComments />

      <section className="space-y-2" aria-labelledby="faq">
        <h2 id="faq" className="text-lg font-semibold">
          Questions
        </h2>
        {[
          ["Can I cancel?", "Yes, any time from this page. Pro stays on until the end of the month you have paid for, and you have a 14-day right to cancel (see the terms)."],
          ["What happens to my tracker if I stop paying?", "Nothing. Your tracker, notes and scores stay on your free account."],
          ["Can a parent or guardian pay for me?", "Yes. The button above sends them a short explanation of what Pro is and how to cancel."],
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
    </div>
  );
}
