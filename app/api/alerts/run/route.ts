import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/server/guard";
import { runAlerts } from "@/lib/server/alerts";
import { runNudges } from "@/lib/server/nudges";
import { expirePasses } from "@/lib/server/passes";

export const dynamic = "force-dynamic";
// A run can take a while when many emails are due.
export const maxDuration = 60;

/**
 * The daily deadline-email job, called by the scheduled job in vercel.json (which identifies itself as vercel-cron) or
 * with CRON_SECRET as a bearer token. The user-agent can be faked, so this does not rely on it for safety: a run only
 * sends news that has not already been sent, so calling it again does nothing, and it is rate limited.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const bearer = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const cron = (req.headers.get("user-agent") ?? "").startsWith("vercel-cron");
  if (!bearer && !cron) return new Response(null, { status: 404 });
  if (!(await rateLimit(`alertrun:${clientIp(req)}`, 5, 3_600_000))) return Response.json({ error: "Too many requests." }, { status: 429 });

  const result = await runAlerts();
  console.log("deadline alerts", JSON.stringify(result));
  // The first-steps email rides on the same daily job; it does nothing unless NUDGES_ENABLED is "true".
  const nudges = await runNudges();
  console.log("first-steps emails", JSON.stringify(nudges));
  // Season Passes that have run out go back to free (monthly subscribers have no end date and are not touched).
  const passes = await expirePasses();
  console.log("season passes", JSON.stringify(passes));
  return Response.json({ ...result, nudges, passes });
}
