"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUsage } from "@/components/useUsage";
import { track } from "@/lib/funnel";
import { PRO_PLAN, TRIAL_DAYS } from "@/lib/plans";

/** "1 day 4 hours", "5 hours", "20 minutes": how long until an ISO time, for the trial countdown. */
export function timeLeft(endsAt: string, now = Date.now()): string {
  const ms = Math.max(0, Date.parse(endsAt) - now);
  const mins = Math.floor(ms / 60_000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ${hours} hour${hours === 1 ? "" : "s"}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${Math.max(1, mins)} minute${mins === 1 ? "" : "s"}`;
}

export const chargeDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/** True when this signed-in free account can still start the free trial. */
export function useTrialEligible(): boolean {
  return Boolean(useUsage()?.trial?.eligible);
}

/**
 * The button every upgrade prompt uses. Someone who can still have the free trial is offered that first; everyone
 * else gets the plain "See Pro" link. `where` names the place, for the anonymous funnel count.
 */
export function TrialCta({ where, fallback = "See Pro", className = "btn btn-primary" }: { where: string; fallback?: string; className?: string }) {
  const eligible = useTrialEligible();
  return (
    <Link href={eligible ? "/pricing?trial=1" : "/pricing"} className={className} onClick={() => eligible && track("trial_click")} data-where={where}>
      {eligible ? `Start your free ${TRIAL_DAYS}-day Pro trial` : fallback}
    </Link>
  );
}

/** One line of fine print that must sit beside any trial button: the card is needed and the price follows. */
export const TRIAL_FINE_PRINT = `Card needed. ${TRIAL_DAYS} days free, then ${PRO_PLAN.price} unless you cancel first.`;

/** The fine print beside a trial button, shown only to accounts the trial is actually on offer to. */
export function TrialFinePrint({ className = "text-xs text-muted" }: { className?: string }) {
  return useTrialEligible() ? <p className={className}>{TRIAL_FINE_PRINT}</p> : null;
}

/** A large promotional card. Shown only to accounts that can still have the trial. */
export function TrialPromo({ className = "" }: { className?: string }) {
  const eligible = useTrialEligible();
  useEffect(() => {
    if (eligible) track("trial_view", { oncePerLoad: true });
  }, [eligible]);
  if (!eligible) return null;
  return (
    <section className={`card space-y-3 border-brand-600 bg-brand-50 p-5 ${className}`} aria-label="Free trial of Pro">
      <h2 className="text-xl font-bold tracking-tight">Try Pro free for {TRIAL_DAYS} days</h2>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        <li>Unlimited practice tests</li>
        <li>Unlimited AI mock interviews, marked out of 100</li>
        <li>Every firm mock process, stage by stage</li>
        <li>Higher CV and statement review limits</li>
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <TrialCta where="promo" className="btn btn-primary" />
        <span className="text-xs text-muted">{TRIAL_FINE_PRINT}</span>
      </div>
    </section>
  );
}

/**
 * Site-wide strip while a trial is running: how long is left and when the card will be charged. It is also the
 * reminder that the trial turns into a paid subscription, so it stays visible for the whole trial.
 */
export function TrialBanner() {
  const usage = useUsage();
  const endsAt = usage?.plan === "pro" ? usage.trial?.endsAt : undefined;
  const [now, setNow] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock only exists in the browser
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!endsAt || !now || Date.parse(endsAt) <= now) return null;
  const soon = Date.parse(endsAt) - now < 24 * 3_600_000;
  return (
    <div role="status" className={`border-b border-line px-4 py-2 text-center text-sm ${soon ? "bg-sun-50" : "bg-brand-50"}`}>
      <strong>Pro trial: {timeLeft(endsAt, now)} left.</strong>{" "}
      <span className="text-muted">
        Your card is charged {PRO_PLAN.price.replace(" a month", "")} on {chargeDate(endsAt)} unless you cancel first.
      </span>{" "}
      <Link href="/pricing" className="font-semibold underline">
        Manage or cancel
      </Link>
    </div>
  );
}
