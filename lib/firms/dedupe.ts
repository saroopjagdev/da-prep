import type { FirmProfile, Sourced } from "./types";

// Profiles state some facts twice (a stage's `format` and a separate `videoInterview` block, or a stage tip and a line
// in `specificAdvice`). These helpers hide the repeat on the page without deleting any sourced text.

const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3));

/** Share of the smaller text's words that also appear in the other (0 to 1). */
export function overlap(a: string, b: string): number {
  const x = words(a);
  const y = words(b);
  const small = x.size <= y.size ? x : y;
  const big = small === x ? y : x;
  if (small.size === 0) return 0;
  let hit = 0;
  for (const w of small) if (big.has(w)) hit++;
  return hit / small.size;
}

const THRESHOLD = 0.6;

/** True if `text` mostly repeats something in `others`. */
export const repeats = (text: string, others: string[]) => others.some((o) => overlap(text, o) >= THRESHOLD);

/** The video / assessment-centre / final-interview blocks that add something the stages do not already say. */
export function extraBlocks(firm: FirmProfile): { label: string; v: Sourced }[] {
  const stageText = firm.stages.map((s) => `${s.name}. ${s.format}`);
  const all: [string, Sourced | undefined][] = [
    ["Video interview", firm.videoInterview],
    ["Assessment centre", firm.assessmentCentre],
    ["Final interview", firm.finalInterview],
  ];
  const out: { label: string; v: Sourced }[] = [];
  for (const [label, v] of all) if (v && !repeats(v.text, stageText)) out.push({ label, v });
  return out;
}

/** Advice lines that are not already a tip on one of the stages. */
export function extraAdvice(firm: FirmProfile): string[] {
  const tips = firm.stages.flatMap((s) => s.tips);
  return firm.specificAdvice.filter((a) => !repeats(a, tips));
}

/** Online-assessment tests that are not already described in the stage list. */
export function extraOaTests(firm: FirmProfile) {
  const stageText = firm.stages.map((s) => `${s.name}. ${s.format}`);
  return (firm.oa?.tests ?? []).filter((t) => !repeats(`${t.name} ${t.format}`, stageText));
}
