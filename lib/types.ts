import type { RubricKey, Stage } from "@/lib/interview";

export const COMPETENCIES = [
  "Teamwork",
  "Problem solving",
  "Resilience",
  "Communication",
  "Organisation",
  "Leadership",
  "Initiative",
] as const;

export const STATUSES = [
  "Interested",
  "Applied",
  "Online tests",
  "Video interview",
  "Assessment centre",
  "Offer",
  "Rejected",
] as const;
export type Status = (typeof STATUSES)[number];

export type Application = {
  id: string;
  employer: string;
  role: string;
  deadline: string;
  status: Status;
  notes: string;
  // Optional extras (added later, so older saved items still load).
  /** Firm profile slug when added from our employer guides. */
  firm?: string;
  /** Closes when filled rather than on a fixed date. */
  rolling?: boolean;
  /** Last cycle's dates from our research, as a guide. */
  datesHint?: string;
  /** The firm's selection stages, ticked off as you complete them. */
  checklist?: { label: string; done: boolean }[];
};

export type Story = {
  id: string;
  title: string;
  competencies: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
};

export type SessionRecord = {
  id: string;
  date: string;
  stage: Stage;
  mode: "text" | "video";
  overall: number;
  summary: string;
  jobSnippet: string;
  turns: {
    question: string;
    answer: string;
    score: number;
    // Full feedback is optional so sessions saved by older versions still load.
    feedback?: string;
    betterAnswer?: string;
    star?: { situation: boolean; task: boolean; action: boolean; result: boolean };
  }[];
  strengths?: string[];
  improvements?: string[];
  /** Added later, so optional: the rubric bands (0-5), next steps and employer used. */
  rubric?: Partial<Record<RubricKey, number>>;
  nextSteps?: string[];
  firm?: string;
};

/** A finished firm mock process: one compact summary per stage (full answers are not kept). */
export type MockRunRecord = {
  id: string;
  date: string;
  firm: string;
  title: string;
  /** Average of the 0-100 scores across scored stages, if any stage was scored. */
  overall?: number;
  stages: { name: string; kind: "test" | "qa"; score?: number }[];
};

export type PracticeRecord = {
  id: string;
  date: string;
  category: string;
  score: number;
  total: number;
};
