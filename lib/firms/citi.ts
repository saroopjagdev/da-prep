import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/citi.md). Degree-level routes are mainly in Belfast; several
// London apprenticeships are below degree level. Facts were read through search-result summaries; re-check live pages.
const CITI = "https://jobs.citi.com/early-career-programs-apprenticeships";
const COO = "https://www.brightnetwork.co.uk/graduate-jobs/citi/markets-coo-apprentice";
const IOS = "https://www.findapprenticeship.service.gov.uk/apprenticeship/VAC2000014540";
const BELFAST_OPS = "https://jobs.citi.com/job/belfast/market-operations-apprentice/287/91193953088";
const GF = "https://www.graduatesfirst.com/citi-assessment-tests";
const PRINCIPLES = "https://www.citigroup.com/rcs/citigpa/storage/public/comp_philo.pdf";

export const citi: FirmProfile = {
  slug: "citi",
  name: "Citi",
  sector: "Investment banking / financial services",
  programmes: [
    {
      name: "UK apprenticeships in Legal, Markets, Operations and Technology",
      level: "2 to 6 years depending on the partner institution; some are degree level, some are not",
      locations: ["Belfast", "London"],
    },
    { name: "Legal degree apprenticeship", level: "Degree apprenticeship, 4 years part-time", degree: "LLB (Hons)", locations: ["Belfast"] },
    { name: "Market Operations Apprentice", level: "Apprenticeship (level not stated in the summary)", locations: ["Belfast"] },
    { name: "Investment Operations Specialist (Global Markets COO Office)", level: "Level 4 (not a degree)", locations: ["London"] },
    { name: "Markets COO Apprentice (Level 3 AI & Data Technician)", level: "Level 3 (not a degree)", locations: ["London"] },
  ],
  entry: {
    predictedGrades: "BBB at A level or UCAS equivalent (Markets COO)",
    other: "5 GCSEs including Maths grade B and English Language grade C, or equivalent (Markets COO).",
    source: COO,
  },
  timeline: {
    closes: "London Markets COO Apprentice (2026): 20 August 2026.",
    notes: "Dates vary by programme and location. Partner institutions in Belfast include Ulster University, Queen's University Belfast and Belfast Met.",
    source: COO,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Online application for a specific programme and location.",
      tips: ["Check whether the programme is degree level: several London routes are Level 3 or 4."],
      source: CITI,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment",
      format: "A behavioural assessment called 'Plum' is reported; one prep site says Korn Ferry Talent Q instead. Citi has not confirmed the provider.",
      tips: ["Answer behavioural questionnaires consistently and honestly."],
      source: GF,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "Video or live interview",
      format: "Pre-recorded video interview with about 6 questions and set preparation and answer time, or a Zoom/phone interview depending on the role.",
      tips: ["Prepare 'why Citi', 'why this team' and 3 or 4 STAR examples."],
      source: GF,
      confidence: "single-report",
    },
  ],
  videoInterview: {
    text: "Reported: pre-recorded, about 6 questions with set preparation and answer time; some roles use a Zoom or phone interview instead.",
    source: GF,
    confidence: "single-report",
  },
  values: ["Leadership Principles: We take ownership", "We deliver with pride", "We succeed together"],
  dayToDay: [
    "Markets COO apprentices help run the trading business: tracking revenue, controls and projects.",
    "Operations apprentices check, settle and fix trades and payments.",
  ],
  whyThisFirm: [
    { text: "Under CEO Jane Fraser, Citi has simplified into five core businesses, exited 12 of 14 overseas consumer banking franchises and cut management layers from 13 to 8.", source: "https://fortune.com/2026/05/27/citi-ceo-jane-fraser-turnaround-fortune-mpw/", confidence: "multiple-candidate-reports" },
  ],
  questions: [],
  specificAdvice: [
    "Belfast is Citi's main degree apprenticeship hub; many London apprenticeships are Level 3 or 4, so check the level before applying.",
    "Know the turnaround story: under CEO Jane Fraser, Citi has simplified into five core businesses, sold most overseas consumer banks and cut management layers. Citi is a leader in transaction banking (Services) and foreign exchange.",
    "Use Citi's three Leadership Principles (ownership, pride, succeeding together) in your examples.",
    "For Markets and Operations roles, be ready to explain in plain words what happens after a trade is agreed (checking, settling and fixing problems).",
  ],
  officialLinks: [CITI, IOS, BELFAST_OPS, PRINCIPLES],
  lastVerified: "2026-10-02",
  gaps: [
    "Which London roles are Level 6 (degree) versus Level 3/4 for 2027.",
    "Official online test provider.",
    "Salaries (Citi says 'full-time salary and benefits').",
    "Facts were read through search summaries of the pages, not the full pages.",
  ],
};
