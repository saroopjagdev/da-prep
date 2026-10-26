// Which employers use each game provider, worked out from the firm guides' own stage and online-assessment text.
import { FIRMS } from "@/lib/firms";
import type { Confidence } from "@/lib/firms/types";
import { providersForText } from "@/lib/games/providers";

export type ProviderFirm = { slug: string; name: string; stage: string; excerpt: string; confidence: Confidence };

const short = (s: string, n = 170) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, "")}...` : s);

function build(): Map<string, ProviderFirm[]> {
  const out = new Map<string, ProviderFirm[]>();
  for (const f of FIRMS) {
    const seen = new Set<string>();
    const add = (providerId: string, stage: string, excerpt: string, confidence: Confidence) => {
      if (seen.has(providerId)) return;
      seen.add(providerId);
      out.set(providerId, [...(out.get(providerId) ?? []), { slug: f.slug, name: f.name, stage, excerpt: short(excerpt), confidence }]);
    };
    for (const s of [...f.stages].sort((a, b) => a.order - b.order)) {
      for (const p of providersForText(`${s.name} ${s.provider ?? ""} ${s.format}`)) add(p.id, s.name, s.provider ?? s.format, s.confidence);
    }
    if (f.oa) {
      for (const p of providersForText(`${f.oa.provider} ${f.oa.styleNotes} ${f.oa.tests.map((t) => `${t.name} ${t.format}`).join(" ")}`)) add(p.id, "Online assessment", f.oa.provider, f.oa.confidence);
    }
  }
  for (const list of out.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

let cache: Map<string, ProviderFirm[]> | null = null;

/** Employers whose guide names this provider's games, with the line that says so. */
export function firmsForProvider(providerId: string): ProviderFirm[] {
  return (cache ??= build()).get(providerId) ?? [];
}
