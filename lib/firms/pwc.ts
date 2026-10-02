import type { FirmProfile } from "./types";

// Research date 2026-09-30. NOTE: pwc.co.uk returned HTTP 403 to every fetch, so official-page claims below come from
// search-engine excerpts of pwc.co.uk pages (still the official text) and candidate/prep-site reports.
const PWC_SELECTION = "https://www.pwc.co.uk/careers/early-careers/applying/assessment-selection-process.html";
const PWC_FS = "https://www.pwc.co.uk/careers/early-careers/entry-level/flying-start.html";

export const pwc: FirmProfile = {
  slug: "pwc",
  name: "PwC UK",
  sector: "Professional services (Big 4)",
  programmes: [
    {
      name: "Flying Start degree programme (Accounting)",
      level: "Degree apprenticeship-style partnership degree (applied via UCAS; 4 years, paid placements; ACA route)",
      degree: "BSc Accounting (partner universities: Newcastle, Manchester, Nottingham, Reading, Queen Mary London)",
      locations: ["London", "Manchester", "Newcastle", "Reading", "Nottingham"],
    },
    {
      name: "Flying Start degree programme (Business Management, Belfast)",
      level: "Partnership degree with Ulster University Business School",
      degree: "BSc Business Management",
      locations: ["Belfast"],
    },
    {
      name: "Technology degree apprenticeship (Flying Start Tech)",
      level: "Level 6 degree apprenticeship (partner universities reported as Birmingham, Leeds, QUB)",
      degree: "BSc Digital & Technology Solutions (reported)",
      locations: ["Manchester", "Belfast", "other (unverified)"],
    },
    {
      name: "Entry-level school/college leaver programmes (Tax, Audit, Consulting etc.)",
      level: "Level 4-7 apprenticeships / entry-level roles",
    },
  ],
  entry: {
    ucas:
      "Entry-level school leaver programmes: minimum 112 UCAS tariff from up to 3 full A-levels (excl. General Studies) plus GCSE English Language and Maths grade 4/C (PwC, via search excerpt). Flying Start Accounting: each partner university sets its own admission requirements. Requirements may be flexed by up to two grades for lower socio-economic backgrounds.",
    other:
      "Flying Start is applied for through UCAS (each university counts as a UCAS choice) and via PwC's own assessment process. Bursary deadline quoted as 12 March 2027.",
    source: PWC_FS,
  },
  timeline: {
    rolling: true,
    opens: "Flying Start degrees for autumn 2027 are applied for through UCAS (Belfast, London, Manchester, Newcastle, Reading). Example: Reading's Accounting and Business Flying Start uses the UCAS equal-consideration deadline of 13 January 2027; PwC's bursary deadline is 12 March 2027 (PwC, University of Reading and UCAS pages via search summaries).",
    notes:
      "Third-party (single-source, unofficial): school leaver window roughly Sept-Nov for a following-September start, rolling. Flying Start candidates on TSR reported online assessment + video interview Nov-Jan then group/virtual assessment centre around March (2025 cycle). Treat dates as approximate.",
    source: "https://www.apprenticeedge.co.uk/packs/pwc",
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Online form: personal details, education/qualifications, preferred business area where available; some routes add 2-3 motivation questions (why PwC, why this area) per a prep-site report.",
      tips: [
        "Be specific to the service line/programme in any motivation answer.",
        "Complete accurately; predicted grades are checked against actual results.",
      ],
      source: PWC_SELECTION,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessments (immersive job preview and psychometrics)",
      format:
        "Sources conflict, so check your invitation. A search excerpt of PwC's own page lists an immersive job preview (a situational judgement test of about 15 short video questions) and a games-based psychometric assessment. Other reports describe a behavioural questionnaire (natural work preferences, untimed) plus a timed SHL cognitive test covering numerical, inductive and deductive reasoning: a 2025 Flying Start candidate said about 30 minutes in total, one source says allow about 90 minutes and complete within 48 hours, and WikiJob names the games stage Career Unlocked (11 games, at least an hour).",
      provider: "SHL and/or in-house (sources conflict)",
      durationMins: 30,
      passMarkNotes: "Not published. Feedback reportedly takes about 2 weeks (candidate reports, TSR 2025).",
      tips: [
        "Do the SHL practice numerical/inductive/deductive tests under time pressure.",
        "Answer the behavioural questionnaire consistently and honestly; do not try to game it.",
      ],
      source: PWC_SELECTION,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "Video interview",
      format:
        "On-demand recorded video interview on the SHL platform; questions on screen about how you typically approach work at school, university or work experience. Reviewed later by assessors. Format reports conflict: 6 questions with 30s prep and 2 min answers; 10 questions with 2 min prep and 3 min answers (plus case-study questions with 10 min prep); 1.5 min prep and 2 min answers; 3-6 questions with no retakes. PwC's excerpt says you have about a week to complete it after receiving login details.",
      provider: "SHL",
      tips: ["Use STAR with real examples from school, part-time work or clubs.", "Practise speaking to camera for 2-3 minutes."],
      source: PWC_SELECTION,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "Virtual assessment centre",
      format:
        "Virtual immersive assessment centre assessing core skills and attributes (PwC Professional framework). Prep-site/candidate reports: individual case-study/calculation tasks and a group exercise in groups of ~4-6, possibly role-play. Older (pre-2025) school leaver reports describe a ~5 hour day with video interview, Arctic Shores game, group exercise, case study and 45 min 1:1. Length conflicts: one report says about 1h40 with up to 5 other candidates (run November to April), WikiJob says a full day with an in-tray, presentation and 20-minute coaching interview.",
      tips: [
        "In the group task contribute structured points and include quieter members.",
        "Practise reading a short data pack and writing brief recommendations.",
      ],
      source: PWC_SELECTION,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 5,
      name: "Final interview",
      format:
        "In-person interview in your matched office with a senior leader from the business area, per PwC's early careers selection page. Prep-site (single source) says ~45 min competency interview. This stage is not in the five-stage list on PwC's current selection page excerpt, so treat it as unconfirmed for 2026/27.",
      durationMins: 45,
      tips: ["Prepare why PwC, why this line of service and why an apprenticeship/degree-with-work route.", "Bring 5-6 STAR stories mapped to the PwC Professional attributes."],
      source: PWC_SELECTION,
      confidence: "inferred",
    },
  ],
  oa: {
    provider: "SHL and/or in-house; the games-based assessment (Arctic Shores, Career Unlocked in earlier cycles) still appears in PwC's current stage list, so do not assume it was dropped.",
    tests: [
      { name: "Behavioural assessment", format: "Self-report questionnaire of natural work preferences; untimed", notes: "Item count not verified." },
      { name: "Cognitive assessment", format: "Timed numerical, inductive and deductive reasoning", timeMins: 30, notes: "Item counts per test not verified; 30 mins total from one 2025 candidate." },
    ],
    styleNotes:
      "Standard SHL-style multiple choice: numerical interpretation of tables/charts, inductive (pattern/sequence of shapes) and deductive (logical conclusion from statements). Behavioural section is preference-based rather than right/wrong.",
    source: PWC_SELECTION,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "On-demand, recorded via SHL platform; on-screen questions about your typical approach to work/study/experience; assessors review afterwards. Question count and timings conflict across sources and are not confirmed officially.",
    source: PWC_SELECTION,
    confidence: "multiple-candidate-reports",
  },
  assessmentCentre: {
    text: "Virtual immersive assessment centre testing core skills against the PwC Professional framework. Reported components: case study with calculations, group discussion in groups of 4-6 (prep-site), earlier cycles also role-play. Exact 2026 agenda not verified.",
    source: PWC_SELECTION,
    confidence: "multiple-candidate-reports",
  },
  finalInterview: {
    text: "In-person interview with a senior leader from the business area you are matched to, in the matched office. Not confirmed in PwC's current five-stage list.",
    source: PWC_SELECTION,
    confidence: "inferred",
  },
  values: [
    "The PwC Professional: whole leadership",
    "Business acumen",
    "Technical and digital",
    "Global and inclusive",
    "Relationships",
  ],
  questions: [
    {
      stage: "Video interview",
      question: "What would you do when you face a problem?",
      type: "situational",
      source: "https://www.graduatesfirst.com/pwc-interviews",
      confidence: "single-report",
    },
    {
      stage: "Video interview",
      question: "What are your motivations for the role?",
      type: "motivation",
      source: "https://www.graduatesfirst.com/pwc-interviews",
      confidence: "single-report",
    },
    {
      stage: "Virtual assessment centre",
      question:
        "Pick a technology and describe how it has influenced the industries PwC operates in (reported by a 2023 Technology degree apprenticeship candidate; task prompts had long paragraphs with points to include).",
      type: "commercial",
      source: "https://www.thestudentroom.co.uk/showthread.php?t=7315651",
      confidence: "single-report",
    },
    {
      stage: "Virtual assessment centre",
      question: "Common questions reported on teamwork and why you want to work for PwC.",
      type: "motivation",
      source: "https://www.thestudentroom.co.uk/showthread.php?t=7315651",
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "The video interview is on the SHL platform; the online assessments vary by route and cycle (job preview SJT, games, cognitive tests), so read your invitation and practise each style, including SHL's free practice tests and a timed mock video.",
    "Apply early: candidate and vendor reports say popular Flying Start places (London, Manchester) are fought over (one parent report: 50,000 applicants for 11 places at one university), so the OA is a real filter.",
    "Map every example to the five PwC Professional attributes (whole leadership, business acumen, technical/digital, global/inclusive, relationships).",
    "Flying Start is also a UCAS application: you need to meet the university offer as well as pass PwC's process.",
    "Decide before the final interview why the degree-with-work route over a traditional degree; interviewers are senior leaders from your line of service.",
  ],
  officialLinks: [
    PWC_SELECTION,
    PWC_FS,
    "https://www.pwc.co.uk/careers/early-careers/entry-level.html",
    "https://www.pwc.co.uk/careers/early-careers/applying/the-behaviours-we-look-for.html",
    "https://elearn.pwc.co.uk/interview/",
  ],
  lastVerified: "2026-10-02",
  gaps: [
    "pwc.co.uk blocked automated fetches (403) again on 2 Oct 2026: nothing here comes from a direct read of PwC's pages, so fields that were labelled official are now labelled as candidate reports or inferred where sources conflict.",
    "Stage list, video format, assessment length and assessment-centre length all conflict across sources; PwC is the least certain profile.",
    "Number of items and timings for the SHL cognitive tests and behavioural test not verified.",
    "Video interview: question count, prep time and answer length not officially confirmed.",
    "Assessment centre exact activities for 2025-26 not verified; no first-hand 2025-26 write-up obtained (TSR/Reddit/Glassdoor blocked).",
    "Real interview questions are very thin (2023 report only).",
    "Exact 2026/27 opening and closing dates and Tech degree apprenticeship universities/locations not verified.",
  ],
};
