import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/ubs.md). Recruitment is rolling.
// Facts were read through search-result summaries of the linked pages; re-check on the live pages before relying on them.
const UBS_UK = "https://www.ubs.com/global/en/careers/apprenticeships/gbr.html";
const PROSPLE = "https://uk.prosple.com/graduate-employers/ubs-uk/jobs-internships/global-markets-apprenticeship-0";
const AD = "https://www.assessmentday.co.uk/profiles/ubs-online-test.html";
const TSR = "https://www.thestudentroom.co.uk/showthread.php?t=7545577";
const TSR_P2 = "https://www.thestudentroom.co.uk/showthread.php?t=7545577&page=2";
const YP = "https://young-professionals.uk/insight-detail/from-application-to-offer-my-journey-through-the-ubs-recruitment-process/64ef4ab41d50ab592a445029/";
const CULTURE = "https://www.ubs.com/global/en/our-firm/our-culture.html";

export const ubs: FirmProfile = {
  slug: "ubs",
  name: "UBS",
  sector: "Investment banking / wealth management",
  programmes: [
    {
      name: "Investment Bank apprenticeships (Global Markets, Investment Bank COO)",
      level: "Starts on Level 4 Investment Operations Specialist, then Level 6 Financial Services Professional with CFA Level 1 and/or a Chartered Banker Institute qualification",
      degree: "BSc (Hons) Applied Finance (University of Exeter)",
      locations: ["London"],
    },
    { name: "Group Internal Audit (Analytics) apprenticeship", level: "Degree apprenticeship", degree: "BSc Digital and Technology Solutions (University of Exeter)", locations: ["London"] },
    { name: "Group Treasury apprenticeship", level: "Degree apprenticeship", degree: "BSc Applied Finance (University of Exeter)", locations: ["London"] },
    { name: "Wealth Management apprenticeship", level: "Apprenticeship (level not confirmed)", locations: ["London"] },
  ],
  entry: {
    predictedGrades: "Generally ABB at A level",
    other: "In the final year of A levels (or equivalent) or finished within the last two years. GCSE English Language grade 5+ and Maths grade 6+.",
    source: UBS_UK,
  },
  timeline: {
    rolling: true,
    notes: "UBS recruits on a rolling basis, so apply as soon as the programme you want opens.",
    source: UBS_UK,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Online application for a chosen business area.",
      tips: ["Choose your business area carefully: the tests you get depend on it."],
      source: UBS_UK,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online tests",
      format: "Up to four types, assigned by business area: verbal, numerical, inductive-logical reasoning and 'UBS Culture Match'. Complete within 7 days of the invite; no retakes after the deadline.",
      tips: ["Do the tests early in the 7-day window in case of technical problems.", "For Culture Match, answer honestly and in line with UBS's behaviours."],
      source: PROSPLE,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "Video interview",
      format: "Recorded video interview, typically about 2 weeks after passing the tests. One degree apprentice applicant described about 1 minute to prepare and 2 minutes to answer.",
      provider: "HireVue (candidate-reported)",
      tips: ["Prepare 'why UBS', 'why this business area' and 3 or 4 STAR stories."],
      source: TSR,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "Assessment centre / interviews",
      format: "Final stage with interviews; the exact format for apprentices was not in the summaries we saw.",
      tips: ["Read one candidate's full journey from application to offer (linked in sources)."],
      source: YP,
      confidence: "single-report",
    },
  ],
  oa: {
    provider: "Not confirmed ('UBS Culture Match' is UBS's own name)",
    tests: [
      { name: "Verbal reasoning", format: "Passage-based reasoning" },
      { name: "Numerical reasoning", format: "Tables and charts" },
      { name: "Inductive-logical reasoning", format: "Pattern sequences" },
      { name: "UBS Culture Match", format: "Behavioural / culture-fit questionnaire" },
    ],
    styleNotes:
      "Tests are assigned by business area, so not everyone sits all four. Complete within 7 days of the invite. Practise standard verbal, numerical and pattern-based reasoning tests; Culture Match rewards consistent answers aligned with accountability, collaboration and innovation.",
    source: AD,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "Reported: 8 to 10 competency questions; one degree apprentice applicant described about 1 minute to prepare and 2 minutes to answer.",
    source: TSR_P2,
    confidence: "multiple-candidate-reports",
  },
  values: ["Accountability with integrity", "Collaboration", "Innovation"],
  dayToDay: [
    "Global Markets apprentices support traders and salespeople: preparing client and market data, booking and checking trades.",
    "Internal Audit apprentices test whether the bank's controls work.",
  ],
  whyThisFirm: [
    { text: "UBS is the world's largest wealth manager and is in the final stretch of integrating Credit Suisse, due to finish around the end of 2026.", source: "https://www.thewealthadvisor.com/article/ubs-says-wealth-management-momentum-holding-credit-suisse-integration-nears-its-end", confidence: "multiple-candidate-reports" },
    { text: "Swiss lawmakers are debating capital rules for UBS's foreign units; CEO Sergio Ermotti called a compromise on one part 'bearable'.", source: "https://www.bloomberg.com/news/articles/2026-09-20/ubs-head-ermotti-calls-at1-capital-compromise-bearable-nzz-says", confidence: "multiple-candidate-reports" },
  ],
  questions: [],
  specificAdvice: [
    "Check the grade bar: generally ABB at A level and GCSE Maths 6+, higher than many banks.",
    "Know the big UBS story: it is completing the integration of Credit Suisse (due to finish around the end of 2026) and is the world's largest wealth manager. Check the latest news before interviews.",
    "Be clear about why you chose your business area: Global Markets, COO, Internal Audit and Treasury do very different work.",
    "Use UBS's three behaviours (accountability with integrity, collaboration, innovation) in your examples.",
    "Apply early because recruitment is rolling.",
  ],
  officialLinks: [UBS_UK, CULTURE],
  lastVerified: "2026-10-02",
  gaps: ["Salary.", "Online test vendor.", "Assessment centre format for apprentices.", "Facts were read through search summaries of the pages, not the full pages."],
};
