// Live status of each employer's application window for the current cycle, shown on /opportunities.
//
// Only what we have verified from the employer's own page (or flagged as less certain) is entered here, with the date
// it was checked. Employers without an entry still appear, marked "not confirmed this cycle", with the pattern from
// their researched profile. Never infer a date: if the employer has not published one, leave it out and use `label`.

import { directory, type DirectoryEntry } from "@/lib/directory";
import { FIRMS } from "@/lib/firms";
import { LISTED, normName, vacancySearchUrl, type Listed } from "@/lib/listings";
import { getMock } from "@/lib/mockprocess/definitions";
import type { Confidence } from "@/lib/firms/types";
import type { SectorId } from "@/lib/sectors";
import type { TrackerTemplate } from "@/lib/tracker-item";

export type WindowEntry = {
  /** A researched profile's slug. Use `name` instead for an employer we list but have not profiled. */
  slug?: string;
  /** Listed employer name (as in lib/listings.ts) when there is no profile. */
  name?: string;
  /** Page the dates were read from. Required for entries without a profile (profiles carry their own source). */
  source?: string;
  /** Full ISO date, or "YYYY-MM" when only the month is published. */
  opens?: string;
  closes?: string;
  /** Text shown instead of a date (for example "Spring 2027" or "Usually November"). */
  opensLabel?: string;
  closesLabel?: string;
  /** Applications are reviewed as they arrive and close once filled. */
  rolling?: boolean;
  /** Use when there is no date but we know the state (for example "open now" on the employer's page). */
  state?: "open" | "not-announced" | "closed";
  note?: string;
  confidence: Confidence;
  /** ISO date the employer's page was last read. */
  checked: string;
};

