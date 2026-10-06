import Link from "next/link";

export type MarqueeFirm = { slug: string; name: string; /** Path under /logos when a logo file exists. */ logo?: string };

function Tile({ f, hidden }: { f: MarqueeFirm; hidden?: boolean }) {
  return (
    <Link
      href={`/employers/${f.slug}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className="mr-8 flex h-12 shrink-0 items-center justify-center text-center opacity-80 transition hover:opacity-100"
    >
      {f.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- small static brand marks served from /public
        <img src={f.logo} alt={hidden ? "" : f.name} className="h-9 w-auto max-w-36 shrink-0 object-contain" height={36} />
      ) : (
        <span className="text-sm font-bold tracking-tight text-ink">{f.name}</span>
      )}
    </Link>
  );
}

/** A slowly sliding row of employers we cover. Pauses on hover or focus; still and scrollable for people who prefer reduced motion. */
export default function FirmMarquee({ firms }: { firms: MarqueeFirm[] }) {
  return (
    <section aria-label="Employers we cover" className="mx-auto max-w-6xl px-4 pb-10">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted">Employers we cover</p>
      <div className="marquee">
        <div className="marquee-track">
          {firms.map((f) => (
            <Tile key={f.slug} f={f} />
          ))}
          {firms.map((f) => (
            <Tile key={`${f.slug}-copy`} f={f} hidden />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-sm">
        <Link href="/opportunities?guides=1" className="font-semibold underline underline-offset-2">
          See all {firms.length} employer guides
        </Link>
      </p>
    </section>
  );
}
