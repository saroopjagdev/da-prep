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
// Day-by-day columns: [funnel event, short heading]. Short headings that can wrap keep the table inside the page.
const STEPS: [string, string][] = [
  ["landing_view", "Landing views"],
  ["hero_signup_submit", "Signup submits"],
  ["gate_view", "Gate views"],
  ["link_sent", "Emails sent"],
  ["signed_in", "Signed in"],
  ["first_practice", "First practice"],
  ["first_mock", "First mock"],
  ["pricing_view", "Pricing views"],
  ["limit_hit", "Limit hits"],
  ["checkout_start", "Checkouts"],
  ["apply_click", "Apply clicks"],
  ["share_click", "Shares"],
];
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
              <th key={h} scope="col" className="px-2 py-2 align-bottom">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className={`px-2 py-2 ${j ? "tabular-nums" : "break-words font-semibold"}`}>
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

/** A link that carries its source, so the visits table can count it. */
function LinkBuilder() {
  const [source, setSource] = useState("tiktok");
  const [path, setPath] = useState("/");
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const url = `${origin}${path.startsWith("/") ? path : `/${path}`}?utm_source=${source}`;
  return (
    <section className="card space-y-3 p-4" aria-label="Tracked link builder">
      <h2 className="font-bold">Link to use in your TikTok bio</h2>
      <p className="text-sm text-muted">TikTok usually hides where a click came from, so a plain link would be counted as &ldquo;direct&rdquo;. This link ends in <code>?utm_source=tiktok</code>, which is what puts those visits in the TikTok row below.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted">Source</span>
          <select className="input w-full" value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCES.filter((s) => s !== "direct" && s !== "other").map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
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
      // Anyone who is not an admin gets a 404 from the endpoint; show them nothing more than that.
      .catch((e: Error) => live && (console.error("admin stats:", e.message), setError("This page is not available.")));
    return () => {
      live = false;
    };
  }, [days]);

  const view = useMemo(() => {
    if (!stats) return null;
    const f = stats.funnel;
    const label = (r: Stats["funnel"][number]) => r.source || "(before tracking)";
    const sources = [...new Set(f.map(label))]
      .map((k) => {
        const rows = f.filter((r) => label(r) === k);
        return { k, rows, visits: visitsOf(rows) };
      })
      .filter((g) => g.visits || sumOf(g.rows, "signed_in"))
      .sort((a, b) => b.visits - a.visits);
    const byDay = new Map<string, Record<string, number>>();
    for (const r of f) {
      const d = byDay.get(r.day) ?? {};
      d[r.event] = (d[r.event] ?? 0) + r.n;
      byDay.set(r.day, d);
    }
    for (const d of Object.keys(stats.signups)) if (!byDay.has(d)) byDay.set(d, {});
    return { sources, days: [...byDay.entries()].sort((a, b) => b[0].localeCompare(a[0])) };
  }, [stats]);

  if (error) return <p role="alert" className="text-muted">{error}</p>;
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
        <h2 className="font-bold">Day by day</h2>
        <Table
          caption="Funnel steps per day"
          head={["Day", "New accounts", ...STEPS.map(([, label]) => label)]}
          rows={view.days.map(([d, e]) => [d.slice(5), stats.signups[d] ?? 0, ...STEPS.map(([s]) => e[s] ?? 0)])}
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
