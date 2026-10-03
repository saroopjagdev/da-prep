"use client";

import Link from "next/link";
import { useState } from "react";
import AreaTabs from "@/components/AreaTabs";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { postJson } from "@/lib/api";
import { AI_RULES, COMMON_QUESTIONS, countWords, type AppQuestion } from "@/lib/application-questions";
import { FIRM_GROUPS, type FirmOption } from "@/lib/firms/groups";
import { REVIEW_CRITERIA, type ReviewCriterion } from "@/lib/writing";

type Review = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  rewrittenOpening: string;
  criteria: Record<ReviewCriterion, number>;
  wordCount: number;
  wordLimit: number | null;
};

type ReviewFirm = FirmOption & { questions: AppQuestion[] };

const OWN = "__own__";

export default function ReviewApp({ firms }: { firms: ReviewFirm[] }) {
  const [kind, setKind] = useState<"statement" | "answer">("statement");
  const [text, setText] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [firmSlug, setFirmSlug] = useState("");
  const [programme, setProgramme] = useState(0);
  const [questionPick, setQuestionPick] = useState("");
  const [ownQuestion, setOwnQuestion] = useState("");
  const [limit, setLimit] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const firm = firms.find((f) => f.slug === firmSlug);
  const questions = [...(firm?.questions ?? []), ...COMMON_QUESTIONS];
  const picked = questions.find((q) => q.text === questionPick);
  const question = questionPick === OWN ? ownQuestion.trim() : picked?.text ?? "";
  const wordLimit = Number(limit) >= 20 ? Number(limit) : undefined;
  const words = countWords(text);

  function chooseQuestion(value: string) {
    setQuestionPick(value);
    const q = questions.find((x) => x.text === value);
    setLimit(q?.limit ? String(q.limit) : "");
  }

  async function run() {
    setBusy(true);
    setError("");
    try {
      setReview(
        await postJson<Review>("/api/review", {
          kind,
          text,
          jobAd: jobAd || undefined,
          ...(firm ? { firm: firm.slug, programme } : {}),
          question: kind === "answer" && question ? question : undefined,
          wordLimit,
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <AreaTabs area="feedback" current="/review" />
      <h1 className="page-title">Statement and answer review</h1>
      <p className="text-muted">
        Get feedback on a personal statement or application form answer. Write it yourself and use the feedback to
        improve it. Employers want your own words.
      </p>
      <label className="block text-sm font-medium">
        What are you reviewing?
        <select className="input mt-2.5 !w-auto font-normal" value={kind} onChange={(e) => setKind(e.target.value as "statement" | "answer")}>
          <option value="statement">Personal statement</option>
          <option value="answer">Application form answer</option>
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Employer <span className="font-normal text-muted">(optional)</span>
          <select
            className="input mt-2.5 font-normal"
            value={firmSlug}
            onChange={(e) => {
              setFirmSlug(e.target.value);
              setProgramme(0);
              setQuestionPick("");
              setLimit("");
            }}
          >
            <option value="">No specific employer</option>
            {FIRM_GROUPS.map(([g, label]) => (
              <optgroup key={g} label={label}>
                {firms.filter((f) => f.group === g).map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {firm && (
          <label className="block text-sm font-medium">
            Programme
            <select className="input mt-2.5 font-normal" value={programme} onChange={(e) => setProgramme(Number(e.target.value))}>
              {firm.programmes.map((p, i) => (
                <option key={i} value={i}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {firm && (
        <p className="text-sm text-muted">
          Feedback will check your answer against our research on {firm.name}, including its values.{" "}
          <Link href={`/employers/${firm.slug}`} className="underline">
            Read the guide
          </Link>
        </p>
      )}

      {kind === "answer" && (
        <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
          <label className="block text-sm font-medium">
            The question you&apos;re answering
            <select className="input mt-2.5 font-normal" value={questionPick} onChange={(e) => chooseQuestion(e.target.value)}>
              <option value="">Choose a question</option>
              {firm && firm.questions.length > 0 && (
                <optgroup label={`Reported for ${firm.name}`}>
                  {firm.questions.map((q) => (
                    <option key={q.text} value={q.text}>
                      {q.text}
                      {q.limit ? ` (${q.limit} words)` : ""}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Common questions">
                {COMMON_QUESTIONS.map((q) => (
                  <option key={q.text} value={q.text}>
                    {q.text}
                  </option>
                ))}
              </optgroup>
              <option value={OWN}>Type my own question</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Word limit
            <input className="input mt-2.5 font-normal" inputMode="numeric" placeholder="e.g. 300" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ""))} />
          </label>
          {questionPick === OWN && (
            <label className="block text-sm font-medium sm:col-span-2">
              Your question
              <input className="input mt-2.5 font-normal" maxLength={500} value={ownQuestion} onChange={(e) => setOwnQuestion(e.target.value)} />
            </label>
          )}
          {picked?.source && (
            <p className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
              Reported question <ConfidenceBadge c={picked.confidence ?? "single-report"} />
              <a className="underline" href={picked.source} target="_blank" rel="noreferrer">
                source
              </a>
            </p>
          )}
        </div>
      )}

      <label className="block text-sm font-medium">
        Your text
        <textarea className="mt-2.5 h-48 w-full input font-normal" value={text} onChange={(e) => setText(e.target.value)} maxLength={6000} />
        <span className={`mt-1 block text-xs ${wordLimit && words > wordLimit ? "text-coral-600" : "text-muted"}`}>
          {words} words{wordLimit ? ` of ${wordLimit}${words > wordLimit ? ": over the limit" : ""}` : ""}
        </span>
      </label>
      <label className="block text-sm font-medium">
        Job advert (optional, for tailoring)
        <textarea className="mt-2.5 h-28 w-full input font-normal" value={jobAd} onChange={(e) => setJobAd(e.target.value)} maxLength={6000} />
      </label>
      <p className="text-xs text-muted">Remove names, addresses and contact details first. Text is sent to an AI service.</p>

      <details className="card p-4 text-sm">
        <summary className="cursor-pointer font-semibold">How employers view AI in applications</summary>
        <div className="mt-3 space-y-3">
          <p>
            Many employers allow AI for research but not for writing your answers or during assessments, and some say
            breaking this ends your application. Use this feedback to improve your own writing, then check each
            employer&apos;s rules.
          </p>
          <ul className="space-y-2">
            {AI_RULES.map((r) => (
              <li key={r.firm}>
                <Link href={`/employers/${r.slug}`} className="font-semibold underline">
                  {r.firm}
                </Link>
                : {r.rule} <ConfidenceBadge c={r.confidence} />{" "}
                <a className="text-xs underline" href={r.source} target="_blank" rel="noreferrer">
                  source
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {error && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {error}
        </p>
      )}
      <button onClick={run} disabled={busy || text.trim().length < 50} className="btn btn-primary">
        {busy ? "Reviewing..." : "Review"}
      </button>

      {review && (
        <div className="space-y-4 border-t border-line pt-4">
          <h2 className="text-xl font-semibold">Score: {review.score}/10</h2>
          <p>{review.summary}</p>
          <p className={`text-sm ${review.wordLimit && review.wordCount > review.wordLimit ? "text-coral-600" : "text-muted"}`}>
            {review.wordCount} words{review.wordLimit ? ` (limit ${review.wordLimit})` : ""}
          </p>
          <section className="card space-y-3 p-4">
            <h3 className="font-semibold">How it did on each criterion</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {REVIEW_CRITERIA.map(([key, label]) => {
                const v = Math.round(review.criteria?.[key] ?? 0);
                return (
                  <li key={key} className="space-y-1 text-sm">
                    <div className="flex justify-between font-semibold">
                      <span>{label}</span>
                      <span className="tabular-nums">{v}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-brand-50" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={5} aria-valuenow={v}>
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(v / 5) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="card p-4">
              <h3 className="font-semibold">Strengths</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {review.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
            <section className="card p-4">
              <h3 className="font-semibold">To improve</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {review.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          </div>
          <p className="callout bg-brand-50">
            <strong>A stronger opening:</strong> {review.rewrittenOpening}
          </p>
        </div>
      )}
    </div>
  );
}
