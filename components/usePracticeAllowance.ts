"use client";

import { useCallback, useState } from "react";
import { useUsage } from "@/components/useUsage";
import { postJson } from "@/lib/api";
import { FREE_PRACTICE } from "@/lib/plans";

/**
 * Practice tests left. The count lives on the account (POST /api/practice/start counts a test when it is
 * started), so clearing site data does not reset it. Pro is unlimited. Nothing blocks until the plan is known, so a
 * Pro member never sees the limit flash up, and nothing blocks when limits are not enforced (no count is returned).
 */
export function usePracticeAllowance() {
  const usage = useUsage();
  const [startedHere, setStartedHere] = useState(0);
  const unlimited = usage?.plan === "pro";
  const known = Boolean(usage?.practice);
  const limit = usage?.practice?.limit ?? FREE_PRACTICE;
  const used = (usage?.practice?.used ?? 0) + startedHere;
  const left = Math.max(0, limit - used);

  /** Count one test as started. Resolves ok:false with the server's reason when the allowance is used up. */
  const begin = useCallback(async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      await postJson("/api/practice/start", {});
      if (!unlimited) setStartedHere((n) => n + 1);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  }, [unlimited]);

  return { known, unlimited, left, limit, blocked: known && !unlimited && left === 0, begin };
}
