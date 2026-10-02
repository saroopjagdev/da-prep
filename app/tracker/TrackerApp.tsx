"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { EMPLOYERS } from "@/lib/employers";
import { applicationsToIcs, hasDeadlines } from "@/lib/ics";
import { useCollection } from "@/lib/store";
import { fromTemplate, type TrackerFirm } from "@/lib/tracker-item";
import { STATUSES, type Application, type Status } from "@/lib/types";

const OUTCOME: Partial<Record<Status, string>> = {
  Offer: "bg-mint-50 text-mint-600",
  Rejected: "bg-coral-50 text-coral-600",
};

export default function TrackerApp({ firms }: { firms: TrackerFirm[] }) {
  const { user, enabled } = useAuth();
  const { items: apps, loaded, update } = useCollection<Application>("applications");
  const [employer, setEmployer] = useState("");
  const [role, setRole] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rolling, setRolling] = useState(false);
  const [pickSlug, setPickSlug] = useState("");
  const [pickProgramme, setPickProgramme] = useState(0);
  const picked = firms.find((f) => f.slug === pickSlug);
  const [filter, setFilter] = useState<Status | "All">("All");

  function add() {
    if (!employer.trim()) return;
    update((prev) => [
      ...prev,
      { id: crypto.randomUUID(), employer: employer.trim(), role: role.trim(), deadline, status: "Interested", notes: "", rolling },
    ]);
    setEmployer("");
    setRole("");
    setDeadline("");
    setRolling(false);
  }

  function addFromGuide() {
    const t = picked?.programmes[pickProgramme];
    if (!t) return;
    update((prev) => [...prev, fromTemplate(t, crypto.randomUUID())]);
    setPickSlug("");
    setPickProgramme(0);
  }
  const alreadyTracked = (firm: string, role: string) => apps.some((a) => a.firm === firm && a.role === role);

  const patch = (id: string, p: Partial<Application>) =>
    update((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));

  const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD (toISOString would be UTC)

  function downloadCalendar() {
    const url = URL.createObjectURL(new Blob([applicationsToIcs(apps)], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "level6-deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  }
  const active = (a: Application) => a.status !== "Offer" && a.status !== "Rejected";
  const sorted = [...apps]
    .filter((a) => filter === "All" || a.status === filter)
    .sort((a, b) => (a.deadline || "9999").localeCompare(b.deadline || "9999"));
  const closingSoon = apps.filter((a) => {
    if (!a.deadline || !active(a) || a.status !== "Interested") return false;
    const days = (Date.parse(a.deadline) - Date.parse(today)) / 86_400_000;
    return days >= 0 && days <= 14;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="page-title">Application tracker</h1>
          <p className="text-xs text-muted">
            {enabled && user
              ? "Synced to your account."
              : "Saved in this browser only. Clearing site data deletes it. Download a backup from your account page, or sign in to sync."}
          </p>
        </div>
        {hasDeadlines(apps) && (
          <button onClick={downloadCalendar} className="btn btn-secondary">
            Add deadlines to calendar
          </button>
        )}
      </div>

      {closingSoon.length > 0 && (
        <div className="callout bg-sun-50 text-sun-600">
          <strong>Closing within 14 days and not applied yet:</strong>{" "}
          {closingSoon.map((a) => `${a.employer} (${a.deadline})`).join(", ")}
        </div>
      )}

      <section className="card space-y-3 p-4" aria-labelledby="from-guides">
        <h2 id="from-guides" className="font-semibold">
          Add from our employer guides
        </h2>
        <p className="text-sm text-muted">Adds the programme with the firm&apos;s stages as a checklist and last cycle&apos;s dates as a guide.</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <select
            className="input"
            aria-label="Employer guide"
            value={pickSlug}
            onChange={(e) => {
              setPickSlug(e.target.value);
              setPickProgramme(0);
            }}
          >
            <option value="">Choose an employer</option>
            {firms.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.name}
              </option>
            ))}
          </select>
          <select
            className="input"
            aria-label="Programme"
            value={pickProgramme}
            disabled={!picked}
            onChange={(e) => setPickProgramme(Number(e.target.value))}
          >
            {(picked?.programmes ?? []).map((p, i) => (
              <option key={i} value={i}>
                {p.role}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addFromGuide}
            disabled={!picked || alreadyTracked(picked.slug, picked.programmes[pickProgramme]?.role ?? "")}
          >
            {picked && alreadyTracked(picked.slug, picked.programmes[pickProgramme]?.role ?? "") ? "In tracker" : "Add"}
          </button>
        </div>
      </section>

      <form
        className="card grid gap-3 p-4 sm:grid-cols-[1.2fr_1.2fr_auto_auto_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          list="employer-suggestions"
          className="input"
          placeholder="Employer"
          aria-label="Employer"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
        />
        <datalist id="employer-suggestions">
          {EMPLOYERS.map((e) => (
            <option key={e.name} value={e.name} />
          ))}
        </datalist>
        <input className="input" placeholder="Role" aria-label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input type="date" className="input" aria-label="Closing date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-brand-600" checked={rolling} onChange={(e) => setRolling(e.target.checked)} />
          Rolling
        </label>
        <button className="btn btn-primary" disabled={!employer.trim()}>
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 text-sm">
        {(["All", ...STATUSES] as const).map((s) => {
          const count = s === "All" ? apps.length : apps.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`chip ${filter === s ? "chip-active" : ""}`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {sorted.length === 0 && loaded && (
        <div className="card border-dashed p-10 text-center">
          <p className="font-bold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">
            Add an employer above, or pick from the <Link href="/employers" className="underline">employer list</Link>.
          </p>
        </div>
      )}
      <ul className="space-y-3">
        {sorted.map((a) => {
          const overdue = a.deadline && a.deadline < today && a.status === "Interested";
          return (
            <li
              key={a.id}
              className="card animate-pop space-y-3 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {a.employer}
                    {OUTCOME[a.status] && (
                      <span className={`ml-2 rounded-md px-2 py-0.5 text-xs font-semibold ${OUTCOME[a.status]}`}>
                        {a.status}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted">{a.role || "No role set"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${overdue ? "bg-coral-50 text-coral-600" : "bg-brand-50 text-brand-700"}`}>
                    {a.deadline ? `Closes ${a.deadline}` : a.rolling ? "Rolling: apply early" : "No date"}
                    {overdue && " (passed)"}
                  </span>
                  <input
                    type="date"
                    className="input !w-auto !py-1"
                    aria-label={`Closing date for ${a.employer}`}
                    value={a.deadline}
                    onChange={(e) => patch(a.id, { deadline: e.target.value })}
                  />
                  <select className="input !w-auto !py-1" aria-label="Status" value={a.status} onChange={(e) => patch(a.id, { status: e.target.value as Status })}>
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button className="text-muted hover:text-coral-600" onClick={() => update((p) => p.filter((x) => x.id !== a.id))}>
                    Delete
                  </button>
                </div>
              </div>
              {(a.datesHint || a.firm) && (
                <p className="text-xs text-muted">
                  {a.datesHint && <>Last cycle: {a.datesHint} </>}
                  {a.firm && (
                    <Link href={`/employers/${a.firm}`} className="underline">
                      Employer guide
                    </Link>
                  )}
                </p>
              )}
              {a.checklist && a.checklist.length > 0 && (
                <fieldset className="space-y-1">
                  <legend className="text-sm font-semibold">
                    Stages: {a.checklist.filter((c) => c.done).length} of {a.checklist.length} done
                  </legend>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {a.checklist.map((c, i) => (
                      <li key={i}>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="accent-brand-600"
                            checked={c.done}
                            onChange={(e) =>
                              patch(a.id, { checklist: a.checklist!.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)) })
                            }
                          />
                          {c.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              )}
              <textarea className="w-full input text-sm" placeholder="Notes" aria-label="Notes" value={a.notes} onChange={(e) => patch(a.id, { notes: e.target.value })} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
