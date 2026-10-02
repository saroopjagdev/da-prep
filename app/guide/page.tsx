import { pageMeta } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMeta({
  title: "How degree apprenticeship applications work",
  description: "Each stage of a degree apprenticeship application explained: online form, tests, video interview, assessment centre and offer.",
  path: "/guide",
});

const stages = [
  {
    name: "1. Online application",
    what: "A form, sometimes with a CV or short written answers. You usually apply directly to the employer. A few programmes with a university partner also use UCAS.",
    prep: "Match your examples to the job advert. Check spelling. Apply early: many schemes close once they have enough applicants.",
  },
  {
    name: "2. Online assessments",
    what: "Situational judgement tests, numerical, verbal and logical reasoning, or a strengths questionnaire. Often sent straight after you apply, and an early filter.",
    prep: "Practise the formats under timed conditions. For SJTs, think about what the employer's values would favour.",
  },
  {
    name: "3. Video interview",
    what: "You record answers to on-screen questions; time limits vary by employer. No live interviewer.",
    prep: "Test your camera and lighting. Use the STAR method (Situation, Task, Action, Result) and keep to time.",
  },
  {
    name: "4. Assessment centre",
    what: "In person or virtual. Can include a group exercise, a role-play, a further interview and other tasks.",
    prep: "In groups, contribute and include others rather than dominate. Read the brief carefully.",
  },
  {
    name: "5. Offer",
    what: "Usually conditional on your final grades. The university or training provider must also accept you.",
    prep: "Keep your grades on track and respond to the employer promptly.",
  },
];

export default function Guide() {
  return (
    <div className="space-y-6">
      <h1 className="page-title">How degree apprenticeship applications work</h1>
      <p className="text-muted">
        There is no single national deadline. Many employers advertise through the year, but some run fixed annual windows that close early, so check each one on{" "}
        <a
          className="underline"
          href="https://www.findapprenticeship.service.gov.uk"
          target="_blank"
          rel="noreferrer"
        >
          Find an Apprenticeship
        </a>{" "}
        and their own sites. Typical entry is Level 3 (A-levels, T-levels or similar), often with a
        minimum UCAS tariff that varies by employer.
      </p>
      <p className="text-sm">
        <Link href="/tips" className="font-semibold text-brand-700 underline">
          Tips for each stage
        </Link>{" "}
        ·{" "}
        <Link href="/timeline" className="font-semibold text-brand-700 underline">
          Suggested timeline
        </Link>{" "}
        ·{" "}
        <Link href="/sectors" className="font-semibold text-brand-700 underline">
          Sector guides
        </Link>
      </p>
      <ol className="relative space-y-5 border-l-2 border-brand-100 pl-8">
        {stages.map((s, i) => (
          <li key={s.name} className="animate-fade-up relative">
            <span className="display absolute -left-[2.85rem] grid h-9 w-9 place-items-center rounded-md bg-brand-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <section className="card p-5">
              <h2 className="display font-bold">{s.name.replace(/^\d+\.\s*/, "")}</h2>
              <p className="mt-1 text-sm">{s.what}</p>
              <p className="callout mt-3 bg-brand-50 text-sm">
                <strong>Prep:</strong> {s.prep}
              </p>
            </section>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted">Last updated: 30 September 2026. Processes vary by employer.</p>
    </div>
  );
}
