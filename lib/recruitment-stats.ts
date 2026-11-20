// Counts across the researched employer guides: how many record an online assessment, a video interview, an assessment centre,
// rolling applications and a degree-level programme, how many stages a process has, which test providers are named, and,
// from the short employer pages, how many employers we read offer degree level at all. Every number is computed from the
// sourced profiles, so it moves when the research does. These describe what each guide RECORDS, not every employer's full
// process, and the page says so.
import { FIRMS } from "@/lib/firms";
import { allQuestions } from "@/lib/question-hub";
import { LITE_EMPLOYERS } from "@/lib/lite-employers";

const DEGREE_WORDS = /degree|level 6|level 7|graduate apprentice/i;

/** Providers we can recognise by name in a profile's online assessment line, in the order they are shown. */
export const PROVIDER_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "SHL", re: /\bSHL\b/i },
  { name: "HireVue", re: /hirevue/i },
  { name: "Cappfinity", re: /cappfinity/i },
  { name: "Pymetrics (Harver)", re: /pymetrics|harver/i },
  { name: "Saville Assessment", re: /saville/i },
  { name: "Neurosight", re: /neurosight/i },
  { name: "Arctic Shores", re: /arctic shores/i },
  { name: "Aon", re: /\baon\b|cut-e/i },
  { name: "Criteria", re: /criteria/i },
];

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

export type RecruitmentStats = ReturnType<typeof recruitmentStats>;

export function recruitmentStats() {
  // The closed Civil Service Fast Track programme is a historic process, so it is left out of the counts.
  const firms = FIRMS.filter((f) => f.slug !== "civil-service-fast-track");
  const n = firms.length;
  const stages = firms.map((f) => f.stages.length);
  const providers = PROVIDER_PATTERNS.map((p) => ({ name: p.name, firms: firms.filter((f) => f.oa && p.re.test(f.oa.provider)).length })).filter((p) => p.firms > 0).sort((a, b) => b.firms - a.firms);
  const questions = allQuestions();
  const lite = (v: (typeof LITE_EMPLOYERS)[number]["verdict"]) => LITE_EMPLOYERS.filter((l) => l.verdict === v).length;
  return {
    employers: n,
    onlineAssessment: firms.filter((f) => f.oa).length,
    videoInterview: firms.filter((f) => f.videoInterview).length,
    assessmentCentre: firms.filter((f) => f.assessmentCentre).length,
    rolling: firms.filter((f) => f.timeline.rolling).length,
    degreeLevel: firms.filter((f) => f.programmes.some((p) => DEGREE_WORDS.test(`${p.name} ${p.level} ${p.degree ?? ""}`))).length,
    stagesMedian: median(stages),
    stagesMin: Math.min(...stages),
    stagesMax: Math.max(...stages),
    providers,
    reportedQuestions: questions.length,
    employersWithQuestions: new Set(questions.map((q) => q.slug)).size,
    short: {
      total: LITE_EMPLOYERS.length,
      degree: lite("degree"),
      mixed: lite("mixed"),
      notDegree: lite("not-degree"),
      unclear: lite("unclear"),
    },
    latest: firms.map((f) => f.lastVerified).sort().at(-1) ?? "",
  };
}
