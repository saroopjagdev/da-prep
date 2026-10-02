import { askJson } from "@/lib/ai";
import { cvInput, cvOutput, cvSystem, cvUser, mockCv } from "@/lib/cv";
import { firmBriefing } from "@/lib/firms/context";
import { redactForCv } from "@/lib/redact";
import { guardAi } from "@/lib/server/guard";
import { screenText } from "@/lib/server/safety";
import { consumeReview } from "@/lib/server/usage";

export const maxDuration = 120;

export async function POST(req: Request) {
  const gate = await guardAi(req, "cv", 6, 40);
  if (!gate.ok) return gate.response;
  const parsed = cvInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please paste your CV (at least a few lines)." }, { status: 400 });
  const { text, jobAd, firm, programme } = parsed.data;

  // A CV is full of personal data and many users are under 18: strip contact details before anything else sees it.
  const cv = redactForCv(text);
  const advert = jobAd ? redactForCv(jobAd) : undefined;
  const profile = firmBriefing(firm, programme, "motivation");
  if (firm && !profile) return Response.json({ error: "Unknown employer" }, { status: 400 });

  const blocked = await screenText(cv.text, advert?.text);
  if (blocked) return blocked;
  // A CV review counts as one of the free weekly reviews. Counted after the safety check so blocked text is free.
  const usage = await consumeReview(req);
  if (!usage.ok) return Response.json({ error: usage.error }, { status: usage.status });

  try {
    const out = await askJson({
      system: cvSystem({ hasProfile: Boolean(profile), hasAdvert: Boolean(advert?.text.trim()) }),
      user: cvUser(cv.text, advert?.text, profile),
      schema: cvOutput,
      tier: "smart",
      maxTokens: 7000,
      mock: mockCv,
    });
    return Response.json({ ...out, removed: cv.removed + (advert?.removed ?? 0) });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not review your CV." }, { status: 500 });
  }
}
