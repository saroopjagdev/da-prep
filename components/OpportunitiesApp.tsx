"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { applicationsToIcs, hasDeadlines } from "@/lib/ics";
import type { OpportunityRow, Status as OppStatus } from "@/lib/opportunities";
import { STATUS_LABEL } from "@/lib/opportunities";
import { SECTORS, SECTOR_BY_ID, type SectorId } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import { fromTemplate } from "@/lib/tracker-item";
import { STATUSES, type Application, type Status } from "@/lib/types";

const CHIP: Record<OppStatus, string> = {
  open: "bg-mint-50 text-mint-700 ring-mint-200",
  "opening-soon": "bg-sun-50 text-sun-700 ring-sun-200",
  "not-announced": "bg-soft text-muted ring-line",
  closed: "bg-soft text-muted ring-line",
  "not-confirmed": "bg-soft text-muted ring-line",
};
const OPP_STATUSES: OppStatus[] = ["open", "opening-soon", "not-announced", "closed", "not-confirmed"];
const NOT_APPLIED = "Not applied";
const MINE_COLOUR: Partial<Record<Status, string>> = { Offer: "bg-mint-50 text-mint-700", Rejected: "bg-coral-50 text-coral-600" };
const PAGE = 60;

// Employers are grouped under their main sector, in this order; one with several sectors sits under the first.
const SECTOR_ORDER: SectorId[] = ["finance", "digital", "engineering", "construction", "public", "business", "law"];
const primary = (r: OpportunityRow): SectorId => r.sectors[0] ?? "business";
const rank = (r: OpportunityRow) => {
  const i = SECTOR_ORDER.indexOf(primary(r));
  return i === -1 ? SECTOR_ORDER.length : i;
};

/** The application a student has for this employer, if any. */
const mine = (apps: Application[], r: OpportunityRow) => apps.find((a) => (a.firm ? a.firm === r.slug : a.employer.toLowerCase() === r.name.toLowerCase()));
const pristine = (a: Application) => !a.notes.trim() && !(a.checklist ?? []).some((c) => c.done);

