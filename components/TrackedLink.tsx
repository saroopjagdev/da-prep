"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type FunnelEvent } from "@/lib/funnel";

/** A normal link that also counts one anonymous funnel step when it is followed. */
export default function TrackedLink({ event, onClick, ...props }: ComponentProps<typeof Link> & { event: FunnelEvent }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event);
        onClick?.(e);
      }}
    />
  );
}
