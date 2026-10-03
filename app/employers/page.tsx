import { Suspense } from "react";
import EmployersList from "@/components/EmployersList";
import { FINANCE_NO_DEGREE_ROUTE, directory } from "@/lib/directory";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Degree apprenticeship employers",
  description: "Degree apprenticeship employers with sourced application processes, dates, tests and reported interview questions.",
  path: "/employers",
});

export default function Employers() {
  // useSearchParams (the ?q= prefill) needs a Suspense boundary so the page can still be prerendered.
  return (
    <Suspense>
      <EmployersList entries={directory()} noDegree={FINANCE_NO_DEGREE_ROUTE} />
    </Suspense>
  );
}
