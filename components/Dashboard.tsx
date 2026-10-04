"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import Progress from "@/components/Progress";
import { useSector } from "@/lib/prefs";
import { SECTOR_BY_ID } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import type { Application, PracticeRecord, SessionRecord, Story } from "@/lib/types";

const day = (d: Date) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

/** Consecutive days with any practice, counting back from today (or yesterday, so an unbroken streak survives until tonight). */
function streak(dates: string[]) {
  const days = new Set(dates.map((d) => day(new Date(d))));
  const cursor = new Date();
  if (!days.has(day(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(day(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

export default function Dashboard() {
  const { sector } = useSector();
  const sessions = useCollection<SessionRecord>("sessions");
  const practice = useCollection<PracticeRecord>("practice");
  const apps = useCollection<Application>("applications");
  const stories = useCollection<Story>("stories");

  if (!sessions.loaded || !practice.loaded || !apps.loaded || !stories.loaded) return null;

  const s = streak([...sessions.items.map((x) => x.date), ...practice.items.map((x) => x.date)]);
  const today = day(new Date());
  const upcoming = apps.items
    .filter((a) => a.deadline && a.deadline >= today && a.status === "Interested")
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

  const checklist = [
    { done: !!sector, label: "Pick your sector", href: "/sectors" },
    { done: sessions.items.length > 0, label: "Do a mock interview", href: "/interview" },
    { done: practice.items.length > 0, label: "Try a practice test", href: "/practice" },
    { done: apps.items.length >= 3, label: "Track 3 applications", href: "/opportunities?mine=1" },
    { done: stories.items.length > 0, label: "Save a STAR story", href: "/stories" },
  ];
  const done = checklist.filter((c) => c.done).length;
  const next = checklist.find((c) => !c.done);

  return (
    <section className="card animate-fade-up grid gap-6 p-6 md:grid-cols-[1.4fr_1fr]" aria-label="Your prep">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="display text-lg font-bold tracking-tight">
            Your prep{sector && <span className="font-medium text-muted"> · {SECTOR_BY_ID[sector].name}</span>}
          </h2>
          <span className="text-sm font-bold text-brand-700">
            {done}/{checklist.length}
          </span>
        </div>
        <Progress value={done} max={checklist.length} label="Prep checklist progress" className="!h-2.5" />
        <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
          {checklist.map((c) => (
            <li key={c.label}>
              <Link
                href={c.href}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-50 ${
                  c.done ? "text-muted line-through" : "font-medium"
                }`}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] font-bold ${
                    c.done ? "border-mint-600 bg-mint-600 text-white" : "border-line"
                  }`}
                  aria-hidden
                >
                  {c.done ? "✓" : ""}
                </span>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-lg bg-brand-50 p-4">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="flame" className={`h-5 w-5 ${s > 0 ? "text-pop-500" : "text-muted"}`} />
            {s > 0 ? `${s}-day streak` : "Start a streak today"}
          </p>
          {upcoming && (
            <p className="text-sm">
              <strong>Next deadline:</strong> {upcoming.employer}, {upcoming.deadline}
            </p>
          )}
        </div>
        <Link href={next ? next.href : "/interview"} className="btn btn-primary">
          {next ? `Next: ${next.label.toLowerCase()}` : "Keep practising"}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
