import type { FirmProfile } from "./types";

// Updated 2026-10-02: Glasgow Graduate Apprenticeship and Heriot-Watt pay/dates (docs/research/finance-firms/existing-profiles-updates.md).
// Research date 2026-09-30. Most recent cycle: 2025 applications (Sept-Dec 2025) for September 2026 entry, plus 2024 cycle for 2025 entry.
const JPM_OFFICIAL = "https://www.jpmorganchase.com/careers/explore-opportunities/programs/financial-services-apprenticeship";
const TSR_OFFER26 = "https://www.thestudentroom.co.uk/showthread.php?t=7633223";
const TSR_OFFER26_P2 = "https://www.thestudentroom.co.uk/showthread.php?t=7633223&page=2";
const TSR_2026 = "https://www.thestudentroom.co.uk/showthread.php?t=7625533";
const TSR_2025_OPEN = "https://www.thestudentroom.co.uk/showthread.php?t=7530383";
const JPM_PRINCIPLES = "https://www.jpmorganchase.com/about/business-principles";

export const jpMorgan: FirmProfile = {
  slug: "jp-morgan",
  name: "J.P. Morgan",
  sector: "Investment banking / financial services",
  programmes: [
    {
      name: "Financial Services Degree Apprenticeship",
      level: "Level 6, 4 years",
      degree: "BSc (Hons) Applied Finance, University of Exeter (London, Bournemouth); Business Management: Financial Services Finance, Heriot-Watt (Edinburgh); CISI exams alongside",
      locations: ["London", "Bournemouth", "Edinburgh"],
    },
    {
      name: "Digital & Technology Solutions Degree Apprenticeship",
      level: "Level 6, 4 years",
      degree: "BSc Digital and Technology Solutions (2025 cycle listed London and Bournemouth)",
      locations: ["London", "Bournemouth"],
    },
    {
      name: "Graduate Apprenticeship, Software Development (Scotland)",
      level: "Scottish Graduate Apprenticeship (degree level)",
      degree: "Software development degree (provider not confirmed)",
      locations: ["Glasgow"],
    },
  ],
  entry: {
    ucas: "Exeter route: three B grades at A-level (or UCAS equivalent). One STEM A-level required on the official page (Business Studies accepted). Technology route needs Maths or Computer Science/IT as one A-level (candidate-reported strictly enforced). Heriot-Watt route: BBBB Highers.",
    other:
      "GCSE English grade 5+ and Maths grade 6+ (official). Contextual offers as defined by the University of Exeter are considered. A candidate notes the online form does not ask for A-levels well (US-style education fields); they entered Exeter as the institution and explained in a note.",
    source: JPM_OFFICIAL,
  },
  timeline: {
    opens: "Applications open early September. 2025 cycle: opened in early September 2025 for September 2026 entry (candidates applied on the 1st and 3rd). 2024 cycle opened around September with London closing 15 Oct and Bournemouth 15 Dec (candidate-posted).",
    closes: "Rolling. London Financial Services invited to Superday from about late September to mid-October in 2025; some applicants saw the role 'no longer available' by mid-September.",
    rolling: true,
    notes:
      "Scotland runs on a different calendar: Heriot-Watt reported J.P. Morgan's Graduate Apprenticeships opening on 14 October 2024 and closing on 28 February 2025, with a £24,000 starting salary and BBBB at Scottish Higher (Heriot-Watt news and school careers posts). Applications are reviewed on a rolling basis and JPM strongly encourages early submission. In 2025 the Superday email arrived around a month after applying, with Superday interviews from about 28 October and the in-person Assessment Evening about a month later. Outcomes were still awaited in mid-December. One applicant said JPM accepts and rejects everyone at a given stage on the same day, so no news for days is not informative.",
    source: TSR_OFFER26,
  },
  stages: [
    {
      order: 1,
      name: "Online application",
      format:
        "Application form plus CV and cover letter / two 500-word application questions (2024 cycle prompts: 'what one trait makes you a unique candidate' and 'how does a place on this programme support your career objectives'). One 2025 London Finance applicant had no online tests at all: just the form, CV and cover letter.",
      tips: [
        "Apply within the first days: multiple 2025 applicants saw 'under review' for a month and some postings closed mid-September.",
        "Use the 500-word answers to show evidence of the firm's values (service, heart, curiosity, courage, excellence) as recommended by a 2024 cycle poster.",
        "Do not wait for predicted results to meet the STEM subject requirement; check official criteria because economics is not STEM.",
      ],
      source: TSR_OFFER26,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 2,
      name: "Telephone interview (Bournemouth, 2024 cycle) / online assessment (historic)",
      format:
        "2024 cycle Bournemouth applicants reported a telephone interview invite (for example on a Friday) after applying. Older prep-site guides describe Pymetrics-style numerical games (12 games, 20-30 min) and a HireVue (5-7 questions, 3 min each), but 2025 London Finance candidates report skipping straight to Superday, so do not assume these.",
      provider: "Pymetrics / HireVue (older prep-site guides only)",
      tips: ["Practise a 60-second and 2-minute pitch for 'why J.P. Morgan and why this apprenticeship' in case a phone/video screen appears."],
      source: TSR_2025_OPEN,
      confidence: "single-report",
    },
    {
      order: 3,
      name: "Superday (virtual interviews)",
      format:
        "Email: 'selected to participate in virtual interviews for our London Finance Degree Apprenticeship Programme Superday'. Two 30-minute interviews with two different interviewers. Questions mix motivation and competencies with some technical questions. RSVP deadline in the invite. Use of ChatGPT or other unapproved AI tools during the Superday is strictly prohibited (stated in the email).",
      durationMins: 60,
      passMarkNotes: "JPM releases results for a whole stage on the same day. Some candidates reported interviewers were friendly and conversational.",
      tips: [
        "Expect competency, behavioural, situational and technical questions; one candidate advised being commercially aware and researching the firm.",
        "Prepare two separate stories per competency since two interviewers ask different questions.",
        "No AI assistance at all in the interview.",
      ],
      source: TSR_OFFER26,
      confidence: "multiple-candidate-reports",
    },
    {
      order: 4,
      name: "In-person Assessment Evening",
      format:
        "Final in-person stage about a month after the Superday (London, November-December 2025). Includes a group task and a networking part, which candidates called 'pretty simple and straightforward' with friendly people. Official page refers to assessment centres and insight evenings with current apprentices and managers involved in selection. Results reportedly arrive before Christmas.",
      tips: [
        "Behave as if the networking element is assessed: speak to apprentices and managers, ask informed questions.",
        "In the group task, involve others and keep track of time; candidates described supportive groups.",
        "Motivation, attitude and engagement are explicitly assessed alongside academics (official).",
      ],
      source: TSR_OFFER26_P2,
      confidence: "single-report",
    },
  ],
  assessmentCentre: {
    text:
      "In-person 'Assessment Evening' in London (late Nov/early Dec 2025) with a group task and a networking element; reported as friendly and straightforward. Official page: candidates progress through assessment centres and insight evenings, and current apprentices and managers participate in selection.",
    source: TSR_OFFER26_P2,
    confidence: "single-report",
  },
  finalInterview: {
    text:
      "Virtual Superday: 2 x 30-minute interviews with different interviewers, mixing motivation and competency with more technical questions. AI tools banned.",
    source: TSR_OFFER26,
    confidence: "multiple-candidate-reports",
  },
  values: [
    "Service, Heart, Curiosity, Courage, Excellence (2024 cycle applicant-advised firm values)",
    "Business principles: exceptional client service, operational excellence, integrity, fairness and responsibility, a great team and winning culture",
    "Prep site: creativity, teamwork and humility (unverified)",
  ],
  pay: { text: "Scotland Graduate Apprenticeships: £24,000 starting salary (2025 intake). Pay for the London and Bournemouth programmes was not published in the sources seen.", source: "https://www.hw.ac.uk/news/2024/heriot-watt-university-and-j.p.-morgan-pave-new-paths-for-graduate-apprenticeships", confidence: "official" },
  dayToDay: [
    "Financial Services apprentices typically join operations or finance teams: checking that client trades and payments settle correctly, investigating breaks and improving processes.",
    "Digital & Technology Solutions apprentices build, test and support the bank's software.",
  ],
  whyThisFirm: [
    { text: "J.P. Morgan reported record second-quarter 2026 net income of $21.2 billion (including a one-off gain on Visa shares); Commercial & Investment Bank revenue rose 27%, with equities trading up 86%.", source: "https://www.jpmorganchase.com/content/dam/jpmc/jpmorgan-chase-and-co/investor-relations/documents/quarterly-earnings/2026/2nd-quarter/6cded9fd-a164-4e6c-8cff-377357cf105c.pdf", confidence: "official" },
  ],
  questions: [
    {
      stage: "Superday (virtual interviews)",
      question: "Motivation and competency questions (for example what motivates you about the programme) plus some more technical questions; 2 x 30 minutes.",
      type: "competency",
      source: TSR_OFFER26,
      confidence: "multiple-candidate-reports",
    },
    {
      stage: "Online application",
      question: "What one trait makes you a unique candidate? (500 words)",
      type: "motivation",
      source: TSR_2025_OPEN,
      confidence: "single-report",
    },
    {
      stage: "Online application",
      question: "How does a place on this programme support your career objectives? (500 words)",
      type: "motivation",
      source: TSR_2025_OPEN,
      confidence: "single-report",
    },
  ],
  specificAdvice: [
    "Apply the day applications open (early September): JPM is rolling and London finance slots went within weeks in 2025.",
    "The application is the main filter for finance: there were no online tests reported for London Finance in 2025, so your CV, cover letter and 500-word answers carry everything.",
    "Check the STEM subject and GCSE Maths 6+ requirements before applying; tech applicants report strict rejection for not having Maths/CS/IT.",
    "Prepare two 30-minute interviews: one persona for motivation/competency and one for technical, with basic financial markets awareness.",
    "Show that you understand the degree provider: Exeter's Applied Finance degree with CISI exams, one study day a week.",
    "No AI in Superday; the invite makes this explicit, and the assessment evening is in person, so practise your in-person networking.",
    "Expect silence: statuses read 'under review' for weeks, and decisions arrive for a whole batch on the same day.",
  ],
  officialLinks: [JPM_OFFICIAL, JPM_PRINCIPLES],
  lastVerified: "2026-10-02",
  gaps: [
    "Browser pass 2 Oct 2026: the official Technology apprenticeship page is a genuine 404 in a real browser, not a block, so it appears to have been removed. TheStudentRoom's 2026 offer-holders thread (read directly, page 2) has candidates describing the in-person Assessment Evening as simple and straightforward with a group task and a networking part, and reporting no outcome for weeks afterwards, in line with the profile. No interview questions were posted there.",
    "Re-checked 2 Oct 2026 by plain fetch: the official Financial Services apprenticeship page confirms 4 years (London, Bournemouth, Edinburgh), the Exeter and Heriot-Watt entry grades, one study day a week and an 'assessment center' and 'insight evening', but gives no stages, dates or salary. The Technology apprenticeship page returned 404.",
    "A search summary of a job-board listing (page not readable) says the 2026 London Technology apprenticeship was posted 1 September 2025 with a deadline of about 2 November 2025, an online Superday in the last two weeks of October or early November and an in-person Assessment Evening in late November or early December. Single report; the 2026/27 cycle is not confirmed.",
    "Other J.P. Morgan routes exist that this profile does not cover (a Glasgow software graduate apprenticeship with Strathclyde; a Bournemouth Level 4 AAT 'Global Finance and Business Management' apprenticeship on Find an Apprenticeship).",
    "WikiJob's grade requirements for J.P. Morgan apprenticeships (three C grades) conflict with the official page (three B grades) and look outdated, so they are not used. The firm values list is not on any page we could read.",
    "Official JPM page for the 2026 cycle (applications from September 2026) not checked beyond the programme page.",
    "Assessment Evening format in detail: only a single brief candidate description; no specific exercises, timings or questions reported.",
    "Whether Pymetrics/HireVue still feature: 2025 London Finance candidates skipped them, but older prep guides and 2024 Bournemouth reports show a telephone interview.",
    "Verbatim Superday questions: none found; Glassdoor was blocked, and r/UKApprenticeships had no retrievable threads.",
    "Technology DA process (separate assessment, HackerRank-style?) not verified.",
    "Official JPM values names as used in early-careers recruitment ('Service, Heart, Curiosity, Courage, Excellence' is from one 2024 forum poster).",
    "Prep-site salary figures for 2025 (GBP 24k Bournemouth, GBP 28k London) are single-source.",
  ],
};
