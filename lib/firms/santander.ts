import type { FirmProfile } from "./types";

// Research date 2026-09-30. Most recent cycles: 2025 (opened Feb 2025, AC late March 2025) and a 2026 intake discussed by candidates around March 2026.
const S_PROCESS = "https://www.santander.com/en/careers/uk-careers/the-application-process";
const S_ET = "https://www.santander.com/en/careers/uk-careers/emerging-talent/how-do-i-get-onboard";
const S_APPS = "https://www.santander.com/en/careers/uk-careers/emerging-talent/apprenticeship-programmes";
const TSR_P1 = "https://www.thestudentroom.co.uk/showthread.php?t=7565984";
const TSR_P5 = "https://www.thestudentroom.co.uk/showthread.php?t=7565984&page=5";
const TSR_P6 = "https://www.thestudentroom.co.uk/showthread.php?t=7565984&page=6";
const S_BEHAVIOURS = "https://www.santander.com/en/careers/uk-careers/we-care-about-you/our-behaviours";

export const santander: FirmProfile = {
  slug: "santander",
  name: "Santander UK",
  sector: "Banking / financial services",
  programmes: [
    {
      name: "Corporate and Commercial Banking Level 6 Apprenticeship (Level 6 Financial Services Professional)",
      level: "Level 6, degree-equivalent, 33 months",
      degree: "Level 6 Financial Services Professional Apprenticeship (degree-equivalent; not described as a named BSc)",
      locations: ["North (Manchester)", "London & Southeast", "Southwest & Wales", "Midlands", "Scotland"],
    },
    {
      name: "Other apprenticeships: Digital, Data, Economic Crime, Tech, Customer Service",
      level: "Entry, higher and degree level",
      locations: ["Various UK"],
    },
  ],
  entry: {
    ucas: "Sources disagree: 112 UCAS points from top 3 A-levels (official apprenticeship page), or 104 points (third-party listings); one aggregator cited 96 points for banking and 104 for financial crime. Check the live listing.",
    other: "Maths and English GCSE grade 4+ (aggregator). Right to work in the UK; no sponsorship for apprenticeships (official). Santander's apprenticeship page (read 2 Oct 2026) lists a salary of £27,500, a hybrid pattern of at least 12 office days a month, 25 days' holiday and three 12-month placements over 33 months; it gives no UCAS points or GCSE requirements. Applications go through Santander's Talent Network.",
    source: S_APPS,
  },
  timeline: {
    opens: "2025 cycle opened in early February 2025, later than first announced. Applications are a rolling window.",
    closes: "Rolling; the role page may show 'applications closed' once full (reported in 2025).",
    rolling: true,
    notes:
      "2025: applications opened first week of Feb; AC for Manchester CCB on 26 March 2025; offer/reserve-list decisions by phone call (emails for rejections) in April. 2026 intake: candidates finished the video interview in about March 2026 and expected results end of March or early April.",
    source: TSR_P1,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Short application form with CV. Santander reviews against requirements and usually responds within a week.",
      tips: ["Make sure your CV shows clearly the education and experience the job description lists: 2025 candidates received generic rejections referencing 'education, type and length of professional experience'."],
      source: S_PROCESS,
      confidence: "official",
    },
    {
      order: 2,
      name: "Online assessment games",
      format:
        "Santander's application-process page says that for selected roles there is an online scenario gamification step (cognitive and conscientiousness games) combined with the video interview, and names no vendor. Candidates report an email link after applying (2025: 'within the next 72 hours') and three short games, which they call HireVue games; one called them Pymetrics-style. Reviewed by Santander before you are invited to the video stage.",
      provider: "HireVue games (candidate-reported; one candidate cites Pymetrics)",
      passMarkNotes: "Candidates report games are scored first and passing leads to the video interview; some reject emails had no detailed reason. One 2026 applicant reports 'all positive feedback' on games yet an accidental rejection that was reversed after emailing Santander.",
      tips: [
        "Finish inside the 72-hour window from the email and do it in a quiet place.",
        "Check your Workday status if you hear nothing; one candidate got an accidental rejection fixed by emailing.",
      ],
      source: TSR_P1,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 3,
      name: "Video interview",
      format:
        "4-5 pre-recorded questions; up to 7 days to finish and you can pause and return (official/prep). 2026 applicants report they had 3 retakes.",
      provider: "HireVue",
      passMarkNotes: "Outcome by email; AC invitations followed for the Manchester CCB cohort by mid-March 2025.",
      tips: ["Use your retakes only to fix delivery, not to rewrite the whole answer.", "Keep answers to a STAR structure and mention Think Customer/Move Together examples."],
      source: S_PROCESS,
      confidence: "official",
    },
    {
      order: 4,
      name: "Phone discussion",
      format: "20-minute call with the resourcing team about qualifications and role fit (official site lists this step; some candidates do not report it).",
      durationMins: 20,
      tips: ["Be ready to explain your CV and why the specific apprenticeship."],
      source: S_PROCESS,
      confidence: "official",
    },
    {
      order: 5,
      name: "Assessment centre / interview day",
      format:
        "Interview or assessment day, virtual or in person depending on the area (official). 2025 CCB Manchester AC took place on 26 March 2025. Prep sites list a group exercise with six others, a presentation and a senior manager interview, but these are not confirmed for DA. Offers are made by phone; rejections by email; a reserve list exists.",
      passMarkNotes: "A 2025 CCB candidate was put on a reserve list (phone call).",
      tips: [
        "Email resourcing/emergingtalent if you do not receive AC links; candidates report having to chase them.",
        "Prepare for individual interview plus group work; ask about the format when you receive the invite.",
      ],
      source: TSR_P6,
      confidence: "multiple-candidate-reports",
    },
  ],
  oa: {
    provider: "HireVue games (candidate-reported); Santander describes 'three short assessment games' on its own page",
    tests: [
      { name: "Game-based assessment", format: "Three short games measuring cognitive abilities and conscientiousness (prep-site description)", items: 3, notes: "Names and timings not published by Santander." },
    ],
    styleNotes:
      "Not a traditional SHL battery for the DA route. Expect three short game-style tasks completed online within a few days of application (72 hours in 2025); names, timings and scoring are not published. Prep sites alternatively list numerical, verbal and a 12-question SJT, but candidate reports for 2025 and 2026 describe games first, then video. Practise generic cognitive/behavioural game formats rather than memorising vendor items.",
    source: S_ET,
    confidence: "multiple-candidate-reports",
  },
  videoInterview: {
    text: "4-5 pre-recorded questions with up to 7 days to complete; retakes reported in the 2026 cycle (up to 3).",
    source: S_PROCESS,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Official: virtual or in person interview/assessment day depending on the area. 2025 Manchester CCB AC on 26 March 2025. Group exercise and presentation are prep-site claims only.",
    source: TSR_P5,
    confidence: "single-report",
  },
  finalInterview: {
    text: "Hiring-manager interview or assessment day after shortlisting (can take up to four weeks). Offers are communicated by phone.",
    source: S_PROCESS,
    confidence: "official",
  },
  values: [
    "Simple, Personal, Fair (The Santander Way)",
    "TEAMS behaviours: Think Customer, Embrace Change, Act Now, Move Together, Speak Up",
  ],
  pay: { text: "Corporate & Commercial Banking Level 6: £27,500.", source: "https://www.santanderjobs.co.uk/realiseyourfuture/corporate-banking-apprenticeship.php", confidence: "official" },
  dayToDay: [
    "Corporate & Commercial Banking apprentices work on two 12-month placements supporting teams that look after business clients.",
  ],
  whyThisFirm: [
    { text: "Santander UK completed its £2.65 billion acquisition of TSB on 30 April 2026, making it the UK's third largest bank by personal current account balances.", source: "https://www.santander.co.uk/about-santander/media-centre/press-releases/santander-uk-completes-cash-acquisition-of-tsb-banking/", confidence: "official" },
  ],
  questions: [],
  specificAdvice: [
    "Be ready the day applications open: in 2025 the window opened later than first announced, then filled quickly.",
    "Treat the games as a filter: you get about 72 hours from the email, and a wrong rejection can be fixed by emailing Santander.",
    "Prepare TEAMS examples (Think Customer, Embrace Change, Act Now, Move Together, Speak Up) for the video and the AC.",
    "The Level 6 CCB apprenticeship is degree-equivalent, not a named BSc: decide whether that matches your goal.",
    "Expect placements every 12 months across front-office and support (Relationship Banking first), so show flexibility.",
    "Chase the AC link if missing; ask about group-exercise format in advance.",
  ],
  officialLinks: [S_PROCESS, S_ET, S_APPS, S_BEHAVIOURS],
  lastVerified: "2026-10-02",
  gaps: [
    "Re-read 2 Oct 2026: Santander's application-process page says the games and video interview are one combined step for selected roles (4-5 video questions, 7 days to finish, results within 7 days) followed by a phone screen of about 20 minutes, shortlisting of up to 4 weeks, then an interview or assessment day; it gives no assessment-centre format. The UCAS conflict is unresolved because the apprenticeship page lists no UCAS points.",
    "A Glassdoor summary (likely a graduate or risk role, role unconfirmed) reports a virtual assessment centre with two 45-minute interviews and a 15-minute presentation prepared in 30 minutes from a 5-page PDF; it could not be read and is not applied here.",
    "Games provider and exact game types (HireVue games vs Pymetrics) and time per game.",
    "Verbatim video interview and assessment centre questions; no candidate posted any; Glassdoor and Reddit were not retrievable.",
    "UCAS points discrepancy (96, 104, 112) and GCSE requirement from an official source.",
    "Whether group exercises and presentations occur in DA assessment centres.",
    "Santander 2026-27 opening dates.",
  ],
};
