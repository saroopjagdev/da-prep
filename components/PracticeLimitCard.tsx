"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/funnel";
import ParentShare from "@/components/ParentShare";
import UnlockProgress from "@/components/UnlockProgress";

/** Shown instead of a practice test when the free allowance is used up. */
export default function PracticeLimitCard({ limit, noun = "practice test", body = "Pro gives unlimited practice tests and AI mock interviews marked out of 100, and every firm mock process." }: { limit: number; /** What was used up, singular (a practice test, a game round). */ noun?: string; body?: string }) {
  useEffect(() => {
    track("limit_hit", { oncePerLoad: true });
  }, []);
  return (
    <section className="card mx-auto max-w-xl space-y-3 p-6 text-center" aria-label={`Free ${noun} used`}>
      <h2 className="text-xl font-bold tracking-tight">You have used your {limit} free {noun}{limit === 1 ? "" : "s"}</h2>
      <p className="text-sm text-muted">{body}</p>
      <UnlockProgress className="mx-auto max-w-sm text-left" />
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/pricing" className="btn btn-primary">
          See Pro
        </Link>
        <ParentShare label="Ask a parent or guardian" />
        <Link href="/opportunities" className="btn btn-secondary">
          See who is open
        </Link>
      </div>
    </section>
  );
}
