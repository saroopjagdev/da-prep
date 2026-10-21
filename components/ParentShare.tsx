"use client";

import { useState } from "react";
import { track } from "@/lib/funnel";
import { PRO_PLAN } from "@/lib/plans";

/**
 * "Ask a parent or guardian": shares a short message and a link to /parents, which explains Level6 Pro to the adult who
 * would pay. On phones this opens the share sheet; elsewhere it copies the message. Counted as parent_share_click.
 */
export default function ParentShare({ className = "btn btn-secondary", label = "Send this to a parent or guardian" }: { className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    track("parent_share_click");
    const url = new URL("/parents", window.location.origin);
    url.searchParams.set("utm_source", "share");
    const text = `I'm using Level6 to prepare for degree apprenticeship applications. The paid plan is ${PRO_PLAN.price} and you can cancel any time. Could you have a look? ${url.toString()}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Level6 Pro", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      /* the share sheet was closed, or the browser blocked copying: nothing to do */
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      {copied ? "Message copied: paste it to them" : label}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Message copied to your clipboard" : ""}
      </span>
    </button>
  );
}
