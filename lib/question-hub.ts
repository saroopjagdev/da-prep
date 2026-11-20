// Every reported interview question held in the researched employer guides, gathered for one page. These are paraphrases of
// what candidates and prep sites report, each with its source and how many reports back it, never an employer's own
// question bank. The questions live in lib/firms/*; this only collects and groups them.
import { FIRMS } from "@/lib/firms";
import type { Confidence, ReportedQuestion } from "@/lib/firms/types";

export type HubQuestion = {
  firm: string;
  slug: string;
  stage: string;
  question: string;
  type: ReportedQuestion["type"];
  competency?: string;
  source: string;
  confidence: Confidence;
};

export const TYPE_LABEL: Record<ReportedQuestion["type"], string> = {
  motivation: "Motivation: why this employer, why an apprenticeship",
  competency: "Competency: examples from your experience",
  situational: "Situational: what would you do",
  commercial: "Commercial awareness",
  technical: "Technical",
  case: "Case studies",
  "group-exercise": "Group exercises",
  other: "Other",
};

export const TYPE_ORDER: ReportedQuestion["type"][] = ["motivation", "competency", "situational", "commercial", "technical", "case", "group-exercise", "other"];

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  official: "Stated by the employer",
  "multiple-candidate-reports": "Several reports",
  "single-report": "One report",
  inferred: "Inferred",
};

const DEDUPE = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function allQuestions(): HubQuestion[] {
  const seen = new Set<string>();
  const out: HubQuestion[] = [];
  for (const f of FIRMS) {
    for (const q of f.questions) {
      const key = `${f.slug}|${DEDUPE(q.question)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ firm: f.name, slug: f.slug, stage: q.stage, question: q.question, type: q.type, competency: q.competency, source: q.source, confidence: q.confidence });
    }
  }
  return out.sort((a, b) => a.firm.localeCompare(b.firm));
}

export function questionsByType(): { type: ReportedQuestion["type"]; label: string; items: HubQuestion[] }[] {
  const all = allQuestions();
  return TYPE_ORDER.map((type) => ({ type, label: TYPE_LABEL[type], items: all.filter((q) => q.type === type) })).filter((g) => g.items.length > 0);
}

/** Competencies the reported questions name, most common first. */
export function topCompetencies(limit = 8): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const q of allQuestions()) if (q.competency) counts.set(q.competency, (counts.get(q.competency) ?? 0) + 1);
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, limit);
}

export const sourceHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
