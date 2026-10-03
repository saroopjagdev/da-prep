import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { directory } from "@/lib/directory";
import { SECTORS } from "@/lib/sectors";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Degree apprenticeship application calendar",
  description:
    "When employers open and close degree apprenticeship applications, across every sector, taken from each employer's researched guide with the date it was last checked.",
  path: "/calendar",
});

export default function Calendar() {
  // Only employers with a researched guide carry dates. Each employer appears once, under its first matching sector.
  const rows = directory().filter((e) => e.slug && (e.timing || e.closing));
  const seen = new Set<string>();
  const groups = SECTORS.map((s) => ({
    sector: s,
    rows: rows.filter((e) => {
      if (seen.has(e.name) || !e.sectors.includes(s.id)) return false;
      seen.add(e.name);
      return true;
    }),
  })).filter((g) => g.rows.length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Application calendar", path: "/calendar" }])} />
      <div className="space-y-2">
        <h1 className="page-title">Application calendar</h1>
        <p className="lead">
          When employers open and close applications, taken from each employer&apos;s researched guide. Dates move every
          year and many employers close early once they have enough applicants, so treat this as a guide and confirm on
          the employer&apos;s own page.
        </p>
        <p className="text-sm text-muted">
          Banks and accountancy firms also have a{" "}
          <Link href="/sectors/finance/calendar" className="underline">
            month-by-month finance calendar
          </Link>
          . We have not yet gathered dated month-by-month history for other sectors.
        </p>
      </div>
      {groups.map(({ sector, rows: list }) => (
        <section key={sector.id} className="space-y-2" aria-labelledby={`cal-${sector.id}`}>
          <h2 id={`cal-${sector.id}`} className="text-xl font-semibold">
            <Link href={`/sectors/${sector.id}`} className="underline">
              {sector.name}
            </Link>
          </h2>
          <ul className="card divide-y divide-line px-4">
            {list.map((e) => (
              <li key={e.name} className="space-y-0.5 py-3 text-sm">
                <Link href={`/employers/${e.slug}`} className="font-semibold underline">
                  {e.name}
                </Link>
                {e.timing && (
                  <p>
                    <span className="font-medium">Opens:</span> {e.timing}
                  </p>
                )}
                {e.closing && (
                  <p>
                    <span className="font-medium">Closes:</span> {e.closing}
                  </p>
                )}
                {e.verified && <p className="text-xs text-muted">Researched {e.verified}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
