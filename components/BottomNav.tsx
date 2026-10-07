"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/interview", label: "Interview", icon: "chat" },
  { href: "/practice", label: "Tests", icon: "test" },
  { href: "/opportunities", label: "Tracker", icon: "board" },
  { href: "/progress", label: "Progress", icon: "chart" },
];

/** Thumb-reach navigation for phones. Hidden from the sm breakpoint up. */
export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <ul className="mx-auto flex max-w-md justify-around">
        {items.map((i) => {
          const on = i.href === "/" ? path === "/" : path.startsWith(i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-semibold ${
                  on ? "text-brand-600" : "text-muted"
                }`}
              >
                <Icon name={i.icon} className="h-5 w-5" />
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
