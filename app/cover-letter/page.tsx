import JsonLd from "@/components/JsonLd";
import { FIRMS } from "@/lib/firms";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";
import CoverLetterApp, { type PlannerFirm } from "./CoverLetterApp";

export const metadata = pageMeta({
  title: "Cover letter planner for degree apprenticeships",
  description:
    "Plan a cover letter paragraph by paragraph. Pick an employer and see the values it assesses and its programmes, then write each part with prompts, a live word count and a copy button. No account needed.",
  path: "/cover-letter",
});

export default function CoverLetterPage() {
  const firms: PlannerFirm[] = FIRMS.filter((f) => f.slug !== "civil-service-fast-track")
    .map((f) => ({
      slug: f.slug,
      name: f.name.replace(/\s*\(.*\)\s*$/, ""),
      programmes: f.programmes.map((p) => p.name),
      values: f.values.slice(0, 8),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Cover letter planner", path: "/cover-letter" }])} />
      <CoverLetterApp firms={firms} />
    </>
  );
}
