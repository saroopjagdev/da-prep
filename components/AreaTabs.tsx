import Link from "next/link";

// Links that make closely related pages read as one area. Plain links (no state), so it works in server and client pages.
export const AREAS = {
  tests: [
    { href: "/practice", label: "General practice" },
    { href: "/tests", label: "Employer replicas" },
  ],
  feedback: [
    { href: "/review", label: "Statement and answers" },
    { href: "/cv", label: "CV" },
  ],
} as const;

export default function AreaTabs({ area, current }: { area: keyof typeof AREAS; current: string }) {
  return (
    <nav aria-label={area === "tests" ? "Practice tests" : "CV and statement review"} className="flex gap-2">
      {AREAS[area].map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.href === current ? "page" : undefined}
          className={`chip ${t.href === current ? "font-semibold ring-2 ring-brand-600" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
