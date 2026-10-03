import type { FirmProfile } from "./types";

const SEL = "https://careers.atkinsrealis.com/en/early-careers/uk/apprentices/selection-process";
const FAQ = "https://careers.atkinsrealis.com/uk-early-careers/faqs-apprentices";
const PREP = "https://careers.atkinsrealis.com/uk-early-careers/blogs/2025-5/how-to-prepare-for-an-early-careers-interview";
const IA_BLOG = "https://careers.atkinsrealis.com/uk-early-careers/blogs/2024-10/how-to-prepare-for-the-atkinsrealis-immersive-assessment";
const AMAZING = "https://www.amazingapprenticeships.com/employers/atkinsrealis/";
const TSR = "https://www.thestudentroom.co.uk/showthread.php?t=7297619";
const VALUES = "https://careers.atkinsrealis.com/en/what-matters-to-us";

export const atkinsrealis: FirmProfile = {
  slug: "atkinsrealis",
  name: "AtkinsRéalis",
  sector: "Engineering consultancy and nuclear",
  programmes: [
    { name: "Level 6 degree apprenticeships (18+ specialisms incl. Architecture, Civil Engineer, Software Engineer, Nuclear Scientist, chartered surveying routes)", level: "Level 6" },
    { name: "Level 5 Civil Engineering HLA, Level 4 Information Manager", level: "Level 4/5" },
    { name: "Level 3 (civil technician, rail, project controls, network cable)", level: "Level 3" },
  ],
  entry: {
    other:
      "Varies by level, location and learning provider; see each job description. UK residency normally 3 consecutive years before start. Level 6 starts on at least the Real Living Wage. 2025 salary range cited 22,500-30,784 depending on level/location.",
    source: FAQ,
  },
  timeline: {
    opens: "November",
    closes: "Typically end of February; some roles close earlier.",
    notes: "Interviews typically January-April; decision within about two weeks of interview; one application per year; start early September.",
    source: FAQ,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Short form: basic details, qualifications, interests. No CV or cover letter.",
      tips: ["Be accurate; one application per year."],
      source: SEL,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online immersive assessment",
      format:
        "'Day in the life' interactive assessment, about 45 minutes (up to about an hour), not strictly timed: situational judgement plus numerical and verbal reasoning. The 2024 blog said it ended with three short video/written answers; the 2026 FAQ says there are no video interview questions. A practice version exists.",
      provider: "AtkinsRéalis immersive assessment (formerly Atkins Immersive Assessment)",
      durationMins: 45,
      tips: ["Use the practice version; complete in one sitting with a stable connection.", "Responses must be your own (no AI during assessment)."],
      source: FAQ,
      confidence: "official",
    },
    {
      order: 3,
      name: "Virtual interview",
      format:
        "Microsoft Teams with two interviewers from the hiring team(s). Most roles also get a short business presentation session beforehand (nothing to prepare). Length reported from about an hour to 90 minutes; covers some technical elements, competencies and scenarios.",
      durationMins: 90,
      tips: ["Use STAR; link hobbies and interests to why engineering; do not memorise scripts."],
      source: FAQ,
      confidence: "official",
    },
    {
      order: 4,
      name: "Outcome",
      format: "Verbal offer, then contract after confirming details with the college/university; Early Careers TalentConnector pre-boarding.",
      tips: [],
      source: FAQ,
      confidence: "official",
    },
  ],
  oa: {
    provider: "AtkinsRéalis immersive assessment",
    tests: [
      { name: "Situational judgement", format: "Work scenarios in a 'day in the life' narrative.", notes: "Count not published." },
      { name: "Numerical and verbal reasoning", format: "Embedded questions.", notes: "Count not published." },
    ],
    styleNotes:
      "Narrative, game-like workplace scenario blending SJT with numerical and verbal items in one flow. Write original look-alikes as a short engineering project story with decision points, a chart to interpret, and a short paragraph to evaluate.",
    source: FAQ,
    confidence: "official",
  },
  videoInterview: {
    text: "2024 official blog said the immersive assessment ended with three short answers (one written, two video); 2026 FAQ says no video interview questions. Treat as removed unless your invite says otherwise.",
    source: IA_BLOG,
    confidence: "official",
  },
  assessmentCentre: undefined,
  finalInterview: {
    text: "Two-interviewer Teams panel, up to 90 minutes, technical elements, competencies and scenarios; feedback areas reported by candidates: Motivational fit, Curiosity and problem solving, Planning, Working well with others.",
    source: FAQ,
    confidence: "official",
  },
  values: ["Safety", "Integrity", "Collaboration", "Innovation", "Excellence"],
  questions: [
    { stage: "Online immersive assessment", question: "What are you going to bring to the role and how will you contribute to the team?", type: "motivation", source: TSR, confidence: "single-report" },
    { stage: "Online immersive assessment", question: "Tell us how you overcame a challenge and what you learnt from it.", type: "competency", competency: "Resilience", source: TSR, confidence: "single-report" },
    { stage: "Online immersive assessment", question: "Why do you want to work at Atkins?", type: "motivation", source: TSR, confidence: "single-report" },
  ],
  specificAdvice: [
    "Apply in November; interviews run January to April.",
    "Do the practice immersive assessment to see the format.",
    "Show real interest in infrastructure, nuclear or digital and tie hobbies to your choice.",
    "Prepare 6 STAR stories and questions for the panel.",
    "Learn values: Safety first, plus Integrity, Collaboration, Innovation, Excellence.",
  ],
  officialLinks: [SEL, FAQ, PREP, IA_BLOG, AMAZING, VALUES],
  lastVerified: "2026-10-03",
  gaps: [
    "Conflicting durations: 45 min (official FAQ/blog), 60 min (Amazing Apprenticeships and a search summary); interview 'about an hour' vs '90 minutes'.",
    "Reported questions are from search summaries of the Student Room (403), likely video answers from the pre-2026 format.",
    "No item counts or pass mark; a commercial prep site's description was not used for facts.",
    "Entry grades per programme not retrieved; AtkinsRéalis values in search summary of a careers page.",
  ],
};
