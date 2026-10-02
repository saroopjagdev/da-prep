import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import MockRunner from "@/components/mock/MockRunner";
import { breadcrumbLd } from "@/lib/seo";
import { getFirm } from "@/lib/firms";
import { getTest } from "@/lib/assess/tests";
import type { Test } from "@/lib/assess/types";
import { MOCKS, getMock } from "@/lib/mockprocess/definitions";
import { pageMeta } from "@/lib/site";

export const generateStaticParams = () => MOCKS.map((m) => ({ firm: m.firm }));

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
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Mock processes", path: "/mock" }, { name: `${firm.name} mock process`, path: `/mock/${slug}` }])} />
      <MockRunner mock={mock} firmName={firm.name} tests={tests} />
    </>
  );
}
