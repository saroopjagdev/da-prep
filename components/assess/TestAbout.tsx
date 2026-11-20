import Link from "next/link";
import { CONFIDENCE_TEXT, prepTips, testFamily, testSummary } from "@/lib/assess/about";
import type { Test } from "@/lib/assess/types";

const GUIDE_FOR = {
  numerical: { href: "/learn/numerical-verbal-reasoning-tests", label: "How to prepare for numerical and verbal reasoning tests" },
  verbal: { href: "/learn/numerical-verbal-reasoning-tests", label: "How to prepare for numerical and verbal reasoning tests" },
  inductive: { href: "/learn/numerical-verbal-reasoning-tests", label: "How to prepare for reasoning tests" },
  deductive: { href: "/learn/numerical-verbal-reasoning-tests", label: "How to prepare for reasoning tests" },
  situational: { href: "/learn/civil-service-judgement-test", label: "The Civil Service judgement test, from the official guidance" },
  switch: { href: "/games/provider/aon", label: "Aon's game-based assessments and how to practise" },
  simulation: { href: "/learn/assessment-centre-tips", label: "Assessment centre tips" },
  trait: { href: "/games", label: "Game-based and trait assessments by provider" },
  other: { href: "/learn/numerical-verbal-reasoning-tests", label: "How to prepare for aptitude tests" },
} as const;

/** Crawlable text for a practice test: what it replicates, how sure we are, the facts of this version, preparation and sources. */
export default function TestAbout({ test }: { test: Test }) {
  const family = testFamily(test);
  const guide = GUIDE_FOR[family];
  return (
    <section className="mx-auto max-w-3xl space-y-4 border-t border-line pt-6" aria-labelledby="about-test">
      <h2 id="about-test" className="text-lg font-semibold">
        About this practice test
      </h2>
      <p className="text-sm">
        It follows the format of <strong>{test.replicates}</strong>, using original questions we wrote, never the provider&apos;s own. {testSummary(test)}
      </p>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold">What we know about the real format</h3>
        <p className="text-sm text-muted">{CONFIDENCE_TEXT[test.confidence]}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {test.formatNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold">How to prepare</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {prepTips(test).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="text-sm">
          <Link href={guide.href} className="underline">
            {guide.label}
          </Link>
          {" · "}
          <Link href="/tests" className="underline">
            All practice tests
          </Link>
        </p>
      </div>

      {test.sources.length > 0 && (
        <p className="text-xs text-muted">
          Sources for the format:{" "}
          {test.sources.map((s, i) => {
            let host = s;
            try {
              host = new URL(s).hostname.replace(/^www\./, "");
            } catch {
              /* keep the raw string */
            }
            return (
              <span key={s}>
                {i > 0 && ", "}
                <a href={s} className="underline" target="_blank" rel="noreferrer">
                  {host}
                </a>
              </span>
            );
          })}
          . Independent practice, not affiliated with any test provider.
        </p>
      )}
    </section>
  );
}
