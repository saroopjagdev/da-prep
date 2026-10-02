// Turns a researched firm profile into tracker-ready templates, so a student can add a programme with the firm's
// stages as a checklist and last cycle's dates as a guide. Built on the server and passed to the client pages.
import { brief } from "@/lib/firms/glance";
import type { FirmProfile } from "@/lib/firms/types";
import type { TrackerFirm, TrackerTemplate } from "@/lib/tracker-item";

export { fromTemplate, type TrackerFirm, type TrackerTemplate } from "@/lib/tracker-item";

const stageLabel = (name: string) => name.split(/[(:]/)[0].trim();

export function trackerTemplate(f: FirmProfile, programme = 0): TrackerTemplate {
  const p = f.programmes[programme] ?? f.programmes[0];
  const t = f.timeline;
  const dates = [t.opens && `Opens: ${brief(t.opens)}`, t.closes && `Closes: ${brief(t.closes)}`].filter(Boolean).join(" ");
  return {
    employer: f.name,
    role: p.name,
    firm: f.slug,
    rolling: Boolean(t.rolling),
    datesHint: dates || undefined,
    checklist: [...f.stages].sort((a, b) => a.order - b.order).map((s) => ({ label: stageLabel(s.name), done: false })),
  };
}

export const trackerFirms = (firms: FirmProfile[]): TrackerFirm[] =>
  firms.map((f) => ({ slug: f.slug, name: f.name, programmes: f.programmes.map((_, i) => trackerTemplate(f, i)) }));
