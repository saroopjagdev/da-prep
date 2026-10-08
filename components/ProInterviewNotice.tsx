"use client";

import Link from "next/link";
import { TrialCta, TrialFinePrint } from "@/components/TrialOffer";
import { useUsage } from "@/components/useUsage";
import { PRO_PLAN } from "@/lib/plans";

const linkClass = "font-semibold underline";

/**
 * Up-front notice for a signed-in free member, so they learn what is free before they start.
 * "interview": the weekly free mock interview and what is left of it. "mock": firm mock processes are part of Pro.
 * Whoever can still have the free trial of Pro is offered that first.
 */
export default function ProInterviewNotice({ kind = "interview" }: { kind?: "interview" | "mock" }) {
  const usage = useUsage();
  if (!usage || usage.plan !== "free" || !usage.enforced || !usage.interviews) return null;
  const { used, limit } = usage.interviews;
  const left = Math.max(0, limit - used);

  if (kind === "mock") {
    return (
      <div role="note" className="callout bg-sun-50 space-y-1 text-sm">
        <p>
          Firm mock processes are part of Pro ({PRO_PLAN.price}). <TrialCta where="mock-notice" fallback="See Pro" className={linkClass} />.
        </p>
        <TrialFinePrint />
        <p>
          You can still read every guide, take practice tests and use{" "}
          {limit > 0 ? (
            <>
              your free mock interview each week (<Link href="/interview" className="underline">start one</Link>).
            </>
          ) : (
            "the free plan's tools."
          )}
        </p>
      </div>
    );
  }

  if (limit === 0) {
    return (
      <div role="note" className="callout bg-sun-50 space-y-1 text-sm">
        <p>
          AI mock interviews are part of Pro ({PRO_PLAN.price}). <TrialCta where="interview-notice" fallback="See Pro" className={linkClass} />.
        </p>
        <TrialFinePrint />
      </div>
    );
  }
  return (
    <div role="note" className={`callout space-y-1 text-sm ${left > 0 ? "bg-brand-50" : "bg-sun-50"}`}>
      <p>
        {left > 0
          ? `You have ${left} free marked mock interview left this week, with feedback out of 100. `
          : "You've used this week's free mock interview. It resets on Monday. "}
        Pro gives unlimited mock interviews and every firm mock process.{" "}
        <TrialCta where="interview-notice" fallback="See Pro" className={linkClass} />.
      </p>
      <TrialFinePrint />
    </div>
  );
}
