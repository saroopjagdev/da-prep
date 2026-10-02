import type { FirmProfile } from "./types";

// Research date 2026-09-30, updated 2026-10-02 (docs/research/finance-firms/existing-profiles-updates.md). Most recent cycle with candidate detail: 2025 entry (applications Aug 2024 - Jan 2025, processed in batches to March 2025). 2027 entry applications open Autumn 2026 (official).
const GS_DA = "https://www.goldmansachs.com/careers/students/programs-and-internships/emea/degree-apprentices";
const GS_BHAM = "https://www.goldmansachs.com/pressroom/press-releases/2025/degree-apprenticeship-programme-in-birmingham";
const GS_PREP = "https://www.goldmansachs.com/careers/students/prepare";
const TSR_P8 = "https://www.thestudentroom.co.uk/showthread.php?t=7519558&page=8";
const TSR_P10 = "https://www.thestudentroom.co.uk/showthread.php?t=7519558&page=10";
const GAP_HIREVUE = "https://www.gameassessmentprep.com/hirevue/questions/goldman-sachs";
const GF_GS = "https://www.graduatesfirst.com/goldman-sachs-aptitude-tests";

export const goldmanSachs: FirmProfile = {
  slug: "goldman-sachs",
  name: "Goldman Sachs",
  sector: "Investment banking",
  programmes: [
    {
      name: "FICC and Equities Degree Apprenticeship",
      level: "Level 6, 4 years",
      degree: "BSc Applied Finance, Queen Mary University of London",
      locations: ["London"],
    },
    {
      name: "Engineering Degree Apprenticeship",
      level: "Level 6, 4 years",
      degree: "BSc Digital and Technology Solutions, Queen Mary (London) or University of Warwick (Birmingham)",
      locations: ["London", "Birmingham"],
    },
    {
      name: "Operations Degree Apprenticeship",
      level: "Level 6, 4 years",
      degree: "BSc Finance & Investment, Walbrook Institute London (read through a search summary of the official page; confirm on the live page)",
      locations: ["London"],
    },
  ],
  entry: {
    predictedGrades:
      "Not stated on the official page. Prep site: FICC often AAA with A-level Maths; Engineering typically ABB; Operations ABB. Treat as unofficial. One 2025 candidate applied with 37 IB points.",
    other: "Students looking to start an undergraduate degree in September 2027 (official). Start September; salary GBP 24k-40k is a prep-site range.",
    source: GS_DA,
  },
  timeline: {
    opens: "2027 entry: applications are open now (official page, early October 2026). For 2026 entry they opened on 1 October 2025. 2025 cycle: opened around August-September 2024 and ran to early January 2025 per prep sites.",
    closes: "Early January (prep site); applications are reviewed on a rolling basis.",
    rolling: true,
    notes:
      "2025 cycle: Goldman processed applicants in batches per division (a current apprentice relayed that apprentices had complained of slowness, with some offers as late as May). Applicants from September received HireVue invites around the turn of the year; later batches had Superdays in February and March. Applying in mid-September still landed some candidates in the first FICC batch; applying late October or early November could still get a HireVue (Operations/FICC). Status updates come at application, in-season and at the end of season.",
    source: TSR_P8,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Online form with CV (and transcript/grades). Choose a division: FICC and Equities, Engineering (and Operations in 2025). Candidates report applying to more than one division and receiving a combined HireVue.",
      tips: [
        "Apply early anyway, but expect delays: applicants from August to October 2024 reported hearing nothing for months because of batch processing.",
        "Tailor CV to the division.",
      ],
      source: GS_PREP,
      confidence: "official",
    },
    {
      order: 2,
      name: "HireVue video interview",
      format:
        "Official: ~30 minutes. Prep sites and candidates: 5-6 questions, 30 seconds preparation and up to 2 minutes per answer, no retakes, behavioural and motivational, FICC applicants get a technical question and some questions are worded oddly. Engineering applicants additionally take a HackerRank assessment.",
      provider: "HireVue (HackerRank for Engineering)",
      durationMins: 30,
      passMarkNotes: "No scores released. A combined Operations + FICC interview exists if you applied to both.",
      tips: [
        "Practise with the trial option: no retakes on the live attempt.",
        "Prepare a specific 'why Goldman Sachs, why this division' with real deals/markets references, not prestige.",
        "For FICC, learn the basics of fixed income, currencies, commodities and equities; candidates worried about how technical it is.",
      ],
      source: GS_PREP,
      confidence: "official",
    },
    {
      order: 3,
      name: "HackerRank assessment (Engineering only)",
      format: "Official: Engineering applicants take a HackerRank assessment. Prep site claims 2-4 coding problems in 120-180 minutes; not verified for the DA route.",
      provider: "HackerRank",
      tips: ["Practise data structures, algorithms and recursion under time pressure on HackerRank."],
      source: GS_PREP,
      confidence: "official",
    },
    {
      order: 4,
      name: "Superday",
      format:
        "Official: a series of final-round interviews, typically two to five for campus hires depending on division, meeting a cross-section of people. Reported for London in the DA cycle: three interviews of ~30 minutes covering your CV, previous experience and a logical reasoning question. FICC Superday candidates (internship reports) describe ~20-minute interviews with technicals on rates/fixed income and brainteasers.",
      durationMins: 90,
      passMarkNotes: "Offers roll out between January and May; some apprentices reported May offers.",
      tips: [
        "Be able to walk through your CV and every line.",
        "Prepare market awareness: a recent deal or market event you can explain.",
        "Practise talking through a logical-reasoning puzzle out loud.",
      ],
      source: GS_PREP,
      confidence: "official",
    },
  ],
  videoInterview: {
    text:
      "One-way HireVue of ~30 minutes (official); 5-6 questions with 30 seconds to prepare and 2 minutes to answer, no retakes (prep sites). A combined Operations and FICC interview was reported in 2025.",
    source: GS_PREP,
    confidence: "official",
  },
  finalInterview: {
    text:
      "Superday of two to five interviews (official). DA-specific report: three interviews at ~30 minutes in London; CV, experience and logical reasoning. More technical than the HireVue for FICC.",
    source: GS_PREP,
    confidence: "official",
  },
  values: [
    "Partnership",
    "Client service",
    "Integrity",
    "Excellence",
  ],
  dayToDay: [
    "FICC and Equities apprentices support traders and salespeople: preparing market updates, pricing data and client information, and checking trades.",
    "Engineering apprentices build and run the software and systems the firm's businesses use.",
    "Operations apprentices make sure trades are confirmed, settled and recorded correctly, and fix problems when they are not.",
  ],
  whyThisFirm: [
    { text: "In October 2025 Goldman Sachs announced its first degree apprenticeship outside London: an Engineering programme in Birmingham with Warwick (WMG). Its London programme has run for about ten years.", source: GS_BHAM, confidence: "official" },
    { text: "Net revenues were $20.34 billion in the second quarter of 2026, 39% higher than a year earlier, led by Global Banking & Markets.", source: "https://www.goldmansachs.com/pressroom/press-releases/2026/2026-07-14-q2-results", confidence: "official" },
  ],
  questions: [
    {
      stage: "HireVue video interview",
      question: "Why Goldman Sachs? (specifically, not why investment banking)",
      type: "motivation",
      source: GAP_HIREVUE,
      confidence: "single-report",
    },
    {
      stage: "HireVue video interview",
      question: "Why technology? (Engineering)",
      type: "motivation",
      source: GAP_HIREVUE,
      confidence: "single-report",
    },
    {
      stage: "HireVue video interview",
      question: "FICC-specific question appeared in a combined Operations/FICC HireVue; candidates found it difficult and some questions were worded oddly.",
      type: "technical",
      source: TSR_P10,
      confidence: "multiple-candidate-reports",
    },
    {
      stage: "Superday",
      question: "When was the last time you showed teamwork skills? (strengths/behavioural style)",
      type: "competency",
      competency: "Teamwork",
      source: GF_GS,
      confidence: "single-report",
    },
    {
      stage: "Superday",
      question: "Questions on CV, previous experience, and a logical reasoning question.",
      type: "other",
      source: "https://www.glassdoor.co.uk/Interview/Goldman-Sachs-Degree-Apprentice-Interview-Questions-EI_IE2800.0,13_KO14,31.htm",
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "2027-entry applications are open now: apply early for FICC and Equities, Operations or Engineering. Goldman processes in batches, so do not read silence as rejection.",
    "For 'why Goldman', you can mention the firm's first degree apprenticeship outside London: an Engineering programme in Birmingham with WMG, University of Warwick, announced in October 2025 after ten years of the London programme (Goldman Sachs press release).",
    "Treat the HireVue as the real screen: 30 seconds prep and 2 minutes per answer with no retakes; rehearse out loud with a timer.",
    "For FICC, be ready for a technical question in the HireVue; know what FICC does (rates, FX, credit, commodities) and one recent market story.",
    "For Engineering, practise HackerRank-style coding; it is an official stage.",
    "Expect a decision months later: some 2025 offers came in May; meanwhile keep other DA applications alive.",
    "Expect the Superday to be in person (London/Birmingham) with 2-5 interviews; prepare a CV walkthrough and a live logical puzzle.",
    "Hit all four values (partnership, client service, integrity, excellence) with specific examples, not generic prestige.",
  ],
  officialLinks: [GS_DA, GS_PREP, GS_BHAM],
  lastVerified: "2026-10-02",
  gaps: [
    "Official A-level/UCAS entry requirements for 2027 entry (AAA/A-level Maths claim is from a prep site).",
    "Verbatim HireVue and Superday questions for the DA route: Glassdoor and r/UKApprenticeships pages could not be read; HireVue question examples come from a prep site, not candidates.",
    "Operations DA for 2027 (BSc Finance & Investment, Walbrook) was seen only through a search summary of the official page; confirm on the live page.",
    "Exact Superday length/format for DA (only one prep-site report of three ~30-minute interviews).",
    "Official statement of Goldman's values for early careers (values from the firm's published core values via aggregator pages; GS site blocked).",
    "Actual timings of the 2026-27 cycle batches.",
  ],
};
