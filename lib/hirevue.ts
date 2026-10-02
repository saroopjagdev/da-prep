// One-way video interview settings, per employer. Employers configure HireVue themselves (question count, thinking
// time, answer time, re-records), so these follow the most recent candidate and prep-site reports and are labelled as
// such. Research and sources: docs/research/13-video-interviews.md. Our interviews have at most MAX_QUESTIONS.

import type { Confidence } from "@/lib/firms/types";
import { MAX_QUESTIONS } from "@/lib/interview";

export type VideoPreset = {
  id: string;
  label: string;
  thinkSeconds: number;
  answerSeconds: number;
  questions: number;
  /** Re-records allowed per question on the scored questions (the practice question is always unlimited). */
  retakes: number;
  note: string;
  source: string;
  confidence: Confidence;
};

const HV = "https://www.hirevue.com/candidates/interview-tips";

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: "typical",
    label: "Typical HireVue",
    thinkSeconds: 30,
    answerSeconds: 120,
    questions: 5,
    retakes: 0,
    note: "HireVue says most video assessments have 5 to 8 questions, about 30 seconds to think and up to 3 minutes to answer; employers set retakes, often none.",
    source: HV,
    confidence: "official",
  },
  {
    id: "goldman-sachs",
    label: "Goldman Sachs",
    thinkSeconds: 30,
    answerSeconds: 120,
    questions: 5,
    retakes: 0,
    note: "Reported: 3 to 6 questions, 30 seconds to think, up to 2 minutes to answer, no retakes on scored questions. Goldman says the interview takes about 30 minutes.",
    source: "https://www.gameassessmentprep.com/hirevue/questions/goldman-sachs",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "jp-morgan",
    label: "J.P. Morgan",
    thinkSeconds: 30,
    answerSeconds: 120,
    questions: 5,
    retakes: 0,
    note: "Reported: 30 seconds to think and 2 minutes to answer, drawn from a large question pool.",
    source: "https://igotanoffer.com/blogs/finance/jpm-hirevue-interview",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "morgan-stanley",
    label: "Morgan Stanley",
    thinkSeconds: 30,
    answerSeconds: 90,
    questions: 4,
    retakes: 0,
    note: "Reported: 3 to 5 questions, about 30 seconds to think and about 1.5 minutes to answer.",
    source: "https://www.gameassessmentprep.com/hirevue/questions/morgan-stanley",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "bank-of-america",
    label: "Bank of America",
    thinkSeconds: 30,
    answerSeconds: 180,
    questions: 4,
    retakes: 0,
    note: "Reported: 30 seconds to prepare and up to 3 minutes to answer; candidates describe 3 to 5 questions. Practice questions are available.",
    source: "https://www.roadtooffer.com/blog/bank-of-america-hirevue",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "barclays",
    label: "Barclays",
    thinkSeconds: 30,
    answerSeconds: 180,
    questions: 5,
    retakes: 0,
    note: "Older candidate reports: up to 8 questions, 30 seconds to prepare and 3 minutes to answer. Barclays' current apprentice journey doesn't list a video stage, so check your invitation.",
    source: "https://www.thestudentroom.co.uk/showthread.php?t=5504340",
    confidence: "single-report",
  },
  {
    id: "hsbc",
    label: "HSBC (job simulation)",
    thinkSeconds: 120,
    answerSeconds: 120,
    questions: 4,
    retakes: 0,
    note: "Reported: inside HSBC's job simulation, 3 to 5 recorded answers with about 2 minutes to prepare and 2 minutes to answer, no re-recording.",
    source: "https://www.graduatesfirst.com/hsbc-job-simulation",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "ubs",
    label: "UBS",
    thinkSeconds: 60,
    answerSeconds: 120,
    questions: 5,
    retakes: 0,
    note: "Reported: 8 to 10 competency questions; one degree apprentice applicant described 1 minute to prepare and 2 minutes to answer. This practice uses 5.",
    source: "https://www.thestudentroom.co.uk/showthread.php?t=7545577&page=2",
    confidence: "multiple-candidate-reports",
  },
  {
    id: "blackrock",
    label: "BlackRock",
    thinkSeconds: 180,
    answerSeconds: 90,
    questions: 3,
    retakes: 0,
    note: "Reported: a short pre-interview assessment (under 10 minutes) with up to 90 seconds per answer and unusually long thinking time, completed in one sitting with no retakes.",
    source: "https://www.graduatesfirst.com/blackrock-video-assessment",
    confidence: "multiple-candidate-reports",
  },
].map((p) => ({ ...p, questions: Math.min(p.questions, MAX_QUESTIONS) }) as VideoPreset);

export const getPreset = (id: string) => VIDEO_PRESETS.find((p) => p.id === id) ?? VIDEO_PRESETS[0];

/** "2:00", "0:30", "3:00". */
export const mmss = (s: number) => `${Math.floor(Math.max(s, 0) / 60)}:${String(Math.max(s, 0) % 60).padStart(2, "0")}`;

/** "2 minutes", "30 seconds", "1 minute 30 seconds". */
export function spoken(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  const parts = [m ? `${m} minute${m > 1 ? "s" : ""}` : "", r ? `${r} seconds` : ""].filter(Boolean);
  return parts.join(" ") || "0 seconds";
}
