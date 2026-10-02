import type { FirmProfile } from "./types";

// Research date 2026-09-30. Most recent cycle: 2025 (Spring 2025 window; Senior Relationship Manager DA reports). Next window: Spring 2027 (official).
const NW_DA = "https://jobs.natwestgroup.com/pages/degree-apprenticeships";
const NW_RM = "https://jobs.natwestgroup.com/pages/relationship-management-apprenticeships";
const TSR_NW = "https://www.thestudentroom.co.uk/showthread.php?t=7595452";
const PAT = "https://www.practiceaptitudetests.com/top-employer-profiles/natwest-assessments/";

export const natwest: FirmProfile = {
  slug: "natwest",
  name: "NatWest Group",
  sector: "Banking / financial services",
  programmes: [
    {
      name: "Level 6 Financial Services Professional Apprenticeship (Senior Relationship Management and other degree-level roles)",
      level: "Level 6, equivalent to a degree but does NOT include a degree (BA/BSc)",
      locations: ["England only (degree-level)", "London (2025 technology/relationship roles reported)"],
    },
    {
      name: "Relationship Management / Customer Service / Digital / Data apprenticeships (lower levels)",
      level: "Below degree level (no formal qualifications needed for most)",
      locations: ["Various incl. Aberdeen"],
    },
  ],
  entry: {
    ucas: "80 UCAS points (A Levels or BTECs in England; Highers or equivalent in Scotland) for degree-level apprenticeships.",
    other: "Degree-level apprenticeships England only. No formal qualifications needed for most non-degree apprenticeships.",
    source: NW_DA,
  },
  timeline: {
    opens: "Spring (rounds open once a year). The official page currently says no programmes are open and the next round opens Spring 2027.",
    rolling: false,
    notes:
      "A 2025 thread shows the London degree apprenticeship vanished within a day of a candidate planning to apply the next day, so apply in the first 24-48 hours. Candidates who finished the assessments were still waiting for news after a few weeks.",
    source: NW_DA,
  },
  stages: [
    {
      order: 1,
      name: "Apply",
      format: "Apply via Workday (account needed). A few fit questions and an uploaded CV including qualifications you are studying.",
      tips: ["Apply on opening day: roles can close within a day.", "Put current A-levels/BTEC grades on the CV as instructed."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 2,
      name: "Work scenarios assessment",
      format: "Real-life work situations to show how you use the core skills and behaviours NatWest wants; about 20-25 minutes, but you can take as long as you need. Candidates call it a situational judgement test and received an alignment report (one candidate 'strong alignment').",
      provider: "SHL (candidate-reported for the tests)",
      durationMins: 25,
      tips: ["Answer as you would truly behave, using the NatWest Behaviours as a guide."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 3,
      name: "Online ability test (degree-level only)",
      format: "About 10 minutes, problem solving and numeracy; practice tests in the help option inside the platform. Candidate report: timed at 11 minutes for 10 questions, penalised for not finishing, problem-solving as much as calculation.",
      provider: "SHL (candidate-reported)",
      durationMins: 11,
      passMarkNotes: "Pass through to the skills assessment if successful.",
      tips: ["Take the platform's practice tests first; candidates said practice saved them.", "Watch your pace: 10 questions in about 11 minutes."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 4,
      name: "Online skills assessment",
      format: "Untimed, usually about 20 minutes. For each item you choose which of three statements describes you most in a home, work or education situation.",
      durationMins: 20,
      tips: ["Stay consistent; pick the statement that really fits you across contexts (home, work, education)."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 5,
      name: "Pre-recorded video assessment",
      format: "Timed recorded answers to pre-recorded questions; mix of motivational, competency and scenario-based questions; ~20 minutes. Candidates differ on difficulty: one said 'standard questions', another did not think they were general.",
      durationMins: 20,
      tips: ["Prepare motivational answers about relationship management/your role plus 2-3 STAR stories.", "Practise a scenario answer aloud."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 6,
      name: "Interview",
      format: "Invited once assessments are passed. Every job is assessed against NatWest's Behaviours. Third-party guides say a virtual assessment centre (group exercise, role play, interview) may apply to some early talent routes; the official apprenticeship page lists an interview only.",
      tips: ["Map each example to a NatWest Behaviour.", "Be ready for a role play or group discussion if the invitation says so."],
      source: NW_DA,
      confidence: "official",
    },
    {
      order: 7,
      name: "Pre-employment screening",
      format: "Managed by a case handler after an offer.",
      tips: [],
      source: NW_DA,
      confidence: "official",
    },
  ],
  oa: {
    provider: "SHL (candidate-reported on Student Room for 2025 Senior Relationship Manager DA)",
    tests: [
      { name: "Work scenarios assessment (SJT)", format: "Situational judgement on work situations", timeMins: 25, notes: "20-25 minutes, untimed in practice." },
      { name: "Ability test", format: "Numeracy and problem solving, timed", items: 10, timeMins: 11, notes: "Candidate-reported 10 questions in 11 minutes; official says about 10 minutes." },
      { name: "Skills assessment", format: "Choose the most-like-me statement from 3 options for home, work, education situations", timeMins: 20 },
    ],
    styleNotes:
      "Three-step online battery before the video interview. The SJT uses short workplace scenarios and outputs an alignment report with the NatWest Behaviours. The ability test mixes arithmetic and multi-step problem solving (percentages, rates, tables) under tight time. The skills assessment is a most-like-me forced choice among three statements. Third-party prep sites say NatWest uses a 'Job Focus' assessment for graduates that mixes behavioural statements and interactive reasoning; that is not confirmed for apprentices.",
    source: NW_DA,
    confidence: "official",
  },
  videoInterview: {
    text: "Pre-recorded, timed answers, about 20 minutes; motivational, competency and scenario-based questions.",
    source: NW_DA,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Official apprenticeship page does not list one. Third-party guides describe a virtual assessment centre (welcome, business case study/group exercise, behavioural interview) for early talent schemes.",
    source: PAT,
    confidence: "inferred",
  },
  finalInterview: {
    text: "Interview after assessments; assessed against NatWest's Behaviours. A prep guide says interviews typically combine situational and competency questions and run up to 30 minutes (unverified).",
    source: NW_DA,
    confidence: "official",
  },
  values: [
    "NatWest assesses every candidate against its 'Behaviours' (names not listed on the apprenticeship pages)",
    "Purpose: champion potential, helping people, families and businesses to thrive",
    "What NatWest says it looks for: proactive, curious people who build relationships, manage priorities and use accurate information to solve problems",
  ],
  pay: { text: "Reported degree-apprentice pay of £22,455 to £29,574.", source: "https://www.bestapprenticeships.com/knowledge-base/how-much-do-natwest-group-apprenticeships-pay/", confidence: "multiple-candidate-reports" },
  dayToDay: [
    "Senior Relationship Management apprentices help look after business or personal banking customers: understanding their needs, preparing information and building relationships.",
  ],
  whyThisFirm: [
    { text: "NatWest Group made an attributable profit of £3.0 billion in the first half of 2026 with a 19.7% return on tangible equity, and completed its acquisition of the wealth manager Evelyn Partners.", source: "https://www.natwestgroup.com/news-and-insights/latest-stories/financial-reporting/2026/jul/h1-2026-natwest-group-results.html", confidence: "official" },
  ],
  questions: [
    {
      stage: "Pre-recorded video assessment",
      question: "Standard motivational/competency questions, including a scenario question. One candidate found them 'nothing special', another found them not general.",
      type: "motivation",
      source: TSR_NW,
      confidence: "multiple-candidate-reports",
    },
    {
      stage: "Online ability test (degree-level only)",
      question: "Timed numerical problem-solving test: 11 minutes for 10 questions, penalised for not finishing.",
      type: "other",
      source: TSR_NW,
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "Apply within a day or two of the Spring 2027 opening: London/DA roles disappeared within a day in 2025.",
    "Do the ability test practice inside the platform first; candidates say the 10-question, about 11-minute test penalises unfinished attempts.",
    "Use the skills assessment consistently: pick the statement that genuinely describes you in home, work and education settings.",
    "Expect a Level 6 Financial Services Professional qualification, which is equivalent to a degree but does not award a degree; decide whether that suits you before applying.",
    "Research the 'Behaviours' on the NatWest careers site before the video stage and use their exact wording in examples.",
    "Only degree-level applicants in England qualify: check you meet 80 UCAS points.",
  ],
  officialLinks: [NW_DA, NW_RM, "https://jobs.natwestgroup.com/pages/early-talent-application-support"],
  lastVerified: "2026-09-30",
  gaps: [
    "Names and definitions of NatWest's Behaviours (official page refers to them but does not list them).",
    "Format of the final interview/assessment centre for apprentices (official page says only 'interview'); virtual assessment centre claims come from prep sites for graduate/intern routes.",
    "Verbatim video interview or interview questions: none retrievable (Glassdoor blocked; TSR 2025 thread says only 'standard').",
    "Which vendor runs the assessments is candidate-reported only (SHL).",
    "Number of items for work scenarios and skills assessments.",
    "2026-27 outcome timings; next round is Spring 2027.",
  ],
};
