// Assessment engine types. Replicas of employer online assessments: the FORMAT (structure, timing, response style,
// scoring style) follows public descriptions; every item is original. Where a vendor detail is unpublished the test
// is marked `approximate`.

import type { Confidence } from "@/lib/firms/types";

export type Stimulus =
  | { type: "text"; title?: string; body: string }
  | { type: "table"; title?: string; columns: string[]; rows: (string | number)[][]; note?: string }
  | {
      type: "chart";
      title?: string;
      kind: "bar" | "line";
      labels: string[];
      series: { name: string; values: number[] }[];
      unit?: string;
    }
  /** A message in a job simulation's inbox, optionally with a small table attached. */
  | { type: "email"; title?: string; from: string; subject: string; time?: string; body: string; table?: { columns: string[]; rows: (string | number)[][] } };

type Base = {
  id: string;
  /** Key into the section's `stimuli`, so several items can share one passage, table or chart. */
  stimulus?: string;
  prompt: string;
  explanation: string;
  /** 1 (easy) to 5 (hard). Used by adaptive sections. */
  difficulty?: 1 | 2 | 3 | 4 | 5;
};

export const TF_OPTIONS = ["True", "False", "Cannot say"] as const;
export type TfAnswer = 0 | 1 | 2; // index into TF_OPTIONS
export const RATING_LABELS = ["Counterproductive", "Ineffective", "Fairly effective", "Effective"] as const;

export type Item =
  | (Base & { kind: "mcq"; options: string[]; answer: number })
  | (Base & { kind: "tf-cannot-say"; answer: TfAnswer })
  | (Base & { kind: "most-least"; options: string[]; most: number; least: number })
  /** Rate every action 0-3 (see RATING_LABELS). `ratings[i]` is the key for `actions[i]`. */
  | (Base & { kind: "rate-each"; actions: string[]; ratings: number[] })
  /** Type a number. Correct when within `tolerance` of `answer` (default: exact). `unit` is shown beside the box. */
  | (Base & { kind: "numeric"; answer: number; tolerance?: number; unit?: string })
  /** Put the options in order, best first. `order` lists option indexes in the correct order. */
  | (Base & { kind: "rank"; options: string[]; order: number[]; /** e.g. "smallest first"; default "best first". */ orderLabel?: string })
  /** A typed reply (for example an email). Not auto-marked: the review shows a checklist to compare against. */
  | (Base & { kind: "written"; checklist: string[]; minWords?: number })
  /** Agreement 1-5 with a statement, feeding one trait. No right answer. */
  | (Base & { kind: "likert"; trait: string; reverse?: boolean })
  /** Pick the statement most like you and the one least like you. Each statement feeds a trait. */
  | (Base & { kind: "forced-choice"; statements: { text: string; trait: string }[] });

export type ItemKind = Item["kind"];

/** What a candidate submitted for one item. `null` means unanswered. */
export type Response =
  | { kind: "mcq"; choice: number | null }
  | { kind: "tf-cannot-say"; choice: number | null }
  | { kind: "most-least"; most: number | null; least: number | null }
  | { kind: "rate-each"; ratings: (number | null)[] }
  | { kind: "rank"; order: number[] | null }
  | { kind: "numeric"; value: string | null }
  | { kind: "written"; text: string | null }
  | { kind: "likert"; value: number | null }
  | { kind: "forced-choice"; most: number | null; least: number | null };

export type Timing =
  | { mode: "section"; seconds: number }
  | { mode: "item"; seconds: number }
  | { mode: "untimed" }
  /** No time limit, but the time taken is recorded and shown (Cappfinity's "time recorded" mode). */
  | { mode: "recorded" };

export type Section = {
  id: string;
  title: string;
  instructions: string;
  items: Item[];
  stimuli?: Record<string, Stimulus>;
  timing: Timing;
  allowBack: boolean;
  calculator: boolean;
  /** Show the answer and explanation straight after each item (tutor mode). Real tests do not. */
  showFeedback: boolean;
  /** Pool of items; the runner serves `count` of them, steering difficulty from the previous answer. */
  adaptive?: { count: number };
  /**
   * Pool of items; each attempt serves a fresh random selection of `count` items. With `byStimulus`, whole groups
   * that share a passage or table are served together, in their original order.
   */
  sample?: { count: number; byStimulus?: boolean; /** Trim to exactly `count`, even mid-group. */ exact?: boolean };
};

export type Test = {
  id: string;
  name: string;
  /** The real-world assessment this replicates, in one line. */
  replicates: string;
  /** "ability" tests are marked right/wrong; "trait" tests produce a profile with no pass or fail. */
  kind: "ability" | "trait";
  /** An ability test that also holds work-style statements (no right answer). They add nothing to the score. */
  mixedWorkStyle?: boolean;
  sections: Section[];
  /** How sure we are of the published format, and what could not be verified. */
  confidence: Confidence;
  approximate: boolean;
  formatNotes: string[];
  sources: string[];
};

export type SectionResult = {
  sectionId: string;
  points: number;
  max: number;
  answered: number;
  total: number;
  secondsUsed: number;
  traits?: Record<string, number>;
};

export type TestResult = {
  testId: string;
  startedAt: string;
  finishedAt: string;
  sections: SectionResult[];
  points: number;
  max: number;
  /** Raw trait totals for trait tests (see `traitProfile` for 0-100 scores). */
  traits?: Record<string, number>;
  /** What the candidate answered, by item id, so the results screen can review each item. */
  responses: Record<string, Response>;
};
