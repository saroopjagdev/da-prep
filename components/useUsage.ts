"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";

export type Usage = {
  plan: "free" | "pro";
  enforced: boolean;
  interviews?: { used: number; limit: number };
  reviews?: { used: number; limit: number };
};

/** What the signed-in person has left of the free allowances, from GET /api/usage. null while loading or when signed out. */
export function useUsage(): Usage | null {
  const { user, enabled } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);
  useEffect(() => {
    if (!enabled || !user) return;
    let alive = true;
    postJson<Usage>("/api/usage", undefined, "GET")
      .then((u) => alive && setUsage(u))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [enabled, user]);
  return enabled && user ? usage : null;
}
