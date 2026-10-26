import Link from "next/link";
import AccountNote from "@/components/AccountNote";
import AreaTabs from "@/components/AreaTabs";
import JsonLd from "@/components/JsonLd";
import GameCard from "@/components/games/GameCard";
import { GAME_DISCLAIMER, GAMES, getGame } from "@/lib/games/catalog";
import { firmsForProvider } from "@/lib/games/firms";
import { PROVIDERS } from "@/lib/games/providers";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Game-based assessment practice: Arctic Shores, Pymetrics and HireVue style games",
  description:
    "Find out which degree apprenticeship employers use game-based assessments, which provider they use, and practise the matching games. Free with an account. Independent practice, not the real tests.",
  path: "/games",
});

const SHOWN_FIRMS = 8;

export default function Games() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Practice games", path: "/games" }])} />
      <AreaTabs area="tests" current="/games" />
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Practice games</h1>
        <p className="lead">
          Many employers now start with short games instead of (or as well as) reasoning tests. Pick the test provider your employer uses, see who else uses it, and practise the same kinds of task. Most have no right answers: employers look at how you play.
        </p>
      </div>
      <AccountNote>Playing a game needs a free account, which also gives you the tracker, deadline emails and your first practice test.</AccountNote>

      <section className="space-y-3" aria-labelledby="providers">
        <h2 id="providers" className="text-lg font-semibold">
          Start with the test provider
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PROVIDERS.map((p) => {
            const firms = firmsForProvider(p.id);
            return (
              <li key={p.id} className="card flex flex-col gap-2 p-5">
                <h3 className="text-base font-bold">{p.name}</h3>
                <p className="text-sm text-muted">{p.summary}</p>
                <p className="text-sm">
                  <span className="font-medium">Employers:</span>{" "}
                  {firms.length ? (
                    <>
                      {firms.slice(0, SHOWN_FIRMS).map((f, i) => (
                        <span key={f.slug}>
                          {i > 0 && ", "}
                          <Link href={`/employers/${f.slug}`} className="underline">
                            {f.name}
                          </Link>
                        </span>
                      ))}
                      {firms.length > SHOWN_FIRMS && ` and ${firms.length - SHOWN_FIRMS} more`}
                    </>
                  ) : (
                    <span className="text-muted">none of our guides name it yet</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Games:</span> {p.gameIds.map((id) => getGame(id)?.name).filter(Boolean).join(", ")}
                </p>
                <div className="mt-auto pt-2">
                  <Link href={`/games/provider/${p.id}`} className="btn btn-primary">
                    Open {p.name}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="all">
        <h2 id="all" className="text-lg font-semibold">
          Or pick any game
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {GAMES.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
    </div>
  );
}
