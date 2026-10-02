import type { FirmProfile } from "./types";

const DA_PAGE = "https://careers.baesystems.com/locations/uk/apprentices/degree";
const HA_PAGE = "https://www.baesystems.com/en/careers/careers-in-the-uk/apprenticeships/higher";
const VALUES_PAGE = "https://careers.baesystems.com/life-at-bae-systems/our-values";
const GD_DA = "https://www.glassdoor.co.uk/Interview/BAE-Systems-Degree-Apprentice-Interview-Questions-EI_IE3102.0,11_KO12,29.htm";
const TSR_2026 = "https://www.thestudentroom.co.uk/showthread.php?t=7664062";
const GF_VIDEO = "https://www.graduatesfirst.com/bae-systems-interviews";

export const baeSystems: FirmProfile = {
  slug: "bae-systems",
  name: "BAE Systems",
  sector: "Defence, aerospace and security",
  programmes: [
    { name: "Aerospace Engineering degree apprenticeship", level: "Level 6", degree: "Full honours degree, funded by BAE Systems" },
    { name: "Software Engineering / Information & Technology / Enterprise Architecture degree apprenticeships", level: "Level 6" },
    { name: "Project Management degree apprenticeship", level: "Level 6" },
    { name: "Nuclear Engineering, Electronics Hardware, Manufacturing, Test & Commissioning, Cost Estimating, Digital Cyber degree apprenticeships", level: "Level 6" },
    { name: "Higher apprenticeships (engineering technical, finance/CIMA, HR, procurement, business, IMT)", level: "Level 4/5" },
  ],
  entry: {
    ucas:
      "England/Wales: 5 GCSEs A*-C / 4-9 incl. Maths and English and a minimum of 96 UCAS points (240 old tariff) or equivalent; some roles need Science/technical subjects. Scotland: 5 National 5s at C incl. English, Maths and a Science plus 3-4 Highers.",
    other:
      "Age 16+. Many roles are subject to security and export-control restrictions (nationality, place of birth, UK residency for National Security Vetting, typically 5-10 years depending on level); minimum Baseline Personnel Security Standard. Salary up to about 26,000 depending on age and role.",
    source: DA_PAGE,
  },
  timeline: {
    opens: "January 2027 (2027 intake)",
    closes: "Main window starts at the beginning of January and runs for about 6 weeks, with additional hiring through February (BAE degree apprenticeship page, re-read 2 Oct 2026). Follow the live advert.",
    notes:
      "2026 apprenticeship roles closed; reopening January 2027. Candidate reports for the 2026 cycle describe video/games then a face-to-face interview. BAE says apply early.",
    source: DA_PAGE,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Short online application: exam grades, work experience and outside interests. Qualifications are then reviewed against the role criteria (qualification review).",
      tips: [
        "Give full grades and relevant interests: BAE's own tips say clear, concise, complete sections and check spelling.",
        "Pick the business area that genuinely matches you (aerospace, submarines, cyber, etc.) and say why.",
      ],
      source: DA_PAGE,
      confidence: "official",
    },
    {
      order: 2,
      name: "Virtual assessment (gamified + on-demand video)",
      format:
        "Sent after a successful application. BAE says the virtual assessment includes gamified challenges and video questions. Candidate reports: HireVue platform, a maths-style game, a puzzle game and other cognitive/behavioural games, then recorded questions. A 2026 Glassdoor summary (single report, read via search summary) lists 3-5 past-experience video questions with retakes allowed and three games: shape matching, a maths game and an image-choice 'which are you more like?' game. Video preparation time conflicts across reports (30 seconds vs 3 minutes).",
      provider: "HireVue (reported); SHL also reported for some reasoning tests",
      tips: [
        "Complete in a quiet space on a laptop with stable Wi-Fi and do the practice questions first.",
        "Know the BAE values and behaviours cold because the recorded questions are behaviour-based.",
      ],
      source: DA_PAGE,
      confidence: "official",
    },
    {
      order: 3,
      name: "Interview",
      format:
        "BAE says the next stage is either a virtual or a face-to-face interview. 2026 candidate reports: face-to-face panel interview with behavioural questions similar to the video round plus technical questions on the role; candidates advised to bring printed CV copies. Some sites add a team activity.",
      tips: [
        "Bring CV copies for each interviewer and expect friendly but thorough questioning.",
        "Memorise 6-8 broad STAR+R examples mapped to the eight behaviours, not scripted answers.",
        "Revise the maths/physics or coding behind your chosen degree since technical questions on the role are reported.",
      ],
      source: DA_PAGE,
      confidence: "official",
    },
    {
      order: 4,
      name: "Offer and vetting",
      format: "Offer is subject to security clearance (at least Baseline Personnel Security Standard; some roles need higher NSV).",
      tips: ["Be ready for detailed nationality/residency history questions early."],
      source: DA_PAGE,
      confidence: "official",
    },
  ],
  oa: {
    provider: "HireVue (games and video) and possibly SHL",
    tests: [
      {
        name: "Gamified assessment",
        format: "Short games testing maths, problem solving and cognitive/behavioural traits delivered in the virtual assessment.",
        notes: "Number of games and timing not published; candidate accounts mention a maths assessment and a puzzle-based game.",
      },
      {
        name: "Reasoning tests (numerical / verbal / SJT / logical)",
        format: "Reported by commercial prep sites for some BAE routes; not confirmed in BAE's own degree-apprenticeship description.",
        notes: "Do not rely on this: BAE's page mentions only gamified challenges and video questions.",
      },
    ],
    styleNotes:
      "Game-style short cognitive puzzles plus quick mental-maths/problem-solving tasks, then behaviour-based video questions. Write original look-alikes as timed mini-puzzles (pattern completion, quick arithmetic, resource allocation) and keep answers honest rather than trying to reverse-engineer scoring.",
    source: DA_PAGE,
    confidence: "official",
  },
  videoInterview: {
    text:
      "On-demand video interview inside the virtual assessment. Format reports conflict: a prep site says about 30 seconds preparation and 1-2 minutes to record per question; a Student Room summary says about 3 minutes of preparation per question; Glassdoor says retakes up to 3 times are possible. Questions are competency/behaviour-based.",
    source: GF_VIDEO,
    confidence: "single-report",
  },
  assessmentCentre: {
    text:
      "BAE's degree-apprenticeship page describes a virtual or face-to-face interview as the final stage and does not list a group exercise. Some candidates report team activities or group assessments at certain sites. Treat a group task as possible but unconfirmed.",
    source: GD_DA,
    confidence: "single-report",
  },
  finalInterview: {
    text:
      "Panel interview (virtual or face-to-face) combining behavioural and technical questions; interviewers described as friendly and not trying to catch candidates out (2026 Student Room summary).",
    source: TSR_2026,
    confidence: "single-report",
  },
  values: [
    "Trusted",
    "Innovative",
    "Bold",
    "Behaviours: Creativity, Strategic vision, Collaboration, Courage, Develop people, Integrity, Inspiration, Adaptability",
  ],
  questions: [
    {
      stage: "Interview",
      question: "What are the BAE values?",
      type: "motivation",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Interview",
      question: "Tell us about a time where you came up with a solution as a team.",
      type: "competency",
      competency: "Teamwork",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Interview",
      question: "Tell me about a time you worked on multiple tasks simultaneously.",
      type: "competency",
      competency: "Organisation",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Interview",
      question: "Tell me about a time you effectively worked with a team.",
      type: "competency",
      competency: "Teamwork",
      source: GD_DA,
      confidence: "single-report",
    },
    {
      stage: "Interview",
      question: "How would you deal with a difficult colleague?",
      type: "situational",
      competency: "Teamwork",
      source: GD_DA,
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "Learn the three values (Trusted, Innovative, Bold) and the eight behaviours on BAE's values page; one reported question was simply 'What are the BAE values?'.",
    "Nationality, residency and vetting matter more here than at most employers: check the role's security requirement before applying and be accurate about residency history.",
    "Apply in the 6-week window from early January; do the virtual assessment promptly and do the practice questions.",
    "Have a clear answer on the product or programme you want (aircraft, submarines, radar, cyber) and why defence, since 'purpose' is central to BAE's pitch.",
    "Bring printed CVs to a face-to-face interview and prepare technical fundamentals for your degree discipline.",
    "Use STAR+R (Result plus Reflection) as recommended by prep guides.",
  ],
  officialLinks: [DA_PAGE, HA_PAGE, VALUES_PAGE, "https://careers.baesystems.com/join-us/faqs"],
  lastVerified: "2026-10-02",
  gaps: [
    "BAE's old careers URLs now redirect to careers.baesystems.com; the degree page link was updated, but the higher apprenticeship link (HA_PAGE) was not re-checked.",
    "Game names, video timings, number of questions and whether there is a group task come only from single reports.",
    "Official sources give only a three-line process; OA provider, game titles, item counts and timings are not published by BAE. HireVue/SHL claims are from prep sites and Student Room summaries.",
    "Conflicting reports on video interview prep time (30 s vs 3 min) and retake allowance; not resolved.",
    "No verified group exercise or presentation for degree apprenticeships.",
    "Reported questions come from Glassdoor search summaries (page returned 403 to direct fetch), so dates and roles are unknown.",
    "The Student Room's 2025 and 2026 BAE threads could not be read directly. The online-test description comes from a commercial prep site.",
  ],
};
