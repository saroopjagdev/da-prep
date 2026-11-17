import { PASS_PLAN, PRO_PLAN, passOffered } from "@/lib/plans";
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
  {
    q: "What does Level6 cost?",
    a: `Browsing the employer guides and the list of who is open is free with no account. A free account adds your own tracker and a first go at each tool, with no card. Pro is ${PRO_PLAN.price}, cancel any time${passOffered() ? `, or ${PASS_PLAN.price} once for the ${PASS_PLAN.name}: Pro for ${PASS_PLAN.lengthText} with no renewal` : ""}. See the plans page for exactly what each includes.`,
  },
  {
    q: "Are the practice tests the real ones?",
    a: "No. They are original questions in the same format and timing as the real tests, so you learn the format and the pace. Each test says where a detail is approximated.",
  },
  {
    q: "How are the mock interviews and CV reviews marked?",
    a: "By AI, against the question or advert you give it. You get a score out of 100, what was strong, and a stronger version of each answer. Use it to find what to improve, not as a prediction of an employer's decision.",
  },
  {
    q: "How up to date are the dates?",
    a: "Each opening and closing date comes from the employer's own page or an official government advert, and shows the day it was last checked. A check runs every day, but employers can close early once they have enough applicants, so confirm on their site before you apply.",
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
      <p className="text-xs text-muted">Last updated: 17 November 2026.</p>
    </div>
  );
}
