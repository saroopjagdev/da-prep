import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import MockProPreview, { type MockPreview } from "@/components/mock/MockProPreview";
import MockRunner from "@/components/mock/MockRunner";
import RequireAccount from "@/components/RequireAccount";
import { breadcrumbLd } from "@/lib/seo";
import { getFirm } from "@/lib/firms";
import { getTest } from "@/lib/assess/tests";
import type { Test } from "@/lib/assess/types";
import { ALL_MOCKS, getMock } from "@/lib/mockprocess/definitions";
import { BONUS_EXTRA, FREE_INTERVIEWS, PRO_PLAN } from "@/lib/plans";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => ALL_MOCKS.map((m) => ({ firm: m.firm }));

export async function generateMetadata({ params }: { params: Promise<{ firm: string }> }): Promise<Metadata> {
  const slug = (await params).firm;
  const mock = getMock(slug);
  const firm = getFirm(slug);
  if (!mock || !firm) return { title: "Mock process not found" };
  return pageMeta({
    title: `${firm.name} mock application process`,
    description: `Practise the ${firm.name} degree apprenticeship stages in order: ${mock.stages.map((s) => s.name).join(", ")}. Timed like the real thing, with marked feedback.`.slice(0, 300),
    path: `/mock/${slug}`,
  });
}

export default async function MockPage({ params }: { params: Promise<{ firm: string }> }) {
  const slug = (await params).firm;
  const mock = getMock(slug);
  const firm = getFirm(slug);
  if (!mock || !firm) notFound();
  const tests: Record<string, Test> = {};
  for (const s of mock.stages) if (s.kind === "test") tests[s.testId] = getTest(s.testId)!;
  // What a free member sees before the first marked stage: every stage in order, and one real question from the process.
  const MODE = { video: "Video interview", interview: "Interview", exercise: "Exercise" } as const;
  const firstQa = mock.stages.find((s) => s.kind === "qa");
  const preview: MockPreview = {
    stages: mock.stages.map((s) => ({
      name: s.name,
      how: s.kind === "test" ? "Timed practice test" : s.kind === "qa" ? `${MODE[s.mode]}, marked out of 100` : "Read-through with tips",
    })),
    sample: firstQa && firstQa.kind === "qa" && firstQa.prompts[0] ? { stage: firstQa.name, text: firstQa.prompts[0].text } : null,
  };
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Employer guides", path: "/employers" }, { name: `${firm.name} mock process`, path: `/mock/${slug}` }])} />
      <p className="mx-auto mb-3 max-w-xl text-sm">
        <Link href={`/employers/${slug}`} className="underline">
          Read the {firm.name} guide
        </Link>
      </p>
      <RequireAccount
        heading="h2"
        what={`practise the ${firm.name} mock process`}
        preview={
          <section className="mx-auto max-w-xl space-y-2">
            <h1 className="page-title">{firm.name} mock application process</h1>
            <p className="callout bg-sun-50 text-sm">
              Firm mock processes are part of Pro ({PRO_PLAN.price}). A free account includes {FREE_INTERVIEWS} marked AI mock interview, and {BONUS_EXTRA} more when you do any two of: apply through the tracker, take a mock interview, start a practice test.
            </p>
            <p className="text-sm text-muted">Stages, in the order candidates report them:</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {mock.stages.map((s) => (
                <li key={s.name}>{s.name}</li>
              ))}
            </ol>
          </section>
        }
      >
        <MockProPreview firmName={firm.name} preview={preview} />
        <MockRunner mock={mock} firmName={firm.name} tests={tests} />
      </RequireAccount>
    </>
  );
}
