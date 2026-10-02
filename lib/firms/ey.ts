import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const EY_PROCESS = "https://www.ey.com/en_uk/careers/students/application-process";
const EY_FAQ = "https://www.ey.com/en_uk/careers/students/faqs";
const EY_AA = "https://www.amazingapprenticeships.com/employers/ey/";
const EY_WJ = "https://www.wikijob.co.uk/interview-advice/company-interview-questions/ey";
export const ey: FirmProfile = {
  slug: "ey",
  name: "EY UK",
  sector: "Professional services (Big 4)",
  programmes: [
    { name: "Audit (Assurance) apprenticeship", level: "4 years, Level 7 Accountancy and Taxation apprenticeship (master's-level) leading to ICAEW chartered accountancy (2027 listing via Prospects)" },
    { name: "Tax apprenticeship", level: "Apprenticeship" },
    { name: "Law (Entity Compliance and Governance) apprenticeship", level: "Apprenticeship" },
    { name: "Finance (Turnaround and Restructuring Strategy) apprenticeship", level: "Apprenticeship" },
    { name: "Business Leadership and Management apprenticeship", level: "Apprenticeship" },
    { name: "Digital and Technology apprenticeship", level: "Degree apprenticeship", degree: "BSc with BPP University" },
  ],
  entry: {
    ucas: "Equivalent to 3 A-levels (or 5 Scottish Highers); EY states no set grades on the apprenticeship overview page beyond this.",
    other:
      "GCSE English Language and Maths grade 4/C minimum. No visa sponsorship for apprenticeships. Predicted grades must match actuals or offers can be withdrawn. Cannot be in other publicly funded education at start.",
    source: EY_FAQ,
  },
  timeline: {
    rolling: true,
    notes:
      "2027 opportunities open as of Sept 2026; roles close once filled or at high volume, so apply early. Generally start Aug/Sept. One apprenticeship application per 3 months; wait 3 months to reapply after rejection.",
    source: EY_FAQ,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Create an account, then complete the application form with personal details, qualifications and programme choice.",
      tips: ["Only one apprenticeship application per three-month period."],
      source: EY_AA,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment",
      format:
        "Immersive online assessment in EY's portal with a preparation hub and practice tests. EY describes a Realistic Job Preview (teamwork, learning capability) plus a behavioural skills test; the apprenticeship page describes rank-order questions, written and recorded video answers and, if relevant to your programme, a timed numerical reasoning test. Wikijob (graduate page, single source) gives the graduate version as ~60 min with ~28 questions, then a ~45 min/14 question job simulation; apprentices do a shorter version.",
      durationMins: 60,
      tips: [
        "Use the practice tests in the EY preparation hub.",
        "Complete on a desktop in a quiet place without interruption.",
        "Up to 25% extra time and other adjustments are available on request.",
      ],
      source: EY_PROCESS,
      confidence: "official",
    },
    {
      order: 3,
      name: "Telephone interview (reported for apprenticeships)",
      format:
        "Wikijob states apprentices receive a telephone interview after the job simulation and before the Experience Day. Not confirmed by EY as a separate stage.",
      tips: ["Have a concise 'why EY, why this service line' answer ready."],
      source: EY_WJ,
      confidence: "single-report",
    },
    {
      order: 4,
      name: "EY Experience Day",
      format:
        "Apprentices attend the Experience Day in person at an EY UK office; virtual only in exceptional circumstances, and travel costs are reimbursed up to a maximum (EY FAQ). Assessed activities plus time with current employees. Wikijob (graduate) lists aptitude retest, group discussion, case study, inbox prioritisation and partner interview, 9:00-16:30. A graduate-oriented prep site (single report) gives case prep 60 min + 15 min presentation + 15 min Q&A, a 40-50 min group exercise, a 45 min competency interview and a partner interview. TSR candidates report the day sets tasks rather than asking interview questions, with a group task of 5-6: read a document, answer questions, create a proposal.",
      tips: ["Bring ideas but listen and build on others in the group task.", "Practise prioritising an inbox with a clear rationale."],
      source: EY_FAQ,
      confidence: "official",
    },
    {
      order: 5,
      name: "Final interview",
      format:
        "Interview on your strengths and motivations (EY apprenticeship page). Older TSR reports: partner/director interviewer, a 5-minute presentation followed by questions, all competency/behavioural and no technical questions; questions vary by location, programme and interviewer.",
      tips: ["Prepare a short presentation if asked; rehearse to time.", "Research EY's client work in your service line."],
      source: EY_AA,
      confidence: "official",
    },
  ],
  oa: {
    provider: "EY in-house immersive assessment portal with preparation hub (earlier cycles reportedly used game-style tests; not confirmed for 2025-26 apprenticeships)",
    tests: [
      { name: "Realistic Job Preview / behavioural skills test", format: "Scenario-based, rank-order and selection items on teamwork and learning capability" },
      { name: "Written and video responses", format: "Typed short answers and recorded video answers" },
      { name: "Numerical reasoning (programme dependent)", format: "Timed numerical reasoning with chart/table interpretation", notes: "Only for some programmes per EY." },
    ],
    styleNotes:
      "Immersive, scenario-led with video, written information and data tables. EY FAQ says assessments may include multiple choice, pattern recognition, chart interpretation and video responses. Item counts above are graduate-version only.",
    source: EY_FAQ,
    confidence: "official",
  },
  videoInterview: {
    text: "Recorded video answers are part of the online assessment (EY apprenticeship page); question count and timings not published.",
    source: EY_AA,
    confidence: "official",
  },
  assessmentCentre: {
    text: "EY Experience Day: group exercise (5-6 people per TSR), case study, inbox prioritisation, partner interview; meet current employees.",
    source: EY_WJ,
    confidence: "single-report",
  },
  finalInterview: {
    text: "Interview on strengths and motivations; may include a short presentation; competency and situational rather than technical (older TSR reports).",
    source: EY_AA,
    confidence: "official",
  },
  values: [
    "Accountable",
    "Agile",
    "Adaptable",
    "Analytical",
    "Curious",
    "In the know",
    "Number savvy",
    "Resilient",
    "Strong communicator",
    "Team player",
  ],
  questions: [
    { stage: "Final interview", question: "Why EY? Why this service line/sub-service line? Why this location?", type: "motivation", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "What are your strengths and weaknesses?", type: "other", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "How does EY create value for clients?", type: "commercial", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "What is your role in a team?", type: "competency", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "Tell me about a difficult experience.", type: "competency", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "What is your proudest accomplishment?", type: "competency", source: EY_WJ, confidence: "single-report" },
    { stage: "Final interview", question: "Where do you see yourself in 5/10 years?", type: "motivation", source: EY_WJ, confidence: "single-report" },
  ],
  specificAdvice: [
    "EY closes openings when filled: apply in the first weeks, and pick one route because of the one-application-per-3-months rule.",
    "Use the EY preparation hub practice tests; the graduate Experience Day reportedly retests aptitude, so keep numerical practice going.",
    "Use EY's strengths list (Accountable, Agile, Adaptable, Analytical, Curious, In the know, Number savvy, Resilient, Strong communicator, Team player) as a scaffold for your examples.",
    "The question list is from wikijob's graduate page; treat it as a style guide for apprentice final interviews.",
  ],
  officialLinks: [EY_PROCESS, EY_FAQ, EY_AA, "https://www.ey.com/en_uk/careers/students"],
  lastVerified: "2026-10-02",
  gaps: [
    "Apprentice-adjacent 2025 Tax interview questions (why Tax, balancing work and study, what research you did) appeared in search summaries but no readable source URL was found, so they are not listed.",
    "EY's own process page lists search and apply, preparation hub, online assessment, Experience Day and onboarding, with no separate final-interview stage: the final interview is probably part of the Experience Day, but this is not stated.",
    "EY's page lists proactivity, ethical behaviour, curiosity, relationship building, agility, critical thinking, technology comfort and motivation; the 10-item strengths list below is still not on an official page.",
    "Item counts/timings for the apprentice version of the assessment are not published; 60 min/28 q and 45 min/14 q are graduate figures from wikijob.",
    "Whether the apprentice route has a separate telephone interview is not confirmed by EY.",
    "TSR, Glassdoor and Reddit returned 403; final interview questions come from graduate-oriented sources.",
    "Degree apprenticeship entry requirements per programme (UCAS points, BPP details), locations and strengths-list provenance (TSR snippet) not verified on an official page.",
  ],
};
