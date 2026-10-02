import Link from "next/link";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Accessibility statement",
  description: "How accessible Level6 is, what we have tested, known limitations and how to tell us about a problem.",
  path: "/accessibility",
});

export default function Accessibility() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed">
      <h1 className="page-title">Accessibility statement</h1>
      <p className="text-muted">Last reviewed 2 October 2026.</p>
      <p>
        {OPERATOR_NAME} wants everyone to be able to prepare for degree apprenticeship applications on Level6,
        including people who use a screen reader, keyboard, magnification or voice control. We aim to meet the Web
        Content Accessibility Guidelines (WCAG) 2.2 at level AA.
      </p>

      <h2 className="text-base font-semibold">What we have checked</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Automated checks (axe) on every main page, on desktop and phone sizes, with no issues found in our latest run.</li>
        <li>Pages work at phone width without sideways scrolling, and text can be enlarged.</li>
        <li>Forms have labels, timers are announced to screen readers, and buttons and options can be used with a keyboard.</li>
        <li>Text and background colours were checked for contrast.</li>
      </ul>

      <h2 className="text-base font-semibold">Known limitations</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>We have not yet tested the site with disabled users or with every screen reader. Automated tools miss some problems.</li>
        <li>Some practice tests are timed, like the real employer tests they copy. Untimed and time-recorded versions are available for many formats.</li>
        <li>Charts in numerical tests are drawn as pictures. Screen readers get the same numbers as a table, but the chart itself can be hard to read at very high zoom.</li>
        <li>Video-style interviews need a microphone. A text interview with the same questions is always available.</li>
        <li>Real employer assessments may be less accessible than this site. Employers must offer reasonable adjustments, so ask them early if you need any.</li>
      </ul>

      <h2 className="text-base font-semibold">Tell us about a problem</h2>
      <p>
        If something on Level6 is hard to use,{" "}
        {CONTACT_EMAIL ? (
          <>
            email <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        ) : (
          "contact us"
        )}{" "}
        and say which page and what happened. We aim to reply within 5 working days.
      </p>
      <p>
        See also our <Link href="/privacy" className="underline">privacy notice</Link> and{" "}
        <Link href="/terms" className="underline">terms</Link>.
      </p>
    </div>
  );
}
