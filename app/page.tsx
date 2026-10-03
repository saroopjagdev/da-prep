import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import Icon from "@/components/Icon";
import ScoreRing from "@/components/ScoreRing";
import ToolkitSection from "@/components/ToolkitSection";
import { PRO_PLAN } from "@/lib/plans";
import { QUESTIONS } from "@/lib/questions";
import { SECTORS } from "@/lib/sectors";

const stages = [
  ["Application", "An online form, often with a CV or short answers"],
  ["Online tests", "Situational judgement and reasoning tests"],
  ["Video interview", "Recorded answers, with limits that vary by employer"],
  ["Assessment centre", "Group exercise, role-play and a further interview"],
  ["Offer", "Usually conditional on your final grades"],
];

const resources = [
  { tag: "Start here", title: "How degree apprenticeship applications work", href: "/guide" },
  { tag: "Tips", title: "Tips for tests, video interviews and assessment centres", href: "/tips" },
  { tag: "Planning", title: "A suggested timeline from Year 12 to your offer", href: "/timeline" },
  { tag: "Sectors", title: "One process, many sectors: what changes where", href: "/sectors" },
  { tag: "Employers", title: "A starting list of employers that recruit", href: "/employers" },
  { tag: "Finance", title: "Finance degree apprenticeships: who, when and myths checked", href: "/sectors/finance" },
  { tag: "FAQ", title: "Pay, fees, grades and what happens if you're rejected", href: "/faq" },
];

