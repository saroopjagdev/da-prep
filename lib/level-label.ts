// A plain-English label for the level of an employer's programme, from the data we hold, for lists and tables.
// It never promises more than we know: where no page of ours states a level, it says "Level not confirmed".
import { FIRMS } from "@/lib/firms";
import { VERDICT_NOTE, liteBySlug } from "@/lib/lite-employers";

export type LevelInfo = { label: string; tone: "degree" | "other" | "unknown" };

const DEGREE_WORDS = /degree|level 6|level 7|graduate apprentice/i;

export function levelInfo(row: { slug?: string; pageSlug?: string; programmes: string[] }): LevelInfo {
  const lite = row.pageSlug && !row.slug ? liteBySlug(row.pageSlug) : undefined;
  if (lite) {
    return { label: VERDICT_NOTE[lite.verdict].label, tone: lite.verdict === "degree" || lite.verdict === "mixed" ? "degree" : lite.verdict === "not-degree" ? "other" : "unknown" };
  }
  const firm = row.slug ? FIRMS.find((f) => f.slug === row.slug) : undefined;
  if (firm) {
    const text = firm.programmes.map((p) => `${p.name} ${p.level} ${p.degree ?? ""}`).join(" ");
    return DEGREE_WORDS.test(text) ? { label: "Degree level (see guide)", tone: "degree" } : { label: "See guide for the level", tone: "unknown" };
  }
  return DEGREE_WORDS.test(row.programmes.join(" ")) ? { label: "Degree (from the listing title)", tone: "degree" } : { label: "Level not confirmed", tone: "unknown" };
}
