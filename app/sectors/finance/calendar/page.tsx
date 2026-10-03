import Link from "next/link";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { FINANCE_CALENDAR } from "@/lib/finance";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Finance degree apprenticeship calendar",
  description: "When banks, accountancy firms and regulators open and close degree apprenticeship applications, month by month, with sources.",
  path: "/sectors/finance/calendar",
});

export default function FinanceCalendar() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Link className="text-sm underline" href="/sectors/finance">
          Finance
        </Link>
        <h1 className="page-title">Finance application calendar</h1>
        <p className="lead">
          When finance employers opened and closed applications in the most recent cycle we could find. Use it to plan,
          not as a promise: dates move every year and many firms close early once they have enough applicants.
        </p>
      </div>
      <p className="callout bg-sun-50">
        The pattern: accountancy firms and several banks open between late August and October, many fill or close by
        January, and a few (Bank of America, the FCA, NatWest) run later. If a firm reviews applications on a rolling
        basis, applying in the first weeks gives you the best chance.
      </p>
      <ol className="space-y-4">
        {FINANCE_CALENDAR.map((m) => (
          <li key={m.month} className="card space-y-3 p-4">
            <h2 className="font-semibold">{m.month}</h2>
            <ul className="space-y-3 text-sm">
              {m.entries.map((e) => (
                <li key={e.firm + e.text} className="space-y-1">
                  <p>
                    <strong>{e.slug ? <Link href={`/employers/${e.slug}`} className="underline">{e.firm}</Link> : e.firm}:</strong> {e.text}
                  </p>
                  <p className="flex items-center gap-2">
                    <ConfidenceBadge c={e.confidence} />
                    <a className="text-xs underline" href={e.source} target="_blank" rel="noreferrer">
                      source
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">
        Track your own dates in the <Link href="/tracker" className="underline">application tracker</Link>, which can
        export them to your calendar.
      </p>
    </div>
  );
}
