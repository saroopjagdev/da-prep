import { firmOptions } from "@/lib/firms/context";
import InterviewApp from "./InterviewApp";

export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ firm?: string; mode?: string }> }) {
  const { firm, mode } = await searchParams;
  const firms = firmOptions();
  const initialFirm = firms.some((f) => f.slug === firm) ? firm : undefined;
  return <InterviewApp firms={firms} initialFirm={initialFirm} initialMode={mode === "video" ? "video" : "text"} />;
}
