"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useUsage } from "@/components/useUsage";
import { FREE_PRACTICE_PER_WEEK } from "@/lib/plans";
import { recordUse, usedThisWeek } from "@/lib/practice-cap";

/**
 * Free practice tests left this week on this device. Pro is unlimited. Nothing blocks until we know the person is not Pro
 * (a signed-in person is checked first), so a Pro member never sees the limit flash up.
 */
export function usePracticeAllowance() {
  const { user, enabled } = useAuth();
  const usage = useUsage();
  const [used, setUsed] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- storage is only readable in the browser, after mount
      setUsed(usedThisWeek(localStorage));
    } catch {
      /* storage blocked: no cap on this device */
    }
    setLoaded(true);
  }, []);

  const checkingPlan = enabled && Boolean(user) && usage === null;
  const unlimited = usage?.plan === "pro";
  const left = Math.max(0, FREE_PRACTICE_PER_WEEK - used);
  const record = useCallback(() => {
    if (unlimited) return;
    try {
      setUsed(recordUse(localStorage));
    } catch {
      /* ignore */
    }
  }, [unlimited]);

  return { loaded, unlimited, left, limit: FREE_PRACTICE_PER_WEEK, blocked: loaded && !checkingPlan && !unlimited && left === 0, record };
}
