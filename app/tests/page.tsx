import AccountNote from "@/components/AccountNote";
import AreaTabs from "@/components/AreaTabs";
import { servedCount } from "@/lib/assess/sample";
import type { Metadata } from "next";
import Link from "next/link";
import { TESTS } from "@/lib/assess/tests";
import { totalSeconds } from "@/lib/assess/validate";

export const metadata: Metadata = {
  title: "Employer-style practice tests",
  description: "Practise online assessments in the format employers use: same item counts, timings and response styles, with original questions.",
};

function summary(id: string) {
  const t = TESTS.find((x) => x.id === id)!;
  const items = t.sections.reduce((n, s) => n + servedCount(s), 0);
  const secs = totalSeconds(t);
  return `${items} ${t.kind === "trait" ? "statements" : "questions"} · ${secs ? `${Math.round(secs / 60)} min` : "untimed"}`;
}

// The tests are grouped by the provider whose format they follow, so a person who has been told "you will sit an SHL test"
// finds it under one heading. Every test stays on the page (no filters, nothing folded away). A test that fits no group
// lands under "Other", so a new test always appears without anyone remembering to list it here.
const GROUPS: { title: string; blurb: string; ids: string[] }[] = [
  { title: "SHL Verify style", blurb: "Numerical, inductive and deductive reasoning in the SHL Verify Interactive format.", ids: ["shl-numerical", "shl-inductive", "shl-deductive"] },
  { title: "Cappfinity style", blurb: "Numerical, verbal and critical reasoning as Cappfinity sets them.", ids: ["capp-numerical", "capp-verbal", "capp-critical"] },
  { title: "Aon / cut-e style", blurb: "Timed statement tests and switch puzzles.", ids: ["scales-numerical", "scales-numerical-full", "scales-verbal", "scales-verbal-full", "switch-challenge"] },
  {
    title: "Situational judgement",
    blurb: "Choose, rank or rate what you would do at work. Each comes in a foundation and a stretch level.",
    ids: ["sjt-most-least", "sjt-most-least-stretch", "sjt-ranking", "sjt-ranking-stretch", "sjt-rate-each", "sjt-rate-each-stretch"],
  },
  { title: "Job simulations", blurb: "A working day broken into short tasks.", ids: ["job-sim-banking", "job-sim-audit", "hsbc-simulate", "work-scenarios"] },
  { title: "Work-style questionnaires", blurb: "No right answers: they describe how you prefer to work.", ids: ["work-style-rating", "work-style-forced-choice"] },
];

export default function Tests() {
  const placed = new Set(GROUPS.flatMap((g) => g.ids));
  const other = TESTS.filter((t) => !placed.has(t.id)).map((t) => t.id);
  const groups = [...GROUPS, ...(other.length ? [{ title: "Other", blurb: "", ids: other }] : [])]
    .map((g) => ({ ...g, tests: g.ids.map((id) => TESTS.find((t) => t.id === id)).filter((t): t is (typeof TESTS)[number] => Boolean(t)) }))
    .filter((g) => g.tests.length > 0);

  return (
    <div className="space-y-6">
      <AreaTabs area="tests" current="/tests" />
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Employer-style practice tests</h1>
        <p className="lead">
          Practise the online assessments employers use, in the same format and timing, with original questions. They are not the real tests. Tests marked &ldquo;Some details approximated&rdquo; follow what the provider publishes and say on the test where it does not.
        </p>
      </div>
      <AccountNote>Taking a test needs a free account: you get 1 free practice test (2 more when you do any two of: apply through the tracker, take a mock interview, start a practice test), and Pro is unlimited.</AccountNote>
      {groups.map((g) => (
        <section key={g.title} className="space-y-2" aria-labelledby={`g-${g.title.replace(/\W+/g, "-").toLowerCase()}`}>
          <div>
            <h2 id={`g-${g.title.replace(/\W+/g, "-").toLowerCase()}`} className="text-lg font-bold">
              {g.title}
            </h2>
            {g.blurb && <p className="text-sm text-muted">{g.blurb}</p>}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.tests.map((t) => (
              <li key={t.id} className="card flex flex-col gap-1.5 p-4">
                <h3 className="font-semibold leading-snug">{t.name}</h3>
                <p className="text-sm text-muted">Same format as: {t.replicates}</p>
                <p className="text-sm font-medium">{summary(t.id)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                  <Link href={`/tests/${t.id}`} className="btn btn-primary !px-4 !py-1.5">
                    Start
                  </Link>
                  {t.approximate && <span className="chip text-xs">Some details approximated</span>}
                  {t.kind === "trait" && <span className="chip text-xs">No right answers</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-xs text-muted">
        These are independent practice tests. They are not affiliated with or endorsed by SHL, Aon, the Civil Service or
        any employer, and they do not contain real test questions.
      </p>
    </div>
  );
}
