import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getProvider } from "@/lib/games/providers";
import { VERDICT_NOTE, type LiteEmployer } from "@/lib/lite-employers";
import { STATUS_LABEL, formatWhen, opportunityRows } from "@/lib/opportunities";
import { SECTOR_BY_ID } from "@/lib/sectors";
import { articleLd, breadcrumbLd } from "@/lib/seo";

const dateOf = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The title that matches how people search: "<employer> degree apprenticeship 2027" plus what the page actually answers. */
export function liteTitle(e: LiteEmployer): string {
  const tail = { degree: "dates, requirements and how to apply", mixed: "levels offered, dates and how to apply", "not-degree": "what they offer instead", unclear: "what is offered, dates and how to apply" }[e.verdict];
  return `${e.name} degree apprenticeship 2027: ${tail}`;
}

export function liteDescription(e: LiteEmployer): string {
  return e.summary.slice(0, 300);
}

/** Things the page did not say, listed so a reader knows what to check rather than assuming. */
function unconfirmed(e: LiteEmployer): string[] {
  const out: string[] = [];
  if (!e.pay) out.push("pay");
  if (!e.entry) out.push("entry requirements");
  if (!e.duration) out.push("how long it lasts");
  if (!e.locations) out.push("locations");
  if (!e.qualification) out.push("the qualification you gain");
  return out;
}

export default function LiteEmployerPage({ e }: { e: LiteEmployer }) {
  const row = opportunityRows(new Date()).find((r) => r.name === (e.trackerName ?? e.name));
  const verdict = VERDICT_NOTE[e.verdict];
  const missing = unconfirmed(e);
  const sectors = e.sectors.map((id) => SECTOR_BY_ID[id]).filter(Boolean);
  const providers = (e.providers ?? []).map((id) => getProvider(id)).filter((p) => p !== undefined);
  const path = `/employers/${e.slug}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Employer guides", path: "/employers" },
            { name: e.name, path },
          ]),
          articleLd({ headline: liteTitle(e), description: liteDescription(e), path, dateModified: e.checked }),
        ]}
      />
      <p className="text-sm">
        <Link href="/employers" className="underline">
          All employer guides
        </Link>
      </p>

      <div className="space-y-3">
        <h1 className="page-title">{e.name} degree apprenticeship 2027</h1>
        <p className="lead">{e.summary}</p>
        <p className="text-xs text-muted">
          Read from the employer&apos;s own page on {dateOf(e.checked)}.{" "}
          <a href={e.source} target="_blank" rel="noreferrer" className="underline">
            Open the page we read
          </a>
          .
        </p>
      </div>

      <aside className={`callout text-sm ${e.verdict === "not-degree" || e.verdict === "unclear" ? "bg-sun-50" : "bg-brand-50"}`} aria-label="Level of the programme">
        <p className="font-semibold">{verdict.label}</p>
        <p className="mt-1">{verdict.text(e.name)}</p>
      </aside>

      <section className="card space-y-2 p-4" aria-labelledby="dates">
        <h2 id="dates" className="font-semibold">
          Dates
        </h2>
        {row ? (
          <>
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
              <dt className="font-semibold">Status</dt>
              <dd>{STATUS_LABEL[row.status]}</dd>
              <dt className="font-semibold">Opens</dt>
              <dd>{row.opens || "Not stated"}</dd>
              <dt className="font-semibold">Closes</dt>
              <dd>{row.rolling ? "Rolling, closes when full" : row.closes || "Not stated"}</dd>
            </dl>
            {row.note && <p className="text-sm text-muted">{row.note}</p>}
            <p className="text-xs text-muted">{row.checked ? `Dates last checked ${formatWhen(row.checked)}` : "Dates not yet checked"} on the employer&apos;s own page. Employers can close early, so confirm before you rely on a date.</p>
          </>
        ) : (
          <p className="text-sm text-muted">We do not have a confirmed opening or closing date for {e.name}. Check the page we read for the latest, and the closing dates below for everyone else.</p>
        )}
      </section>

      <section className="space-y-2" aria-labelledby="programmes">
        <h2 id="programmes" className="text-lg font-semibold">
          What {e.name} offers
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {e.programmes.map((p) => (
            <li key={p.name}>
              {p.name}
              {p.level ? <span className="text-muted">: {p.level}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-2 p-4" aria-labelledby="details">
        <h2 id="details" className="font-semibold">
          The details
        </h2>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
          {e.qualification && (
            <>
              <dt className="font-semibold">Qualification</dt>
              <dd>{e.qualification}</dd>
            </>
          )}
          {e.duration && (
            <>
              <dt className="font-semibold">How long</dt>
              <dd>{e.duration}</dd>
            </>
          )}
          {e.locations && (
            <>
              <dt className="font-semibold">Where</dt>
              <dd>{e.locations.join(", ")}</dd>
            </>
          )}
          {e.pay && (
            <>
              <dt className="font-semibold">Pay</dt>
              <dd>{e.pay}</dd>
            </>
          )}
          {e.entry && (
            <>
              <dt className="font-semibold">Entry requirements</dt>
              <dd>{e.entry}</dd>
            </>
          )}
          {e.howToApply && (
            <>
              <dt className="font-semibold">How to apply</dt>
              <dd>{e.howToApply}</dd>
            </>
          )}
        </dl>
        {missing.length > 0 && <p className="text-xs text-muted">Not stated on the page we read: {missing.join(", ")}. Check the employer&apos;s own page for these.</p>}
      </section>

      {e.process && e.process.length > 0 && (
        <section className="space-y-2" aria-labelledby="process">
          <h2 id="process" className="text-lg font-semibold">
            The application process, in order
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {e.process.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {providers.length > 0 && (
            <p className="text-sm">
              Its test provider is named on the page:{" "}
              {providers.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ", "}
                  <Link href={`/games/provider/${p.id}`} className="underline">
                    {p.name}
                  </Link>
                </span>
              ))}
              . Practise the matching games, then read{" "}
              <Link href="/learn/assessment-centre-tips" className="underline">
                assessment centre tips
              </Link>
              .
            </p>
          )}
        </section>
      )}

      {e.notes.length > 0 && (
        <section className="space-y-2" aria-labelledby="notes">
          <h2 id="notes" className="text-lg font-semibold">
            Good to know
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card space-y-2 p-4 print:hidden" aria-labelledby="next">
        <h2 id="next" className="font-semibold">
          Keep going
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/deadlines" className="underline">
              See who is open now and when they close
            </Link>
          </li>
          <li>
            <Link href="/learn/when-do-degree-apprenticeships-open" className="underline">
              When do degree apprenticeships open for 2027?
            </Link>
          </li>
          {sectors.map((s) => (
            <li key={s.id}>
              <Link href={`/sectors/${s.id}`} className="underline">
                More {s.name.toLowerCase()} employers
              </Link>
            </li>
          ))}
          <li>
            <Link href="/practice" className="underline">
              Practise an aptitude test
            </Link>
          </li>
        </ul>
      </section>

      <p className="text-xs text-muted">
        Independent guidance from Level6, not affiliated with {e.name}. Facts were read from the employer&apos;s page on {dateOf(e.checked)} and can change; always check the employer&apos;s own page before you apply.
      </p>
    </div>
  );
}
