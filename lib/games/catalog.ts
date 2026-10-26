// The practice games: what each one is, which task type it follows, and which providers are reported to use that style.
// Every game is an ORIGINAL practice version of a task type described publicly (prep sites, university careers services,
// provider help pages). None is a provider's own task, timing or scoring, and none predicts a real result.
import type { Confidence } from "@/lib/firms/types";

export const GAME_DISCLAIMER =
  "Independent practice in the style of game-based assessments. Not affiliated with or endorsed by any test provider or employer. Real assessments differ in design, timing and scoring, which providers do not publish, and a result here says nothing about how you would do in one.";

export type GameKind = "traits" | "ability";

export type Game = {
  id: string;
  name: string;
  tagline: string;
  kind: GameKind;
  minutes: number;
  /** What the task type is, in plain words. */
  about: string;
  /** How to play, shown before the start button. */
  how: string[];
  /** What prep sources say this style of task looks at. Reported, not confirmed. */
  looksAt: string[];
  /** Providers or employers this style is reported to appear with. */
  reportedWith: string[];
  confidence: Confidence;
  sources: string[];
  tips: string[];
  /** Open an existing replica test instead of a game page. */
  href?: string;
};

const OXFORD = "https://www.careers.ox.ac.uk/node/2281861";
const PAT = "https://www.practiceaptitudetests.com/testing-publishers/arctic-shores/";
const HV = "https://graduatesfirst.com/hirevue-practice-video-interviews-games";
const TJ = "https://targetjobs.co.uk/careers-advice/cvs-applications-and-tests/graduate-job-hunters-guide-game-based-assessment";

