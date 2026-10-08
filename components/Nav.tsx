"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Logo from "@/components/Logo";
import { useUsage } from "@/components/useUsage";
import { track } from "@/lib/funnel";
import { NAV_GROUPS } from "@/lib/nav";

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export default function Nav() {
  const { enabled, user } = useAuth();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu after navigating.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  const usage = useUsage();
  const account = enabled && (
    <>
      {!user && (
        <Link href="/pricing" className="px-2 text-sm font-semibold text-muted hover:text-ink">
          Plans
        </Link>
      )}
      {user && usage && usage.plan !== "pro" && (
        <Link
          href={usage.trial?.eligible ? "/pricing?trial=1" : "/pricing"}
          onClick={() => usage.trial?.eligible && track("trial_click")}
          className="btn btn-primary !px-4 !py-1.5"
        >
          {usage.trial?.eligible ? "Try Pro free" : "Go Pro"}
        </Link>
      )}
      <Link href="/login" className="btn btn-secondary !px-4 !py-1.5">
        {user ? "Account" : "Log in"}
      </Link>
      {!user && (
        <Link href="/login" className="btn btn-primary !px-4 !py-1.5">
          Sign up free
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3" aria-label="Main">
        <Link href="/" aria-label="Level6 home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <li>
            <Link
              href="/"
              aria-current={path === "/" ? "page" : undefined}
              className={`rounded px-3 py-2 text-sm font-semibold ${path === "/" ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              Home
            </Link>
          </li>
          {NAV_GROUPS.map((g) => {
            const active = g.links.some((l) => isActive(path, l.href));
            return (
              <li key={g.label} className="group relative">
                <Link
                  href={g.href}
                  className={`flex items-center gap-1 rounded px-3 py-2 text-sm font-semibold ${
                    active ? "text-brand-700" : "text-muted hover:text-ink"
                  }`}
                >
                  {g.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-40 w-80 -translate-x-1/2 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="card overflow-hidden p-1.5">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          aria-current={isActive(path, l.href) ? "page" : undefined}
                          className="block rounded-md px-3 py-2.5 hover:bg-brand-50"
                        >
                          <span className="block text-sm font-semibold text-ink">{l.label}</span>
                          {l.blurb && <span className="block text-xs text-muted">{l.blurb}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">{account}</div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="btn btn-secondary ml-auto !px-3 !py-1.5 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="max-h-[70vh] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-2 md:hidden">
          {NAV_GROUPS.map((g) => (
            <div key={g.label} className="py-3">
              <p className="eyebrow mb-1">{g.label}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isActive(path, l.href) ? "page" : undefined}
                      className={`block py-2 text-[15px] font-medium ${isActive(path, l.href) ? "text-brand-700" : "text-ink"}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {enabled && <div className="flex flex-wrap items-center gap-2 pt-2">{account}</div>}
        </div>
      )}
    </header>
  );
}
