import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/rothschild.md). 2026/27 dates were not found.
// Facts were read through search-result summaries of the linked pages; re-check on the live pages before relying on them.
const RC = "https://www.rothschildandco.com/en/careers/students-and-graduates/apprenticeships/";
const FAQ = "https://www.rothschildandco.com/en/careers/students-and-graduates/faqs/";
const AMELIA = "https://www.rothschildandco.com/en/careers/colleague-stories/amelia/";
const WM = "https://rothschildandco.tal.net/vx/mobile-0/appcentre-ext/brand-4/candidate/so/pm/1/pl/2/opp/767-Rothschild-Co-2025-Wealth-Management-Client-Pathways-Apprenticeship-Programme/en-GB";
const HIGHERIN = "https://higherin.com/company-profile/1054/rothschild-co";
const INTERVYO = "https://www.intervyo.co.uk/firms/rothschild/online-assessment";
const FINBOUND = "https://www.finbound.org/blog/rothschild-hirevue-interview-guide";

export const rothschild: FirmProfile = {
  slug: "rothschild",
  name: "Rothschild & Co",
  sector: "Investment banking (advisory) / wealth management",
  programmes: [
    {
      name: "Global Advisory Degree Apprenticeship",
      level: "4 years: Level 4 Investment Operations Specialist for the first two years, then Level 6 Financial Services Professional. 4 days in the office, 1 day studying",
      degree: "Undergraduate Finance degree (University of Exeter), plus the Investment Management Certificate and CFA Level 1",
      locations: ["London"],
    },
    { name: "Wealth Management Client Pathways Apprenticeship Programme", level: "Apprenticeship (level not confirmed)", locations: ["London"] },
  ],
  entry: {
    other: "Entry requirements were not in the summaries we saw; check the apprenticeships page.",
    source: RC,
  },
  timeline: {
    notes: "2026/27 apprenticeship dates were not found when researched. Check the apprenticeships page and register for alerts.",
    source: RC,
  },
  stages: [
    { order: 1, name: "Online application", format: "Online application.", tips: ["Explain why independent advisory appeals to you, not just 'banking'."], source: FAQ, confidence: "official" },
    {
      order: 2,
      name: "Online tests",
      format: "Conflicting reports: SHL numerical and logical tests, or a Cappfinity sift. Mostly from internship and graduate reports, not apprentices.",
      tips: ["Practise numerical and logical reasoning; also try a Cappfinity-style test in case that is used."],
      source: INTERVYO,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "First-round interview",
      format: "Online or in person, about your experiences, skills and motivation.",
      tips: ["Have a clear answer to 'Why Rothschild & Co?' and 'Why advisory?'."],
      source: RC,
      confidence: "official",
    },
    {
      order: 4,
      name: "Assessment centre",
      format: "A further interview with senior colleagues, a collaborative group exercise and a case study.",
      tips: ["In the group exercise, build on others' ideas and keep the group to time.", "In the case study, give a clear recommendation and the two or three reasons that matter most."],
      source: RC,
      confidence: "official",
    },
  ],
  assessmentCentre: {
    text: "Further interview with senior colleagues, a collaborative group exercise and a case study.",
    source: RC,
    confidence: "official",
  },
  values: ["Values wording not found; the firm presents itself as an independent, family-controlled adviser"],
  dayToDay: [
    "Global Advisory apprentices support bankers who advise companies on buying, selling or merging: researching companies, building spreadsheets of financials and preparing presentation slides.",
  ],
  questions: [
    { stage: "First-round interview", question: "Why Rothschild & Co?", type: "motivation", source: FINBOUND, confidence: "multiple-candidate-reports" },
    { stage: "First-round interview", question: "Why independent advisory?", type: "motivation", source: FINBOUND, confidence: "multiple-candidate-reports" },
    { stage: "First-round interview", question: "Give an example of when you showed resilience.", type: "competency", competency: "Resilience", source: FINBOUND, confidence: "multiple-candidate-reports" },
  ],
  specificAdvice: [
    "Understand 'independent advice': Rothschild & Co advises companies on mergers, acquisitions and debt restructuring without lending them its own money, so its advice isn't tied to selling loans.",
    "Read Amelia's apprentice story on the Rothschild & Co site to understand the 4-days-work, 1-day-study pattern.",
    "Be ready for light technical questions on how companies are valued and what's in financial statements; these are reported for internships and may come up.",
    "Questions listed here come from internship and graduate reports, not apprentice-specific ones.",
  ],
  officialLinks: [RC, FAQ, AMELIA, WM, HIGHERIN],
  lastVerified: "2026-10-02",
  gaps: [
    "2026/27 apprenticeship dates.",
    "Entry requirements and salary.",
    "Online test provider (SHL and Cappfinity both reported).",
    "Official values wording.",
    "Facts were read through search summaries of the pages, not the full pages.",
  ],
};
