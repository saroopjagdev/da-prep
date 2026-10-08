"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { track } from "@/lib/funnel";
import { FREE_INTERVIEWS, FREE_PRACTICE_PER_WEEK, FREE_REVIEWS, PRO_PLAN, TRIAL_DAYS } from "@/lib/plans";

const PERKS = [
  `${FREE_PRACTICE_PER_WEEK} practice tests a week`,
  `${FREE_REVIEWS} CV and statement reviews a week`,
  `${FREE_INTERVIEWS} AI mock interview a week, marked out of 100`,
  "Your tracker, saved and synced across devices",
  `A free ${TRIAL_DAYS}-day trial of Pro (card needed, then ${PRO_PLAN.price} unless you cancel)`,
  "Your scores and progress, kept for you",
];

/**
 * Wraps a tool that needs an account. Signed-in people see the tool; everyone else sees what a free account gives them.
 * When accounts are not configured (local development, self-hosting) the tool is simply shown. The page around it stays
 * server-rendered, so search engines still read what the tool is.
 */
export default function RequireAccount({ what, children, preview, heading: Heading = "h1" }: { what: string; children: React.ReactNode; /** The page's main heading is the sign-up prompt unless the preview brings its own. */ heading?: "h1" | "h2"; /** Server-rendered text shown with the sign-up card, so the page still describes itself to search engines. */ preview?: React.ReactNode }) {
  const { enabled, ready, user } = useAuth();
  const gated = enabled && ready && !user;
  useEffect(() => {
    if (gated) track("gate_view", { oncePerLoad: true });
  }, [gated]);
  if (!enabled || user) return <>{children}</>;
  if (!ready) return <div aria-busy="true">{preview}</div>;
  return (
    <div className="space-y-6">
    <section className="card mx-auto max-w-xl space-y-4 p-6" aria-label="Create a free account">
      <div className="space-y-1">
        <Heading className="text-xl font-bold tracking-tight">Create a free account to {what}</Heading>
        <p className="text-sm text-muted">It takes a minute and needs no card: an email and a password. You must be 16 or over.</p>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {PERKS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link href="/login" className="btn btn-primary">
          Create a free account
        </Link>
        <Link href="/opportunities" className="btn btn-secondary">
          See who is open
        </Link>
      </div>
      <p className="text-xs text-muted">Already have one? Use the same link to sign in. Pro (£9.99 a month) adds unlimited practice and AI mock interviews.</p>
    </section>
    {preview}
    </div>
  );
}

