import { beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;
const PK: Record<string, string[]> = { alert_subscriptions: ["user_id", "employer_key"], alert_prefs: ["user_id"], alert_sent: ["user_id", "event_key"] };
const db: Record<string, Row[]> = {};
const users: Record<string, { email?: string; email_confirmed_at?: string | null }> = {};
let signedIn: { id: string } | null = null;

/** A small in-memory stand-in for the parts of the Supabase client these routes use. */
function from(table: string) {
  const rows = () => (db[table] ??= []);
  return {
    select(_cols?: string, _opts?: unknown) {
      const filters: [string, unknown][] = [];
      const match = () => rows().filter((r) => filters.every(([c, v]) => r[c] === v));
      const api: Record<string, unknown> = {
        eq(c: string, v: unknown) {
          filters.push([c, v]);
          return api;
        },
        range: async () => ({ data: match(), error: null }),
        maybeSingle: async () => ({ data: match()[0] ?? null, error: null }),
        then: (res: (v: unknown) => unknown) => res({ data: match(), count: match().length, error: null }),
      };
      return api;
    },
    async upsert(input: Row | Row[], opts: { onConflict?: string; ignoreDuplicates?: boolean } = {}) {
      for (const r of Array.isArray(input) ? input : [input]) {
        const keys = PK[table];
        const at = rows().findIndex((x) => keys.every((k) => x[k] === r[k]));
        if (at === -1) rows().push(table === "alert_prefs" ? { token: "11111111-2222-3333-4444-" + String(rows().length).padStart(12, "0"), ...r } : r);
        else if (!opts.ignoreDuplicates) rows()[at] = { ...rows()[at], ...r };
      }
      return { error: null };
    },
    update(patch: Row) {
      const filters: [string, unknown][] = [];
      const api: Record<string, unknown> = {
        eq(c: string, v: unknown) {
          filters.push([c, v]);
          return api;
        },
        then: (res: (v: unknown) => unknown) => {
          for (const r of rows()) if (filters.every(([c, v]) => r[c] === v)) Object.assign(r, patch);
          return res({ error: null });
        },
      };
      return api;
    },
    delete() {
      const filters: [string, unknown][] = [];
      const api: Record<string, unknown> = {
        eq(c: string, v: unknown) {
          filters.push([c, v]);
          return api;
        },
        then: (res: (v: unknown) => unknown) => {
          db[table] = rows().filter((r) => !filters.every(([c, v]) => r[c] === v));
          return res({ error: null });
        },
      };
      return api;
    },
  };
}

let candidates: { user_id: string; email: string }[] = [];
const rpcCalls: { name: string; args: unknown }[] = [];
vi.mock("@/lib/server/auth", () => ({
  admin: () => ({
    from,
    rpc: async (name: string, args: unknown) => {
      rpcCalls.push({ name, args });
      return { data: candidates, error: null };
    },
    auth: { admin: { getUserById: async (id: string) => ({ data: { user: users[id] ?? null } }) } } }),
  userFromRequest: async () => signedIn,
}));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: async () => true }));
vi.mock("@/lib/server/guard", () => ({ clientIp: () => "1.2.3.4", limitsEnforced: () => true }));

import { GET as listAlerts, POST as setAlert } from "@/app/api/alerts/route";
import { GET as runRoute } from "@/app/api/alerts/run/route";
import { POST as unsubscribe } from "@/app/api/alerts/unsubscribe/route";
import { ALERT_CYCLE, MAX_FOLLOWED, alertKey } from "@/lib/alerts";
import { opportunityRows } from "@/lib/opportunities";
import { runAlerts } from "@/lib/server/alerts";
import { runNudges } from "@/lib/server/nudges";

