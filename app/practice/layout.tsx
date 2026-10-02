import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "Practice tests",
  description: "Free situational judgement and reasoning practice with explanations for every answer.",
  path: "/practice",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
