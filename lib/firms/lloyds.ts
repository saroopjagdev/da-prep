import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const L_PROC = "https://www.lloydsbankinggrouptalent.com/our-opportunities/apprenticeships/apprenticeships-application-process/";
const L_AA = "https://www.amazingapprenticeships.com/employers/lloyds-banking-group/";
const L_WJ = "https://www.wikijob.co.uk/interview-advice/company-interview-questions/lloyds-bank-application-process";

export const lloyds: FirmProfile = {
  slug: "lloyds",
  name: "Lloyds Banking Group",
  sector: "Banking / financial services",
  programmes: [
    {
      name: "Degree apprenticeships (Level 6-7): Finance (chartered accountant route), Technology Engineering, Risk/Audit/Data, Cyber and Information Communications, Customer Services & HR",
      level: "Level 6-7 degree/higher apprenticeships, minimum salary GBP 26,500 from day one",
      locations: ["Birmingham", "Bristol", "Chester", "Edinburgh", "Halifax", "Leeds", "London", "Manchester"],
    },
  ],
  entry: {
    other: "Minimum entry criteria exist per role but are not listed on the application-process or Amazing Apprenticeships page; recruitment is based on skills and behaviours.",
    source: L_AA,
  },
  timeline: {
    opens: "Sources disagree for 2027 entry: Lloyds' apprenticeships page says opportunities open on 3 November (year not stated), while job boards report applications opening in October 2026 for September 2027 starts. Register interest so you are told when your programme opens.",
    notes: "If a programme is closed you can register interest. Closing dates not verified.",
    source: L_PROC,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Form about yourself and your qualifications; those meeting minimum entry requirements go to assessments.",
      tips: ["Check the minimum criteria for your specific apprenticeship first."],
      source: L_PROC,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessments",
      format:
        "Assess motivations, behaviours, values and written communication. Depending on the role there may be critical thinking, technical or maths tests. Written assignments required; you may need pen, paper and calculator. A 2025 TSR summary says the online test was situational/scenario-based with nothing numerical or diagrammatic (one route); another stage included case study, SJT and video interview.",
      tips: ["Have pen, paper and a calculator ready.", "Write clearly and concisely; written communication is explicitly assessed."],
      source: L_PROC,
      confidence: "official",
    },
    {
      order: 3,
      name: "Final interview or assessment day",
      format:
        "Varies by apprenticeship and may be digital (events platform) or in person. TSR 2025 reports: group challenge, structured behavioural interview (SBI) and an individual task, about 9:00 to 14:30. Wikijob (graduate page) says the graduate assessment day has case studies, group exercises and interviews. Other single-report summaries conflict: higher apprentices a 1-hour strengths-based interview plus four 10-minute micro-exercises, a group exercise and a 15-minute VR exercise; degree apprentices shorter exercises, a longer one-to-one interview, a numerical exercise and a group exercise (groups of 4 to 6 presenting a resolution). Treat the contents as unconfirmed.",
      durationMins: 330,
      tips: ["Prepare to discuss genuine interest in the industry and how you show Lloyds' values, e.g. via volunteering or community work.", "Be ready for both individual and group exercises."],
      source: L_PROC,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Not named on official page (graduate route uses verbal, numerical, inductive reasoning and SJT per wikijob)",
    tests: [
      { name: "Motivation, behaviour and values assessment", format: "Scenario/situational judgement style" },
      { name: "Written communication task", format: "Written assignment" },
      { name: "Role-dependent tests", format: "Critical thinking, technical or mathematical ability depending on role" },
    ],
    styleNotes: "Situational and scenario-based with written tasks; maths/critical thinking only for some roles. Graduate pages mention 90-minute and 1 hour stages; apprentice timings not published.",
    source: L_PROC,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Varies by apprenticeship. TSR 2025 candidates: group challenge (~30 min), structured behavioural interview and individual task, plus a chance to speak to an apprentice.",
    source: "https://www.thestudentroom.co.uk/showthread.php?t=7552896",
    confidence: "single-report",
  },
  finalInterview: { text: "Interview or assessment day depending on apprenticeship; digital or in person.", source: L_PROC, confidence: "official" },
  values: ["Customer focus", "Enthusiasm", "Inquisitiveness", "Motivation", "Problem solving", "Resilience", "Respect", "Teamwork"],
  pay: { text: "Job boards report a minimum of £26,500 for 2027 apprenticeships, with Risk roles at £31,700 in London.", source: "https://www.apprenticewizard.co.uk/lloyds-apprenticeship", confidence: "multiple-candidate-reports" },
  dayToDay: [
    "Depending on the programme, apprentices work in areas such as risk, accounting and finance, technology or customer-facing banking, studying alongside the job.",
  ],
  whyThisFirm: [
    { text: "Lloyds' first-half 2026 statutory profit before tax was £4.3 billion, up 23%, and the group launched a new strategy, 'Accelerate 2030', focused on growth, innovation and simplification.", source: "https://www.lloydsbankinggroup.com/assets/pdfs/investors/financial-performance/lloyds-banking-group-plc/2026/q2/2026-lbg-hy-results.pdf", confidence: "official" },
  ],
  questions: [
    { stage: "Final interview or assessment day", question: "Why do you want to join Lloyds Banking Group? What do you understand of its mission and how your values align?", type: "motivation", source: L_WJ, confidence: "single-report" },
  ],
  specificAdvice: [
    "Lloyds' process varies by apprenticeship level, so read the exact vacancy: some routes stop at interview, higher levels add an assessment day.",
    "Written communication is explicitly scored: practise writing short, clear, professional responses without relying on a spellchecker.",
    "Lloyds asks for evidence of values such as volunteering or community involvement: bring real examples.",
    "Prepare for an SBI (structured behavioural interview) using the STAR pattern for customer focus, teamwork and resilience.",
    "Research the group's brands (Halifax, Bank of Scotland, Scottish Widows) and its finance, tech and risk areas.",
  ],
  officialLinks: [L_PROC, "https://www.lloydsbankinggrouptalent.com/our-opportunities/apprenticeships/", "https://lbg.wd3.myworkdayjobs.com/LBG_HigherApprenticeCareers"],
  lastVerified: "2026-10-02",
  gaps: [
    "Reported interview questions are strengths-based (what you are like at your best, what you enjoy, what a great day looks like, how you will put the customer first) but came from search summaries with no readable source URL, so they are not listed.",
    "Assessment-centre contents conflict across sources (see the final stage) and none is official.",
    "Assessment provider and test timings/item counts for apprentices not published.",
    "Degree partners (universities), entry requirements (UCAS/GCSE) and closing dates not verified.",
    "Candidate-reported real questions for degree apprenticeships largely missing (TSR threads 403; only one wikijob graduate item).",
    "TSR 2025 assessment-day details are from search summaries, not direct reads.",
    "Group values not verified beyond the Amazing Apprenticeships list.",
  ],
};