const open = opportunityRows(new Date()).find((r) => r.status === "open")!;
const key = alertKey(open);
const post = (body: unknown) => setAlert(new Request("http://x/api/alerts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));

beforeEach(() => {
  for (const k of Object.keys(db)) delete db[k];
  for (const k of Object.keys(users)) delete users[k];
  signedIn = { id: "u1" };
  process.env.RESEND_API_KEY = "re_test";
  delete process.env.CRON_SECRET;
});

describe("following employers", () => {
  it("needs a signed-in person", async () => {
    signedIn = null;
    expect((await post({ key, on: true })).status).toBe(401);
    expect((await listAlerts(new Request("http://x/api/alerts"))).status).toBe(401);
  });

  it("follows an employer in the tracker, lists it, and unfollows it", async () => {
    expect((await post({ key, on: true })).status).toBe(200);
    expect(db.alert_subscriptions).toEqual([{ user_id: "u1", employer_key: key, employer_name: open.name }]);
    expect(await (await listAlerts(new Request("http://x/api/alerts"))).json()).toEqual({ keys: [key] });
    expect((await post({ key, on: false })).status).toBe(200);
    expect(db.alert_subscriptions).toEqual([]);
  });

  it("takes the employer's name from the tracker, not from the request", async () => {
    await post({ key, on: true, name: "Injected" });
    expect(db.alert_subscriptions[0].employer_name).toBe(open.name);
  });

  it("does not follow an employer that is not in the tracker, or accept a malformed request", async () => {
    expect((await post({ key: "no-such-employer", on: true })).status).toBe(404);
    expect((await post({ key, on: "yes" })).status).toBe(400);
    expect((await post({})).status).toBe(400);
    expect(db.alert_subscriptions ?? []).toEqual([]);
  });

  it("caps how many employers one person can follow", async () => {
    db.alert_subscriptions = Array.from({ length: MAX_FOLLOWED }, (_, i) => ({ user_id: "u1", employer_key: `e${i}`, employer_name: "x" }));
    expect((await post({ key, on: true })).status).toBe(409);
  });

  it("does not tell someone an employer that is already open has just opened", async () => {
    await post({ key, on: true });
    expect(db.alert_sent).toEqual([{ user_id: "u1", event_key: `${ALERT_CYCLE}:open:${key}` }]);
  });
});

describe("the daily run", () => {
  const send = vi.fn();
  beforeEach(() => {
    send.mockReset().mockResolvedValue(true);
    users.u1 = { email: "a@example.com", email_confirmed_at: "2026-10-01" };
    db.alert_subscriptions = [{ user_id: "u1", employer_key: key, employer_name: open.name }];
  });

  it("emails what is due, with their unsubscribe token, logs it, and sends nothing the second time", async () => {
    expect(await runAlerts(new Date(), send)).toEqual({ due: 1, sent: 1, failed: 0 });
    const [to, email] = send.mock.calls[0];
    expect(to).toBe("a@example.com");
    expect(email.text).toContain(open.name);
    expect(email.text).toContain((db.alert_prefs[0].token as string));
    expect(db.alert_sent.map((s) => s.event_key)).toContain(`${ALERT_CYCLE}:open:${key}`);

    send.mockClear();
    expect(await runAlerts(new Date(), send)).toEqual({ due: 0, sent: 0, failed: 0 });
    expect(send).not.toHaveBeenCalled();
  });

  it("does not log a failed send, so the next run tries again", async () => {
    send.mockResolvedValue(false);
    expect(await runAlerts(new Date(), send)).toEqual({ due: 1, sent: 0, failed: 1 });
    expect(db.alert_sent ?? []).toEqual([]);
    send.mockResolvedValue(true);
    expect((await runAlerts(new Date(), send)).sent).toBe(1);
  });

  it("skips people with no confirmed email", async () => {
    users.u1 = { email: "a@example.com", email_confirmed_at: null };
    expect((await runAlerts(new Date(), send)).sent).toBe(0);
    expect(send).not.toHaveBeenCalled();
  });

  it("does nothing without a Resend key", async () => {
    delete process.env.RESEND_API_KEY;
    expect(await runAlerts(new Date(), send)).toMatchObject({ skipped: expect.stringMatching(/RESEND_API_KEY/), sent: 0 });
  });
});

describe("unsubscribing", () => {
  const call = (t: string) => unsubscribe(new Request(`http://x/api/alerts/unsubscribe?t=${t}`, { method: "POST" }));
  const token = "11111111-2222-3333-4444-555555555555";

  it("stops every alert for the person the token belongs to, and nobody else", async () => {
    db.alert_prefs = [{ user_id: "u1", token }];
    db.alert_subscriptions = [
      { user_id: "u1", employer_key: "a", employer_name: "A" },
      { user_id: "u1", employer_key: "b", employer_name: "B" },
      { user_id: "u2", employer_key: "a", employer_name: "A" },
    ];
    expect((await call(token)).status).toBe(200);
    expect(db.alert_subscriptions).toEqual([{ user_id: "u2", employer_key: "a", employer_name: "A" }]);
  });

  it("refuses a malformed or unknown token", async () => {
    expect((await call("not-a-token")).status).toBe(400);
    expect((await call("99999999-2222-3333-4444-555555555555")).status).toBe(404);
  });
});

describe("the first-steps email", () => {
  const send = vi.fn();
  beforeEach(() => {
    send.mockReset().mockResolvedValue(true);
    rpcCalls.length = 0;
    candidates = [{ user_id: "u1", email: "a@example.com" }];
    delete process.env.NUDGES_ENABLED;
  });

  it("does nothing unless it is switched on", async () => {
    expect(await runNudges(send)).toMatchObject({ skipped: expect.stringMatching(/NUDGES_ENABLED/), sent: 0 });
    expect(send).not.toHaveBeenCalled();
    expect(rpcCalls).toEqual([]);
  });

  it("sends once to each eligible account, with an unsubscribe link, leaving the admins out, and logs it", async () => {
    process.env.NUDGES_ENABLED = "true";
    expect(await runNudges(send)).toEqual({ eligible: 1, sent: 1, failed: 0 });
    expect(rpcCalls[0]).toMatchObject({ name: "nudge_candidates", args: { p_kind: "first-steps", p_min_days: 2, p_max_days: 14 } });
    expect((rpcCalls[0].args as { p_exclude: string[] }).p_exclude).toContain("ssjagdev@outlook.com");
    const [to, email] = send.mock.calls[0];
    expect(to).toBe("a@example.com");
    expect(email.text).toContain("/unsubscribe?t=");
    expect(email.headers["List-Unsubscribe"]).toContain("/api/alerts/unsubscribe?t=");
  });

  it("counts a failed send and carries on", async () => {
    process.env.NUDGES_ENABLED = "true";
    send.mockResolvedValue(false);
    expect(await runNudges(send)).toEqual({ eligible: 1, sent: 0, failed: 1 });
  });

  it("is stopped for good by the unsubscribe link", async () => {
    const token = "11111111-2222-3333-4444-555555555555";
    db.alert_prefs = [{ user_id: "u1", token }];
    await unsubscribe(new Request(`http://x/api/alerts/unsubscribe?t=${token}`, { method: "POST" }));
    expect(db.alert_prefs[0]).toMatchObject({ user_id: "u1", nudges_off: true });
  });
});

describe("who can start the daily run", () => {
  const get = (headers: Record<string, string> = {}) => runRoute(new Request("http://x/api/alerts/run", { headers }));

  it("answers 404 to anyone who is not the scheduler", async () => {
    expect((await get()).status).toBe(404);
    expect((await get({ authorization: "Bearer wrong" })).status).toBe(404);
  });

  it("runs for the scheduler's user-agent, or the secret", async () => {
    expect((await get({ "user-agent": "vercel-cron/1.0" })).status).toBe(200);
    process.env.CRON_SECRET = "s3cret";
    expect((await get({ authorization: "Bearer s3cret" })).status).toBe(200);
  });
});
