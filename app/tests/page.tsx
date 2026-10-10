import AccountNote from "@/components/AccountNote";
import AreaTabs from "@/components/AreaTabs";
import { servedCount } from "@/lib/assess/sample";
import type { Metadata } from "next";
import Link from "next/link";
import { TESTS } from "@/lib/assess/tests";
import { totalSeconds } from "@/lib/assess/validate";

export const metadata: Metadata = {
  title: "Assessment replicas",
  description: "Practise online assessments in the format employers use: same item counts, timings and response styles, with original questions.",
};

function summary(id: string) {
  const t = TESTS.find((x) => x.id === id)!;
  const items = t.sections.reduce((n, s) => n + servedCount(s), 0);
  const secs = totalSeconds(t);
  return `${items} ${t.kind === "trait" ? "statements" : "questions"} · ${secs ? `${Math.round(secs / 60)} min` : "untimed"}`;
}

export default function Tests() {
  return (
    <div className="space-y-6">
      <AreaTabs area="tests" current="/tests" />
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Assessment replicas</h1>
        <p className="lead">
          Practise the online assessments employers use. Each replica follows the published format of a real test
          (number of questions, time limit, how you answer) with original questions. Where a provider does not publish
          a detail, we say so on the test.
        </p>
      </div>
      <AccountNote>Taking a test needs a free account: you get 2 free practice tests, and Pro is unlimited.</AccountNote>
      <ul className="grid gap-4 sm:grid-cols-2">
        {TESTS.map((t) => (
          <li key={t.id} className="card flex flex-col gap-2 p-5">
            <h2 className="font-bold">{t.name}</h2>
            <p className="text-sm text-muted">Replicates: {t.replicates}</p>
            <p className="text-sm font-medium">{summary(t.id)}</p>
            <p className="text-sm">{t.formatNotes[0]}</p>
            <div className="mt-auto flex items-center gap-3 pt-2">
              <Link href={`/tests/${t.id}`} className="btn btn-primary">
                Start
              </Link>
              {t.approximate && <span className="chip text-xs">Some details approximated</span>}
              {t.kind === "trait" && <span className="chip text-xs">No right answers</span>}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">
        These are independent practice tests. They are not affiliated with or endorsed by SHL, Aon, the Civil Service or
        any employer, and they do not contain real test questions.
      </p>
    </div>
  );
}
