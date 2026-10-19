"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

/** The button behind the unsubscribe link in each alert email. It posts, so a scanner opening the link changes nothing. */
export default function UnsubscribeForm() {
  const token = useSearchParams().get("t") ?? "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function go() {
    setState("busy");
    try {
      const res = await fetch(`/api/alerts/unsubscribe?t=${encodeURIComponent(token)}`, { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
    } catch (e) {
      setMessage((e as Error).message);
      setState("error");
    }
  }

  if (!token) return <p className="callout bg-sun-50 text-sm">This link is missing its code. Use the link in the email, or manage your alerts in the tracker after signing in.</p>;
  if (state === "done") {
    return (
      <p role="status" className="callout bg-mint-50 text-mint-600">
        Done. You will not get any more deadline emails from Level6. You can follow employers again any time from the tracker.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <button onClick={go} disabled={state === "busy"} className="btn btn-primary">
        {state === "busy" ? "Unsubscribing…" : "Stop all deadline emails"}
      </button>
      {state === "error" && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {message}
        </p>
      )}
    </div>
  );
}
