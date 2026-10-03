import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const GT_PROC = "https://www.grantthornton.co.uk/careers/early-careers/employability-hub/our-application-process/";
const GT_PROG = "https://www.grantthornton.co.uk/careers/early-careers/our-programmes/apprenticeships/";
const GT_GF = "https://www.graduatesfirst.com/grant-thornton-aptitude-tests";

export const grantThornton: FirmProfile = {
  slug: "grant-thornton",
  name: "Grant Thornton UK",
  sector: "Professional services (mid-tier)",
  programmes: [
    { name: "Audit apprenticeship", level: "Level 4 and Level 7 apprenticeship qualifications (4-5 years)" },
    { name: "Tax apprenticeship", level: "Level 4 and Level 7 apprenticeship qualifications (4-5 years)" },
    { name: "Advisory apprenticeship", level: "Level 4 and Level 7 apprenticeship qualifications (4-5 years)" },
  ],
  entry: {
    ucas: "No set grades or subjects; A-levels (or equivalent) required; flexible approach assessing strengths, motivations and potential.",
    other: "Offices reported by a prep site: Birmingham, Bristol, Cambridge, Cardiff, Edinburgh, Glasgow, Leeds, London, Manchester.",
    source: GT_PROG,
  },
  timeline: {
    rolling: true,
    notes: "The official page (checked 3 Oct 2026) still says it is open for 2026 graduate and apprentice programmes; 2027 dates are not published yet.",
    source: GT_PROG,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Short form, about 20 minutes (search excerpt of GT site).",
      durationMins: 20,
      tips: ["Answer directly and accurately; there are no set grade thresholds."],
      source: GT_PROC,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment (Neurosight)",
      format: "Under 5 minutes; adaptive strengths assessment measuring strengths that enable high performance in a trainee role; starts with warm-up items.",
      provider: "Neurosight",
      durationMins: 5,
      tips: ["Find a quiet space and answer naturally without overthinking."],
      source: GT_PROC,
      confidence: "official",
    },
    {
      order: 3,
      name: "Written case study",
      format: "About 20 minutes (prep site says 22) on a laptop: review written content and data, then type a mini report; assesses analytical skills, critical reasoning and written language. GT provides a practice case study and tips guide.",
      durationMins: 20,
      tips: ["Use the GT practice case study.", "Write structured, concise recommendations that use the data."],
      source: GT_PROC,
      confidence: "official",
    },
    {
      order: 4,
      name: "Digital interview",
      format: "Apprentice applicants complete a brief digital (video-recorded, strengths-based) interview around the case study stage.",
      tips: ["Practise short strengths-based answers."],
      source: GT_GF,
      confidence: "single-report",
    },
    {
      order: 5,
      name: "Group exercise",
      format: "Virtual, led by the recruitment team; assesses teamwork, collaboration, listening, idea sharing, time management. Prep sites describe ~20 min to analyse a fictional business with data then report back to an assessor 'client'; groups of 4-6.",
      tips: ["Keep the team on time; invite quieter members in; summarise."],
      source: GT_PROC,
      confidence: "official",
    },
    {
      order: 6,
      name: "Final round interview",
      format: "In person at a UK office with one or two assessors from your service line; conversational; motivations (Why Grant Thornton?), values and interests. GT recommends the STARE technique (Scene, Task, Action, Result, Evaluation).",
      tips: ["Use STARE with an Evaluation at the end.", "Link examples to CLEARR values."],
      source: GT_PROC,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Neurosight (GT); written case study is GT's own",
    tests: [
      { name: "Neurosight strengths assessment", format: "Short adaptive game-like strengths assessment, warm-up items first", timeMins: 5 },
      { name: "Written case study", format: "Read text/tables/graphs then type a mini-report", timeMins: 20 },
    ],
    styleNotes: "Neurosight is a brief, instinct-led strengths test with no right answer to prepare for. The case study mixes narrative, tables and charts and requires a written recommendation in about 20 minutes on a laptop.",
    source: GT_PROC,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Virtual group exercise led by recruiters (teamwork, collaboration, listening, time management); prep sources say fictional business data reviewed for ~20 min then a client debrief.",
    source: GT_PROC,
    confidence: "official",
  },
  finalInterview: {
    text: "In-office interview with one or two assessors from the service line; motivations, values alignment, interests; STARE technique recommended.",
    source: GT_PROC,
    confidence: "official",
  },
  values: ["Collaboration", "Leadership", "Excellence", "Agility", "Respect", "Responsibility"],
  questions: [
    { stage: "Final round interview", question: "Why Grant Thornton and why audit? (plus questions on values and interests)", type: "motivation", source: GT_GF, confidence: "single-report" },
    { stage: "Final round interview", question: "Why an apprenticeship?", type: "motivation", source: GT_GF, confidence: "single-report" },
    { stage: "Final round interview", question: "How do you make sure your work meets the highest quality standards, and who do you collaborate with?", type: "competency", source: GT_GF, confidence: "single-report" },
    { stage: "Final round interview", question: "Give an example of positively influencing others to improve a process.", type: "competency", source: GT_GF, confidence: "single-report" },
    { stage: "Assessment centre", question: "Fictional company case (2018 graduate reports): what should the company do to gain more profit, what should they change, what solutions would you give?", type: "case", source: "https://www.graduate-jobs.com/interviews/company/grant-thornton", confidence: "single-report" },
  ],
  specificAdvice: [
    "The pipeline is short and front-loaded with very short online tasks (Neurosight under 5 minutes): the case study is your main written differentiator, so do GT's practice case study.",
    "Structure case-study answers as headline recommendation, two or three supporting data points, a risk and next step.",
    "Show CLEARR values explicitly and finish STARE answers with the Evaluation step GT asks for.",
    "GT sends a positive-action/coaching offer and a dedicated recruiter; use them if eligible.",
  ],
  officialLinks: [GT_PROC, GT_PROG, "https://www.grantthornton.co.uk/careers/early-careers/"],
  lastVerified: "2026-10-03",
  gaps: [
    "GT does not state whether its Level 7 route is a degree (Level 6) or master's-level apprenticeship; degree title/university not verified.",
    "Digital interview question count and timings not from an official page.",
    "No 2025-26 first-hand candidate reports (TSR, Glassdoor, Reddit blocked); Glassdoor school leaver page unread.",
    "Salary, exact locations (from prep site only) and 2027 dates not verified.",
  ],
};
