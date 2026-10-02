import type { FirmProfile } from "./types";

// Research date 2026-10-02 (docs/research/finance-firms/morgan-stanley.md). Most recent cycle seen: 2026 entry (rolling).
// Facts were read through search-result summaries of the linked pages; re-check on the live adverts before relying on them.
const LDN_TECH = "https://successatschool.org/job/morgan-stanley/degree-apprenticeship/2026-technology-professional-degree-apprenticeship-program-london/2010";
const GLA_TECH = "https://morganstanley.tal.net/vx/mobile-0/brand-0/candidate/so/pm/1/pl/1/opp/19706-2026-Technology-Graduate-Apprenticeship-Programme-Application-Development-Glasgow/en-GB";
const GLA_OPS = "https://morganstanley.tal.net/vx/lang-en-GB/mobile-0/brand-2/spa-1/candidate/so/pm/1/pl/1/opp/19768-2026-Operations-Graduate-Apprenticeship-Programme-Glasgow/en-GB";
const RA = "https://www.resumeadapter.com/companies/morgan-stanley/interview-process";
const GAP = "https://www.gameassessmentprep.com/employers/morgan-stanley";
const GAP_HV = "https://www.gameassessmentprep.com/hirevue/questions/morgan-stanley";
const IG = "https://blog.theinterviewguys.com/morgan-stanley-hirevue-questions/";
const VALUES = "https://www.morganstanley.com/about-us/morgan-stanley-core-values";

