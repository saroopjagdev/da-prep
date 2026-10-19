"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/funnel";

/** Counts the start of a visit, split by the page it began on and where it came from. Renders nothing. */
export default function VisitTracker() {
  useEffect(() => {
    trackVisit();
  }, []);
  return null;
}
