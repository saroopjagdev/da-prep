import Link from "next/link";
import { FIRMS } from "@/lib/firms";
import { isFinanceFirm } from "@/lib/firms/context";
import { getMock } from "@/lib/mockprocess/definitions";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Finance degree apprenticeships",
  description: "Who offers finance degree apprenticeships in the UK, when applications open, common myths, and mock processes for the big banks.",
  path: "/finance",
});

const LINKS = [
  { href: "/finance/calendar", title: "Season calendar", body: "When banks, accountancy firms and regulators open and close, month by month." },
  { href: "/finance/myths", title: "Myths, checked", body: "Grades, fees, pay, degrees, deadlines and AI: what's actually true." },
  { href: "/mock", title: "Bank mock processes", body: "Goldman Sachs, J.P. Morgan, Morgan Stanley, Bank of America and HSBC, stage by stage." },
  { href: "/interview", title: "Finance interview practice", body: "Pick a bank and programme, then practise commercial awareness, technical and ethics questions." },
];

export default function FinanceHub() {
  const banks = FIRMS.filter(isFinanceFirm);
  const accountancy = FIRMS.filter((f) => /professional services/i.test(f.sector));
  const row = (f: (typeof FIRMS)[number]) => (
    <li key={f.slug} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-2 last:border-0">
      <span>
        <Link href={`/employers/${f.slug}`} className="font-semibold underline">
          {f.name}
        </Link>
        <span className="block text-sm text-muted">{f.programmes.map((p) => p.name.split("(")[0].trim()).slice(0, 3).join(" · ")}</span>
      </span>
      {getMock(f.slug) && (
        <Link href={`/mock/${f.slug}`} className="chip text-xs">
          Mock process
        </Link>
      )}
    </li>
  );
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="page-title">Degree apprenticeships in finance</h1>
        <p className="lead">
          Banks, accountancy firms and regulators all hire school leavers onto degree apprenticeships. Applications open
          early, places are few, and the process looks a lot like graduate recruitment. Here&apos;s where to start.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="card block h-full space-y-1 p-4 hover:border-brand-500">
              <span className="font-semibold">{l.title}</span>
              <span className="block text-sm text-muted">{l.body}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Banks, insurers and regulators with researched guides</h2>
        <p className="text-sm text-muted">
          Each guide covers the process stage by stage, dates, entry grades and what we couldn&apos;t verify.
        </p>
        <ul className="card px-4">{banks.map(row)}</ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Accountancy and professional services</h2>
        <ul className="card px-4">{accountancy.map(row)}</ul>
      </section>

      <p className="text-sm">
        Some well-known names (such as BlackRock, BNP Paribas, Lazard and Nomura) don&apos;t run a UK degree-level
        apprenticeship. See the{" "}
        <Link href="/employers#no-degree" className="underline">
          list of finance firms without a degree route
        </Link>
        .
      </p>
    </div>
  );
}
