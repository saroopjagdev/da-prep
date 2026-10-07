import JsonLd from "@/components/JsonLd";
import AccountNote from "@/components/AccountNote";
import EmployerDirectory, { type DirectoryCard } from "@/components/EmployerDirectory";
import { logoPath } from "@/lib/logos";
import { opportunityRows } from "@/lib/opportunities";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Degree apprenticeship employer guides and mock processes",
  description:
    "Every employer we have researched in one place: how its degree apprenticeship process works, the tests and interviews it uses, and a mock process to practise where we have one.",
  path: "/employers",
});

// Status follows the calendar, so rebuild hourly like the opportunities page.
export const revalidate = 3600;

export default function Employers() {
  const cards: DirectoryCard[] = opportunityRows(new Date())
    .filter((r) => r.slug)
    .map((r) => ({
      slug: r.slug!,
      name: r.name,
      sector: r.sectors[0] ?? "business",
      status: r.status,
      hasMock: Boolean(r.hasMock),
      logo: logoPath(r.slug!),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Employer guides", path: "/employers" }])} />
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Employer guides</h1>
        <p className="lead">
          How each employer&apos;s process works, the tests and interviews it uses, and a mock process to run stage by stage where we have one. Processes change every year, so confirm on the employer&apos;s own page.
        </p>
      </div>
      <AccountNote>Guides are free to read. Firm mock processes are part of Pro (£9.99 a month); a free account gets one marked AI mock interview a week.</AccountNote>
      <EmployerDirectory cards={cards} />
      <p className="text-xs text-muted">
        Independent practice, not affiliated with or endorsed by any employer named. Answers are scored by AI, which can be wrong, and a mock does not predict an employer&apos;s decision.
      </p>
    </div>
  );
}
