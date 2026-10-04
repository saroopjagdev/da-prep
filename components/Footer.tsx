import Link from "next/link";
import Logo from "@/components/Logo";
import { LEGAL_LINKS, NAV_GROUPS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Practice interviews, tests and tracking for UK degree apprenticeship applicants.
          </p>
          <Link href="/?pitch=1" className="text-sm text-white/85 underline underline-offset-4 hover:text-white">
            What is Level6?
          </Link>
        </div>
        {NAV_GROUPS.map((g) => (
          <nav key={g.label} aria-label={g.label}>
            <p className="eyebrow !text-white/60">{g.label}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/85 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Independent guidance, not affiliated with or endorsed by any employer named. Always check the employer&apos;s
            own process and dates.
          </p>
          <nav aria-label="Legal" className="flex gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
