// Catalogue of replica tests. Each one follows the published FORMAT of a real employer assessment (counts, timing,
// response style, rules) with original items. `formatNotes` says what is confirmed and what is approximated, so the
// app never implies more precision than the research supports. Sources: docs/research/02-assessment-formats.md.

import { CAPP_NUMERICAL } from "@/lib/assess/banks/capp-numerical";
import { CAPP_CRITICAL, CAPP_CRITICAL_STIMULI, CAPP_VERBAL, CAPP_VERBAL_STIMULI } from "@/lib/assess/banks/capp-verbal";
import { DEDUCTIVE } from "@/lib/assess/banks/deductive";
import { AUDIT_SIM, BANKING_SIM } from "@/lib/assess/banks/job-sim";
import { HSBC_SIMULATE } from "@/lib/assess/banks/hsbc-simulate";
import { INDUCTIVE } from "@/lib/assess/banks/inductive";
import { NUMERICAL } from "@/lib/assess/banks/numerical";
import { NUMERICAL_TF } from "@/lib/assess/banks/numerical-tf";
import { SJT } from "@/lib/assess/banks/sjt";
import { SJT_HARD } from "@/lib/assess/banks/sjt-hard";
import { SWITCH } from "@/lib/assess/banks/switch";
import { TRAIT_BANK } from "@/lib/assess/banks/traits";
import { VERBAL_TF, VERBAL_TF_STIMULI } from "@/lib/assess/banks/verbal-tf";
import type { Section, Test } from "@/lib/assess/types";

const SHL_NUM = "https://www.shl.com/assets/documents/rebranded-assets/product-factsheet-verify-interactive-numerical-reasoning.pdf";
const SHL_IND = "https://www.shl.com:443/assets/documents/rebranded-assets/product-factsheet-verify-interactive-inductive.pdf";
const SHL_DED = "https://service.shl.com/docs/Product Factsheet_Verify Interactive Deductive.pdf";
const AD_CUTE = "https://www.assessmentday.co.uk/cut-e.htm";
const AD_SHL = "https://www.assessmentday.co.uk/shl.htm";
const PAT_SJT = "https://www.practiceaptitudetests.com/resources/situational-judgement-test-response-formats/";
const CS_SJT = "https://www.gov.uk/guidance/preparing-for-the-new-civil-service-judgement-test";
const GF_CAPP = "https://www.graduatesfirst.com/aptitude-tests-publishers/cappfinity";
const PAT_CAPP = "https://www.practiceaptitudetests.com/testing-publishers/cappfinity/";
const HEY_CR = "https://heycademy.com/en/cappfinity-critical-reasoning-test/";
const GF_HSBC_SIM = "https://www.graduatesfirst.com/hsbc-job-simulation";
const SIM_NOTES = [
  "Reported format: a fictional working day delivered through emails, documents and data, mixing situational judgement, numerical and verbal tasks, and sometimes a typed email reply (prep-site reports of Cappfinity simulations at HSBC, Deloitte, KPMG and EY). Real versions also use videos and voicemails, which this replica does not.",
  "Time-recorded here, and you cannot go back, as in a real day. Typed replies are not auto-marked: the results show a checklist and an example to compare against.",
];

const section = (s: Partial<Section> & Pick<Section, "id" | "title" | "instructions" | "items" | "timing">): Section => ({
  allowBack: false,
  calculator: false,
  showFeedback: false,
  ...s,
});

