"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import Progress from "@/components/Progress";
import UnlockProgress from "@/components/UnlockProgress";
import { useUsage } from "@/components/useUsage";
import {
  allowances,
  countdown,
  left,
  limitReached,
  pipelineRows,
  shortDate,
  STARTER_TARGET,
  URGENT_PROMPTS,
  type Allowance,
  type Countdown,
} from "@/lib/dashboard";
import { track } from "@/lib/funnel";
import type { OpenNow } from "@/lib/home";
import { PRO_PLAN } from "@/lib/plans";
import { useSector } from "@/lib/prefs";
import { SECTOR_BY_ID } from "@/lib/sectors";
import { useCollection } from "@/lib/store";
import { fromTemplate } from "@/lib/tracker-item";
import { nextPrompt } from "@/lib/tracker-prompts";
import type {
  Application,
  PracticeRecord,
  SessionRecord,
  Status,
} from "@/lib/types";

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

const STAGE_CHIP: Record<Status, string> = {
  Interested: "bg-soft text-muted",
  Applied: "bg-brand-50 text-brand-700",
  "Online tests": "bg-brand-50 text-brand-700",
  "Video interview": "bg-brand-50 text-brand-700",
  "Assessment centre": "bg-brand-50 text-brand-700",
  Offer: "bg-mint-50 text-mint-700",
  Rejected: "bg-coral-50 text-coral-600",
};
const COUNTDOWN_CHIP: Record<Countdown["tone"], string> = {
  urgent: "bg-coral-50 text-coral-600",
  soon: "bg-sun-50 text-sun-600",
  calm: "bg-soft text-muted",
};

const Chip = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

const ProBadge = () => (
  <span className="rounded bg-sun-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sun-700">
    Pro
  </span>
);

