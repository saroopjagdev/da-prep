import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/bny.md). Values, salary, test details and deadline not found.
// Facts were read through search-result summaries of the linked pages; re-check on the live pages before relying on them.
const BNY = "https://www.bny.com/corporate/global/en/about-us/careers/students/apprenticeship-program.html";
const PROSPLE = "https://uk.prosple.com/graduate-employers/bny-mellon-uk/jobs-internships/apprenticeship-program";
const SS = "https://talents.studysmarter.co.uk/companies/bny-mellon/2025-bny-apprenticeship-program-manchester-12503723/";

export const bny: FirmProfile = {
  slug: "bny",
  name: "BNY",
  sector: "Banking / asset servicing",
  programmes: [
    {
      name: "UK Apprenticeship Program",
      level: "4-year full-time apprenticeship across functional areas, studying for a related degree or professional qualification funded by BNY",
      degree: "Manchester: BSc Business Management, University of Salford (single report)",
      locations: ["Manchester", "Liverpool", "London"],
    },
    { name: "Legal Apprenticeship Program", level: "Apprenticeship (level not confirmed)", locations: ["Manchester"] },
  ],
  entry: {
    predictedGrades: "Three A levels at B, C, C minimum (predicted or achieved)",
    other: "No related degree already, and lived in England for the previous three years.",
    source: PROSPLE,
  },
  timeline: {
    opens: "Listings are summarised as opening in March; exact dates unclear.",
    notes: "Check BNY's apprenticeship page for the current window.",
    source: PROSPLE,
  },
  stages: [
    { order: 1, name: "Online application", format: "Online application (CV autofill).", tips: ["Say which functional area interests you and why."], source: PROSPLE, confidence: "official" },
    { order: 2, name: "Skills assessment", format: "Online skills assessment; format not described in the summaries.", tips: ["Practise numerical and verbal reasoning in case they are included."], source: PROSPLE, confidence: "official" },
    {
      order: 3,
      name: "Call with early careers recruitment",
      format: "A call with the early careers team, then a short assessment.",
      tips: ["Be ready to explain in plain words what BNY does: it looks after investors' assets and processes their trades and payments."],
      source: PROSPLE,
      confidence: "official",
    },
  ],
  values: ["Values wording not found; check BNY's careers pages"],
  dayToDay: [
    "BNY looks after investors' assets (custody), processes trades and payments and administers funds. Apprentices typically join operations, technology or client service teams.",
  ],
  whyThisFirm: [
    { text: "BNY is the world's largest custodian, with about $60 trillion of assets under custody, and is moving to a 'platform operating model'.", source: "https://www.americanbanker.com/news/bny-tops-estimates-reports-revenue-upswing", confidence: "multiple-candidate-reports" },
    { text: "Its in-house AI platform, Eliza, supported about 220 AI solutions by early 2026; CEO Robin Vince also sits on OpenAI's board.", source: "https://www.axios.com/2026/08/12/bny-ceo-robin-vince-openai-board-how-he-uses-ai", confidence: "multiple-candidate-reports" },
  ],
  questions: [],
  specificAdvice: [
    "Know what BNY is: the world's largest custodian, looking after about $60 trillion of investors' assets. It isn't a high-street bank.",
    "Its in-house AI platform, Eliza, and the move to a 'platform operating model' are good talking points for 'why BNY'.",
    "Entry grades (BCC) are lower than at most investment banks, which makes BNY a strong option to add to your list.",
    "Most apprentices join operations, technology or client service teams. Think about which fits you before applying.",
  ],
  officialLinks: [BNY, SS],
  lastVerified: "2026-10-02",
  gaps: [
    "Values wording, salary, test details and deadline.",
    "Which degree each functional area leads to (only Manchester Business Management was seen, in one listing).",
    "Facts were read through search summaries of the pages, not the full pages.",
  ],
};
