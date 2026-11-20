// Plain question-and-answer summaries of a researched employer profile, written for people (and answer engines) who ask the
// common questions directly: does it offer a degree apprenticeship, when does it open, what grades, what process, what tests,
// what pay. Every answer is built from the profile's own sourced fields, so it can never say more than the sources do, and a
// question is left out when the profile holds nothing to answer it.
import type { FirmProfile } from "@/lib/firms/types";

export type QuickAnswer = { q: string; a: string };

const one = (s: string) => s.replace(/\s+/g, " ").trim();
const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);
const DEGREE_WORDS = /degree|level 6|level 7|graduate apprentice/i;

export function quickAnswers(firm: FirmProfile, windowLine = ""): QuickAnswer[] {
  const out: QuickAnswer[] = [];
  const name = firm.name;

  if (firm.programmes.length) {
    const list = firm.programmes.map((p) => `${one(p.name)} (${one(p.level)})`).join("; ");
    const hasDegree = firm.programmes.some((p) => DEGREE_WORDS.test(`${p.name} ${p.level} ${p.degree ?? ""}`));
    out.push({
      q: `Does ${name} offer a degree apprenticeship?`,
      a: `${hasDegree ? "Its guide lists degree-level routes." : "Its guide does not describe a degree-level route; check the level in the programmes below."} Programmes listed: ${sentence(list)}`,
    });
  }

  const when = [windowLine, firm.timeline.opens && `Opens: ${one(firm.timeline.opens)}`, firm.timeline.closes && `Closes: ${one(firm.timeline.closes)}`, firm.timeline.rolling ? "Applications are reviewed as they arrive, so it can close early." : ""]
    .filter(Boolean)
    .map((s) => sentence(String(s)))
    .join(" ");
  if (when) out.push({ q: `When does the ${name} degree apprenticeship open and close?`, a: when });

  const entry = [firm.entry.predictedGrades && `Grades: ${one(firm.entry.predictedGrades)}`, firm.entry.ucas && `UCAS points: ${one(firm.entry.ucas)}`, firm.entry.other && one(firm.entry.other)]
    .filter(Boolean)
    .map((s) => sentence(String(s)))
    .join(" ");
  if (entry) out.push({ q: `What are the entry requirements for ${name}?`, a: entry });

  const stages = [...firm.stages].sort((a, b) => a.order - b.order);
  if (stages.length) {
    out.push({
      q: `What is the ${name} application process?`,
      a: `${stages.length} ${stages.length === 1 ? "stage" : "stages"} in order: ${stages.map((s, i) => `${i + 1}) ${one(s.name)}${s.durationMins ? ` (about ${s.durationMins} minutes)` : ""}`).join("; ")}.`,
    });
  }

  if (firm.oa && firm.oa.tests.length) {
    out.push({ q: `What online tests does ${name} use?`, a: `${sentence(one(firm.oa.provider))} Tests listed: ${firm.oa.tests.map((t) => one(t.name)).join(", ")}.` });
  }

  if (firm.pay?.text) out.push({ q: `How much does the ${name} apprenticeship pay?`, a: sentence(one(firm.pay.text)) });

  return out;
}
