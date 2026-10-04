// Mock processes built from a firm profile's own stage list, for every researched firm that does not have a hand-built
// one in definitions.ts. The stages, their order and their timings come from the profile. Tests are matched to the
// closest replica we have; anything we cannot simulate (games, group exercises) is shown as information and says so.
// Questions are generic practice questions in the firm's style plus any candidate-reported questions on the profile:
// they are NOT the firm's real questions.

import { getTest } from "@/lib/assess/tests";
import type { FirmProfile, FirmStage } from "@/lib/firms/types";
import { BAKERY_CASE, GYM_CASE, RECYCLING_CASE } from "./cases";
import type { MockProcess, MockStage, QaPrompt } from "./types";

const CASES = [BAKERY_CASE, GYM_CASE, RECYCLING_CASE];

const GENERIC_COMPETENCY = [
  "Tell me about a time you worked with other people to get something done at school, work or in a club. What was your part?",
  "Describe a time you had to learn something new quickly. How did you go about it?",
  "Tell me about a time something went wrong and what you did about it.",
  "Give an example of a time you had to explain something to someone who did not understand it at first.",
  "Tell me about a goal you set yourself and how you made sure you reached it.",
  "Describe a time you took the lead, even though nobody asked you to.",
];

type Kind = "info" | "tests" | "video" | "interview" | "exercise";

/** What sort of stage this is, from its name (and format where the name is vague). */
export function classify(s: FirmStage): Kind {
  const name = s.name.toLowerCase();
  if (/^(online |initial )?(application|apply|registration|cv application|application form|application questions)|^apply\b/.test(name)) return "info";
  if (/offer|screening|vetting|shortlist|outcome|pre-employment|onboarding|\bcall\b|phone discussion/.test(name)) return "info";
  if (/video|digital interview|pre-recorded|hirevue|on-demand/.test(name)) return "video";
  if (/assessment (centre|day)|group exercise|case study|superday|assessment event/.test(name)) return "exercise";
  if (/interview|exploration|matching|discussion/.test(name)) return "interview";
  if (/assessment|test|scenario|skills|ability|psychometric|game|questionnaire|simulation|immersive|check|sift|task/.test(name)) return "tests";
  return "info";
}

const isGame = (t: string) => /game|arctic shores|neurosight|switch/i.test(t);

/** Replica tests that match what a stage says it contains. At most three; none if it is game-based or says nothing specific. */
export function testsFor(s: FirmStage, f: FirmProfile): { id: string; label: string }[] {
  // The stage's name and provider decide most things; the description only adds the aptitude types it names outright.
  const head = `${s.name} ${s.provider ?? ""}`;
  const text = `${head} ${s.format}`;
  if (isGame(head)) return [];
  const cappfinity = /cappfinity/i.test(text);
  const aon = /aon|cut-e|scales/i.test(text);
  const out: { id: string; label: string }[] = [];
  const add = (id: string, label: string) => {
    if (getTest(id) && !out.some((o) => o.id === id)) out.push({ id, label });
  };
  if (/numerical|numeracy|numeric|ability test|problem[- ]solving/i.test(text)) {
    add(cappfinity ? "capp-numerical" : aon ? "scales-numerical" : "shl-numerical", "Numerical reasoning");
  }
  if (/verbal|reading comprehension/i.test(text)) add(cappfinity ? "capp-verbal" : "scales-verbal", "Verbal reasoning");
  if (/critical reasoning|deductive|watson/i.test(text)) add(cappfinity ? "capp-critical" : "shl-deductive", "Critical reasoning");
  if (/inductive|abstract reasoning|logical reasoning|pattern/i.test(text)) add("shl-inductive", "Inductive reasoning");
  if (/work scenarios/i.test(text)) add("work-scenarios", "Work scenarios");
  else if (/situational|sjt|judgement|scenario/i.test(head) || /situational judgement|sjt/i.test(s.format)) add("sjt-most-least", "Situational judgement");
  if (/questionnaire|personality|strengths|skills assessment|work style|most like me/i.test(head) || /most like me|forced[- ]choice|personality questionnaire|behavioural styles/i.test(s.format)) {
    add("work-style-forced-choice", "Work-style questionnaire");
  }
  if (/job (simulation|preview)|immersive|day in the life/i.test(text)) {
    const audit = /accountan|audit|professional services/i.test(f.sector);
    const bank = /bank|financ/i.test(f.sector);
    if (audit) add("job-sim-audit", "Job simulation");
    else if (bank) add("job-sim-banking", "Job simulation");
    else add("sjt-most-least", "Situational judgement");
  }
  return out.slice(0, 3);
}

const shortValue = (v: string) => v.split(":")[0].trim();

