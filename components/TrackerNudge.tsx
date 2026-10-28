"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUsage } from "@/components/useUsage";
import { track } from "@/lib/funnel";
import { PRO_PLAN } from "@/lib/plans";
import { pipelineCounts, type TrackerPrompt } from "@/lib/tracker-prompts";
import type { Application } from "@/lib/types";

const dismissedKey = (k: string) => `da-prep:tprompt:${k}`;
const wasDismissed = (k: string) => {
  try {
    return localStorage.getItem(dismissedKey(k)) === "1";
  } catch {
    return false;
  }
};

/**
 * Above the tracker: how many applications sit at each stage, and one suggested next step for where they are (see
 * lib/tracker-prompts.ts). The suggestion can be dismissed, and is counted anonymously when shown and when followed.
 */
export default function TrackerNudge({
  apps,
  prompt,
  canFollow,
  onFollow,
}: {
  apps: Application[];
  prompt: TrackerPrompt | null;
  /** Offer deadline emails for the prompt's employer (it has a row, is still open, and is not followed yet). */
  canFollow: boolean;
  onFollow: () => void;
}) {
  const usage = useUsage();
  const [hidden, setHidden] = useState(true);
  const key = prompt?.key;
  useEffect(() => {
    // Whether it was dismissed is only known in the browser, so decide after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(!key || wasDismissed(key));
  }, [key]);
  useEffect(() => {
    if (key && !hidden) track("tracker_prompt_view", { oncePerLoad: true });
  }, [key, hidden]);

  const counts = pipelineCounts(apps).filter((c) => c.n > 0);
  if (!apps.length) return null;

  return (
    <div className="space-y-2">
      <p className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm" aria-label="Your applications by stage">
        {counts.map((c, i) => (
          <span key={c.status} className="inline-flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-muted">→</span>}
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
              {c.n} {c.status.toLowerCase()}
            </span>
          </span>
        ))}
      </p>
      {prompt && !hidden && (
        <section className="callout flex flex-wrap items-start justify-between gap-3 bg-brand-50" aria-label="Suggested next step">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold">{prompt.title}</p>
            <p className="text-sm">{prompt.body}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href={prompt.href} className="btn btn-primary" onClick={() => track("tracker_prompt_click")}>
                {prompt.cta}
              </Link>
              {prompt.pro && usage?.plan === "free" && (
                <Link href="/pricing" className="text-sm font-semibold underline">
                  Part of Pro ({PRO_PLAN.price}): see what it includes
                </Link>
              )}
              {canFollow && (
                <button type="button" className="btn btn-secondary" onClick={onFollow}>
                  Email me before {prompt.employer} closes
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-muted underline"
            onClick={() => {
              try {
                localStorage.setItem(dismissedKey(prompt.key), "1");
              } catch {
                /* it just comes back next time */
              }
              setHidden(true);
            }}
          >
            Not now
          </button>
        </section>
      )}
    </div>
  );
}
