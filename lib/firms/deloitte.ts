import type { FirmProfile } from "./types";

// Research date 2026-09-30.
const D_ASSESS = "https://www.deloitte.com/uk/en/careers/early-careers/early-careers-assessment.html";
const D_TJ = "https://targetjobs.co.uk/careers-advice/accountancy-banking-and-finance/your-guide-deloitte-application-process-start-finish";
const D_PROG = "https://www.deloitte.com/uk/en/careers/early-careers/early-careers-programmes.html";
const D_GD_BS = "https://static.glassdoor.fr/Interview/Deloitte-BrightStart-Apprentice-Interview-Questions-EI_IE2763.0,8_KO9,31_IP2.htm";

export const deloitte: FirmProfile = {
  slug: "deloitte",
  name: "Deloitte UK",
  sector: "Professional services (Big 4)",
  programmes: [
    {
      name: "BrightStart Higher/Degree Apprenticeship (Audit & Assurance, Consulting, Technology and others)",
      level: "Higher apprenticeship, 15 months to 4 years depending on business area, permanent job with professional qualifications",
      locations: ["Multiple UK offices (e.g. Aberdeen and Belfast listed for 2026 Audit)"],
    },
    {
      name: "Entry Level Apprenticeships (business support, tax)",
      level: "Entry level apprenticeship (Cardiff-based roles)",
      locations: ["Cardiff"],
    },
  ],
  entry: {
    ucas: "104 UCAS points from top 3 A-levels (or equivalent) for BrightStart and entry level apprenticeships.",
    other: "One application per academic year (Sept-Aug). Wikijob (graduate page, undated) quotes GCSE Maths 6 / English 4 for the general route; one search result says Maths 5 - verify on the vacancy page.",
    source: D_PROG,
  },
  timeline: {
    rolling: true,
    opens: "BrightStart roles for September 2027 are open now across about 10 offices; several close in October 2026 and some are rolling (Deloitte's application portal, seen through a search summary). Check each role's date.",
    notes: "Applications are reviewed on a rolling basis; apply early. Deloitte allows one application per academic year.",
    source: "https://apply.deloitte.co.uk/UKEarlyCareers",
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format: "About 15 minutes: personal and educational details; must be submitted in one session (no saving). Candidate ID issued.",
      durationMins: 15,
      tips: ["Check eligibility (104 UCAS points) before applying as you only get one application a year."],
      source: D_ASSESS,
      confidence: "official",
    },
    {
      order: 2,
      name: "OneStop Assessment (apprenticeships)",
      format:
        "For entry-level apprenticeships the immersive assessment and job simulation are merged into a single online assessment: workplace scenarios ranked by preference (behavioural) plus numerical and verbal reasoning. Feedback is strengths-based rather than pass/fail, within about four weeks. Entry-level apprenticeship process ends here. BrightStart follows the standard path below; Deloitte's programmes page lists its final stage as in person.",
      provider: "Deloitte Candidate Zone (deloitte.preparationplus.com); question style reported as Cappfinity-like",
      passMarkNotes: "Not published.",
      tips: ["Use the free Candidate Zone practice; Deloitte says to go with your gut and not second-guess.", "Read the Integrity & AI guidance first; unofficial third-party coaching sites are not endorsed."],
      source: D_ASSESS,
      confidence: "official",
    },
    {
      order: 3,
      name: "Immersive online assessment (standard route)",
      format: "Deloitte: behavioural part ranking the most and least likely actions in workplace scenarios, plus a numerical and verbal cognitive part; some sections are timed with no overall limit; decision within 4 weeks. TargetJobs (single report) adds ~30 min in one sitting and game-style tasks.",
      provider: "Deloitte (Candidate Zone platform)",
      durationMins: 30,
      tips: ["Learn the five Deloitte values and rank options against them."],
      source: D_TJ,
      confidence: "single-report",
    },
    {
      order: 4,
      name: "Job simulation (standard route)",
      format: "Deloitte: ranking, selection, written and video responses, now including AI-related scenarios; results within 4 weeks. Timings are not published: TargetJobs (single report) says ~40 min with video answers of 30s to 2 min and an email task; Wikijob (graduate page) says ~45 min and 18 questions.",
      durationMins: 40,
      tips: ["Practise short 30-120 second recorded answers.", "Write a clear, brief email under time pressure."],
      source: D_TJ,
      confidence: "single-report",
    },
    {
      order: 5,
      name: "Final stage assessment",
      format:
        "About 90 min (Deloitte): (1) topic discussion, 30-40 min, on a topic chosen from four options sent in advance (preparation required; two-way discussion with assessor); (2) skills and motivation interview, ~50 min (competency, motivation, scenario, topical questions). Graduates, entry-level apprentices and BrightStart attend in person at the office applied to. A 2025 TSR report says some offices ran the topic discussion as a group task, and a Glassdoor BrightStart summary mentions ~3 days to prepare a presentation topic plus a group assessment: format varies by office.",
      durationMins: 90,
      tips: [
        "Research your chosen topic from several angles and prepare questions back to the assessor.",
        "Dress business formal, even if virtual.",
        "Know the role: candidates report being asked what audit practice involves for audit apprenticeships.",
      ],
      source: D_ASSESS,
      confidence: "official",
    },
    {
      order: 6,
      name: "Outcome",
      format: "Personalised feedback given whatever the result; offers 1-3 weeks after the final stage (wikijob).",
      tips: ["Use feedback to reapply next academic year if unsuccessful."],
      source: D_TJ,
      confidence: "official",
    },
  ],
  oa: {
    provider: "Deloitte in-house assessment delivered on Candidate Zone; third parties describe Cappfinity-style items (and, in older cycles, Arctic Shores 'Cosmic Cadet').",
    tests: [
      { name: "Situational strengths/judgement", format: "Rank or choose responses to workplace scenarios", items: 20, notes: "~20 scenarios, untimed (AssessmentDay, graduate route; single source)" },
      { name: "Numerical reasoning", format: "Multiple choice, ranking and typed responses on charts/tables" },
      { name: "Verbal reasoning", format: "Short text comprehension and language questions" },
      { name: "Game-based tasks", format: "Short game-style cognitive/behavioural tasks, reported for standard route" },
    ],
    styleNotes: "Scenario-led and immersive (a fictional business day with video prompts), mixing ranking of actions against values, short numerical/verbal items and recorded answers. Apprenticeship OneStop is a condensed version.",
    source: D_ASSESS,
    confidence: "official",
  },
  videoInterview: {
    text: "Inside the job simulation: video-recorded responses of 30 seconds to 2 minutes mixed with written and email tasks (standard route). Apprentice OneStop version format not separately published.",
    source: D_TJ,
    confidence: "official",
  },
  finalInterview: {
    text: "Final stage assessment: prepared topic discussion (~30 min, one of four topics) then skills and motivation interview (~50 min); competency, motivation, scenario and topical questions.",
    source: D_TJ,
    confidence: "official",
  },
  values: [
    "Lead the way",
    "Serve with integrity",
    "Take care of each other",
    "Foster inclusion",
    "Collaborate for measurable impact",
  ],
  questions: [
    { stage: "Final stage assessment", question: "Why Deloitte? Why this service line?", type: "motivation", source: "https://www.wikijob.co.uk/interview-advice/company-interview-questions/deloitte", confidence: "single-report" },
    { stage: "Final stage assessment", question: "Tell me about something in the news and how it will impact Deloitte.", type: "commercial", source: "https://www.wikijob.co.uk/interview-advice/company-interview-questions/deloitte", confidence: "single-report" },
    { stage: "Final stage assessment", question: "Give me an example of a time you have been creative.", type: "competency", source: "https://www.wikijob.co.uk/interview-advice/company-interview-questions/deloitte", confidence: "single-report" },
    { stage: "Final stage assessment", question: "What does successful collaboration mean to you?", type: "competency", source: "https://www.wikijob.co.uk/interview-advice/company-interview-questions/deloitte", confidence: "single-report" },
    { stage: "Final stage assessment", question: "Tell me about a time you were challenged and how you overcame it.", type: "competency", source: "https://www.wikijob.co.uk/interview-advice/company-interview-questions/deloitte", confidence: "single-report" },
    { stage: "Final stage assessment", question: "Why Deloitte, and what do you know about Deloitte? (BrightStart)", type: "motivation", source: D_GD_BS, confidence: "single-report" },
    { stage: "Final stage assessment", question: "Tell me about a time you worked successfully in a team. (BrightStart)", type: "competency", source: D_GD_BS, confidence: "single-report" },
    { stage: "Final stage assessment", question: "Tell me about a time you came up with a creative idea. (BrightStart)", type: "competency", source: D_GD_BS, confidence: "single-report" },
    { stage: "Final stage assessment", question: "Tell me about a setback you experienced on a project. (BrightStart)", type: "competency", source: D_GD_BS, confidence: "single-report" },
    { stage: "Final stage assessment", question: "Reported in BrightStart threads: managing tasks; a time you faced an unexpected problem; role-specific knowledge (e.g. what audit involves).", type: "situational", source: "https://www.thestudentroom.co.uk/showthread.php?t=7649277", confidence: "single-report" },
  ],
  specificAdvice: [
    "Only one application per academic year, so apply to the route you most want; do not apply speculatively.",
    "Prepare the topic discussion like a mini-presentation: pick one of the four topics, know facts, stakeholders, impact on clients and two counter-arguments.",
    "Do not use third-party 'leaked question' sites; Deloitte explicitly says it does not endorse them and treats it as an integrity issue. Use Candidate Zone.",
    "Learn the five values and show 'Serve with integrity' and 'Foster inclusion' through concrete examples.",
    "Questions come from wikijob (graduate page): treat them as indicative of style, not guaranteed apprentice content.",
  ],
  officialLinks: [D_ASSESS, D_PROG, "https://apply.deloitte.co.uk/UKEarlyCareers", "https://www.deloitte.com/uk/en/careers/early-careers.html"],
  lastVerified: "2026-10-02",
  gaps: [
    "Deloitte's pages confirm BrightStart follows the 5-step path with an in-person final stage; the Glassdoor BrightStart questions were read from a search summary, not the page itself.",
    "BrightStart university partners, degree titles, locations and 2026/27 dates not verified.",
    "OneStop item counts/timings not published; Stage 3/4 details are from TargetJobs/wikijob (graduate-oriented, undated).",
    "TSR, Glassdoor and Reddit blocked; no first-hand 2025-26 apprentice write-ups read directly.",
  ],
};
