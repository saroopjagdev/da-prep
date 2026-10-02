import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "Plans",
  description: "What is free on Level6 and what Pro adds.",
  path: "/pricing",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
