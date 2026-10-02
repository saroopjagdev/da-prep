import { pageMeta } from "@/lib/site";
import Link from "next/link";
import Icon from "@/components/Icon";
import { SECTORS, SHARED } from "@/lib/sectors";

export const metadata = pageMeta({
  title: "Degree apprenticeships by sector",
  description: "What is the same and what differs between digital, engineering, finance, law, business, construction and public sector degree apprenticeships.",
  path: "/sectors",
});

const DIFFERENT = [
  "The technical or commercial questions in interviews.",
  "Which tests carry the most weight: logical, numerical, verbal or situational.",
  "Subject grades and UCAS points asked for.",
  "Professional bodies and exams studied alongside the degree.",
  "Which employers recruit, and when.",
];

export default function Sectors() {
  return (
    <div className="space-y-14">
      <div className="max-w-2xl space-y-3">
        <h1 className="page-title">
          One process, <span className="text-brand-600">many sectors</span>
        </h1>
        <p className="lead">
          Most of what you need is the same for every degree apprenticeship. What changes is the subject content, the
          tests employers favour, and how professional qualifications fit in.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card space-y-3 p-5">
          <h2 className="display font-bold text-mint-600">The same everywhere</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            {SHARED.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="text-mint-600">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </section>
        <section className="card space-y-3 p-5">
          <h2 className="display font-bold text-brand-600">Different by sector</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            {DIFFERENT.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="text-pop-500">≠</span>
                {s}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            Individual employers also differ. Test providers, stages and deadlines change every year, so always check
            the advert.
          </p>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="display text-2xl font-bold tracking-tight">Pick your sector</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <Link
              key={s.id}
              href={`/sectors/${s.id}`}
              className="card card-hover group animate-fade-up space-y-2 p-5"
            >
              <h3 className="display flex items-center justify-between font-bold">
                {s.name}
                <Icon
                  name="arrow"
                  className="h-4 w-4 -translate-x-1 text-brand-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </h3>
              <p className="text-sm text-muted">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="max-w-2xl text-xs text-muted">
        There are dozens of degree apprenticeship standards (the Institute for Apprenticeships counted 93 in 2021, across
        Levels 6 and 7), so these seven groups cover the common areas, not every standard. Check the current list on the
        Institute for Apprenticeships and Technical Education (IfATE) website.
      </p>
    </div>
  );
}
