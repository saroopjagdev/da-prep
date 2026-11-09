"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type PlannerFirm = { slug: string; name: string; programmes: string[]; values: string[] };

const STORE = "level6:cover-letter";
const EMPTY = ["", "", "", "", ""];

const wordCount = (t: string) => (t.trim().match(/[\w'’-]+/g) ?? []).length;

export default function CoverLetterApp({ firms }: { firms: PlannerFirm[] }) {
  const [slug, setSlug] = useState("");
  const [programme, setProgramme] = useState(0);
  const [name, setName] = useState("");
  const [parts, setParts] = useState<string[]>(EMPTY);
  const [copied, setCopied] = useState<"" | "yes" | "no">("");

  // Keep the draft on this device so a refresh does not lose it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const d = JSON.parse(raw) as { slug?: string; programme?: number; name?: string; parts?: string[] };
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a saved draft once on load
      if (typeof d.slug === "string") setSlug(d.slug);
      if (typeof d.programme === "number") setProgramme(d.programme);
      if (typeof d.name === "string") setName(d.name);
      if (Array.isArray(d.parts) && d.parts.length === EMPTY.length) setParts(d.parts.map(String));
    } catch {
      /* no saved draft */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ slug, programme, name, parts }));
    } catch {
      /* storage unavailable */
    }
  }, [slug, programme, name, parts]);

  const firm = firms.find((f) => f.slug === slug);
  const employer = firm?.name ?? "the employer";
  const programmeName = firm?.programmes[programme] ?? firm?.programmes[0] ?? "the degree apprenticeship";
  const values = firm?.values.length ? firm.values.slice(0, 5).join(", ") : "the values in the job advert";

  const sections = [
      {
        title: "Opening: the role and why you",
        words: "40 to 60 words",
        prompt: `Name the role (${programmeName}) and ${employer}, then say in one or two sentences why it fits you. Make it specific: a subject you enjoy, a project, or the moment you decided on an apprenticeship.`,
      },
      {
        title: "Your strongest example",
        words: "80 to 100 words",
        prompt: `Pick one thing ${employer} looks for (${values}) and give an example that shows it. Say what the situation was, what YOU did, and the result. Use a number if you can.`,
      },
      {
        title: "A second example, a different strength",
        words: "60 to 80 words",
        prompt: "Choose a different skill or value and a different example, ideally from another area of your life (school, work, a club, caring, a hobby). Again: what you did and what changed.",
      },
      {
        title: `Why ${employer} and why an apprenticeship`,
        words: "50 to 70 words",
        prompt: `Say two things you know about ${employer} beyond its name (a product, a project, a value, how its programme works) and why earning while you learn suits you. Avoid anything that could be said about any employer.`,
      },
      {
        title: "Close",
        words: "20 to 30 words",
        prompt: "Say you would welcome the chance to talk about the role, thank them for their time, and mention anything they need to know (for example, when you finish your exams). Keep it short and warm.",
      },
  ];

  const total = parts.reduce((n, p) => n + wordCount(p), 0);
  const letter = [
    "Dear hiring team,",
    ...parts.map((p) => p.trim()).filter(Boolean),
    `Yours sincerely,\n${name.trim() || "[Your name]"}`,
  ].join("\n\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied("yes");
    } catch {
      setCopied("no");
    }
  }
  function clear() {
    setParts(EMPTY);
    setCopied("");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="page-title">Cover letter planner</h1>
        <p className="text-muted">
          A good cover letter is about 250 to 350 words: five short parts, each with one clear point. Pick an employer to see what it assesses, write each part with the prompts, then copy the finished letter.
          This is a planner, not a writer: the words are yours. When you have a draft, get marked feedback on it in{" "}
          <Link href="/review" className="font-semibold text-brand-700 underline underline-offset-4">
            CV and statement review
          </Link>
          .
        </p>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Employer
          <select
            className="input mt-1.5 block font-normal"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setProgramme(0);
            }}
          >
            <option value="">Another employer</option>
            {firms.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        {firm && firm.programmes.length > 1 && (
          <label className="block text-sm font-medium">
            Programme
            <select className="input mt-1.5 block font-normal" value={programme} onChange={(e) => setProgramme(Number(e.target.value))}>
              {firm.programmes.map((p, i) => (
                <option key={p} value={i}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block text-sm font-medium sm:col-span-2">
          Your name (for the sign-off)
          <input className="input mt-1.5 block font-normal" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </label>
      </div>

      {firm && (
        <section className="card space-y-2 p-5" aria-label={`What ${firm.name} assesses`}>
          <h2 className="font-bold">What {firm.name} looks for</h2>
          {firm.values.length > 0 ? (
            <ul className="flex flex-wrap gap-2 text-sm">
              {firm.values.map((v) => (
                <li key={v} className="chip">
                  {v}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">We do not have its published values yet. Use the behaviours in the job advert.</p>
          )}
          <p className="text-sm text-muted">
            From our research.{" "}
            <Link href={`/employers/${firm.slug}`} className="font-semibold text-brand-700 underline underline-offset-4">
              Read the full {firm.name} guide
            </Link>
            . Always check the employer&apos;s own advert before you send.
          </p>
        </section>
      )}

      <ol className="space-y-5">
        {sections.map((s, i) => (
          <li key={s.title} className="space-y-2">
            <label htmlFor={`part-${i}`} className="block">
              <span className="font-bold">
                {i + 1}. {s.title}
              </span>{" "}
              <span className="text-sm font-normal text-muted">({s.words})</span>
            </label>
            <p className="text-sm text-muted">{s.prompt}</p>
            <textarea
              id={`part-${i}`}
              className="input h-32"
              value={parts[i]}
              onChange={(e) => setParts((p) => p.map((x, k) => (k === i ? e.target.value : x)))}
              maxLength={1500}
            />
            <p className="text-xs text-muted">{wordCount(parts[i])} words</p>
          </li>
        ))}
      </ol>

      <section className="card space-y-3 p-5" aria-label="Your letter">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">Your letter</h2>
          <p className={`text-sm font-semibold ${total > 400 ? "text-coral-600" : total >= 250 ? "text-mint-600" : "text-muted"}`} aria-live="polite">
            {total} words {total > 400 ? "(a little long: aim for under 400)" : total >= 250 ? "(a good length)" : "(aim for 250 to 350)"}
          </p>
        </div>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-line bg-soft p-4 font-sans text-sm leading-relaxed">{letter}</pre>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={copy} className="btn btn-primary" disabled={total === 0}>
            Copy letter
          </button>
          <button type="button" onClick={clear} className="btn btn-secondary">
            Clear the draft
          </button>
          {copied === "yes" && <span role="status" className="text-sm font-semibold text-mint-600">Copied</span>}
          {copied === "no" && <span role="status" className="text-sm text-coral-600">Could not copy. Select the text above and copy it yourself.</span>}
        </div>
        <p className="text-xs text-muted">Your draft is saved on this device only. We do not receive it unless you paste it into a review.</p>
      </section>
    </div>
  );
}
