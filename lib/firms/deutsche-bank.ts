import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/deutsche-bank.md). Most recent cycle seen: 2026 entry.
// Facts were read through search-result summaries of the linked pages; re-check on the live adverts before relying on them.
const IBCM = "https://db.recsolu.com/jobs/PzcMmhBPdA4zqOOh4pweDQ?locale=en";
const IBCM_BN = "https://www.brightnetwork.co.uk/graduate-jobs/deutsche-bank/investment-banking-capital-markets-apprenticeship-programme-2026";
const TDI = "https://careers.db.com/School-leavers-uk/tdi-apprenticeship-programme/";
const TDI_BN = "https://www.brightnetwork.co.uk/graduate-jobs/deutsche-bank/technology-data-innovation-apprenticeship-programme-2026-1";

export const deutscheBank: FirmProfile = {
  slug: "deutsche-bank",
  name: "Deutsche Bank",
  sector: "Investment banking / financial services",
  programmes: [
    {
      name: "Investment Banking & Capital Markets (IBCM) Apprenticeship Programme",
      level: "Degree apprenticeship with rotations across IBCM teams (Debt Capital Markets, Equity Capital Markets, Leveraged Debt Capital Markets and others)",
      degree: "Applied Finance degree (Queen Mary University of London), plus CISI/IMC and CFA study",
      locations: ["London"],
    },
    {
      name: "Technology, Data & Innovation (TDI) Degree Apprenticeship",
      level: "Level 6 Digital and Technology Solutions Professional; 20% of time on training",
      degree: "BSc Digital and Technology Solutions (University of Exeter)",
      locations: ["Birmingham", "London"],
    },
  ],
  entry: {
    ucas: "TDI: A levels BBB (120 UCAS points) including one of Maths, Further Maths, Computer Science or IT.",
    predictedGrades: "BBB",
    other: "TDI: GCSE Maths and English at grade 4-9. Residency and right-to-work rules apply; the summary we saw was unclear, so check the advert's exact wording.",
    source: TDI_BN,
  },
  timeline: {
    closes: "2026 entry: 22 February 2026, 11:59pm GMT (TDI and IBCM).",
    rolling: false,
    notes: "2027-entry dates were not yet published when researched.",
    source: TDI_BN,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Application on Deutsche Bank's careers portal.",
      tips: ["Say which IBCM team interests you and why (for example, how companies raise money through bonds or shares)."],
      source: IBCM,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment tests",
      format: "Online tests before the assessment day. The provider was not named in the summaries we saw.",
      tips: ["Practise numerical and logical reasoning under time pressure."],
      source: TDI_BN,
      confidence: "official",
    },
    {
      order: 3,
      name: "Assessment day",
      format: "TDI: technical interview, core skills exercise and group exercise.",
      tips: ["In the group exercise, help the group reach a decision rather than just talking the most.", "For TDI, be ready to explain a piece of code or a tech project in plain words."],
      source: TDI_BN,
      confidence: "official",
    },
  ],
  assessmentCentre: {
    text: "TDI assessment day: technical interview, core skills exercise and group exercise. IBCM assessment day format not confirmed.",
    source: TDI_BN,
    confidence: "official",
  },
  values: ["Integrity", "Sustainable performance", "Client centricity", "Innovation", "Discipline", "Partnership"],
  dayToDay: [
    "IBCM apprentices help bankers raise money for companies through bonds (Debt Capital Markets) and shares (Equity Capital Markets): building pitch books, tracking markets and preparing deal materials.",
    "TDI apprentices build and run the bank's systems.",
  ],
  whyThisFirm: [
    { text: "Deutsche Bank reported a record first-half 2026 profit after tax of €4.1 billion, with second-quarter investment banking (IBCM) revenue up 36%.", source: "https://investor-relations.db.com/files/documents/quarterly-results/2026/Q2-2026-Media-Release.pdf?language_id=1", confidence: "official" },
  ],
  questions: [],
  specificAdvice: [
    "Know the difference between Debt Capital Markets (helping companies borrow by issuing bonds) and Equity Capital Markets (helping them sell shares), because IBCM apprentices rotate through both.",
    "Have a current story ready: Deutsche Bank reported record first-half 2026 profit and strong investment banking growth (check the latest quarterly results before interviews).",
    "TDI needs Maths, Further Maths, Computer Science or IT at A level, so check your subjects first.",
    "Use the six values in your answers, especially client centricity and discipline.",
    "Apply well before the February deadline.",
  ],
  officialLinks: [IBCM, TDI, IBCM_BN, "https://investor-relations.db.com/files/documents/quarterly-results/2026/Q2-2026-Media-Release.pdf?language_id=1"],
  lastVerified: "2026-10-02",
  gaps: [
    "Salary: one listing said £800-£1,400 a month, which looks wrong for a London bank, so it is not shown.",
    "Online test provider.",
    "IBCM entry requirements and assessment format.",
    "2027-entry deadlines.",
    "Facts were read through search summaries of the adverts, not the full pages.",
  ],
};
