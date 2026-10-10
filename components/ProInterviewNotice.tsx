"use client";

import Link from "next/link";
import UnlockProgress from "@/components/UnlockProgress";
import { useUsage } from "@/components/useUsage";
import { PRO_PLAN } from "@/lib/plans";

/**
 * Up-front notice for a signed-in free member, so they learn what is free before they start.
 * "interview": the free mock interviews and what is left of them. "mock": firm mock processes are part of Pro.
 */
export default function ProInterviewNotice({ kind = "interview" }: { kind?: "interview" | "mock" }) {
  const usage = useUsage();
  if (!usage || usage.plan !== "free" || !usage.enforced || !usage.interviews) return null;
  const { used, limit } = usage.interviews;
  const left = Math.max(0, limit - used);

  if (kind === "mock") {
    return (
      <p role="note" className="callout bg-sun-50 text-sm">
        Firm mock processes are part of Pro ({PRO_PLAN.price}).{" "}
        <Link href="/pricing" className="font-semibold underline">
          See Pro
        </Link>
        . You can still read every guide, take practice tests and use{" "}
        {limit > 0 ? (
          <>
            your free mock interviews (<Link href="/interview" className="underline">start one</Link>).
          </>
        ) : (
          "the free plan's tools."
        )}
      </p>
    );
  }

  if (limit === 0) {
    return (
      <p role="note" className="callout bg-sun-50 text-sm">
        AI mock interviews are part of Pro ({PRO_PLAN.price}).{" "}
        <Link href="/pricing" className="font-semibold underline">
          See Pro
        </Link>
        .
      </p>
    );
  }
  return (
    <p role="note" className={`callout text-sm ${left > 0 ? "bg-brand-50" : "bg-sun-50"}`}>
      {left > 0
        ? `You have ${left} free marked mock interview${left === 1 ? "" : "s"} left, with feedback out of 100. `
        : "You've used your free mock interviews. "}
      Pro gives unlimited mock interviews and every firm mock process.{" "}
      <Link href="/pricing" className="font-semibold underline">
        See Pro
      </Link>
      .
      {left === 0 && <UnlockProgress className="mt-2" />}
    </p>
  );
}
