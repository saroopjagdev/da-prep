import Link from "next/link";

/** Shown instead of a practice test when the free weekly allowance is used up. */
export default function PracticeLimitCard({ limit }: { limit: number }) {
  return (
    <section className="card mx-auto max-w-xl space-y-3 p-6 text-center" aria-label="Free practice used">
      <h2 className="text-xl font-bold tracking-tight">You have used your {limit} free practice tests this week</h2>
      <p className="text-sm text-muted">They reset on Monday. Pro gives unlimited practice tests, AI mock interviews and firm mock processes.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/pricing" className="btn btn-primary">
          See Pro
        </Link>
        <Link href="/opportunities" className="btn btn-secondary">
          See who is open
        </Link>
      </div>
    </section>
  );
}
