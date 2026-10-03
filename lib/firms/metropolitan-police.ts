import type { FirmProfile } from "./types";

const MET = "https://www.careersmetpolice.co.uk/police-constable-degree-apprenticeship";
const MET_OFFICIAL = "https://www.met.police.uk/police-forces/metropolitan-police/areas/c/careers/police-officer-roles/police-constable/overview/entry-routes/police-constable-degree-apprenticeship-pcda/";
const COP_GUIDE = "https://assets.college.police.uk/s3fs-public/2024-09/Online-assessments-candidate-guide-v3.2.pdf";
const COP_SIFT = "https://www.college.police.uk/career-learning/joining-police/online-assessment-process/national-sift-candidate-guidance";
const TSR = "https://www.thestudentroom.co.uk/showthread.php?t=6400150&page=4";

export const metropolitanPolice: FirmProfile = {
  slug: "metropolitan-police",
  name: "Metropolitan Police (PC Degree Apprenticeship)",
  sector: "Policing",
  programmes: [
    {
      name: "Police Constable Degree Apprenticeship (PCDA)",
      level: "Level 6",
      degree: "BSc (Hons) Professional Policing Practice (Middlesex University), fully funded",
      locations: ["London (17 weeks at Hendon, then borough street duties)"],
    },
  ],
  entry: {
    other:
      "Working towards or holding 2 A-levels or a Level 3 (or equivalent training/experience) plus English Level 2 (GCSE C / 4-9). Age 18+ (apply at 17, upper limit typically 57). Pass bleep test (15 m shuttle, test lasts 3 min 35 s over 525 m), medical, eyesight, vetting, tattoo policy, 3 years continuous UK residency. Starting pay 43,689 incl. allowances (careersmetpolice page); the met.police.uk page shows 42,210.",
    source: MET,
  },
  timeline: {
    rolling: true,
    notes: "Up to about six months end to end. Registration and security check about 7 days; national sift about 2 weeks; online assessment within about 3 weeks of step 1 and results within 3 weeks; face-to-face, medical and fitness results 4-8 weeks; vetting about 2 months.",
    source: MET,
  },
  stages: [
    { order: 1, name: "Online registration and application", format: "Registration and application form checking eligibility; basic security check (about 7 days).", tips: ["Declare tattoos, business interests, and residency accurately."], source: MET, confidence: "official" },
    {
      order: 2,
      name: "National sift",
      format: "SJT of 15 scenarios with four actions each to rate for effectiveness (about 30 minutes, untimed) and an 80-statement Behavioural Styles Questionnaire (about 20 minutes, untimed), auto-scored and combined.",
      provider: "Cubiks (per College of Policing support contact)",
      durationMins: 50,
      tips: ["Rate each action independently and rate all four.", "Answer the BSQ about your real work behaviour."],
      source: COP_GUIDE,
      confidence: "official",
    },
    {
      order: 3,
      name: "Online assessment",
      format:
        "Three exercises on Outmatch within about a 3-week window: competency-based interview (5 questions, 60 s prep, 5 min answers, about 40 min); written exercise (urgent task for your line manager from 4 information items, about 40 min, limit 120 min, spelling not assessed); briefing exercise (12 spoken questions in three parts, 60 s prep and 3 min answer each, about 60 min). Prepared notes or scripts can cause automatic failure.",
      provider: "College of Policing / Outmatch",
      durationMins: 140,
      passMarkNotes: "Assessed at CVF Level 1; an automatic fail policy exists for notes or scripts.",
      tips: ["Use STAR and one detailed example per question; use only information provided in the written and briefing exercises."],
      source: COP_GUIDE,
      confidence: "official",
    },
    {
      order: 4,
      name: "Face-to-face Met assessment",
      format: "Values-focused interview at the Met recruitment centre in south London, then medical and job-related fitness test (bleep).",
      tips: ["Practise the bleep test; you get three attempts."],
      source: MET,
      confidence: "official",
    },
    { order: 5, name: "Vetting and offer", format: "Pre-employment checks (average about two months), then formal offer.", tips: [], source: MET, confidence: "official" },
  ],
  oa: {
    provider: "Cubiks (national sift) and Outmatch (online assessment) for the College of Policing",
    tests: [
      { name: "Situational Judgement Test", format: "Rate effectiveness of four actions for each scenario", items: 15, timeMins: 30 },
      { name: "Behavioural Styles Questionnaire", format: "Agree/disagree with statements", items: 80, timeMins: 20 },
      { name: "Competency-based interview (recorded)", format: "5 questions, 60 s prep, 5 min answer", items: 5, timeMins: 40 },
      { name: "Written exercise", format: "Urgent written task as a PC using 4 info items", timeMins: 40, notes: "2 hour cap" },
      { name: "Briefing exercise", format: "12 recorded questions in 3 parts, 60 s prep, 3 min answer", items: 12, timeMins: 60 },
    ],
    styleNotes:
      "Policing SJT (rate each of four actions) against CVF values of integrity, transparency, public service and impartiality; written and briefing tasks use fictional community scenarios with new information dropped in part 2 and 3. Write original look-alikes with neighbourhood issues and information drip-fed.",
    source: COP_GUIDE,
    confidence: "official",
  },
  videoInterview: {
    text: "Competency-based interview recorded on Outmatch: five questions with on-screen prompts and a pre-recorded interviewer; 60 s prep and up to 5 min to answer; no scripts.",
    source: COP_GUIDE,
    confidence: "official",
  },
  assessmentCentre: {
    text: "Face-to-face Met assessment: values-focused interview at the South London recruitment centre followed by medical and fitness test.",
    source: MET,
    confidence: "official",
  },
  finalInterview: {
    text: "Values-focused interview at the recruitment centre. Question content not published.",
    source: MET,
    confidence: "official",
  },
  pay: { text: "Starting salary £43,689 including allowances, rising to £49,137 after three years when you graduate from the degree and probation, then up to £62,094 (Met recruitment page, 3 Oct 2026).", source: MET, confidence: "official" },
  values: ["Integrity", "Courage", "Accountability", "Respect", "Empathy"],
  questions: [
    { stage: "Online assessment", question: "Competency-based interview: five questions about how you dealt with specific situations, using work or personal life examples.", type: "competency", source: COP_GUIDE, confidence: "official" },
    { stage: "Online assessment", question: "Written task: as a PC, write an urgent letter/briefing to your supervisor using the supplied material (candidate report).", type: "situational", competency: "Communication", source: TSR, confidence: "multiple-candidate-reports" },
    { stage: "Online assessment", question: "Briefing exercise: given a scenario, say what you would do, then more information is added to see if your answer changes (candidate report).", type: "situational", competency: "Problem solving", source: TSR, confidence: "multiple-candidate-reports" },
  ],
  specificAdvice: [
    "Do not bring notes or scripts to the online assessment; it can trigger automatic failure.",
    "Prepare one specific example for each CVF value (integrity, public service, transparency, ownership, innovative and open-minded).",
    "In the written exercise only use supplied information and do not invent facts.",
    "Start bleep-test training now (Met provides a six-week programme); you must pass it.",
    "Know the Met's five values and the trust and confidence agenda; be honest about mistakes (Accountability).",
  ],
  officialLinks: [MET, MET_OFFICIAL, COP_GUIDE, COP_SIFT],
  lastVerified: "2026-10-03",
  gaps: [
    "Candidate-reported questions for the Met's face-to-face values interview were not found.",
    "Official assessment timings come from the College of Policing guide v3.2 (Sept 2024): SJT is shown as 30 minutes there but about 45 minutes in another version.",
    "An older Met page showed 42,210 as the starting pay; the current recruitment page says 43,689 including allowances, so use the current figure and confirm on your advert.",
    "Student Room PCDA threads unreadable, so candidate reports are summaries and from other forces.",
    "Sift provider inferred from the support contact in the College guide.",
  ],
};
