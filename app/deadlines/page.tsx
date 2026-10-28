import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PrintButton from "@/components/PrintButton";
import ShareButton from "@/components/ShareButton";
import { STATUS_LABEL, formatWhen, opportunityRows, type OpportunityRow } from "@/lib/opportunities";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Degree apprenticeship deadlines 2027: who is open and when they close",
  description:
    "A one-page list of UK degree apprenticeship closing dates for the 2027 intake: which employers are open now or opening soon, when they close, and where we read the date. Print it or share it with your class.",
  path: "/deadlines",
});

// Status follows the calendar, so rebuild the page hourly (the same as the opportunities tracker).
export const revalidate = 3600;

/** Soonest closing date first; employers with no full closing date come after the dated ones. */
const byClosing = (a: OpportunityRow, b: OpportunityRow) => (a.closesIso ?? "9999").localeCompare(b.closesIso ?? "9999") || a.name.localeCompare(b.name);

function Table({ rows, caption }: { rows: OpportunityRow[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy/5 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-3 py-2">Employer</th>
            <th scope="col" className="px-3 py-2">Programme</th>
            <th scope="col" className="px-3 py-2">Opens</th>
            <th scope="col" className="px-3 py-2">Closes</th>
            <th scope="col" className="px-3 py-2">Last checked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-line align-top">
              <td className="px-3 py-2 font-semibold">
                {r.slug ? (
                  <Link href={`/employers/${r.slug}`} className="underline underline-offset-2">
                    {r.name}
                  </Link>
                ) : (
                  r.name
                )}
              </td>
              <td className="px-3 py-2 text-muted">{r.programmes[0] ?? ""}</td>
              <td className="whitespace-nowrap px-3 py-2">{r.opens || "Not stated"}</td>
              <td className="whitespace-nowrap px-3 py-2">{r.rolling ? "Rolling, closes when full" : r.closes || "Not stated"}</td>
              <td className="whitespace-nowrap px-3 py-2 text-muted">{r.checked ? formatWhen(r.checked) : r.verified ? formatWhen(r.verified) : "Not yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Deadlines() {
  const rows = opportunityRows(new Date());
  const open = rows.filter((r) => r.status === "open").sort(byClosing);
  const soon = rows.filter((r) => r.status === "opening-soon").sort((a, b) => (a.opens || "z").localeCompare(b.opens || "z") || a.name.localeCompare(b.name));
  const updated = rows.map((r) => r.checked).filter((d): d is string => Boolean(d)).sort().at(-1);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Deadlines", path: "/deadlines" }])} />
      <div className="space-y-2">
        <h1 className="page-title">Degree apprenticeship deadlines, 2027 intake</h1>
        <p className="text-muted">
          Who is open now and who is opening soon, soonest closing date first{updated ? `, last checked ${formatWhen(updated)}` : ""}. Each date comes from the employer&apos;s own page.
          Employers can close early once they have enough applicants, so apply as soon as you can and confirm on their site.
        </p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <ShareButton title="Degree apprenticeship deadlines 2027" text="Who is open and when they close, for the 2027 degree apprenticeship intake" label="Share this page" />
          <PrintButton />
        </div>
      </div>

      <section className="space-y-3" aria-labelledby="open-now">
        <h2 id="open-now" className="text-lg font-semibold">
          {STATUS_LABEL.open} now ({open.length})
        </h2>
        {open.length ? <Table rows={open} caption="Employers open now, soonest closing date first" /> : <p className="text-sm text-muted">Nothing confirmed open at the moment. See opening soon below.</p>}
      </section>

      <section className="space-y-3" aria-labelledby="opening-soon">
        <h2 id="opening-soon" className="text-lg font-semibold">
          {STATUS_LABEL["opening-soon"]} ({soon.length})
        </h2>
        {soon.length ? <Table rows={soon} caption="Employers opening soon" /> : <p className="text-sm text-muted">No opening dates confirmed yet.</p>}
      </section>

      <section className="card space-y-2 p-5 print:hidden">
        <h2 className="text-lg font-semibold">Keep track of the ones you want</h2>
        <p className="text-sm text-muted">
          Create a free account to add employers to your own tracker, see your closing dates in one place, and practise the tests and interviews each one uses.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login?mode=signup" className="btn btn-primary">
            Create a free account
          </Link>
          <Link href="/opportunities" className="btn btn-secondary">
            See every employer
          </Link>
        </div>
      </section>

      <p className="text-xs text-muted">
        Independent guidance from Level6, not affiliated with any employer named. Dates change, so always check the employer&apos;s own page before you apply.
      </p>
    </div>
  );
}