/** Candidate-reported questions on the profile for stages whose name matches, kept if they read as one standalone question. */
function reportedFor(f: FirmProfile, stageName: string): QaPrompt[] {
  const key = stageName.toLowerCase().split(/[(:]/)[0].trim();
  return f.questions
    .filter((q) => q.stage.toLowerCase().includes(key) || key.includes(q.stage.toLowerCase()))
    .filter((q) => q.question.length < 230 && !/^(Reported in|Common questions)/.test(q.question) && !/\(reported/.test(q.question))
    .slice(0, 4)
    .map((q) => ({ text: q.question.replace(/\s*Note:[\s\S]*$/, "").trim() }));
}

function promptsFor(f: FirmProfile, stage: FirmStage, kind: "video" | "interview" | "exercise"): QaPrompt[] {
  const reported = reportedFor(f, stage.name);
  const values = f.values.map(shortValue).filter((v) => v.length > 2 && v.length <= 40 && !/assesses|champion/i.test(v)).slice(0, 2);
  const valueQs = values.map((v) => `${f.name} looks for people who show "${v}". Give an example of a time you did.`);
  const motivation = `Why ${f.name}, and why a degree apprenticeship rather than going straight to university?`;
  const pool = [motivation, ...valueQs, ...GENERIC_COMPETENCY];
  const seen = new Set(reported.map((r) => r.text.toLowerCase()));
  const extra = pool.filter((t) => !seen.has(t.toLowerCase()));
  const want = kind === "interview" ? 5 : 4;
  return [...reported, ...extra.slice(0, Math.max(1, want - reported.length)).map((text) => ({ text }))].slice(0, Math.max(want, reported.length));
}

const WORST: FirmProfile["stages"][number]["confidence"][] = ["official", "multiple-candidate-reports", "single-report", "inferred"];

/** Builds a mock process from a profile, or null when it has too little to simulate (fewer than three stages or nothing interactive). */
export function autoMock(f: FirmProfile): MockProcess | null {
  const ordered = [...f.stages].sort((a, b) => a.order - b.order);
  if (ordered.length < 3) return null;
  const stages: MockStage[] = [];
  let caseIdx = [...f.slug].reduce((n, c) => n + c.charCodeAt(0), 0) % CASES.length;

  for (const s of ordered) {
    const kind = classify(s);
    const label = s.name.split(/[(:]/)[0].trim();
    const timing = s.durationMins ? ` (about ${s.durationMins} minutes)` : "";
    if (kind === "tests") {
      const tests = testsFor(s, f);
      if (tests.length === 0) {
        stages.push({
          kind: "info",
          name: label,
          stageOrder: s.order,
          summary: s.format,
          tips: s.tips.length ? s.tips : ["Read the firm guide for how to prepare."],
          note: "This stage is not simulated here (we have no close replica). Read the firm guide for what to expect.",
        });
        continue;
      }
      for (const t of tests) {
        stages.push({
          kind: "test",
          name: tests.length > 1 ? `${label}: ${t.label}` : label,
          testId: t.id,
          stageOrder: s.order,
          note: `${f.name}${timing} describes this stage as: ${s.format.slice(0, 200)}${s.format.length > 200 ? "..." : ""} This replica follows the same style, not the firm's exact test.`,
        });
      }
      continue;
    }
    if (kind === "video") {
      stages.push({
        kind: "qa",
        name: label,
        mode: "video",
        stageOrder: s.order,
        intro: `${s.format.slice(0, 300)}${s.format.length > 300 ? "..." : ""} Questions appear, you get a moment to think, then you record your answer.`,
        prepSeconds: 30,
        answerSeconds: 120,
        retakes: 0,
        prompts: promptsFor(f, s, "video"),
        note: "Preparation time, answer length and number of questions vary between firms and years, so these are typical settings. Check your own invitation.",
      });
      continue;
    }
    if (kind === "exercise") {
      const c = CASES[caseIdx++ % CASES.length];
      stages.push({
        kind: "qa",
        name: `${label}: case study`,
        mode: "exercise",
        stageOrder: s.order,
        intro: `${s.format.slice(0, 300)}${s.format.length > 300 ? "..." : ""} Here you practise the written or spoken case-study part: read the case, prepare, then give your recommendation.`,
        prepSeconds: 480,
        answerSeconds: 300,
        retakes: 0,
        prompts: [{ text: c.brief, stimulus: c.stimulus }],
        note: "Group exercises and in-person activities are not simulated. The case is an original one, not the firm's.",
      });
      stages.push({
        kind: "qa",
        name: `${label}: interview`,
        mode: "interview",
        stageOrder: s.order,
        intro: "Most assessment centres include an interview. Answer as you would out loud: a clear example with what you did and what happened.",
        prepSeconds: 0,
        answerSeconds: 180,
        retakes: 0,
        prompts: promptsFor(f, s, "interview"),
        note: "Typical interview practice in the firm's style. The real interview may differ.",
      });
      continue;
    }
    if (kind === "interview") {
      stages.push({
        kind: "qa",
        name: label,
        mode: "interview",
        stageOrder: s.order,
        intro: `${s.format.slice(0, 300)}${s.format.length > 300 ? "..." : ""}`,
        prepSeconds: 0,
        answerSeconds: 180,
        retakes: 0,
        prompts: promptsFor(f, s, "interview"),
      });
      continue;
    }
    stages.push({
      kind: "info",
      name: label,
      stageOrder: s.order,
      summary: s.format,
      tips: s.tips.length ? s.tips : ["Read the firm guide for how to prepare."],
    });
  }

  if (!stages.some((s) => s.kind === "test" || s.kind === "qa")) return null;
  const worst = WORST[Math.max(...ordered.map((s) => WORST.indexOf(s.confidence)))] ?? "inferred";
  const items = f.values.map(shortValue).filter((v) => v.length > 2 && v.length <= 60).slice(0, 6);
  return {
    firm: f.slug,
    title: `${f.name} mock process`,
    confidence: worst,
    framework: items.length ? { name: `${f.name}'s values`, items } : { name: "Common apprenticeship competencies", items: ["Teamwork", "Communication", "Problem solving", "Motivation", "Learning from experience"] },
    stages,
    notes: [
      `This mock follows the stages in ${f.name}'s application process, in the same order. Tests are the closest replica we have, and questions are practice questions in the firm's style (plus candidate-reported ones where we have them): they are not the firm's real questions. Check your invitation for the real format and timings.`,
    ],
  };
}
