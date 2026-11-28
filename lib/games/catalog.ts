// The practice games: what each one is, which task type it follows, and which providers are reported to use that style.
// Every game is an ORIGINAL practice version of a task type described publicly (prep sites, university careers services,
// provider help pages). None is a provider's own task, timing or scoring, and none predicts a real result.
import type { Confidence } from "@/lib/firms/types";
import { PROVIDERS, providersForText } from "@/lib/games/providers";

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

const PATENT = "https://patents.google.com/patent/US11030554B2/en";
const GAP_PYM = "https://www.gameassessmentprep.com/pymetrics";
const GAP_ARROWS = "https://www.gameassessmentprep.com/pymetrics/arrows";
const GAP_AS = "https://www.gameassessmentprep.com/arctic-shores";
const AS_GUIDE = "https://5339700.fs1.hubspotusercontent-na1.net/hubfs/5339700/Marketing%20files/Skill-enablers/Arctic_Shores_Skill%20Enablers%20Guide%202025_Digital.pdf";
const BART = "https://www.millisecond.com/library/v7/bart/bart/bart/bart.manual";
const EEFRT = "https://www.millisecond.com/library/v7/effortexpenditureforrewardtask/effortexpenditureforrewardtask/effortexpenditureforrewardtask.manual";
const TOL = "https://www.millisecond.com/library/v7/toweroflondon/toweroflondon/toweroflondon.manual";
const FLANKER = "https://www.millisecond.com/library/v7/flankertask/arrowflankertest/arrowflankertest_keyboard/arrowflankertest_keyboard/arrowflankertest_keyboard.manual";
const HV_AUDIT = "https://www.hirevue.com/wp-content/uploads/2021/04/hirevue-industry-organizational-psychology-audit-report-2021.pdf";

