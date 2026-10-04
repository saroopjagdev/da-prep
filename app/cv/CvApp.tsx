"use client";

import SignInNotice from "@/components/SignInNotice";
import { useState } from "react";
import AreaTabs from "@/components/AreaTabs";
import FileTextPicker from "@/components/FileTextPicker";
import { postJson } from "@/lib/api";
import type { CvOutput } from "@/lib/cv";

type Result = CvOutput & { removed: number };

export default function CvApp({ firms }: { firms: { slug: string; name: string }[] }) {
  const [text, setText] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [firm, setFirm] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      setResult(await postJson<Result>("/api/cv", { text, jobAd: jobAd.trim() || undefined, firm: firm || undefined }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <AreaTabs area="feedback" current="/cv" />
      <h1 className="page-title">CV checker</h1>
      <SignInNotice what="the CV checker" />
      <p className="text-muted">
        Get feedback on your CV for a degree apprenticeship application. It is written for school leavers: grades first,
        evidence over claims, and clear results. Write your CV yourself and use the feedback to improve it. Employers
        want your own words.
      </p>

      <FileTextPicker what="CV" onText={setText} maxChars={8000} />
      <label className="block text-sm font-medium">
        Your CV (upload above, or paste the text here)
        <textarea className="mt-2.5 h-64 w-full input font-normal" value={text} onChange={(e) => setText(e.target.value)} maxLength={8000} />
      </label>
      <label className="block text-sm font-medium">
        Employer (optional, to check tailoring)
        <select className="input mt-2.5 block !w-auto font-normal" value={firm} onChange={(e) => setFirm(e.target.value)}>
          <option value="">No specific employer</option>
          {firms.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Job advert (optional)
        <textarea className="mt-2.5 h-28 w-full input font-normal" value={jobAd} onChange={(e) => setJobAd(e.target.value)} maxLength={6000} />
      </label>

      <p className="callout bg-brand-50 text-sm">
        <strong>Your privacy.</strong> Before anything is analysed we automatically remove email addresses, phone
        numbers, postcodes, links and dates of birth. We can&apos;t spot names or street addresses, so please take those
        out yourself. The text is then sent to an AI service, and we don&apos;t keep your CV.
      </p>
      <p className="text-xs text-muted">
        Some employers restrict AI help or outside coaching in applications. Check their rules, and use this feedback to
        improve your own writing rather than to replace it. Feedback is practice only and can&apos;t promise any
        result.
      </p>
      {error && (
        <p role="alert" className="callout bg-coral-50 text-coral-600">
          {error}
        </p>
      )}
      <button onClick={run} disabled={busy || text.trim().length < 80} className="btn btn-primary">
        {busy ? "Checking..." : "Check my CV"}
      </button>

      {result && (
        <div className="space-y-5 border-t border-line pt-4" aria-live="polite">
          <div>
            <h2 className="text-xl font-semibold">Score: {result.score}/100</h2>
            <p className="mt-1">{result.summary}</p>
            {result.removed > 0 && (
              <p className="mt-1 text-xs text-muted">
                {result.removed} personal detail{result.removed === 1 ? " was" : "s were"} removed before this was analysed.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="card p-4">
              <h3 className="font-semibold">Strengths</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
            <section className="card p-4">
              <h3 className="font-semibold">To improve</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {result.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="card p-4">
            <h3 className="font-semibold">Checklist</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {result.checklist.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className={c.pass ? "text-mint-600" : "text-coral-600"}>
                    {c.pass ? "✓" : "✗"}
                  </span>
                  <span>
                    <span className="sr-only">{c.pass ? "Pass: " : "Needs work: "}</span>
                    <strong>{c.item}.</strong> {c.note}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Section by section</h3>
            {result.sections.map((s, i) => (
              <div key={i} className="card space-y-1 p-4 text-sm">
                <p className="font-semibold">{s.name}</p>
                <p>{s.feedback}</p>
                <p className="callout bg-brand-50">
                  <strong>Try:</strong> {s.suggestion}
                </p>
              </div>
            ))}
          </section>

          {result.bulletRewrites.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold">Stronger bullets</h3>
              <p className="text-xs text-muted">Rewrites use only what your CV says. Fill in the [add detail] gaps with real facts.</p>
              {result.bulletRewrites.map((b, i) => (
                <div key={i} className="card space-y-1 p-4 text-sm">
                  <p className="text-muted">
                    <strong>Before:</strong> {b.original}
                  </p>
                  <p>
                    <strong>After:</strong> {b.improved}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
