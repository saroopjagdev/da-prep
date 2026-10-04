"use client";

import { useState } from "react";
import Link from "next/link";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import type { OpportunityRow, Status } from "@/lib/opportunities";
import { STATUS_LABEL } from "@/lib/opportunities";
import { SECTORS, type SectorId } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import { fromTemplate } from "@/lib/tracker-item";
import type { Application } from "@/lib/types";

const CHIP: Record<Status, string> = {
  open: "bg-mint-50 text-mint-700 ring-1 ring-mint-200",
  "opening-soon": "bg-sun-50 text-sun-700 ring-1 ring-sun-200",
  "not-announced": "bg-soft text-muted ring-1 ring-line",
  closed: "bg-soft text-muted ring-1 ring-line line-through decoration-1",
  "not-confirmed": "bg-soft text-muted ring-1 ring-line",
};
const STATUSES: Status[] = ["open", "opening-soon", "not-announced", "closed", "not-confirmed"];

export default function OpportunityList({ rows }: { rows: OpportunityRow[] }) {
  const apps = useCollection<Application>("applications");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<SectorId | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");

  const list = rows.filter(
    (r) =>
      (sector === "all" || r.sectors.includes(sector)) &&
      (status === "all" || r.status === status) &&
      r.name.toLowerCase().includes(query.toLowerCase()),
  );
  const count = (s: Status) => rows.filter((r) => r.status === s).length;
  const tracked = (name: string) => apps.items.some((a) => a.employer === name);

  return (
    <div className="space-y-4">
      <input
        className="input w-full text-sm"
        placeholder="Search employers"
        aria-label="Search employers"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <button onClick={() => setStatus("all")} className={`chip ${status === "all" ? "chip-active" : ""}`}>
          All ({rows.length})
        </button>
        {STATUSES.filter((s) => count(s) > 0).map((s) => (
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
        {list.length} {list.length === 1 ? "employer" : "employers"}
      </p>
      <ul className="space-y-3">
        {list.map((r) => (
          <li key={r.slug} className="card space-y-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link href={`/employers/${r.slug}`} className="text-lg font-semibold underline">
                {r.name}
              </Link>
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
                We have not confirmed this cycle&apos;s dates yet. The guide has the usual timing and its source.
              </p>
            )}
            {r.note && <p className="text-sm text-muted">{r.note}</p>}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href={`/employers/${r.slug}`} className="btn btn-secondary">
                Process guide
              </Link>
              <button
                disabled={tracked(r.name)}
                onClick={() =>
                  apps.update((p) => [
                    ...p,
                    r.template
                      ? { ...fromTemplate(r.template, crypto.randomUUID()), employer: r.name }
                      : { id: crypto.randomUUID(), employer: r.name, role: "", deadline: "", status: "Interested", notes: "" },
                  ])
                }
                className="btn btn-secondary"
              >
                {tracked(r.name) ? "In my tracker" : "Add to my tracker"}
              </button>
              {r.confidence && <ConfidenceBadge c={r.confidence} />}
              <span className="text-xs text-muted">{r.checked ? `Checked ${r.checked}` : `Researched ${r.verified}`}</span>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="text-sm text-muted">No matches.</p>}
    </div>
  );
}
