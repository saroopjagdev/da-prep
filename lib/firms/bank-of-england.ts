import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/bank-of-england.md). Most recent cycle seen: 2026 entry.
// Facts were read through search-result summaries of the linked pages; re-check on the live pages before relying on them.
const ADVERT = "https://www.leedsforlearning.co.uk/Article/181675";
const HOW = "https://www.bankofengland.co.uk/careers/how-to-apply";
const AD = "https://www.assessmentday.co.uk/profiles/bank-of-england.html";
const ACHQ = "https://www.assessmentcentrehq.com/bank-of-england-test/";

export const bankOfEngland: FirmProfile = {
  slug: "bank-of-england",
  name: "Bank of England",
  sector: "Central banking / public sector finance",
  programmes: [
    {
      name: "Degree Apprenticeship Development Programme: Digital & Technology Solutions",
      level: "Degree apprenticeship, 36 months, leading to a permanent role; part-time degree for 20% of working hours",
      locations: ["Leeds (hybrid)", "London"],
    },
  ],
  entry: {
    predictedGrades: "BBB at A level (or IB 30/555, BTEC DDM, T Level Merit)",
    other: "5 GCSEs at grade 4/C or above including English and Maths. UK resident for the previous 3 years (unless exempt), finished education by the start date, and no overlapping prior qualification.",
    source: ADVERT,
  },
  timeline: {
    closes: "2026 entry: 12 January 2026. Start at the end of August 2026.",
    rolling: false,
    notes: "Salary for 2026 entry was £25,270 plus benefits (Leeds). 2027-entry dates were not yet published when researched.",
    source: ADVERT,
  },
  stages: [
    { order: 1, name: "Application form", format: "Online application form.", tips: ["Show you understand what the Bank of England does, not just that it is a bank."], source: HOW, confidence: "official" },
    {
      order: 2,
      name: "Situational judgement test",
      format: "Online situational judgement test. One prep site also reports numerical, verbal and logical tests for apprenticeships.",
      tips: ["Think about public service, integrity and teamwork when choosing responses."],
      source: HOW,
      confidence: "official",
    },
    {
      order: 3,
      name: "Pre-recorded video interview",
      format: "Recorded interview; one prep site reports 5 questions on values fit, field knowledge, reasons for applying and the current economic climate.",
      tips: ["Know the current Bank Rate and the latest Monetary Policy Committee decision before recording."],
      source: AD,
      confidence: "single-report",
    },
    {
      order: 4,
      name: "Virtual assessment centre",
      format: "Online assessment centre with group exercises and interviews.",
      tips: ["In group exercises, listen, summarise and help the group reach a decision on time."],
      source: ACHQ,
      confidence: "multiple-candidate-reports",
    },
  ],
  videoInterview: {
    text: "Pre-recorded; reported as 5 questions on values fit, knowledge of the field, reasons for applying and the economic climate.",
    source: AD,
    confidence: "single-report",
  },
  assessmentCentre: { text: "Virtual assessment centre with group exercises and interviews.", source: HOW, confidence: "multiple-candidate-reports" },
  values: ["Values wording not found; the Bank's mission is to promote the good of the people of the UK by maintaining monetary and financial stability"],
  pay: { text: "£25,270 plus benefits (Leeds, 2026 entry).", source: ADVERT, confidence: "official" },
  dayToDay: [
    "Digital & Technology Solutions apprentices build and support the systems and data tools the Bank uses to set interest rates, supervise banks and keep the financial system stable.",
  ],
  questions: [],
  specificAdvice: [
    "Learn the basics: the Bank sets Bank Rate through the Monetary Policy Committee to hit the 2% inflation target, regulates banks through the Prudential Regulation Authority, keeps the financial system stable and issues banknotes.",
    "Know the current Bank Rate and the latest MPC decision before any interview.",
    "The degree apprenticeship is in Digital & Technology Solutions: link your interest in technology to how a central bank uses data and systems.",
    "The 2026 deadline was 12 January, earlier than most banks, so prepare in the autumn.",
  ],
  officialLinks: [HOW, "https://www.bankofengland.co.uk/careers"],
  lastVerified: "2026-10-02",
  gaps: [
    "2027-intake dates.",
    "Whether economics or other streams run for 2027.",
    "Official values wording.",
    "Facts were read through search summaries of the pages, not the full pages.",
  ],
};