export const morganStanley: FirmProfile = {
  slug: "morgan-stanley",
  name: "Morgan Stanley",
  sector: "Investment banking / financial services",
  programmes: [
    {
      name: "Technology Professional Degree Apprenticeship Program",
      level: "Degree apprenticeship, 4 years, about 80% work and 20% study, rotating across Technology",
      degree: "Partner reported as Queen Mary University of London (not confirmed officially)",
      locations: ["London"],
    },
    {
      name: "Technology Graduate Apprenticeship Programme (Application Development; IT Management for Business)",
      level: "Scottish Graduate Apprenticeship, 1 day a week at university",
      degree: "BSc (Hons) IT Software Development (Strathclyde) or BSc (Hons) Software Engineering (Glasgow)",
      locations: ["Glasgow"],
    },
    {
      name: "Operations Graduate Apprenticeship Programme",
      level: "Scottish Graduate Apprenticeship",
      degree: "BA (Hons) Business Management (University of Strathclyde)",
      locations: ["Glasgow"],
    },
  ],
  entry: {
    predictedGrades: "Previous years (London Technology): AAB or ABB including Computer Science or Maths",
    other: "Previous years: GCSE Maths grade B or above. Current-year requirements not confirmed.",
    source: LDN_TECH,
  },
  timeline: {
    rolling: true,
    notes: "Listed as 'ongoing' with no official closing date. The portal limits how many programmes you can apply to each year, so choose carefully.",
    source: LDN_TECH,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Application on morganstanley.tal.net: CV and often a cover letter.",
      tips: ["You can only apply to a limited number of programmes a year, so pick the ones you really want."],
      source: RA,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 2,
      name: "Online tests",
      format: "Aon (cut-e) battery reported for EMEA campus roles: numerical, deductive/logical, chat-based situational judgement and switchChallenge. Not confirmed for apprentices.",
      provider: "Aon (cut-e), reported for campus roles",
      tips: ["Practise short, fast Aon-style reasoning tests; they are timed per item."],
      source: GAP,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "HireVue video interview",
      format: "3 to 5 behavioural and motivational questions, about 30 seconds to prepare and about 1.5 to 2 minutes to answer; about 30 minutes in total (campus reports).",
      provider: "HireVue",
      tips: ["Keep answers tight: 90 seconds goes quickly.", "Prepare 'Why Morgan Stanley?' and 'Why this division?' answers."],
      source: GAP_HV,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "Interviews / assessment centre",
      format: "Interviews and/or an assessment centre with a group exercise, case study and interviews (campus reports).",
      tips: ["In the case study, state your recommendation clearly and give two or three reasons."],
      source: RA,
      confidence: "multiple-candidate-reports",
    },
  ],
  oa: {
    provider: "Aon (cut-e), reported for EMEA campus roles",
    tests: [
      { name: "Numerical reasoning", format: "Short timed table/chart items" },
      { name: "Deductive / logical reasoning", format: "Rule-based logic items" },
      { name: "Chat-based situational judgement", format: "Workplace scenarios in a chat format" },
      { name: "switchChallenge", format: "Work out which operators changed a sequence of shapes" },
    ],
    styleNotes: "Short, fast Aon-style items with per-item time pressure. Reported for campus (internship/graduate) roles; apprentices may get a different set.",
    source: GAP,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "Reported for campus roles: 3 to 5 questions, about 30 seconds to prepare and 1.5 to 2 minutes to answer; about 30 minutes total.",
    source: GAP_HV,
    confidence: "multiple-candidate-reports",
  },
  assessmentCentre: {
    text: "Reported for campus roles: group exercise, case study and interviews.",
    source: RA,
    confidence: "multiple-candidate-reports",
  },
  values: ["Do the right thing", "Put clients first", "Lead with exceptional ideas", "Commit to diversity and inclusion", "Give back"],
  dayToDay: [
    "Technology apprentices build and support the software that traders, operations teams and wealth advisers use, rotating between teams.",
    "Operations apprentices make sure trades settle correctly and on time, fix breaks and work with clients' back offices.",
  ],
  whyThisFirm: [
    { text: "Morgan Stanley reported record 2025 revenue of $70.6 billion, and client assets in Wealth & Investment Management reached about $10 trillion in 2026.", source: "https://www.morganstanley.com/about-us-ir/shareholder/2q2026.pdf", confidence: "official" },
    { text: "Its strategy is an 'integrated firm': a large wealth management business alongside investment banking and trading.", source: "https://www.benzinga.com/news/financing/26/06/53185052/morgan-stanley-ceo-10-trillion-wealth-management-record-q1-revenue", confidence: "multiple-candidate-reports" },
  ],
  questions: [
    { stage: "HireVue video interview", question: "Why Morgan Stanley?", type: "motivation", source: IG, confidence: "multiple-candidate-reports" },
    { stage: "HireVue video interview", question: "Tell me about a time something went wrong.", type: "competency", competency: "Resilience", source: IG, confidence: "multiple-candidate-reports" },
    { stage: "HireVue video interview", question: "Tell me about a leadership experience.", type: "competency", competency: "Leadership", source: IG, confidence: "multiple-candidate-reports" },
    { stage: "HireVue video interview", question: "Why this division?", type: "motivation", source: IG, confidence: "multiple-candidate-reports" },
  ],
  specificAdvice: [
    "Know Morgan Stanley's 'integrated firm' strategy: a huge wealth management business alongside its institutional (investment banking and trading) business. Client assets in Wealth & Investment Management reached about $10 trillion in 2026.",
    "Technology is the main London degree route; Operations and Technology in Glasgow use Scotland's Graduate Apprenticeship scheme, so check which applies to you.",
    "Use the five core values in answers; 'Put clients first' and 'Do the right thing' come up most.",
    "Interview questions listed here come from campus (not apprentice-specific) HireVue reports.",
    "Apply early: there is no fixed closing date and the portal limits how many programmes you can apply to.",
  ],
  officialLinks: [VALUES, GLA_TECH, GLA_OPS, "https://www.morganstanley.com/about-us-ir/shareholder/2q2026.pdf"],
  lastVerified: "2026-10-02",
  gaps: [
    "2027-intake adverts not yet seen.",
    "London Technology university partner not confirmed officially.",
    "No apprentice-specific reports of the tests or interview questions (campus reports used instead).",
    "Salary: the advert says 'competitive'; Glassdoor self-reports of £21k-£31k are not shown as fact.",
  ],
};