export default function OpportunitiesApp({ rows }: { rows: OpportunityRow[] }) {
  const { user, enabled } = useAuth();
  const { items: apps, loaded, update } = useCollection<Application>("applications");
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<SectorId | "all">("all");
  const [status, setStatus] = useState<OppStatus | "all">("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [onlyGuides, setOnlyGuides] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<string | null>(null);
  const [kept, setKept] = useState("");
  const [own, setOwn] = useState({ employer: "", role: "", deadline: "" });

  // Links like /opportunities?mine=1 (from the menu) and /opportunities?q=barclays (from the home search) steer the page,
  // including when you are already on it, so follow the URL as it changes.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- the URL is the source for these controls and only the browser knows it */
    setOnlyMine(Boolean(params.get("mine")));
    setOnlyGuides(Boolean(params.get("guides")));
    const q = params.get("q");
    if (q !== null) setQuery(q.slice(0, 80));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [params]);

  const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
  const patch = (id: string, p: Partial<Application>) => update((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));

  function choose(r: OpportunityRow, a: Application | undefined, value: string) {
    setKept("");
    if (value === NOT_APPLIED) {
      if (!a) return;
      if (pristine(a)) update((p) => p.filter((x) => x.id !== a.id));
      else setKept(`${r.name} stays in your list because it has notes or ticked stages. Open Notes to remove it.`);
      return;
    }
    if (a) return patch(a.id, { status: value as Status });
    update((prev) => [
      ...prev,
      {
        ...(r.template
          ? { ...fromTemplate(r.template, crypto.randomUUID()), employer: r.name }
          : { id: crypto.randomUUID(), employer: r.name, role: r.programmes[0] ?? "", deadline: "", status: "Interested" as Status, notes: "" }),
        status: value as Status,
        ...(r.closesIso ? { deadline: r.closesIso } : {}),
        ...(r.rolling ? { rolling: true } : {}),
      },
    ]);
  }

  const listed = new Set(apps.filter((a) => rows.some((r) => mine([a], r) === a)).map((a) => a.id));
  const unlisted = apps.filter((a) => !listed.has(a.id));
  const filtered = rows.filter(
    (r) =>
      (!onlyMine || mine(apps, r)) &&
      (!onlyGuides || r.slug) &&
      (sector === "all" || r.sectors.includes(sector)) &&
      (status === "all" || r.status === status) &&
      `${r.name} ${r.programmes.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  // Stable sort: sector groups in a fixed order, and within each the order we already have (open first).
  // With a sector chosen, everything shown belongs to it, so there is one group; otherwise group by main sector.
  const groupOf = (r: OpportunityRow): SectorId => (sector === "all" ? primary(r) : sector);
  const grouped = sector === "all" ? [...filtered].sort((a, b) => rank(a) - rank(b)) : filtered;
  const perSector = new Map<SectorId, number>();
  for (const r of grouped) perSector.set(groupOf(r), (perSector.get(groupOf(r)) ?? 0) + 1);
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

  const reset = () => setShown(PAGE);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input !w-auto min-w-48 flex-1 text-sm"
          placeholder="Search employers or programmes"
          aria-label="Search employers or programmes"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            reset();
          }}
        />
        <select
          className="input !w-auto text-sm"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OppStatus | "all");
            reset();
          }}
        >
          <option value="all">Any status</option>
          {OPP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]} ({rows.filter((r) => r.status === s).length})
            </option>
          ))}
        </select>
        <select
          className="input !w-auto text-sm"
          aria-label="Filter by sector"
          value={sector}
          onChange={(e) => {
            setSector(e.target.value as SectorId | "all");
            reset();
          }}
        >
          <option value="all">All sectors</option>
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button onClick={() => setOnlyMine((v) => !v)} aria-pressed={onlyMine} className={`chip ${onlyMine ? "chip-active" : ""}`}>
          My list ({apps.length})
        </button>
        <button onClick={() => setOnlyGuides((v) => !v)} aria-pressed={onlyGuides} className={`chip ${onlyGuides ? "chip-active" : ""}`}>
          With a guide ({rows.filter((r) => r.slug).length})
        </button>
        {hasDeadlines(apps) && (
          <button onClick={downloadCalendar} className="chip">
            Add deadlines to calendar
          </button>
        )}
      </div>

      {closingSoon.length > 0 && (
        <p className="callout bg-sun-50 text-sm text-sun-600">
          <strong>Closing within 14 days, not applied yet:</strong> {closingSoon.map((a) => `${a.employer} (${a.deadline})`).join(", ")}
        </p>
      )}
      {kept && (
        <p className="callout bg-sun-50 text-sm text-sun-600" role="status">
          {kept}
        </p>
      )}

      <div role="region" aria-label="Opportunities table" tabIndex={0} className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Employers with your status, the application status, and opening and closing dates</caption>
          <thead className="bg-soft text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                My status
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Employer
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Status
              </th>
              <th scope="col" className="hidden min-w-28 px-3 py-2 font-semibold md:table-cell">
                Opens
              </th>
              <th scope="col" className="hidden min-w-44 px-3 py-2 font-semibold md:table-cell">
                Closes
              </th>
              <th scope="col" className="hidden min-w-28 whitespace-nowrap px-3 py-2 font-semibold lg:table-cell">
                Assessments
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                <span className="sr-only">Links</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {grouped.slice(0, shown).map((r, i, shownRows) => {
              const a = mine(apps, r);
              const key = r.slug ?? r.name;
              const expanded = open === key && a;
              const overdue = a && a.deadline && a.deadline < today && a.status === "Interested";
              const startsGroup = i === 0 || groupOf(shownRows[i - 1]) !== groupOf(r);
              return (
                <Fragment key={key}>
                  {startsGroup && (
                    <tr className="border-t border-line bg-brand-50">
                      <th scope="colgroup" colSpan={7} className="px-3 py-2 text-left text-sm font-bold text-brand-700">
                        {SECTOR_BY_ID[groupOf(r)].name} <span className="font-normal text-muted">({perSector.get(groupOf(r))})</span>
                      </th>
                    </tr>
                  )}
                  <tr className="border-t border-line align-top hover:bg-soft/60">
                    <td className="px-3 py-2">
                      <select
                        className={`input !w-36 !py-1 text-sm ${a ? `font-semibold ${MINE_COLOUR[a.status] ?? "text-brand-700"}` : "text-muted"}`}
                        aria-label={`My status for ${r.name}`}
                        value={a ? a.status : NOT_APPLIED}
                        onChange={(e) => choose(r, a, e.target.value)}
                      >
                        <option>{NOT_APPLIED}</option>
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {r.slug ? (
                        <Link href={`/employers/${r.slug}`} className="font-semibold underline-offset-2 hover:underline">
                          {r.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{r.name}</span>
                      )}
                      {r.programmes.length > 0 && (
                        <span className="block max-w-[16rem] truncate text-xs text-muted" title={r.programmes.join(" · ")}>
                          {r.programmes[0]}
                          {r.programmes.length > 1 && ` +${r.programmes.length - 1}`}
                        </span>
                      )}
                      {(r.opens || r.closes) && (
                        <span className="block text-xs text-muted md:hidden">
                          {r.opens && `Opens ${r.opens}`}
                          {r.opens && r.closes && " · "}
                          {r.closes && `Closes ${r.closes}`}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span title={r.note} className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${CHIP[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell">
                      <span className="line-clamp-2" title={r.opens}>
                        {r.opens || <span className="text-muted">-</span>}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell">
                      <span className="line-clamp-2" title={r.closes}>
                        {r.closes || <span className="text-muted">-</span>}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted lg:table-cell">
                      <span className="line-clamp-2" title={r.providers.join(", ")}>
                        {r.providers.join(", ") || "-"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right text-xs">
                      {r.slug ? (
                        <>
                          <Link href={`/employers/${r.slug}`} className="underline">
                            Guide
                          </Link>
                          {r.hasMock && (
                            <>
                              {" · "}
                              <Link href={`/mock/${r.slug}`} className="underline">
                                Mock
                              </Link>
                            </>
                          )}
                        </>
                      ) : (
                        <a href={r.vacancyUrl} target="_blank" rel="noreferrer" className="underline">
                          Careers
                        </a>
                      )}
                      {a && (
                        <button
                          onClick={() => setOpen(expanded ? null : key)}
                          aria-expanded={Boolean(expanded)}
                          aria-label={`Notes and stages for ${r.name}`}
                          className="ml-2 rounded-md border border-line px-2 py-0.5 hover:border-brand-500"
                        >
                          Notes{overdue && <span className="text-coral-600"> !</span>}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expanded && a && (
                    <tr className="bg-soft/50">
                      <td colSpan={7} className="px-3 py-3">
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
                        {a.checklist && a.checklist.length > 0 && (
                          <fieldset className="mt-3 space-y-1">
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
                        <textarea className="input mt-3 w-full text-sm" placeholder="Notes" aria-label={`Notes for ${r.name}`} value={a.notes} onChange={(e) => patch(a.id, { notes: e.target.value })} />
                        <button
                          className="mt-2 text-sm text-muted hover:text-coral-600"
                          onClick={() => {
                            update((p) => p.filter((x) => x.id !== a.id));
                            setOpen(null);
                          }}
                        >
                          Remove from my list
                        </button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "employer" : "employers"}
        {!(enabled && user) && ". Your list is saved in this browser only: sign in to sync it."}
      </p>
      {filtered.length > shown && (
        <button className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE)}>
          Show more ({filtered.length - shown} left)
        </button>
      )}
      {onlyMine && loaded && apps.length === 0 && <p className="text-sm text-muted">Nothing in your list yet. Set a status on any employer to add it.</p>}

      {onlyMine && unlisted.length > 0 && (
        <section className="space-y-2" aria-labelledby="others">
          <h2 id="others" className="text-sm font-semibold">
            Other applications I added
          </h2>
          <ul className="space-y-2">
            {unlisted.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-white p-2 text-sm">
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

      <details className="rounded-lg border border-line bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold">Add an employer that is not listed</summary>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1.2fr_auto_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!own.employer.trim()) return;
            update((prev) => [...prev, { id: crypto.randomUUID(), employer: own.employer.trim(), role: own.role.trim(), deadline: own.deadline, status: "Interested", notes: "" }]);
            setOwn({ employer: "", role: "", deadline: "" });
            setOnlyMine(true);
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
