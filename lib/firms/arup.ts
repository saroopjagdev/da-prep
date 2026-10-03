import type { FirmProfile } from "./types";

const APPS = "https://www.arup.com/en-us/careers/early-careers/apprenticeships/";
const TJ = "https://targetjobs.co.uk/careers-advice/interviews-and-assessment-centres/tips-tackling-arups-interview-questions-and-assessment-centre-exercises";
const GF = "https://www.graduatesfirst.com/arup-job-tests";
const KEY_SPEECH = "https://www.arup.com/globalassets/downloads/corporate-documents/speeches/ove-arup-key-speech.pdf";

export const arup: FirmProfile = {
  slug: "arup",
  name: "Arup",
  sector: "Engineering, design and consultancy (built environment)",
  programmes: [
    {
      name: "Level 6 degree apprenticeships (civil, building services mechanical/electrical, other disciplines by office)",
      level: "Level 6",
      locations: ["Belfast", "Bristol", "Cardiff", "Edinburgh", "Glasgow", "Leeds", "Liverpool", "London", "Manchester", "Newcastle", "Nottingham", "Sheffield", "Birmingham", "Whitehaven", "Winchester", "York"],
    },
    { name: "Lower-level apprenticeships (Level 3 etc.)", level: "Level 3+" },
  ],
  entry: {
    other:
      "Varies per vacancy. Search summaries of Arup adverts: A-level Maths plus a science/technology subject, or 112 UCAS points including 64 from two A-levels or BTEC equivalents, or DMM BTEC; some Level 6 roles BBB including Maths and a physical science. Full-time permanent role with 6-month probation and day-release study.",
    source: APPS,
  },
  timeline: {
    opens: "November each year",
    notes: "Start in September. One application per cycle. Arup asks applicants not to use AI writing assistants in the application.",
    source: APPS,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Form with basic details and essay-style questions (a prep site reports five motivational questions). No AI writing tools requested.",
      tips: ["Write in your own voice; show real interest in the built environment and projects."],
      source: APPS,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessments",
      format: "Three short assessments: personality plus timed numerical and logical reasoning.",
      provider: "Not stated by Arup; prep sites suggest Sova/HireVue",
      tips: ["Take in a quiet place; Arup advises this explicitly."],
      source: APPS,
      confidence: "official",
    },
    {
      order: 3,
      name: "Shortlisting",
      format: "Checked against minimum requirements; application answers reviewed with hiring teams.",
      tips: ["Make sure the grades/predicted grades match the advert."],
      source: APPS,
      confidence: "official",
    },
    {
      order: 4,
      name: "Online assessment centre",
      format: "Teams session: meet hiring team and recent apprentices, case study (reported 30 minutes preparation), interview assessing your case answer plus competency questions, virtual office tour, and a chat with the Early Careers team about development and benefits. Reported sequence: intro, ID check, technical exercise, case study discussion, interview, networking.",
      tips: ["Explain your reasoning aloud: Arup cares how you approach a problem."],
      source: APPS,
      confidence: "official",
    },
    { order: 5, name: "Offer", format: "Phone call with offer, then pre-joining engagement.", tips: [], source: APPS, confidence: "official" },
  ],
  oa: {
    provider: "Unconfirmed (Sova/HireVue per prep site)",
    tests: [
      { name: "Numerical reasoning", format: "Timed multiple choice", items: 15, notes: "Item count from a commercial source for Arup generally." },
      { name: "Logical reasoning", format: "Timed pattern-based multiple choice", items: 15, notes: "Commercial source." },
      { name: "Personality", format: "Statements rated on a 5-point scale", notes: "Commercial source says about 40 sets of statements." },
    ],
    styleNotes:
      "Short, timed reasoning (around 15 items each) plus a work-style questionnaire. Write original look-alikes with engineering-flavoured data (loads, flows, costs) and abstract sequences.",
    source: GF,
    confidence: "single-report",
  },
  videoInterview: undefined,
  assessmentCentre: {
    text:
      "Online AC with interview and case study; graduate ACs also include an individual technical exercise and a group exercise (construction-themed decision tasks, e.g. choosing projects to fund). For apprentices Arup lists only interview, case study, apprentice meet and office tour.",
    source: TJ,
    confidence: "official",
  },
  finalInterview: {
    text: "Competency-based, includes values/situational questions, questions from your CV and application, industry trends and the case study. Arup says final interview carries more weight for graduates.",
    source: TJ,
    confidence: "single-report",
  },
  values: ["Quality of work", "Total architecture", "Humane organisation", "Straight and honourable dealings", "Social usefulness", "Reasonable prosperity"],
  questions: [
    { stage: "Online assessment centre", question: "Give an example of when you were a leader in a group project.", type: "competency", competency: "Leadership", source: TJ, confidence: "multiple-candidate-reports" },
    { stage: "Online assessment centre", question: "Describe a time you worked in a group and things did not go the way you wanted. What did you do?", type: "competency", competency: "Teamwork", source: TJ, confidence: "multiple-candidate-reports" },
    { stage: "Online assessment centre", question: "Tell us about a time you had trouble with a teammate on a project and how you resolved it.", type: "competency", competency: "Teamwork", source: TJ, confidence: "multiple-candidate-reports" },
    { stage: "Online assessment centre", question: "Describe how you would explain a technical process to a non-technical person.", type: "competency", competency: "Communication", source: TJ, confidence: "multiple-candidate-reports" },
    { stage: "Online assessment centre", question: "Think of a building on your campus that could be more sustainable. What would you do to improve it?", type: "technical", source: TJ, confidence: "single-report" },
    { stage: "Online assessment centre", question: "Why did you choose to apply to Arup and why should we hire you? / What is your favourite building or Arup project and why?", type: "motivation", source: TJ, confidence: "multiple-candidate-reports" },
  ],
  specificAdvice: [
    "Read Sir Ove Arup's Key Speech (required reading at Arup) and link one story to each value.",
    "Pick a favourite Arup project and be able to say what design decision made it work.",
    "For the 30-minute case study, say assumptions aloud, state the context (loads, users, sustainability) and ask clarifying questions.",
    "Arup applications open in November: prepare the motivational answers in October and write them yourself, without AI.",
    "Know your CV: candidates were asked about early work experience.",
  ],
  officialLinks: [APPS, KEY_SPEECH, "https://www.arup.com/en-us/careers/recruitment-process/", "https://www.arup.com/en-us/about-us/values/"],
  lastVerified: "2026-10-03",
  gaps: [
    "Question bank is from a graduate-focused TargetJobs piece (1 Aug 2024); no apprenticeship-specific questions verified.",
    "OA provider, item counts and timings are unconfirmed commercial claims. A prep site's pre-recorded video interview is not in Arup's apprenticeship process, so excluded.",
    "Arup's degree-apprenticeship entry requirements not read from live adverts (closed).",
    "Glassdoor and Student Room Arup pages unreadable.",
  ],
};