export const WINDOWS: WindowEntry[] = [
  {
    slug: "airbus",
    opens: "2026-10-05",
    closesLabel: "Likely before 26 Oct 2026 for digital, business, engineering and project management; early Jan 2027 for supply chain and quality (Airbus guidance)",
    note: "Adverts can close early once enough applications arrive.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "bdo",
    opens: "2026-09-23",
    closes: "2026-11-15",
    note: "2027 Audit school leaver programme. Other streams have their own dates.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "barclays",
    opens: "2026-09-09",
    rolling: true,
    closesLabel: "Rolling: roles close when filled",
    note: "Routes are released in waves; the UK Corporate Banking degree apprenticeship was posted on 18 Sep 2026.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "goldman-sachs",
    state: "open",
    rolling: true,
    closesLabel: "Rolling; early January in the last cycle",
    note: "2027 entry applications are open on the employer's page.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "deloitte",
    state: "open",
    rolling: true,
    closesLabel: "Several roles close in October 2026; others are rolling",
    note: "Seen through a search summary of the application portal: check each role's date.",
    confidence: "inferred",
    checked: "2026-10-03",
  },
  {
    slug: "jlr",
    opens: "2027-02",
    closesLabel: "February or March; may close at short notice",
    note: "September 2027 start. The 2026 programmes are closed.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "bae-systems",
    opens: "2027-01",
    closesLabel: "About six weeks after opening, with more hiring through February",
    confidence: "official",
    checked: "2026-10-02",
  },
  {
    slug: "natwest",
    state: "not-announced",
    opensLabel: "Spring 2027",
    note: "No programmes are open at the moment.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "amazon",
    state: "not-announced",
    opensLabel: "Usually November",
    rolling: true,
    note: "The employer's FAQ still describes the 2026 cohorts; no 2027 date is published yet.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "arup",
    state: "not-announced",
    opensLabel: "Usually November",
    note: "The employer's FAQ says applications open in November.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "atkinsrealis",
    state: "not-announced",
    opensLabel: "Usually November",
    closesLabel: "Typically the end of February",
    note: "No vacancies listed at the moment.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    slug: "bt",
    state: "not-announced",
    opensLabel: "Usually February",
    note: "Applications ran 2 to 22 February in the last cycle.",
    confidence: "official",
    checked: "2026-10-03",
  },
  {
    name: "Schroders",
    source: "https://www.schroders.com/en-gb/uk/individual/about-us/careers/apprenticeships/",
    state: "not-announced",
    opensLabel: "January (apply in January to start in September)",
    note: "Two-year school-leaver apprenticeship with Level 3 and 4 qualifications, not a degree. No 2027 dates on the page.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Aon",
    source: "https://www.aon.com/careers/early-careers/uk/apprenticeships",
    state: "not-announced",
    opensLabel: "October each year",
    note: "No 2027 dates or closing dates on the page; deadlines vary by role, so check each posting.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "M&G",
    source: "https://group.mandg.com/careers/routes-into-mandg/faqs",
    opens: "2027-02",
    note: "Applications open from February 2027; no closing date is given and applicants are assessed from submission, so apply early. Level not stated.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Visa",
    source: "https://uk.review.visa.com/careers/next-gen-careers/application-process-apprenticeship.html",
    state: "not-announced",
    opensLabel: "Advertised by the end of October",
    note: "Four-year degree apprenticeships (BSc Hons). No fixed opening date; roles are aimed to be advertised by the end of October.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Unilever",
    source: "https://careers.unilever.com/en/uk-and-ireland-early-careers-apprenticeships-packaging-professional-level-6",
    opens: "2026-11-09",
    closesLabel: "Rolling deadline; may close early",
    rolling: true,
    note: "Packaging Professional Level 6 apprenticeship, September 2027 start: applications open Monday 9 November 2026. Unilever's main apprenticeships page still says applications are closed for the 2026 intake; other programmes' 2027 dates are not given there.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Leonardo",
    source: "https://careers.uk.leonardo.com/gb/en/early-careers/apprenticeships/opportunities",
    state: "not-announced",
    opensLabel: "Week commencing 19 October 2026",
    note: "The page says applications are closed for all 2026 programmes and that the 2027 apprenticeships open in the week commencing 19th October 2026. No closing date is given.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "EDF",
    source: "https://careers.edfenergy.com/apprenticeships",
    opens: "2027-01",
    note: "The page says further apprenticeship programmes open in January 2027, in engineering, project management, chemistry and business. Only the Engineering Maintenance Technician Apprenticeship is open now; the page does not say whether any programme is a degree apprenticeship.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Vodafone",
    source: "https://opportunities.vodafone.com/job/Register-Your-Interest-Group-UK-Early-Careers-Programmes-2027/1435738733/",
    state: "not-announced",
    note: "Register your interest for the 2027 intake. The page says this is not an application to a specific programme and that timelines will be sent to those who register; no dates are given.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "United Utilities",
    source: "https://www.unitedutilities.com/corporate/careers/apprenticeships/",
    state: "not-announced",
    note: "The page says applications for 2026 are closed and you can register to be notified when 2027 roles become available. No 2027 dates are given.",
    confidence: "official",
    checked: "2026-10-04",
  },
  {
    name: "Siemens",
    source: "https://jobs.siemens.com/en_US/externaljobs/JobDetail/512192",
    state: "not-announced",
    note: "Siemens' own job page is titled \"Business and Engineering Apprenticeship Opportunities 2027 - Register your interest\". It is a register of interest; no opening or closing dates are given.",
    confidence: "official",
    checked: "2026-10-04",
  },
];

export type Status = "open" | "opening-soon" | "not-announced" | "closed" | "not-confirmed";

export const STATUS_LABEL: Record<Status, string> = {
  open: "Open",
  "opening-soon": "Opening soon",
  "not-announced": "Not open yet",
  closed: "Closed",
  "not-confirmed": "Not confirmed",
};

const isFullDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const firstOfMonth = (s: string) => new Date(`${s}-01T00:00:00Z`);
const startOf = (s: string) => (isFullDate(s) ? new Date(`${s}T00:00:00Z`) : firstOfMonth(s));

