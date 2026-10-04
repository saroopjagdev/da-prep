import JsonLd from "@/components/JsonLd";
import OpportunitiesApp from "@/components/OpportunitiesApp";
import { opportunityRows } from "@/lib/opportunities";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Degree apprenticeship opportunities: who is open now",
  description:
    "Which employers have degree apprenticeship applications open, opening soon or closed, with dates, the assessments they use and and a process guide for each.",
  path: "/opportunities",
});

// Status follows the calendar (an opening date passing flips a row to Open), so rebuild the page hourly.
export const revalidate = 3600;

export default function Opportunities() {
  const rows = opportunityRows(new Date());
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Opportunities", path: "/opportunities" }])} />
      <div className="space-y-2">
        <h1 className="page-title">Opportunities and my list</h1>
        <p className="lead">
          Who is open, opening soon or closed for this cycle. Dates move and many employers close early once they have enough
          applicants, so always confirm on the employer&apos;s page. Press Track on any employer to add it to your own list, then set where you are with it.
        </p>
      </div>
      <OpportunitiesApp rows={rows} />
    </div>
  );
}
