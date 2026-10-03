import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const FM_SEL = "https://careers-uk.forvismazars.com/early-careers/selection-process/";
const FM_TJ = "https://targetjobs.co.uk/organisations/forvis-mazars";
const FM_GJ = "https://www.graduate-jobs.com/interviews/company/forvismazars";

export const forvisMazars: FirmProfile = {
  slug: "mazars",
  name: "Forvis Mazars UK",
  sector: "Professional services (mid-tier)",
  programmes: [
    {
      name: "School Leaver Apprentice (Audit, Advisory & Consulting, Tax etc.)",
      level: "School leaver apprenticeship leading to ACA (chartered accountant)",
      locations: ["Glasgow", "Edinburgh", "Newcastle", "Leeds", "Manchester", "Birmingham", "London", "Bristol", "Milton Keynes", "others (13 offices per TargetJobs)"],
    },
  ],
  entry: {
    other: "No specific grades stated on the profile page; designed for those completing A-levels/Advanced Highers or equivalent. Forvis Mazars says there is no set type of person, education or background.",
    source: FM_TJ,
  },
  timeline: {
    notes: "Vacancies advertised with 1 September 2025 and 1 September 2026 start dates. Closing dates not verified.",
    source: "https://www.prospects.ac.uk/employer-profiles/forvis-mazars-19300/jobs/ac-risk-consulting-industry-services-school-leaver-apprentice-1-september-2026-london-2705184",
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Personal details, education and qualifications, plus a motivation statement. No CV or cover letter.",
      tips: ["Write a specific motivation statement for the service line and office."],
      source: FM_SEL,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment (Neurosight)",
      format: "Strengths assessment of 5-8 minutes (official page says five minutes), warm-up questions first, no preparation needed; personalised feedback report afterwards.",
      provider: "Neurosight",
      durationMins: 6,
      tips: ["Answer instinctively; use the feedback report to prepare strengths examples."],
      source: FM_SEL,
      confidence: "official",
    },
    {
      order: 3,
      name: "First interview (live video)",
      format: "Live MS Teams video interview with the recruitment team; strengths-based questions on motivations, strengths and abilities; choose your slot. Pre-interview mentoring calls with recent trainees are offered.",
      tips: ["Take up the mentoring call.", "Prepare strengths-based answers plus why Forvis Mazars, why audit/ACA."],
      source: FM_SEL,
      confidence: "official",
    },
    {
      order: 4,
      name: "Virtual assessment centre",
      format: "Half-day virtual centre with work-like exercises; no specialist knowledge needed. Search excerpt of the official page lists group exercise, in-tray exercise and a self-reflection exercise.",
      durationMins: 210,
      tips: ["Practise prioritising an inbox and explaining your reasoning.", "Prepare a structured self-reflection: strengths, development, examples."],
      source: FM_SEL,
      confidence: "official",
    },
    {
      order: 5,
      name: "Final in-person interview",
      format: "With a senior leader from your business area at your local office; includes a presentation task and questions on skills, experiences and aspirations.",
      tips: ["Practise a short presentation; review the ACA route."],
      source: FM_SEL,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Neurosight",
    tests: [{ name: "Neurosight strengths assessment", format: "Short adaptive strengths test with warm-up items; no right answers to learn", timeMins: 6, notes: "Item count not published." }],
    styleNotes: "Brief, decision-style based assessment, same vendor as Grant Thornton. Focus on instinctive responses, consistency and completing in one sitting.",
    source: FM_SEL,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Half-day virtual assessment centre: group exercise, in-tray exercise and self-reflection exercise (per search excerpt of the careers site); reflects working at Forvis Mazars.",
    source: FM_SEL,
    confidence: "official",
  },
  finalInterview: {
    text: "In-person with a senior leader from your business area: a presentation task plus skills, experience and aspiration questions.",
    source: FM_SEL,
    confidence: "official",
  },
  values: ["Curiosity", "Critical thinking", "Commitment to self-development", "Responsibility", "Strong interpersonal skills"],
  questions: [
    { stage: "First interview (live video)", question: "Why Mazars? Why audit/the specific role?", type: "motivation", source: FM_GJ, confidence: "single-report" },
    { stage: "First interview (live video)", question: "What do you know about the ACA?", type: "technical", source: FM_GJ, confidence: "single-report" },
    { stage: "First interview (live video)", question: "Tell me about a time you had conflict with someone's decision.", type: "competency", source: FM_GJ, confidence: "single-report" },
    { stage: "First interview (live video)", question: "Tell me about a time you showed leadership.", type: "competency", source: FM_GJ, confidence: "single-report" },
    { stage: "Final in-person interview", question: "When have you been creative? When have you adapted your style to suit a team? When have you had to work flexibly?", type: "competency", source: FM_GJ, confidence: "single-report" },
    { stage: "Final in-person interview", question: "What makes a good role model and when have you acted as one? What motivates you and how do you stay self-motivated?", type: "competency", source: FM_GJ, confidence: "single-report" },
    { stage: "Final in-person interview", question: "Article/case discussion: outline the main stakeholders, how would you fix the problem, what obstacles will your solution face?", type: "case", source: FM_GJ, confidence: "single-report" },
  ],
  specificAdvice: [
    "Forvis Mazars gives unusual help: pre-interview mentoring calls with recent trainees, feedback reports and feedback calls. Use all of them.",
    "The first interview is live on Teams with recruiters (not a recorded video), so practise conversation, not monologue.",
    "Know the ACA route and why audit; this is a repeated question theme.",
    "Practise the in-tray exercise and a short presentation; both are in the final stages.",
    "Question lists are from graduate-jobs.com (age and cohort not stated): indicative, not verified 2025-26.",
  ],
  officialLinks: [FM_SEL, "https://careers-uk.forvismazars.com/faqs/", FM_TJ],
  lastVerified: "2026-10-03",
  gaps: [
    "Entry requirements (UCAS/GCSE), salary and closing dates not found; vacancy pages redirected.",
    "Live video interview length and question count not stated.",
    "Assessment centre exact timings and exercise content beyond the three named activities not verified; official page itself listed activities only in a search excerpt.",
    "Candidate-reported questions have no dates; TSR 2025 threads (403) not read.",
    "Company values wording not taken from an official values page.",
  ],
};
