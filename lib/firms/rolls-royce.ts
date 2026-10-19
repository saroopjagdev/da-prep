import type { FirmProfile } from "./types";

// NOTE: this is Rolls-Royce plc (aerospace / power systems / defence), NOT Rolls-Royce Motor Cars (BMW Group, Goodwood).
// The Motor Cars process (pre-recorded apprentice video interview, practical test) is different and is excluded.

const AC_GUIDE_2026 =
  "https://careers.rolls-royce.com/~/media/Files/R/rolls-royce-careers-v3/Rolls-Royce%20UK%20Apprenticeship%20Assessment%20Centre%20Preparation%20Guide%202026.pdf";
const OA_HELP =
  "https://careers.rolls-royce.com/~/media/Files/R/Rolls-Royce-Careers/documents/help-and-tip-online-assessments.pdf";
const APP_GUIDE =
  "https://careers.rolls-royce.com/~/media/Files/R/Rolls-Royce-Careers-V2/early-careers-2024-application-preparation-guide-v01.pdf";
const TJ_APP = "https://targetjobs.co.uk/careers-advice/cvs-applications-and-tests/how-impress-rolls-royce-recruiters-your-online-application";

export const rollsRoyce: FirmProfile = {
  slug: "rolls-royce",
  name: "Rolls-Royce (plc)",
  sector: "Aerospace, power systems and defence engineering",
  programmes: [
    {
      name: "Degree apprenticeships (Engineering skills family)",
      level: "Level 6",
      degree:
        "Electrical and Electronics, Engineering, Manufacturing Engineering, Materials Engineering, Non-Destructive Testing (NDT) Engineering, Nuclear Engineering, Software Engineering (2026 AC guide list). The 2024 guide also listed Digital and Technology Solutions and Quality Engineering Management.",
    },
    {
      name: "Degree apprenticeships (Business skills family)",
      level: "Level 6",
      degree:
        "Finance Professional, Nuclear Business Management, Project Management, Supply Chain Management, Enterprise Business Management, Digital and Technology Solutions (2026 AC guide list). The 2024 guide also listed Operational Excellence Business Management.",
    },
    { name: "Higher apprenticeship: Nuclear Engineering Technician", level: "Level 4/5" },
    { name: "Level 3 apprenticeships (engineering, nuclear NDT technician)", level: "Level 3" },
  ],
  entry: {
    other:
      "Engineering degree apprenticeship (from a search excerpt of Rolls-Royce's 'what you need' page, so check the live advert): five GCSEs at grade 4/C or above including English Language, Maths and Science, plus 112 UCAS points from three A-levels at BBC including Maths and one of a specified list of subjects; alternatives are an engineering BTEC Extended Diploma with a Merit in further maths, or a T Level at Merit plus A-level Maths at C. Starting salary quoted as £21,776. Requirements are set per vacancy. Rolls-Royce says the online application has no CV and three ~300-word essay questions (see Online application stage).",
    source: AC_GUIDE_2026,
  },
  timeline: {
    notes:
      "Official 2021-22 OA help doc: early-careers recruitment cycle is roughly Oct-July and online assessments must be completed within a set window of the invitation (7 days in the 2021-22 doc; a later reported version says 10 days). Reported 2025 candidate timings: an AC on 11 Feb with an offer on 27 Feb; some candidates called ~7 days before their AC; waits between stages from days to ~3 months (Student Room/Reddit summaries). Open/close dates for 2027 intake not verified.",
    rolling: true,
    source: OA_HELP,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Account/profile plus application form (education, work experience) followed by three essay-style questions of roughly 300 words each: (1) Why do you want to start a career with us? (2) Share an example of something you have been learning outside formal studies. (3) What are two topical issues for Rolls-Royce to focus on and why? (TargetJobs guide; wording reflects the guide version it was written from.)",
      tips: [
        "Use CAR (Context, Action, Result) rather than full STAR to save words, and tie each example back to Rolls-Royce explicitly.",
        "Research civil aerospace, defence and power systems divisions, recent programmes and environmental initiatives; avoid generic phrases such as 'quality engineering solutions' and do not refer to the luxury car brand.",
        "Choose two topical issues you can defend at interview: the AC interview asks you to name a social, technological, economic or environmental trend affecting how engineers work, and the guide says this is a deliberate repeat of the application question.",
      ],
      source: TJ_APP,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 2,
      name: "Online assessment",
      format:
        "Aon-hosted assessments sent after the application. Every candidate does a situational judgement exercise (chatAssess SJE) and a personality/work-style questionnaire (Measurement of Competencies, untimed); role-specific reasoning tests (numerical, verbal, logical or mechanical depending on programme) are also set. Each test must be completed in one go but they can be taken on different occasions. Results are scored automatically against a minimum pass mark; below it the application is rejected automatically and there is no practice advantage from third-party sites (per the official doc).",
      provider: "Aon (cut-e); CEB SHL reported for some roles",
      durationMins: 45,
      passMarkNotes:
        "Official doc: automated minimum pass mark, verified each year against Rolls-Royce plc norm groups and Aon general-population norms. Candidates can reapply next year or apply elsewhere in Rolls-Royce if below the mark. One attempt per recruitment cycle.",
      tips: [
        "Take the test in a quiet place on a stable desktop browser; a blocked test (padlock) needs an email to the Aon support address in the official doc.",
        "Do not close the browser mid-test: the official doc says results may not be stored and the application may be rejected.",
        "Answer the SJE and personality questionnaire against the four Rolls-Royce behaviours (Put safety first, Do the right thing, Keep it simple, Make a difference), with safety as the foundation.",
        "Request adjustments (e.g. 25% extra time) before starting, not after.",
      ],
      source: OA_HELP,
      confidence: "official",
    },
    {
      order: 3,
      name: "Assessment centre",
      format:
        "Half-day session. Per the 2026 guide, degree and higher apprentices and Level 3 candidates attend in person at a Rolls-Royce site; graduate and internship candidates attend virtually. Confirm in your invitation. Activities in order: (1) interview (questions published in the guide), (2) 7-minute prepared presentation with short Q&A, (3) technical exercise responding to a case study given on the day (degree/higher apprentices). Level 3 gets a practical activity to test how well you learn and follow instructions instead. Assessors rate each behaviour 1-6 against published positive/negative indicators (e.g. problem solving: analyses and interprets data from multiple sources; communication: uses simple language to ensure common understanding).",
      tips: [
        "Read the official AC guide end to end: Rolls-Royce publishes the exact interview questions and the rating scale.",
        "Practise the 7-minute presentation aloud against a timer; candidates report Rolls-Royce is strict on timing. No projectors or screens in person: bring handouts, notes or props.",
        "For the technical case study, narrate your reasoning, use data from several sources, and keep language simple for a non-specialist.",
        "Bring your own questions for assessors: the guide says the day is two-way.",
      ],
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      order: 4,
      name: "Offer and feedback",
      format:
        "Decision after the AC. Candidate reports say offers can come within ~2 weeks (AC 11 Feb, offer 27 Feb); Rolls-Royce offers a weekly drop-in for AC prep per a candidate summary.",
      tips: ["Ask for feedback if unsuccessful; the firm says all applicants receive detailed feedback (Motor Cars release) and re-application is allowed in later years for plc."],
      source: "https://www.thestudentroom.co.uk/showthread.php?t=7559171&page=4",
      confidence: "single-report",
    },
  ],
  oa: {
    provider: "Aon (cut-e), with CEB/SHL reported for some roles",
    tests: [
      {
        name: "Situational Judgement Exercise (chatAssess)",
        format: "Chat-style workplace scenarios where you choose the best action; aligned to Rolls-Royce values (trusted to deliver excellence, act with integrity, operate safely).",
        timeMins: 15,
        notes: "Up to 15 minutes per a later official-doc version summary; item count not published.",
      },
      {
        name: "Measurement of Competencies (personality/work style)",
        format: "Select the statement that best fits your approach; untimed.",
        notes: "Completed in one sitting once started.",
      },
      {
        name: "Logical reasoning (role-specific)",
        format: "Timed; official 2021-22 doc says 6 minutes total and the test ends automatically when time is up.",
        timeMins: 6,
      },
      {
        name: "Verbal reasoning (role-specific)",
        format: "True / False / Cannot Tell style reading comprehension.",
        timeMins: 6,
        notes: "6 min per a later version summary; item count not published.",
      },
      {
        name: "Numerical reasoning (role-specific)",
        format: "Interpret numerical data, multiple choice.",
        timeMins: 6,
        notes: "6 min per a later version summary; mechanical reasoning may be used for technical roles.",
      },
    ],
    styleNotes:
      "Short, tightly timed cut-e style tests (around 6 minutes each) where speed matters; one SJE built as a chat scenario. Overall sitting 30-45 minutes. Write original look-alikes: short passages with True/False/Cannot Tell statements, compact tables/charts with 1-2 step percentage or ratio questions, and chat-style workplace dilemmas with best/worst action choices, all tagged to safety, integrity and simplicity.",
    source: OA_HELP,
    confidence: "official",
  },
  videoInterview: undefined,
  assessmentCentre: {
    text:
      "Half-day, in person for degree and higher apprentices (2026 guide): interview, 7-minute presentation (explain a complex technical concept to a non-specialist senior colleague from another discipline, say why it matters to Rolls-Royce, and what you learned/skills developed; a technical topic for engineering, any subject for business), then a technical case-study exercise. Short Q&A on the presentation. Previous candidates used topics from sustainable aviation fuel and nuclear to a Rubik's cube walkthrough and the economics of a concert tour. One candidate report says there was no group task at their AC, so a group exercise is not guaranteed.",
    source: AC_GUIDE_2026,
    confidence: "official",
  },
  finalInterview: {
    text:
      "The AC interview is the final interview. Motivation, self-management, learning agility, collaboration and safety questions, each tied to a behaviour. The guide says the interviewer may not ask all questions or in this order.",
    source: AC_GUIDE_2026,
    confidence: "official",
  },
  values: [
    "Put safety first",
    "Do the right thing",
    "Keep it simple",
    "Make a difference",
    "Older framing in OA materials: Trusted to deliver excellence, Act with integrity, Operate safely",
  ],
  questions: [
    {
      stage: "Assessment centre",
      question: "Tell me a bit about yourself and your interests.",
      type: "motivation",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question: "What are you personally hoping to gain from this emerging talent programme?",
      type: "motivation",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question:
        "The engineering industry is ever changing due to significant trends and topics shaping its future. Tell me about one social, technological, economic or environmental issue or trend that you think will have an impact on the way we work.",
      type: "commercial",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question:
        "On this programme you'll be given tasks or projects where you need to provide recommendations or ideas but may have limited time for researching/planning. How do you feel about that and what would you do to make sure you still delivered results?",
      type: "situational",
      competency: "Organisation",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question:
        "This emerging talent programme is learning-focused, with lots to learn about our business areas. How do you feel about that and what will you do to make sure you learn what you need to?",
      type: "situational",
      competency: "Initiative",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question:
        "You will frequently collaborate with colleagues within your team and across the business. What will you do to build new relationships and become an important member of the team?",
      type: "situational",
      competency: "Teamwork",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Assessment centre",
      question:
        "Imagine you observed someone displaying negative attitudes, actions or behaviours towards others or established Rolls-Royce processes or procedures. What would you do in response?",
      type: "situational",
      competency: "Leadership",
      source: AC_GUIDE_2026,
      confidence: "official",
    },
    {
      stage: "Online application",
      question: "Why do you want to start a career with us? / Share an example of something you've been learning outside formal studies. / What are two topical issues for Rolls-Royce to focus on and why?",
      type: "motivation",
      source: APP_GUIDE,
      confidence: "multiple-candidate-reports",
    },
  ],
  specificAdvice: [
    "The interview questions are published: write a 60-90 second answer to each of the seven degree-apprentice questions in the 2026 AC guide, each anchored to one of the four behaviours, and rehearse them out loud.",
    "Build the 7-minute presentation around a project you actually did (code, a build, a CAD design, a volunteering project) rather than a textbook topic: the guide explicitly says it should not be a summary of a theoretical module. Finish with 'why this matters to Rolls-Royce' (engines, nuclear, SAF, digital twins, etc.).",
    "Rolls-Royce rates each behaviour 1-6 using published indicators. During the technical exercise, say aloud how you use data from more than one source, reach a conclusion, and explain it in plain language; that maps to the problem solving and Keep it simple indicators.",
    "Safety is the foundation: for any workplace scenario (SJE or interview), lead with speaking up and following process before productivity.",
    "Do not apply to plc with Motor Cars material: the Goodwood luxury-car process and tips do not transfer.",
    "Be careful with the OA: it auto-rejects below a pass mark. Practise timed verbal/numerical at very short time limits (about 6 min per test) and do not leave your browser.",
  ],
  officialLinks: [
    AC_GUIDE_2026,
    OA_HELP,
    APP_GUIDE,
    "https://careers.rolls-royce.com/en/students-and-graduates/united-kingdom/apprenticeships-and-school-leavers",
  ],
  lastVerified: "2026-10-02",
  gaps: [
    "Current (2026-27) OA test lengths/item counts: official doc is the 2021-22 cycle; later timings (SJE 15 min, verbal/numerical 6 min) are from a search summary of a newer version of the same doc and were not read directly.",
    "Whether a video interview exists for Rolls-Royce plc degree apprentices: a pre-recorded apprentice video interview is documented only for Rolls-Royce Motor Cars (BMW Group), not plc, and is not included here.",
    "Entry requirements (UCAS points/grades) and 2027 open/close dates for plc degree apprenticeships.",
    "Student Room / Reddit threads for 2025-26 returned 403 to direct fetch, so candidate timings come from search-result summaries only; no verbatim candidate questions beyond the firm's own published questions.",
    "Technical case-study content is deliberately undisclosed by the firm until the day.",
  ],
};
