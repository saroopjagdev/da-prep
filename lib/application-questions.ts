// Application-form questions students can practise in statement review: questions candidates have reported for a
// firm (with any word limit we found), plus common questions that are not tied to a firm. Built on the server.
import type { Confidence, FirmProfile } from "@/lib/firms/types";

export type AppQuestion = { text: string; limit?: number; source?: string; confidence?: Confidence; common?: boolean };

/** Common questions across many employers (our judgement of what comes up often; not a specific firm's wording). */
export const COMMON_QUESTIONS: AppQuestion[] = [
  { text: "Why do you want to join this programme, and why this employer?", common: true },
  { text: "Why have you chosen a degree apprenticeship rather than full-time university?", common: true },
  { text: "Tell us about a time you worked as part of a team to achieve something.", common: true },
  { text: "Tell us about a time you overcame a challenge or setback.", common: true },
  { text: "What have you done to learn about this industry, and what interests you most?", common: true },
];

const wordsIn = (s: string) => {
  const m = s.match(/(\d{2,4})\s*-?\s*words?/i);
  return m ? Number(m[1]) : undefined;
};

/** Reported application-stage questions for a firm, split into single questions, with a word limit if stated. */
export function firmQuestions(f: FirmProfile): AppQuestion[] {
  const appStage = f.stages.find((s) => /application/i.test(s.name));
  const stageLimit = appStage ? wordsIn(appStage.format) : undefined;
  return f.questions
    .filter((q) => /application/i.test(q.stage) && q.question.length < 400)
    .flatMap((q) =>
      q.question.split(" / ").map((part) => {
        const limit = wordsIn(part) ?? stageLimit;
        return { text: part.replace(/\s*\(\d+\s*words?\)\s*/i, "").trim(), limit, source: q.source, confidence: q.confidence };
      }),
    )
    .filter((q) => q.text.endsWith("?") || /^(Share|Tell|Describe|Give)/.test(q.text));
}

export const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** What employers say about AI in applications and assessments (from the firm profiles, each with its source). */
export const AI_RULES: { firm: string; slug: string; rule: string; source: string; confidence: Confidence }[] = [
  { firm: "Barclays", slug: "barclays", rule: "Using third-party AI tools in an assessment or interview ends the interview and withdraws the application.", source: "https://search.jobs.barclays/apprentice-application-journey", confidence: "official" },
  { firm: "J.P. Morgan", slug: "jp-morgan", rule: "The Superday invitation says ChatGPT and other unapproved AI tools are strictly prohibited.", source: "https://www.thestudentroom.co.uk/showthread.php?t=7633223", confidence: "multiple-candidate-reports" },
  { firm: "Arup", slug: "arup", rule: "Asks applicants not to use AI writing assistants in the application.", source: "https://www.arup.com/en-us/careers/early-careers/apprenticeships/", confidence: "official" },
  { firm: "BDO", slug: "bdo", rule: "Allows AI for research and preparation only; using it during assessments or to write interview answers is prohibited.", source: "https://careers.bdo.co.uk/recruitment-process-early-career", confidence: "official" },
  { firm: "Airbus", slug: "airbus", rule: "AI can be used for research, but assessment stages must be completed without real-time AI help.", source: "https://www.airbus.com/en/careers/students-and-graduates/apprentices/apprenticeships-in-the-united-kingdom", confidence: "official" },
  { firm: "Experian", slug: "experian", rule: "Asks candidates not to use AI to generate answers, and warns against over-relying on it for CVs.", source: "https://www.experian.com/careers/early-careers/uk-ireland/our-recruitment-process", confidence: "official" },
  { firm: "Deloitte", slug: "deloitte", rule: "Publishes integrity and AI guidance for candidates to read before the assessments.", source: "https://www.deloitte.com/uk/en/careers/early-careers/early-careers-assessment.html", confidence: "official" },
];
