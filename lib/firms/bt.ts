import type { FirmProfile } from "./types";

const BT_FAQ = "https://jobs.bt.com/content/Apprenticeship-FAQs/";
const BT_HOME = "https://jobs.bt.com/content/Apprenticeships---BT-Group/";
const BT_ENG = "https://jobs.bt.com/content/Engineering---Apprenticeships/";
const BT_TJ = "https://targetjobs.co.uk/careers-advice/interviews-and-assessment-centres/what-expect-bts-assessment-centre";
const BT_ACHQ = "https://www.assessmentcentrehq.com/bt-test/";
const BT_GD = "https://www.glassdoor.co.uk/Interview/BT-Group-Apprentice-Interview-Questions-EI_IE3463.0,8_KO9,19.htm";

export const bt: FirmProfile = {
  slug: "bt",
  name: "BT Group",
  sector: "Telecoms / technology",
  programmes: [
    {
      name: "Network Engineering Apprentice (51 months)",
      level: "Level 6",
      degree: "Digital & Technology Solutions Professional, Network Engineering specialism",
      locations: ["Ipswich"],
    },
    {
      name: "Software Engineering, Transformation & Delivery, Data and AI degree-level routes",
      level: "Level 4 to degree (up to 4 years)",
      degree: "Work-based degree qualification",
    },
    { name: "Customer Support Technician (Engineering)", level: "Level 3", locations: ["Exeter", "Plymouth", "Reading", "Sunbury"] },
  ],
  entry: {
    predictedGrades: "Most apprenticeships: 5 GCSEs grade 4-9 (C or above) including English Language and Maths (Level 2 functional skills accepted as equivalent)",
    other: "No CV needed. Starting salary £21,620-£23,810; 37.5 hours/week. Degree-level entry grades not published in the pages seen.",
    source: BT_FAQ,
  },
  timeline: {
    opens: "Applications open 2-22 February annually (per FAQ)",
    closes: "22 February (per FAQ)",
    rolling: false,
    notes: "Outcome communicated within 2 weeks after assessment centres complete. Recruiters ask for the online assessment to be completed within 5 days.",
    source: BT_FAQ,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "About 20 minutes: personal details, eligibility, preferred locations, education and initial responses. No CV and 'no difficult questions'.",
      tips: ["Apply early in the February window."],
      source: BT_FAQ,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment",
      format:
        "Untimed, can pause (about 30 minutes in total for the engineering roles): 5 written/text-based scenario questions reviewed using AI technology and one 90-second video question reviewed by a recruiter. Designed to show learning potential. Complete within 5 days.",
      provider: "Not named by BT",
      durationMins: 30,
      tips: [
        "Answer the written questions in specific, structured detail - they are AI-reviewed against defined criteria.",
        "Rehearse a 90-second answer: who you are, why BT, why this route.",
      ],
      source: BT_HOME,
      confidence: "official",
    },
    {
      order: 3,
      name: "Screening call",
      format: "Recruiter call under ~20 minutes confirming right to work and qualifications.",
      tips: ["Have certificates and dates ready."],
      source: BT_FAQ,
      confidence: "official",
    },
    {
      order: 4,
      name: "Assessment centre / final stage",
      format:
        "Typically about 3 hours, in person (or virtual per BT's degree-level page): group exercise and competency-based interview; field roles are competency interview only. Candidates report a group task to choose ideas that improve BT services with a 10-minute presentation of your idea (topic emailed beforehand) and ~5 competency questions.",
      tips: [
        "Bring a BT-relevant idea for the group exercise (customer service, networks, digital inclusion).",
        "Show listening and collaboration; group criteria reported: participation, collaboration, influence, listening, rational decision-making.",
      ],
      source: BT_FAQ,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 5,
      name: "Outcome",
      format: "Result by phone/email within about 2 weeks.",
      tips: [],
      source: BT_FAQ,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Not named; responses reviewed with AI technology plus recruiter review of the video",
    tests: [
      { name: "Written scenario questions", format: "5 text-based questions, untimed, pause allowed", items: 5 },
      { name: "Video question", format: "One 90-second recorded question", items: 1, timeMins: 1.5 },
    ],
    styleNotes:
      "Create original look-alikes as short workplace scenarios (customer problem, team disagreement, new technology to learn) answered in a few sentences each, scored for learning potential and structure, plus a one-take 90-second 'introduce yourself and why BT' prompt. BT's older graduate route used Logiks (12 min) and Factors tests, which are not confirmed for apprentices.",
    source: BT_FAQ,
    confidence: "official",
  },
  videoInterview: {
    text: "Single 90-second video question inside the online assessment, reviewed by a recruiter. No separate HireVue-style interview found for apprentices.",
    source: BT_FAQ,
    confidence: "official",
  },
  assessmentCentre: {
    text: "~3 hours, in person; group exercise plus competency interview (reported: present a BT improvement idea for 10 minutes; ~5 competency questions). Graduate centre also includes a presentation and technical interview.",
    source: BT_FAQ,
    confidence: "multiple-candidate-reports",
  },
  values: [
    "Personal: own outcomes, be curious, open to learn, treat others as they want to be treated",
    "Simple: straightforward, easy to deal with, make complex things clear",
    "Brilliant: teamwork first, think big and bold, push for highest standards",
  ],
  questions: [
    { stage: "Assessment centre / final stage", question: "Why do you want to work for BT Group?", type: "motivation", source: BT_GD, confidence: "multiple-candidate-reports" },
    { stage: "Assessment centre / final stage", question: "Tell us about challenges you have faced and how you tackled them.", type: "competency", competency: "Resilience", source: BT_GD, confidence: "single-report" },
    { stage: "Assessment centre / final stage", question: "What are your strengths and weaknesses, and why are you interested in this role?", type: "motivation", source: BT_GD, confidence: "single-report" },
    { stage: "Assessment centre / final stage", question: "Group task: choose ideas to improve BT and its services, then present your idea.", type: "group-exercise", competency: "Teamwork", source: BT_GD, confidence: "single-report" },
  ],
  specificAdvice: [
    "The first screen is a written scenario assessment reviewed by AI against set criteria, so write specific, structured answers rather than generic ones.",
    "Weave Personal, Simple, Brilliant into answers - BT's own assessment-centre guidance (TargetJobs) tells you to demonstrate these.",
    "Applications open 2-22 February; apply early and finish the assessment within 5 days.",
    "Prepare a clear 10-minute idea for improving BT services; use simple language (the 'Simple' value).",
    "Have qualifications evidence ready for the under-20-minute screening call.",
  ],
  officialLinks: [BT_HOME, BT_FAQ, BT_ENG, "https://jobs.bt.com/content/Transformation-and-Delivery-Apprenticeships/"],
  lastVerified: "2026-10-03",
  gaps: [
    "BT pages do not show the year of the stated February window; treat as the annual pattern.",
    "Entry grades (UCAS points) for Level 6 roles and degree universities.",
    "Whether BT's older Logiks/Factors psychometrics (Cubiks) still apply; AssessmentCentreHQ does not distinguish apprentices from graduates.",
    "Glassdoor apprentice reviews returned 403; questions are from a search snippet, with no dates, and TargetJobs article (Aug 2024) is graduate-focused.",
    "Pass marks and assessor scoring of the AI-reviewed written answers.",
  ],
};
