import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { pct, recruitmentStats } from "@/lib/recruitment-stats";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

const s = recruitmentStats();

export const metadata = pageMeta({
  title: `How degree apprenticeship employers recruit: what we found across ${s.employers} employers`,
  description: `How many degree apprenticeship employers use online tests, video interviews and assessment centres, how many stages a process has, which test providers they name, and how many offer degree level at all. Counts from our own research of ${s.employers} employers.`,
  path: "/how-employers-recruit",
});

const dateOf = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function HowEmployersRecruit() {
  const noDegree = s.short.notDegree;
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "How employers recruit", path: "/how-employers-recruit" },
          ]),
          articleLd({
            headline: `How degree apprenticeship employers recruit across ${s.employers} employers`,
            description: "Counts from Level6's own research of employer recruitment processes.",
            path: "/how-employers-recruit",
            dateModified: s.latest,
          }),
        ]}
      />
      <div className="space-y-3">
        <h1 className="page-title">How degree apprenticeship employers recruit</h1>
        <p className="lead">
          Across the {s.employers} employers we have researched in full, {pct(s.onlineAssessment, s.employers)}% record an online assessment, {pct(s.videoInterview, s.employers)}% a video interview and {pct(s.assessmentCentre, s.employers)}% an assessment
          centre, and a typical process has {s.stagesMedian} stages. These are counts from our own sourced research, last updated {dateOf(s.latest)}.
        </p>
      </div>

      <section className="space-y-3" aria-labelledby="stages">
        <h2 id="stages" className="text-lg font-semibold">
          What the processes include
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <strong>
              {s.onlineAssessment} of {s.employers}
            </strong>{" "}
            ({pct(s.onlineAssessment, s.employers)}%) have an online assessment recorded: reasoning tests, situational judgement, games or a behavioural questionnaire.
          </li>
          <li>
            <strong>
              {s.videoInterview} of {s.employers}
            </strong>{" "}
            ({pct(s.videoInterview, s.employers)}%) record a video interview, usually one-way, where you answer on-screen questions to a camera.
          </li>
          <li>
            <strong>
              {s.assessmentCentre} of {s.employers}
            </strong>{" "}
            ({pct(s.assessmentCentre, s.employers)}%) record an assessment centre or final-stage event, in person or online.
          </li>
          <li>
            The median process has <strong>{s.stagesMedian} stages</strong>, ranging from {s.stagesMin} to {s.stagesMax}.
          </li>
          <li>
            <strong>
              {s.rolling} of {s.employers}
            </strong>{" "}
            ({pct(s.rolling, s.employers)}%) review applications as they arrive, so they can close before the stated date.
          </li>
        </ul>
      </section>

      {s.providers.length > 0 && (
        <section className="space-y-3" aria-labelledby="providers">
          <h2 id="providers" className="text-lg font-semibold">
            Which test providers employers name
          </h2>
          <p className="text-sm text-muted">The number of the {s.employers} researched employers whose guide names each provider for its online assessment. Many employers do not name their provider, so these are minimum counts.</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {s.providers.map((p) => (
              <li key={p.name} className="card flex justify-between p-3">
                <span className="font-semibold">{p.name}</span>
                <span className="text-muted">{p.firms}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link href="/games" className="underline">
              Practice games and providers
            </Link>
            {" · "}
            <Link href="/tests" className="underline">
              Practice tests
            </Link>
          </p>
        </section>
      )}

      <section className="space-y-3" aria-labelledby="level">
        <h2 id="level" className="text-lg font-semibold">
          Is it a degree apprenticeship at all?
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <strong>
              {s.degreeLevel} of {s.employers}
            </strong>{" "}
            researched employers list at least one degree-level programme.
          </li>
          <li>
            We also read the programme pages of {s.short.total} more employers, one at a time. Of those, {s.short.degree} offer degree level, {s.short.mixed} offer degree and other levels, <strong>{noDegree} offer none we could find</strong>, and {s.short.unclear}{" "}
            do not state a level on the page we read.
          </li>
          <li>
            So when you search &quot;[employer] degree apprenticeship&quot;, check the level: some of the best-known school leaver programmes are Level 3 or Level 4, not degrees. Our{" "}
            <Link href="/learn/apprenticeship-levels-explained" className="underline">
              levels guide
            </Link>{" "}
            explains the difference.
          </li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="questions">
        <h2 id="questions" className="text-lg font-semibold">
          What employers ask
        </h2>
        <p className="text-sm">
          We hold {s.reportedQuestions} interview questions reported by candidates across {s.employersWithQuestions} employers, each with its source.{" "}
          <Link href="/interview-questions" className="underline">
            Read them by type and employer
          </Link>
          .
        </p>
      </section>

      <section className="card space-y-2 p-4 text-sm" aria-labelledby="method">
        <h2 id="method" className="font-semibold">
          How we counted, and what this does not show
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Each count is how many researched employer guides record that stage or feature. A guide that does not record a stage may still have one: the research reads public employer pages and candidate reports, and some processes are not published.</li>
          <li>The {s.employers} researched employers are mostly large banks, professional services, engineering and technology firms, not every employer, so the figures describe those, not apprenticeships in general.</li>
          <li>The closed Civil Service Fast Track is left out because it is a historic process.</li>
          <li>The numbers are computed from our sourced employer guides every time the page is built, so they change when the research does.</li>
        </ul>
      </section>

      <p className="text-xs text-muted">Independent research by Level6, not affiliated with any employer named.</p>
    </div>
  );
}
