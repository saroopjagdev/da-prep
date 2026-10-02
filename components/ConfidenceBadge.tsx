import type { Confidence } from "@/lib/firms/types";

const LABEL: Record<Confidence, string> = {
  official: "Official source",
  "multiple-candidate-reports": "Several independent reports",
  "single-report": "Single report",
  inferred: "Inferred, unverified",
};

export default function ConfidenceBadge({ c }: { c: Confidence }) {
  return <span className="chip text-xs">{LABEL[c]}</span>;
}
