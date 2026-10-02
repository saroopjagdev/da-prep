import { askJson } from "@/lib/ai";
import {
  fallbackQuestion,
  isDuplicateQuestion,
  nextInput,
  nextOutput,
  nextQuestionSystem,
  nextQuestionUser,
} from "@/lib/interview";
import { firmBriefing } from "@/lib/firms/context";
import { consumeInterview } from "@/lib/server/usage";
import { issuePass, requirePass } from "@/lib/server/pass";
import { guardAi } from "@/lib/server/guard";
import { screenText } from "@/lib/server/safety";

export const maxDuration = 60;

export async function POST(req: Request) {
  const gate = await guardAi(req, "next", 20, 120);
  if (!gate.ok) return gate.response;
  const parsed = nextInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const { jobAd, cv, stage, sector, history, firm, programme } = parsed.data;
  const profile = firmBriefing(firm, programme, stage);
  if (firm && !profile && jobAd.trim().length < 20) return Response.json({ error: "Unknown employer" }, { status: 400 });
  // Later questions need the pass issued with the first one, so the allowance can't be skipped by faking history.
  if (gate.userId && history.length > 0) {
    const denied = await requirePass(req, gate.userId, ["interview"]);
    if (denied) return denied;
  }
  const blocked = await screenText(jobAd, cv, ...history.map((t) => t.answer));
  if (blocked) return blocked;
  // The first question of an interview counts against the free allowance and starts a practice pass.
  let pass: ReturnType<typeof issuePass> = null;
  if (history.length === 0) {
    const usage = await consumeInterview(req);
    if (!usage.ok) return Response.json({ error: usage.error }, { status: usage.status });
    if (gate.userId) pass = issuePass(gate.userId, "interview");
  }
  try {
    const index = history.length;
    const asked = history.map((t) => t.question);
    const user = nextQuestionUser(jobAd, cv, history, profile);

    // Each question has its own theme. If the model still repeats an earlier question, retry once with a nudge,
    // then fall back to a built-in question so the candidate never sees the same question twice.
    let question = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      const out = await askJson({
        system: nextQuestionSystem(stage, sector, index, attempt > 0, Boolean(profile)),
        user,
        schema: nextOutput,
        tier: "fast",
        maxTokens: 2000,
        mock: () => ({ question: fallbackQuestion(stage, index, asked) }),
      });
      if (!isDuplicateQuestion(out.question, asked)) {
        question = out.question;
        break;
      }
    }
    if (!question) question = fallbackQuestion(stage, index, asked);
    return Response.json(pass ? { question, ...pass } : { question });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not generate a question." }, { status: 500 });
  }
}
