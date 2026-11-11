// The logic behind the signed-in home page (components/HomeDashboard.tsx). Pure, so it can be tested.
// The page answers one question: what should I do next? It orders a member's tracked applications by what needs doing
// soonest, turns closing dates into a countdown, and decides when a free allowance running out should become an upgrade
// prompt (the prompt follows a blocked action or a first result, never a timer).
import type { Usage } from "@/components/useUsage";
import type { TrackerPrompt } from "@/lib/tracker-prompts";
import type { Application, Status } from "@/lib/types";

const DAY = 86_400_000;
export const daysLeft = (iso: string, today: string) =>
  Math.round((Date.parse(iso) - Date.parse(today)) / DAY);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/** "2026-12-07" as "7 Dec". */
export const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`;
};

export type Countdown = { text: string; tone: "urgent" | "soon" | "calm" };

/**
 * The closing-date chip for a tracked application. Only shown while it is still just saved (Interested): once someone has
 * applied the closing date no longer matters to them. Null when there is nothing useful to say.
 */
export function countdown(
  a: Pick<Application, "status" | "deadline" | "rolling">,
  today: string,
): Countdown | null {
  if (a.status !== "Interested") return null;
  if (!a.deadline)
    return a.rolling ? { text: "Rolling: apply early", tone: "soon" } : null;
  const d = daysLeft(a.deadline, today);
  if (d < 0) return { text: "Closed", tone: "calm" };
  if (d === 0) return { text: "Closes today", tone: "urgent" };
  if (d === 1) return { text: "Closes tomorrow", tone: "urgent" };
  if (d <= 7) return { text: `Closes in ${d} days`, tone: "urgent" };
  if (d <= 21) return { text: `Closes in ${d} days`, tone: "soon" };
  return { text: `Closes ${shortDate(a.deadline)}`, tone: "calm" };
}

const STAGE_ORDER: Status[] = [
  "Interested",
  "Applied",
  "Online tests",
  "Video interview",
  "Assessment centre",
  "Offer",
  "Rejected",
];

/**
 * Tracked applications in the order to look at them: saved ones with a closing date coming up first (soonest first), then
 * anything further along (furthest stage first, so an offer or an assessment centre is not buried), then saved ones with no
 * date, then closed ones. Rejected ones are left out.
 */
export function pipelineRows(
  apps: Application[],
  today: string,
): Application[] {
  const tier = (a: Application) => {
    const dated = a.status === "Interested" && a.deadline;
    if (dated && daysLeft(a.deadline, today) >= 0) return 0;
    if (a.status !== "Interested") return 1;
    if (!a.deadline) return 2;
    return 3;
  };
  return apps
    .filter((a) => a.status !== "Rejected")
    .map((a) => ({ a, t: tier(a) }))
    .sort(
      (x, y) =>
        x.t - y.t ||
        (x.t === 0
          ? x.a.deadline.localeCompare(y.a.deadline)
          : x.t === 1
            ? STAGE_ORDER.indexOf(y.a.status) - STAGE_ORDER.indexOf(x.a.status)
            : 0),
    )
    .map(({ a }) => a);
}

/** Suggestions about where someone is in the process, which beat "track a few more employers". */
export const URGENT_PROMPTS = new Set([
  "assessment-centre",
  "video-interview",
  "online-tests",
  "closing-soon",
]);

/** The tracker has at least this many employers before the picker gives way to the next-step card. */
export const STARTER_TARGET = 3;

export type Allowance = {
  key: "interviews" | "reviews" | "practice" | "games" | "stories";
  label: string;
  used: number;
  limit: number;
};

/** The free allowances that apply to this member, in the order they are shown. Empty for Pro or when limits are off. */
export function allowances(usage: Usage | null): Allowance[] {
  if (!usage || usage.plan !== "free" || !usage.enforced) return [];
  const out: Allowance[] = [];
  if (usage.interviews)
    out.push({
      key: "interviews",
      label: "Mock interviews",
      ...usage.interviews,
    });
  if (usage.practice)
    out.push({ key: "practice", label: "Practice tests", ...usage.practice });
  if (usage.reviews)
    out.push({
      key: "reviews",
      label: "CV and statement reviews",
      ...usage.reviews,
    });
  if (usage.games) out.push({ key: "games", label: "Practice games", ...usage.games });
  if (usage.stories) out.push({ key: "stories", label: "Story drafts", ...usage.stories });
  return out;
}

/** True once any free allowance that exists (limit above zero) has been used up: the moment an upgrade makes sense. */
export const limitReached = (usage: Usage | null) =>
  allowances(usage).some((a) => a.limit > 0 && a.used >= a.limit);

/** How many of an allowance is left, never below zero. */
export const left = (a: Pick<Allowance, "used" | "limit">) =>
  Math.max(0, a.limit - a.used);

export type ProOffer = {
  headline: string;
  body: string;
  cta: string;
  /** The allowance for this stage is gone, so the offer is a way forward and not just a nudge. */
  urgent: boolean;
  /** Which stage prompted it, for counting clicks. */
  surface: string;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * A Pro offer that belongs to the stage someone has reached, so it arrives when the need is real (an online test, a video
 * interview or an assessment centre at a named employer) and says what they have left. Null for Pro members, when limits
 * are off, and for stages where practice is not what they need next.
 */
export function proOffer(prompt: Pick<TrackerPrompt, "key" | "employer" | "pro"> | null, usage: Usage | null): ProOffer | null {
  if (!prompt || !usage || usage.plan !== "free" || !usage.enforced) return null;
  const who = prompt.employer ?? "your next stage";
  const get = (key: Allowance["key"]) => allowances(usage).find((a) => a.key === key);
  if (prompt.key === "online-tests") {
    const a = get("practice");
    const n = a ? left(a) : 0;
    return {
      headline: `Online tests at ${who}`,
      body: n > 0
        ? `You have ${plural(n, "free practice test")} left. Pro gives unlimited practice, so you can repeat each format until it feels easy.`
        : "You have used your free practice tests. Pro gives unlimited practice, so you can repeat each format until it feels easy.",
      cta: "Unlock unlimited practice",
      urgent: n === 0,
      surface: "stage-online-tests",
    };
  }
  if (prompt.key === "video-interview") {
    const a = get("interviews");
    const n = a ? left(a) : 0;
    return {
      headline: `Video interview at ${who}`,
      body: n > 0
        ? `You have ${plural(n, "free marked mock interview")} left. Pro gives unlimited ones, each marked out of 100 with what to fix.`
        : "You have used your free marked mock interview. Pro gives unlimited ones, each marked out of 100 with what to fix.",
      cta: "Unlock unlimited mock interviews",
      urgent: n === 0,
      surface: "stage-video-interview",
    };
  }
  if (prompt.key === "assessment-centre") {
    return {
      headline: `Assessment centre at ${who}`,
      body: prompt.pro
        ? `Pro runs the whole ${who} process stage by stage, timed like the real thing and marked, plus unlimited mock interviews.`
        : "Pro gives unlimited mock interviews and every firm mock process, so you can rehearse each exercise before the day.",
      cta: "See what Pro includes",
      urgent: false,
      surface: "stage-assessment-centre",
    };
  }
  return null;
}
