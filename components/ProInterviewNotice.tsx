"use client";

import Link from "next/link";
import { useUsage } from "@/components/useUsage";

/** Up-front notice for a signed-in free member on a page that needs an AI mock interview, so they learn it is Pro before they try. */
export default function ProInterviewNotice() {
  const usage = useUsage();
  if (!usage || usage.plan !== "free" || !usage.enforced || !usage.interviews || usage.interviews.limit > 0) return null;
  return (
    <p role="note" className="callout bg-sun-50 text-sm">
      AI mock interviews and firm mock processes are part of Pro (£9.99 a month).{" "}
      <Link href="/pricing" className="font-semibold underline">
        See Pro
      </Link>
      . Practice tests, the opportunities tracker, employer guides and CV and statement review are on the free plan.
    </p>
  );
}
