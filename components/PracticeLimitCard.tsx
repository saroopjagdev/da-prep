import Link from "next/link";
import { TrialCta, TrialFinePrint } from "@/components/TrialOffer";

/** Shown instead of a practice test when the free weekly allowance is used up. */
export default function PracticeLimitCard({ limit }: { limit: number }) {
  return (
    <section className="card mx-auto max-w-xl space-y-3 p-6 text-center" aria-label="Free practice used">
      <h2 className="text-xl font-bold tracking-tight">You have used your {limit} free practice tests this week</h2>
      <p className="text-sm text-muted">They reset on Monday. Pro gives unlimited practice tests and AI mock interviews marked out of 100, and every firm mock process. You also get 1 free mock interview a week.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <TrialCta where="practice-limit" />
        <Link href="/opportunities" className="btn btn-secondary">
          See who is open
        </Link>
      </div>
      <TrialFinePrint />
    </section>
  );
}
