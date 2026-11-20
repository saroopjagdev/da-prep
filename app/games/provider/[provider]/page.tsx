import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AccountNote from "@/components/AccountNote";
import JsonLd from "@/components/JsonLd";
import GameCard from "@/components/games/GameCard";
import { GAME_DISCLAIMER, getGame } from "@/lib/games/catalog";
import { firmsForProvider } from "@/lib/games/firms";
import { GENERAL_ID, PREPARE_GENERAL, PROVIDERS, getProvider } from "@/lib/games/providers";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => PROVIDERS.map((p) => ({ provider: p.id }));

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }): Promise<Metadata> {
  const p = getProvider((await params).provider);
  if (!p) return { title: "Provider not found" };
  return pageMeta({
    title: p.seoTitle ?? `${p.name} practice: games and employers that use them`,
    description: `${p.summary} See which degree apprenticeship employers use ${p.name} and practise the matching games. Independent practice, not the real tests.`,
    path: `/games/provider/${p.id}`,
  });
}

export default async function ProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const p = getProvider((await params).provider);
  if (!p) notFound();
  const firms = firmsForProvider(p.id);
  const games = p.gameIds.map((id) => getGame(id)).filter((g) => g !== undefined);
  const others = PROVIDERS.filter((o) => o.id !== p.id && o.id !== GENERAL_ID);
  const checked = new Date(p.checked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Practice games", path: "/games" }, { name: p.name, path: `/games/provider/${p.id}` }]),
          articleLd({ headline: p.seoTitle ?? `${p.name} practice`, description: p.summary, path: `/games/provider/${p.id}`, dateModified: p.checked }),
        ]}
      />
      <p className="text-sm">
        <Link href="/games" className="underline">
          All providers and games
        </Link>
      </p>
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">{p.name} practice</h1>
        <p className="lead">{p.summary}</p>
        <p className="text-xs text-muted">Sources last read {checked}.</p>
      </div>

      <section className="space-y-2" aria-labelledby="know">
        <h2 id="know" className="text-lg font-semibold">
          What is known about it
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {p.whatWeKnow.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        {p.caution && <p className="callout bg-sun-50 text-sm">{p.caution}</p>}
        <p className="text-xs text-muted">
          Sources:{" "}
          {p.sources.map((s, i) => (
            <span key={s}>
              {i > 0 && ", "}
              <a href={s} className="underline" target="_blank" rel="noreferrer">
                {new URL(s).hostname.replace(/^www\./, "")}
              </a>
            </span>
          ))}
          . Based on {p.confidence === "official" ? "the employer's own description" : p.confidence === "inferred" ? "general descriptions of the task type" : "candidate and prep-site reports"}; check your own invitation for what you will be given.
        </p>
      </section>

      {p.faqs && p.faqs.length > 0 && (
        <section className="space-y-3" aria-labelledby="faqs">
          <h2 id="faqs" className="text-lg font-semibold">
            Questions people ask about {p.name}
          </h2>
          <dl className="space-y-3 text-sm">
            {p.faqs.map((f) => (
              <div key={f.q} className="card p-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="firms">
        <h2 id="firms" className="text-lg font-semibold">
          Employers whose guide mentions it ({firms.length})
        </h2>
        <p className="text-sm text-muted">Each line is what that employer&apos;s guide says about the stage. Check it for whether the provider is confirmed or only reported.</p>
        {firms.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {firms.map((f) => (
              <li key={f.slug} className="card p-3 text-sm">
                <Link href={`/employers/${f.slug}`} className="font-semibold underline">
                  {f.name}
                </Link>
                <p className="mt-1 text-muted">
                  {f.stage}: {f.excerpt}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">None of our employer guides name this provider at the moment.</p>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="games">
        <h2 id="games" className="text-lg font-semibold">
          Choose a game
        </h2>
        <AccountNote>Playing a game needs a free account, which also gives you the tracker, deadline emails and your first practice test.</AccountNote>
        <ul className="grid gap-4 sm:grid-cols-2">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </ul>
      </section>
      <section className="space-y-2" aria-labelledby="prep">
        <h2 id="prep" className="text-lg font-semibold">
          How to prepare for any game-based assessment
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {PREPARE_GENERAL.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="text-sm">
          Verbal or numerical reasoning tests instead?{" "}
          <Link href="/learn/numerical-verbal-reasoning-tests" className="underline">
            How to prepare for reasoning tests
          </Link>{" "}
          or{" "}
          <Link href="/tests" className="underline">
            practise a full test
          </Link>
          . Applying soon? See{" "}
          <Link href="/deadlines" className="underline">
            who is open now
          </Link>
          .
        </p>
      </section>

      <section className="space-y-2" aria-labelledby="others">
        <h2 id="others" className="text-lg font-semibold">
          Other game-based assessment providers
        </h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/games/provider/${o.id}`} className="btn btn-secondary">
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
    </div>
  );
}
