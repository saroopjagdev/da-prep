import { askJson } from "@/lib/ai";
import { scoreInput, scoreOutput, scoreSystem, scoreUser } from "@/lib/interview";
import { firmBriefing } from "@/lib/firms/context";
import { mockScore } from "@/lib/mocks";
import { guardAi } from "@/lib/server/guard";
import { requirePass } from "@/lib/server/pass";
import { screenText } from "@/lib/server/safety";

export const maxDuration = 120;

export async function POST(req: Request) {
  const gate = await guardAi(req, "score", 6, 25);
  if (!gate.ok) return gate.response;
  const parsed = scoreInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  if (gate.userId) {
    const denied = await requirePass(req, gate.userId, ["interview"]);
    if (denied) return denied;
  }
  const { jobAd, stage, turns, firm, programme } = parsed.data;
  const profile = firmBriefing(firm, programme, stage);
  if (firm && !profile && jobAd.trim().length < 20) return Response.json({ error: "Unknown employer" }, { status: 400 });
  const blocked = await screenText(jobAd, ...turns.map((t) => t.answer));
  if (blocked) return blocked;
  try {
    const out = await askJson({
      system: scoreSystem(),
      user: scoreUser(jobAd, turns, profile),
      schema: scoreOutput,
      tier: "smart",
      maxTokens: 10000,
      mock: () => mockScore(turns),
    });
    if (out.turns.length !== turns.length) throw new Error("Turn count mismatch");
    return Response.json({ ...out, nextSteps: out.nextSteps.slice(0, 3) });
  } catch (e) {
    console.error(e, stage);
    return Response.json({ error: "Could not score the interview." }, { status: 500 });
  }
}
