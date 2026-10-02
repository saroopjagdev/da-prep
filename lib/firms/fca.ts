import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/fca.md). Most recent cycle seen: 2026 entry.
// Facts were read through search-result summaries of the linked pages; re-check on the live pages before relying on them.
const FCA = "https://www.fca.org.uk/careers/early-careers";
const PCTM = "https://pathwayctm.com/event/fca-apprenticeships-how-to-apply-stand-out-discover-your-strengths/";

export const fca: FirmProfile = {
  slug: "fca",
  name: "Financial Conduct Authority (FCA)",
  sector: "Financial regulation / public sector finance",
  programmes: [
    {
      name: "Apprenticeship pathways (six, including degree apprenticeships)",
      level: "18 to 36 months; some pathways are degree apprenticeships (which ones was not confirmed)",
      locations: ["London", "Leeds", "Edinburgh"],
    },
  ],
  entry: {
    other: "5 GCSEs (A-C) and 2 A levels.",
    source: FCA,
  },
  timeline: {
    opens: "2026 entry: applications opened February 2026.",
    notes: "Assessment centres ran April to May 2026, with a 7 September 2026 start. Salary: £25,700 in London and £23,500 in Leeds and Edinburgh. Benefits include a non-contributory pension, 25+ days' holiday, a season ticket loan and private healthcare.",
    source: FCA,
  },
  stages: [
    { order: 1, name: "Online application", format: "Online application from February.", tips: ["Pick the pathway that matches your interests and check whether it is degree level."], source: FCA, confidence: "official" },
    { order: 2, name: "Assessment centre", format: "Assessment centres in April and May; format not described in the summaries we saw.", tips: ["Be ready to talk about why fair treatment of customers matters."], source: FCA, confidence: "official" },
  ],
  values: ["Values wording not found; the FCA's role is to make financial markets work well for consumers and firms"],
  pay: { text: "£25,700 in London; £23,500 in Leeds and Edinburgh (2026 entry).", source: FCA, confidence: "official" },
  dayToDay: [
    "Apprentices join teams across the regulator, for example supervising firms, handling consumer issues, data or technology.",
  ],
  questions: [],
  specificAdvice: [
    "Know what the FCA does: it regulates how financial firms treat customers (for example through the Consumer Duty) and works to keep markets fair and honest.",
    "Only some of the six pathways are degree apprenticeships. Check the level of the one you apply for.",
    "Entry requirements (5 GCSEs and 2 A levels) are lower than at most investment banks.",
    "Look out for FCA 'how to apply' events, such as one run with Pathway CTM.",
  ],
  officialLinks: [FCA, PCTM],
  lastVerified: "2026-10-02",
  gaps: ["Which of the six pathways are Level 6.", "Test and interview format.", "2027-entry dates.", "Facts were read through search summaries of the pages, not the full pages."],
};
