"use client";

import RequireAccount from "@/components/RequireAccount";
import { useState } from "react";
import { postJson } from "@/lib/api";
import { useCollection } from "@/lib/store";
import { COMPETENCIES, type Story } from "@/lib/types";

type Draft = Omit<Story, "id">;
const EMPTY: Draft = { title: "", competencies: [], situation: "", task: "", action: "", result: "" };

function StoriesInner() {
  const { items: stories, loaded, update } = useCollection<Story>("stories");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [notes, setNotes] = useState("");
  const [tip, setTip] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  async function build() {
    setBusy(true);
    setError("");
    setTip("");
    try {
      const out = await postJson<Omit<Draft, "title" | "competencies"> & { tip: string }>("/api/star", {
        notes,
        competency: draft.competencies[0],
      });
      setDraft((d) => ({ ...d, situation: out.situation, task: out.task, action: out.action, result: out.result }));
      setTip(out.tip);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function save() {
    update((p) => [{ ...draft, id: crypto.randomUUID() }, ...p]);
    setDraft(EMPTY);
    setNotes("");
    setTip("");
  }

  const toggle = (c: string) =>
    setDraft((d) => ({
      ...d,
      competencies: d.competencies.includes(c) ? d.competencies.filter((x) => x !== c) : [...d.competencies, c],
    }));

  const canSave = draft.title.trim() && draft.situation.trim() && draft.action.trim();
  const shown = stories.filter((s) => filter === "All" || s.competencies.includes(filter));

  const field = (k: "situation" | "task" | "action" | "result") => (
    <label key={k} className="block text-sm font-medium capitalize">
      {k}
      <textarea
        className="mt-1 h-20 w-full input font-normal normal-case"
        value={draft[k]}
        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
        maxLength={1500}
      />
    </label>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Stories bank</h1>
        <p className="mt-1 text-muted">
          Build 5 to 8 strong real examples once, then reuse them across applications and interviews.
        </p>
      </div>

      <section className="space-y-4 card p-4">
        <h2 className="font-semibold">New story</h2>
        <input
          className="w-full input text-sm"
          placeholder="Title, e.g. Leading the Duke of Edinburgh expedition"
          aria-label="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <div className="flex flex-wrap gap-2 text-sm">
          {COMPETENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              className={`chip ${draft.competencies.includes(c) ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Stuck? Write rough notes and let AI structure them</summary>
          <div className="mt-2 space-y-2">
            <p className="text-xs text-muted">
              Some employers restrict AI help in applications. Check their rules, and rewrite the result in your own
              words.
            </p>
            <textarea
              className="h-24 w-full input"
              aria-label="Rough notes"
              placeholder="What happened, what you did, how it turned out. Messy is fine. Don't include names or contact details."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={3000}
            />
            <button
              type="button"
              onClick={build}
              disabled={busy || notes.trim().length < 20}
              className="btn btn-secondary"
            >
              {busy ? "Working..." : "Turn into STAR"}
            </button>
            {tip && <p className="text-muted">Tip: {tip}</p>}
            {error && <p className="text-coral-600">{error}</p>}
          </div>
        </details>
        {(["situation", "task", "action", "result"] as const).map(field)}
        <button
          onClick={save}
          disabled={!canSave}
          className="btn btn-primary"
        >
          Save story
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          {["All", ...COMPETENCIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip ${filter === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
        {loaded && shown.length === 0 && <p className="text-sm text-muted">No stories yet.</p>}
        {shown.map((s) => (
          <article key={s.id} className="space-y-1 card p-4 text-sm">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{s.title}</h3>
              <button className="text-muted hover:text-coral-600" onClick={() => update((p) => p.filter((x) => x.id !== s.id))}>
                Delete
              </button>
            </div>
            <p className="text-xs text-muted">{s.competencies.join(" · ") || "Untagged"}</p>
            <p><strong>S:</strong> {s.situation}</p>
            <p><strong>T:</strong> {s.task}</p>
            <p><strong>A:</strong> {s.action}</p>
            <p><strong>R:</strong> {s.result}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default function Stories() {
  return (
    <RequireAccount what="build your stories bank">
      <StoriesInner />
    </RequireAccount>
  );
}
