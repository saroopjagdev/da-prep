import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FIRMS, getFirm } from "@/lib/firms";
import { extraAdvice, extraBlocks, extraOaTests } from "@/lib/firms/dedupe";
import { glance, practiceLinks } from "@/lib/firms/glance";
import JsonLd from "@/components/JsonLd";
import { logoPath } from "@/lib/logos";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => FIRMS.map((f) => ({ slug: f.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const firm = getFirm((await params).slug);
  if (!firm) return { title: "Employer not found" };
  const stages = firm.stages.map((s) => s.name.split(/[(:]/)[0].trim().toLowerCase()).join(", ");
  return pageMeta({
    title: `${firm.name} degree apprenticeship: process, tests and interview`,
    description: `How the ${firm.name} degree apprenticeship application works: ${stages}. Dates, entry requirements, reported questions and tips.`.slice(0, 300),
    path: `/employers/${firm.slug}`,
  });
}

export default async function FirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) notFound();

  const logo = logoPath(firm.slug);
  const sourced = extraBlocks(firm);
  const oaTests = extraOaTests(firm);
  const advice = extraAdvice(firm);

  return (
    <div className="space-y-6">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Employer guides", path: "/employers" },
            { name: firm.name, path: `/employers/${firm.slug}` },
          ]),
          articleLd({
            headline: `${firm.name} degree apprenticeship: process, tests and interview`,
            description: `How the ${firm.name} degree apprenticeship application works, with dates, entry requirements and tips.`,
            path: `/employers/${firm.slug}`,
            dateModified: firm.lastVerified,
          }),
        ]}
      />
      <div>
        <Link className="text-sm underline" href="/employers">
          All employer guides
        </Link>
        <div className="mt-2 flex items-center gap-4">
          {logo && (
            <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={`${firm.name} logo`} className="max-h-full max-w-full object-contain" height={48} />
            </span>
          )}
          <h1 className="page-title !mt-0">{firm.name}</h1>
        </div>
        <p className="text-muted">
          {firm.sector}. Processes change every year, so confirm on the employer&apos;s
          own page.
        </p>
      </div>

      <section className="card p-4 space-y-3" aria-labelledby="glance">
        <h2 id="glance" className="font-semibold">
          At a glance
        </h2>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
          {glance(firm).map((r) => (
            <div key={r.label} className="contents">
              <dt className="font-semibold">{r.label}</dt>
              <dd className="mb-1 sm:mb-0">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2 pt-1">
          {practiceLinks(firm).map((l, i) => (
            <Link key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {firm.dayToDay && firm.dayToDay.length > 0 && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">What you&apos;d actually do</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {firm.dayToDay.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="text-xs text-muted">Our plain-English summary from the firm&apos;s adverts, not the firm&apos;s own words.</p>
        </section>
      )}

      {firm.whyThisFirm && firm.whyThisFirm.length > 0 && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">Why this firm: talking points</h2>
          <p className="text-sm text-muted">Recent facts you can use in a &quot;why us?&quot; answer. Check for newer news before your interview.</p>
          <ul className="space-y-2 text-sm">
            {firm.whyThisFirm.map((w) => (
              <li key={w.text}>
                {w.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-4 space-y-2">
        <h2 className="font-semibold">Programmes and entry</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {firm.programmes.map((p) => (
            <li key={p.name}>
              {p.name} ({p.level}){p.degree && ` · ${p.degree}`}
              {p.locations && ` · ${p.locations.join(", ")}`}
            </li>
          ))}
        </ul>
        <p className="text-sm">
          {[firm.entry.ucas, firm.entry.predictedGrades, firm.entry.other].filter(Boolean).join(" · ") ||
            "Entry requirements not confirmed."}
        </p>
        <p className="text-sm">
          {[
            firm.timeline.opens && `Opens ${firm.timeline.opens}`,
            firm.timeline.closes && `closes ${firm.timeline.closes}`,
            firm.timeline.rolling && "rolling (apply early)",
            firm.timeline.notes,
          ]
            .filter(Boolean)
            .join(" · ") || "Dates not confirmed."}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Process, stage by stage</h2>
        {[...firm.stages]
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <div key={s.order} className="card p-3 space-y-1">
              <p className="font-semibold">
                {s.order}. {s.name} {s.provider && <span className="text-muted font-normal">({s.provider})</span>}
              </p>
              <p className="text-sm">
                {s.format}
                {s.durationMins ? ` · about ${s.durationMins} min` : ""}
              </p>
              {s.passMarkNotes && <p className="text-sm text-muted">{s.passMarkNotes}</p>}
              {s.tips.length > 0 && (
                <ul className="list-disc pl-5 text-sm">
                  {s.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </section>

      {firm.oa && (oaTests.length > 0 || firm.oa.styleNotes) && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">Online assessment: {firm.oa.provider}</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {oaTests.map((t) => (
              <li key={t.name}>
                {t.name}: {t.format}
                {t.items ? ` · ${t.items} items` : ""}
                {t.timeMins ? ` · ${t.timeMins} min` : ""}
                {t.notes ? ` · ${t.notes}` : ""}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">{firm.oa.styleNotes}</p>
        </section>
      )}

      {sourced.map(({ label, v }) => (
        <section key={label} className="card p-4 space-y-1">
          <h2 className="font-semibold">{label}</h2>
          <p className="text-sm">{v.text}</p>
        </section>
      ))}

      {firm.values.length > 0 && (
        <section className="card p-4 space-y-1">
          <h2 className="font-semibold">Values they assess against</h2>
          <p className="text-sm">{firm.values.join(" · ")}</p>
        </section>
      )}

      {firm.questions.length > 0 && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">Questions candidates report</h2>
          <ul className="space-y-2 text-sm">
            {firm.questions.map((q) => (
              <li key={q.question}>
                <span className="text-muted">{q.stage}:</span> {q.question}
              </li>
            ))}
          </ul>
        </section>
      )}

      {advice.length > 0 && (
        <section className="card p-4 space-y-1">
          <h2 className="font-semibold">Advice for this firm</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {advice.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
