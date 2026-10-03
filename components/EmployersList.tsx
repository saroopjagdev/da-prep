"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FIND_APPRENTICESHIP_URL } from "@/lib/employers";
import type { DirectoryEntry, NoDegreeRoute } from "@/lib/directory";
import { SECTORS, type SectorId } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import { fromTemplate } from "@/lib/tracker-item";
import type { Application } from "@/lib/types";

export default function EmployersList({ entries, noDegree = [] }: { entries: DirectoryEntry[]; noDegree?: NoDegreeRoute[] }) {
  const apps = useCollection<Application>("applications");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SectorId | "all">("all");
  const [researchedOnly, setResearchedOnly] = useState(false);

  // The home page search sends people here as /employers?q=name.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q.slice(0, 80));
  }, []);

  const list = entries.filter(
    (e) =>
      (!researchedOnly || Boolean(e.slug)) &&
      (filter === "all" || e.sectors.includes(filter)) &&
      `${e.name} ${e.sector}`.toLowerCase().includes(query.toLowerCase()),
  );
  const others = noDegree.filter(
    (n) => (filter === "all" || filter === "finance") && `${n.name} ${n.finding}`.toLowerCase().includes(query.toLowerCase()),
  );
  const tracked = (name: string) => apps.items.some((a) => a.employer === name);

  return (
    <div className="space-y-4">
      <h1 className="page-title">Employers</h1>
      <p className="text-muted">
        A starting list of employers that have offered degree apprenticeships. It is not complete, and processes and
        dates change every year, so always check the employer&apos;s own page. Find live vacancies on{" "}
        <a className="underline" href={FIND_APPRENTICESHIP_URL} target="_blank" rel="noreferrer">
          Find an Apprenticeship
        </a>
        .
      </p>
      <input
        className="w-full input text-sm"
        placeholder="Search by name or sector"
        aria-label="Search employers"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`chip ${filter === "all" ? "chip-active" : ""}`}>
          All
        </button>
        {SECTORS.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`chip ${filter === s.id ? "chip-active" : ""}`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={researchedOnly} onChange={(e) => setResearchedOnly(e.target.checked)} />
        Only employers with a researched process guide
      </label>
      <p className="text-sm text-muted" aria-live="polite">
        {list.length} {list.length === 1 ? "employer" : "employers"}
      </p>
      <ul className="space-y-3">
        {list.map((e) => (
          <li key={e.name} className="flex flex-wrap items-center justify-between gap-2 card p-3">
            <div>
              <p className="font-semibold">{e.name}</p>
              <p className="text-sm text-muted">
                {e.sector}
                {e.note && ` · ${e.note}`}
              </p>
              {e.timing && (
                <p className="text-sm">
                  <span className="font-semibold">Applications:</span> {e.timing}{" "}
                  {e.verified && <span className="text-xs text-muted">(researched {e.verified})</span>}
                </p>
              )}
              {e.slug && (
                <Link className="text-sm underline mr-3" href={`/employers/${e.slug}`}>
                  Process guide
                </Link>
              )}
              {e.link && (
                <a className="text-sm underline" href={e.link} target="_blank" rel="noreferrer">
                  Employer / guidance page
                </a>
              )}
            </div>
            <button
              disabled={tracked(e.name)}
              onClick={() =>
                apps.update((p) => [
                  ...p,
                  e.template
                    ? { ...fromTemplate(e.template, crypto.randomUUID()), employer: e.name }
                    : { id: crypto.randomUUID(), employer: e.name, role: "", deadline: "", status: "Interested", notes: "" },
                ])
              }
              className="btn btn-secondary"
            >
              {tracked(e.name) ? "In tracker" : "Add to tracker"}
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="text-sm text-muted">No matches.</p>}
      {others.length > 0 && (
        <section aria-labelledby="no-degree" className="space-y-2 pt-4">
          <h2 id="no-degree" className="text-lg font-semibold">
            Finance firms without a UK degree apprenticeship
          </h2>
          <p className="text-sm text-muted">
            Well-known names we checked in October 2026 that had no degree-level (Level 6) apprenticeship. Schemes change, so
            check their pages each year.
          </p>
          <ul className="space-y-2">
            {others.map((n) => (
              <li key={n.name} className="card p-3 text-sm">
                <p className="font-semibold">{n.name}</p>
                <p className="text-muted">
                  {n.finding}{" "}
                  <a className="underline" href={n.source} target="_blank" rel="noreferrer">
                    Source
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
