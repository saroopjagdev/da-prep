import Link from "next/link";
import type { Game } from "@/lib/games/catalog";

/** A game to choose: what it is, how long, and whether it is scored. Plain markup, so server pages can use it. */
export default function GameCard({ game }: { game: Game }) {
  return (
    <li className="card flex flex-col gap-2 p-4">
      <h3 className="font-bold">{game.name}</h3>
      <p className="text-sm font-medium">{game.tagline}</p>
      <p className="text-sm text-muted">{game.about}</p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
        <Link href={game.href ?? `/games/${game.id}`} className="btn btn-primary">
          {game.href ? "Open the test" : "Play"}
        </Link>
        <span className="chip text-xs">{game.minutes} min</span>
        <span className="chip text-xs">{game.kind === "traits" ? "No right answers" : "Scored for accuracy"}</span>
      </div>
    </li>
  );
}
