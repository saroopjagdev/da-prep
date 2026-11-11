import Link from "next/link";
import FirmMarquee, { type MarqueeFirm } from "@/components/FirmMarquee";
import HeroSignup from "@/components/HeroSignup";
import HomeSwitch from "@/components/HomeSwitch";
import Icon from "@/components/Icon";
import ScoreRing from "@/components/ScoreRing";
import { FIRMS } from "@/lib/firms";
import { homeStats, openNow } from "@/lib/home";
import { logoPath } from "@/lib/logos";
import { BONUS_EXTRA, FREE_GAMES, FREE_INTERVIEWS, FREE_PRACTICE, FREE_REVIEWS, FREE_STORIES, PRO_PLAN } from "@/lib/plans";

// Rebuilt hourly so the "open now" row follows the dates (an opening date passing flips an employer to open).
export const revalidate = 3600;

// Well-known employers we have a guide for. A logo shows if a file named <slug>.svg (or .png, .jpg) is in public/logos,
// otherwise the name is shown as a wordmark. Add only logos you are licensed or permitted to use.
const FIRST = ["barclays", "goldman-sachs", "jp-morgan", "morgan-stanley", "hsbc", "lloyds", "natwest", "santander", "ubs", "deutsche-bank", "bank-of-america", "citi", "deloitte", "pwc", "kpmg", "ey", "grant-thornton", "bdo", "rolls-royce", "bae-systems", "airbus", "jlr", "amazon", "google", "microsoft", "ibm", "bt", "capgemini", "cisco", "arup", "atkinsrealis", "bmw-group", "experian", "aviva"];

// Every researched firm: the best known first, then the rest A to Z. The closed Civil Service scheme is left out.
function bannerFirms(): MarqueeFirm[] {
  const BANNER = [...FIRST, ...FIRMS.map((f) => f.slug).filter((s) => !FIRST.includes(s) && s !== "civil-service-fast-track")];
  return BANNER.map((slug) => FIRMS.find((f) => f.slug === slug))
    .filter((f): f is (typeof FIRMS)[number] => Boolean(f))
    .map((f) => {
      return { slug: f.slug, name: f.name.replace(/\s*\(.*\)\s*$/, "").replace(/ UK&I| UK$/, ""), logo: logoPath(f.slug) };
    });
}

const ANSWERS = [
  ["Is a degree apprenticeship really a degree?", "Most lead to a full degree (BA, BSc or BEng) while you work and are paid. Some, such as NatWest's Level 6 route, give a degree-level qualification without a degree, so check each programme."],
  ["Do I pay tuition fees?", "No. Your employer and the government cover training costs, and you earn a salary."],
  ["When should I apply?", "Many large employers open in autumn and some close once they have enough applicants. Check each employer's page."],
  ["Are these the real tests?", "No. They are original practice items in the same format and timing. We say where a detail is approximated."],
];

function Feature({
  n,
  title,
  body,
  href,
  cta,
  flip,
  children,
}: {
  n: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={`space-y-4 ${flip ? "md:order-2" : ""}`}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-bold text-white">{n}</span>
        <h3 className="text-3xl font-bold leading-tight tracking-tight">{title}</h3>
        <p className="lead max-w-md">{body}</p>
        <Link href={href} className="inline-block text-sm font-bold text-brand-700 underline underline-offset-4">
          {cta} →
        </Link>
      </div>
      <div className={`rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100 sm:p-6 ${flip ? "md:order-1" : ""}`}>{children}</div>
    </div>
  );
}

