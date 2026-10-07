import { Suspense } from "react";
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
    <div className="mx-auto max-w-6xl space-y-4">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Opportunities tracker", path: "/opportunities" }])} />
      <div className="space-y-2">
        <h1 className="page-title">Opportunities tracker</h1>
        <p className="text-muted">
          Who is open, opening soon or closed. Set your status on any employer to track it. Dates move, so confirm on the employer&apos;s own page.
        </p>
      </div>
      {/* useSearchParams (for ?mine= and ?q=) needs a Suspense boundary so the page can still be prerendered. */}
      <Suspense>
        <OpportunitiesApp rows={rows} />
      </Suspense>
    </div>
  );
}
