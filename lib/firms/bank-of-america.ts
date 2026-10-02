import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/bank-of-america.md). Most recent cycle seen: 2026 entry.
// Facts were read through search-result summaries of the linked pages; re-check on the live adverts before relying on them.
const GM = "https://careers.bankofamerica.com/en-us/students/job-detail/13978/global-markets-apprenticeship-2026-london-london-united-kingdom";
const GM_DS = "https://careers.bankofamerica.com/en-us/students/job-detail/13979/global-markets-data-science-apprenticeship-2026-london-london-united-kingdom";
const GM_COO = "https://careers.bankofamerica.com/en-us/students/job-detail/13983/global-markets-chief-operating-office-apprenticeship-2026-london-london-united-kingdom";
const GM_TECH = "https://careers.bankofamerica.com/en-us/students/job-detail/13968/global-markets-technology-apprentice-2026-bromley-bromley-united-kingdom";
const HIGHERIN = "https://higherin.com/company-profile/337/bank-of-america";
const GAP = "https://www.gameassessmentprep.com/employers/bank-of-america";
const CODE = "https://d1io3yog0oux5.cloudfront.net/_09a3dcd0b9f85a510d190adaf43e5153/bankofamerica/files/pages/corporate-governance/governance-library/code-of-conduct/CodeofConduct062525_ADA.pdf";

export const bankOfAmerica: FirmProfile = {
  slug: "bank-of-america",
  name: "Bank of America",
  sector: "Investment banking / financial services",
  programmes: [
    {
      name: "Global Markets Apprenticeship",
      level: "Level 6 Financial Services Professional, 4 years",
      degree: "Degree in Applied Finance",
      locations: ["London"],
    },
    { name: "Global Markets Data Science Apprenticeship", level: "Degree apprenticeship, 3 years", degree: "BSc (Hons) Data Science", locations: ["London"] },
    { name: "Global Markets Chief Operating Office Apprenticeship", level: "Apprenticeship (level not stated in the summary)", locations: ["London"] },
    {
      name: "Technology, Operations and Payments apprenticeships (Global Markets Technology, Equities Product Technology, Technology Solutions, Global Operations, Global Payments Solutions)",
      level: "Apprenticeships (levels vary; check each advert)",
      locations: ["London", "Bromley"],
    },
  ],
  entry: {
    ucas: "At least 3 A levels/BTEC or equivalent, minimum 120 UCAS points (BBB) for Global Markets.",
    predictedGrades: "BBB",
    other: "GCSE Maths grade 7 and GCSE English Language grade 5 (Global Markets). UK resident for the past 3 years, not in full-time education at the start, and the right to work and remain in the UK indefinitely.",
    source: GM,
  },
  timeline: {
    opens: "Autumn (2026-entry adverts were live in the 2025-26 season).",
    closes: "2026 entry: Global Markets 2 April 2026; Data Science and other programmes 15 February 2026.",
    rolling: true,
    notes: "Recruitment is rolling and assessments start before the deadline, so apply early. 2027-entry dates were not yet confirmed when researched.",
    source: GM,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Online application with CV upload and competency questions.",
      tips: ["Apply early: recruiting is rolling and places can fill before the deadline.", "Have short examples ready for teamwork, problem solving and initiative."],
      source: HIGHERIN,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 2,
      name: "HireVue video interview",
      format: "On-demand recorded interview: about 30 seconds to prepare and up to 3 minutes to answer each question. Practice questions are available before you start.",
      provider: "HireVue",
      tips: ["Use the practice questions to check your camera and pacing.", "Three minutes is long: plan a clear STAR structure so you don't run out of things to say."],
      source: GAP,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "Assessment centre",
      format: "Two interviews, one competency-based and one technical/role-based.",
      tips: ["For Global Markets, know what sales and trading desks do and follow a few market stories.", "For technology roles, be ready to talk through a project you built."],
      source: HIGHERIN,
      confidence: "single-report",
    },
  ],
  videoInterview: {
    text: "HireVue on-demand: about 30 seconds to prepare and up to 3 minutes per answer; candidates describe 3 to 5 questions. Practice questions available.",
    source: GAP,
    confidence: "multiple-candidate-reports",
  },
  assessmentCentre: {
    text: "Reported as two interviews: competency and technical/role. Format not confirmed by Bank of America.",
    source: HIGHERIN,
    confidence: "single-report",
  },
  values: ["Deliver together", "Act responsibly", "Realize the power of our people", "Trust the team", "Strategy: Responsible Growth"],
  dayToDay: [
    "Global Markets apprentices support sales and trading desks: pricing, booking trades, preparing market updates and client data.",
    "Chief Operating Office apprentices track the desk's revenue, costs and controls.",
  ],
  whyThisFirm: [
    { text: "Press reported first-quarter 2026 sales and trading revenue of $6.4 billion, the 16th straight quarter of year-on-year growth, and the best equities trading quarter in 15 years.", source: "https://www.cnbc.com/2026/04/15/bank-of-america-bac-earnings-q1-2026.html", confidence: "multiple-candidate-reports" },
    { text: "Bank of America describes its strategy as 'Responsible Growth'.", source: CODE, confidence: "official" },
  ],
  questions: [],
  specificAdvice: [
    "Check the GCSE bar before applying: Global Markets asked for GCSE Maths grade 7, higher than most banks.",
    "Talk about 'Responsible Growth', Bank of America's stated strategy, and link your examples to its four values.",
    "Follow a recent results story: press reported record sales and trading revenue in 2026 and the best equities trading quarter in 15 years (check the latest quarter before your interview).",
    "Pick the right programme: Global Markets is client and trading-desk facing; the COO and Operations routes focus on how the business runs; Data Science and Technology build tools.",
    "Apply well before the closing date because recruiting is rolling.",
  ],
  officialLinks: [GM, GM_DS, GM_COO, GM_TECH, CODE],
  lastVerified: "2026-10-02",
  gaps: [
    "Salary was not in any search summary.",
    "University partners are not named in the summaries seen.",
    "2027-entry adverts and dates.",
    "Online test vendor, if any, for apprentices.",
    "Facts were read through search summaries of the adverts, not the full pages.",
  ],
};
