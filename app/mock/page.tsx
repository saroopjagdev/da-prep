import type { Metadata } from "next";
import Link from "next/link";
import { FIRMS } from "@/lib/firms";
import { ALL_MOCKS } from "@/lib/mockprocess/definitions";

export const metadata: Metadata = {
  title: "Firm mock processes",
  description: "Run a firm's selection process stage by stage: the tests, video questions, exercises and interviews, in the firm's real order.",
};

export default function MockIndex() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="page-title">Firm mock processes</h1>
        <p className="lead">
          Work through a firm&apos;s selection process stage by stage, in the order the firm uses, with replica tests,
          video questions, exercises and interviews marked against that firm&apos;s own values. Where we could not
          verify a stage, we say so.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ALL_MOCKS.map((m) => {
          const firm = FIRMS.find((f) => f.slug === m.firm)!;
          const interactive = m.stages.filter((s) => s.kind !== "info").length;
          return (
            <li key={m.firm} className="card flex flex-col gap-2 p-5">
              <h2 className="font-bold">{firm.name}</h2>
              <p className="text-sm text-muted">
                {m.stages.length} stages, {interactive} you can practise · marked against {m.framework.name}
              </p>
              <p className="text-sm">{m.notes[0]}</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <Link href={`/mock/${m.firm}`} className="btn btn-primary">
                  Open
                </Link>
                {m.confidence !== "official" && <span className="chip text-xs">Lower confidence</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">
        Independent practice, not affiliated with or endorsed by any employer named. Answers are scored by AI, which can be
        wrong, and a mock does not predict a firm&apos;s decision.
      </p>
    </div>
  );
}
