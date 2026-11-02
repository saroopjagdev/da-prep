"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Logo from "@/components/Logo";
import { useUsage } from "@/components/useUsage";
import { HEADER_ITEMS } from "@/lib/nav";

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export default function Nav() {
  const { user } = useAuth();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu after navigating.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  const usage = useUsage();
  const account = (
    <>
      {user && usage && usage.plan !== "pro" && (
        <Link href="/pricing" className="btn btn-secondary !px-4 !py-2">
          Go Pro
        </Link>
      )}
      <Link href="/login" className="px-3 py-2 text-sm font-semibold text-ink hover:text-brand-700">
        {user ? "Account" : "Log in"}
      </Link>
      {!user && (
        <Link href="/login?mode=signup" className="btn btn-primary !px-5 !py-2">
          Sign up free
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3" aria-label="Main">
        <Link href="/" aria-label="Level6 home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {HEADER_ITEMS.map((item) => {
            const links = item.links;
            const active = isActive(path, item.href) || Boolean(links?.some((l) => isActive(path, l.href)));
            const cls = `flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold ${active ? "text-brand-700" : "text-ink/75 hover:text-ink"}`;
            if (!links) {
              return (
                <li key={item.label}>
                  <Link href={item.href} aria-current={isActive(path, item.href) ? "page" : undefined} className={cls}>
                    {item.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.label} className="group relative">
                <Link href={item.href} className={cls}>
                  {item.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-40 w-80 -translate-x-1/2 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="card overflow-hidden p-1.5">
                    {links.map((l) => (
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
          {HEADER_ITEMS.map((item) => (
            <div key={item.label} className="py-2">
              {item.links ? (
                <>
                  <p className="eyebrow mb-1 mt-2">{item.label}</p>
                  <ul>
                    {item.links.map((l) => (
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
                </>
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActive(path, item.href) ? "page" : undefined}
                  className={`block py-2 text-base font-bold ${isActive(path, item.href) ? "text-brand-700" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 pt-2">{account}</div>
        </div>
      )}
    </header>
  );
}
