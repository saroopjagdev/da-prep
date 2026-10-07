"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import Progress from "@/components/Progress";
import { usePracticeAllowance } from "@/components/usePracticeAllowance";
import { useUsage } from "@/components/useUsage";
import type { OpenNow } from "@/lib/home";
import { useSector } from "@/lib/prefs";
import { SECTOR_BY_ID } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import type { Application, PracticeRecord, SessionRecord, Story } from "@/lib/types";

const day = (d: Date) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

/** Consecutive days with any practice, counting back from today (or yesterday, so an unbroken streak survives until tonight). */
export function streak(dates: string[]) {
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

const TILES = [
  { href: "/interview", title: "Mock interview", body: "Questions from a real advert, marked" },
  { href: "/practice", title: "Practice tests", body: "Reasoning and judgement, explained" },
  { href: "/mock", title: "Firm mock process", body: "An employer's stages, in order" },
  { href: "/cv", title: "CV and statements", body: "Marked feedback out of 100" },
];

function Card({ title, children, href, cta }: { title: string; children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <section className="card flex flex-col gap-3 p-5" aria-label={title}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{title}</h2>
      <div className="flex-1 space-y-2 text-sm">{children}</div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-brand-700 underline underline-offset-4">
          {cta}
        </Link>
      )}
    </section>
  );
}

export default function HomeDashboard({ open }: { open: OpenNow[] }) {
  const { sector } = useSector();
  const sessions = useCollection<SessionRecord>("sessions");
  const practice = useCollection<PracticeRecord>("practice");
  const apps = useCollection<Application>("applications");
  const stories = useCollection<Story>("stories");
  const usage = useUsage();
  const cap = usePracticeAllowance();

  const s = streak([...sessions.items.map((x) => x.date), ...practice.items.map((x) => x.date)]);
  const today = day(new Date());
  const closing = apps.items
    .filter((a) => a.deadline && a.deadline >= today && a.status === "Interested")
    .filter((a) => (Date.parse(a.deadline) - Date.parse(today)) / 86_400_000 <= 14)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const inList = (st: string) => apps.items.filter((a) => a.status === st).length;
  const recent = [...sessions.items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const avg = recent.length ? Math.round(recent.reduce((t, x) => t + x.overall, 0) / recent.length) : null;
  const tests = practice.items.length;

  const checklist = [
    { done: !!sector, label: "Pick your sector", href: "/sectors" },
    { done: sessions.items.length > 0, label: "Do a mock interview", href: "/interview" },
    { done: practice.items.length > 0, label: "Try a practice test", href: "/practice" },
    { done: apps.items.length >= 3, label: "Track 3 applications", href: "/opportunities" },
    { done: stories.items.length > 0, label: "Save a STAR story", href: "/stories" },
  ];
  const done = checklist.filter((c) => c.done).length;
  const next = checklist.find((c) => !c.done);

  const forSector = open.filter((o) => !sector || o.sectors.includes(sector));
  const openList = (forSector.length ? forSector : open).slice(0, 5);

  return (
    <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 animate-fade-up" aria-label="Your dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your dashboard</h1>
          {sector && <p className="text-sm text-muted">{SECTOR_BY_ID[sector].name}</p>}
        </div>
        <p className="flex items-center gap-2 text-sm font-bold">
          <Icon name="flame" className={`h-5 w-5 ${s > 0 ? "text-pop-500" : "text-muted"}`} />
          {s > 0 ? `${s}-day streak` : "Start a streak today"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="card space-y-4 p-5" aria-label="Next step">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">{next ? `Next: ${next.label.toLowerCase()}` : "You are all set up"}</h2>
            <span className="text-sm font-bold text-brand-700">
              {done}/{checklist.length}
            </span>
          </div>
          <Progress value={done} max={checklist.length} label="Prep checklist progress" className="!h-2.5" />
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-brand-50 ${c.done ? "text-muted line-through" : "font-medium"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] font-bold ${c.done ? "border-mint-600 bg-mint-600 text-white" : "border-line"}`} aria-hidden>
                    {c.done ? "✓" : ""}
                  </span>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={next ? next.href : "/interview"} className="btn btn-primary">
            {next ? next.label : "Keep practising"}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </section>

        <Card title="Your plan" href={usage?.plan !== "pro" ? "/pricing" : undefined} cta="See Pro">
          {!usage ? (
            <p className="text-muted">Checking...</p>
          ) : usage.plan === "pro" ? (
            <p>
              <strong>Pro.</strong> Unlimited practice, and AI mock interviews and reviews on fair-use limits.
            </p>
          ) : (
            <>
              <p>
                <strong>{cap.known ? cap.left : cap.limit}</strong> of {cap.limit} free practice tests left this week
              </p>
              {usage.reviews && (
                <p>
                  <strong>{Math.max(0, usage.reviews.limit - usage.reviews.used)}</strong> of {usage.reviews.limit} CV and statement reviews left this week
                </p>
              )}
              {usage.interviews && usage.interviews.limit === 0 ? (
                <p className="text-muted">AI mock interviews and firm mock processes are part of Pro.</p>
              ) : (
                usage.interviews && (
                  <p>
                    <strong>{Math.max(0, usage.interviews.limit - usage.interviews.used)}</strong> of {usage.interviews.limit} AI mock interviews left this month
                  </p>
                )
              )}
            </>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Open now" href="/opportunities" cta="Opportunities tracker">
          {openList.length === 0 ? (
            <p className="text-muted">Nothing confirmed open yet. Opening soon are listed in the opportunities tracker.</p>
          ) : (
            <ul className="space-y-2">
              {openList.map((o) => (
                <li key={o.slug}>
                  <Link href={`/employers/${o.slug}`} className="font-semibold hover:underline">
                    {o.name}
                  </Link>
                  <p className="line-clamp-2 text-xs text-muted" title={o.closes}>
                    {o.closes}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="My tracker" href="/opportunities?mine=1" cta="Open my tracker">
          {apps.items.length === 0 ? (
            <p className="text-muted">Nothing tracked yet. Set a status on any employer to start.</p>
          ) : (
            <>
              <p>
                {apps.items.length} tracked: {inList("Applied")} applied, {inList("Online tests") + inList("Video interview") + inList("Assessment centre")} in progress,{" "}
                {inList("Offer")} offers
              </p>
              {closing.length > 0 && (
                <p className="rounded-md bg-sun-50 p-2 text-sun-600">
                  <strong>Closing soon:</strong> {closing.slice(0, 3).map((a) => `${a.employer} (${a.deadline})`).join(", ")}
                </p>
              )}
            </>
          )}
        </Card>

        <Card title="Practice" href="/progress" cta="See progress">
          <p>
            {sessions.items.length} mock {sessions.items.length === 1 ? "interview" : "interviews"}, {tests} practice {tests === 1 ? "test" : "tests"}
          </p>
          {avg !== null ? (
            <p>
              Recent interview average <strong>{avg}/100</strong>
            </p>
          ) : (
            <p className="text-muted">Your first marked interview shows your score here.</p>
          )}
        </Card>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Start something">
        {TILES.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="card card-hover block h-full p-4">
              <span className="font-semibold">{t.title}</span>
              <span className="block text-sm text-muted">{t.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
