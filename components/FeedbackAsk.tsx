"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import { RATING_CHOICES, SHOW_DELAY_MS, afterLater, afterMoment, afterNever, afterShown, parseState, shouldAsk, type AskState } from "@/lib/feedback-ask";
import { track } from "@/lib/funnel";

const KEY = "da-prep:feedback-ask";
const read = (): AskState => {
  try {
    return parseState(localStorage.getItem(KEY));
  } catch {
    return parseState(null);
  }
};
const write = (s: AskState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked: the banner just does not remember */
  }
};

/**
 * A small, dismissible ask for feedback, put under a useful result (a marked practice test, interview, CV or statement
 * review). It counts that result, and shows itself a few seconds later only when lib/feedback-ask.ts says it is time and
 * the account has not already sent feedback. Three equal choices lead to the same form for everyone; "Maybe later" asks
 * again in two weeks, "Don't ask again" stops it for good.
 */
export default function FeedbackAsk() {
  const { enabled, ready, user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !ready || !user) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // This result counts as one useful moment, once per time it is shown.
    write(afterMoment(read()));
    if (!shouldAsk(read(), Date.now(), false)) return;
    postJson<{ sent: number }>("/api/feedback", undefined, "GET")
      .then(({ sent }) => {
        if (!alive) return;
        if (sent > 0) {
          write(afterNever(read()));
          return;
        }
        timer = setTimeout(() => {
          const s = read();
          if (!alive || !shouldAsk(s, Date.now(), false)) return;
          write(afterShown(s, Date.now()));
          setVisible(true);
          track("feedback_ask_view");
        }, SHOW_DELAY_MS);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, ready, user]);

  if (!visible) return null;
  return (
    <aside className="callout bg-brand-50 text-left text-sm" aria-label="Feedback">
      <p className="font-semibold">How is Level6 going so far?</p>
      <p className="mt-1 text-muted">One tap, then tell us what is working and what is not. It helps us decide what to fix next.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {RATING_CHOICES.map((c) => (
          <Link key={c.rating} href={`/feedback?r=${c.rating}`} onClick={() => track("feedback_ask_click")} className="btn btn-secondary">
            {c.label}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={() => {
            write(afterLater(read(), Date.now()));
            setVisible(false);
          }}
        >
          Maybe later
        </button>
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={() => {
            write(afterNever(read()));
            setVisible(false);
          }}
        >
          Don&apos;t ask again
        </button>
      </div>
    </aside>
  );
}
