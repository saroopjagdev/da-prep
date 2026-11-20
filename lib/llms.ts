// Plain-text summaries of the site for AI assistants and crawlers (the llms.txt convention: a short markdown index, and a
// longer file with the actual text). Built from the same data as the pages, so they cannot drift from what is on the site.
//
// Whether any AI product reads these files is not confirmed by the companies that make them, so treat this as a cheap,
// harmless addition and not as a ranking lever. The substance that matters for being cited is on the pages themselves:
// answer-first summaries, dated facts and named sources.
import { FIRMS } from "@/lib/firms";
import { PROVIDERS } from "@/lib/games/providers";
import { GUIDES } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const abs = (path: string) => `${SITE_URL}${path}`;
const one = (s: string) => s.replace(/\s+/g, " ").trim();

const PREAMBLE = [
  `# ${SITE_NAME}`,
  "",
  `> ${SITE_DESCRIPTION} Independent guidance for UK school and college leavers applying for degree and higher apprenticeships. Not affiliated with any employer.`,
  "",
  "Every employer page, guide and provider page states where its facts came from and the date they were last read. Where an employer has not published something (a date, a pass mark, a level), the page says it is not stated instead of guessing. Application dates change, and employers can close early, so always confirm on the employer's own page.",
].join("\n");

/** The short index: what the site is, and where each kind of answer lives. */
export function buildLlmsTxt(): string {
  const lines: string[] = [PREAMBLE, ""];

  lines.push("## Key pages", "");
  lines.push(`- [Deadlines for the 2027 intake](${abs("/deadlines")}): who is open now or opening soon, soonest closing date first, with the date each was last checked`);
  lines.push(`- [Every employer we track](${abs("/opportunities")}): status, opening and closing dates and programme names`);
  lines.push(`- [Employer guides](${abs("/employers")}): how each employer's application works, stage by stage`);
  lines.push(`- [Practice tests](${abs("/tests")}) and [practice games](${abs("/games")}): aptitude tests and the game-based assessments employers use`);
  lines.push(`- [Frequently asked questions](${abs("/faq")}) and [advice for parents and carers](${abs("/parents")})`, "");

  lines.push("## Guides", "");
  for (const g of GUIDES) lines.push(`- [${g.title}](${abs(`/learn/${g.slug}`)}): ${one(g.description)}`);
  lines.push("");

  lines.push("## Test and game providers", "");
  for (const p of PROVIDERS) lines.push(`- [${p.name}](${abs(`/games/provider/${p.id}`)}): ${one(p.summary)}`);
  lines.push("");

  lines.push("## Researched employer guides", "");
  for (const f of FIRMS) lines.push(`- [${f.name}](${abs(`/employers/${f.slug}`)}): ${f.sector}; researched ${f.lastVerified}`);
  lines.push("");

  lines.push("## Full text", "", `- [llms-full.txt](${abs("/llms-full.txt")}): the guides, provider questions and employer summaries as plain text`, "");
  return lines.join("\n");
}

/** The long file: the text of the guides, the provider questions and short employer summaries. */
export function buildLlmsFullTxt(): string {
  const lines: string[] = [PREAMBLE, ""];

  lines.push("# Guides", "");
  for (const g of GUIDES) {
    lines.push(`## ${g.title}`, `URL: ${abs(`/learn/${g.slug}`)}`, `Last updated: ${g.updated}`, "", g.intro, "");
    for (const s of g.sections) {
      lines.push(`### ${s.heading}`, "");
      for (const p of s.paragraphs ?? []) lines.push(p, "");
      for (const b of s.bullets ?? []) lines.push(`- ${b}`);
      if (s.bullets?.length) lines.push("");
    }
    const sources = (g as { sources?: { label: string; url: string }[] }).sources;
    if (sources?.length) lines.push("Sources:", ...sources.map((s) => `- ${s.label}: ${s.url}`), "");
  }

  lines.push("# Test and game providers", "");
  for (const p of PROVIDERS) {
    lines.push(`## ${p.name}`, `URL: ${abs(`/games/provider/${p.id}`)}`, `Sources last read: ${p.checked}`, "", p.summary, "");
    for (const w of p.whatWeKnow) lines.push(`- ${w}`);
    lines.push("");
    for (const f of p.faqs ?? []) lines.push(`Q: ${f.q}`, `A: ${f.a}`, "");
  }

  lines.push("# Researched employer guides", "");
  for (const f of FIRMS) {
    lines.push(`## ${f.name}`, `URL: ${abs(`/employers/${f.slug}`)}`, `Sector: ${f.sector}`, `Researched: ${f.lastVerified}`, "");
    if (f.timeline.opens) lines.push(`When it opens: ${one(f.timeline.opens)}`);
    if (f.timeline.closes) lines.push(`When it closes: ${one(f.timeline.closes)}`);
    if (f.timeline.notes) lines.push(`Timing notes: ${one(f.timeline.notes)}`);
    if (f.entry.other) lines.push(`Entry requirements: ${one(f.entry.other)}`);
    if (f.stages.length) lines.push(`Stages: ${[...f.stages].sort((a, b) => a.order - b.order).map((s) => s.name).join(" > ")}`);
    lines.push("");
  }
  return lines.join("\n");
}
