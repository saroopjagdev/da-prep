import { pageMeta } from "@/lib/site";
import { CONTACT_EMAIL, LEGAL_UPDATED, OPERATOR_NAME } from "@/lib/legal";

export const metadata = pageMeta({
  title: "Terms of use",
  description: "The terms for using Level6, including plans, cancellation and using AI responsibly in applications.",
  path: "/terms",
});

export default function Terms() {
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="page-title">Terms of use</h1>
      <p className="text-muted">Last updated {LEGAL_UPDATED}.</p>

      <h2 className="text-base font-semibold">Who we are</h2>
      <p>
        Level6 is run by {OPERATOR_NAME}.
        {CONTACT_EMAIL ? (
          <>
            {" "}Contact: <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : null}{" "}
        By using the site you agree to these terms. You must be 16 or over.
      </p>

      <h2 className="text-base font-semibold">What this service is</h2>
      <p>
        Level6 provides practice tools and general guidance for people applying for degree apprenticeships. It is not
        careers, legal or financial advice. It is independent: it is not affiliated with, endorsed by or sponsored by
        any employer, university, test provider or government body. Employer, product and programme names are used only
        to describe publicly advertised opportunities and belong to their owners.
      </p>

      <h2 className="text-base font-semibold">Guidance and accuracy</h2>
      <p>
        Application processes, entry requirements, salaries and closing dates change often and differ by employer. Our
        employer guides are based on public sources and candidate reports gathered on the date shown on each page and
        may be out of date or wrong. Always check the employer&apos;s own advert. Practice questions are original and
        will not match any real employer test. AI feedback can be wrong or inconsistent: use it as one input, not a
        prediction of your result. We do not guarantee any outcome.
      </p>

      <h2 className="text-base font-semibold">Use of AI in your applications</h2>
      <p>
        Some employers limit or ban AI help, or outside coaching, in applications and assessments. It is your
        responsibility to read and follow each employer&apos;s rules. Use Level6 to practise and to learn what a good
        answer looks like, and write your applications in your own words.
      </p>

      <h2 className="text-base font-semibold">Your content</h2>
      <p>
        You are responsible for what you enter. Do not submit other people&apos;s personal data or anything you do not
        have the right to share. You keep ownership of your content; you give us permission to process it to provide
        the service, as described in our privacy notice.
      </p>

      <h2 className="text-base font-semibold">Acceptable use</h2>
      <p>
        Do not overload, probe or misuse the service, try to bypass limits, submit harmful or unlawful content, or use
        it to produce work you intend to pass off as someone else&apos;s. We may limit or suspend accounts that do.
      </p>

      <h2 className="text-base font-semibold">Free and Pro plans</h2>
      <p>
        You can browse the employer list and guides without an account. The practice tests, mock processes, tracker and CV and statement review tools need a free account, which you must be 16 or over to create. Free use is limited as shown on the Plans page: a small number of CV and statement reviews and practice tests each week, and one AI mock interview each week. Firm mock processes are not part of the free plan. Pro removes the practice and mock interview limits and includes every firm mock process, subject to fair-use limits. We may change what each plan includes, but not for a period you have already paid for. Pro is a monthly subscription (£9.99 a month)
        that renews automatically until you cancel, and the price is shown before you pay. You can cancel at any time
        from the Plans page (Manage or cancel subscription) and keep Pro until the end of the month you have paid for.
        The person paying must be 18 or over. Because Pro is a digital service
        you start using immediately, you ask for it to begin straight away when you buy. You have a right to cancel
        within 14 days of buying; if you do, we will refund you minus a proportionate amount for the time you have
        already had Pro. To cancel or ask for a refund, contact us. Nothing here affects your statutory rights.
      </p>

      <h2 className="text-base font-semibold">Free trial of Pro</h2>
      <p>
        Each person can start one free trial of Pro, lasting 2 days. You enter a payment card to start it, and Pro is
        available straight away. If you do not cancel before the trial ends, your card is charged £9.99 automatically and
        Pro then renews every month until you cancel, as described above. The Plans page shows the date and time of the
        first charge before you start, and a notice in the app shows how long the trial has left and when the charge will
        be taken. You can cancel at any time during the trial from the Plans page (Manage or cancel subscription), and you
        will not be charged if you cancel before the trial ends. The trial is limited to one per person, and we may refuse
        it where we reasonably believe someone is creating more than one account to repeat it. During the trial, AI features have lower
        daily limits than normal Pro fair use, so that the trial stays affordable. The right to cancel within 14 days
        described above runs from the day you start the trial.
      </p>

      <h2 className="text-base font-semibold">Deleting your account</h2>
      <p>
        You can delete your account whenever you like from the Sign in page (Account section). Doing so permanently
        removes your cloud data and cancels any subscription.
      </p>

      <h2 className="text-base font-semibold">Availability, liability and changes</h2>
      <p>
        The service is provided as is, and we may change or withdraw features. We are not liable for loss from relying
        on guidance or feedback, or for events outside our control, but nothing limits liability that cannot be limited
        by law. These terms are governed by the law of England and Wales. We may update them; the date above shows the
        latest version.
      </p>
    </div>
  );
}
