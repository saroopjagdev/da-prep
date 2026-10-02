// Per-firm degree apprenticeship research profile. Every claim needs a source URL and a confidence level.
// Processes change yearly: `lastVerified` is the date the research was done.

export type Confidence = "official" | "multiple-candidate-reports" | "single-report" | "inferred";

export type Sourced = { text: string; source: string; confidence: Confidence };

export type FirmStage = {
  order: number;
  name: string; // e.g. "Online application", "Online assessment", "HireVue", "Assessment centre"
  format: string; // what actually happens, length, platform
  provider?: string; // SHL, Cut-e/Aon, Pymetrics/Harver, HireVue, Criteria, Arctic Shores, Talent Q, in-house...
  durationMins?: number;
  passMarkNotes?: string;
  tips: string[];
  source: string;
  confidence: Confidence;
};

export type ReportedQuestion = {
  stage: string; // matches a FirmStage.name
  question: string; // as reported by candidates (paraphrase ok), never invented
  type: "competency" | "motivation" | "commercial" | "technical" | "situational" | "case" | "group-exercise" | "other";
  competency?: string; // maps to COMPETENCIES in lib/types.ts where possible
  source: string; // URL of the forum/review page
  confidence: Confidence;
};

export type OaSpec = {
  provider: string;
  tests: { name: string; format: string; items?: number; timeMins?: number; notes?: string }[];
  // Describe the style so we can write ORIGINAL look-alike items. Do not paste proprietary test items verbatim.
  styleNotes: string;
  source: string;
  confidence: Confidence;
};

export type FirmProfile = {
  slug: string;
  name: string;
  sector: string;
  programmes: { name: string; level: string; degree?: string; locations?: string[] }[];
  entry: { ucas?: string; predictedGrades?: string; other?: string; source: string };
  timeline: { opens?: string; closes?: string; rolling?: boolean; notes?: string; source: string };
  stages: FirmStage[];
  oa?: OaSpec;
  videoInterview?: Sourced; // HireVue etc: format, prep time, answer length
  assessmentCentre?: Sourced; // activities: group exercise, case study, presentation, in-tray
  finalInterview?: Sourced; // HV / partner / manager interview format
  values: string[]; // firm values/behaviours they assess against
  pay?: Sourced; // starting salary, if published or reported
  dayToDay?: string[]; // our plain-English summary of the work (a judgement, labelled as such on the page)
  whyThisFirm?: Sourced[]; // sourced talking points for "why us" answers (news, strategy, results)
  questions: ReportedQuestion[];
  specificAdvice: string[]; // firm-specific, actionable
  officialLinks: string[];
  lastVerified: string; // ISO date
  gaps: string[]; // what could not be verified
};
