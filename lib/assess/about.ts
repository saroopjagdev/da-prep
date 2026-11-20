// Plain-text description of a practice test for its page: what it replicates, how many questions and how long, whether a
// calculator or going back is allowed, how sure we are of the real format, and general preparation advice for that kind of
// test. Built from the test's own data, so it never says more than the research behind the test supports.
import { servedCount } from "@/lib/assess/sample";
import type { Test } from "@/lib/assess/types";
import { totalSeconds } from "@/lib/assess/validate";

export type TestFamily = "numerical" | "verbal" | "inductive" | "deductive" | "situational" | "switch" | "simulation" | "trait" | "other";

export function testFamily(t: Test): TestFamily {
  if (t.kind === "trait") return "trait";
  const id = t.id;
  if (id.startsWith("sjt") || id === "work-scenarios") return "situational";
  if (id.includes("switch")) return "switch";
  if (id.includes("inductive")) return "inductive";
  if (id.includes("deductive")) return "deductive";
  if (id.includes("numerical")) return "numerical";
  if (id.includes("verbal") || id.includes("critical")) return "verbal";
  if (id.includes("sim") || id.includes("audit") || id.includes("banking") || id.includes("hsbc")) return "simulation";
  return "other";
}

export const CONFIDENCE_TEXT: Record<Test["confidence"], string> = {
  official: "The format follows the provider's own published description.",
  "multiple-candidate-reports": "The format follows several candidate and prep-site reports, not an official description.",
  "single-report": "The format follows a single report, so treat the details as approximate.",
  inferred: "The format is inferred from descriptions of this type of test, so treat the details as approximate.",
};

const TIPS: Record<TestFamily, string[]> = {
  numerical: [
    "Read the labels, units and time periods on every table or chart before you read the question, so you do not mix up thousands and millions or percentages and percentage points.",
    "Estimate first. If the options are far apart, a rough calculation is enough and saves time.",
    "Set yourself a time per question and move on when you pass it. An unanswered hard question costs less than three rushed easy ones.",
  ],
  verbal: [
    "Answer only from the passage, never from what you already know. If the passage does not say it, the answer is \"cannot say\".",
    "Watch for qualifiers such as \"all\", \"some\", \"only\" and \"usually\", which often decide between true and false.",
    "Skim the question first, then find the matching part of the passage instead of reading every line twice.",
  ],
  inductive: [
    "Ask what changes from one shape to the next: position, size, colour, number, rotation. List the changes, then look for the rule behind them.",
    "Test your rule on the earlier steps before you choose, because a pattern that fits only the last step is usually wrong.",
    "If you are stuck, eliminate options that break an obvious rule and move on.",
  ],
  deductive: [
    "Treat the statements as true even if they sound odd. The test is about logic, not what you know.",
    "Sketch a quick diagram for rules such as \"all\", \"none\" or \"some\". It is faster than holding them in your head.",
    "Check each conclusion against the statements only, and do not add assumptions.",
  ],
  situational: [
    "Read every option before you choose or rate any of them. The best answer is often only clear in comparison.",
    "Ask what a sensible, honest colleague who follows the rules and thinks about the team and the customer would do.",
    "Where you rate each action separately, rate each one on its own merits. Several actions can deserve the same rating.",
  ],
  switch: [
    "Work step by step: apply one switch at a time and compare the result with the target before you commit.",
    "Accuracy and speed both count, so avoid guessing early on and keep a steady pace.",
  ],
  simulation: [
    "Treat it like a real working day: read the email or document properly, decide what matters most, then act.",
    "Do not go back and re-read everything. Note the key facts as you go.",
    "Typed replies are checked against a list, so be clear, polite and specific.",
  ],
  trait: [
    "There are no right answers. The test builds a profile, so answer honestly and consistently and do not try to guess what the employer wants.",
    "Go with your first honest reaction. Overthinking tends to make answers less consistent.",
  ],
  other: ["Read the instructions on each screen before you start, and use any practice questions to get used to the format."],
};

export const prepTips = (t: Test): string[] => TIPS[testFamily(t)];

export type TestFacts = { questions: number; minutes: number | null; calculator: boolean; canGoBack: boolean; sections: number };

export function testFacts(t: Test): TestFacts {
  const secs = totalSeconds(t);
  return {
    questions: t.sections.reduce((n, s) => n + servedCount(s), 0),
    minutes: secs ? Math.round(secs / 60) : null,
    calculator: t.sections.some((s) => s.calculator),
    canGoBack: t.sections.some((s) => s.allowBack),
    sections: t.sections.length,
  };
}

/** One readable sentence about the practice version. */
export function testSummary(t: Test): string {
  const f = testFacts(t);
  const unit = t.kind === "trait" ? "statements" : "questions";
  const time = f.minutes ? `${f.minutes} ${f.minutes === 1 ? "minute" : "minutes"}` : "untimed";
  return `This practice version has ${f.questions} ${unit} across ${f.sections} ${f.sections === 1 ? "section" : "sections"}, ${time}. ${f.calculator ? "A calculator is provided." : "No calculator is provided."} ${f.canGoBack ? "You can go back to earlier questions." : "You cannot go back once you have answered."}`;
}