/** The first clause of a long closing note, cut at a word, so a row stays on one line (the full text is in the tooltip). */
const brief = (t: string, max = 44) => {
  const first = (t ?? "").split(";")[0].trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 20 ? cut.lastIndexOf(" ") : max)}…`;
};

/** What an employer's row says about when it closes: a date when we have one, otherwise the employer's own wording, trimmed. */
const closesText = (o: OpenNow) =>
  o.closesIso
    ? `Closes ${shortDate(o.closesIso)}`
    : o.rolling
      ? "Rolling: closes when full"
      : brief(o.closes) || "Open now";

function Section({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 ${className}`} aria-label={title}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function HomeDashboard({ open }: { open: OpenNow[] }) {
  const { sector } = useSector();
  const sessions = useCollection<SessionRecord>("sessions");
  const practice = useCollection<PracticeRecord>("practice");
  const apps = useCollection<Application>("applications");
  const usage = useUsage();
  // If the plan cannot be read (a slow or failed request), stop showing a loading placeholder after a few seconds.
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const today = day(new Date());
  const tracked = apps.items;
  const s = streak([
    ...sessions.items.map((x) => x.date),
    ...practice.items.map((x) => x.date),
  ]);
  const lastScore = [...sessions.items].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]?.overall;

  const isTracked = (o: OpenNow) =>
    tracked.some((a) =>
      a.firm
        ? a.firm === o.slug
        : a.employer.toLowerCase() === o.name.toLowerCase(),
    );
  const forSector = open.filter((o) => !sector || o.sectors.includes(sector));
  const pool = (forSector.length ? forSector : open).filter(
    (o) => !isTracked(o),
  );

  const prompt = nextPrompt(tracked, today, (employer) => {
    const o = open.find((x) => x.name === employer);
    return o?.hasMock && o.slug ? `/mock/${o.slug}` : null;
  });
  const urgent = Boolean(prompt && URGENT_PROMPTS.has(prompt.key));
  const starter = !urgent && tracked.length < STARTER_TARGET;

  function trackIt(o: OpenNow) {
    apps.update((prev) => {
      if (
        prev.some((a) =>
          a.firm
            ? a.firm === o.slug
            : a.employer.toLowerCase() === o.name.toLowerCase(),
        )
      )
        return prev;
      const base: Application = o.template
        ? { ...fromTemplate(o.template, crypto.randomUUID()), employer: o.name }
        : {
            id: crypto.randomUUID(),
            employer: o.name,
            role: "",
            deadline: "",
            status: "Interested",
            notes: "",
          };
      return [
        ...prev,
        {
          ...base,
          ...(o.closesIso ? { deadline: o.closesIso } : {}),
          ...(o.rolling ? { rolling: true } : {}),
        },
      ];
    });
    track("dash_track");
  }

  const free = usage?.plan === "free" && usage.enforced;
  const out = limitReached(usage);
  const rows = allowances(usage);
  const by = (key: Allowance["key"]) => rows.find((r) => r.key === key);

  const planCard = !usage ? (
    gaveUp ? null : (
      <section
        className="card space-y-2 p-5"
        aria-label="Your plan"
        aria-busy="true"
      >
        <div className="h-4 w-24 animate-pulse rounded bg-soft" />
        <div className="h-3 w-48 animate-pulse rounded bg-soft" />
      </section>
    )
  ) : usage.plan === "pro" ? (
    <section
      className="card flex items-center justify-between gap-3 p-5"
      aria-label="Your plan"
    >
      <p className="text-sm">
        <strong>Pro is on.</strong>{" "}
        <span className="text-muted">
          Unlimited practice and mock interviews, every firm mock process.
        </span>
      </p>
      <Link
        href="/pricing"
        className="shrink-0 text-sm font-semibold text-brand-700 underline underline-offset-4"
      >
        Manage
      </Link>
    </section>
  ) : free ? (
    <section
      className={`card space-y-3 p-5 ${out ? "border-brand-600 bg-brand-50" : ""}`}
      aria-label="Your plan"
    >
      <h2 className="text-base font-bold tracking-tight">
        {out ? "You have used a free allowance" : "Free plan"}
      </h2>
      <p className="text-sm text-muted">
        {out
          ? "Pro unlocks unlimited practice and mock interviews, every firm mock process, and reviews on fair use."
          : "Pro adds unlimited practice and mock interviews and every firm mock process."}
      </p>
      <Link
        href="/pricing"
        onClick={() => track("dash_upgrade_click")}
        className={`btn ${out ? "btn-primary" : "btn-secondary"} w-full justify-center sm:w-auto`}
      >
        {out ? `Unlock Pro: ${PRO_PLAN.price}` : "See what Pro adds"}
      </Link>
      <UnlockProgress />
    </section>
  ) : null;

  return (
    <section
      className="mx-auto max-w-6xl space-y-4 px-4 py-6 animate-fade-up sm:py-8"
      aria-label="Your next steps"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your next steps</h1>
          <p className="text-sm text-muted">
            {sector ? SECTOR_BY_ID[sector].name : "All sectors"} ·{" "}
            <Link href="/sectors" className="underline underline-offset-2">
              change
            </Link>
          </p>
        </div>
        <p
          className="flex items-center gap-2 text-sm font-semibold"
          title="Days in a row with a practice test or mock interview"
        >
          <Icon
            name="flame"
            className={`h-5 w-5 ${s > 0 ? "text-pop-500" : "text-muted"}`}
          />
          {s > 0 ? `${s}-day streak` : "No streak yet"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 space-y-4">
          {/* The one thing to do next. */}
          {!apps.loaded ? (
            <div
              className="h-56 animate-pulse rounded-2xl bg-navy/90"
              aria-hidden
            />
          ) : starter ? (
            <section
              className="rounded-2xl bg-navy p-5 text-white sm:p-6"
              aria-label="Start here"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-brand-100">
                Start here
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                {tracked.length === 0
                  ? "Pick the employers you are aiming for"
                  : `Track ${STARTER_TARGET - tracked.length} more to build your list`}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                Tap Track and we count down to each closing date. Most students
                follow two or three.
              </p>
              {pool.length === 0 ? (
                <p className="mt-4 text-sm text-white/80">
                  Nothing confirmed open in your sector right now. The tracker
                  lists who is opening soon.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10 rounded-xl bg-white/5">
                  {pool.slice(0, 3).map((o) => (
                    <li
                      key={o.slug ?? o.name}
                      className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <Link
                          href={
                            o.slug ? `/employers/${o.slug}` : "/opportunities"
                          }
                          className="block truncate font-semibold hover:underline"
                        >
                          {o.name}
                        </Link>
                        <p
                          className="truncate text-xs text-white/70"
                          title={o.closes}
                        >
                          {closesText(o)}
                        </p>
                      </div>
                      <button
                        onClick={() => trackIt(o)}
                        className="shrink-0 rounded-lg bg-white px-3.5 py-2 text-sm font-bold text-navy hover:bg-brand-50"
                        aria-label={`Track ${o.name}`}
                      >
                        Track
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Link
                  href="/opportunities"
                  className="font-semibold text-white underline underline-offset-4"
                >
                  See all employers
                </Link>
                <Link
                  href="/interview"
                  className="text-white/80 underline underline-offset-4"
                >
                  Or try a marked mock interview
                </Link>
              </div>
            </section>
          ) : (
            <section
              className="rounded-2xl bg-navy p-5 text-white sm:p-6"
              aria-label="Your next step"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-brand-100">
                Your next step
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                {prompt?.title ?? "Practise for your next stage"}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-white/80">
                {prompt?.body ??
                  "Pick the stage you are preparing for and get marked feedback."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={prompt?.href ?? "/interview"}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-navy hover:bg-brand-50"
                >
                  {prompt?.cta ?? "Start practising"}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                {prompt?.pro && usage?.plan === "free" && <ProBadge />}
              </div>
            </section>
          )}

          {limitReached(usage) && planCard}

          {tracked.length > 0 && (
            <Section
              title="Your applications"
              aside={
                tracked.length > 0 && (
                  <Link
                    href="/opportunities?mine=1"
                    className="text-sm font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Open my tracker
                  </Link>
                )
              }
            >
              <ul className="divide-y divide-line">
                {pipelineRows(tracked, today)
                  .slice(0, 5)
                  .map((a) => {
                    const c = countdown(a, today);
                    return (
                      <li key={a.id}>
                        <Link
                          href="/opportunities?mine=1"
                          className="flex items-center justify-between gap-3 py-2.5 hover:bg-soft/60"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">
                              {a.employer}
                            </span>
                            {a.role && (
                              <span className="block truncate text-xs text-muted">
                                {a.role}
                              </span>
                            )}
                          </span>
                          <span className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                            {c && (
                              <Chip className={COUNTDOWN_CHIP[c.tone]}>
                                {c.text}
                              </Chip>
                            )}
                            <Chip className={STAGE_CHIP[a.status]}>
                              {a.status}
                            </Chip>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
              {tracked.length > 5 && (
                <p className="mt-2 text-xs text-muted">
                  and {tracked.length - 5} more in your tracker
                </p>
              )}
            </Section>
          )}

          {!starter && pool.length > 0 && (
            <Section
              title="Open for applications"
              aside={
                <Link
                  href="/opportunities"
                  className="text-sm font-semibold text-brand-700 underline underline-offset-4"
                >
                  See all
                </Link>
              }
            >
              <ul className="divide-y divide-line">
                {pool.slice(0, 4).map((o) => (
                  <li
                    key={o.slug ?? o.name}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={
                          o.slug ? `/employers/${o.slug}` : "/opportunities"
                        }
                        className="block truncate font-semibold hover:underline"
                      >
                        {o.name}
                      </Link>
                      <p
                        className="truncate text-xs text-muted"
                        title={o.closes}
                      >
                        {closesText(o)}
                      </p>
                    </div>
                    <button
                      onClick={() => trackIt(o)}
                      className="btn btn-secondary shrink-0 !px-3 !py-1.5 text-sm"
                      aria-label={`Track ${o.name}`}
                    >
                      Track
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <Section title="Practise">
            <ul className="divide-y divide-line">
              {(
                [
                  {
                    href: "/interview",
                    icon: "chat",
                    title: "Mock interview",
                    sub:
                      lastScore !== undefined
                        ? `Last score ${lastScore}/100`
                        : "Questions from a real advert, marked",
                    a: by("interviews"),
                    pro: usage?.interviews?.limit === 0,
                  },
                  {
                    href: "/practice",
                    icon: "test",
                    title: "Practice tests",
                    sub: "Reasoning and judgement, every answer explained",
                    a: by("practice"),
                  },
                  {
                    href: "/review",
                    icon: "pencil",
                    title: "CV and statements",
                    sub: "Marked feedback out of 100",
                    a: by("reviews"),
                  },
                  {
                    href: "/employers",
                    icon: "board",
                    title: "Firm mock processes",
                    sub: "Every stage of an employer's process",
                    a: undefined,
                    pro: free,
                  },
                ] as const
              ).map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-start gap-3 py-3 hover:bg-soft/60"
                  >
                    <span
                      className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"
                      aria-hidden
                    >
                      <Icon name={r.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold">
                        {r.title}
                        {"pro" in r && r.pro && <ProBadge />}
                      </span>
                      <span className="block text-xs text-muted">{r.sub}</span>
                      {r.a && r.a.limit > 0 && (
                        <span className="mt-1.5 flex items-center gap-2">
                          <Progress
                            value={left(r.a)}
                            max={r.a.limit}
                            label={`${r.title}: ${left(r.a)} of ${r.a.limit} free left`}
                            className="w-24"
                          />
                          {left(r.a) === 0 ? (
                            <span className="text-xs font-semibold text-coral-600">
                              Used up
                            </span>
                          ) : (
                            <span className="text-xs text-muted">
                              {left(r.a)} of {r.a.limit} free left
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          {!limitReached(usage) && planCard}
        </div>
      </div>
    </section>
  );
}
