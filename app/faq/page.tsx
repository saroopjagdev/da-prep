import { pageMeta } from "@/lib/site";
export const metadata = pageMeta({
  title: "FAQ",
  description: "Degree apprenticeship questions answered: pay, fees, grades, how applications work and what happens if you are rejected.",
  path: "/faq",
});

const faqs = [
  {
    q: "What is a degree apprenticeship?",
    a: "A job with training where you work for an employer and study part-time towards a full bachelor's (Level 6) or master's (Level 7) degree. You are paid a wage and don't pay tuition fees.",
  },
  {
    q: "Is it a real degree?",
    a: "Yes. You graduate with a degree from a university, and many programmes also lead to professional recognition.",
  },
  {
    q: "How do I apply?",
    a: "Usually directly to the employer, though a few programmes with a university partner (for example PwC Flying Start) also use UCAS. Find vacancies on Find an Apprenticeship and employer careers pages. There is no single national deadline: some employers recruit all year, others run fixed windows that close early or once places fill, so check each one.",
  },
  {
    q: "What grades do I need?",
    a: "It varies by employer and role. A Level 3 qualification such as A-levels, T-levels or a higher apprenticeship is typical, often with a minimum UCAS tariff and sometimes specific subjects. Always check the advert.",
  },
  {
    q: "How is it different from going to university?",
    a: "You earn a salary and graduate with work experience and no tuition debt, but you have less choice of course and location, less time for student life, and the application is more competitive per place.",
  },
  {
    q: "Can I do both: apply to UCAS and degree apprenticeships?",
    a: "Yes. Many people apply to both and decide when offers arrive.",
  },
  {
    q: "What if I'm rejected?",
    a: "Very common, so apply to several. Ask for feedback where offered, practise the stages you struggled with, and reapply next cycle or try other employers.",
  },
  {
    q: "Do the rules differ across the UK?",
    a: "Yes. Funding and names differ in England, Scotland, Wales and Northern Ireland. This site focuses on England. Check your own nation's apprenticeship service.",
  },
];

export default function Faq() {
  return (
    <div className="space-y-4">
      <h1 className="page-title">FAQ</h1>
      {faqs.map((f) => (
        <details key={f.q} className="card p-4">
          <summary className="cursor-pointer font-medium">{f.q}</summary>
          <p className="mt-2 text-sm text-ink/80">{f.a}</p>
        </details>
      ))}
      <p className="text-xs text-muted">Last updated: 30 September 2026.</p>
    </div>
  );
}
