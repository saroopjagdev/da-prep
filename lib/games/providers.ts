// The test providers whose game-based assessments employers use, and which practice games match each one. This is the
// entry point of the games area: provider first, then the employers that use it, then the games. Games are original
// practice versions of publicly described task types (see lib/games/catalog.ts), never a provider's own tasks.
import type { Confidence } from "@/lib/firms/types";

export type Provider = {
  id: string;
  name: string;
  /** One line for cards. */
  summary: string;
  /** What is publicly known about it, each a plain sentence. */
  whatWeKnow: string[];
  /** Shown as a note when the provider's own tasks cannot be replicated. */
  caution?: string;
  /** Matches a stage's or firm's own text that names this provider. */
  match: RegExp;
  /** Practice games, in the order to show them. Ids from lib/games/catalog.ts. */
  gameIds: string[];
  confidence: Confidence;
  sources: string[];
  /** Page title written for what people search for. Falls back to a generic one. */
  seoTitle?: string;
  /** Plain questions people ask, answered only from what is published; says so where something is not. No FAQ markup (Google withdrew it). */
  faqs?: { q: string; a: string }[];
  /** The date the sources for this page were last read, YYYY-MM-DD. */
  checked: string;
};

/** Advice that is true whichever provider it is, taken from employers' own candidate guidance. */
export const PREPARE_GENERAL = [
  "Do it in a quiet place where nobody will interrupt you, with a stable connection and a laptop or computer if the invitation allows (some tasks are described as laptop-with-mouse tasks).",
  "Read the instructions on each screen before you start. Most game-based assessments begin with a few warm-up items so you can get used to the format.",
  "Answer honestly and instinctively. Where there is no right answer, a profile built from how you really work is what the employer is trying to see.",
  "Check your invitation email for the time limit and anything the employer says about preparation. Where an employer says no preparation is needed, take it at its word.",
  "If you are disabled, neurodivergent or need adjustments, tell the employer before the stage. Employers such as Forvis Mazars say they welcome these requests and ask you to get in touch early.",
] as const;

const OXFORD = "https://www.careers.ox.ac.uk/node/2281861";
const SHORES = "https://help.arcticshores.com/hc/en-gb/articles/35868604027537-The-Arctic-Shores-Task-Based-Assesment-An-Overview";
const PAT = "https://www.practiceaptitudetests.com/testing-publishers/arctic-shores/";
const HV = "https://graduatesfirst.com/hirevue-practice-video-interviews-games";
const TJ = "https://targetjobs.co.uk/careers-advice/cvs-applications-and-tests/graduate-job-hunters-guide-game-based-assessment";
const GRAD = "https://www.gradcracker.com/career-centre/4/online-tests/527/gamification-in-graduate-recruitment";
const GT = "https://www.grantthornton.co.uk/careers/early-careers/employability-hub/our-application-process/";
const MAZARS = "https://careers-uk.forvismazars.com/jobs/selection-process/";
const TJ_MAZARS = "https://targetjobs.co.uk/organisations/forvis-mazars";
const AON_PRESS = "https://hrreview.co.uk/hr-news/supplier-news/new-gamified-ability-tests-are-the-first-to-appeal-to-both-recruiters-and-candidates/110796";

export const GENERAL_ID = "general";

