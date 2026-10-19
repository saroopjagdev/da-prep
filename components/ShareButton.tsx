"use client";

import { useState } from "react";
import { track } from "@/lib/funnel";

/**
 * Shares the current page. On phones this opens the share sheet; elsewhere it copies the link. The link carries
 * utm_source=share so visits that come from a shared link are counted as such (see SOURCES in lib/funnel.ts).
 */
export default function ShareButton({ title, text, className = "btn btn-secondary", label = "Share" }: { title: string; text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    track("share_click");
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("utm_source", "share");
    const link = url.toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* the person closed the share sheet, or the browser blocked copying: nothing to do */
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      {copied ? "Link copied" : label}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to your clipboard" : ""}
      </span>
    </button>
  );
}
