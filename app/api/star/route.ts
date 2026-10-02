import { askJson } from "@/lib/ai";
import { mockStar } from "@/lib/mocks";
import { starInput, starOutput, starSystem, starUser } from "@/lib/writing";
import { guardAi } from "@/lib/server/guard";
import { screenText } from "@/lib/server/safety";

export const maxDuration = 60;

export async function POST(req: Request) {
  const gate = await guardAi(req, "star", 10, 60);
  if (!gate.ok) return gate.response;
  const parsed = starInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  const blocked = await screenText(parsed.data.notes);
  if (blocked) return blocked;
  try {
    const out = await askJson({
      system: starSystem(),
      user: starUser(parsed.data.notes, parsed.data.competency),
      schema: starOutput,
      tier: "fast",
      maxTokens: 4000,
      mock: mockStar,
    });
    return Response.json(out);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not build your STAR answer." }, { status: 500 });
  }
}
