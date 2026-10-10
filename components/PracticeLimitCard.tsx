import Link from "next/link";
import UnlockProgress from "@/components/UnlockProgress";

/** Shown instead of a practice test when the free allowance is used up. */
export default function PracticeLimitCard({ limit }: { limit: number }) {
  return (
    <section className="card mx-auto max-w-xl space-y-3 p-6 text-center" aria-label="Free practice used">
      <h2 className="text-xl font-bold tracking-tight">You have used your {limit} free practice test{limit === 1 ? "" : "s"}</h2>
      <p className="text-sm text-muted">Pro gives unlimited practice tests and AI mock interviews marked out of 100, and every firm mock process.</p>
      <UnlockProgress className="mx-auto max-w-sm text-left" />
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
