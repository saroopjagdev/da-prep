import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return { title: "Guide not found" };
  return pageMeta({ title: g.seoTitle, description: g.description, path: `/learn/${g.slug}` });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const related = g.related.map(guideBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/learn" },
            { name: g.title, path: `/learn/${g.slug}` },
          ]),
          articleLd({ headline: g.title, description: g.description, path: `/learn/${g.slug}`, dateModified: g.updated }),
        ]}
      />
      <div className="space-y-3">
        <p className="text-sm">
          <Link href="/learn" className="font-semibold text-brand-700 hover:underline">
            Resources
          </Link>
        </p>
        <h1 className="page-title">{g.title}</h1>
        <p className="lead">{g.intro}</p>
      </div>

      {g.sections.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p} className="leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
          {s.bullets && (
            <ul className="list-disc space-y-2 pl-5 leading-relaxed text-ink/90">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <aside className="card space-y-2 border-brand-600 p-6">
        <h2 className="text-lg font-bold tracking-tight">{g.cta.label}</h2>
        <p className="text-sm text-muted">{g.cta.blurb}</p>
        <Link href={g.cta.href} className="btn btn-primary mt-2">
          {g.cta.label}
        </Link>
      </aside>

      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight">Keep reading</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/learn/${r.slug}`} className="font-semibold text-brand-700 hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-muted">Last updated {new Date(g.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. This guide describes common practice; always check the employer&apos;s own advert and rules.</p>
    </article>
  );
}
