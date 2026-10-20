"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import { SOURCES } from "@/lib/funnel";

type Stats = {
  days: number;
  funnel: { day: string; event: string; source: string; campaign: string; n: number }[];
  signups: Record<string, number>;
  totals: { accounts: number; pro: number; everPaid: number };
  paying: { email: string | null; plan: string; joined: string }[];
};

const RANGES = [7, 14, 30, 90];
const STEPS = ["landing_view", "hero_signup_submit", "gate_view", "link_sent", "signed_in", "first_practice", "first_mock", "pricing_view", "limit_hit", "checkout_start", "apply_click", "share_click"];
const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : "–");
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const sumOf = (rows: Stats["funnel"], event: string) => rows.filter((r) => r.event === event).reduce((s, r) => s + r.n, 0);
const visitsOf = (rows: Stats["funnel"]) => rows.filter((r) => r.event.startsWith("visit_")).reduce((s, r) => s + r.n, 0);

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Table({ head, rows, caption }: { head: string[]; rows: (string | number)[][]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy/5 text-xs uppercase tracking-wide text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className={`whitespace-nowrap px-3 py-2 ${j ? "tabular-nums" : "font-semibold"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={head.length} className="px-3 py-3 text-muted">
                Nothing in this range yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** A link for a TikTok video or bio, with the campaign label this page then groups by. */
function LinkBuilder() {
  const [source, setSource] = useState("tiktok");
  const [campaign, setCampaign] = useState("bio");
  const [path, setPath] = useState("/");
  const label = campaign.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const url = `${origin}${path.startsWith("/") ? path : `/${path}`}?utm_source=${source}${label ? `&utm_campaign=${label}` : ""}`;
  return (
    <section className="card space-y-3 p-4" aria-label="Tracked link builder">
      <h2 className="font-bold">Make a tracked link</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted">Source</span>
          <select className="input w-full" value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCES.filter((s) => s !== "direct" && s !== "other").map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Campaign (video or placement)</span>
          <input className="input w-full" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Page</span>
          <input className="input w-full" value={path} onChange={(e) => setPath(e.target.value)} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <code className="break-all rounded bg-navy/5 px-2 py-1 text-xs">{url}</code>
        <button type="button" className="btn btn-secondary" onClick={() => void navigator.clipboard?.writeText(url)}>
          Copy
        </button>
      </div>
    </section>
  );
}

function Dashboard() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    postJson<Stats>(`/api/admin/stats?days=${days}`, undefined, "GET")
      .then((s) => live && (setStats(s), setError("")))
      .catch((e: Error) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [days]);

  const view = useMemo(() => {
    if (!stats) return null;
    const f = stats.funnel;
    const group = (key: "source" | "campaign") => {
      const keys = [...new Set(f.map((r) => r[key] || (key === "source" ? "(before tracking)" : "(none)")))];
      return keys
        .map((k) => {
          const rows = f.filter((r) => (r[key] || (key === "source" ? "(before tracking)" : "(none)")) === k);
          return { k, rows, visits: visitsOf(rows) };
        })
        .filter((g) => g.visits || sumOf(g.rows, "signed_in"))
        .sort((a, b) => b.visits - a.visits);
    };
    const byDay = new Map<string, Record<string, number>>();
    for (const r of f) {
      const d = byDay.get(r.day) ?? {};
      d[r.event] = (d[r.event] ?? 0) + r.n;
      byDay.set(r.day, d);
    }
    for (const d of Object.keys(stats.signups)) if (!byDay.has(d)) byDay.set(d, {});
    return { group, sources: group("source"), campaigns: group("campaign").filter((c) => c.k !== "(none)"), days: [...byDay.entries()].sort((a, b) => b[0].localeCompare(a[0])) };
  }, [stats]);

  if (error) return <p role="alert" className="text-red-700">{error}</p>;
  if (!stats || !view) return <p className="text-muted" aria-busy="true">Loading…</p>;

  const f = stats.funnel;
  const visits = visitsOf(f);
  const newAccounts = Object.values(stats.signups).reduce((a, b) => a + b, 0);
  const conv = (rows: Stats["funnel"]) => [visitsOf(rows), sumOf(rows, "visit_home"), sumOf(rows, "hero_signup_submit"), sumOf(rows, "signed_in"), sumOf(rows, "pricing_view"), sumOf(rows, "checkout_start")];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Date range">
        {RANGES.map((d) => (
          <button key={d} type="button" className={`btn ${d === days ? "btn-primary" : "btn-secondary"}`} aria-pressed={d === days} onClick={() => setDays(d)}>
            {d} days
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Headline numbers">
        <Tile label="Accounts" value={stats.totals.accounts} hint={`${newAccounts} new in ${days} days`} />
        <Tile label="Paying now" value={stats.totals.pro} hint="plan is Pro" />
        <Tile label="Ever paid" value={stats.totals.everPaid} hint="has a Stripe customer id" />
        <Tile label="Visits" value={visits} hint={`${pct(sumOf(f, "signed_in"), visits)} signed in`} />
      </section>

      <LinkBuilder />

      <section className="space-y-2">
        <h2 className="font-bold">Paying users</h2>
        <Table
          caption="Users with a Stripe customer id"
          head={["Email", "Plan", "Joined"]}
          rows={stats.paying.map((p) => [p.email ?? "(unknown)", p.plan === "pro" ? "Pro" : "Free (cancelled or lapsed)", date(p.joined)])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Where visits came from</h2>
        <Table
          caption="Visits and conversions by source"
          head={["Source", "Visits", "Home visits", "Signup submits", "Signed in", "Pricing views", "Checkouts started"]}
          rows={view.sources.map((g) => [g.k, ...conv(g.rows)])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Campaigns (utm_campaign)</h2>
        <Table
          caption="Visits and conversions by campaign"
          head={["Campaign", "Visits", "Home visits", "Signup submits", "Signed in", "Pricing views", "Checkouts started"]}
          rows={view.campaigns.map((g) => [g.k, ...conv(g.rows)])}
        />
        <p className="text-xs text-muted">Campaigns appear once links carry a utm_campaign and the campaign migration has been applied.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Day by day</h2>
        <Table
          caption="Funnel steps per day"
          head={["Day", "New accounts", ...STEPS]}
          rows={view.days.map(([d, e]) => [d, stats.signups[d] ?? 0, ...STEPS.map((s) => e[s] ?? 0)])}
        />
      </section>

      <p className="text-xs text-muted">
        Funnel counts are anonymous daily totals (see the <Link href="/privacy" className="underline">privacy notice</Link>). Only the accounts listed in the admin list can see this page.
      </p>
    </div>
  );
}

export default function AdminPage() {
  const { enabled, ready, user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="page-title">Analytics</h1>
      {!enabled || !ready ? (
        <p className="text-muted" aria-busy="true">Loading…</p>
      ) : !user ? (
        <p>
          <Link href="/login" className="underline">Sign in</Link> with an admin account to see this page.
        </p>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
