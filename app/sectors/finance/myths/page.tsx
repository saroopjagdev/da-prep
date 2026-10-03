import Link from "next/link";
import { FINANCE_MYTHS } from "@/lib/finance";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Finance degree apprenticeship myths",
  description: "Common myths about finance degree apprenticeships (grades, fees, pay, degrees, AI and deadlines) checked against sources.",
  path: "/sectors/finance/myths",
});

export default function FinanceMyths() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Link className="text-sm underline" href="/sectors/finance">
          Finance
        </Link>
        <h1 className="page-title">Finance degree apprenticeship myths</h1>
        <p className="lead">Things people often believe about finance degree apprenticeships, checked against sources.</p>
      </div>
      <ul className="space-y-4">
        {FINANCE_MYTHS.map((m) => (
          <li key={m.myth} className="card space-y-2 p-4">
            <h2 className="font-semibold">
              <span className="text-coral-600">Myth:</span> {m.myth}
            </h2>
            <p className="text-sm">
              <strong className="text-mint-600">Reality:</strong> {m.reality}
            </p>
            <p className="flex flex-wrap gap-x-3 text-xs">
              Sources:
              {m.sources.map((s) => (
                <a key={s.href} className="underline" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