export const PROVIDERS: Provider[] = [
  {
    id: "arctic-shores",
    name: "Arctic Shores",
    summary: "Short game-like tasks that build a picture of how you work, not a right-or-wrong score.",
    whatWeKnow: [
      "Candidates play a set of short game-like tasks, usually on a laptop with a mouse or trackpad. Sources disagree on how many: up to nine or ten is commonly reported, and the employer can configure it.",
      "Commonly described tasks include a balloon-pumping risk task, reacting to shapes, and remembering sequences. Arctic Shores does not publish a full list, so there are tasks we have not replicated.",
      "Results are reported as trait profiles compared with a group and with an employer-set benchmark, not as a score out of a total.",
      "Airbus names Arctic Shores on its own page. For other employers it is reported by candidates or prep sites only.",
    ],
    match: /arctic shores/i,
    gameIds: ["balloon", "direction", "tickets", "security", "sequence"],
    confidence: "multiple-candidate-reports",
    sources: [SHORES, PAT, TJ],
    checked: "2026-11-20",
    seoTitle: "Arctic Shores assessment: the games, how they are scored and how to practise",
    faqs: [
      {
        q: "What is the Arctic Shores assessment?",
        a: "A set of short game-like tasks, usually played on a laptop, that employers use to build a picture of how you work. It is not an exam with right and wrong answers.",
      },
      {
        q: "Is there a pass mark or a score out of a total?",
        a: "Reports describe results as trait profiles compared with a group and with a benchmark the employer sets, so there is no single total to maximise. We have not found the exact benchmark for any employer.",
      },
      {
        q: "How many tasks are there and how long does it take?",
        a: "Sources disagree: up to nine or ten tasks is commonly reported, and the employer can configure it. Check the time in your invitation rather than relying on a figure from a prep site.",
      },
      {
        q: "Which Arctic Shores games can I practise here?",
        a: "Our balloon, direction, tickets, security and block sequence games are original practice versions of task types people commonly describe. Arctic Shores does not publish a full list of its tasks, so there are tasks we have not copied and nothing here is the real thing.",
      },
      {
        q: "Which employers use Arctic Shores?",
        a: "Airbus names it on its own page. For others it is reported by candidates or prep sites only, so treat those as unconfirmed until your invitation says so.",
      },
    ],
  },
  {
    id: "pymetrics",
    name: "Pymetrics (Harver)",
    summary: "A set of short games drawn from cognitive science, compared against a profile.",
    whatWeKnow: [
      "University careers services and prep sites describe a set of short games: a balloon risk game, a card game, a tower planning game, digit span, keypresses, and a money exchange with a computer partner.",
      "Most are described as having no right or wrong answers: your pattern of choices is compared with a profile. Sources differ on the exact number of games and traits.",
      "Pymetrics is now part of Harver. Employers are reported to have used it in earlier cycles, and some candidates describe other providers' games as 'Pymetrics-style'.",
    ],
    match: /pymetrics|harver/i,
    gameIds: ["balloon", "cards", "tower", "digit-span", "keypress", "money-exchange-1", "money-exchange-2", "easy-or-hard", "stop", "arrows", "lengths"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD, TJ],
    checked: "2026-11-20",
    seoTitle: "Pymetrics (Harver) games: what they are and how to practise",
    faqs: [
      {
        q: "What are the Pymetrics games?",
        a: "University careers services and prep sites describe a set of short games: a balloon risk game, a card game, a tower planning game, digit span, keypresses and a money exchange with a computer partner. Sources differ on the exact number and traits measured.",
      },
      {
        q: "Are there right and wrong answers?",
        a: "Most of the games are described as having none. Your pattern of choices is compared with a profile, so there is no mark to chase and cramming does not help.",
      },
      {
        q: "Is Pymetrics still used?",
        a: "It is now part of Harver. Employers are reported to have used it in earlier cycles, and some candidates call other providers' games 'Pymetrics-style', so check your invitation for the real provider.",
      },
      {
        q: "Can I practise the games?",
        a: "Yes, with original practice versions of these task types below. They are not Pymetrics' own games and are not scored the way it scores them.",
      },
    ],
  },
  {
    id: "hirevue-games",
    name: "HireVue games",
    summary: "Short memory and attention games, often alongside a video interview.",
    whatWeKnow: [
      "Candidates describe short memory and attention games delivered through HireVue, before or alongside the video interview.",
      "Described examples are Flashback (is this shape the same as the one just before?) with a 3-minute limit, and Digitspan (remember sequences of digits).",
      "The games are described as adaptive, with no fixed target score: answer as many as you can as it gets harder.",
      "Santander's own page describes online scenario gamification with cognitive and conscientiousness games; BAE Systems candidates report a shape-matching game, a maths game and an image-choice game.",
    ],
    match: /hirevue|santander|\bbae\b/i,
    gameIds: ["flashback", "digit-span", "numerosity", "stop"],
    confidence: "multiple-candidate-reports",
    sources: [HV, TJ],
    checked: "2026-11-20",
    seoTitle: "HireVue games: Flashback, Digitspan and other tasks, and how to practise",
    faqs: [
      {
        q: "What games does HireVue use?",
        a: "Candidates describe short memory and attention games delivered through HireVue: Flashback (is this shape the same as the one just before?) with a 3-minute limit, and Digitspan (remember sequences of digits).",
      },
      {
        q: "Is there a target score?",
        a: "They are described as adaptive with no fixed target: answer as many as you can as it gets harder. Santander's own page describes online scenario gamification with cognitive and conscientiousness games.",
      },
      {
        q: "Are the games part of the video interview?",
        a: "They are reported as coming before or alongside the video interview, as a separate stage. Check the order in your own invitation.",
      },
      {
        q: "Can I practise the HireVue games?",
        a: "You can try original practice versions of the commonly described tasks below. They are not HireVue's, and an employer's configuration may differ.",
      },
    ],
  },
  {
    id: "aon",
    name: "Aon (cut-e)",
    summary: "Gamified reasoning tests, including the switchChallenge puzzle.",
    whatWeKnow: [
      "Aon's switchChallenge is described as a gamified test of about six minutes where you work out which 'switch' reorders a row of shapes, getting harder as you go.",
      "It is reported as adaptive and scored on speed and accuracy. We have a simplified multiple-choice replica with the reported timing.",
    ],
    match: /switch ?challenge|\baon\b|cut-e/i,
    gameIds: ["switch", "grid-challenge", "digit-challenge"],
    confidence: "multiple-candidate-reports",
    sources: ["https://www.gameassessmentprep.com/game-based-assessments", AON_PRESS],
    checked: "2026-11-20",
    seoTitle: "Aon (cut-e) switchChallenge and smartPredict games: what they test and how to practise",
    faqs: [
      {
        q: "What is Aon smartPredict?",
        a: "A launch press release for cut-e's gamified tests describes four games: switchChallenge (logical reasoning), digitChallenge (numeracy), motionChallenge (planning) and gridChallenge (executive attention). Which, if any, you meet depends on the employer.",
      },
      {
        q: "What is switchChallenge?",
        a: "Prep sites describe working out which 'switch' reorders a row of shapes, getting harder as you go, scored on speed and accuracy. Reports of its length vary (3 or 6 minutes), so rely on your invitation.",
      },
      {
        q: "Are Aon's Scales tests the same thing?",
        a: "No. Scales is the non-game family of verbal, numerical and logical reasoning tests. For those see our guide to numerical and verbal reasoning tests.",
      },
      {
        q: "Can I practise Aon's games here?",
        a: "We have one simplified multiple-choice switch puzzle with the reported timing. We do not have the other three games, and none of it is Aon's own material.",
      },
    ],
  },
  {
    id: "neurosight",
    name: "Neurosight",
    summary: "A very short adaptive strengths assessment. Its tasks are not published.",
    whatWeKnow: [
      "Grant Thornton's own process page describes a Neurosight online assessment of under five minutes: an adaptive strengths assessment that starts with warm-up items. Forvis Mazars also names it.",
      "Neurosight does not publish its tasks, and we found no public description of them.",
    ],
    caution:
      "We have not replicated Neurosight, because its tasks are not public. The games here are general short attention and memory tasks that get you used to quick, timed screens. They are not Neurosight's.",
    match: /neurosight/i,
    gameIds: ["flashback", "stop", "digit-span"],
    confidence: "official",
    sources: [GT, MAZARS, TJ_MAZARS],
    checked: "2026-11-20",
    seoTitle: "Neurosight assessment: what it is, how long it takes and how to practise",
    faqs: [
      {
        q: "What is the Neurosight assessment?",
        a: "A short online assessment some firms use early in their process. Grant Thornton describes it as an adaptive strengths assessment, and Forvis Mazars says it measures the strengths that drive high performance at the firm. Neurosight does not publish its tasks.",
      },
      {
        q: "How long does the Neurosight test take?",
        a: "The employers' own wording is about five minutes (Forvis Mazars) or under five (Grant Thornton), while TargetJobs's profile of Forvis Mazars says 6 to 8 minutes. Plan for about ten undisturbed minutes so a slow start does not matter.",
      },
      {
        q: "Can you practise for Neurosight, and does it need preparation?",
        a: "Forvis Mazars says it requires no preparation and opens with a few warm-up questions. Because the tasks are not public we have not copied them, so there is no honest 'Neurosight practice test' to offer. The games below are general quick attention and memory tasks to get you used to short timed screens.",
      },
      {
        q: "Is there a Neurosight pass mark?",
        a: "No pass mark is published. TargetJobs says candidates must succeed in both the application and the assessment to be invited to interview, so it acts as a stage, but the threshold is not given.",
      },
      {
        q: "Do you get feedback after it?",
        a: "Forvis Mazars says candidates receive a personalised feedback report on strengths and development areas. Check your own employer's wording, as other firms may differ.",
      },
      {
        q: "I am neurodivergent or need adjustments. What should I do?",
        a: "Forvis Mazars says the assessment adapts to differences in decision-making style and invites candidates to get in touch about adjustments. Whatever the employer, ask before the stage rather than during it. We have not found a published retake rule, so ask the employer that too.",
      },
      {
        q: "Which employers use Neurosight?",
        a: "Grant Thornton and Forvis Mazars name it on their own pages. The list further down shows the employer guides on this site that mention it.",
      },
    ],
  },
  {
    id: GENERAL_ID,
    name: "Other game-based assessments",
    summary: "Employers that say 'games' or 'game-based' without naming a provider.",
    whatWeKnow: [
      "Some employers describe an interactive game or task-based assessment and do not name the provider (BDO, for example).",
      "Game-based assessments commonly combine memory, attention, reaction and risk tasks. Some measure traits, which have no right answers, and some measure ability.",
    ],
    caution: "Without a named provider we cannot say which tasks you will meet, so these are the most commonly described task types.",
    match: /^$/,
    gameIds: ["flashback", "stop", "digit-span", "balloon", "stroop"],
    confidence: "inferred",
    sources: [TJ, GRAD],
    checked: "2026-11-20",
    faqs: [
      {
        q: "What if my employer just says 'games' or 'game-based'?",
        a: "Then you cannot know which tasks you will meet. Ask the employer, or read your invitation for the provider's name. If it names one of the providers on this site, use that page.",
      },
    ],
  },
];

export const getProvider = (id: string) => PROVIDERS.find((p) => p.id === id);

/** A stage or firm must actually mention games or a game provider before any provider is suggested. */
export const GAME_GATE = /\bgames?\b|gamif|game-based|arctic shores|pymetrics|harver|neurosight|switch ?challenge|cosmic cadet|task-based/i;

/**
 * The providers a stage's text points to. Empty unless it mentions a game-based assessment; the unnamed-provider entry
 * when it does but names no one. Order follows the list above.
 */
export function providersForText(text: string): Provider[] {
  if (!GAME_GATE.test(text)) return [];
  const named = PROVIDERS.filter((p) => p.id !== GENERAL_ID && p.match.test(text));
  return named.length ? named : [PROVIDERS.find((p) => p.id === GENERAL_ID)!];
}
