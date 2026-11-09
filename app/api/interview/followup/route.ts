import { askJson } from "@/lib/ai";
import { fallbackFollowUp, followupInput, followupOutput, followupSystem, followupUser } from "@/lib/interview";
import { firmBriefing } from "@/lib/firms/context";
import { guardAi } from "@/lib/server/guard";
import { requirePass } from "@/lib/server/pass";
import { screenText } from "@/lib/server/safety";

export const maxDuration = 60;

/** One follow-up question after an answer. It rides on the interview's own pass, so it cannot be used to reach the AI without an interview. */
export async function POST(req: Request) {
  const gate = await guardAi(req, "followup", 20, 120);
  if (!gate.ok) return gate.response;
  const parsed = followupInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  const { jobAd, question, answer, firm, programme, stage } = parsed.data;
  const profile = firmBriefing(firm, programme, stage);
  if (firm && !profile && jobAd.trim().length < 20) return Response.json({ error: "Unknown employer" }, { status: 400 });
  if (gate.userId) {
    const denied = await requirePass(req, gate.userId, ["interview"]);
    if (denied) return denied;
  }
  const blocked = await screenText(jobAd, question, answer);
  if (blocked) return blocked;
  try {
    const out = await askJson({
      system: followupSystem(Boolean(profile)),
      user: followupUser(jobAd, question, answer, profile),
      schema: followupOutput,
      tier: "fast",
      maxTokens: 1000,
      mock: () => ({ question: fallbackFollowUp(answer) }),
    });
    const text = out.question.trim().slice(0, 300);
    return Response.json({ question: text || fallbackFollowUp(answer) });
  } catch (e) {
    console.error(e);
    // A missing follow-up should never block the interview: fall back to a generic probe.
    return Response.json({ question: fallbackFollowUp(answer) });
  }
}
