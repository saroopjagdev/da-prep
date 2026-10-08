"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";

export type Usage = {
  plan: "free" | "pro";
  enforced: boolean;
  interviews?: { used: number; limit: number };
  reviews?: { used: number; limit: number };
  practice?: { used: number; limit: number };
  /** The free trial of Pro: whether this account can still start one, and when a running trial ends. */
  trial?: { eligible: boolean; used: boolean; endsAt?: string };
};

// Several components on one page read the allowance at once (header, banner, cards). Requests that overlap share one
// call; nothing is kept once it finishes, so a later read always sees fresh counts.
let inflight: { uid: string; promise: Promise<Usage> } | null = null;
function fetchUsage(uid: string): Promise<Usage> {
  if (inflight?.uid === uid) return inflight.promise;
  const promise = postJson<Usage>("/api/usage", undefined, "GET").finally(() => {
    if (inflight?.promise === promise) inflight = null;
  });
  inflight = { uid, promise };
  return promise;
}

/** What the signed-in person has left of the free allowances, from GET /api/usage. null while loading or when signed out. */
export function useUsage(): Usage | null {
  const { user, enabled } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);
  useEffect(() => {
    if (!enabled || !user) return;
    let alive = true;
    fetchUsage(user.id)
      .then((u) => alive && setUsage(u))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [enabled, user]);
  return enabled && user ? usage : null;
}
