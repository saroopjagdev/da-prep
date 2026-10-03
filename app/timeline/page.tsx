import Link from "next/link";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "Degree apprenticeship timeline",
  description: "What to do and when, from Year 12 to your offer: when applications open, tests, interviews and offers.",
  path: "/timeline",
});

const steps = [
  {
    when: "Year 12 (or a year before you want to start)",
    todo: [
      "Explore sectors and employers. Note which ones have degree apprenticeships.",
      "Build your stories bank: work experience, clubs, volunteering, projects.",
      "Follow employer careers pages so you hear when vacancies open.",
    ],
  },
  {
    when: "Summer before Year 13",
    todo: [
      "Draft a personal statement and CV and get feedback.",
      "Start practising online tests and video-style interviews.",
      "Build a shortlist of 8 to 12 employers in your tracker.",
    ],
  },
  {
    when: "Autumn and winter of Year 13",
    todo: [
      "Many larger employers open applications around now, and some close early once they have enough candidates, so apply promptly. Check each employer.",
      "Complete online tests in a quiet place with a good connection.",
      "Do a mock interview before each real one.",
    ],
  },
  {
    when: "Spring and summer",
    todo: [
      "Attend assessment centres. Practise group exercises.",
      "Compare offers, and keep a UCAS backup if you want one.",
      "Offers are usually conditional on your final grades.",
    ],
  },
];

export default function Timeline() {
  return (
    <div className="space-y-6">
      <h1 className="page-title">Suggested timeline</h1>
      <p className="text-muted">
        There&apos;s no national deadline, so this is a planning guide, not fixed dates. Employers set their own. For real dates, see each{" "}
        <Link href="/employers" className="underline">employer page</Link> or the{" "}
        <Link href="/calendar" className="underline">application calendar</Link>.
      </p>
      {steps.map((s) => (
        <section key={s.when} className="card p-4">
          <h2 className="font-semibold">{s.when}</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {s.todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