export const GAMES: Game[] = [
  {
    id: "balloon",
    name: "Balloon bank",
    tagline: "Pump for money, bank before it bursts",
    kind: "traits",
    minutes: 6,
    about: "A risk task based on the Balloon Analogue Risk Task. Each pump adds money to the balloon you are holding, but the balloon can burst on any pump and you lose what it held. You decide when to bank. There are three balloon colours, and each bursts in its own pattern, which you can learn.",
    how: ["Press Pump to add 5p to the balloon.", "Press Bank to keep the money. If the balloon bursts first, you lose that balloon's money.", "There are 39 balloons in three colours. There is no time limit.", "Watch the colours: they do not all burst at the same point."],
    looksAt: ["Appetite for risk and how it changes as you learn.", "Whether you adjust after a burst.", "Whether you learn that each colour behaves differently."],
    reportedWith: ["Arctic Shores (balloon task)", "Pymetrics / Harver (balloons)"],
    confidence: "multiple-candidate-reports",
    sources: [BART, PATENT, GAP_PYM, GAP_AS],
    tips: ["There is no single right number of pumps. Play the way you would really decide, and notice which colours burst early."],
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
    name: "Towers",
    tagline: "Rearrange the discs to match the target in as few moves as you can",
    kind: "ability",
    minutes: 4,
    about: "A planning task based on the Tower of London. Five coloured discs sit on three pegs. Rearrange them until your board matches the target board, moving one top disc at a time. Eight puzzles get harder, and the fewest possible moves is shown for each.",
    how: ["Choose a peg to lift its top disc, then choose where to put it.", "Make your board match the target board shown beside it.", "Any number of discs can sit on a peg. Only the top disc can move.", "Eight puzzles, from 2 moves up to 7."],
    looksAt: ["Planning ahead before you act.", "How long you think before the first move.", "How you handle a plan that stops working."],
    reportedWith: ["Pymetrics / Harver (towers)"],
    confidence: "multiple-candidate-reports",
    sources: [PATENT, TOL, GAP_PYM],
    tips: ["Work out the whole route before your first move. Extra moves usually mean a plan that had to be undone."],
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
    tagline: "Is this the same shape as the one 1, 2 or 3 back?",
    kind: "ability",
    minutes: 3,
    about: "An N-back working-memory task. Shapes appear one at a time and you say whether the current shape matches the one a set number of steps back. It starts at 1 back, then moves to 2 back, then 3 back.",
    how: ["Shapes appear one at a time.", "Press Same if it matches the shape N back, Different if it does not.", "The level rises from 1 back to 2 back to 3 back. Count back only from the current level's shapes.", "It runs for 3 minutes."],
    looksAt: ["Working memory: holding and updating what you have just seen.", "Keeping up as the demand rises."],
    reportedWith: ["HireVue games (Flashback)", "Santander (reported HireVue-style games)", "BAE Systems (reported shape-matching game)"],
    confidence: "multiple-candidate-reports",
    sources: [HV, HV_AUDIT, TJ],
    tips: ["Say each shape's name quietly as it appears and keep a running list of the last three. Accuracy matters more than speed."],
  },
  {
    id: "stop",
    name: "Stop",
    tagline: "Press for the red circle, hold back for the green",
    kind: "ability",
    minutes: 3,
    about: "A go / no-go reaction and restraint task. Circles flash one at a time. Press as fast as you can for a red circle, and do nothing when a green one appears.",
    how: ["Wait for a circle.", "Press Space (or the button) as fast as you can for a red circle.", "Do not press for a green circle.", "There are 120 circles, each shown briefly."],
    looksAt: ["Reaction speed and the ability to hold back when a response is wrong.", "Impulse control."],
    reportedWith: ["Pymetrics / Harver (Stop)", "HireVue games (Pulse, a go / no-go task)"],
    confidence: "multiple-candidate-reports",
    sources: [HV_AUDIT, GAP_PYM, PATENT],
    tips: ["Pressing early counts against you, and so does pressing for the wrong colour. Stay ready but wait for what you see."],
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
    id: "money-exchange-1",
    name: "Money Exchange 1",
    tagline: "How much do you trust a computer partner?",
    kind: "traits",
    minutes: 3,
    about: "A trust game. Each round you have 10 and decide how much to send to a partner. What you send is tripled, and the partner decides how much to send back, if anything.",
    how: ["Each round you get 10. Send as much or as little as you like. What you send is tripled.", "Your partner decides how much to send back.", "There are 10 rounds."],
    looksAt: ["Trust, and whether you adjust to how your partner behaves."],
    reportedWith: ["Pymetrics / Harver (Money Exchange 1)"],
    confidence: "multiple-candidate-reports",
    sources: [PATENT, GAP_PYM],
    tips: ["There is no correct amount to send. Choose what you would honestly do, and notice whether your partner's behaviour changes it."],
  },
  {
    id: "money-exchange-2",
    name: "Money Exchange 2",
    tagline: "Fairness: split money with a computer partner",
    kind: "traits",
    minutes: 3,
    about: "A fairness game in two kinds of round. Sometimes your partner offers you a share of 10 and you accept or reject it. Sometimes you offer a share and your partner decides. A rejection leaves both of you with nothing.",
    how: ["Odd rounds: your partner offers you a share of 10. Accept to keep it, or reject so you both get nothing.", "Even rounds: you offer your partner a share of 10. If they reject it you both get nothing.", "There are 10 rounds."],
    looksAt: ["Fairness, generosity, and what you do when an offer feels unfair."],
    reportedWith: ["Pymetrics / Harver (Money Exchange 2)"],
    confidence: "multiple-candidate-reports",
    sources: [PATENT, GAP_PYM],
    tips: ["There is no rule for rejecting or offering. Choose what you would honestly do."],
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
    id: "arrows",
    name: "Arrows",
    tagline: "The colour of the set tells you which arrows to follow",
    kind: "ability",
    minutes: 3,
    about: "An attention and rule-switching task based on the flanker task. Five arrows appear. In a blue or black set, answer the direction of the middle arrow. In a red set, answer the direction of the side arrows. The arrows sometimes point different ways.",
    how: ["Five arrows appear together.", "Blue or black set: press the direction of the middle arrow.", "Red set: press the direction of the side arrows.", "Use the Left and Right arrow keys, or the buttons. There are 90 sets."],
    looksAt: ["Selective attention, cognitive flexibility and processing speed."],
    reportedWith: ["Pymetrics / Harver (Arrows)"],
    confidence: "multiple-candidate-reports",
    sources: [GAP_ARROWS, FLANKER, PATENT],
    tips: ["Look at the colour first, then at the arrows. Errors on red sets usually mean the middle-arrow habit carried over."],
  },
  {
    id: "direction",
    name: "Direction",
    tagline: "Follow the middle arrow, ignore the rest",
    kind: "ability",
    minutes: 3,
    about: "A speed and focus task. A row of arrows appears. Press Q if the middle arrow points left and P if it points right, whatever the surrounding arrows do.",
    how: ["A row of arrows appears.", "Press Q if the middle arrow points left, P if it points right.", "The arrows around it often point the other way. Ignore them.", "There are 80 rounds."],
    looksAt: ["Focus and resistance to distraction at speed."],
    reportedWith: ["Arctic Shores (Direction)"],
    confidence: "multiple-candidate-reports",
    sources: [GAP_AS, FLANKER],
    tips: ["Fix your eyes on the middle arrow. Slowing slightly on the conflicting rounds costs less than errors."],
  },
  {
    id: "tickets",
    name: "Tickets",
    tagline: "Where the ticket sits tells you what to judge",
    kind: "ability",
    minutes: 3,
    about: "A task-switching game. A ticket with a number and a shape appears at the top or bottom of the screen. At the top, judge the number. At the bottom, judge the shape. Reminders disappear after the first few tickets.",
    how: ["Top of the screen: is the number low (1 to 4, press Q) or high (6 to 9, press P)?", "Bottom of the screen: does the shape have no corners (Q) or corners (P)?", "The reminders go after 12 tickets. There are 80."],
    looksAt: ["How well you switch between two rules, and how much switching slows you down."],
    reportedWith: ["Arctic Shores (Tickets)"],
    confidence: "multiple-candidate-reports",
    sources: [GAP_AS],
    tips: ["Decide which rule applies from where the ticket is before you look at it, not after."],
  },
  {
    id: "security",
    name: "Security",
    tagline: "Stop the dial on the highlighted number",
    kind: "ability",
    minutes: 3,
    about: "A timing and precision task. A pointer sweeps round a lock. Stop it on the highlighted number. Open four locks in a row: a miss sends you back to the first, and each lock turns faster.",
    how: ["A pointer sweeps round the dial.", "Press Space to stop it. It has to be on the highlighted number.", "Open four locks in a row. One miss and you start again.", "You have 14 presses in all."],
    looksAt: ["Precision, patience and control under rising speed."],
    reportedWith: ["Arctic Shores (Security)"],
    confidence: "multiple-candidate-reports",
    sources: [AS_GUIDE, GAP_AS],
    tips: ["Wait for the pointer to come round rather than chasing it. Press slightly before it reaches the number."],
  },
  {
    id: "easy-or-hard",
    name: "Easy or Hard",
    tagline: "How much effort will you spend for how big a reward?",
    kind: "traits",
    minutes: 4,
    about: "An effort-for-reward choice based on the Effort Expenditure for Rewards Task. Each round you choose an easy task that always pays a little, or a hard task that pays more but only sometimes. Then you press Space as fast as you can to do it.",
    how: ["Each round shows the easy task (30 presses, always pays £1.00) and the hard task (100 presses, pays more, with a stated chance).", "Choose one, then press Space repeatedly to finish it before time runs out.", "There are 10 rounds."],
    looksAt: ["Willingness to spend effort for reward, and how that changes with the size and odds of the reward."],
    reportedWith: ["Pymetrics / Harver (Easy or Hard)"],
    confidence: "multiple-candidate-reports",
    sources: [EEFRT, PATENT, GAP_PYM],
    tips: ["There is no correct number of hard tasks. A tired hand is part of the real task, so keep your pace steady."],
  },
  {
    id: "lengths",
    name: "Lengths",
    tagline: "Short mouth or long mouth? Points are paid unevenly",
    kind: "traits",
    minutes: 3,
    about: "A reward-learning task. A cartoon face has a mouth that is either a little shorter or a little longer. Pick which. Points are paid for right answers, but one of the two answers pays more often than the other.",
    how: ["A face appears briefly with a short or long mouth.", "Press the Left arrow for short or the Right arrow for long.", "Right answers sometimes earn a point. There are 60 faces."],
    looksAt: ["How much your choices are pulled by reward, as against what you actually see."],
    reportedWith: ["Pymetrics / Harver (Lengths)"],
    confidence: "single-report",
    sources: [PATENT, GAP_PYM],
    tips: ["The difference in the mouths is small. Answer what you see, and notice whether the points start to steer you."],
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

/**
 * The games that match a stage described by free text (its name, provider and format), through the providers it names.
 * A stage must actually mention a game-based assessment, so ordinary test and interview stages get none.
 */
export function gamesForText(text: string): Game[] {
  const out: Game[] = [];
  for (const p of providersForText(text))
    for (const id of p.gameIds) {
      const g = getGame(id);
      if (g && !out.some((o) => o.id === g.id)) out.push(g);
    }
  return out.slice(0, 6);
}

/** The providers whose practice includes this game. */
export const providersForGame = (gameId: string) => PROVIDERS.filter((p) => p.gameIds.includes(gameId));
