"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { applicationsToIcs, hasDeadlines } from "@/lib/ics";
import type { OpportunityRow, Status as OppStatus } from "@/lib/opportunities";
import { STATUS_LABEL } from "@/lib/opportunities";
import { SECTORS, type SectorId } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import { fromTemplate } from "@/lib/tracker-item";
import { STATUSES, type Application, type Status } from "@/lib/types";

const CHIP: Record<OppStatus, string> = {
  open: "bg-mint-50 text-mint-700 ring-1 ring-mint-200",
  "opening-soon": "bg-sun-50 text-sun-700 ring-1 ring-sun-200",
  "not-announced": "bg-soft text-muted ring-1 ring-line",
  closed: "bg-soft text-muted ring-1 ring-line",
  "not-confirmed": "bg-soft text-muted ring-1 ring-line",
};
const OPP_STATUSES: OppStatus[] = ["open", "opening-soon", "not-announced", "closed", "not-confirmed"];
const OUTCOME: Partial<Record<Status, string>> = { Offer: "bg-mint-50 text-mint-600", Rejected: "bg-coral-50 text-coral-600" };
const PAGE = 40;

/** The application a student has for this employer, if any. */
const mine = (apps: Application[], r: OpportunityRow) => apps.find((a) => (a.firm ? a.firm === r.slug : a.employer.toLowerCase() === r.name.toLowerCase()));

