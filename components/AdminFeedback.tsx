"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";

type Row = { id: string; created_at: string; rating: number | null; message: string; may_quote: boolean; display_name: string | null; featured: boolean };

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * Admin only: every piece of feedback, and the choice of which comments the site shows. Only comments whose author ticked
 * the permission can be chosen, and the public site shows just the words and the name they gave. No emails or account ids here.
 */
export default function AdminFeedback() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [only, setOnly] = useState<"all" | "permission" | "shown">("all");

  useEffect(() => {
    postJson<{ feedback: Row[] }>("/api/admin/feedback", undefined, "GET")
      .then((d) => setRows(d.feedback))
      .catch((e) => setError((e as Error).message));
  }, []);

  async function feature(id: string, featured: boolean) {
    setError("");
    try {
      await postJson("/api/admin/feedback", { id, featured });
      setRows((all) => all?.map((r) => (r.id === id ? { ...r, featured } : r)) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const shown = rows?.filter((r) => (only === "permission" ? r.may_quote : only === "shown" ? r.featured : true)) ?? [];
  const rated = rows?.filter((r) => r.rating) ?? [];
  const average = rated.length ? (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1) : null;

  return (
    <section className="space-y-3" aria-labelledby="admin-feedback">
      <h2 id="admin-feedback" className="text-lg font-semibold">
        Feedback
      </h2>
      <p className="text-sm text-muted">
        {rows ? `${rows.length} messages, ${rows.filter((r) => r.may_quote).length} with permission to quote, ${rows.filter((r) => r.featured).length} shown on the site.` : "Loading…"}
        {average && ` Average rating across all ${rated.length} ratings: ${average} (never shown publicly).`} Everyone sees the same form; nothing here depends on the rating.
      </p>
      <div className="flex gap-2 text-sm" role="group" aria-label="Filter feedback">
        {(
          [
            ["all", "All"],
            ["permission", "With permission to quote"],
            ["shown", "Shown on the site"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} onClick={() => setOnly(k)} aria-pressed={only === k} className={`btn !px-3 !py-1 ${only === k ? "btn-primary" : "btn-secondary"}`}>
            {label}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {error}
        </p>
      )}
      <ul className="space-y-2">
        {shown.map((r) => (
          <li key={r.id} className="card space-y-1 p-3 text-sm">
            <p className="text-xs text-muted">
              {date(r.created_at)}
              {r.rating ? ` · ${r.rating}/5` : ""}
              {r.may_quote ? ` · may quote as “${r.display_name}”` : " · no permission to quote"}
            </p>
            <p className="whitespace-pre-line">{r.message}</p>
            {r.may_quote && (
              <button onClick={() => feature(r.id, !r.featured)} className={`btn !px-3 !py-1 text-xs ${r.featured ? "btn-secondary" : "btn-primary"}`}>
                {r.featured ? "Take down from the site" : "Show on the site"}
              </button>
            )}
          </li>
        ))}
        {rows && !shown.length && <li className="text-sm text-muted">Nothing here yet.</li>}
      </ul>
    </section>
  );
}
