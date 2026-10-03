import type { FirmProfile } from "./types";

const APPS = "https://careers.jaguarlandrover.com/early-careers/apprentices";
const HUB = "https://careers.jaguarlandrover.com/early-careers/employability-hub";
const SAVILLE = "https://www.savilleassessment.com/jaguar-land-rover-preparation-guide/";
const GD_DA = "https://www.glassdoor.co.uk/Interview/JLR-Degree-Apprentice-Interview-Questions-EI_IE374962.0,3_KO4,21.htm";
const GJ = "https://www.graduate-jobs.com/interviews/company/jlr";

export const jlr: FirmProfile = {
  slug: "jlr",
  name: "JLR (Jaguar Land Rover)",
  sector: "Automotive manufacturing",
  programmes: [
    { name: "Digital and Technology Solutions (Software Engineering or Data Analytics)", level: "Level 6", degree: "Degree apprenticeship, 4 years" },
    { name: "Applied Professional Engineering Programme (Product Design, Electrical/Electronic Support, Control Support, Manufacturing)", level: "Level 6", degree: "Degree apprenticeship, 4 years" },
    { name: "Supply Chain and Procurement", level: "Level 6", degree: "Degree apprenticeship, 4 years" },
    { name: "Finance", level: "Level 7" },
    { name: "Advanced apprenticeship (technical fields)", level: "Level 3" },
  ],
  entry: {
    other:
      "Relevant qualifications per vacancy; IB and Scottish Highers accepted as equivalents. No work experience needed. Applicants may apply before 16 but must be 16 by start and confirm grades later. Starting salary listed 26,092 for Level 6/7 (September 2027 start). Exact UCAS/grade requirements sit in each advert and were not retrieved.",
    source: APPS,
  },
  timeline: {
    opens: "February 2027 (2027 intake, September 2027 start)",
    closes: "February or March; JLR may close any programme at short notice depending on volume.",
    notes: "Previous cycle: opened early February 2026. Only one application per cycle. Assessment centre outcome within 2 weeks; verbal offer then written email with a timed acceptance window.",
    source: APPS,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "Online form on motivations and experience; no CV or cover letter (portfolio only for creative design roles).",
      tips: ["Be specific about why JLR and why this programme; the same motivation is tested again at the assessment centre."],
      source: APPS,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online testing",
      format:
        "Three assessments, about an hour in total: Situational Judgement Test (video/scenario based, rate action effectiveness, about 15-20 minutes, untimed per Saville); an aptitude test (timed, cannot pause or go back) and the Match 6.5 personality questionnaire (untimed, about 6.5 minutes, agree/disagree scales with consistency checks). Level 6-7 apprentices sit the Swift Comprehension aptitude; Level 3 sits Swift Apprentice. Passing is based on scores.",
      provider: "Saville Assessment (Swift aptitude, Match 6.5, SJT)",
      durationMins: 60,
      passMarkNotes: "Progression is decided by scores; threshold not published.",
      tips: [
        "Use the practice area first; aptitude cannot be paused once started.",
        "On Match 6.5 use the full scale and answer honestly; consistency is checked.",
        "Read every SJT scenario against the Creators Code (customer love, unity, integrity, growth, impact).",
      ],
      source: HUB,
      confidence: "official",
    },
    {
      order: 3,
      name: "Virtual assessment centre",
      format:
        "Two parts: a 30-minute presentation exercise (topic sent about a week ahead; around 4 slides, about 10 minutes presenting, the rest interviewer questions on the content) and a 45-minute motivational and future-focused scenario interview (why JLR, then scenarios you might face in the role). Preparation guide provided.",
      durationMins: 75,
      tips: [
        "Use stats, facts and credible references in the presentation, as in a university assignment.",
        "Structure interview answers with STARRY (Situation, Task, Actions, Result, Reflection, You).",
        "Research JLR's Reimagine strategy thoroughly.",
      ],
      source: HUB,
      confidence: "official",
    },
    {
      order: 4,
      name: "Offer",
      format: "Outcome shared within 2 weeks; verbal offer confirmed by email with a timed window to accept.",
      tips: ["Ask for feedback if unsuccessful and reapply."],
      source: APPS,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Saville Assessment",
    tests: [
      { name: "Situational Judgement Test", format: "Video/scenario prompts; rate each action from Extremely Ineffective to Extremely Effective.", timeMins: 20, notes: "Official hub: 15-20 minutes; Saville says no time limit." },
      {
        name: "Swift Comprehension Aptitude (Level 6-7)",
        format: "Timed cognitive test that cannot be paused. JLR hub lists possible verbal, numerical, diagrammatic and error-checking modules.",
        notes: "Item counts and timings not published.",
      },
      { name: "Match 6.5 personality", format: "Agree-disagree statements (9-point scale per Saville; hub says 1-10), sometimes most/least like you; untimed, about 6.5 minutes.", timeMins: 7 },
    ],
    styleNotes:
      "Saville-style short timed aptitude items (verbal inference, numerical tables, diagram sequences, error checking) plus a workplace SJT with effectiveness ratings and a personality scale with consistency traps. Write original look-alikes at that scale: one-paragraph verbal statements, small tables, sequence diagrams, and scenarios at a manufacturing or engineering site rated on effectiveness.",
    source: SAVILLE,
    confidence: "official",
  },
  videoInterview: undefined,
  assessmentCentre: {
    text:
      "Virtual. 30-minute presentation (topic given ahead; candidate reports say it was built around one of the four pillars of JLR's Reimagine strategy and how you would solve a problem JLR faces, or your favourite Reimagine area with bullets testing industry knowledge), then the 45-minute motivational/scenario interview.",
    source: HUB,
    confidence: "official",
  },
  finalInterview: {
    text:
      "45-minute motivational fit and future-focused scenario interview in the virtual AC. Candidates report about 30 minutes of questions on the presentation (including how you prepared) and behavioural questions tied to the Creators Code.",
    source: HUB,
    confidence: "official",
  },
  values: ["Customer love", "Unity", "Integrity", "Growth", "Impact"],
  questions: [
    { stage: "Virtual assessment centre", question: "How did you prepare for your presentation? (plus follow-up questions on its content)", type: "other", source: GD_DA, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "What new skills have you developed recently?", type: "competency", competency: "Initiative", source: GD_DA, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "What skills do you think you will develop at JLR?", type: "motivation", source: GD_DA, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "Have you used feedback to develop your skills? (Growth)", type: "competency", source: GD_DA, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "Have you disagreed with a colleague about how to solve a problem? (Integrity)", type: "competency", competency: "Teamwork", source: GD_DA, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "Tell me about a time that you have made a bad decision.", type: "competency", source: GJ, confidence: "single-report" },
    { stage: "Virtual assessment centre", question: "What are the main challenges facing JLR? / How is the automotive industry changing?", type: "commercial", source: GJ, confidence: "single-report" },
  ],
  specificAdvice: [
    "Apply in February 2027 and apply early, since programmes can close at short notice.",
    "Read JLR's Reimagine strategy and Creators Code before the presentation; candidates report the topic links to Reimagine pillars and a JLR problem.",
    "Build a 4-slide deck with figures and sources and rehearse to 10 minutes; you will be questioned for the remaining 20.",
    "Prepare a STARRY example for each Creators Code value; growth and integrity examples are reported.",
    "Know three trends (electrification, Jaguar's pure-electric relaunch, software-defined vehicles) and at least one real JLR challenge.",
  ],
  officialLinks: [APPS, HUB, SAVILLE],
  lastVerified: "2026-10-03",
  gaps: [
    "Aptitude item counts/timings and pass marks are not published by JLR or Saville for apprentice versions.",
    "Specific presentation topics for 2026-27 are not public; the Reimagine pillar topic is a candidate report.",
    "Reported questions come from search summaries of Glassdoor and Student Room (403 to direct fetch); year per question unknown. GJ questions are not DA-specific.",
    "Entry grades per programme not retrieved.",
    "Conflict: Match 6.5 scale described as 9-point (Saville) and 1-10 (JLR hub).",
    "Third-party claim of group panel and skills test stages could not be verified and is excluded. The Student Room assessment-centre thread could not be read.",
  ],
};
