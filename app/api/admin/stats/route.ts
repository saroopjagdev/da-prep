import { adminFromRequest, isAdminEmail } from "@/lib/server/admin-access";
import { admin } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

type FunnelRow = { day: string; event: string; source: string; campaign: string; n: number };
type Profile = { id: string; plan: string; stripe_customer_id: string | null; created_at: string };

const PAGE = 1000;

/** Every row of a query, a page at a time (PostgREST caps one response at 1000 rows). */
async function all<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if ((data?.length ?? 0) < PAGE) return out;
  }
}

/**
 * Everything the admin page shows, in one response: the anonymous funnel counts (by day, source and campaign), signups,
 * and the paying users. Admins only; anyone else gets a 404 so the page's existence is not advertised.
 */
export async function GET(req: Request) {
  if (!(await adminFromRequest(req))) return new Response(null, { status: 404 });
  const db = admin();
  if (!db) return Response.json({ error: "Supabase is not configured." }, { status: 503 });

  const days = Math.min(Math.max(Number(new URL(req.url).searchParams.get("days")) || 30, 1), 365);
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  try {
    // The campaign column arrives with its migration; until then read the table without it.
    const funnel = await all<FunnelRow>((from, to) =>
      db.from("funnel_daily").select("day,event,source,campaign,n").gte("day", since).order("day").range(from, to),
    ).catch(() =>
      all<Omit<FunnelRow, "campaign">>((from, to) => db.from("funnel_daily").select("day,event,source,n").gte("day", since).order("day").range(from, to)).then((rows) =>
        rows.map((r) => ({ ...r, campaign: "" })),
      ),
    );

    const profiles = await all<Profile>((from, to) => db.from("profiles").select("id,plan,stripe_customer_id,created_at").order("created_at").range(from, to));
    // A paying user has a Stripe customer id. The admins' own accounts (test purchases, plans set by hand) are left out, and
    // so is a Pro plan with no Stripe id, so "paying now" can never be more than "ever paid".
    const withStripe = profiles.filter((p) => p.stripe_customer_id);
    const stripeEmails = await Promise.all(withStripe.map((p) => db.auth.admin.getUserById(p.id).then((r) => r.data.user?.email ?? null, () => null)));
    const paid = withStripe.map((p, i) => ({ p, email: stripeEmails[i] })).filter(({ email }) => !isAdminEmail(email));

    const signups: Record<string, number> = {};
    for (const p of profiles) {
      const d = p.created_at.slice(0, 10);
      if (d >= since) signups[d] = (signups[d] ?? 0) + 1;
    }

    return Response.json({
      days,
      funnel,
      signups,
      totals: {
        accounts: profiles.length,
        pro: paid.filter(({ p }) => p.plan === "pro").length,
        everPaid: paid.length,
      },
      paying: paid
        .map(({ p, email }) => ({ email, plan: p.plan, joined: p.created_at }))
        .sort((a, b) => (a.plan === b.plan ? b.joined.localeCompare(a.joined) : a.plan === "pro" ? -1 : 1)),
    });
  } catch (e) {
    console.error("admin stats failed", (e as Error).message);
    return Response.json({ error: "Could not load the numbers." }, { status: 500 });
  }
}
