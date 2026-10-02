import type { FirmProfile } from "./types";

const UK_PAGE = "https://www.airbus.com/en/careers/students-and-graduates/apprentices/apprenticeships-in-the-united-kingdom";
const ENTRY_PDF = "https://www.airbus.com/sites/g/files/jlcbta136/files/2024-01/degree_level_apprenticeships_entry_requirements.pdf";
const GD_DA = "https://www.glassdoor.co.uk/Interview/Airbus-Engineering-Degree-Apprenticeship-Interview-Questions-EI_IE3059.0,6_KO7,40.htm";
const VALUES = "https://www.airbus.com/en/careers/our-values";

export const airbus: FirmProfile = {
  slug: "airbus",
  name: "Airbus (UK)",
  sector: "Aerospace and defence",
  programmes: [
    { name: "Engineering Degree Apprenticeship", level: "Level 6", degree: "BEng (Hons) Aeronautical and Manufacturing Engineering (2024 entry doc)", locations: ["Broughton (Chester)"] },
    { name: "Aerospace Engineering Degree Apprenticeship", level: "Level 6", degree: "BEng (Hons) Aerospace Engineering, after a 9-month vocational foundation diploma", locations: ["Filton (Bristol)"] },
    { name: "Electro-Mechanical Engineering Degree Apprenticeship", level: "Level 6", degree: "BEng (Hons) Electromechanical Engineering", locations: ["Filton (Bristol)"] },
    { name: "Digital and Technology Solutions Degree Apprenticeship", level: "Level 6", degree: "BSc (Hons) Digital and Technology Solutions (data analytics / software / flight physics strands)", locations: ["Broughton", "Filton"] },
    { name: "Business Degree Apprenticeship (Applied Business Management)", level: "Level 6", degree: "BSc (Hons) Applied Business Management", locations: ["Broughton"] },
    { name: "Procurement & Supply Chain / Supply Chain Operations / Quality Engineering degree apprenticeships", level: "Level 6", locations: ["Filton"] },
    { name: "Cyber Security, Software Engineering, Project Management, Simulation & Modelling, Test Systems degree apprenticeships (Defence & Space)", level: "Level 6", locations: ["Newport", "Portsmouth", "Newcastle", "Stevenage"] },
  ],
  entry: {
    ucas:
      "Varies by programme (2024-entry PDF): Engineering 112 UCAS points incl. Maths B and Physics/Chemistry C; Aerospace/Electro-mechanical 104 points with Maths B; Business three A-levels at B incl. Business/Economics; DTS 3 A-levels at C or above (MMM BTEC); Software 96 points; Project Management 120 points (BBB).",
    other:
      "Airbus UK page (2026 cycle): degree apprenticeships need A-levels/BTEC or equivalents; put predicted grades on the application and any offer is conditional. Minimum GCSE Maths and English (grade 4 to 5 depending on programme). UK apprenticeship levy eligibility required; no visa sponsorship. The entry PDF is for September 2024 entry so check the live advert for 2027.",
    source: ENTRY_PDF,
  },
  timeline: {
    opens: "5 October 2026 (2027 apprenticeships)",
    closes:
      "Guidance: digital, business, engineering, project management and procurement degree apprenticeships likely to close before 26 October 2026; supply chain, customer services, facilities and quality engineering degree apprenticeships before 4 January 2027. Adverts can close early once enough applications arrive.",
    notes:
      "Assessment centres and skills days expected between end of January and March 2027. Previous cycle (2026 entry): Digital & Technology Solutions closed 3 Dec 2025, Business closed 29 Jan 2026 (Prosple listings). Candidate reports from 2025/26 describe moving to the assessment phase in Dec-Jan and waiting ~a month.",
    source: UK_PAGE,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Online form on the Airbus careers site telling them about your skills and motivation. You may apply to only one programme per recommended approach. AI tools can be used for research but the formal assessment stages must be completed without real-time AI help (Airbus policy).",
      tips: [
        "Apply in October: popular degree apprenticeship adverts can close before 26 October.",
        "Include predicted grades; offers are conditional on them.",
      ],
      source: UK_PAGE,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment (Arctic Shores)",
      format:
        "Game-style behavioural assessment sent usually within 3 working days of applying; you have 3 days to complete it. Airbus says you 'may be invited' to an online assessment and then a virtual or in-person interview/assessment day.",
      provider: "Arctic Shores",
      tips: [
        "Complete it in one calm sitting on a laptop with a mouse or trackpad, in the first 24-48 hours.",
        "These are not right/wrong tests: consistency and pacing across tasks matter, so do not try to 'game' a pattern.",
      ],
      source: UK_PAGE,
      confidence: "official",
    },
    {
      order: 3,
      name: "Assessment centre",
      format:
        "Reported 2025 degree-apprenticeship format: virtual (Teams) or in-person day of roughly 4-5.5 hours: ice-breaker, group exercise with current apprentices/engineers (pitching a new product/design), prepared or on-the-day presentation, and a competency-plus-technical interview with senior staff. Candidates report no separate interview stage before the AC for degree apprenticeships.",
      durationMins: 330,
      tips: [
        "Airbus core values are scored in the group task as well as the interview: collaborate, do not dominate.",
        "Prepare a short presentation format that works on a screen-share if the AC is virtual.",
      ],
      source: GD_DA,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "Offer",
      format: "Offers reported from roughly March-April for Feb-March assessment centres (Airbus recruitment timeline: application, assessment centre Feb-Mar, offer Mar-Apr).",
      tips: ["Offers are conditional on predicted grades being achieved."],
      source: ENTRY_PDF,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Arctic Shores (official); Cut-e/Aon reported for other Airbus schemes",
    tests: [
      {
        name: "Arctic Shores game-based behavioural assessment",
        format: "Series of short interactive tasks (reaction, risk/reward, emotion recognition, memory, planning) sent by link; completed within 3 days.",
        notes: "Exact number of games and total time for the apprentice version is not published; third-party sites describe ~9-10 mini-games including an emotions task of about 3 minutes.",
      },
    ],
    styleNotes:
      "Personality and cognitive-style game tasks rather than question banks. Write original look-alikes as short timed tasks: identify an emotion from a face, make quick risk/reward choices, sequence or remember patterns, and choose between cautious and fast actions. Scores are profile-based, so do not present answers as right/wrong.",
    source: UK_PAGE,
    confidence: "official",
  },
  videoInterview: undefined,
  assessmentCentre: {
    text:
      "Reported degree-apprenticeship ACs (2025): group design/pitch task on a new product before engineers with HR observing; 10-25 minute presentation on something new and innovative for aircraft (mechanical engineering candidate) or a prepared presentation; interview with 4 behavioural questions and one technical question. A virtual day is reported as running from about 8 am to noon with an ice-breaker, a short group activity with current apprentices, then the interview. Forum users also ask about a 'group aviation activity' at Broughton and Filton.",
    source: GD_DA,
    confidence: "single-report",
  },
  finalInterview: {
    text:
      "Competency-based interview plus technical question at the AC, with senior staff; includes questions on Airbus and the apprenticeship and on values fit.",
    source: GD_DA,
    confidence: "single-report",
  },
  values: [
    "Customer focus",
    "Integrity",
    "Respect",
    "Creativity",
    "Reliability",
    "Teamwork",
  ],
  questions: [
    {
      stage: "Assessment centre",
      question: "Presentation: something new and innovative for use in aircraft (25 minutes prep), followed by four behavioural questions and one technical question.",
      type: "technical",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Assessment centre",
      question: "Group task: design a new product and pitch it to a group of engineers; be questioned on your decisions and how you operated as a group.",
      type: "group-exercise",
      competency: "Teamwork",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Assessment centre",
      question: "What do you know about Airbus and the apprenticeship?",
      type: "motivation",
      source: "https://www.graduatesfirst.com/airbus-group-job-tests",
      confidence: "inferred",
    },
    {
      stage: "Assessment centre",
      question: "Can you recall a time when you had to deal with a difficult deadline and how you overcame it?",
      type: "competency",
      competency: "Organisation",
      source: "https://www.graduatesfirst.com/airbus-group-job-tests",
      confidence: "inferred",
    },
    {
      stage: "Assessment centre",
      question: "Where do you see yourself in 5 years?",
      type: "motivation",
      source: "https://www.graduatesfirst.com/airbus-group-job-tests",
      confidence: "inferred",
    },
  ],
  specificAdvice: [
    "Apply in the first week after the 5 October opening: degree apprenticeships can close before 26 October.",
    "Treat Arctic Shores as a behaviour profile: stay consistent, don't rush, and do it on a laptop the day it arrives (3-day window).",
    "Prepare a two-minute explanation of why Airbus and why that specific site/programme (Broughton wings, Filton wings/landing gear, Newport cyber); interviews reportedly ask what you know about Airbus and the apprenticeship.",
    "For the group task, practise taking a role (timekeeper, summariser, challenger) and explicitly invite quieter members in; Airbus values Teamwork and Respect.",
    "Have one technical idea ready for an 'innovation in aircraft' presentation (for example hydrogen, wing design, or automation in manufacturing) and know its trade-offs.",
    "Airbus scores on the six values: prepare one STAR example each for Customer focus, Reliability, Integrity, Respect, Creativity and Teamwork.",
  ],
  officialLinks: [UK_PAGE, ENTRY_PDF, VALUES, "https://www.airbus.com/en/careers/students-and-graduates/apprentices"],
  lastVerified: "2026-09-30",
  gaps: [
    "Airbus UK page confirms Arctic Shores plus a virtual or in-person interview/assessment day but does not publish AC activities; AC detail comes from Glassdoor/Student Room search summaries (full pages returned 403) and is single-report.",
    "Whether UK degree apprenticeships include a HireVue video interview: a third-party guide describes one for other Airbus schemes, but TSR/Glassdoor reports say degree apprenticeships go straight to the AC. Not verified, so left out.",
    "The three sample questions under 'inferred' come from a commercial prep site and may not be candidate-reported.",
    "Entry requirements are from the September 2024 entry PDF (Oct 2023 document); 2027 requirements not retrieved.",
    "Arctic Shores game count/duration for the apprentice variant is unpublished.",
    "The Student Room's 2025 and 2026 Airbus threads could not be read directly.",
  ],
};
