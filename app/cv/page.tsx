import JsonLd from "@/components/JsonLd";
import { firmOptions } from "@/lib/firms/context";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";
import CvApp from "./CvApp";

export const metadata = pageMeta({
  title: "Free CV checker for degree apprenticeship applications",
  description:
    "Paste your CV and get feedback built for school leavers: grades, evidence, bullet rewrites and a checklist, optionally tailored to an employer. Contact details are removed before anything is analysed.",
  path: "/cv",
});

export default function CvPage() {
  const firms = firmOptions().map((f) => ({ slug: f.slug, name: f.name }));
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "CV checker", path: "/cv" }])} />
      <CvApp firms={firms} />
    </>
  );
}
