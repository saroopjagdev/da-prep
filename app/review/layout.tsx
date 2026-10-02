import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "Personal statement and application review",
  description: "Feedback on your degree apprenticeship personal statement or application answers: evidence, tailoring and structure. You write it; we help you improve it.",
  path: "/review",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
