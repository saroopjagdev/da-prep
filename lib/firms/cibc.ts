import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/other-banks.md). Based on CIBC's adverts on gov.uk Find an
// Apprenticeship; the latest seen closed 23 June 2025. Read through search summaries; re-check live adverts.
const IB = "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/1000324123";
const CB = "https://www.findapprenticeship.service.gov.uk/apprenticeship/VAC2000031739";

export const cibc: FirmProfile = {
  slug: "cibc",
  name: "CIBC",
  sector: "Investment banking / corporate banking",
  programmes: [
    { name: "Investment Banking Degree Apprentice", level: "Degree apprenticeship on sales and trading desks", degree: "Degree in Applied Finance", locations: ["London"] },
    { name: "Corporate Banking Degree Apprentice", level: "Degree apprenticeship", locations: ["London"] },
  ],
  entry: {
    other: "Entry requirements are on each gov.uk advert; they were not in the summaries we saw.",
    source: IB,
  },
  timeline: {
    closes: "The most recent Investment Banking advert seen closed on 23 June 2025.",
    notes: "CIBC advertises on gov.uk Find an Apprenticeship. Set an alert there for 'CIBC'.",
    source: IB,
  },
  stages: [
    {
      order: 1,
      name: "Apply via Find an Apprenticeship",
      format: "Apply through the gov.uk Find an Apprenticeship service. Later stages were not described in the summaries we saw.",
      tips: ["Set up a Find an Apprenticeship alert so you see the next advert as soon as it opens."],
      source: IB,
      confidence: "official",
    },
  ],
  values: ["Values wording not found; check CIBC's careers pages"],
  dayToDay: [
    "Investment Banking apprentices support sales and trading desks that buy and sell financial products for clients.",
  ],
  questions: [],
  specificAdvice: [
    "CIBC is a large Canadian bank with a London investment banking arm. Be ready to explain why a smaller London team appeals to you.",
    "Sales and trading apprentices support desks that buy and sell financial products for clients, so follow markets news (interest rates, currencies, bonds) before applying.",
    "Adverts appear on gov.uk Find an Apprenticeship, sometimes with summer closing dates later than many banks'.",
  ],
  officialLinks: [IB, CB],
  lastVerified: "2026-10-02",
  gaps: ["2026/27 adverts.", "Entry requirements, salary, tests and interview format.", "University partner."],
};
