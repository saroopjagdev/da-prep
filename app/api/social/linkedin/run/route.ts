import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/server/guard";
import { runLinkedIn } from "@/lib/server/linkedin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The daily LinkedIn job (see lib/server/linkedin.ts), called by the scheduled job in vercel.json or with CRON_SECRET as a
 * bearer token. `?task=post` or `?task=replies` runs half of it, so replies can be checked more often than once a day.
 * It does nothing until LINKEDIN_ENABLED is "true" and only reaches LinkedIn when LINKEDIN_LIVE is "true". Running it
 * twice is safe: the day's post is reserved before it is sent, and each comment is answered once.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const bearer = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const cron = (req.headers.get("user-agent") ?? "").startsWith("vercel-cron");
  if (!bearer && !cron) return new Response(null, { status: 404 });
  if (!(await rateLimit(`linkedinrun:${clientIp(req)}`, 10, 3_600_000))) return Response.json({ error: "Too many requests." }, { status: 429 });

  const t = new URL(req.url).searchParams.get("task");
  const result = await runLinkedIn(t === "post" || t === "replies" ? t : "both");
  console.log("linkedin", JSON.stringify({ ...result, post: result.post && { ...result.post, draft: result.post.draft && { ...result.post.draft, text: undefined } } }));
  return Response.json(result);
}
