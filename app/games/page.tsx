import Link from "next/link";
import AccountNote from "@/components/AccountNote";
import AreaTabs from "@/components/AreaTabs";
import JsonLd from "@/components/JsonLd";
import { GAME_DISCLAIMER, GAMES } from "@/lib/games/catalog";
import { breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Game-based assessment practice: Arctic Shores, Pymetrics and HireVue style games",
  description:
    "Practise the kinds of games employers use in degree apprenticeship applications: balloon risk, card decks, tower planning, digit span, shape matching, reaction and more. Free with an account. Independent practice, not the real tests.",
  path: "/games",
});

export default function Games() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Practice games", path: "/games" }])} />
      <AreaTabs area="tests" current="/games" />
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Practice games</h1>
        <p className="lead">
          Many employers now start with short games instead of (or as well as) reasoning tests. These practise the same kinds of task, so the format feels familiar on the day. Most have no right answers: employers look at how you play.
        </p>
      </div>
      <AccountNote>Playing a game needs a free account, which also gives you the tracker, deadline emails and your first practice test.</AccountNote>
      <ul className="grid gap-4 sm:grid-cols-2">
        {GAMES.map((g) => (
          <li key={g.id} className="card flex flex-col gap-2 p-5">
            <h2 className="font-bold">{g.name}</h2>
            <p className="text-sm font-medium">{g.tagline}</p>
            <p className="text-sm text-muted">{g.about}</p>
            <p className="text-xs text-muted">Reported with: {g.reportedWith.join("; ")}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <Link href={g.href ?? `/games/${g.id}`} className="btn btn-primary">
                {g.href ? "Open the test" : "Play"}
              </Link>
              <span className="chip text-xs">{g.minutes} min</span>
              <span className="chip text-xs">{g.kind === "traits" ? "No right answers" : "Scored for accuracy"}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">{GAME_DISCLAIMER}</p>
    </div>
  );
}
