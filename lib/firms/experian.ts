import type { FirmProfile } from "./types";

const EXP_PROCESS = "https://www.experian.com/careers/early-careers/uk-ireland/our-recruitment-process";
const EXP_APPR = "https://www.experian.com/careers/early-careers/uk-ireland/apprenticeships";
const EXP_JOB = "https://jobs.experian.com/job/software-engineer-degree-apprentice-in-nottingham-england-jid-3862";
const EXP_TESTS = "https://www.practiceaptitudetests.com/top-employer-profiles/experian-assessments/";

export const experian: FirmProfile = {
  slug: "experian",
  name: "Experian UK&I",
  sector: "Data / credit information / software",
  programmes: [
    {
      name: "Software Engineer Degree Apprentice (Sept 2026 start)",
      level: "Level 6",
      degree: "BSc (Hons) Digital and Technology Solutions, Nottingham Trent University",
      locations: ["Nottingham"],
    },
    {
      name: "Business-to-Business Sales / Sales Associate Degree Apprentice",
      level: "Level 6",
      locations: ["London (per third-party listing)"],
    },
    {
      name: "Level 3 and Level 4 apprenticeships (customer service, IT)",
      level: "Levels 3-4",
    },
  ],
  entry: {
    ucas: "At least 120 UCAS points from 3 A levels at C+ including Maths, Science or IT (BTEC considered)",
    predictedGrades: "GCSE Maths and English grade 4+",
    other:
      "Must not hold a degree in a similar subject; right to work in UK (no visa sponsorship); in office min. twice weekly; starting salary £24,650 (Nottingham, 2026 advert).",
    source: EXP_JOB,
  },
  timeline: {
    closes: "Software Engineer Degree Apprentice closed Sat 14 Feb 2026; online assessment centres week of 23 March 2026 (subject to change)",
    rolling: false,
    notes: "Start date September 2026. Permanent, hybrid, full-time employment contract with a two-year structured development programme.",
    source: EXP_JOB,
  },
  stages: [
    {
      order: 1,
      name: "CV application",
      format: "Apply via live vacancies: upload CV, personal details, basic questions; cover letter optional.",
      tips: ["Tailor CV to the job description; Experian warns against over-reliance on AI tools."],
      source: EXP_PROCESS,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessments",
      format:
        "Experian's page confirms online assessments of strengths and problem solving, with details sent on invitation; it names no vendor. A prep site (not Experian, not apprentice-specific, and describing a different overall process) says SHL numerical, verbal and diagrammatic reasoning plus a situational judgement test. Item counts and timings are not published.",
      provider: "Not named by Experian (SHL is a prep-site claim only)",
      tips: [
        "Practise SHL-style numerical, verbal and inductive/diagrammatic tests under timed conditions.",
        "For the SJT choose responses that reflect collaborative, customer-first behaviour consistent with Experian's culture.",
      ],
      source: EXP_PROCESS,
      confidence: "official",
    },
    {
      order: 3,
      name: "Video interview",
      format:
        "One-way pre-recorded interview with short questions, each with a time limit. A third-party summary says you can re-record as many times as you like before submitting. Experian asks candidates not to use AI to generate answers.",
      tips: ["Test camera and microphone; research role and company; be authentic."],
      source: EXP_PROCESS,
      confidence: "official",
    },
    {
      order: 4,
      name: "Assessment centre",
      format:
        "About 4 hours: team introduction, small group exercise, networking with current apprentices/students, and a competency-based interview. Ran online for the 2026 Nottingham software role (week of 23 March).",
      tips: [
        "Have transferable-skill examples ready and revisit your CV.",
        "In the group task listen, contribute clearly and help the group move forward rather than being loudest.",
      ],
      source: EXP_PROCESS,
      confidence: "official",
    },
  ],
  oa: {
    provider: "SHL",
    tests: [
      { name: "Numerical reasoning", format: "Timed online multiple choice (maths-based)" },
      { name: "Verbal reasoning", format: "Timed online multiple choice" },
      { name: "Diagrammatic reasoning", format: "Timed pattern/logic questions" },
      { name: "Situational judgement test", format: "Workplace scenarios assessing fit with 'The Experian Way'", notes: "Reported by a prep site; not stated officially" },
    ],
    styleNotes:
      "Originals should mimic SHL style: short business-data numeracy (percentages, ratios from tables), verbal passages with true/false/cannot-say, diagram-rule puzzles, and SJT scenarios with best/worst response ranking. Item counts and timings not published - do not invent.",
    source: EXP_TESTS,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "One-way recorded video; short questions with individual time limits; authenticity emphasised, no AI-generated answers.",
    source: EXP_PROCESS,
    confidence: "official",
  },
  assessmentCentre: {
    text: "~4 hour centre: introduction to the team, small group exercise, networking with current students, competency-based interview.",
    source: EXP_PROCESS,
    confidence: "official",
  },
  values: [
    "'People First' culture (Great Place to Work, Top Employer)",
    "Purpose: 'Financial health for all'",
    "Integrity and respect for data",
    "Curiosity/inquisitiveness (TargetJobs)",
  ],
  questions: [],
  specificAdvice: [
    "Experian hires against its purpose - 'Financial health for all' - so explain how data helps people access credit or protects them from fraud.",
    "The Nottingham software role uses AWS, C#, Python, .NET, CICS and COBOL: mention any related study or projects and curiosity about mainframe/legacy plus cloud.",
    "The 2026 cycle closed mid-February with online ACs in late March; watch for Sept-Nov openings for the 2027 intake.",
    "Do not use AI in the video interview - Experian explicitly asks candidates not to.",
    "Prepare to network at the assessment centre - conversations with current apprentices are part of the day.",
  ],
  officialLinks: [EXP_PROCESS, EXP_APPR, "https://jobs.experian.com/"],
  lastVerified: "2026-10-02",
  gaps: [
    "Re-read 2 Oct 2026: Experian's recruitment-process page confirms four stages (CV, online assessments of strengths and problem solving, one-way video with timed questions, about four hours at an assessment centre) and names no test vendor. The 14 February 2026 close comes from the expired Experian advert; a search snippet saying 20 February conflicts and was not used. No 2027 vacancies were visible yet.",
    "Candidate-reported video topics (why Experian, why this role, a time you worked in a team, a time you were inspired to learn) appeared in Glassdoor search summaries for mixed roles and could not be read, so no questions are listed.",
    "SHL test names, item counts and timings for apprentices - only a prep site states them, and none give numbers for Experian.",
    "Video interview question count, time limits and any real questions.",
    "Group exercise content and competency interview questions (Gradcracker, Bright Network, NTU case study returned 403).",
    "Formal list of Experian values used in scoring - not found.",
    "Level 6 Sales Associate entry requirements and dates (third-party only).",
  ],
};