/** Status of one window on a given day. Dates move the status on their own; a stated state is used when no date applies. */
export function statusOf(w: WindowEntry | undefined, today: Date): Status {
  if (!w) return "not-confirmed";
  if (w.closes && isFullDate(w.closes) && new Date(`${w.closes}T23:59:59Z`) < today) return "closed";
  if (w.opens) {
    return startOf(w.opens) <= today ? "open" : "opening-soon";
  }
  return w.state === "open" ? "open" : w.state === "closed" ? "closed" : w.state === "not-announced" ? "not-announced" : "not-confirmed";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-10-05" to "5 Oct 2026"; "2027-02" to "Feb 2027". */
export function formatWhen(s: string): string {
  const [y, m, d] = s.split("-");
  const month = MONTHS[Number(m) - 1];
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}

export type OpportunityRow = {
  name: string;
  /** Set only when we have a researched guide for the employer. */
  slug?: string;
  sectors: SectorId[];
  /** Programme names from public listings, as the employer words them. */
  programmes: string[];
  status: Status;
  opens: string;
  closes: string;
  /** Closing date as YYYY-MM-DD when the employer gives a full date, used to pre-fill a tracked application. */
  closesIso?: string;
  rolling: boolean;
  note?: string;
  providers: string[];
  confidence?: Confidence;
  checked?: string;
  verified?: string;
  template?: TrackerTemplate;
  /** Page the dates were read from (employers without a guide). */
  source?: string;
  /** There is a mock process for this employer. */
  hasMock?: boolean;
  /** Web search for this employer's own careers page, for employers without a guide. */
  vacancyUrl?: string;
};

const ORDER: Record<Status, number> = { open: 0, "opening-soon": 1, "not-announced": 2, closed: 3, "not-confirmed": 4 };

// Researched profile slug -> the name its employer goes by in public listings, where the names differ.
const LISTING_ALIAS: Record<string, string[]> = {
  "bmw-group": ["BMW"],
  bny: ["BNY Mellon"],
  fca: ["Financial Conduct Authority"],
  jlr: ["JLR"],
  natwest: ["NatWest Markets"],
};

/** One row per employer: researched ones first by what to act on soonest, then listed employers we have not researched yet. */
export function opportunityRows(today = new Date()): OpportunityRow[] {
  const dir = new Map<string, DirectoryEntry>(directory().filter((e) => e.slug).map((e) => [e.slug!, e]));
  const listedByKey = new Map(LISTED.map((l) => [normName(l.name), l]));
  const used = new Set<string>();

  const profiled = FIRMS.filter((f) => dir.has(f.slug)).map((f): OpportunityRow => {
    const e = dir.get(f.slug)!;
    const w = WINDOWS.find((x) => x.slug === f.slug);
    const keys = [normName(f.name), ...(LISTING_ALIAS[f.slug] ?? []).map(normName)];
    const listed = keys.map((k) => listedByKey.get(k)).filter((l): l is Listed => Boolean(l));
    for (const k of keys) used.add(k);
    const programmes = [...new Set(listed.flatMap((l) => l.programmes))];
    const providers = [...new Set(f.stages.map((s) => s.provider).filter((p): p is string => Boolean(p)).map((p) => p.split(/[;(,]/)[0].trim().slice(0, 24)))].slice(0, 3);
    return {
      name: f.name.replace(/\s*\(.*\)\s*$/, ""),
      slug: f.slug,
      sectors: [...new Set([...e.sectors, ...listed.flatMap((l) => l.sectors)])],
      programmes,
      status: statusOf(w, today),
      opens: w ? (w.opens ? formatWhen(w.opens) : w.opensLabel ?? "") : "",
      closes: w ? (w.closes ? formatWhen(w.closes) : w.closesLabel ?? "") : "",
      closesIso: w?.closes && isFullDate(w.closes) ? w.closes : undefined,
      rolling: Boolean(w?.rolling),
      note: w?.note,
      providers,
      confidence: w?.confidence,
      checked: w?.checked,
      verified: f.lastVerified,
      template: e.template,
      hasMock: Boolean(getMock(f.slug)),
    };
  });

  const key = (r: OpportunityRow) => {
    const w = WINDOWS.find((x) => x.slug === r.slug);
    const date = w?.closes && isFullDate(w.closes) ? w.closes : w?.opens ?? "9999";
    return `${ORDER[r.status]}|${date}|${r.name}`;
  };
  profiled.sort((a, b) => key(a).localeCompare(key(b)));

  const others = LISTED.filter((l) => !used.has(normName(l.name)))
    .map((l): OpportunityRow => {
      const w = WINDOWS.find((x) => x.name && normName(x.name) === normName(l.name));
      return {
        name: l.name,
        sectors: l.sectors,
        programmes: l.programmes,
        status: statusOf(w, today),
        opens: w ? (w.opens ? formatWhen(w.opens) : w.opensLabel ?? "") : "",
        closes: w ? (w.closes ? formatWhen(w.closes) : w.closesLabel ?? "") : "",
        closesIso: w?.closes && isFullDate(w.closes) ? w.closes : undefined,
        rolling: Boolean(w?.rolling),
        note: w?.note,
        providers: [],
        confidence: w?.confidence,
        checked: w?.checked,
        source: w?.source,
        vacancyUrl: vacancySearchUrl(l.name),
      };
    })
    .sort((a, b) => (ORDER[a.status] - ORDER[b.status]) || a.name.localeCompare(b.name));

  return [...profiled, ...others];
}
