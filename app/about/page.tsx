import Link from "next/link";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About and contact",
  description: "What Level6 is, how its employer dates and practice tests are made, and how to contact us.",
  path: "/about",
});

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed">
      <h1 className="page-title">About and contact</h1>
      <p className="lead">
        Level6 helps students apply for degree apprenticeships: who is open and when, what each employer&apos;s process involves, and practice for each stage.
      </p>

      <h2 className="text-base font-semibold">Who runs it</h2>
      <p>
        Level6 is run by {OPERATOR_NAME}. It is independent: it is not affiliated with, or endorsed by, any employer, test provider or university it mentions.
      </p>

      <h2 className="text-base font-semibold">How the employer information is kept current</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Every opening and closing date comes from the employer&apos;s own page or the government&apos;s Find an Apprenticeship service, never from guesswork, and each row shows the day it was last checked.</li>
        <li>A check runs every day. When a page still says what it said before, its checked date is refreshed. When an employer&apos;s page changes, a person reads it before the date on Level6 changes. Dates taken from official government adverts update from the advert itself.</li>
        <li>Employers can close early once they have enough applicants, so always confirm on the employer&apos;s own site before you rely on a date.</li>
      </ul>

      <h2 className="text-base font-semibold">How the practice works</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Practice tests and games use original questions in the same format and timing as the real ones. They are not the real tests, and each says where a detail is approximated.
        </li>
        <li>Mock interviews and CV reviews are marked by AI against the question or advert you give. Treat the score as guidance for what to improve, not as a prediction of an employer&apos;s decision.</li>
        <li>
          What is free and what is Pro is on the <Link href="/pricing" className="underline">plans page</Link>. Your tracker and scores stay on your free account whether or not you pay.
        </li>
      </ul>

      <h2 className="text-base font-semibold">Contact</h2>
      {CONTACT_EMAIL ? (
        <p>
          Questions, corrections or something not working: email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          . If a date or detail on an employer page is out of date, tell us which page and we will check it.
        </p>
      ) : (
        <p>Contact details are on the <Link href="/privacy" className="underline">privacy notice</Link>.</p>
      )}
      <p className="text-muted">
        More: <Link href="/privacy" className="underline">privacy</Link>, <Link href="/terms" className="underline">terms</Link>, <Link href="/accessibility" className="underline">accessibility</Link>, and a page <Link href="/parents" className="underline">for parents and guardians</Link>.
      </p>
    </div>
  );
}
