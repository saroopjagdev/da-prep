import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/Icon";

type Item = { href: string; title: string; body: string };

/**
 * A product group: a coloured header bar with a headline fact, then a row of cards beneath it.
 * `tone` picks the bar colour so neighbouring groups alternate.
 */
export default function ToolkitSection({
  title,
  fact,
  tone = "teal",
  items,
  footer,
}: {
  title: string;
  fact: string;
  tone?: "teal" | "navy";
  items: Item[];
  footer?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_8px_20px_-10px_rgba(27,40,41,0.18)]">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-white ${
          tone === "navy" ? "bg-navy" : "bg-brand-600"
        }`}
      >
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm font-medium text-white">{fact}</p>
      </div>
      <ul className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-brand-50/60">
              <h3 className="text-lg font-bold tracking-tight">{it.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted">{it.body}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Explore
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {footer && <div className="border-t border-line bg-soft px-6 py-4">{footer}</div>}
    </section>
  );
}