export const GAMES: Game[] = [
  {
    id: "balloon",
    name: "Balloon bank",
    tagline: "Pump for points, bank before it bursts",
    kind: "traits",
    minutes: 5,
    about: "A risk task. Each pump adds points to the balloon you are holding, but the balloon can burst on any pump and you lose what it held. You decide when to bank.",
    how: ["Press Pump to add points to the balloon.", "Press Bank to keep the points. If the balloon bursts first, you lose that balloon's points.", "There are 10 balloons. Each bursts at a different point."],
    looksAt: ["Appetite for risk and how it changes as you learn.", "Whether you adjust after a burst."],
    reportedWith: ["Arctic Shores (balloon task)", "Pymetrics / Harver (balloon)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD, PAT],
    tips: ["There is no single right number of pumps. Play the way you would really decide, and learn from each balloon."],
  },
  {
    id: "cards",
    name: "Four decks",
    tagline: "Learn which decks are worth drawing from",
    kind: "traits",
    minutes: 5,
    about: "A learning-under-risk task. Four decks of cards each pay and cost different amounts, and you are not told which are better. You work it out as you go.",
    how: ["Pick a card from any of the four decks, 40 times.", "Each card pays a gain and sometimes a loss, shown after you pick.", "Your aim is to finish with as many points as you can."],
    looksAt: ["How quickly you learn from losses and gains.", "Whether you chase big wins or settle on steadier decks."],
    reportedWith: ["Pymetrics / Harver (card games)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD],
    tips: ["Keep track of what each deck has done to your total so far, not only of the last card."],
  },
  {
    id: "tower",
    name: "Tower",
    tagline: "Move the stack across in as few moves as you can",
    kind: "ability",
    minutes: 5,
    about: "A planning task. Move a stack of discs to the right-hand peg, one disc at a time, never putting a bigger disc on a smaller one.",
    how: ["Select a peg to pick up its top disc, then select where to put it.", "A larger disc cannot go on a smaller one.", "Three levels, from 3 to 5 discs."],
    looksAt: ["Planning ahead before you act.", "How you handle a plan that stops working."],
    reportedWith: ["Pymetrics / Harver (tower task)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD],
    tips: ["Take a moment to plan the first few moves. The fewest moves possible for n discs is 2 to the power n, minus 1."],
  },
  {
    id: "digit-span",
    name: "Digit span",
    tagline: "Remember a growing string of digits",
    kind: "ability",
    minutes: 4,
    about: "A short-term memory task. Digits flash up one at a time and you type them back in the same order. The string gets longer when you get one right.",
    how: ["Watch the digits appear one by one.", "Type them back in order, then press Check.", "The game ends after two wrong answers."],
    looksAt: ["Working memory: how much you can hold in mind at once."],
    reportedWith: ["Pymetrics / Harver (digits)", "HireVue games (Digitspan)", "Santander (reported HireVue-style games)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD, HV],
    tips: ["Group digits into chunks (for example 3 then 4) rather than holding each one separately."],
  },
  {
    id: "flashback",
    name: "Flashback",
    tagline: "Is this the same shape as the last one?",
    kind: "ability",
    minutes: 3,
    about: "An attention and memory task. A shape appears. If it is the same as the one just before it, say so. If it is different, say that.",
    how: ["Shapes appear one at a time.", "Press Same if it matches the previous shape, Different if it does not.", "The first shape has nothing before it, so it is Different. It runs for 3 minutes."],
    looksAt: ["Attention, short-term memory and keeping up as the pace continues."],
    reportedWith: ["HireVue games (Flashback)", "Santander (reported HireVue-style games)", "BAE Systems (reported shape-matching game)"],
    confidence: "multiple-candidate-reports",
    sources: [HV, TJ],
    tips: ["Accuracy and speed both matter. Keep a steady rhythm rather than rushing then freezing."],
  },
  {
    id: "reaction",
    name: "Shape reaction",
    tagline: "React to some shapes, hold back on others",
    kind: "ability",
    minutes: 3,
    about: "A reaction and restraint task. React as fast as you can to a green circle, and do nothing when a red square appears.",
    how: ["Wait for a shape.", "Press Space (or tap the big button) as fast as you can for the green circle.", "Do not press for the red square."],
    looksAt: ["Reaction speed and the ability to hold back when a response is wrong."],
    reportedWith: ["Arctic Shores (reacting to shapes, reported)", "Pymetrics-style reaction tasks"],
    confidence: "multiple-candidate-reports",
    sources: [PAT, TJ],
    tips: ["Wait for the shape. Pressing early counts against you, and so does pressing for the wrong one."],
  },
  {
    id: "sequence",
    name: "Block sequence",
    tagline: "Repeat the order the tiles lit up",
    kind: "ability",
    minutes: 4,
    about: "A visual memory task. Tiles light up in order and you tap them back in the same order. The sequence gets longer when you get one right.",
    how: ["Watch the tiles light up.", "Tap them in the same order.", "The game ends after two wrong answers."],
    looksAt: ["Visual and spatial working memory."],
    reportedWith: ["Arctic Shores (memory sequences, reported)"],
    confidence: "multiple-candidate-reports",
    sources: [PAT, TJ],
    tips: ["Look for a path or shape the sequence makes, and try to say it to yourself as you watch."],
  },
  {
    id: "keypress",
    name: "Keypress",
    tagline: "Press when told, wait when told",
    kind: "traits",
    minutes: 2,
    about: "A speed and instruction-following task. You are told when to press as fast as you can and when to wait.",
    how: ["When it says Press, press Space (or the button) as fast as you can.", "When it says Wait, stop.", "It changes between the two, five times."],
    looksAt: ["Speed, consistency, and following a changing instruction."],
    reportedWith: ["Pymetrics / Harver (keypresses)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD],
    tips: ["Pressing during Wait is what the task is checking. Watch the cue, not your finger."],
  },
  {
    id: "money",
    name: "Money exchange",
    tagline: "Trust and fairness with a computer partner",
    kind: "traits",
    minutes: 5,
    about: "A two-part task with a computer partner. First you decide how much of your money to send them, knowing they may or may not send some back. Then you accept or reject offers of how to split money.",
    how: ["Part 1: each round you get 10. Send as much or as little as you like. What you send is tripled.", "Your partner decides how much to send back.", "Part 2: your partner offers you a share of 10. Accept to keep it, or reject and you both get nothing."],
    looksAt: ["Trust, and how you respond to fairness.", "Whether you adjust to how your partner behaves."],
    reportedWith: ["Pymetrics / Harver (money exchange)"],
    confidence: "multiple-candidate-reports",
    sources: [OXFORD],
    tips: ["There is no correct amount to send or rule for rejecting. Choose what you would honestly do."],
  },
  {
    id: "stroop",
    name: "Colour words",
    tagline: "Say the colour of the ink, not the word",
    kind: "ability",
    minutes: 3,
    about: "An attention task. A colour word appears in coloured ink and sometimes the two disagree. Choose the colour of the ink.",
    how: ["A word appears, such as the word RED in blue ink.", "Choose the colour of the ink (here, blue), ignoring what the word says.", "Use the buttons, or keys 1 to 4. There are 40 words."],
    looksAt: ["Attention and the ability to ignore a distracting cue."],
    reportedWith: ["A standard attention task found in many cognitive batteries; not reported for a named employer"],
    confidence: "inferred",
    sources: [TJ],
    tips: ["Slow slightly on the words where the ink and word disagree. Accuracy matters more than speed."],
  },
  {
    id: "switch",
    name: "Switch puzzles",
    tagline: "Work out which switch reorders the shapes",
    kind: "ability",
    minutes: 6,
    about: "A reasoning game: find the code that turns a row of shapes into another order. This is the existing Switch replica.",
    how: ["Open the Switch replica test."],
    looksAt: ["Reasoning under time pressure."],
    reportedWith: ["Aon switchChallenge"],
    confidence: "multiple-candidate-reports",
    sources: ["https://www.gameassessmentprep.com/game-based-assessments"],
    tips: ["See the replica test page for the timing and format."],
    href: "/tests/switch-challenge",
  },
];

export const getGame = (id: string) => GAMES.find((g) => g.id === id);
export const PLAYABLE = GAMES.filter((g) => !g.href);

const byId = (...ids: string[]) => ids.map((i) => getGame(i)!).filter(Boolean);

/**
 * The games that match a stage described by free text (its name, provider and format). A stage must actually mention
 * a game-based assessment, so ordinary test and interview stages get none. Returns at most six.
 */
export function gamesForText(text: string): Game[] {
  if (!/\bgames?\b|gamif|game-based|arctic shores|pymetrics|harver|neurosight|switch ?challenge|cosmic cadet|task-based/i.test(text)) return [];
  const out: Game[] = [];
  const add = (...g: Game[]) => g.forEach((x) => out.some((o) => o.id === x.id) || out.push(x));
  if (/arctic shores/i.test(text)) add(...byId("balloon", "reaction", "sequence"));
  if (/pymetrics|harver/i.test(text)) add(...byId("balloon", "cards", "tower", "digit-span", "keypress", "money"));
  if (/hirevue|santander|bae/i.test(text)) add(...byId("flashback", "digit-span", "balloon"));
  if (/switch ?challenge|aon|cut-e/i.test(text)) add(...byId("switch"));
  if (out.length === 0) add(...byId("flashback", "reaction", "digit-span", "balloon"));
  return out.slice(0, 6);
}
