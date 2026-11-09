import type { FirmProfile } from "./types";

const CISCO_SEARCH = "https://uk.indeed.com/q-cisco-apprentice-jobs.html";
const CISCO_TSR = "https://www.thestudentroom.co.uk/showthread.php?t=7655783";
const CISCO_DEGREE = "https://uk.indeed.com/Degree-Apprenticeship-Cisco-jobs";

export const cisco: FirmProfile = {
  slug: "cisco",
  name: "Cisco UK",
  sector: "Technology / networking",
  programmes: [
    {
      name: "Cisco Degree Apprenticeship (rotational, 4 years). Cisco's page confirms a four-year degree apprenticeship with a major business project, mentors and a support network. Separate Customer Experience and Sales intakes are suggested by job-posting titles (search summary). Year 1 is reported as an induction boot camp plus three 3-month rotations (single report).",
      level: "Level 6",
      degree: "BSc (Hons) Digital and Technology Solutions OR a Professional Management degree (Cisco's page says BSc; one search summary of a Sales posting says BA (Hons): unresolved, check the live advert)",
      locations: ["Greater London (Bedfont Lakes, Feltham)", "Manchester"],
    },
  ],
  entry: {
    ucas: "104 UCAS points (BCC at A level or DMM BTEC) per 2026-cycle listing summary",
    predictedGrades: "7 GCSEs 9-4 including English and Maths",
    other:
      "No prior Level 6+ qualification; right to work in UK; lived in UK/EEA 3+ years; ready to start full-time from Sept 2026. Older 2024 listing said 90 UCAS points - requirements changed between cycles.",
    source: CISCO_SEARCH,
  },
  timeline: {
    opens: "Registration of interest page kept open; recruitment cycle reported to start in January",
    closes: "2025 cycle deadline reported as 26 Feb 2025 (forum/summary)",
    rolling: false,
    notes:
      "2026 cycle: sift, then eligibility and skills check run by training provider Velocity, scheduled mid-July to mid-August 2026 (per search summary of Cisco posting), so the 2026 process ran late in the year. Applications for Sept 2027 intake typically appear Sept-Nov 2026 across employers generally.",
    source: CISCO_SEARCH,
  },
  stages: [
    {
      order: 1,
      name: "Online application and sift",
      format:
        "Personal details, employment history and a personal statement. A sift panel assesses employment history and personal statement against essential criteria; a pass mark applies.",
      tips: [
        "Write the personal statement against the essential criteria in the advert - it is scored, not skim-read.",
        "Mention Cisco products, customers and how Cisco competes; a current apprentice's only advice was 'build a knowledge of what Cisco do and also how we compete'.",
      ],
      source: CISCO_SEARCH,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 2,
      name: "Eligibility and skills check (Velocity)",
      format:
        "Candidates passing the sift are passed to training provider Velocity, which emails them and checks qualifications, eligibility, functional skills (if required) and a skills scan.",
      provider: "Velocity",
      tips: ["Have certificates and ID to hand; respond to Velocity emails quickly."],
      source: CISCO_SEARCH,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "HireVue video interview",
      format: "If shortlisted, invite to record answers to a few questions on HireVue (question count and timings not published).",
      provider: "HireVue",
      tips: ["Prepare 4-5 STAR stories and a two-line answer on why Cisco and why an apprenticeship."],
      source: CISCO_DEGREE,
      confidence: "single-report",
    },
    {
      order: 4,
      name: "Assessment centre",
      format:
        "Final stage where candidates meet managers and current apprentices; forum posts mention mandatory events at the office. Reported activities (search summaries of a Cisco blog and a candidate blog, not read directly, single report): a presentation, a role play or group activity, and a hiring-manager interview; another account lists a management interview, a group exercise, a presentation on a topic of your choice and a technical interview. Cisco supplies preparation material beforehand. One candidate describes the day as relaxed. Glassdoor summaries mention a skills test, an IQ test and a personality test: unconfirmed.",
      tips: ["Ask current apprentices real questions - the day doubles as an introduction to the team."],
      source: CISCO_TSR,
      confidence: "single-report",
    },
  ],
  videoInterview: {
    text: "HireVue one-way video after shortlisting; 'a few questions'. Exact count, prep and answer time not verified.",
    source: CISCO_DEGREE,
    confidence: "single-report",
  },
  assessmentCentre: {
    text: "Held at Cisco's London office; meet managers and current apprentices. Specific exercises not verified.",
    source: CISCO_DEGREE,
    confidence: "single-report",
  },
  values: [
    "Cisco's programme pages stress exploring roles, a major business project and strong support network (mentors, managers, peer apprentices)",
    "Behaviour framework used in assessment not verified (a 'Communicating and Influencing / Delivering at Pace / Developing Self and Others' list surfaced in search but could not be attributed to Cisco)",
  ],
  questions: [],
  specificAdvice: [
    "Cisco's programme is a rotation: explain which areas (tech vs customer experience vs operations) interest you and why.",
    "Because the sift scores your personal statement, treat it as the main test - tie each essential criterion to a concrete example.",
    "Check the Velocity email and skills-check window (mid-July to mid-August in 2026); missing it ends the application.",
    "Read Cisco blogs and customer-success stories before the HireVue and assessment centre (advice reported by search summaries).",
    "Note Cisco lists two degrees (Digital & Technology Solutions, Professional Management); know which role you applied for.",
  ],
  officialLinks: [
    "https://www.cisco.com/c/en_uk/about/our-programmes.html",
    "https://www.cisco.com/c/en/us/about/careers/communities/students-and-new-graduates/apprenticeship.html",
  ],
  lastVerified: "2026-10-02",
  gaps: [
    "Re-checked 2 Oct 2026: only Cisco's programmes page was readable (it confirms the four-year degree apprenticeship and the two degree titles but gives no entry requirements, salary, locations or dates). jobs.cisco.com redirects to careers.cisco.com and was not read.",
    "The Velocity eligibility check, the HireVue stage, the 104 UCAS points and the 2026 timeline above could not be confirmed from any page we could read; they come from search summaries of job postings and should be checked against the live advert.",
    "An older Cisco blog gives a 19 March deadline, assessment centres in April and applications through QA Apprenticeships. It is undated and probably describes an older three-year programme, so it is not used.",
    "Cisco's own apprenticeship recruitment pages returned redirects/no detail; process stages were taken from search-result summaries of Cisco's job posting, not fetched directly.",
    "Whether an online aptitude test is used - none found.",
    "HireVue question count/timing and real candidate questions (Glassdoor/TSR returned 403).",
    "Assessment centre exercises, pass marks and offer timing.",
    "Glassdoor/GeeksforGeeks 'Cisco apprentice' results refer to India hiring (HackerRank 50 MCQ, technical/managerial/HR) and are NOT applicable to the UK degree apprenticeship; deliberately excluded.",
  ],
};
