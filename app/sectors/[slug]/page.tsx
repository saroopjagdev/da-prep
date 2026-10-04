import Link from "next/link";
import { notFound } from "next/navigation";
import FinanceSection from "@/components/FinanceSection";
import SectorPicker from "@/components/SectorPicker";
import { EMPLOYERS } from "@/lib/employers";
import { CATEGORY_INFO } from "@/lib/questions";
import { SECTOR_BY_ID, SECTOR_IDS, type SectorId } from "@/lib/sectors";
import { pageMeta } from "@/lib/site";

export function generateStaticParams() {
  return SECTOR_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SECTOR_BY_ID[slug as SectorId];
  if (!s) return { title: "Sector" };
  return pageMeta({
    title: `${s.name} degree apprenticeships`,
    description: `${s.blurb} How ${s.name.toLowerCase()} degree apprenticeship applications work, what employers test and how to prepare.`,
    path: `/sectors/${s.id}`,
  });
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = SECTOR_BY_ID[slug as SectorId];
  if (!sector) notFound();
  const employers = EMPLOYERS.filter((e) => e.sectors.includes(sector.id));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <Link href="/sectors" className="text-sm font-semibold text-brand-600">
          ← All sectors
        </Link>
        <h1 className="page-title">{sector.name}</h1>
        <p className="lead">{sector.blurb}</p>
        <SectorPicker id={sector.id} />
      </div>

      <section className="card space-y-2 p-5">
        <h2 className="font-bold">Example degree apprenticeships</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {sector.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="text-xs text-muted">Names and levels change. Check the current standard on IfATE and the advert.</p>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="font-bold">What&apos;s different in this sector</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {sector.differs.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Show these in your examples</h2>
        <div className="flex flex-wrap gap-2">
          {sector.showcase.map((s) => (
            <span key={s} className="rounded-md bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Tests to practise first</h2>
        <div className="flex flex-wrap gap-2">
          {sector.tests.map((t) => (
            <Link key={t} href="/practice" className="chip">
              {CATEGORY_INFO[t].label}
            </Link>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Employers in our list</h2>
        {employers.length ? (
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {employers.map((e) => (
              <li key={e.name}>{e.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            We haven&apos;t listed employers for this sector yet. Search on Find an Apprenticeship.
          </p>
        )}
        <Link href="/opportunities" className="text-sm font-semibold text-brand-600">
          See all opportunities →
        </Link>
      </section>

      <Link href="/interview" className="btn btn-primary !px-6 !py-3">
        Practise a {sector.name.toLowerCase()} interview
      </Link>

      {sector.id === "finance" && <FinanceSection />}
    </div>
  );
}