export default function Home() {
  const stats = homeStats();
  const open = openNow();

  return (
    <div>
      {/* Signed-in people get the dashboard instead of everything below (see lib/home-gate.ts). */}
      <HomeSwitch open={open} />

      <div className="landing">
        {/* Hero */}
        <section className="hero-dots border-b border-line">
          <div className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:pt-24">
            <p className="mx-auto w-fit rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-muted">
              Free for UK degree apprenticeship applicants
            </p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Know every stage <span className="squiggle">before you apply</span>
            </h1>
            <p className="lead mx-auto mt-6 max-w-2xl text-lg sm:text-xl">
              Employer-style tests, mock interviews marked out of 100, and a live tracker of who is open now.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/login?mode=signup" className="btn btn-primary !px-8 !py-3.5 text-base">
                Sign up free
              </Link>
              <Link href="/opportunities" className="btn btn-secondary !px-8 !py-3.5 text-base">
                See who is open now
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">No card needed. The tracker and every employer guide are free to browse.</p>
          </div>

          {/* Product preview */}
          <div className="mx-auto max-w-3xl px-4 pb-16">
            <div className="rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100 sm:p-4">
              <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_18px_40px_-20px_rgba(27,40,41,0.35)]">
                <div className="flex items-center justify-between border-b border-line bg-soft px-4 py-2.5 text-xs font-semibold text-muted">
                  <span>Mock interview · Motivation</span>
                  <span>Question 2 of 5</span>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-[17px] font-bold leading-snug">Tell us about a time you worked in a team.</p>
                  <p className="rounded-md border border-line bg-soft p-3 text-sm leading-relaxed">
                    In Year 11 I led a four-person robotics group. We were behind on the build, so I split the jobs by who was strongest at each, and we finished
                    two days early.
                  </p>
                  <div className="flex items-center gap-5 border-t border-line pt-4">
                    <ScoreRing value={64} size={84} label="of 100" />
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded bg-mint-50 px-2 py-1 text-mint-600">✓ Situation</span>
                        <span className="rounded bg-mint-50 px-2 py-1 text-mint-600">✓ Action</span>
                        <span className="rounded bg-coral-50 px-2 py-1 text-coral-600">✗ Result</span>
                      </div>
                      <p className="text-sm font-normal text-muted">Add a number: how did you measure &quot;early&quot;?</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="px-1 pt-3 text-center text-xs text-muted">Example of the marked feedback you get</p>
            </div>
          </div>
        </section>

        <div className="pt-10">
          <FirmMarquee firms={bannerFirms()} />
        </div>

        {/* Live proof: who is open right now */}
        {open.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-12" aria-label="Open now">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-4">
              <span className="rounded-full bg-mint-50 px-3 py-1 text-xs font-bold text-mint-700 ring-1 ring-mint-200">Open now</span>
              {open.slice(0, 6).map((o) => (
                <Link key={o.slug} href={`/employers/${o.slug}`} className="chip">
                  {o.name}
                </Link>
              ))}
              <Link href="/opportunities" className="ml-auto text-sm font-semibold text-brand-700 underline underline-offset-4">
                See every employer
              </Link>
            </div>
          </section>
        )}

        {/* Four ways */}
        <section className="mx-auto max-w-6xl space-y-24 px-4 py-20" aria-labelledby="ways">
          <div className="space-y-3 text-center">
            <h2 id="ways" className="text-3xl font-bold tracking-tight sm:text-5xl">
              Four ways Level6 gets you ahead
            </h2>
            <p className="lead mx-auto max-w-xl">From finding the right employer to walking into the final interview.</p>
          </div>

          <Feature
            n="01"
            title="Know who is open, and when."
            body="One tracker for every degree apprenticeship employer: open now, opening soon or closed. Add the ones you apply to and see your next step."
            href="/opportunities"
            cta="Open the tracker"
          >
            <div className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgba(27,40,41,0.35)]">
              <div className="flex items-center justify-between text-xs font-semibold text-muted">
                <span>Opportunities tracker</span>
                <span>{stats.employers} employers</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-mint-50 px-3 py-1 text-mint-700 ring-1 ring-mint-200">Open now</span>
                <span className="rounded-full bg-sun-50 px-3 py-1 text-sun-600">Opening soon</span>
                <span className="rounded-full bg-soft px-3 py-1 text-muted ring-1 ring-line">Closed</span>
              </div>
              <ul className="divide-y divide-line text-sm">
                {(open.length > 0 ? open.slice(0, 3).map((o) => o.name) : ["Barclays", "Rolls-Royce", "Deloitte"]).map((name) => (
                  <li key={name} className="flex items-center justify-between py-2.5">
                    <span className="font-semibold">{name}</span>
                    <span className="text-xs text-muted">{open.length > 0 ? "Open now" : "See dates"}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">{stats.guides} employers also have a full stage-by-stage guide.</p>
            </div>
          </Feature>

          <Feature
            n="02"
            flip
            title="Practise the real tests."
            body="Numerical, verbal, situational judgement and game-style tests that copy real formats and timings, with an explanation for every answer."
            href="/practice"
            cta="Try a practice test"
          >
            <div className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgba(27,40,41,0.35)]">
              <div className="flex items-center justify-between text-xs font-semibold text-muted">
                <span>Numerical reasoning · Question 4 of 10</span>
                <span className="rounded bg-soft px-2 py-1 font-mono">02:41</span>
              </div>
              <p className="text-[15px] font-semibold leading-snug">Revenue rose from £240k to £288k. What was the percentage increase?</p>
              <ul className="grid grid-cols-2 gap-2 text-sm font-semibold">
                {["15%", "20%", "25%", "48%"].map((o, i) => (
                  <li
                    key={o}
                    className={`rounded-md border px-3 py-2 ${i === 1 ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-white"}`}
                  >
                    {String.fromCharCode(65 + i)}. {o}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">Example question. Every test shows the working afterwards.</p>
            </div>
          </Feature>

          <Feature
            n="03"
            title="Get marked out of 100."
            body="Paste a real advert, answer by text or video, and get a score with a stronger version of each answer. Run a firm's whole process in its real order."
            href="/interview"
            cta="Start a mock interview"
          >
            <div className="space-y-3 rounded-xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgba(27,40,41,0.35)]">
              <p className="text-xs font-semibold text-muted">Barclays · Final interview</p>
              <p className="text-[15px] font-bold leading-snug">Why do you want to work here rather than at another bank?</p>
              <div className="flex items-center gap-4 border-t border-line pt-3">
                <ScoreRing value={72} size={72} label="of 100" />
                <p className="text-sm text-muted">Strong motivation. Name one product or value from Barclays to make it specific to them.</p>
              </div>
            </div>
          </Feature>

          <Feature
            n="04"
            flip
            title="Make every line of your CV count."
            body="Get marked feedback on your CV, cover letter and personal statement, with what is missing and what to change, before an employer reads it."
            href="/review"
            cta="Review my CV"
          >
            <div className="space-y-3 rounded-xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgba(27,40,41,0.35)]">
              <div className="flex items-center justify-between text-xs font-semibold text-muted">
                <span>Personal statement</span>
                <span className="rounded bg-sun-50 px-2 py-1 font-bold text-sun-600">68 / 100</span>
              </div>
              <p className="text-sm leading-relaxed">
                I am a hard-working student who{" "}
                <mark className="rounded bg-coral-50 px-1 text-coral-600">enjoys working in a team</mark>. In Year 12 I rebuilt our school robotics scoring system.
              </p>
              <p className="rounded-md bg-soft p-3 text-xs text-muted">
                Replace &quot;enjoys working in a team&quot; with what you did and what changed. Your robotics example already does this, so lead with it.
              </p>
            </div>
          </Feature>
        </section>

        {/* Employer guides */}
        <section className="band border-y border-line">
          <div className="mx-auto max-w-3xl space-y-5 px-4 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{stats.guides} employer guides, stage by stage</h2>
            <p className="lead">What each employer tests, in what order, and what candidates say about it: online tests, video interviews, assessment centres and final interviews.</p>
            <Link href="/opportunities?guides=1" className="btn btn-primary !px-7 !py-3">
              Browse employer guides
            </Link>
          </div>
        </section>

        {/* Plans */}
        <section className="mx-auto max-w-6xl space-y-8 px-4 py-20" aria-labelledby="plans">
          <h2 id="plans" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Free to start. Pro if you want more.</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="card space-y-2 p-6">
              <h3 className="text-lg font-bold">No account</h3>
              <p className="text-sm text-muted">See who is open and when they close, read every employer guide and the advice guides. Tracking applications needs a free account.</p>
            </div>
            <div className="card space-y-2 border-brand-600 p-6">
              <h3 className="text-lg font-bold">Free account</h3>
              <p className="text-sm text-muted">
                Everything above, plus your own tracker, {FREE_PRACTICE} practice test, {FREE_INTERVIEWS} marked AI mock interview, {FREE_REVIEWS} CV and statement review, {FREE_GAMES} practice game round and {FREE_STORIES} AI-drafted story, with your scores kept for you, and {BONUS_EXTRA} more of each when you do any two of: apply through the tracker, take a mock interview, start a practice test. No card.
              </p>
            </div>
            <div className="card space-y-2 p-6">
              <h3 className="text-lg font-bold">Pro: {PRO_PLAN.price}</h3>
              <p className="text-sm text-muted">Unlimited practice tests, games and AI mock interviews, every firm mock process, and much higher CV and statement review limits. Cancel any time.</p>
              <Link href="/pricing" className="btn btn-secondary mt-2">
                See plans
              </Link>
            </div>
          </div>
        </section>

        {/* Quick answers */}
        <section className="mx-auto max-w-3xl space-y-6 px-4 pb-20" aria-labelledby="quick">
          <h2 id="quick" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Quick answers</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-white">
            {ANSWERS.map(([q, a]) => (
              <details key={q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="text-xl text-muted transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="pt-2 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
          <p className="text-center">
            <Link href="/faq" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
              See all FAQs
            </Link>
          </p>
        </section>

        {/* Closing call to action */}
        <section className="bg-navy">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
            <div className="max-w-md space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Start with a free account</h2>
              <p className="flex items-center gap-2 text-white/75">
                <Icon name="arrow" className="h-4 w-4" />
                Your first marked mock interview takes about ten minutes.
              </p>
            </div>
            <div className="w-full max-w-lg">
              <HeroSignup dark />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
