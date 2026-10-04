import { pageMeta } from "@/lib/site";
import { CONTACT_EMAIL, LEGAL_UPDATED, OPERATOR_NAME } from "@/lib/legal";

export const metadata = pageMeta({
  title: "Privacy notice",
  description: "What Level6 stores, what is sent to AI services, and your rights. No ads and no tracking: we only count anonymous daily totals.",
  path: "/privacy",
});

const PROCESSORS: [string, string, string][] = [
  ["OpenAI", "Generates interview questions and feedback, transcribes your voice, and screens text for harmful content", "United States"],
  ["Supabase", "Accounts, sign-in and cloud sync of your data", "Ireland (EU)"],
  ["Vercel", "Hosts the website and its servers", "Global, with servers in the EU and US"],
  ["Stripe", "Takes payment for Pro. We never see your card number", "EU and US"],
  ["Google", "Only if you choose Sign in with Google", "United States"],
];

export default function Privacy() {
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="page-title">Privacy notice</h1>
      <p className="text-muted">Last updated {LEGAL_UPDATED}.</p>

      <section aria-labelledby="short-version" className="callout space-y-2 bg-brand-50">
        <h2 id="short-version" className="text-base font-semibold">
          The short version
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>You don&apos;t need an account. Without one, everything you save stays on your device and we never see it.</li>
          <li>If you make an account (16 and over), we keep your email and your saved work so it syncs. You can delete it all yourself, any time.</li>
          <li>What you type or say into the AI tools is sent to OpenAI to make questions and feedback. We don&apos;t keep it. Please leave out names, phone numbers and addresses.</li>
          <li>No adverts and no tracking. We keep anonymous daily totals, such as how many people visited the home page or signed up, with no cookies and nothing that identifies you. We never share your data with employers.</li>
          <li>The feedback is written by AI, so it can be wrong. You decide what to use.</li>
        </ul>
        <p>The full details are below.</p>
      </section>

      <h2 className="text-base font-semibold">Who we are</h2>
      <p>
        {OPERATOR_NAME} runs Level6 and is the controller of your personal data under UK GDPR.
        {CONTACT_EMAIL ? (
          <>
            {" "}Contact us at <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> about anything
            in this notice or to use your rights.
          </>
        ) : null}
      </p>

      <h2 className="text-base font-semibold">Who this is for</h2>
      <p>
        Level6 is for people aged 16 and over. Many users are under 18, so we collect as little as we can, do not show
        advertising, do not track you across other sites, only count anonymous daily totals that identify no one, and never make your content public.
        You must be 16 or over to create an account.
      </p>

      <h2 className="text-base font-semibold">What we store, and why</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>In your browser only (no account):</strong> your tracker, stories, practice scores and interview
          history. We never receive this.
        </li>
        <li>
          <strong>If you create an account:</strong> your email address, and the same tracker, stories, practice and
          interview data so it syncs between devices. We use this to provide the service you asked for (contract).
        </li>
        <li>
          <strong>If you buy Pro:</strong> a Stripe customer ID and your plan. When you pay we also record, with the payment, that you confirmed the payer is 18 or over, that you
          asked Pro to start straight away and that you accepted the terms. Stripe holds your payment details.
        </li>
        <li>
          <strong>Usage counts:</strong> how many interviews and AI requests your account has made, to apply fair-use
          limits and control costs (our legitimate interest in keeping the service available and affordable).
        </li>
        <li>
          <strong>Technical data:</strong> your IP address is used briefly to limit abuse. We do not store it with your
          profile.
        </li>
      </ul>

      <h2 className="text-base font-semibold">What is sent to AI services</h2>
      <p>
        Job adverts, CV or statement text, STAR notes and your interview answers are sent to OpenAI to generate
        questions and feedback. Text you write is first checked by OpenAI&apos;s moderation service so we can stop
        harmful content and point you to support if you seem to be struggling. We ask OpenAI not to store this data
        for training, but OpenAI may keep API requests for a limited period for abuse monitoring.
      </p>
      <p>
        <strong>Please don&apos;t include names, addresses, phone numbers or other personal details</strong> about
        yourself or anyone else in what you type or say. As a safety net, we automatically remove email addresses,
        UK phone numbers, postcodes and National Insurance numbers from text before it is sent, but this can&apos;t
        catch everything (for example names or street addresses). The CV checker also removes links and dates of birth,
        tells you how many details it removed, and does not keep your CV. If you upload a PDF or Word file, it is read in memory to get the text and is not stored.
      </p>

      <h2 className="text-base font-semibold">Voice, speech and camera</h2>
      <p>
        In video-style interviews your voice is recorded by your browser while you answer and sent to OpenAI to be
        transcribed. We do not keep the recording; only the transcript you confirm is used. The microphone test runs
        on your device. Text-mode dictation uses your browser&apos;s own speech recognition, which may send audio to your
        browser provider. The camera self-view stays on your device and is never recorded or uploaded. You can refuse
        or revoke microphone and camera access in your browser at any time.
      </p>

      <h2 className="text-base font-semibold">Cookies and local storage</h2>
      <p>
        We use only what is strictly necessary: browser storage that keeps you signed in and holds your data on your
        device. We do not use advertising or analytics cookies, and the anonymous daily totals need no cookie or stored identifier, so there is no cookie banner. You can clear this in
        your browser settings, which signs you out and removes local copies.
      </p>

      <h2 className="text-base font-semibold">Who else handles your data</h2>
      {/* Focusable so keyboard users can scroll the table sideways on narrow screens. */}
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Services that handle your data">
        <table className="w-full min-w-[32rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3 font-semibold">Service</th>
              <th className="py-2 pr-3 font-semibold">What for</th>
              <th className="py-2 font-semibold">Where</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSORS.map(([n, what, where]) => (
              <tr key={n} className="border-b border-line align-top">
                <td className="py-2 pr-3 font-medium">{n}</td>
                <td className="py-2 pr-3">{what}</td>
                <td className="py-2">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Where data goes outside the UK we rely on the UK&apos;s approved transfer safeguards. We do not sell your data
        or share it with employers.
      </p>

      <h2 className="text-base font-semibold">How long we keep it</h2>
      <p>
        Cloud data is kept until you delete it or your account. Usage counts are deleted with your account. Payment
        records are kept by Stripe and by us as long as the law requires for accounting.
      </p>

      <h2 className="text-base font-semibold">Your rights</h2>
      <p>
        You can ask to see, correct, export or delete your data, object to how we use it, or withdraw consent. Signed-in
        users can delete their account and all cloud data themselves on the Sign in page (Account section); this also
        cancels any subscription. You can download a copy of your data with the Backup tool in the tracker. If you are
        unhappy with how we handle your data you can complain to the Information Commissioner&apos;s Office at{" "}
        <a className="underline" href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">
          ico.org.uk
        </a>
        , 0303 123 1113.
      </p>

      <h2 className="text-base font-semibold">Automated feedback</h2>
      <p>
        Interview questions, marks and feedback are produced automatically by AI. They are practice guidance only, are
        never shared with employers and don&apos;t decide anything about you. If you think feedback was wrong or
        unfair, tell us{CONTACT_EMAIL ? ` at ${CONTACT_EMAIL}` : ""} and we will look into it.
      </p>

      <h2 className="text-base font-semibold">If you contact us</h2>
      <p>
        If you email us, we keep your message and contact details to reply. If a message raises a concern about
        someone&apos;s safety, we keep a short, secure record of it and may share it with the right service (such as
        children&apos;s services or the police) to keep someone safe.
      </p>

      <h2 className="text-base font-semibold">If you are struggling</h2>
      <p>
        Applications can be stressful. If things feel like too much, Childline (0800 1111, under 19s), Samaritans
        (116 123) and Shout (text SHOUT to 85258) are free and confidential.
      </p>
    </div>
  );
}
