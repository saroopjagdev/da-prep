"use client";

import Link from "next/link";
import { useUsage } from "@/components/useUsage";
import { track } from "@/lib/funnel";
import { PRO_PLAN } from "@/lib/plans";

export type MockPreview = {
  /** Each stage in order, with how it is run (for example "Timed practice test"). */
  stages: { name: string; how: string }[];
  /** One real prompt from the process, so a free member sees the quality of what Pro runs. */
  sample: { stage: string; text: string } | null;
};

/**
 * Shown above a firm mock process to free members only: what the process contains and one sample question, so the
 * value is visible before the first marked stage asks for Pro. Nothing is shown to Pro members or when limits are off.
 */
export default function MockProPreview({ firmName, preview }: { firmName: string; preview: MockPreview }) {
  const usage = useUsage();
  if (!usage || usage.plan !== "free" || !usage.enforced) return null;
  return (
    <section className="card mx-auto mb-4 max-w-xl space-y-3 border-brand-600 bg-brand-50 p-5" aria-label="Part of Pro">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold tracking-tight">Run the whole {firmName} process</h2>
        <span className="rounded bg-sun-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sun-700">Pro</span>
      </div>
      <p className="text-sm">You can see every stage here. Running them, timed like the real thing and marked, is part of Pro.</p>
      <ol className="space-y-1 text-sm">
        {preview.stages.map((s, i) => (
          <li key={s.name} className="flex gap-2">
            <span className="w-5 shrink-0 text-muted">{i + 1}.</span>
            <span>
              <span className="font-medium">{s.name}</span> <span className="text-muted">{s.how}</span>
            </span>
          </li>
        ))}
      </ol>
      {preview.sample && (
        <div className="rounded-lg bg-white p-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Sample question: {preview.sample.stage}</p>
          <p className="mt-1">{preview.sample.text}</p>
        </div>
      )}
      <Link href="/pricing" onClick={() => track("pro_offer_click", { label: "mock-preview" })} className="btn btn-primary w-full justify-center sm:w-auto">
        Unlock Pro: {PRO_PLAN.price}
      </Link>
    </section>
  );
}
