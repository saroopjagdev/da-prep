import Link from "next/link";
import { PRO_PLAN, FREE_INTERVIEWS, FREE_PRACTICE, FREE_REVIEWS } from "@/lib/plans";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "For parents and guardians",
  description: "What Level6 is, what is free, what Pro costs and how to cancel, for the adult who would be paying.",
  path: "/parents",
});

export default function Parents() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="page-title">For parents and guardians</h1>
        <p className="text-muted">
          Your child has asked you to look at Level6. This page says plainly what it is and what paying involves, so you can decide.
        </p>
      </div>

      <section className="space-y-2" aria-labelledby="what">
        <h2 id="what" className="text-lg font-semibold">What Level6 is</h2>
        <p className="text-sm">
          Level6 helps students apply for degree apprenticeships, which are jobs with an employer that include a university degree, paid for by the employer. It lists who is open and when they close, explains each employer&apos;s selection process, and lets students practise the online tests and interviews those employers use, with marked feedback.
        </p>
      </section>

      <section className="space-y-2" aria-labelledby="free">
        <h2 id="free" className="text-lg font-semibold">What is free</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>The list of employers, their guides and closing dates, with no account.</li>
          <li>A free account (for ages 16 and over, no card): the application tracker with deadline emails, plus {FREE_PRACTICE} practice test, {FREE_REVIEWS} CV or statement review and {FREE_INTERVIEWS} AI mock interview, with a little more once they have tried it properly.</li>
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="pro">
        <h2 id="pro" className="text-lg font-semibold">What Pro adds, and what it costs</h2>
        <p className="text-sm">
          <strong>{PRO_PLAN.price}</strong>. {PRO_PLAN.summary} Pro gives unlimited practice tests and AI mock interviews (within fair-use limits), every firm&apos;s mock process stage by stage, and more CV and statement reviews.
        </p>
      </section>

      <section className="space-y-2" aria-labelledby="paying">
        <h2 id="paying" className="text-lg font-semibold">How paying and cancelling work</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Payment is taken by Stripe, so Level6 never sees card details. Pro starts as soon as payment goes through.</li>
          <li>Pro is bought by an adult: you pay with your own payment method, or give your child permission to use it.</li>
          <li>You can cancel at any time from the Plans page, and Pro stays on until the end of the month you have paid for.</li>
          <li>You have a 14-day right to cancel. If you do, you are refunded minus a fair amount for the time Pro was used.</li>
          <li>Full details are in the <Link href="/terms" className="underline">terms</Link> and the <Link href="/privacy" className="underline">privacy notice</Link>.</li>
        </ul>
      </section>

      <section className="card space-y-2 p-5" aria-labelledby="next">
        <h2 id="next" className="text-lg font-semibold">To go ahead</h2>
        <p className="text-sm text-muted">Your child signs in and opens the Plans page, and the payment page there can be completed with your card.</p>
        <Link href="/pricing" className="btn btn-primary">
          See the Plans page
        </Link>
      </section>
    </div>
  );
}
