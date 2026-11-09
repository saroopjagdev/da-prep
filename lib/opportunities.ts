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
    closesLabel: "Digital, business, engineering, project management and procurement closed on 26 October; supply chain, customer service, facilities management and quality engineering are likely to close before 4 January 2027",
    note: "Adverts can close early once enough applications arrive.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "bdo",
    opens: "2026-09-23",
    closes: "2026-11-15",
    note: "2027 Audit school leaver programme. Other streams have their own dates.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "barclays",
    opens: "2026-09-18",
    closesLabel: "No closing date is shown on the advert",
    note: "The UK Corporate Banking degree apprenticeship advert shows Date live 18/09/2026 and no closing date. Barclays' apprenticeship pages give no dates for its other routes (Technology Analyst, Cyber and Security, Customer Care, Business Banking), and say you can apply to only one programme in six months.",
    confidence: "official",
    checked: "2026-11-09",
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
    state: "not-announced",
    closesLabel: "No dates given; Deloitte closes applications early when volume is high",
    note: "Deloitte's early careers programmes page gives dates only for its school programmes: Explore Work reopens in early 2027, ASPIRE opens in March 2027, Career Shapers Inspiring Women opens 23 November 2026, Inspiring Black Talent in January 2027 and Inspiring Local Talent in March 2027. The Entry Level Apprenticeship Scheme and BrightStart Apprenticeship show no dates; roles are on its job search page.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "jlr",
    opens: "2027-02",
    closesLabel: "February or March; may close at short notice",
    note: "September 2027 start. The 2026 programmes are closed.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "bae-systems",
    opens: "2027-01",
    closesLabel: "About six weeks after opening, with more hiring through February",
    note: "The page says degree apprenticeships are closed and 2027 applications open in January 2027, with a main recruitment window of about six weeks. Another section of the same page says the window runs from the beginning of November to the end of February, so confirm with BAE Systems before planning around either.",
    confidence: "official",
    checked: "2026-11-09",
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
    opensLabel: "Throughout November 2026",
    rolling: true,
    note: "The FAQ says applications will be opened throughout November for the 2027 cohorts, that some roles may open later in the year, and that successful applicants start in September 2027. It does not say whether any are open yet.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "arup",
    opens: "2026-11",
    rolling: true,
    note: "The apprenticeships page says applications open in November 2026. Not all roles have a fixed deadline: some are reviewed on a rolling basis and may close as soon as they are filled, and where there is a deadline it is on the vacancy.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "atkinsrealis",
    state: "not-announced",
    opensLabel: "Usually November",
    closesLabel: "Typically the end of February",
    note: "The FAQ says apprenticeship opportunities go live during November and typically close at the end of February, and to see each advert for its closing date. No vacancies are shown yet.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "bt",
    state: "not-announced",
    opensLabel: "Usually February",
    note: "Applications ran 2 to 22 February in the last cycle.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Schroders",
    source: "https://www.schroders.com/en-gb/uk/individual/about-us/careers/apprenticeships/",
    state: "not-announced",
    opensLabel: "January (apply in January to start in September)",
    note: "Two-year school-leaver apprenticeship with Level 3 and 4 qualifications, not a degree. No 2027 dates on the page.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Aon",
    source: "https://www.aon.com/careers/early-careers/uk/apprenticeships",
    state: "not-announced",
    opensLabel: "November each year",
    note: "The page says apprenticeship opportunities open in November each year. It gives no 2027 opening date or closing date, and says deadlines vary by role, so check each posting.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "M&G",
    source: "https://group.mandg.com/careers/routes-into-mandg/faqs",
    opens: "2027-02",
    note: "Applications open from February 2027; no closing date is given and applicants are assessed from submission, so apply early. Level not stated.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Visa",
    source: "https://uk.review.visa.com/careers/next-gen-careers/application-process-apprenticeship.html",
    state: "not-announced",
    opensLabel: "Advertised by the end of October",
    note: "Four-year degree apprenticeships (BSc Hons). No fixed opening date; roles are aimed to be advertised by the end of October.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Unilever",
    source: "https://careers.unilever.com/en/uk-and-ireland-early-careers-apprenticeships-packaging-professional-level-6",
    opens: "2026-11-09",
    state: "not-announced",
    opensLabel: "Packaging Professional (Level 6): 9 Nov 2026",
    closesLabel: "Rolling deadline; may close early",
    rolling: true,
    note: "The Packaging Professional Level 6 apprenticeship (September 2027 start) opens for applications on Monday 9 November 2026, on a rolling deadline that may close early. The page still says the 2026 intake is closed, and gives no dates for other programmes.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Leonardo",
    source: "https://careers.uk.leonardo.com/gb/en/early-careers/apprenticeships/opportunities",
    state: "open",
    rolling: true,
    opensLabel: "Open now for 2027 programmes",
    note: "The page says applications are open for all 2027 apprenticeship programmes at its Scottish and English sites, screened first come first served, and that applications close when each role is filled. No closing date is given. It also says its summer 2027 early careers roles will open soon.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "EDF",
    source: "https://careers.edfenergy.com/apprenticeships",
    opens: "2027-01",
    note: "The page says apprenticeship programmes will open for applications in January 2027, in engineering, project management, chemistry and business. Its jobs list currently shows no openings, and the page does not mention degree apprenticeships.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Vodafone",
    source: "https://opportunities.vodafone.com/job/Register-Your-Interest-Group-UK-Early-Careers-Programmes-2027/1435738733/",
    state: "not-announced",
    note: "Register your interest for the 2027 intake. The page says this is not an application to a specific programme and that timelines will be sent to those who register; no dates are given.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "United Utilities",
    source: "https://www.unitedutilities.com/corporate/careers/apprenticeships/",
    state: "not-announced",
    note: "The page says applications for 2026 are closed and you can register to be notified when 2027 roles become available. No 2027 dates are given.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Neptune North",
    source: "https://job-boards.eu.greenhouse.io/neptunenorth/jobs/4910464101",
    state: "open",
    closesLabel: "Likely late November or early December 2026",
    note: "The 2027 Digital and Technology Solutions Degree Apprenticeship (September 2027 start) is advertised on Neptune North's own application page, which says applications will likely close towards the end of November or early December 2026.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "AWE",
    source: "https://www.awe.co.uk/careers/early-careers/apprenticeships/",
    opens: "2026-10-12",
    closesLabel: "Ongoing; no closing date given",
    state: "open",
    note: "AWE's own apprenticeships page says applications are now open and to only apply to one role (the Level 6 Degree Apprenticeship advert said 12 October 2026). Check each advert for eligibility rules such as nationality and security clearance.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Saffery",
    source: "https://saffery.kallidusrecruit.com/Search.aspx",
    state: "open",
    note: "Saffery's own vacancy list shows School Leaver Accounts Trainee (ACA) roles in Peterborough, High Wycombe and Bournemouth and School Leaver Audit Trainee (ACA) roles in Peterborough and High Wycombe, all for September 2027 (first page of the list only). No closing dates are shown.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "M+A Partners",
    source: "https://www.mapartners.co.uk/trainee-programmes/",
    state: "closed",
    note: "The page now says applications for the 2027 Trainee Programme are closed, and invites you to register your interest for future opportunities.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Babcock International",
    source: "https://careers.babcockinternational.com/emerging-talent/apprenticeships/",
    state: "open",
    note: "The page says Degree Apprenticeship opportunities in England and Graduate Apprenticeship opportunities in Scotland are now live. Intermediate, Advanced, Higher and Modern Apprenticeships open in December. No closing dates are given.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "St James's Place",
    source: "https://www.sjp.co.uk/careers/students-and-graduates/school-leavers/apprenticeships",
    opens: "2026-11-16",
    closes: "2027-01-08",
    note: "The page says applications for the 2027 Apprenticeship Programmes open on Monday 16 November 2026 and are scheduled to close on Friday 8 January 2027. SJP may close vacancies early once it has enough applications.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "bp",
    source: "https://careers.bp.com/early-careers/apprenticeships",
    opens: "2026-11-04",
    note: "The page says applications open on 4 November 2026 for supply, trading and shipping apprenticeships.",
    confidence: "official",
    checked: "2026-11-02",
  },
  {
    name: "Savills",
    source: "https://www.savills.co.uk/contact-us/careers/future-talent-careers/apprenticeships.aspx",
    opens: "2027-01",
    note: "The page says applications for the 2027 Apprenticeship Programme will open in January 2027.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Ridge",
    source: "https://ridge.co.uk/?p=12314",
    opens: "2026-12",
    closes: "2027-02",
    opensLabel: "Mid December 2026",
    closesLabel: "End of February 2027",
    note: "The Elevate apprenticeship page says applications are open online from mid December 2026 to the end of February 2027, with offers from March 2027 and a start in autumn 2027.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    slug: "ey",
    source: "https://www.ey.com/en_uk/careers/students",
    rolling: true,
    state: "open",
    note: "EY's students page says 2027 applications are open, and that applications close once positions are filled, so apply early. No closing date is given.",
    confidence: "official",
    checked: "2026-10-19",
  },
  {
    slug: "hsbc",
    source: "https://www.hsbc.com/careers/students-and-graduates/student-opportunities/uk-degree-apprenticeship",
    state: "open",
    note: "HSBC's UK degree apprenticeship page lists a Relationship Management (Private Bank) degree apprenticeship among the programmes open for applications, and says opening dates vary by location and programme. No closing date is given.",
    confidence: "official",
    checked: "2026-10-19",
  },
  {
    slug: "aviva",
    source: "https://careers.aviva.co.uk/early-careers/apprenticeships/",
    opens: "2027-01",
    opensLabel: "January 2027",
    note: "Aviva's early careers page says applications for its 2027 apprenticeship pathways will open in January 2027.",
    confidence: "official",
    checked: "2026-10-19",
  },
  {
    name: "Thales UK",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057141",
    closesLabel: "7 February 2027 to 17 February 2027, depending on the advert",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing between 7 February 2027 and 17 February 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-10-19",
  },
  {
    name: "Stantec",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058198",
    closes: "2026-12-18",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 18 December 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Dalcour Maclaren",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000056571",
    closes: "2027-01-22",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 22 January 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Devonport Royal Dockyard",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058710",
    closes: "2026-10-30",
    state: "closed",
    note: "Find an apprenticeship says this advert closed on 30 October 2026. Check the employer's careers page for the next intake.",
    confidence: "official",
    checked: "2026-11-02",
  },
  {
    name: "Cavendish Nuclear",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058692",
    closes: "2026-12-07",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 7 December 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Trowers & Hamlins",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000055810",
    closes: "2027-02-19",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 19 February 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Molson Coors",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000059137",
    closes: "2027-01-15",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 15 January 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Morrisons",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000050828",
    closes: "2026-10-22",
    state: "closed",
    note: "Find an apprenticeship says this advert closed on 22 October 2026. Check the employer's careers page for the next intake.",
    confidence: "official",
    checked: "2026-11-02",
  },
  {
    name: "Michelmores",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000056390",
    closes: "2026-11-05",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 5 November 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-02",
  },
  {
    name: "TLT",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000056706",
    closes: "2027-02-21",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 21 February 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "GKN Aerospace",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057138",
    closes: "2026-10-23",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 23 October 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-10-19",
  },
  {
    name: "Cranswick",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000051163",
    closes: "2027-04-01",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 1 April 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Hanson",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057225",
    closes: "2027-02-15",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 15 February 2027. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "British Airways",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000059816",
    closes: "2026-11-19",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 19 November 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-11-09",
  },
  {
    name: "Osborne Clarke",
    source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058280",
    closes: "2026-10-31",
    state: "open",
    note: "Read from the employer's own degree-level adverts on Find an apprenticeship (the government's vacancy service), closing 31 October 2026. Other adverts from the same employer can have other dates, so confirm on the one you want.",
    confidence: "official",
    checked: "2026-10-19",
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
  /** The employer's own careers page to apply on, where we have read one (the page the dates came from, or the firm's first official link). */
  applyUrl?: string;
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
      applyUrl: w?.source ?? f.officialLinks[0],
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