export default function Home() {
  const stats = [
    [String(QUESTIONS.length), "original practice questions"],
    [String(SECTORS.length), "sector guides"],
    ["2", "interview formats: text or timed video"],
    ["Free", "to start: tests, tracker and guides need no account"],
  ];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        <div className="space-y-6">
          <p className="text-sm font-bold text-brand-700">For UK degree apprenticeship applicants</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Prepare for every stage of your degree apprenticeship application
          </h1>
          <p className="lead max-w-lg text-lg">
            Applications often run like graduate recruitment: online tests, a recorded interview, an assessment centre.
            Rehearse each one, with questions built from the real job advert in front of you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/interview" className="btn btn-primary !px-7 !py-3">
              Start a mock interview
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="#toolkit" className="btn btn-secondary !px-7 !py-3">
              Explore the toolkit
            </Link>
          </div>
          <form action="/employers" method="get" role="search" className="flex max-w-lg gap-2">
            <input
              name="q"
              className="input w-full text-sm"
              placeholder="Search employers, e.g. Barclays or Airbus"
              aria-label="Search employers"
              maxLength={80}
            />
            <button type="submit" className="btn btn-secondary whitespace-nowrap">
              Search
            </button>
          </form>
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
                In Year 11 I led a four-person robotics group. We were behind on the build, so I split the jobs by who
                was strongest at each, and we finished two days early.
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

      {/* Returning-user progress (renders nothing until local data loads) */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <Dashboard />
      </div>

      {/* Timing */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-6 rounded-2xl border border-line bg-white p-6 lg:grid-cols-[1fr_1.4fr] lg:p-8">
          <div className="space-y-2">
            <p className="text-sm font-bold text-brand-700">Timing matters</p>
            <h2 className="text-2xl font-bold tracking-tight">Many employers open early and fill fast</h2>
            <p className="text-sm text-muted">
              Large employers often open in the autumn and close once they have enough applicants. Check each employer's dates,
              then rehearse their real process: tests, a recorded interview and an assessment centre.
            </p>
            <Link href="/employers" className="btn btn-primary mt-2">
              Browse employers
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["/sectors/finance/calendar", "Finance season calendar", "When banks and accountancy firms opened and closed last cycle"],
              ["/mock", "Firm mock processes", "Run an employer's stages in their real order"],
              ["/interview", "Firm-specific interviews", "Questions built around the employer and role"],
              ["/sectors/finance/myths", "Finance myths, checked", "Grades, fees, pay and AI rules"],
            ].map(([href, title, body]) => (
              <li key={href}>
                <Link href={href} className="block h-full rounded-lg border border-line p-4 hover:border-brand-500">
                  <span className="font-semibold">{title}</span>
                  <span className="block text-sm text-muted">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The process */}
      <section className="band border-y border-line">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-14">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">The process you are preparing for</h2>
            <p className="lead">
              There is no single national deadline or central system. You usually apply to each employer directly, and each one runs
              some or all of these stages. A few, such as PwC&apos;s Flying Start, also involve a UCAS application.
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {stages.map(([name, body], i) => (
              <li key={name} className="space-y-2 bg-white p-5">
                <span className="text-sm font-bold text-brand-700">0{i + 1}</span>
                <h3 className="font-bold">{name}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Toolkit */}
      <section id="toolkit" className="mx-auto max-w-6xl scroll-mt-20 space-y-8 px-4 py-16">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need in one toolkit</h2>
          <p className="lead">Practise, track your applications and learn the process, all in one place.</p>
        </div>

        <ToolkitSection
          title="Interview prep"
          fact="Text or timed video, marked with STAR feedback"
          items={[
            {
              href: "/interview",
              title: "Mock interview",
              body: "Paste the advert you are applying for and pick your sector. Get questions built around the role, then a marked answer sheet with a stronger version of each answer.",
            },
            {
              href: "/practice",
              title: "Practice tests",
              body: "Situational judgement, numerical, verbal and logical reasoning, each with a worked explanation and a review of the ones you missed.",
            },
            {
              href: "/review",
              title: "Statement review",
              body: "Write your own personal statement or application answer, then get specific feedback on evidence, tailoring and structure.",
            },
          ]}
        />

        <ToolkitSection
          title="Your applications"
          tone="navy"
          fact="Saved on your device, sync optional"
          items={[
            {
              href: "/tracker",
              title: "Application tracker",
              body: "Keep every employer, stage and closing date in one list, with warnings for deadlines coming up and a calendar export.",
            },
            {
              href: "/stories",
              title: "Stories bank",
              body: "Write your STAR examples once, tag them by skill and reuse them across applications. An AI helper can structure rough notes for you.",
            },
            {
              href: "/progress",
              title: "Progress",
              body: "See your score trend, which part of STAR you most often miss, and every past interview with full feedback.",
            },
          ]}
        />

        <ToolkitSection
          title="Sector guides"
          fact={`${SECTORS.length} sector groups`}
          items={[
            {
              href: "/sectors",
              title: "What is the same, what differs",
              body: "Most of the process is shared by every degree apprenticeship. See what changes for each sector, so you prepare for the right things.",
            },
            {
              href: "/employers",
              title: "Employers",
              body: "A starting list of employers that have offered degree apprenticeships, filterable by sector, with links to their own pages.",
            },
            {
              href: "/timeline",
              title: "Timeline",
              body: "What to do and when, from Year 12 to your offer. Some employers close as soon as they have enough applicants.",
            },
          ]}
          footer={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">Jump to a sector:</span>
              {SECTORS.map((s) => (
                <Link key={s.id} href={`/sectors/${s.id}`} className="chip">
                  {s.name}
                </Link>
              ))}
            </div>
          }
        />
      </section>

      {/* Facts */}
      <section className="border-y border-line bg-white">
        <dl className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([n, label]) => (
            <div key={label} className="space-y-1">
              <dt className="text-4xl font-bold tracking-tight text-brand-700">{n}</dt>
              <dd className="text-sm text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Free resources */}
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">New to degree apprenticeships?</h2>
            <p className="lead">Start with these free guides.</p>
          </div>
          <Link href="/learn" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
            View all resources
          </Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="card card-hover flex h-full flex-col gap-3 p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">{r.tag}</span>
                <span className="text-lg font-bold leading-snug tracking-tight">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16" aria-labelledby="plans">
        <h2 id="plans" className="text-3xl font-bold tracking-tight">Free to start. Pro if you want more.</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="card space-y-2 p-6">
            <h3 className="text-lg font-bold">Free</h3>
            <p className="text-sm text-muted">Practice tests, assessment replicas, the tracker, stories bank, all guides and a couple of AI mock interviews and reviews each week.</p>
          </div>
          <div className="card space-y-2 p-6">
            <h3 className="text-lg font-bold">Pro: {PRO_PLAN.price}</h3>
            <p className="text-sm text-muted">Higher limits on AI mock interviews and written feedback. Cancel any time.</p>
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
          {[
            ["Is a degree apprenticeship really a degree?", "Most lead to a full degree (BA, BSc or BEng) while you work and are paid. Some, such as NatWest's Level 6 route, give a degree-level qualification without a degree, so check each programme."],
            ["Do I pay tuition fees?", "No. Your employer and the government cover training costs, and you earn a salary."],
            ["When should I apply?", "Many large employers open in autumn and some close once they have enough applicants. Check each employer's page."],
            ["Are these the real tests?", "No. They are original practice items in the same format and timing. We say where a detail is approximated."],
          ].map(([q, a]) => (
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
          <div className="max-w-xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Run your first mock interview today</h2>
            <p className="text-white/75">It takes about ten minutes. You sign in so the AI feedback stays within fair-use limits.</p>
          </div>
          <Link href="/interview" className="btn btn-light !px-8 !py-3">
            Start a mock interview
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