export default function OpportunitiesApp({ rows }: { rows: OpportunityRow[] }) {
  const { user, enabled } = useAuth();
  const { items: apps, loaded, update } = useCollection<Application>("applications");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<SectorId | "all">("all");
  const [status, setStatus] = useState<OppStatus | "all">("all");
  const [view, setView] = useState<"all" | "mine">("all");
  const [shown, setShown] = useState(PAGE);
  const [own, setOwn] = useState({ employer: "", role: "", deadline: "" });

  // Deep link: /opportunities?mine=1 opens straight on the student's own list; ?q= pre-fills the search.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL needs the browser, so it cannot be initial state
    if (p.get("mine")) setView("mine");
    const q = p.get("q");
    if (q) setQuery(q.slice(0, 80));
  }, []);

  const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
  const patch = (id: string, p: Partial<Application>) => update((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));
  const track = (r: OpportunityRow) =>
    update((prev) => [
      ...prev,
      {
        ...(r.template
          ? { ...fromTemplate(r.template, crypto.randomUUID()), employer: r.name }
          : { id: crypto.randomUUID(), employer: r.name, role: r.programmes[0] ?? "", deadline: "", status: "Interested" as Status, notes: "" }),
        ...(r.closesIso ? { deadline: r.closesIso } : {}),
        ...(r.rolling ? { rolling: true } : {}),
      },
    ]);

  const listed = new Set(apps.filter((a) => rows.some((r) => mine([a], r) === a)).map((a) => a.id));
  const unlisted = apps.filter((a) => !listed.has(a.id));
  const filtered = rows.filter(
    (r) =>
      (view === "all" || mine(apps, r)) &&
      (sector === "all" || r.sectors.includes(sector)) &&
      (status === "all" || r.status === status) &&
      `${r.name} ${r.programmes.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  const count = (s: OppStatus) => rows.filter((r) => r.status === s).length;
  const myCount = apps.length;
  const closingSoon = apps.filter((a) => {
    if (!a.deadline || a.status !== "Interested") return false;
    const days = (Date.parse(a.deadline) - Date.parse(today)) / 86_400_000;
    return days >= 0 && days <= 14;
  });

  function downloadCalendar() {
    const url = URL.createObjectURL(new Blob([applicationsToIcs(apps)], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "level6-deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs text-muted">
          {enabled && user
            ? "Your list is synced to your account."
            : "Your list is saved in this browser only. Clearing site data deletes it. Sign in to sync, or download a backup from your account page."}
        </p>
        {hasDeadlines(apps) && (
          <button onClick={downloadCalendar} className="btn btn-secondary">
            Add deadlines to calendar
          </button>
        )}
      </div>

      {closingSoon.length > 0 && (
        <div className="callout bg-sun-50 text-sun-600">
          <strong>Closing within 14 days and not applied yet:</strong> {closingSoon.map((a) => `${a.employer} (${a.deadline})`).join(", ")}
        </div>
      )}

      <input
        className="input w-full text-sm"
        placeholder="Search employers or programmes"
        aria-label="Search employers or programmes"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShown(PAGE);
        }}
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Show">
        <button onClick={() => setView("all")} className={`chip ${view === "all" ? "chip-active" : ""}`}>
          All employers ({rows.length})
        </button>
        <button onClick={() => setView("mine")} className={`chip ${view === "mine" ? "chip-active" : ""}`}>
          My list ({myCount})
        </button>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <button onClick={() => setStatus("all")} className={`chip ${status === "all" ? "chip-active" : ""}`}>
          Any status
        </button>
        {OPP_STATUSES.filter((s) => count(s) > 0).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip ${status === s ? "chip-active" : ""}`}>
            {STATUS_LABEL[s]} ({count(s)})
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
        <button onClick={() => setSector("all")} className={`chip ${sector === "all" ? "chip-active" : ""}`}>
          All sectors
        </button>
        {SECTORS.map((s) => (
          <button key={s.id} onClick={() => setSector(s.id)} className={`chip ${sector === s.id ? "chip-active" : ""}`}>
            {s.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "employer" : "employers"}
      </p>

      {view === "mine" && loaded && myCount === 0 && (
        <div className="card border-dashed p-8 text-center">
          <p className="font-bold">Nothing in your list yet</p>
          <p className="mt-1 text-sm text-muted">Choose All employers and press Track on the ones you are interested in.</p>
        </div>
      )}

      <ul className="space-y-3">
        {filtered.slice(0, shown).map((r) => {
          const a = mine(apps, r);
          const overdue = a && a.deadline && a.deadline < today && a.status === "Interested";
          return (
            <li key={r.slug ?? r.name} className="card space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  {r.slug ? (
                    <Link href={`/employers/${r.slug}`} className="text-lg font-semibold underline">
                      {r.name}
                    </Link>
                  ) : (
                    <p className="text-lg font-semibold">{r.name}</p>
                  )}
                  {r.programmes.length > 0 && (
                    <p className="text-sm text-muted">
                      {r.programmes.slice(0, 2).join(" · ")}
                      {r.programmes.length > 2 && ` · +${r.programmes.length - 2} more`}
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CHIP[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </div>
              <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[6rem_1fr]">
                {r.opens && (
                  <>
                    <dt className="font-semibold">Opens</dt>
                    <dd>{r.opens}</dd>
                  </>
                )}
                {r.closes && (
                  <>
                    <dt className="font-semibold">Closes</dt>
                    <dd>{r.closes}</dd>
                  </>
                )}
                {r.providers.length > 0 && (
                  <>
                    <dt className="font-semibold">Assessments</dt>
                    <dd>{r.providers.join(", ")}</dd>
                  </>
                )}
              </dl>
              {r.status === "not-confirmed" && (
                <p className="text-sm text-muted">
                  {r.slug
                    ? "We have not confirmed this cycle's dates yet. The guide has the usual timing and its source."
                    : "Dates not confirmed yet. We have not researched this employer, so check its own careers page."}
                </p>
              )}
              {r.note && <p className="text-sm text-muted">{r.note}</p>}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {a ? (
                  <label className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">My status</span>
                    <select
                      className="input !w-auto !py-1"
                      aria-label={`My status for ${r.name}`}
                      value={a.status}
                      onChange={(e) => patch(a.id, { status: e.target.value as Status })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {OUTCOME[a.status] && <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${OUTCOME[a.status]}`}>{a.status}</span>}
                  </label>
                ) : (
                  <button onClick={() => track(r)} className="btn btn-primary">
                    Track
                  </button>
                )}
                {r.slug ? (
                  <Link href={`/employers/${r.slug}`} className="btn btn-secondary">
                    Process guide
                  </Link>
                ) : (
                  <a href={r.vacancyUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Find vacancies
                  </a>
                )}
                {r.confidence && <ConfidenceBadge c={r.confidence} />}
                {(r.checked || r.verified) && <span className="text-xs text-muted">{r.checked ? `Checked ${r.checked}` : `Researched ${r.verified}`}</span>}
              </div>

              {a && (
                <details className="rounded-lg border border-line p-3">
                  <summary className="cursor-pointer text-sm font-semibold">
                    My notes, dates and stages
                    {overdue && <span className="ml-2 text-coral-600">(closing date passed)</span>}
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm">
                        <span className="font-semibold">Role</span>
                        <input className="input mt-1 w-full" value={a.role} onChange={(e) => patch(a.id, { role: e.target.value })} placeholder="Role or programme" />
                      </label>
                      <label className="text-sm">
                        <span className="font-semibold">Closing date</span>
                        <input type="date" className="input mt-1 w-full" value={a.deadline} onChange={(e) => patch(a.id, { deadline: e.target.value })} />
                      </label>
                    </div>
                    {a.datesHint && <p className="text-xs text-muted">Last cycle: {a.datesHint}</p>}
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
                                  onChange={(e) => patch(a.id, { checklist: a.checklist!.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)) })}
                                />
                                {c.label}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </fieldset>
                    )}
                    <textarea className="input w-full text-sm" placeholder="Notes" aria-label={`Notes for ${r.name}`} value={a.notes} onChange={(e) => patch(a.id, { notes: e.target.value })} />
                    <button className="text-sm text-muted hover:text-coral-600" onClick={() => update((p) => p.filter((x) => x.id !== a.id))}>
                      Remove from my list
                    </button>
                  </div>
                </details>
              )}
            </li>
          );
        })}
      </ul>
      {filtered.length > shown && (
        <button className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE)}>
          Show more ({filtered.length - shown} left)
        </button>
      )}
      {filtered.length === 0 && view === "all" && <p className="text-sm text-muted">No matches.</p>}

      {view === "mine" && unlisted.length > 0 && (
        <section className="space-y-2" aria-labelledby="others">
          <h2 id="others" className="font-semibold">
            Other applications I added
          </h2>
          <ul className="space-y-2">
            {unlisted.map((a) => (
              <li key={a.id} className="card flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <span>
                  <strong>{a.employer}</strong> <span className="text-muted">{a.role || "No role set"}</span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <input type="date" className="input !w-auto !py-1" aria-label={`Closing date for ${a.employer}`} value={a.deadline} onChange={(e) => patch(a.id, { deadline: e.target.value })} />
                  <select className="input !w-auto !py-1" aria-label={`Status for ${a.employer}`} value={a.status} onChange={(e) => patch(a.id, { status: e.target.value as Status })}>
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button className="text-muted hover:text-coral-600" onClick={() => update((p) => p.filter((x) => x.id !== a.id))}>
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="card p-4">
        <summary className="cursor-pointer font-semibold">Add an employer that is not listed</summary>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1.2fr_auto_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!own.employer.trim()) return;
            update((prev) => [
              ...prev,
              { id: crypto.randomUUID(), employer: own.employer.trim(), role: own.role.trim(), deadline: own.deadline, status: "Interested", notes: "" },
            ]);
            setOwn({ employer: "", role: "", deadline: "" });
            setView("mine");
          }}
        >
          <input className="input" placeholder="Employer" aria-label="Employer" value={own.employer} onChange={(e) => setOwn({ ...own, employer: e.target.value })} />
          <input className="input" placeholder="Role" aria-label="Role" value={own.role} onChange={(e) => setOwn({ ...own, role: e.target.value })} />
          <input type="date" className="input" aria-label="Closing date" value={own.deadline} onChange={(e) => setOwn({ ...own, deadline: e.target.value })} />
          <button className="btn btn-primary" disabled={!own.employer.trim()}>
            Add
          </button>
        </form>
      </details>
    </div>
  );
}
