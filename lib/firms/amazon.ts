import type { FirmProfile } from "./types";

const AMZ_SDE = "https://amazonapprenticeships.co.uk/our-programmes/software-development-engineer-apprentice";
const AMZ_FAQ = "https://amazonapprenticeships.co.uk/frequently-asked-questions";
const AMZ_SUPPORT = "https://amazonapprenticeships.co.uk/application-support";
const AMZ_TIPS = "https://www.aboutamazon.co.uk/news/working-at-amazon/amazon-apprenticeship-tips";
const AMZ_LP = "https://www.amazon.jobs/content/en/our-workplace/leadership-principles";
const AMZ_JTP = "https://www.jobtestprep.co.uk/amazon-apprenticeship-test";
const AMZ_ABOUT = "https://www.aboutamazon.co.uk/news/working-at-amazon/apprenticeships-2025";

export const amazon: FirmProfile = {
  slug: "amazon",
  name: "Amazon UK",
  sector: "Technology / e-commerce / cloud",
  programmes: [
    {
      name: "Software Development Engineer Apprentice (42 months)",
      level: "Level 6",
      degree: "BSc (Hons) Digital & Technology Solutions - Software Pathway",
    },
    {
      name: "Other degree and non-degree apprenticeships (data, cyber, AI, engineering, HR, marketing, management etc.; 40+ schemes, 1,000+ roles in 2025)",
      level: "Levels 3-7",
    },
  ],
  entry: {
    predictedGrades: "A-levels ABB including Maths or Computer Science; or BTEC Computing/IT D*DD; or T-Level Digital Production, Design & Development at Merit+ (Sept 2026 SDE)",
    other:
      "Five GCSEs grade 4/C+ including Maths and English; 18 by Sept 2026; right to work in England for the programme; UK/EEA residency for preceding 3 years.",
    source: AMZ_SDE,
  },
  timeline: {
    opens: "November (the FAQ, checked 3 Oct 2026, still describes the 2026 cohorts; no 2027 date is published yet)",
    rolling: true,
    notes:
      "Rolling; roles close when enough applications arrive, so apply early. Degree apprenticeships start in September, non-degree in July. After the first assessment, later assessments have a strict 5-day deadline that cannot be extended.",
    source: AMZ_FAQ,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Upload CV, answer eligibility questions.",
      tips: ["Tailor to the specific programme; Amazon staff advise stating interest in that exact apprenticeship."],
      source: AMZ_FAQ,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment (workstyles / games)",
      format:
        "Amazon describes an online assessment using 'scientific methods to measure problem-solving, how you handle emotions, your interests', plus a game-based personality assessment where no prior knowledge is required. Provider for the game-based assessment is reported as Arctic Shores. First assessment has an expiry but no strict deadline; subsequent ones have a strict 5-day deadline.",
      provider: "Arctic Shores (game-based; reported by Amazon-linked recruitment summaries)",
      tips: [
        "Complete it on a laptop in a quiet place in one sitting; there are no right/wrong answers, so act naturally and consistently.",
        "Set calendar reminders for the 5-day deadlines after the first assessment.",
      ],
      source: AMZ_FAQ,
      confidence: "official",
    },
    {
      order: 3,
      name: "On-demand video interview",
      format:
        "Follow a link and record answers about your background, motivations, skills and interests. Amazon FAQ says three questions about motivations and transferable skills; JobTestPrep/candidate summaries claim up to 12 questions with one attempt each - conflicting and unverified.",
      tips: [
        "Prepare examples for several Leadership Principles, especially Learn and Be Curious and Ownership.",
        "Use STAR; state the apprenticeship-specific reason for applying.",
      ],
      source: AMZ_SUPPORT,
      confidence: "official",
    },
    {
      order: 4,
      name: "Virtual assessment centre",
      format:
        "For the SDE apprentice: 1 presentation, 2 interviews and a group exercise (per About Amazon UK summary). Amazon's own page says may include a group exercise, a presentation, interviews and role-specific practical tasks.",
      tips: [
        "Group exercise is judged on teamwork and problem-solving; include others' ideas.",
        "Ask questions through the day - Amazon staff encourage it.",
      ],
      source: AMZ_SUPPORT,
      confidence: "official",
    },
    {
      order: 5,
      name: "Offer, background checks and onboarding",
      format: "Offer stage, then background checks and onboarding before start.",
      tips: [],
      source: AMZ_SDE,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Arctic Shores (game-based assessment) - reported; Amazon's own pages refer only to 'game-based assessment'",
    tests: [
      {
        name: "Game-based personality/workstyle assessment",
        format: "Interactive game-style tasks, no prior knowledge needed, no right/wrong answers",
        notes: "JobTestPrep lists game names (Tickets, Directions, Order) - commercial prep site, unverified. The full-time SDE coding OA (~70 min) on amazon.jobs is not documented for apprentices.",
      },
    ],
    styleNotes:
      "For look-alike practice, build short timed reaction/decision mini-games (risk vs reward, sequence following, rule switching) with no scoring feedback, and a separate workstyle questionnaire about how you approach work scenarios. Also practise recording video answers against Leadership Principles.",
    source: AMZ_FAQ,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "On-demand video about you; Amazon FAQ says three questions on motivation and transferable skills. Third-party guides claim 12 questions, one attempt each, with individual time limits - unresolved.",
    source: AMZ_FAQ,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Virtual assessment centre: group exercise, presentation, individual interviews and role-related tasks. SDE apprentice reported as 1 presentation, 2 interviews and a group exercise. Amazon AI apprentice ACs ran Feb-May 2025. Presentation topics not published.",
    source: AMZ_SUPPORT,
    confidence: "official",
  },
  values: [
    "Customer Obsession",
    "Ownership",
    "Invent and Simplify",
    "Are Right, A Lot",
    "Learn and Be Curious",
    "Hire and Develop the Best",
    "Insist on the Highest Standards",
    "Think Big",
    "Bias for Action",
    "Frugality",
    "Earn Trust",
    "Dive Deep",
    "Have Backbone; Disagree and Commit",
    "Deliver Results",
    "Strive to be Earth's Best Employer",
    "Success and Scale Bring Broad Responsibility",
  ],
  questions: [
    {
      stage: "On-demand video interview",
      question: "Why Amazon and why an apprenticeship? Which leadership principles do you resonate with?",
      type: "motivation",
      source: AMZ_JTP,
      confidence: "single-report",
    },
    {
      stage: "On-demand video interview",
      question: "Discuss a time you faced a difficult challenge at work and how you solved it.",
      type: "competency",
      competency: "Problem solving",
      source: AMZ_JTP,
      confidence: "single-report",
    },
    {
      stage: "On-demand video interview",
      question: "Describe any situation or project where you showed leadership.",
      type: "competency",
      competency: "Leadership",
      source: AMZ_JTP,
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "Every stage is benchmarked against the Leadership Principles; prepare at least one STAR story each for Ownership, Learn and Be Curious, Customer Obsession, Bias for Action and Earn Trust.",
    "Amazon staff say they want 'I might not know how to do this, but I am willing to learn' - show curiosity and ownership, and commitment to completing the qualification.",
    "Apply early in the November rolling window; roles close once enough applications are in.",
    "Mind the 5-day deadlines on subsequent assessments: they cannot be extended.",
    "For the assessment centre prepare a short presentation on yourself/role interest and a structured way to include others in the group exercise.",
  ],
  officialLinks: [
    "https://amazonapprenticeships.co.uk/",
    AMZ_SDE,
    AMZ_FAQ,
    AMZ_SUPPORT,
    AMZ_TIPS,
    AMZ_LP,
    AMZ_ABOUT,
  ],
  lastVerified: "2026-10-03",
  gaps: [
    "Video interview question count conflict (Amazon FAQ: 3 vs prep-site: 12); game-based assessment provider (Arctic Shores) and game names not confirmed on Amazon's own page.",
    "Presentation topic/length and group exercise scenario for the SDE apprentice centre.",
    "Whether SDE apprentices take the coding OA (amazon.jobs SDE OA page does not cover apprenticeships).",
    "Real candidate questions are prep-site summaries; TSR threads blocked (403), Glassdoor blocked.",
    "Pass marks and time to offer.",
    "Opening date for the 2027 cohorts: Amazon's FAQ still refers to 2026 cohorts, so expect November again but confirm on the site.",
  ],
};
