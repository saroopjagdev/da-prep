import { servedCount } from "@/lib/assess/sample";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestPlayer from "@/components/assess/TestPlayer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { TESTS, getTest } from "@/lib/assess/tests";
import { totalSeconds } from "@/lib/assess/validate";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => TESTS.map((t) => ({ id: t.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const test = getTest((await params).id);
  if (!test) return { title: "Test not found" };
  const items = test.sections.reduce((n, s) => n + servedCount(s), 0);
  const secs = totalSeconds(test);
  return pageMeta({
    title: `${test.name}: free practice test`,
    description: `Practise in the format of ${test.replicates}: ${items} ${test.kind === "trait" ? "statements" : "questions"}, ${secs ? `${Math.round(secs / 60)} minutes` : "untimed"}, original questions with explanations. Independent, not affiliated with the test provider.`,
    path: `/tests/${test.id}`,
  });
}

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const test = getTest((await params).id);
  if (!test) notFound();
  return (
    <div className="space-y-4">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Practice tests", path: "/tests" }, { name: test.name, path: `/tests/${test.id}` }])} />
      <ul className="mx-auto max-w-3xl list-disc space-y-1 pl-5 text-xs text-muted">
        {test.formatNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <TestPlayer test={test} />
    </div>
  );
}
