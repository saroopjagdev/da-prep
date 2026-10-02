import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "AI mock interview for degree apprenticeships",
  description: "Practise a degree apprenticeship interview for a specific employer or job advert, including commercial awareness, technical and ethics questions, then get marked feedback.",
  path: "/interview",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
