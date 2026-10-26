import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import RequireAccount from "@/components/RequireAccount";
import GamePlayer from "@/components/games/GamePlayer";
import { PLAYABLE, getGame, providersForGame } from "@/lib/games/catalog";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => PLAYABLE.map((g) => ({ id: g.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const game = getGame((await params).id);
  if (!game || game.href) return { title: "Game not found" };
  return pageMeta({
    title: `${game.name}: game-based assessment practice`,
    description: `${game.tagline}. Practise this kind of task used in game-based assessments (${game.reportedWith[0]}). About ${game.minutes} minutes. Independent practice, not the real test.`,
    path: `/games/${game.id}`,
  });
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const game = getGame((await params).id);
  if (!game || game.href) notFound();

  const about = (
    <section className="mx-auto max-w-2xl space-y-3">
      <h1 className="page-title">{game.name}</h1>
      <p className="font-medium">{game.tagline}</p>
      <p className="text-sm">{game.about}</p>
      <div className="space-y-1 text-sm">
        <h2 className="font-semibold">What this kind of task is reported to look at</h2>
        <ul className="list-disc pl-5">
          {game.looksAt.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-1 text-sm">
        <h2 className="font-semibold">Where this style is reported</h2>
        <ul className="list-disc pl-5">
          {game.reportedWith.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Based on {game.confidence === "inferred" ? "general descriptions of the task type" : "candidate and prep-site reports"}, not employer announcements. Check your own invitation for what you will actually be given.
        </p>
      </div>
      <div className="space-y-1 text-sm">
        <h2 className="font-semibold">Tips</h2>
        <ul className="list-disc pl-5">
          {game.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Practice games", path: "/games" }, { name: game.name, path: `/games/${game.id}` }])} />
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href="/games" className="underline">
          All practice games
        </Link>
        {providersForGame(game.id).map((p) => (
          <Link key={p.id} href={`/games/provider/${p.id}`} className="underline">
            More from {p.name}
          </Link>
        ))}
      </p>
      <RequireAccount heading="h2" what={`play ${game.name}`} preview={about}>
        <h1 className="page-title">{game.name}</h1>
        <GamePlayer game={game} />
        <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-muted">
          {game.sources.map((s) => (
            <li key={s}>
              Task type described at{" "}
              <a href={s} className="underline" target="_blank" rel="noreferrer">
                {new URL(s).hostname.replace(/^www\./, "")}
              </a>
            </li>
          ))}
        </ul>
      </RequireAccount>
    </div>
  );
}
