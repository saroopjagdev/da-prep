// What to suggest next to someone, from where their tracked applications are. Pure logic so it can be tested; the card
// that shows it is in components/TrackerNudge.tsx. One suggestion at a time, most useful first.
import type { Application, Status } from "@/lib/types";

/** The stages in the order an application moves through them, for the summary bar above the tracker. */
export const PIPELINE: Status[] = ["Interested", "Applied", "Online tests", "Video interview", "Assessment centre", "Offer"];

export function pipelineCounts(apps: Application[]): { status: Status; n: number }[] {
  return PIPELINE.map((status) => ({ status, n: apps.filter((a) => a.status === status).length }));
}

export type TrackerPrompt = {
  /** Stable id: what was dismissed is remembered against it, and it is the label counted in the funnel. */
  key: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /** The employer this is about, when it has one, so a nudge can also offer deadline emails for it. */
  employer?: string;
  /** What the suggestion leads to is part of Pro, so a free member is told so up front. */
  pro?: boolean;
};

const daysUntil = (iso: string, today: string) => Math.round((Date.parse(iso) - Date.parse(today)) / 86_400_000);

/**
 * The single most useful next step. Later stages come first: someone at an assessment centre needs that now, whereas
 * someone who has only saved a few employers can wait. Returns null when there is nothing helpful to say.
 * `mockHref` finds an employer's mock process page when there is one.
 */
export function nextPrompt(apps: Application[], today: string, mockHref: (employer: string) => string | null = () => null): TrackerPrompt | null {
  const first = (s: Status) => apps.find((a) => a.status === s);

  const centre = first("Assessment centre");
  if (centre) {
    const href = mockHref(centre.employer);
    return {
      key: "assessment-centre",
      title: `Assessment centre at ${centre.employer}`,
      body: href ? "Run the whole process as a mock, stage by stage, before the day. Firm mock processes are part of Pro." : "Practise the group exercise and interview questions before the day.",
      href: href ?? "/interview",
      cta: href ? "Try the mock process" : "Practise interview questions",
      employer: centre.employer,
      pro: Boolean(href),
    };
  }

  const video = first("Video interview");
  if (video) {
    return {
      key: "video-interview",
      title: `Video interview for ${video.employer}`,
      body: "Record practice answers on camera and get them marked out of 100 with feedback.",
      href: "/interview",
      cta: "Practise a video interview",
      employer: video.employer,
    };
  }

  const tests = first("Online tests");
  if (tests) {
    return {
      key: "online-tests",
      title: `Online tests for ${tests.employer}`,
      body: "Most people are cut at this stage. Practise the reasoning and judgement tests, with every answer explained.",
      href: "/practice",
      cta: "Practise the tests",
      employer: tests.employer,
    };
  }

  const closing = apps
    .filter((a) => a.status === "Interested" && a.deadline && daysUntil(a.deadline, today) >= 0 && daysUntil(a.deadline, today) <= 7)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];
  if (closing) {
    const d = daysUntil(closing.deadline, today);
    return {
      key: "closing-soon",
      title: `${closing.employer} closes ${d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`}`,
      body: "You have saved it but not applied yet. Open its page to see what the application needs.",
      href: "/opportunities?mine=1",
      cta: "See my list",
      employer: closing.employer,
    };
  }

  const applied = first("Applied");
  if (applied) {
    return {
      key: "applied-waiting",
      title: `Applied to ${applied.employer}`,
      body: "Replies can take weeks. Use the wait: a practice test now means you are ready if the online tests arrive.",
      href: "/practice",
      cta: "Practise while you wait",
      employer: applied.employer,
    };
  }

  const saved = first("Interested");
  if (saved) {
    return {
      key: "saved-first",
      title: `Never miss the date for ${saved.employer}`,
      body: "Get an email when it opens and before it closes. Free, and you can stop them any time.",
      href: "/opportunities?mine=1",
      cta: "See my list",
      employer: saved.employer,
    };
  }
  return null;
}
