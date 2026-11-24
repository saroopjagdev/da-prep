// The "Get set up" checklist on the signed-in home page: three first steps, in the order that gets someone to value fastest.
// Pure, so it can be tested; components/HomeDashboard.tsx shows it. Each step is done by using the thing once, so the list
// needs no extra storage: it reads what the tracker, practice and mock interview collections already hold.
import { STARTER_TARGET } from "@/lib/dashboard";

export type WelcomeStepKey = "track" | "practice" | "mock";

export type WelcomeStep = {
  key: WelcomeStepKey;
  title: string;
  /** What it is and how long it takes, so the step feels small. */
  hint: string;
  href: string;
  done: boolean;
};

export type WelcomeCounts = {
  /** Employers in the tracker. */
  tracked: number;
  /** Practice tests taken. */
  practice: number;
  /** Mock interviews taken. */
  sessions: number;
};

export function welcomeSteps(c: WelcomeCounts, target = STARTER_TARGET): WelcomeStep[] {
  return [
    {
      key: "track",
      title: `Track ${target} employers`,
      hint: "One tap each. We count down to every closing date.",
      href: "/opportunities",
      done: c.tracked >= target,
    },
    {
      key: "practice",
      title: "Take a practice test",
      hint: "About 5 minutes. Every answer is explained.",
      href: "/practice",
      done: c.practice > 0,
    },
    {
      key: "mock",
      title: "Try a marked mock interview",
      hint: "About 10 minutes. Scored out of 100 with feedback.",
      href: "/interview",
      done: c.sessions > 0,
    },
  ];
}

export function welcomeProgress(steps: WelcomeStep[]) {
  const done = steps.filter((s) => s.done).length;
  return { done, total: steps.length, complete: done === steps.length, next: steps.find((s) => !s.done) ?? null };
}
