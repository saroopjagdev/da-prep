import Link from "next/link";
import FirmMarquee, { type MarqueeFirm } from "@/components/FirmMarquee";
import HeroSignup from "@/components/HeroSignup";
import HomeSwitch from "@/components/HomeSwitch";
import Icon from "@/components/Icon";
import ScoreRing from "@/components/ScoreRing";
import { FIRMS } from "@/lib/firms";
import { homeStats, openNow } from "@/lib/home";
import { logoPath } from "@/lib/logos";
import { FREE_PRACTICE_PER_WEEK, FREE_REVIEWS, PRO_PLAN } from "@/lib/plans";

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

const STEPS = [
  ["1", "Pick an employer", "See who is open now and how its process works, stage by stage.", "/opportunities"],
  ["2", "Practise the real stages", "Employer-style tests, video interviews and case studies, in the employer's own order.", "/mock"],
  ["3", "Get marked, then apply", "Feedback out of 100 on interviews, CVs and statements, and a list to track every application.", "/opportunities?mine=1"],
] as const;

const OUTCOMES = [
  { href: "/mock", title: "Practise like the real thing", body: "Tests that copy real formats and timings, and a mock process for each of our employers: video interview, case study, final interview." },
  { href: "/interview", title: "Know exactly what to fix", body: "Paste the advert, answer, and get a mark out of 100 with a stronger version of each answer. Marked feedback on your CV, cover letter and statement too." },
  { href: "/opportunities", title: "Never miss a window", body: "Who is open, opening soon or closed, by sector. Track each application and get warned before a closing date." },
];

const ANSWERS = [
  ["Is a degree apprenticeship really a degree?", "Most lead to a full degree (BA, BSc or BEng) while you work and are paid. Some, such as NatWest's Level 6 route, give a degree-level qualification without a degree, so check each programme."],
  ["Do I pay tuition fees?", "No. Your employer and the government cover training costs, and you earn a salary."],
  ["When should I apply?", "Many large employers open in autumn and some close once they have enough applicants. Check each employer's page."],
  ["Are these the real tests?", "No. They are original practice items in the same format and timing. We say where a detail is approximated."],
];

export default function Home() {
  const stats = homeStats();
  const open = openNow();
  const depth = [
    [String(stats.guides), "employer guides", "/opportunities?guides=1"],
    [String(stats.mocks), "mock processes", "/mock"],
    [String(stats.tests), "test replicas", "/tests"],
    [String(stats.employers), "employers tracked", "/opportunities"],
  ];

  return (
    <div>
      {/* Signed-in people get the dashboard instead of everything below (see lib/home-gate.ts). */}
      <HomeSwitch open={open} />

      <div className="landing">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div className="space-y-6">
            <p className="text-sm font-bold text-brand-700">For UK degree apprenticeship applicants</p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">Practise the real stages of a degree apprenticeship application</h1>
            <p className="lead max-w-lg text-lg">
              Employer-style tests, mock interviews marked out of 100, and a live list of who is open now. Free to start.
            </p>
            <HeroSignup />
            <p className="text-sm">
              <Link href="/opportunities" className="font-semibold text-brand-700 underline underline-offset-4">
                Or see who is open now
              </Link>{" "}
              <span className="text-muted">(no account needed)</span>
            </p>
          </div>

          {/* Product preview in a tinted frame */}
          <div className="rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100 sm:p-4">
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_18px_40px_-20px_rgba(27,40,41,0.35)]">
              <div className="flex items-center justify-between border-b border-line bg-soft px-4 py-2.5 text-xs font-semibold text-muted">
                <span>Mock interview · Motivation</span>
                <span>Question 2 of 5</span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-[17px] font-bold leading-snug">Tell us about a time you worked in a team.</p>
                <p className="rounded-md border border-line bg-soft p-3 text-sm leading-relaxed">
                  In Year 11 I led a four-person robotics group. We were behind on the build, so I split the jobs by who was strongest at each, and we finished two
                  days early.
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
        </section>

        <FirmMarquee firms={bannerFirms()} />

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

        {/* How it works */}
        <section className="band border-y border-line">
          <div className="mx-auto max-w-6xl space-y-8 px-4 py-14">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <ol className="grid gap-5 md:grid-cols-3">
              {STEPS.map(([n, title, body, href]) => (
                <li key={n}>
                  <Link href={href} className="card card-hover flex h-full flex-col gap-2 p-6">
                    <span className="text-sm font-bold text-brand-700">Step {n}</span>
                    <span className="text-lg font-bold">{title}</span>
                    <span className="text-sm leading-relaxed text-muted">{body}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What you get */}
        <section className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">What you get</h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {OUTCOMES.map((o) => (
              <li key={o.title}>
                <Link href={o.href} className="card card-hover flex h-full flex-col gap-2 p-6">
                  <span className="text-lg font-bold">{o.title}</span>
                  <span className="text-sm leading-relaxed text-muted">{o.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Depth */}
        <section className="border-y border-line bg-white" aria-label="What is inside">
          <dl className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {depth.map(([n, label, href]) => (
              <div key={label} className="space-y-1">
                <dt className="text-4xl font-bold tracking-tight text-brand-700">{n}</dt>
                <dd>
                  <Link href={href} className="text-sm text-muted underline-offset-4 hover:underline">
                    {label}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Plans */}
        <section className="mx-auto max-w-6xl space-y-6 px-4 py-16" aria-labelledby="plans">
          <h2 id="plans" className="text-3xl font-bold tracking-tight">Free to start. Pro if you want more.</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="card space-y-2 p-6">
              <h3 className="text-lg font-bold">No account</h3>
              <p className="text-sm text-muted">Browse the opportunities tracker, every firm guide and the advice guides.</p>
            </div>
            <div className="card space-y-2 border-brand-600 p-6">
              <h3 className="text-lg font-bold">Free account</h3>
              <p className="text-sm text-muted">
                Everything above, plus your own tracker, {FREE_PRACTICE_PER_WEEK} practice tests a week and {FREE_REVIEWS} CV and statement reviews a week (CV, cover letter, statement), with your scores kept for you. No card.
              </p>
            </div>
            <div className="card space-y-2 p-6">
              <h3 className="text-lg font-bold">Pro: {PRO_PLAN.price}</h3>
              <p className="text-sm text-muted">Unlimited practice tests, AI mock interviews and firm mock processes, and much higher written-feedback limits. Cancel any time.</p>
              <Link href="/pricing" className="btn btn-secondary mt-2">
                See plans
              </Link>
            </div>
          </div>
        </section>

        {/* Quick answers (plain content, no FAQ markup) */}
        <section className="mx-auto max-w-6xl space-y-4 px-4 pb-16" aria-labelledby="quick">
          <h2 id="quick" className="text-3xl font-bold tracking-tight">Quick answers</h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            {ANSWERS.map(([q, a]) => (
              <div key={q} className="space-y-1">
                <dt className="font-semibold">{q}</dt>
                <dd className="text-sm text-muted">{a}</dd>
              </div>
            ))}
          </dl>
          <Link href="/faq" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
            More questions
          </Link>
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
