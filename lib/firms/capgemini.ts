import type { FirmProfile } from "./types";

const CAP_FAQ = "https://www.capgemini.com/gb-en/careers/career-paths/graduates-and-apprenticeships/apprenticeships/apprenticeships-faqs/";
const CAP_APPR = "https://www.capgemini.com/gb-en/careers/career-paths/graduates-and-apprenticeships/apprenticeships/";
const CAP_INVENT = "https://www.capgemini.com/gb-en/careers/career-paths/careers-at-capgemini-invent/accelerate-programme/accelerate-recruitment-process/";
const CAP_INDEED = "https://uk.indeed.com/career-advice/finding-a-job/capgemini-apprenticeship";
const CAP_WIKIJOB = "https://www.wikijob.co.uk/interview-advice/company-interview-questions/capgemini";
const CAP_GD = "https://www.glassdoor.co.uk/Interview/Capgemini-Digital-Technology-Solutions-Degree-Apprentice-Interview-Questions-EI_IE3803.0,9_KO10,56.htm";
const CAP_DEBUT = "https://debut.careers/strengths-based-interview-capgemini/";
const CAP_JTP = "https://www.jobtestprep.co.uk/capgemini-assessment";

export const capgemini: FirmProfile = {
  slug: "capgemini",
  name: "Capgemini UK",
  sector: "Consulting / IT services",
  programmes: [
    {
      name: "Digital & Technology Solutions Degree Apprenticeship (~3 years; Sheffield Hallam University with a 10-week on-campus bootcamp, per a 2026 listing summary)",
      level: "Level 6",
      degree: "BSc (Hons) Digital & Technology Solutions",
      locations: ["Birmingham", "London", "Manchester", "Woking", "Telford", "Worthing"],
    },
    { name: "Digital User Experience (UX) Degree Apprenticeship (4 years)", level: "Level 6" },
    { name: "Environmental Science Degree Apprenticeship (~5 years)", level: "Level 6" },
    { name: "IT Support Technician Apprenticeship (~18 months)", level: "Level 3" },
  ],
  entry: {
    predictedGrades: "3 A levels at grade C or above and 7 GCSEs grade 4/C+ including English and Maths (Capgemini apprenticeships page); BTEC PPD minimum or completed Advanced Apprenticeship alternatives (listing summary).",
    other:
      "One application per recruitment season (Sept-Aug), one programme only; speculative CVs not accepted; permanent employee from day one; 2026 role: 15 positions, start 14 Sept 2026, £20,000 salary (listing summary).",
    source: CAP_APPR,
  },
  timeline: {
    opens: "One intake per year; register interest if closed",
    closes: "Telford 2026 vacancy closed Friday 27 March 2026",
    rolling: false,
    notes: "Recruitment season runs September-August. Assessment centre places are limited from a talent pool.",
    source: CAP_FAQ,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Create a profile, upload up-to-date CV, complete online form.",
      tips: ["Use your one application for the programme you really want."],
      source: CAP_FAQ,
      confidence: "official",
    },
    {
      order: 2,
      name: "Digital interview",
      format:
        "Answer questions on camera specific to your chosen area. Capgemini offers a demo with a team member explaining what to expect and mock questions. Questions are strengths-based (graduate guidance: 12-15 strengths questions in the process). Successful candidates go into an assessment-centre talent pool; not all progress.",
      provider: "Capgemini digital interview platform (vendor not named)",
      tips: [
        "Do the official demo and mock questions first.",
        "Strengths-based: answer honestly about what energises you, not what you think they want.",
      ],
      source: CAP_INVENT,
      confidence: "official",
    },
    {
      order: 3,
      name: "Assessment centre",
      format:
        "Half day with a group exercise, a 1:1 strengths-based interview and, for the Digital & Technology apprenticeship, micro exercises (including a written information-analysis task and a prioritisation task) per Indeed's summary. Groups of 4-6 with ~15 pages of case material: ~10 min reading and ~30 min discussion (graduate-route report). Feedback call offered to every candidate who attends.",
      tips: [
        "Collaborate: Capgemini says 'you're not competing against anyone else' and candidates must work together.",
        "In the written micro exercise, summarise data concisely and state a recommendation.",
      ],
      source: CAP_INDEED,
      confidence: "multiple-candidate-reports",
    },
  ],
  videoInterview: {
    text: "Digital interview on camera with questions specific to your area; demo and mock questions available. Count/time limits not published for apprentices.",
    source: CAP_FAQ,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Half-day: ice-breakers, short presentation on the pathway, group exercise, 1:1 strengths-based interview, Q&A with assessors; Digital & Technology DA also has micro exercises (written, prioritisation).",
    source: CAP_INVENT,
    confidence: "multiple-candidate-reports",
  },
  finalInterview: {
    text: "1:1 strengths-based interview at the assessment centre with questions similar to the digital interview; can cover CV, motivation, teamwork and leadership. Phone feedback offered after the centre.",
    source: CAP_INVENT,
    confidence: "official",
  },
  values: [
    "Honesty",
    "Boldness",
    "Trust",
    "Freedom",
    "Team spirit",
    "Modesty",
    "Fun",
    "Strengths emphasised: love of learning, collaboration, embracing challenges, leadership desire (graduate guidance)",
  ],
  questions: [
    { stage: "Assessment centre", question: "Why do you want to work for Capgemini and why this particular role?", type: "motivation", source: CAP_GD, confidence: "single-report" },
    { stage: "Assessment centre", question: "How will you balance work and study?", type: "situational", competency: "Organisation", source: CAP_GD, confidence: "single-report" },
    { stage: "Assessment centre", question: "What draws you to the IT side of this apprenticeship? What do you expect from it?", type: "motivation", source: CAP_GD, confidence: "single-report" },
    { stage: "Assessment centre", question: "A client asks you a question you are not familiar with - how do you respond?", type: "situational", competency: "Communication", source: CAP_GD, confidence: "single-report" },
    { stage: "Assessment centre", question: "What is your understanding of SAP?", type: "technical", source: CAP_GD, confidence: "single-report" },
    { stage: "Assessment centre", question: "Describe a time you had a complex technical problem and how you solved it.", type: "competency", competency: "Problem solving", source: CAP_GD, confidence: "single-report" },
    { stage: "Digital interview", question: "How do you work with a team without taking over?", type: "competency", competency: "Teamwork", source: CAP_WIKIJOB, confidence: "single-report" },
    { stage: "Digital interview", question: "Tell me about a time something didn't go as planned.", type: "competency", competency: "Resilience", source: CAP_WIKIJOB, confidence: "single-report" },
  ],
  specificAdvice: [
    "The process is strengths-based, not competency-heavy: prepare what you enjoy and are energised by, with real examples, rather than rehearsed STAR scripts (Capgemini's own recruiters say it cannot be 'gamed').",
    "Do the official digital interview demo before recording - it is built for this.",
    "Expect a talent-pool wait after the digital interview; centre places are limited, so maximise that one recording.",
    "At the centre, work collaboratively; ask assessors and mentors questions in the Q&A.",
    "Take the post-centre feedback call if offered - reapply next season with it.",
  ],
  officialLinks: [CAP_FAQ, CAP_APPR, CAP_INVENT, "https://www.capgemini.com/gb-en/wp-content/uploads/sites/5/2025/12/12983_Apprentice-brochure_v9.pdf"],
  lastVerified: "2026-10-03",
  gaps: [
    "No psychometric test is named in the official apprentice process; prep-site claims of SHL/Matrigma tests, an SJT and games relate to graduate/India routes and are excluded.",
    "Digital interview question count and time limits for apprentices.",
    "Several questions come from graduate/degree-apprentice aggregators with no dates; their recency is unknown.",
    "The 2025-26 brochure PDF could not be parsed; entry requirements come from the apprenticeships page and listing summaries.",
    "Micro exercise detail is from an Indeed summary rather than a Capgemini page.",
  ],
};
