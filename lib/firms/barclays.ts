import type { FirmProfile } from "./types";

// Research date 2026-09-30, updated 2026-10-02 with 2027 roles. Most recent cycle with candidate detail: 2025 entry (applications Oct 2024 - early 2025).
const B_OFFICIAL = "https://search.jobs.barclays/apprentice-application-journey";
const B_PROGS = "https://search.jobs.barclays/apprenticeship-programmes";
const B_VALUES = "https://home.barclays/who-we-are/our-strategy/purpose-and-values/";
const TSR_HIGHER = "https://www.thestudentroom.co.uk/showthread.php?t=7538333";
const TSR_HIGHER_P4 = "https://www.thestudentroom.co.uk/showthread.php?t=7538333&page=4";
const TSR_HIGHER_P5 = "https://www.thestudentroom.co.uk/showthread.php?t=7538333&page=5";
const TSR_2025 = "https://www.thestudentroom.co.uk/showthread.php?t=7552128";
const B_BB_2027 = "https://search.jobs.barclays/job/london/2027-business-banking-degree-apprenticeship-programme-london/13015/100411086720";
const B_CB_2027 = "https://search.jobs.barclays/job/london/uk-corporate-banking-degree-apprenticeship-programme-2027-london/13015/100812856416";

export const barclays: FirmProfile = {
  slug: "barclays",
  name: "Barclays",
  sector: "Banking / financial services",
  programmes: [
    {
      name: "2027 Business Banking Degree Apprenticeship Programme",
      level: "Level 6 degree apprenticeship (2027 start)",
      locations: ["London"],
    },
    {
      name: "UK Corporate Banking Degree Apprenticeship Programme 2027",
      level: "Level 6 degree apprenticeship (2027 start)",
      locations: ["London"],
    },
    {
      name: "UK Corporate Banking Higher Apprenticeship (Level 6, BSc (Hons) Financial Services Management with LIBF per a 2025 applicant)",
      level: "Level 6 degree-level (Barclays labels these 'Higher Apprenticeships'; candidates confirm the higher ones are Level 6)",
      degree: "BSc (Hons) Financial Services Management, London Institute of Banking & Finance (candidate-reported)",
      locations: ["London", "Northampton", "Birmingham (candidate-reported for 2025 corporate banking)"],
    },
    {
      name: "Technology Analyst Higher/Degree Apprenticeship (Level 6)",
      level: "Level 6",
      locations: ["Knutsford", "Glasgow (candidate-reported 2025)"],
    },
    {
      name: "Retail Banking Higher Apprenticeship; Risk; Cyber & Security (others vary by year)",
      level: "Level 4-6 (check each listing)",
      locations: ["Knutsford (retail, candidate-reported)", "London (risk, corporate banking)"],
    },
  ],
  entry: {
    ucas: "Varies by listing. Sources disagree: BCC / 112 UCAS points (BBC) for higher/degree routes; Glasgow listing reported as BBBB Highers. Check the live listing.",
    predictedGrades: "UK Corporate Banking degree apprenticeship (2027): BBB at A level (or equivalent), GCSE Maths grade 6 and English Language grade 4 (Barclays careers page, read through a search summary). Pay: £25,200 from day one for higher and degree apprenticeships (same source).",
    other: "Older guides report GCSE Maths and English grade 4/C. Must have right to work in the UK for the duration (Barclays does not sponsor). Only one application per six-month period (official).",
    source: B_PROGS,
  },
  timeline: {
    opens: "2027 entry: roles are open now. The Business Banking Degree Apprenticeship (London) was posted on 9 September 2026 and the UK Corporate Banking Degree Apprenticeship (London) on 18 September 2026 (Barclays job pages). Other routes are released in waves; in the 2025 cycle Risk and Corporate Banking opened in November.",
    closes: "Rolling; roles close when filled.",
    rolling: true,
    notes:
      "Response times vary: some candidates report hearing back within weeks of the online assessment and others after a couple of months. Applying early tends to move faster. Decision-to-feedback: unsuccessful candidates receive a personalised feedback report (official).",
    source: B_CB_2027,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Register interest then complete an application form (~30 minutes): academic background and work experience, plus CV. Check minimum entry criteria first; keep your login details.",
      durationMins: 30,
      tips: [
        "Apply in the first weeks the role opens: 2025 candidates reported early applicants progressing months before December applicants.",
        "Only one application per six months, so pick the role you want most rather than applying to several.",
        "Education form may ask for GPA-style fields; A-level applicants reported needing to fit them into the form. Enter A-levels as your qualification.",
      ],
      source: B_OFFICIAL,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment",
      format:
        "Official: two short interactive assessments on how you might perform in the workplace and your preferred ways of working, ~60 minutes in total, must be completed within 5 calendar days, doable on phone/tablet, practice tests provided. 2025 candidates report it was an SHL test with personality and numerical questions (see oa).",
      provider: "SHL (candidate-reported; Barclays does not officially name the vendor)",
      durationMins: 60,
      passMarkNotes: "No published cut-off. Candidates report no confirmation email or feedback after completing, then a long wait (up to ~2 months).",
      tips: [
        "Complete the practice tests before starting; the official page stresses this.",
        "Do not use AI tools, transcription bots or meeting assistants: Barclays explicitly bans them.",
        "Do it on a laptop in a quiet room even though mobile is allowed.",
        "Expect silence after submitting. Do not read no email as a rejection.",
      ],
      source: B_OFFICIAL,
      confidence: "official",
    },
    {
      order: 3,
      name: "Interview / assessment centre",
      format:
        "Official page: interview stage includes a motivational interview with leadership and a group activity. Candidate report (corporate banking, 2025): called an assessment centre but was a single ~70 minute Microsoft Teams interview with two interviewers; about 9 behavioural questions plus about 3 'technical' questions (why this role; describe a time you used a particular skill). No group exercise or commercial awareness questions were reported.",
      durationMins: 70,
      passMarkNotes: "Offer is conditional on meeting entry requirements (A-level results). Candidates typically hear back within a few days.",
      tips: [
        "Prepare 8-10 STAR stories covering teamwork, communication, problem solving, resilience and initiative.",
        "Be ready to answer 'why this role' in detail (corporate banking, retail, technology), not just 'why Barclays'.",
        "Stay concise: one candidate spoke a lot and still finished in just over 60 of 70 minutes with 12 questions.",
        "Tie examples to RISES values: Respect, Integrity, Service, Excellence, Stewardship.",
      ],
      source: TSR_HIGHER_P5,
      confidence: "single-report",
    },
    {
      order: 4,
      name: "Offer or feedback",
      format: "Successful candidates go to onboarding and pre-employment checks; unsuccessful candidates receive a personalised feedback report. Can reapply after six months.",
      tips: ["If unsuccessful, use the feedback report and reapply after six months."],
      source: B_OFFICIAL,
      confidence: "official",
    },
  ],
  oa: {
    provider: "SHL (candidate-reported for 2025; vendor not officially named by Barclays)",
    tests: [
      {
        name: "Interactive numerical reasoning (SHL-style)",
        format: "Timed numerical reasoning; a 2025 applicant pointed others to SHL interactive numerical practice",
        notes: "Item count and timing not verified for Barclays DA.",
      },
      {
        name: "Personality / working-style questionnaire",
        format: "Preference-based statements about how you like to work",
        notes: "Matches official wording: 'preferred ways of working'.",
      },
    ],
    styleNotes:
      "Two interactive assessments totalling ~60 minutes (official), completed within 5 calendar days. 2025 applicants described SHL with personality and numerical content only (no verbal, no video), and called the numerical hard. Practice SHL-style interactive numerical (tables, percentages, ratios) and preference-based personality questionnaires. Third-party prep sites claim Situational Judgement and verbal/logical tests as well, but that is not confirmed for the DA route.",
    source: TSR_HIGHER,
    confidence: "single-report",
  },
  assessmentCentre: {
    text: "Official: interview with leadership plus a group activity. 2025 corporate banking candidate reported only a ~70 minute Teams interview with two interviewers and no group exercise. Format may differ by role, so prepare for both.",
    source: TSR_HIGHER_P5,
    confidence: "single-report",
  },
  finalInterview: {
    text: "Motivational interview with a leadership team member (official). Reported: ~70 minutes max, two interviewers, mostly behavioural ('tell me about a time you worked as a team / used communication'), then 3 role questions.",
    source: TSR_HIGHER_P5,
    confidence: "single-report",
  },
  values: [
    "Respect: harness inclusion, trust colleagues, value everyone's contribution",
    "Integrity: honesty, courage, transparency and fairness",
    "Service: act with empathy and humility, put customers at the centre",
    "Excellence: set high standards, champion innovation",
    "Stewardship: leave things better than you found them",
  ],
  pay: { text: "£25,200 from day one (Barclays apprenticeship-programmes page; check the degree role's own advert).", source: B_PROGS, confidence: "official" },
  dayToDay: [
    "Business and Corporate Banking apprentices support relationship managers who look after company clients: researching businesses, preparing lending and account information, and helping clients with payments and borrowing.",
  ],
  whyThisFirm: [
    { text: "Barclays UK Corporate Bank's first-half 2026 profit before tax rose 30% to £566 million, and its UK corporate lending grew 12% year on year.", source: "https://home.barclays/content/dam/home-barclays/documents/investor-relations/ResultAnnouncements/H12026Results/Q226-BPLC-Results-RA.pdf", confidence: "official" },
  ],
  questions: [
    {
      stage: "Interview / assessment centre",
      question: "Tell me about a time you worked as part of a team.",
      type: "competency",
      competency: "Teamwork",
      source: TSR_HIGHER_P5,
      confidence: "single-report",
    },
    {
      stage: "Interview / assessment centre",
      question: "Tell me about a time you used communication skills.",
      type: "competency",
      competency: "Communication",
      source: TSR_HIGHER_P5,
      confidence: "single-report",
    },
    {
      stage: "Interview / assessment centre",
      question: "Why this role (for example corporate banking)? Note: the candidate was not asked 'why Barclays'.",
      type: "motivation",
      source: TSR_HIGHER_P5,
      confidence: "single-report",
    },
    {
      stage: "Interview / assessment centre",
      question: "Describe a specific time you used a technical or analytical skill (the 'technical' questions were behavioural in style, not product/market knowledge).",
      type: "competency",
      competency: "Problem solving",
      source: TSR_HIGHER_P5,
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "Apply as soon as a role opens: 2027 roles started appearing in September 2026. The 2025 cycle moved earlier applicants forward first and December applicants reported weeks of silence.",
    "Treat the SHL-style numerical as the main filter: practise timed interactive numerical tests, because candidates called it hard and Barclays gives no feedback.",
    "Expect a long gap (up to ~2 months) between the online assessment and the interview invite; keep applying elsewhere.",
    "Prepare both for a 70-minute two-interviewer competency interview and for a group activity, since the official page lists both.",
    "Map every STAR story to a RISES value and a competency; ~9 behavioural questions is a lot, so you need 8-10 distinct examples.",
    "Know the degree awarded: corporate banking applicants report a BSc Financial Services Management with LIBF; Barclays 'higher apprenticeships' are Level 6.",
    "No AI tools in any assessment or interview stage; Barclays says this explicitly.",
  ],
  officialLinks: [B_OFFICIAL, B_PROGS, B_BB_2027, B_CB_2027, B_VALUES],
  lastVerified: "2026-10-02",
  gaps: [
    "Re-checked 2 Oct 2026: Barclays' apprentice journey lists no video interview stage. Third-party descriptions of a HireVue interview (5-7 questions) and 60-90 min of numerical, verbal, logical and personality tests describe the graduate route and are not applied here.",
    "Barclays says using third-party AI tools in an assessment or interview ends the interview and withdraws the application (official).",
    "The apprenticeship-programmes page describes Level 3/4 roles (5 GCSEs, salary £25,200); degree and higher routes may have different requirements.",
    "Exact test vendor and item counts for the 2025/2026 DA online assessments (SHL is candidate-reported only; Barclays does not name it).",
    "Whether a video interview or group exercise is part of the DA route; official page mentions a group activity but the only 2025 candidate report of the final stage described an interview only.",
    "Official UCAS/A-level entry requirements per role (sources conflict: BCC, BBB, 112 points).",
    "Opening dates for 2027 routes other than Business Banking and UK Corporate Banking (London); the two 2027 role pages were seen only through search summaries.",
    "Glassdoor, Reddit and Rate My Apprenticeship pages could not be read (blocked or no relevant posts); no verbatim question lists beyond those cited.",
    "Barclays apprentice government survey stage mentioned in a search snippet but not verified.",
  ],
};
