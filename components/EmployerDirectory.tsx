"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STATUS_LABEL } from "@/lib/opportunities";
import { SECTORS, SECTOR_BY_ID, type SectorId } from "@/lib/sectors";

export type DirectoryCard = {
  slug: string;
  name: string;
  sector: SectorId;
  status: keyof typeof STATUS_LABEL;
  hasMock: boolean;
  logo?: string;
};

const STATUS_STYLE: Record<DirectoryCard["status"], string> = {
  open: "bg-mint-50 text-mint-600",
  "opening-soon": "bg-sun-50 text-sun-600",
  "not-announced": "bg-soft text-muted",
  closed: "bg-soft text-muted",
  "not-confirmed": "bg-soft text-muted",
};

/** Every employer guide in one place, grouped by sector. The only control is a search box: no filters to configure. */
export default function EmployerDirectory({ cards }: { cards: DirectoryCard[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      SECTORS.map((s) => ({ sector: s, cards: cards.filter((c) => c.sector === s.id && (!q || c.name.toLowerCase().includes(q))) })).filter(
        (g) => g.cards.length > 0,
      ),
    [cards, q],
  );
  const total = groups.reduce((n, g) => n + g.cards.length, 0);

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label htmlFor="employer-search" className="sr-only">
          Search employers
        </label>
        <input
          id="employer-search"
          type="search"
          className="input w-full"
          placeholder="Search employers"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 80))}
        />
        <p className="mt-1 text-xs text-muted" role="status">
          {total} employer{total === 1 ? "" : "s"}
        </p>
      </div>
      {groups.length === 0 && <p className="text-muted">No employer matches &ldquo;{query}&rdquo;.</p>}
      {groups.map(({ sector, cards: list }) => (
        <section key={sector.id} aria-labelledby={`sector-${sector.id}`} className="space-y-3">
          <h2 id={`sector-${sector.id}`} className="text-lg font-bold">
            {SECTOR_BY_ID[sector.id].name} <span className="font-normal text-muted">({list.length})</span>
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.slug} className="card flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-white p-1.5">
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo} alt="" className="max-h-full max-w-full object-contain" height={36} />
                    ) : (
                      <span className="text-xs font-bold text-muted">{c.name.slice(0, 3).toUpperCase()}</span>
                    )}
                  </span>
                  <Link href={`/employers/${c.slug}`} className="font-semibold underline-offset-2 hover:underline">
                    {c.name}
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  {c.hasMock && <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">Mock process · Pro</span>}
                </div>
                <div className="mt-auto flex flex-wrap gap-3 text-sm">
                  <Link href={`/employers/${c.slug}`} className="font-semibold text-brand-700 underline-offset-2 hover:underline">
                    Read the guide
                  </Link>
                  {c.hasMock && (
                    <Link href={`/mock/${c.slug}`} className="font-semibold text-brand-700 underline-offset-2 hover:underline">
                      Run the mock
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
