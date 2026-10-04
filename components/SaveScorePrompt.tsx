"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/** Shown after a practice result to someone who is not signed in: the moment they have just got value is the moment to ask. */
export default function SaveScorePrompt() {
  const { enabled, ready, user } = useAuth();
  if (!enabled || !ready || user) return null;
  return (
    <aside className="callout bg-brand-50 text-left text-sm" aria-label="Create an account">
      <p className="font-semibold">Save your score and unlock the AI mock interview</p>
      <p className="mt-1 text-muted">
        A free account syncs your scores and tracker across devices and lets you do marked mock interviews, CV and statement feedback. No password: we email you a link.
      </p>
      <Link href="/login" className="btn btn-primary mt-3">
        Create a free account
      </Link>
    </aside>
  );
}
