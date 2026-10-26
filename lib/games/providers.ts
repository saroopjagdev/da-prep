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
};

const OXFORD = "https://www.careers.ox.ac.uk/node/2281861";
const SHORES = "https://help.arcticshores.com/hc/en-gb/articles/35868604027537-The-Arctic-Shores-Task-Based-Assesment-An-Overview";
const PAT = "https://www.practiceaptitudetests.com/testing-publishers/arctic-shores/";
const HV = "https://graduatesfirst.com/hirevue-practice-video-interviews-games";
const TJ = "https://targetjobs.co.uk/careers-advice/cvs-applications-and-tests/graduate-job-hunters-guide-game-based-assessment";
const GRAD = "https://www.gradcracker.com/career-centre/4/online-tests/527/gamification-in-graduate-recruitment";
const GT = "https://www.grantthornton.co.uk/careers/early-careers/employability-hub/our-application-process/";

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
    gameIds: ["balloon", "reaction", "sequence"],
    confidence: "multiple-candidate-reports",
    sources: [SHORES, PAT, TJ],
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
    gameIds: ["balloon", "cards", "tower", "digit-span", "keypress", "money"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD, TJ],
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
    gameIds: ["flashback", "digit-span", "balloon"],
    confidence: "multiple-candidate-reports",
    sources: [HV, TJ],
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
    gameIds: ["switch"],
    confidence: "multiple-candidate-reports",
    sources: ["https://www.gameassessmentprep.com/game-based-assessments"],
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
    gameIds: ["flashback", "reaction", "digit-span"],
    confidence: "official",
    sources: [GT],
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
    gameIds: ["flashback", "reaction", "digit-span", "balloon", "stroop"],
    confidence: "inferred",
    sources: [TJ, GRAD],
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
