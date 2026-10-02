import { EMPLOYERS, type Employer } from "@/lib/employers";
import { FIRMS } from "@/lib/firms";
import type { SectorId } from "@/lib/sectors";
import { trackerTemplate } from "@/lib/tracker";
import type { TrackerTemplate } from "@/lib/tracker-item";

/** One row in the employer directory: the seed list merged with researched firm profiles. */
export type DirectoryEntry = Employer & { slug?: string; template?: TrackerTemplate };

const firstWord = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)[0];

const SECTOR_RULES: [RegExp, SectorId[]][] = [
  [/bank|financ|account|audit|insur|advis/i, ["finance"]],
  [/aero|defen[cs]e|automotive|engineer/i, ["engineering"]],
  [/tech|digital|software|cloud|retail/i, ["digital"]],
  [/police|government|civil service|public|protective/i, ["public"]],
  [/construction|infrastructure/i, ["construction"]],
];
const sectorsFor = (text: string): SectorId[] => {
  const found = SECTOR_RULES.filter(([re]) => re.test(text)).flatMap(([, ids]) => ids);
  return found.length ? [...new Set(found)] : ["business"];
};

// Profiles that stay reachable by URL but should not be advertised as a current opportunity.
const HIDDEN = new Set(["civil-service-fast-track"]);
const NOTES: Record<string, string> = {
  google: "Check for a live UK degree apprenticeship listing; none was confirmed when researched.",
};

export function directory(): DirectoryEntry[] {
  const used = new Set<string>();
  const merged: DirectoryEntry[] = EMPLOYERS.map((e) => {
    const firm = FIRMS.find((f) => !HIDDEN.has(f.slug) && firstWord(f.name) === firstWord(e.name));
    if (firm) used.add(firm.slug);
    return firm ? { ...e, slug: firm.slug, template: trackerTemplate(firm) } : e;
  });
  for (const f of FIRMS) {
    if (used.has(f.slug) || HIDDEN.has(f.slug)) continue;
    merged.push({ name: f.name, sector: f.sector, sectors: sectorsFor(f.sector), slug: f.slug, note: NOTES[f.slug], template: trackerTemplate(f) });
  }
  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

/** Well-known finance firms checked in research (2026-10-02) that had no UK degree-level (Level 6) apprenticeship. */
export type NoDegreeRoute = { name: string; finding: string; source: string };

export const FINANCE_NO_DEGREE_ROUTE: NoDegreeRoute[] = [
  {
    name: "BlackRock",
    finding: "18-month Level 4 (London) or SCQF Level 6 (Edinburgh) apprenticeship, not a degree. Still worth a look: its short HireVue is in our video practice.",
    source: "https://blackrock.tal.net/vx/lang-en-GB/mobile-0/brand-3/xf-04cc9be8ef5d/wid-1/candidate/so/pm/1/pl/1/opp/11991-2026-Apprenticeship-Programme-UK/en-GB",
  },
  {
    name: "BNP Paribas",
    finding: "Level 3 and Level 4 apprenticeships only (London and Glasgow).",
    source: "https://careers.bnpparibas.co.uk/apprenticeships/",
  },
  {
    name: "Nomura",
    finding: "Ad-hoc 12 to 24 month apprenticeships in corporate functions; no degree programme found.",
    source: "https://www.nomura.com/europe/careers/",
  },
  {
    name: "Lazard",
    finding: "Internships and graduate analyst roles only; no school-leaver scheme found.",
    source: "https://www.lazard.com/about-lazard/locations/united-kingdom/careers-in-the-united-kingdom/",
  },
  {
    name: "LSEG (London Stock Exchange Group)",
    finding: "School-leaver apprenticeships; the 2026 advert found was Level 4 (Software Developer).",
    source: "https://www.lseg.com/en/careers/graduate-internship-programmes/apprenticeship-programmes",
  },
  {
    name: "Man Group",
    finding: "Level 7 (Master's) apprenticeship only, for people who already have a degree.",
    source: "https://www.man.com/goldman-sachs-and-man-group-partner-with-warwick-university",
  },
  {
    name: "Mizuho, RBC Capital Markets, Jefferies",
    finding: "Only internships and graduate schemes found.",
    source: "https://www.rbccm.com/en/careers/campus-recruiting",
  },
];
