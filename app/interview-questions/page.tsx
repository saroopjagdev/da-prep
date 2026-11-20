import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { CONFIDENCE_LABEL, allQuestions, questionsByType, sourceHost, topCompetencies } from "@/lib/question-hub";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";
import { FIRMS } from "@/lib/firms";

const latest = FIRMS.filter((f) => f.questions.length > 0).map((f) => f.lastVerified).sort().at(-1) ?? "2026-11-20";
const total = allQuestions().length;
const firmsWithQuestions = new Set(allQuestions().map((q) => q.slug)).size;

export const metadata = pageMeta({
  title: "Degree apprenticeship interview questions reported by candidates",
  description: `${total} interview questions reported by candidates and prep sites across ${firmsWithQuestions} degree apprenticeship employers, grouped by type, each with its source and how many reports back it.`,
  path: "/interview-questions",
});

export default function InterviewQuestions() {
  const groups = questionsByType();
  const competencies = topCompetencies(6);
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Interview questions", path: "/interview-questions" },
          ]),
          articleLd({ headline: "Degree apprenticeship interview questions reported by candidates", description: `${total} reported questions across ${firmsWithQuestions} employers`, path: "/interview-questions", dateModified: latest }),
        ]}
      />
      <div className="space-y-3">
        <h1 className="page-title">Degree apprenticeship interview questions reported by candidates</h1>
        <p className="lead">
          {total} questions reported by candidates and prep sites across {firmsWithQuestions} employers, grouped by type. Each shows the employer, the stage, how many reports back it and where we read it. They are paraphrases, not any employer&apos;s own list,
          and employers change their questions, so use them to see the kinds of question to prepare for.
        </p>
      </div>

      <section className="card space-y-2 p-4 text-sm" aria-labelledby="read">
        <h2 id="read" className="font-semibold">
          How to read this page
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>&quot;Several reports&quot; means more than one candidate or site reported the question. &quot;One report&quot; means a single source, so treat it as less certain.</li>
          <li>Many reports come from graduate or internship routes, because degree apprenticeship reports are rarer. The employer page says which route a question came from where it is known.</li>
          <li>
            The most common themes in these questions are {competencies.map((c) => `${c.name.toLowerCase()} (${c.count})`).join(", ")}.
          </li>
        </ul>
      </section>

      {groups.map((g) => (
        <section key={g.type} className="space-y-3" aria-labelledby={`t-${g.type}`}>
          <h2 id={`t-${g.type}`} className="text-lg font-semibold">
            {g.label} ({g.items.length})
          </h2>
          <ul className="space-y-3">
            {g.items.map((q) => (
              <li key={`${q.slug}-${q.question}`} className="card p-3 text-sm">
                <p>{q.question}</p>
                <p className="mt-1 text-xs text-muted">
                  <Link href={`/employers/${q.slug}`} className="font-semibold underline">
                    {q.firm}
                  </Link>
                  {" · "}
                  {q.stage}
                  {" · "}
                  {CONFIDENCE_LABEL[q.confidence]}
                  {" · "}
                  <a href={q.source} target="_blank" rel="noreferrer" className="underline">
                    {sourceHost(q.source)}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card space-y-2 p-5" aria-labelledby="practise">
        <h2 id="practise" className="text-lg font-semibold">
          Practise answering them
        </h2>
        <p className="text-sm text-muted">
          Read our guides to interview questions and video interviews, then practise out loud with a timed mock interview.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/learn/degree-apprenticeship-interview-questions" className="btn btn-secondary">
            Interview questions guide
          </Link>
          <Link href="/learn/video-interview-tips-hirevue" className="btn btn-secondary">
            Video interview tips
          </Link>
          <Link href="/interview" className="btn btn-primary">
            Practise a mock interview
          </Link>
        </div>
      </section>

      <p className="text-xs text-muted">Independent guidance from Level6, not affiliated with any employer named. Questions are reported, not confirmed by the employers.</p>
    </div>
  );
}
