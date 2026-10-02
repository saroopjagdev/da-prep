// Turns a researched firm profile into the short employer briefing the AI interviewer and marker use, and the light
// list of employers and programmes the interview page offers. Only facts already in lib/firms are used.
import type { Stage } from "@/lib/interview";
import { FIRMS, getFirm } from "./index";
import type { FirmOption } from "./groups";
import type { FirmProfile, ReportedQuestion } from "./types";

export { FIRM_GROUPS, type FirmGroup, type FirmOption } from "./groups";

const FINANCE = /bank|financ|invest|insur|regulat|asset|wealth/i;

export const isFinanceFirm = (f: FirmProfile) => FINANCE.test(f.sector);

export function firmOptions(): FirmOption[] {
  return FIRMS.filter((f) => f.slug !== "civil-service-fast-track").map((f) => ({
    slug: f.slug,
    name: f.name,
    group: isFinanceFirm(f) ? "finance" : /professional services/i.test(f.sector) ? "professional" : "other",
    programmes: f.programmes.map((p) => p.name),
  }));
}

// Reported question types that suit each interview type.
const TYPES_FOR: Record<Stage, ReportedQuestion["type"][]> = {
  motivation: ["motivation"],
  competency: ["competency"],
  strengths: [],
  commercial: ["commercial"],
  technical: ["technical", "case"],
  ethics: ["situational"],
};

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** A plain-text employer briefing, or undefined if the slug is unknown. */
export function firmBriefing(slug: string | undefined, programme: number | undefined, stage: Stage): string | undefined {
  const f = slug ? getFirm(slug) : undefined;
  if (!f) return undefined;
  const p = f.programmes[programme ?? 0] ?? f.programmes[0];
  const lines = [
    `Employer: ${f.name} (${f.sector}). Researched ${f.lastVerified}; processes change every year.`,
    `Programme: ${p.name}. ${p.level}${p.degree ? `. Degree: ${p.degree}` : ""}${p.locations?.length ? `. Locations: ${p.locations.join(", ")}` : ""}.`,
    `Values or behaviours it assesses: ${f.values.join("; ")}.`,
    `Application process: ${f.stages.map((s) => `${s.order}. ${s.name}`).join("; ")}.`,
  ];
  if (f.entry.ucas || f.entry.predictedGrades) lines.push(`Entry: ${f.entry.ucas ?? f.entry.predictedGrades}.`);
  const reported = f.questions.filter((q) => TYPES_FOR[stage].includes(q.type) && q.question.length <= 230).slice(0, 5);
  if (reported.length) lines.push(`Questions candidates have reported at this employer: ${reported.map((q) => `"${q.question}"`).join(" ")}`);
  const advice = f.specificAdvice.slice(0, 5).map((a) => clip(a, 300));
  if (advice.length) lines.push(`Key facts and talking points from our research: ${advice.join(" ")}`);
  return clip(lines.join("\n"), 5000);
}
