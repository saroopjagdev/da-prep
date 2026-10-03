import type { FirmProfile } from "./types";

// Research date 2026-09-30.
// IMPORTANT: the Civil Service Fast Track Apprenticeship is CLOSED (guidance withdrawn 27 Nov 2020; no 2019 window). The stages below are the last published (2018) process. Current Civil Service apprenticeships are run by departments through Civil Service Jobs with a behaviours/strengths-based process.
const GOV_HOW = "https://gov.uk/guidance/civil-service-fast-track-apprenticeship-how-to-apply";
const GOV_WHAT = "https://www.gov.uk/guidance/the-fast-track-apprenticeship";
const GOV_ORG = "https://www.gov.uk/government/organisations/civil-service-fast-track-apprenticeship";
const GOV_CODE = "https://www.gov.uk/government/publications/civil-service-code/the-civil-service-code";
const GOVJOBS = "https://govjobs.uk/blog/civil-service-apprenticeships-explained";
const ACHQ = "https://www.assessmentcentrehq.com/civil-service-apprenticeship/";

export const civilServiceFastTrack: FirmProfile = {
  slug: "civil-service-fast-track",
  name: "Civil Service Fast Track Apprenticeship (closed) / current Civil Service apprenticeships",
  sector: "Public sector / Civil Service",
  programmes: [
    {
      name: "Fast Track Apprenticeship (CLOSED): six schemes (Business, Commercial, Digital/Data/Technology, Finance, Policy, Project Delivery)",
      level: "Level 4 higher apprenticeship, two years (not a degree apprenticeship)",
      locations: ["Government departments across the UK"],
    },
    {
      name: "Current departmental Civil Service apprenticeships incl. degree-level (digital, data, project delivery, finance and some professional roles)",
      level: "Intermediate to degree level; degree level leads to a full degree with no tuition fees",
      locations: ["Advertised on Civil Service Jobs, departmental sites and Find an Apprenticeship"],
    },
  ],
  entry: {
    other:
      "Fast Track (historic): 16+, no degree, 5 GCSEs at 4/C or above including English and Maths; Policy, Digital and Project Delivery also needed two A-levels; nationality/residency rules applied. Current apprenticeships: entry varies by role; intermediate/advanced roles ask for GCSE English and maths or willingness to work towards them; degree-level roles ask for A-levels or equivalent.",
    source: ACHQ,
  },
  timeline: {
    opens: "Fast Track historically opened in early March to early April (aggregator). Current roles open year-round through individual departments rather than one window.",
    rolling: true,
    notes:
      "The Fast Track programme is closed: gov.uk says the programme is now closed and its guidance was withdrawn on 27 November 2020; a news item notes there was no application window in 2019. Some third-party pages still say it is active; treat them as out of date. The last published recruitment timetable targeted outcomes by July 2018 and starts by October 2018.",
    source: GOV_WHAT,
  },
  stages: [
    {
      order: 1,
      name: "Online application form (historic Fast Track)",
      format: "About 20 minutes: personal details, scheme and location preferences, accessibility needs, optional diversity questionnaire.",
      durationMins: 20,
      tips: ["For current roles, apply through Civil Service Jobs and answer the behaviours/strengths statements with concrete evidence from school, part-time work or volunteering."],
      source: GOV_HOW,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online tests (historic Fast Track)",
      format:
        "Sent by email with seven days to complete, on laptop/desktop only. Verbal reasoning (36 questions, 6 minutes), numerical reasoning (24 questions, 6 minutes), situational judgement questionnaire (about 20-30 minutes), competency questionnaire (about 20-30 minutes). Digital/Data applicants did only the last two.",
      durationMins: 70,
      passMarkNotes: "Scores decide who is invited to the assessment centre; no published cut-off.",
      tips: [
        "Verbal and numerical are speed tests: practise under time pressure.",
        "Answer the SJT and competency questionnaire against Civil Service behaviours (integrity, honesty, objectivity, impartiality values).",
      ],
      source: GOV_HOW,
      confidence: "official",
    },
    {
      order: 3,
      name: "Half-day assessment centre (historic Fast Track)",
      format:
        "Written task (40 minutes), formal strengths/competency interview with up to 12 questions, and a group exercise with up to six participants (40 minutes). Some schemes add scheme-specific assessment.",
      durationMins: 240,
      tips: [
        "Write clear, structured, short business-style documents in the written task.",
        "In the group task, contribute and include others; you are assessed against behaviours, not winning.",
      ],
      source: ACHQ,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "Current Civil Service apprenticeship recruitment (departmental)",
      format:
        "Typical steps now: application on Civil Service Jobs with written evidence, optional online tests (judgement, numeracy, verbal reasoning) in some campaigns, assessment against published Civil Service Behaviours and strengths, and usually a video interview.",
      tips: ["Use STAR examples tied to the Civil Service Behaviours.", "Each department runs its own timetable; check the advert for tests and interview format."],
      source: GOVJOBS,
      confidence: "single-report",
    },
  ],
  oa: {
    provider: "Civil Service online tests (historic Fast Track); typical current prep-site view: numerical, verbal and SJT",
    tests: [
      { name: "Verbal reasoning", format: "True/false/cannot say style passages", items: 36, timeMins: 6, notes: "Historic Fast Track timing." },
      { name: "Numerical reasoning", format: "Tables, graphs and word problems", items: 24, timeMins: 6, notes: "Historic Fast Track timing." },
      { name: "Situational judgement questionnaire", format: "Workplace scenarios assessed against Civil Service behaviours", timeMins: 30, notes: "Historic: 20-30 minutes." },
      { name: "Competency questionnaire", format: "Self-report competency questions", timeMins: 30, notes: "Historic: 20-30 minutes." },
    ],
    styleNotes:
      "Short, tightly timed verbal (true/false/cannot say from a passage) and numerical (table and graph data extraction) tests, plus an untimed-feeling SJT with 20 scenarios and a competency questionnaire. Write look-alike items at GCSE level with minimal jargon. Applies to the historic scheme; current campaigns vary.",
    source: GOV_HOW,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Historic Fast Track half-day centre: group task, written task, strengths-based interview. Current departments vary.",
    source: GOV_HOW,
    confidence: "official",
  },
  finalInterview: {
    text: "Formal strengths- and competency-based interview with up to 12 questions (historic Fast Track). Current apprenticeships: behaviours/strengths interview, usually by video.",
    source: ACHQ,
    confidence: "multiple-candidate-reports",
  },
  values: [
    "Integrity: putting the obligations of public service above your personal interests",
    "Honesty: being truthful and open",
    "Objectivity: basing advice and decisions on rigorous analysis of the evidence",
    "Impartiality: acting solely according to the merits of the case and serving governments of different political persuasions equally",
  ],
  questions: [],
  specificAdvice: [
    "Do not plan around the Fast Track Apprenticeship: it is closed. Look for departmental apprenticeships on Civil Service Jobs and Find an Apprenticeship.",
    "If you want degree level, search for degree apprenticeships in digital, data, project delivery or finance inside departments.",
    "Prepare evidence against the Civil Service Behaviours and Success Profile strengths using school, part-time work, volunteering and sport.",
    "Practise very short speed tests (verbal and numerical) in case a campaign uses them.",
    "Treat written evidence as the main filter: concise examples with result, impact and what you learned.",
  ],
  officialLinks: [GOV_WHAT, GOV_ORG, GOV_HOW, GOV_CODE, "https://www.civil-service-careers.gov.uk/fast-stream"],
  lastVerified: "2026-10-03",
  gaps: [
    "No current official Fast Track Apprenticeship process exists; the programme is closed. No 2025-26 cycle to verify.",
    "Whether a successor apprenticeship Fast Track-type scheme exists: searches showed only departmental apprenticeships and the Fast Stream (graduate).",
    "Current departmental application and assessment details are from a third-party summary (GovJobs) and vary by department.",
    "No candidate-reported questions (Reddit, TSR 2022 thread, Glassdoor) retrieved.",
    "Assessment centre details come from the last official guide (2018) and a prep site, not recent candidates.",
  ],
};
