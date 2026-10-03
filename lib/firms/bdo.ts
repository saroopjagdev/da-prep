import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const BDO_PROC = "https://careers.bdo.co.uk/recruitment-process-early-career";
const BDO_JOB = "https://careers.bdo.co.uk/job/birmingham/2027-audit-school-leaver-apprenticeship-programme/1469/45085584192";
const BDO_FAQ = "https://careers.bdo.co.uk/faqs";
const BDO_WJ = "https://www.wikijob.co.uk/interview-advice/company-interview-questions/bdo";

export const bdo: FirmProfile = {
  slug: "bdo",
  name: "BDO UK",
  sector: "Professional services (mid-tier)",
  programmes: [
    {
      name: "Audit School Leaver Apprenticeship Programme (2027 intake)",
      level: "Four-year school leaver apprenticeship working towards ACA, CFAB or ICAS/RGU; salary GBP 26,615-28,275 by location",
      locations: ["Birmingham", "Bristol", "Cambridge", "Edinburgh", "Gatwick", "Glasgow", "Guildford", "Ipswich", "Leeds", "Liverpool", "London", "Manchester", "Nottingham", "Reading", "Southampton"],
    },
    { name: "Other school leaver programmes (Tax, etc.)", level: "Four-year route: ACA, ACA/CTA, ATT/CTA, ICAS RGU or CISI" },
  ],
  entry: {
    ucas: "3 A-levels at A*-C (or 4 Scottish Advanced Highers A-B).",
    other: "GCSE Maths and English grade 4+. Right to work in UK (no visa sponsorship). Able to commute to the office.",
    source: BDO_JOB,
  },
  timeline: {
    opens: "Late September (most applications)",
    closes: "2027 Audit school leaver programme: Sunday 15 November 2026",
    notes: "Start dates 20 September 2027 (30 August 2027 Edinburgh/Glasgow). One application per recruitment season.",
    source: BDO_JOB,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Personal details, academic background, work experience and extracurricular activities (about an hour, per wikijob).",
      tips: ["Apply well before the 15 November 2026 close; roles may fill."],
      source: BDO_PROC,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online task-based assessment",
      format: "Interactive, puzzle-style tasks measuring cognitive ability, resilience and decision-making; no prior preparation needed. BDO's process page (3 Oct 2026) says these tasks are based on quantitative and inductive reasoning and that AI will not help with them. BDO also bans AI help during the online tasks, video interviews and assessment centre; it allows AI for preparation and polishing an application draft.",
      tips: ["Do it in one quiet sitting; approach each game instinctively."],
      source: BDO_PROC,
      confidence: "official",
    },
    {
      order: 3,
      name: "Video interview",
      format: "Asynchronous, timed; assesses communication, awareness of your business stream and fit with BDO values. Practice tools let you test camera/mic and try sample questions first. A Fishbowl post mentions a 3-question version for an audit apprenticeship.",
      tips: ["Use the practice questions.", "No AI use to generate answers: BDO prohibits it."],
      source: BDO_PROC,
      confidence: "official",
    },
    {
      order: 4,
      name: "Virtual assessment centre",
      format: "Virtual exercises simulating real work; for school leavers a case study presentation and group exercise. Older wikijob (undated) describes a full day: 60 min group exercise on a client scenario, 20 min individual presentation, lunch with trainees, ~50 min partner interview, written exercise.",
      tips: ["Prepare a clear 5-minute-style presentation structure.", "In the group, reach a recommendation in time."],
      source: BDO_PROC,
      confidence: "official",
    },
    {
      order: 5,
      name: "Final in-person interview",
      format: "Face-to-face at the office you applied to; reflect on motivations, strengths and experiences and ask questions.",
      tips: ["Bring informed questions about the office and team."],
      source: BDO_JOB,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Not named by BDO (interactive game/task-based assessment)",
    tests: [
      { name: "Task-based assessment", format: "Interactive puzzle-style tasks on cognitive ability, resilience and decision-making", notes: "Item counts/timings not published." },
    ],
    styleNotes: "Game-like, no-prep puzzle tasks rather than classic multiple-choice tests; measures how you decide and persist. Third-party sites still describe numerical/critical reasoning tests from earlier cycles.",
    source: BDO_PROC,
    confidence: "official",
  },
  videoInterview: {
    text: "Asynchronous, some elements timed (BDO FAQ); includes practice before you start; assesses communication, business-stream awareness and values.",
    source: BDO_FAQ,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Virtual assessment centre with work-simulating activities; school leavers do a case study presentation and group exercise.",
    source: BDO_PROC,
    confidence: "official",
  },
  finalInterview: { text: "Face-to-face interview at the applied-for office on motivations, strengths and experience.", source: BDO_PROC, confidence: "official" },
  values: [
    "Problem solving and decision-making",
    "Focus and reasoning",
    "Resilience and persistence",
    "Collaboration and awareness",
    "Communication",
    "Leadership potential",
    "Business awareness and client focus",
    "Authenticity and learning agility",
  ],
  questions: [
    { stage: "Video interview", question: "Why BDO, and why the service line you applied to? What can you bring to this role?", type: "motivation", source: "https://www.practiceaptitudetests.com/top-employer-profiles/bdo-assessments/", confidence: "single-report" },
    { stage: "Final in-person interview", question: "Why BDO (and how does it compare with competitors)?", type: "motivation", source: BDO_WJ, confidence: "single-report" },
    { stage: "Final in-person interview", question: "Why your chosen service line?", type: "motivation", source: BDO_WJ, confidence: "single-report" },
    { stage: "Final in-person interview", question: "Examples of workplace challenges you overcame; how you communicate and work in teams; handling difficult team dynamics.", type: "competency", source: BDO_WJ, confidence: "single-report" },
  ],
  specificAdvice: [
    "The 2027 audit school leaver deadline is 15 Nov 2026 with 15 offices: pick your office carefully because the final interview is in it.",
    "BDO allows AI for research and preparation only; using it during assessments or to write interview answers is prohibited.",
    "BDO's listed behaviours (problem solving, resilience, collaboration, communication, leadership potential, business awareness, authenticity, learning agility) are what the puzzle tasks and video questions probe: prepare one example each.",
    "Prepare a short presentation on an assigned topic and a group case; older reports have both.",
  ],
  officialLinks: [BDO_PROC, BDO_JOB, BDO_FAQ, "https://careers.bdo.co.uk"],
  lastVerified: "2026-10-03",
  gaps: [
    "Assessment provider, number of tasks and timings for the task-based assessment not published.",
    "Video interview number of questions, prep and answer time for the school leaver version not verified (only a Fishbowl mention of 3 questions; page not read).",
    "Assessment centre details (timings, group case content) only from wikijob/undated graduate sources.",
    "No first-hand 2025-26 apprentice reports (TSR blocked).",
    "Whether BDO offers a degree-level (Level 6) apprenticeship is unclear: pages list ACA/CFAB/ICAS only.",
  ],
};
