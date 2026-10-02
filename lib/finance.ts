// Finance application season and common myths. Every entry is sourced; dates are from the most recent cycle we could
// find (2025-26 or 2026-27) and are shown as a guide, not a promise. Research: docs/research/finance-firms and lib/firms.
import type { Confidence } from "@/lib/firms/types";

export type CalendarEntry = { firm: string; slug?: string; text: string; source: string; confidence: Confidence };
export type CalendarMonth = { month: string; entries: CalendarEntry[] };

const TRACKR = "https://the-trackr.com/blog/uk-finance-2027-apprenticeship-timeline-when-applications-open/";

export const FINANCE_CALENDAR: CalendarMonth[] = [
  {
    month: "September",
    entries: [
      { firm: "J.P. Morgan", slug: "jp-morgan", text: "Applications usually open in early September. In 2025 some London places were gone by mid-September.", source: "https://www.thestudentroom.co.uk/showthread.php?t=7633223", confidence: "multiple-candidate-reports" },
      { firm: "Barclays", slug: "barclays", text: "2027 Business Banking and Corporate Banking degree apprenticeships were posted on 9 and 18 September 2026. Rolling: roles close when filled.", source: "https://search.jobs.barclays/job/london/uk-corporate-banking-degree-apprenticeship-programme-2027-london/13015/100812856416", confidence: "official" },
      { firm: "Accountancy firms (Big Four and mid-tier)", text: "Usually the first to open, from late August to early October.", source: TRACKR, confidence: "multiple-candidate-reports" },
      { firm: "EY", slug: "ey", text: "2027 roles were open by September 2026 and close once filled.", source: "https://www.prospects.ac.uk/employer-profiles/ey-28744/jobs/audit-apprenticeship-programme-2027-2705856", confidence: "official" },
    ],
  },
  {
    month: "October",
    entries: [
      { firm: "Goldman Sachs", slug: "goldman-sachs", text: "2027 applications opened in early October 2026 (2026 entry opened on 1 October 2025). Reviewed in batches, so apply early.", source: "https://www.goldmansachs.com/careers/students/programs-and-internships/emea/degree-apprentices", confidence: "official" },
      { firm: "Deloitte", slug: "deloitte", text: "Several BrightStart roles for September 2027 close in October 2026; others are rolling.", source: "https://apply.deloitte.co.uk/UKEarlyCareers", confidence: "official" },
      { firm: "Lloyds Banking Group", slug: "lloyds", text: "Job boards report October 2026 openings; Lloyds' own page says 3 November. Register interest so you are told.", source: "https://www.apprenticewizard.co.uk/lloyds-apprenticeship", confidence: "multiple-candidate-reports" },
      { firm: "HSBC UK", slug: "hsbc", text: "Expect roughly October; some routes closed within weeks in the 2025 cycle.", source: "https://www.thestudentroom.co.uk/showthread.php?t=7534949", confidence: "multiple-candidate-reports" },
    ],
  },
  {
    month: "November",
    entries: [
      { firm: "HSBC UK", slug: "hsbc", text: "The 2026-entry Commercial Banking (Manchester) advert closed on 16 November 2025.", source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/VAC1000346460", confidence: "official" },
      { firm: "KPMG", slug: "kpmg", text: "Launch Pad assessment days start on 17 November 2026 in London.", source: "https://www.kpmgcareers.co.uk/apprentice/applying-to-kpmg/application-process/", confidence: "official" },
    ],
  },
  {
    month: "January",
    entries: [
      { firm: "Bank of England", slug: "bank-of-england", text: "The 2026 Digital & Technology Solutions degree apprenticeship closed on 12 January 2026.", source: "https://www.leedsforlearning.co.uk/Article/181675", confidence: "official" },
      { firm: "Goldman Sachs", slug: "goldman-sachs", text: "Prep sites report an early-January close.", source: "https://www.goldmansachs.com/careers/students/prepare", confidence: "single-report" },
      { firm: "PwC Flying Start", slug: "pwc", text: "Applied for through UCAS: Reading's course uses the 13 January 2027 equal-consideration deadline.", source: "https://www.pwc.co.uk/careers/early-careers/entry-level/flying-start.html", confidence: "official" },
    ],
  },
  {
    month: "February",
    entries: [
      { firm: "Deutsche Bank", slug: "deutsche-bank", text: "2026-entry IBCM and Technology programmes closed on 22 February 2026.", source: "https://www.brightnetwork.co.uk/graduate-jobs/deutsche-bank/technology-data-innovation-apprenticeship-programme-2026-1", confidence: "official" },
      { firm: "Bank of America", slug: "bank-of-america", text: "Data Science and several other 2026 programmes closed on 15 February 2026.", source: "https://careers.bankofamerica.com/en-us/students/job-detail/13978/global-markets-apprenticeship-2026-london-london-united-kingdom", confidence: "official" },
      { firm: "Financial Conduct Authority", slug: "fca", text: "Applications opened in February 2026 for a September start.", source: "https://www.fca.org.uk/careers/early-careers", confidence: "official" },
      { firm: "Santander UK", slug: "santander", text: "The 2025 window opened in early February 2025.", source: "https://www.thestudentroom.co.uk/showthread.php?t=7565984", confidence: "multiple-candidate-reports" },
    ],
  },
  {
    month: "March to May",
    entries: [
      { firm: "NatWest Group", slug: "natwest", text: "One round a year, in spring; the next opens in spring 2027. Roles have vanished within a day.", source: "https://jobs.natwestgroup.com/pages/degree-apprenticeships", confidence: "official" },
      { firm: "Bank of America", slug: "bank-of-america", text: "Global Markets closed on 2 April 2026, but assessments start before the deadline.", source: "https://careers.bankofamerica.com/en-us/students/job-detail/13978/global-markets-apprenticeship-2026-london-london-united-kingdom", confidence: "official" },
      { firm: "Financial Conduct Authority", slug: "fca", text: "Assessment centres ran from April to May 2026.", source: "https://www.fca.org.uk/careers/early-careers", confidence: "official" },
    ],
  },
  {
    month: "June to August",
    entries: [
      { firm: "CIBC", slug: "cibc", text: "The latest Investment Banking degree apprentice advert closed on 23 June 2025.", source: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/1000324123", confidence: "official" },
      { firm: "KPMG", slug: "kpmg", text: "2027 Audit listings show a 31 July 2027 deadline, but KPMG says vacancies fill quickly.", source: "https://www.kpmgcareers.co.uk/search/vacancies/?intakeType=Student", confidence: "official" },
    ],
  },
  {
    month: "Rolling (no fixed date)",
    entries: [
      { firm: "UBS", slug: "ubs", text: "Recruits on a rolling basis.", source: "https://www.ubs.com/global/en/careers/apprenticeships/gbr.html", confidence: "official" },
      { firm: "Morgan Stanley", slug: "morgan-stanley", text: "Listed as 'ongoing' with no closing date; the portal caps how many programmes you can apply to.", source: "https://successatschool.org/job/morgan-stanley/degree-apprenticeship/2026-technology-professional-degree-apprenticeship-program-london/2010", confidence: "multiple-candidate-reports" },
    ],
  },
];

export type Myth = { myth: string; reality: string; sources: { label: string; href: string }[] };

export const FINANCE_MYTHS: Myth[] = [
  {
    myth: "You need straight A*s to get into a bank's degree apprenticeship.",
    reality:
      "Most finance programmes we researched ask for BBB to ABB at A level, and some ask for less (BNY asked for BCC; HSBC's Commercial Banking advert asked for 96 UCAS points). The hard part is the competition and the process, not the grades alone. Some banks set a high GCSE Maths bar, such as grade 7 at Bank of America.",
    sources: [
      { label: "Bank of America advert", href: "https://careers.bankofamerica.com/en-us/students/job-detail/13978/global-markets-apprenticeship-2026-london-london-united-kingdom" },
      { label: "BNY (Prosple)", href: "https://uk.prosple.com/graduate-employers/bny-mellon-uk/jobs-internships/apprenticeship-program" },
      { label: "UBS apprenticeships", href: "https://www.ubs.com/global/en/careers/apprenticeships/gbr.html" },
    ],
  },
  {
    myth: "Degree apprenticeships are the easy option for people who couldn't get into university.",
    reality:
      "They're harder to get than most university places. On the government's Find an Apprenticeship service there were 11.3 applications per degree-level vacancy in 2025/26, and employers in the ISE's 2025 survey received 89 applications per school-leaver vacancy. Big banks take small intakes.",
    sources: [
      { label: "Personnel Today", href: "https://www.personneltoday.com/hr/triple-rise-in-the-number-of-degree-apprenticeship-applications/" },
      { label: "ISE 2025", href: "https://ise.org.uk/knowledge/insights/492/apprenticeships_rise_as_graduate_vacancies_drop_8/" },
    ],
  },
  {
    myth: "You'll have to pay tuition fees or take out a student loan.",
    reality: "The government apprenticeships service says apprentices do not pay for their training; you earn a salary while you study.",
    sources: [{ label: "Apprenticeships (GOV.UK): become an apprentice", href: "https://www.apprenticeships.gov.uk/apprentices" }],
  },
  {
    myth: "Apprentices are paid the apprentice minimum wage.",
    reality:
      "Finance employers typically pay a full salary. Published examples: Barclays £25,200, Santander Corporate & Commercial Banking £27,500, Bank of England £25,270 (Leeds) and the FCA £25,700 in London.",
    sources: [
      { label: "Barclays apprenticeships", href: "https://search.jobs.barclays/apprenticeship-programmes" },
      { label: "Santander CCB", href: "https://www.santanderjobs.co.uk/realiseyourfuture/corporate-banking-apprenticeship.php" },
      { label: "FCA early careers", href: "https://www.fca.org.uk/careers/early-careers" },
    ],
  },
  {
    myth: "Every finance degree apprenticeship ends with a BSc.",
    reality:
      "Many do (for example Applied Finance degrees at Queen Mary or Exeter), but not all. NatWest's Level 6 Financial Services Professional apprenticeship is equivalent to degree level but doesn't award a BA or BSc. Check what you'll actually graduate with.",
    sources: [
      { label: "NatWest degree apprenticeships", href: "https://jobs.natwestgroup.com/pages/degree-apprenticeships" },
      { label: "Goldman Sachs degree apprentices", href: "https://www.goldmansachs.com/careers/students/programs-and-internships/emea/degree-apprentices" },
    ],
  },
  {
    myth: "Applications open in the spring, like university offers.",
    reality:
      "Most bank and accountancy programmes open between late August and October and many close (or fill) by January. Lots review applications on a rolling basis, so applying in the first weeks matters. See the season calendar.",
    sources: [{ label: "Trackr finance timeline", href: TRACKR }],
  },
  {
    myth: "It's fine to use ChatGPT during online tests or interviews.",
    reality:
      "Some banks say it ends your application. Barclays says using third-party AI tools in an assessment or interview ends the application, and J.P. Morgan's Superday invitation bans ChatGPT and other unapproved AI tools. Practise with AI, then answer in your own words.",
    sources: [
      { label: "Barclays application journey", href: "https://search.jobs.barclays/apprentice-application-journey" },
      { label: "J.P. Morgan Superday reports", href: "https://www.thestudentroom.co.uk/showthread.php?t=7633223" },
    ],
  },
  {
    myth: "You have to study Maths or Economics at A level to work in finance.",
    reality:
      "Many finance programmes accept any three A levels. Technology routes often need Maths, Computer Science or IT (Deutsche Bank's technology programme does), and some banks ask for a strong GCSE Maths grade, so check each advert.",
    sources: [
      { label: "Deutsche Bank TDI", href: "https://www.brightnetwork.co.uk/graduate-jobs/deutsche-bank/technology-data-innovation-apprenticeship-programme-2026-1" },
      { label: "Bank of America advert", href: "https://careers.bankofamerica.com/en-us/students/job-detail/13978/global-markets-apprenticeship-2026-london-london-united-kingdom" },
    ],
  },
];
