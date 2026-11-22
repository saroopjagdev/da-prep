import Link from "next/link";
import { notFound } from "next/navigation";
import FinanceSection from "@/components/FinanceSection";
import SectorPicker from "@/components/SectorPicker";
import { EMPLOYERS } from "@/lib/employers";
import { levelInfo } from "@/lib/level-label";
import { STATUS_LABEL, opportunityRows } from "@/lib/opportunities";
import { CATEGORY_INFO } from "@/lib/questions";
import { SECTOR_BY_ID, SECTOR_IDS, type SectorId } from "@/lib/sectors";
import { pageMeta } from "@/lib/site";

// Status follows the calendar, so rebuild hourly (the same as the tracker and deadlines pages).
export const revalidate = 86400;

export function generateStaticParams() {
  return SECTOR_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = SECTOR_BY_ID[slug as SectorId];
  if (!s) return { title: "Sector" };
  return pageMeta({
    title: `${s.name} degree apprenticeships 2027: employers, dates and how to apply`,
    description: `${s.blurb} Which ${s.name.toLowerCase()} employers run apprenticeships for 2027, what level each offers, who is open now, and what employers test.`,
    path: `/sectors/${s.id}`,
  });
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = SECTOR_BY_ID[slug as SectorId];
  if (!sector) notFound();
  const employers = EMPLOYERS.filter((e) => e.sectors.includes(sector.id));
  const ORDER = {
    open: 0,
    "opening-soon": 1,
    "not-announced": 2,
    "not-confirmed": 3,
    closed: 4,
  } as const;
  const rows = opportunityRows(new Date())
    .filter((r) => r.sectors.includes(sector.id))
    .sort(
      (a, b) =>
        ORDER[a.status] - ORDER[b.status] || a.name.localeCompare(b.name),
    );
  const openNow = rows.filter((r) => r.status === "open").length;
  const degreeRows = rows.filter((r) => levelInfo(r).tone === "degree").length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <Link href="/sectors" className="text-sm font-semibold text-brand-600">
          ← All sectors
        </Link>
        <h1 className="page-title">{sector.name}</h1>
        <p className="lead">{sector.blurb}</p>
        <SectorPicker id={sector.id} />
      </div>

      <section className="card space-y-2 p-5">
        <h2 className="font-bold">Example degree apprenticeships</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {sector.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Names and levels change. Check the current standard on IfATE and the
          advert.
        </p>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="font-bold">What&apos;s different in this sector</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {sector.differs.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Show these in your examples</h2>
        <div className="flex flex-wrap gap-2">
          {sector.showcase.map((s) => (
            <span
              key={s}
              className="rounded-md bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Tests to practise first</h2>
        <div className="flex flex-wrap gap-2">
          {sector.tests.map((t) => (
            <Link key={t} href="/practice" className="chip">
              {CATEGORY_INFO[t].label}
            </Link>
          ))}
        </div>
      </section>

      {rows.length > 0 && (
        <section className="space-y-3" aria-labelledby="employers-table">
          <h2 id="employers-table" className="text-lg font-bold">
            {sector.name} employers running apprenticeships for 2027 (
            {rows.length})
          </h2>
          <p className="text-sm text-muted">
            {openNow} {openNow === 1 ? "is" : "are"} confirmed open now, and{" "}
            {degreeRows} {degreeRows === 1 ? "is" : "are"} marked as degree
            level on the pages we hold. The level column says plainly when we
            have not confirmed one. Employers with a page link to it, and every
            date shows its status on the tracker.{" "}
            <Link href="/deadlines" className="underline">
              Closing dates, soonest first
            </Link>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm [overflow-wrap:normal] md:min-w-[40rem]">
              <caption className="sr-only">
                {sector.name} employers, their programmes, level and status
              </caption>
              <thead className="bg-navy/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="min-w-[8rem] px-3 py-2">
                    Employer
                  </th>
                  <th
                    scope="col"
                    className="hidden min-w-[10rem] px-3 py-2 md:table-cell"
                  >
                    Programme
                  </th>
                  <th scope="col" className="min-w-[8rem] px-3 py-2">
                    Level
                  </th>
                  <th scope="col" className="min-w-[7rem] px-3 py-2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const lvl = levelInfo(r);
                  return (
                    <tr key={r.name} className="border-t border-line align-top">
                      <td className="px-3 py-2 font-semibold">
                        {r.pageSlug ? (
                          <Link
                            href={`/employers/${r.pageSlug}`}
                            className="underline underline-offset-2"
                          >
                            {r.name}
                          </Link>
                        ) : (
                          r.name
                        )}
                        <span className="mt-1 block text-xs font-normal text-muted md:hidden">
                          {r.programmes[0] ?? ""}
                        </span>
                      </td>
                      <td className="hidden px-3 py-2 text-muted md:table-cell">
                        {r.programmes[0] ?? ""}
                      </td>
                      <td
                        className={`px-3 py-2 ${lvl.tone === "degree" ? "font-medium text-brand-700" : "text-muted"}`}
                      >
                        {lvl.label}
                      </td>
                      <td className="px-3 py-2">
                        {STATUS_LABEL[r.status]}
                        {r.status === "open" &&
                          (r.rolling ? (
                            <span className="block text-xs text-muted">
                              Closes when full
                            </span>
                          ) : r.closes ? (
                            <span className="block text-xs text-muted">
                              Closes {r.closes}
                            </span>
                          ) : null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {rows.length === 0 && (
        <section className="card space-y-3 p-5">
          <h2 className="font-bold">Employers in our list</h2>
          {employers.length ? (
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {employers.map((e) => (
                <li key={e.name}>{e.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              We haven&apos;t listed employers for this sector yet. Search on
              Find an Apprenticeship.
            </p>
          )}
          <Link
            href="/opportunities"
            className="text-sm font-semibold text-brand-600"
          >
            See all opportunities →
          </Link>
        </section>
      )}

      <Link href="/interview" className="btn btn-primary !px-6 !py-3">
        Practise a {sector.name.toLowerCase()} interview
      </Link>

      {sector.id === "finance" && <FinanceSection />}
    </div>
  );
}
