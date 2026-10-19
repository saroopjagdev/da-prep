"use client";

import { useEffect } from "react";
import { track, type FunnelEvent } from "@/lib/funnel";

/** Counts one anonymous funnel step when it appears on screen (once per page load). Renders nothing. */
export default function TrackOnMount({ event }: { event: FunnelEvent }) {
  useEffect(() => {
    track(event, { oncePerLoad: true });
  }, [event]);
  return null;
}
