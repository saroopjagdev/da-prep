// Plain-English summary of a firm profile for the top of its employer page, and the practice that matches its process.
// Everything is derived from the profile; nothing new is claimed here.
import { getTest } from "@/lib/assess/tests";
import { getMock } from "@/lib/mockprocess/definitions";
import { VIDEO_PRESETS } from "@/lib/hirevue";
import type { FirmProfile } from "./types";

export type GlanceRow = { label: string; value: string };

const YEARS = /(\d+(?:\.\d+)?)(?:\s*(?:to|-)\s*(\d+(?:\.\d+)?))?\s*years?/i;
const MONTHS = /(\d+)\s*months?/i;

/** "4 years", "18 to 36 months" etc. from the programme's level text, if stated. */
export function programmeLength(f: FirmProfile): string | undefined {
  for (const p of f.programmes) {
    const text = `${p.level} ${p.name}`;
    const y = text.match(YEARS);
    if (y) return y[2] ? `${y[1]} to ${y[2]} years` : `${y[1]} years`;
    const m = text.match(MONTHS);
    if (m) {
      const range = text.match(/(\d+)\s*(?:to|-)\s*(\d+)\s*months?/i);
      return range ? `${range[1]} to ${range[2]} months` : `${m[1]} months`;
    }
  }
  return undefined;
}

/** First sentence only, without research notes in brackets: the full text stays further down the page. */
export const brief = (s: string) =>
  s
    .replace(/\s*\([^)]*(?:search|read|confirm|check|summary|prep site|official page|single)[^)]*\)/gi, "")
    .split(/(?<=\.)\s+(?=[A-Z0-9])/)[0]
    .trim();

export function glance(f: FirmProfile): GlanceRow[] {
  const dates = [f.timeline.opens && `Opens: ${brief(f.timeline.opens)}`, f.timeline.closes && `Closes: ${brief(f.timeline.closes)}`, f.timeline.rolling && !/rolling/i.test(f.timeline.closes ?? "") && "Rolling: apply early."]
    .filter(Boolean)
    .join(" ");
  const degrees = [...new Set(f.programmes.map((p) => p.degree && brief(p.degree).replace(/\.$/, "")).filter((d): d is string => Boolean(d)))];
  return [
    { label: "Dates", value: dates || "Not confirmed yet. Check the employer's page." },
    { label: "Pay", value: f.pay ? brief(f.pay.text) : "Not published in the sources we found." },
    { label: "Length", value: programmeLength(f) ?? "Not stated." },
    { label: "Degree", value: degrees.length ? degrees.join("; ") : "Not stated, or no degree awarded (check the programme)." },
    { label: "Entry", value: brief(f.entry.predictedGrades ?? f.entry.ucas ?? f.entry.other ?? "Not confirmed.") },
    { label: "Stages", value: `${f.stages.length}: ${f.stages.map((s) => s.name.split(/[(:/]/)[0].trim()).join(", ")}` },
  ];
}

export type PracticeLink = { href: string; label: string };

// Which of our replica tests suit the tests a firm is reported to use.
const TEST_RULES: [RegExp, string[]][] = [
  [/work scenarios/i, ["work-scenarios"]],
  [/switchChallenge/i, ["switch-challenge"]],
  [/\bSHL\b/i, ["shl-numerical", "shl-inductive"]],
  [/\bAon\b|cut-e|scales/i, ["scales-numerical", "scales-verbal"]],
  [/cappfinity|immersive|simulat/i, ["capp-numerical", "capp-verbal", "sjt-ranking"]],
  [/situational|\bSJT\b|scenario/i, ["sjt-most-least"]],
  [/numerical|numeracy/i, ["shl-numerical"]],
  [/verbal/i, ["scales-verbal"]],
  [/logical|inductive|deductive|reasoning/i, ["shl-inductive"]],
  [/personality|behaviou?ral (?:questionnaire|assessment)|ways of working|culture match|work-style/i, ["work-style-rating"]],
];

export function practiceLinks(f: FirmProfile): PracticeLink[] {
  const text = [f.oa?.provider, f.oa?.styleNotes, ...(f.oa?.tests.map((t) => `${t.name} ${t.format}`) ?? []), ...f.stages.map((s) => `${s.name} ${s.provider ?? ""} ${s.format}`)].join(" ");
  const ids: string[] = [];
  // Firms reported to use an immersive job simulation get the matching day-in-the-job replica first.
  if (f.slug === "hsbc") ids.push("hsbc-simulate");
  if (/job simulation|simulate|immersive/i.test(text)) ids.push(/professional services/i.test(f.sector) ? "job-sim-audit" : "job-sim-banking");
  for (const [re, tests] of TEST_RULES) if (re.test(text)) for (const t of tests) if (!ids.includes(t)) ids.push(t);
  const links: PracticeLink[] = [];
  if (getMock(f.slug)) links.push({ href: `/mock/${f.slug}`, label: `Run the ${f.name} mock process` });
  links.push({ href: `/interview?firm=${f.slug}`, label: `Practise a ${f.name} interview` });
  if (VIDEO_PRESETS.some((p) => p.id === f.slug)) links.push({ href: `/interview?firm=${f.slug}&mode=video`, label: `Practise ${f.name}'s video interview timings` });
  for (const id of ids.slice(0, 4)) {
    const t = getTest(id);
    if (t) links.push({ href: `/tests/${id}`, label: `Practise: ${t.name}` });
  }
  return links;
}