export const TESTS: Test[] = [
  {
    id: "shl-numerical",
    name: "Numerical reasoning (SHL Verify Interactive style)",
    replicates: "SHL Verify Interactive Numerical Reasoning",
    kind: "ability",
    confidence: "official",
    approximate: true,
    formatNotes: [
      "Up to 10 questions in 18 minutes, one timer for the whole test (SHL factsheet).",
      "Adaptive in the real test. Here, difficulty steps up after a correct answer and down after a wrong one (an approximation).",
      "The real test has you build charts and fill in spreadsheets; this replica uses multiple choice questions on tables and charts.",
      "SHL does not publish its calculator or going-back rules. Here a calculator is provided and you cannot go back.",
    ],
    sources: [SHL_NUM, AD_SHL],
    sections: [
      section({
        id: "num",
        title: "Numerical reasoning",
        instructions: "Answer questions using the tables and charts. Work quickly and accurately: you have 18 minutes in total for up to 10 questions.",
        items: NUMERICAL.items,
        stimuli: NUMERICAL.stimuli,
        timing: { mode: "section", seconds: 18 * 60 },
        calculator: true,
        adaptive: { count: 10 },
      }),
    ],
  },
  {
    id: "shl-inductive",
    name: "Inductive reasoning (SHL Verify Interactive style)",
    replicates: "SHL Verify Interactive Inductive Reasoning",
    kind: "ability",
    confidence: "official",
    approximate: true,
    formatNotes: [
      "Up to 15 questions in 18 minutes, one timer for the whole test (SHL factsheet).",
      "The real test uses shapes and alphanumeric sequences. This replica uses number, letter and symbol sequences.",
      "Adaptive in the real test; approximated here.",
    ],
    sources: [SHL_IND, AD_SHL],
    sections: [
      section({
        id: "ind",
        title: "Inductive reasoning",
        instructions: "Work out the rule in each sequence and choose what comes next. You have 18 minutes in total for up to 15 questions.",
        items: INDUCTIVE,
        timing: { mode: "section", seconds: 18 * 60 },
        adaptive: { count: 15 },
      }),
    ],
  },
  {
    id: "shl-deductive",
    name: "Deductive reasoning (SHL Verify Interactive style)",
    replicates: "SHL Verify Interactive Deductive Reasoning",
    kind: "ability",
    confidence: "official",
    approximate: true,
    formatNotes: [
      "Up to 12 questions in 18 minutes (SHL factsheet, read through a search summary).",
      "SHL describes calendar and scheduling logic; this replica uses weekday scheduling puzzles.",
      "Adaptive in the real test; approximated here. Rules on notes and calculators are not published.",
    ],
    sources: [SHL_DED, AD_SHL],
    sections: [
      section({
        id: "ded",
        title: "Deductive reasoning",
        instructions: "Use the rules to work out which day each task is on. You have 18 minutes in total for up to 12 questions.",
        items: DEDUCTIVE.items,
        timing: { mode: "section", seconds: 18 * 60 },
        adaptive: { count: 12 },
      }),
    ],
  },
  {
    id: "scales-numerical",
    name: "Numerical statements, short form (Aon/cut-e scales style)",
    replicates: "Aon/cut-e scales numerical (short form)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: 18 true / false / cannot say statements on data in 6 minutes for the short form (prep-site reports; no official Aon guide found). The full test reports 37 items in 12 minutes.",
      "Aon does not publish its calculator or going-back rules. Here a calculator is provided and you can go back.",
      "Very fast: about 20 seconds per statement. Expect not to finish everything.",
      "Each attempt serves 3 of 16 tables (retail, fee income, trading desks and branch deposits), so repeat attempts differ.",
    ],
    sources: [AD_CUTE],
    sections: [
      section({
        id: "scn",
        title: "Numerical statements",
        instructions: "Decide whether each statement is true, false or cannot be said from the data given. You have 6 minutes for 18 statements.",
        items: NUMERICAL_TF.items,
        stimuli: NUMERICAL_TF.stimuli,
        timing: { mode: "section", seconds: 6 * 60 },
        calculator: true,
        allowBack: true,
        sample: { count: 18, byStimulus: true },
      }),
    ],
  },
  {
    id: "scales-verbal",
    name: "Verbal statements (Aon/cut-e scales style)",
    replicates: "Aon/cut-e scales verbal",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: 49 true / false / cannot say statements in 12 minutes (prep-site reports). This replica keeps the same pace (about 15 seconds per statement) over 18 statements, so 265 seconds.",
      "No official Aon guide found; going-back rule is not published, so you can go back here.",
      "Each attempt serves 3 of 8 passages, so repeat attempts differ.",
    ],
    sources: [AD_CUTE],
    sections: [
      section({
        id: "scv",
        title: "Verbal statements",
        instructions: "Read each passage and decide whether each statement is true, false or cannot be said from the passage alone. You have about 4 minutes for 18 statements.",
        items: VERBAL_TF,
        stimuli: VERBAL_TF_STIMULI,
        timing: { mode: "section", seconds: 265 },
        allowBack: true,
        sample: { count: 18, byStimulus: true },
      }),
    ],
  },
  {
    id: "scales-numerical-full",
    name: "Numerical statements, full length (Aon/cut-e scales style)",
    replicates: "Aon/cut-e scales numerical (full length)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: 37 true / false / cannot say statements on data in 12 minutes (prep-site reports; no official Aon guide found). Real versions show data in up to 6 tabs, one visible at a time; this replica shows one table per group of statements.",
      "A calculator is provided and you can go back. Expect not to finish: about 19 seconds per statement.",
    ],
    sources: [AD_CUTE],
    sections: [
      section({
        id: "scnf",
        title: "Numerical statements",
        instructions: "Decide whether each statement is true, false or cannot be said from the data given. You have 12 minutes for 37 statements.",
        items: NUMERICAL_TF.items,
        stimuli: NUMERICAL_TF.stimuli,
        timing: { mode: "section", seconds: 12 * 60 },
        calculator: true,
        allowBack: true,
        sample: { count: 37, byStimulus: true, exact: true },
      }),
    ],
  },
  {
    id: "scales-verbal-full",
    name: "Verbal statements, full length (Aon/cut-e scales style)",
    replicates: "Aon/cut-e scales verbal (full length)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: 49 true / false / cannot say statements in 12 minutes (prep-site reports). This replica uses all 48 of our statements at the same pace, so 705 seconds.",
      "You can go back. Expect not to finish: about 15 seconds per statement.",
    ],
    sources: [AD_CUTE],
    sections: [
      section({
        id: "scvf",
        title: "Verbal statements",
        instructions: "Read each passage and decide whether each statement is true, false or cannot be said from the passage alone. You have just under 12 minutes for 48 statements.",
        items: VERBAL_TF,
        stimuli: VERBAL_TF_STIMULI,
        timing: { mode: "section", seconds: 705 },
        allowBack: true,
      }),
    ],
  },
  {
    id: "switch-challenge",
    name: "Switch puzzles (Aon switchChallenge style)",
    replicates: "Aon switchChallenge (game-based)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: a gamified test of about 6 minutes where you work out which 'switch' reorders a row of shapes, getting harder as you go (prep-site reports). The real game is adaptive, animated and scored on speed and accuracy; this is a simplified multiple-choice version.",
      "Codes are four digits: position 1 of the output takes the shape at the code's first digit, and so on. The second half chains two switches.",
    ],
    sources: ["https://www.gameassessmentprep.com/game-based-assessments"],
    sections: [
      section({
        id: "sw",
        title: "Switch puzzles",
        instructions:
          "Each switch reorders four shapes. A code like 3142 means: the first shape out is the 3rd shape in, the second is the 1st, the third is the 4th and the fourth is the 2nd. Choose the code that turns the input into the output. You have 6 minutes; work quickly.",
        items: SWITCH,
        timing: { mode: "section", seconds: 6 * 60 },
      }),
    ],
  },
  {
    id: "work-scenarios",
    name: "Work scenarios (SHL style, as used by NatWest)",
    replicates: "SHL situational judgement 'work scenarios' assessment",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: about 14 untimed workplace scenarios where you judge which responses are most and least effective (prep-site reports of NatWest's Work Scenarios assessment, run by SHL; NatWest's own page says about 20 to 25 minutes).",
      "Each attempt serves 14 of our 24 stretch scenarios. Every option is plausible and the key turns on a trade-off, as in the real assessment; the key follows published employer behaviours, not SHL's own (unpublished) scoring key.",
    ],
    sources: ["https://www.graduatesfirst.com/rbs-natwest-work-scenarios-assessment", "https://jobs.natwestgroup.com/pages/degree-apprenticeships"],
    sections: [
      section({
        id: "ws",
        title: "Work scenarios",
        instructions: "For each scenario, choose the MOST effective and the LEAST effective response. There is no time limit, but the real assessment takes about 20 to 25 minutes.",
        items: SJT_HARD.mostLeast,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 14 },
      }),
    ],
  },
  {
    id: "sjt-most-least",
    name: "Situational judgement: most and least effective (foundation)",
    replicates: "SHL-style situational judgement test",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: choose the most effective and the least effective response from 4 or 5 options (prep-site reports). Partial credit is reported when only one pick is right, and that is how this replica scores it.",
      "Item counts and time limits vary by employer and are not published. This replica is untimed with 10 scenarios per attempt, drawn from 24 (including 14 set in banking and finance).",
    ],
    sources: [PAT_SJT],
    sections: [
      section({
        id: "ml",
        title: "Most and least effective",
        instructions: "For each scenario, choose the response you think is the MOST effective and the one you think is the LEAST effective.",
        items: SJT.mostLeast,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 10 },
      }),
    ],
  },
  {
    id: "sjt-rate-each",
    name: "Situational judgement: rate every action (Civil Service style, foundation)",
    replicates: "Civil Service Judgement Test, part 2",
    kind: "ability",
    confidence: "official",
    approximate: true,
    formatNotes: [
      "Official format: each scenario has 4 actions and you rate each as Counterproductive, Ineffective, Fairly effective or Effective. The real test is untimed, with 3 scenarios per behaviour (Civil Service guidance).",
      "This replica serves 6 scenarios per attempt from a pool of 12 (half set in finance), not the full set. The real test also has a self-assessment part worth 15%, which is not included. The Civil Service does not publish its scoring key, so half credit for a rating one step away is our approximation.",
    ],
    sources: [CS_SJT],
    sections: [
      section({
        id: "re",
        title: "Rate each action",
        instructions: "For each scenario, rate how effective each action would be. You can rate several actions the same way.",
        items: SJT.rateEach,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 6 },
      }),
    ],
  },
  {
    id: "sjt-ranking",
    name: "Situational judgement: ranking responses (foundation)",
    replicates: "Ranking-style situational judgement items",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Some employers (for example Deloitte's immersive assessment) ask candidates to rank the most and least likely actions in workplace scenarios. Timings are not published.",
      "This replica asks you to rank four to five responses from best to worst and scores the fraction of pairs in the right order. It is untimed and serves 4 scenarios per attempt from a pool of 10.",
    ],
    sources: ["https://www.deloitte.com/uk/en/careers/early-careers/early-careers-assessment.html"],
    sections: [
      section({
        id: "rk",
        title: "Rank the responses",
        instructions: "Put the options in order, best first. Use the arrows to move an option up or down.",
        items: SJT.rank,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 4 },
      }),
    ],
  },
  {
    id: "sjt-most-least-stretch",
    name: "Situational judgement: most and least effective (stretch)",
    replicates: "SHL-style situational judgement test, at employer difficulty",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Same format as the foundation test, but every option is something a sensible person might do and the best answer is settled by a trade-off (speed against process, honesty against loyalty, helpfulness against authority). Prep sites describe real tests the same way: plausible options, and the marks sit in telling a good response from a nearly-good one.",
      "The key follows published employer behaviours (ownership, honesty, telling the right person early, safety, confidentiality, staying within your authority). Real tests are scored against each employer's own expert key, which is not public, so a high score here does not guarantee the same on the real thing. Serves 12 scenarios from 24, across finance, audit, engineering, tech, construction and public service.",
    ],
    sources: [PAT_SJT],
    sections: [
      section({
        id: "mls",
        title: "Most and least effective",
        instructions: "For each scenario, choose the response you think is the MOST effective and the one you think is the LEAST effective. Several responses will look reasonable: pick the one that best fits the behaviours employers look for.",
        items: SJT_HARD.mostLeast,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 12 },
      }),
    ],
  },
  {
    id: "sjt-rate-each-stretch",
    name: "Situational judgement: rate every action (Civil Service style, stretch)",
    replicates: "Civil Service Judgement Test, part 2, at employer difficulty",
    kind: "ability",
    confidence: "official",
    approximate: true,
    formatNotes: [
      "Official format: each scenario has 4 actions and you rate each as Counterproductive, Ineffective, Fairly effective or Effective, independently of the others (Civil Service guidance).",
      "Here the actions are close together in quality, so you have to separate a good response from a nearly-good one. Serves 8 scenarios from 12. The Civil Service does not publish its keys or pass marks (scores are reported against a representative group), so treat the percentage as practice only. The real test's self-assessment part is not included.",
    ],
    sources: [CS_SJT],
    sections: [
      section({
        id: "res",
        title: "Rate each action",
        instructions: "For each scenario, rate how effective each action would be. You can rate several actions the same way.",
        items: SJT_HARD.rateEach,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 8 },
      }),
    ],
  },
  {
    id: "sjt-ranking-stretch",
    name: "Situational judgement: ranking responses (stretch)",
    replicates: "Ranking-style situational judgement items, at employer difficulty",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Rank four responses from most to least effective. In real ranking items the marks sit in the middle positions, so the options here are all defensible and the order depends on how each one compares with the others.",
      "Scored as the fraction of pairs in the right order. Untimed; serves 6 scenarios from 10.",
    ],
    sources: ["https://www.deloitte.com/uk/en/careers/early-careers/early-careers-assessment.html"],
    sections: [
      section({
        id: "rks",
        title: "Rank the responses",
        instructions: "Put the options in order, best first. Use the arrows to move an option up or down.",
        items: SJT_HARD.rank,
        timing: { mode: "untimed" },
        allowBack: true,
        sample: { count: 6 },
      }),
    ],
  },
  {
    id: "capp-numerical",
    name: "Numerical reasoning, mixed answers (Cappfinity style)",
    replicates: "Cappfinity numerical reasoning (time-recorded)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: about 12 to 15 questions on tables and charts, with mixed answer types: choose one, type the number, or put values in order (prep-site reports; Cappfinity publishes no item counts).",
      "Employers choose whether the test is time-limited, adaptive or time-recorded. This replica is time-recorded: no countdown, but your time is shown, and speed is reported to count when time is recorded.",
      "A calculator is reported to be allowed. Each attempt serves 3 of 8 tables (12 questions).",
    ],
    sources: [GF_CAPP, PAT_CAPP],
    sections: [
      section({
        id: "cnum",
        title: "Numerical reasoning",
        instructions: "Answer each question from the table. Some ask you to type a number, some to choose an answer and some to put values in order. There is no time limit, but your time is recorded, so work quickly and accurately.",
        items: CAPP_NUMERICAL.items,
        stimuli: CAPP_NUMERICAL.stimuli,
        timing: { mode: "recorded" },
        calculator: true,
        sample: { count: 12, byStimulus: true },
      }),
    ],
  },
  {
    id: "capp-verbal",
    name: "Verbal reasoning, mixed answers (Cappfinity style)",
    replicates: "Cappfinity verbal reasoning (time-recorded)",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported answer styles: fill the gap, match a statement to the passage, rank statements, and true/false (prep-site reports). Item counts vary by employer and are not published.",
      "Time-recorded here: no countdown, but your time is shown. Each attempt serves 3 of 4 passages (12 questions).",
    ],
    sources: [GF_CAPP, PAT_CAPP],
    sections: [
      section({
        id: "cverb",
        title: "Verbal reasoning",
        instructions: "Read each passage and answer the questions using only what it says. There is no time limit, but your time is recorded.",
        items: CAPP_VERBAL,
        stimuli: CAPP_VERBAL_STIMULI,
        timing: { mode: "recorded" },
        sample: { count: 12, byStimulus: true },
      }),
    ],
  },
  {
    id: "capp-critical",
    name: "Critical reasoning, five styles (Cappfinity style)",
    replicates: "Cappfinity critical reasoning (time-recorded)",
    kind: "ability",
    confidence: "single-report",
    approximate: true,
    formatNotes: [
      "Reported format: five question styles in one test: logical conclusions, beyond reasonable doubt, strong or weak arguments, true/false/cannot say, and assumptions, with time recorded (single prep-site report).",
      "Each attempt serves about 12 of 20 questions, mixing the styles.",
    ],
    sources: [HEY_CR],
    sections: [
      section({
        id: "ccrit",
        title: "Critical reasoning",
        instructions: "Each question says what to decide: which conclusion must be true, whether a conclusion follows beyond reasonable doubt, whether an argument is strong or weak, whether a statement is true, false or cannot be said, or whether an assumption is made. Your time is recorded.",
        items: CAPP_CRITICAL,
        stimuli: CAPP_CRITICAL_STIMULI,
        timing: { mode: "recorded" },
        sample: { count: 12, byStimulus: true },
      }),
    ],
  },
  {
    id: "job-sim-banking",
    name: "Job simulation: a day in commercial banking",
    replicates: "Immersive job simulation (Cappfinity style), banking",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: SIM_NOTES,
    sources: [GF_HSBC_SIM, GF_CAPP],
    sections: [
      section({
        id: "simbk",
        title: "Your day at Northfield Bank",
        instructions:
          "You're an apprentice supporting Sam, a relationship manager who looks after business clients. Work through your inbox in order and respond to each message. Your time is recorded and you can't go back.",
        items: BANKING_SIM.items,
        stimuli: BANKING_SIM.stimuli,
        timing: { mode: "recorded" },
        calculator: true,
      }),
    ],
  },
  {
    id: "hsbc-simulate",
    name: "HSBC Simulate-style assessment: five tiles in a working day",
    replicates: "HSBC Simulate immersive assessment (built by Cappfinity), banking and Wealth routes",
    kind: "ability",
    mixedWorkStyle: true,
    confidence: "single-report",
    approximate: true,
    formatNotes: [
      "Reported structure (prep-site reports, not HSBC): five tiles done in order, Project Kick-Off, Global Engagement, Data Monitoring, Navigating Competing Commitments and Pause and Reflect, with about 38 questions in total.",
      "Reported question counts by tile: 4, 4, 10, 9 and 11. About 16 questions in all are cognitive (data interpretation, verbal, inductive) and about 22 are situational judgement or work-style. How these split across tiles 3 and 4 is not published, so that split is our estimate.",
      "Reported response styles: tables, graphs and text for the cognitive questions, and ranking or rating several actions for the judgement questions. The final tile also includes work-style statements with no right answer.",
      "HSBC does not say the simulation is timed. Here your time is recorded, you cannot go back, and a calculator is offered on the two data tiles only.",
      "The real simulation also includes video, audio and voicemail clips, which this replica does not. Every scenario, figure and statement here is original and the company and people are invented.",
    ],
    sources: [GF_HSBC_SIM, "https://www.jobtestprep.co.uk/hsbc-online-immersive-assessment"],
    sections: HSBC_SIMULATE.map((t) =>
      section({
        id: t.id,
        title: t.title,
        instructions: t.instructions,
        items: t.tile.items,
        stimuli: t.tile.stimuli,
        timing: { mode: "recorded" },
        calculator: t.calculator,
      }),
    ),
  },
  {
    id: "job-sim-audit",
    name: "Job simulation: a day on an audit",
    replicates: "Immersive job simulation (Cappfinity style), audit and professional services",
    kind: "ability",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: SIM_NOTES,
    sources: [GF_CAPP],
    sections: [
      section({
        id: "simau",
        title: "Your day on the Brightwater audit",
        instructions:
          "You're an audit apprentice working for Aisha, an audit senior, on the audit of a logistics company. Work through your inbox in order and respond to each message. Your time is recorded and you can't go back.",
        items: AUDIT_SIM.items,
        stimuli: AUDIT_SIM.stimuli,
        timing: { mode: "recorded" },
        calculator: true,
      }),
    ],
  },
  {
    id: "work-style-forced-choice",
    name: "Work-style questionnaire: most and least like me (OPQ style)",
    replicates: "SHL OPQ-style forced-choice personality questionnaire",
    kind: "trait",
    confidence: "multiple-candidate-reports",
    approximate: true,
    formatNotes: [
      "Reported format: for each block, pick the statement MOST like you, then the one LEAST like you (prep-site reports). The real OPQ32 has over a hundred blocks and takes about 25 to 30 minutes; this replica has 12 blocks.",
      "There are no right answers. The result is a profile across six work-style traits, not a pass or fail, and it is not a real personality assessment.",
    ],
    sources: [AD_SHL],
    sections: [
      section({
        id: "fc",
        title: "Most and least like me",
        instructions: "For each group of statements, choose the one that is MOST like you and the one that is LEAST like you. There are no right or wrong answers: answer honestly and quickly.",
        items: TRAIT_BANK.forcedChoice,
        timing: { mode: "untimed" },
        allowBack: true,
      }),
    ],
  },
  {
    id: "work-style-rating",
    name: "Work-style questionnaire: agreement ratings",
    replicates: "Strengths and work-style rating questionnaires used by several employers",
    kind: "trait",
    confidence: "single-report",
    approximate: true,
    formatNotes: [
      "Several employers use rating-style questionnaires about preferred ways of working (for example Barclays' 'preferred ways of working' assessment; Capp-style likelihood ratings are reported). Item counts and timings are not published.",
      "There are no right answers. The result is a profile across six work-style traits.",
    ],
    sources: ["https://search.jobs.barclays/apprentice-application-journey"],
    sections: [
      section({
        id: "lk",
        title: "How much do you agree?",
        instructions: "Say how much you agree with each statement. There are no right or wrong answers: answer honestly.",
        items: TRAIT_BANK.likert,
        timing: { mode: "untimed" },
        allowBack: true,
      }),
    ],
  },
];

export const getTest = (id: string) => TESTS.find((t) => t.id === id);
