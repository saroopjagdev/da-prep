import { askJson } from "@/lib/ai";
import { countWords } from "@/lib/application-questions";
import { firmBriefing } from "@/lib/firms/context";
import { mockReview } from "@/lib/mocks";
import { reviewInput, reviewOutput, reviewSystem, reviewUser } from "@/lib/writing";
import { guardAi } from "@/lib/server/guard";
import { screenText } from "@/lib/server/safety";
import { consumeReview } from "@/lib/server/usage";

export const maxDuration = 120;

export async function POST(req: Request) {
  const gate = await guardAi(req, "review", 6, 40);
  if (!gate.ok) return gate.response;
  const parsed = reviewInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  const { kind, text, jobAd, firm, programme, question, wordLimit } = parsed.data;
  const profile = firmBriefing(firm, programme, "motivation");
  const wordCount = countWords(text);
  const blocked = await screenText(text, jobAd, question);
  if (blocked) return blocked;
  // Free accounts get a couple of reviews a week; Pro has fair-use limits only. Counted after the safety check so blocked text is free.
  const usage = await consumeReview(req);
  if (!usage.ok) return Response.json({ error: usage.error }, { status: usage.status });
  try {
    const out = await askJson({
      system: reviewSystem(kind, { hasProfile: Boolean(profile), question, wordLimit, wordCount }),
      user: reviewUser(text, jobAd, profile, question),
      schema: reviewOutput,
      tier: "smart",
      maxTokens: 6000,
      mock: mockReview,
    });
    return Response.json({ ...out, wordCount, wordLimit: wordLimit ?? null });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not review your text." }, { status: 500 });
  }
}
