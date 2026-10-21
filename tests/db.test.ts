// Applies the real Supabase migrations to an in-process Postgres (PGlite) with a minimal Supabase auth shim, then
// checks row-level security as two signed-in users and the server-side quota and Pro functions.
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const MIG = path.join(process.cwd(), "supabase/migrations");
const A = "11111111-1111-1111-1111-111111111111";
const B = "22222222-2222-2222-2222-222222222222";
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key, email text, created_at timestamptz not null default now(), email_confirmed_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
  `);
  for (const f of fs.readdirSync(MIG).sort()) await db.exec(fs.readFileSync(path.join(MIG, f), "utf8"));
  // Supabase grants table privileges to these roles by default; row-level security is what protects rows.
  await db.exec(`
    grant usage on schema public to anon, authenticated, service_role;
    grant all on all tables in schema public to anon, authenticated, service_role;
    insert into auth.users values ('${A}','a@x'),('${B}','b@x');
    insert into user_data values ('${A}','applications','[{"employer":"A secret"}]'),('${B}','applications','[{"employer":"B secret"}]');
    insert into usage values ('${B}','2026-10',1,0);
  `);
}, 60_000);

type Out = { rows: Record<string, unknown>[]; err?: string; affected?: number };

/** Run SQL as a signed-in user (or anonymous when uid is null), the way Supabase's API would. */
async function as(uid: string | null, sql: string): Promise<Out> {
  try {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false); set role ${uid ? "authenticated" : "anon"};`);
    const r = await db.query<Record<string, unknown>>(sql);
    return { rows: r.rows, affected: r.affectedRows };
  } catch (e) {
    return { rows: [], err: (e as Error).message };
  } finally {
    await db.exec("reset role;");
  }
}
const blocked = (o: Out) => Boolean(o.err) || o.affected === 0;
const one = async (sql: string) => (await db.query<Record<string, unknown>>(sql)).rows[0];

describe("database row-level security", () => {
  it("lets users read only their own data", async () => {
    const own = await as(A, "select value from user_data");
    expect(own.rows).toHaveLength(1);
    expect(JSON.stringify(own.rows)).toContain("A secret");
    expect((await as(A, `select * from user_data where user_id='${B}'`)).rows).toHaveLength(0);
    expect((await as(A, `select * from profiles where id='${B}'`)).rows).toHaveLength(0);
    expect((await as(A, `select * from usage where user_id='${B}'`)).rows).toHaveLength(0);
  });

  it("stops users changing other people's data", async () => {
    expect(blocked(await as(A, `update user_data set value='[]' where user_id='${B}'`))).toBe(true);
    expect(blocked(await as(A, `delete from user_data where user_id='${B}'`))).toBe(true);
    expect((await as(A, `insert into user_data values ('${B}','stories','[]')`)).err).toBeTruthy();
  });

  it("enforces the allowed keys and the size cap", async () => {
    expect((await as(A, `insert into user_data values ('${A}','admin','[]')`)).err).toBeTruthy();
    expect((await as(A, `insert into user_data values ('${A}','stories', to_jsonb(repeat('x', 1000001)))`)).err).toBeTruthy();
  });

  it("stops users making themselves Pro or resetting their usage", async () => {
    expect(blocked(await as(A, `update profiles set plan='pro' where id='${A}'`))).toBe(true);
    expect((await as(A, `insert into profiles (id, plan) values ('${A}','pro') on conflict (id) do update set plan='pro'`)).err).toBeTruthy();
    expect(blocked(await as(A, `update usage set interviews=0 where user_id='${A}'`))).toBe(true);
  });

  it("does not let signed-in users call the server-only functions", async () => {
    for (const sql of [
      `select consume_interview('${A}','2026-10',99)`,
      `select consume_review('${A}','2026-W40',99)`,
      `select consume_ai_call('${A}','2026-10-02',9999)`,
    ])
      expect((await as(A, sql)).err, sql).toBeTruthy();
    const ai = await as(A, "select * from ai_usage");
    expect(Boolean(ai.err) || ai.rows.length === 0).toBe(true);
  });

  it("gives anonymous visitors nothing", async () => {
    for (const t of ["user_data", "profiles"]) {
      const r = await as(null, `select * from ${t}`);
      expect(Boolean(r.err) || r.rows.length === 0, t).toBe(true);
    }
  });
});

describe("plans and quotas (server-side functions)", () => {
  it("allows the free limit, then refuses", async () => {
    const got = [];
    for (let i = 0; i < 3; i++) got.push((await one(`select consume_interview('${A}','2026-10',2) as ok`)).ok);
    expect(got).toEqual([true, true, false]);
  });

  it("free users hit the review limit; the monthly subscription (plan = pro) does not", async () => {
    const free = [];
    for (let i = 0; i < 3; i++) free.push((await one(`select consume_review('${A}','2026-W40',2) as ok`)).ok);
    expect(free).toEqual([true, true, false]);
    await db.exec(`update profiles set plan='pro' where id='${B}'`);
    expect((await one(`select consume_review('${B}','2026-W40',0) as ok`)).ok).toBe(true);
    expect((await one(`select consume_interview('${B}','2026-10',0) as ok`)).ok).toBe(true);
  });

  it("the pro plan is the only paid state: a Free user with no subscription gets no free pass", async () => {
    await db.exec(`update profiles set plan='free' where id='${A}'`);
    expect((await one(`select consume_interview('${A}','2026-10',2) as ok`)).ok).toBe(false);
  });

  it("removes every row when a user is deleted", async () => {
    await db.exec(`delete from auth.users where id='${B}'`);
    const n = (await one(`select (select count(*) from user_data where user_id='${B}') + (select count(*) from usage where user_id='${B}') + (select count(*) from profiles where id='${B}') as n`)).n;
    expect(Number(n)).toBe(0);
  });
});

describe("first-steps email candidates and admin engagement counts", () => {
  const id = (n: number) => `33333333-3333-3333-3333-${String(n).padStart(12, "0")}`;
  const [QUIET, BUSY, UNCONFIRMED, STOPPED, TOO_NEW, SENT, ADMIN] = [1, 2, 3, 4, 5, 6, 7].map(id);

  beforeAll(async () => {
    await db.exec(`
      insert into auth.users (id, email, created_at, email_confirmed_at) values
        ('${QUIET}', 'quiet@x', now() - interval '3 days', now()),
        ('${BUSY}', 'busy@x', now() - interval '3 days', now()),
        ('${UNCONFIRMED}', 'unconfirmed@x', now() - interval '3 days', null),
        ('${STOPPED}', 'stopped@x', now() - interval '3 days', now()),
        ('${TOO_NEW}', 'new@x', now() - interval '1 day', now()),
        ('${SENT}', 'sent@x', now() - interval '3 days', now()),
        ('${ADMIN}', 'Admin@X', now() - interval '3 days', now());
      insert into usage (user_id, period, practice) values ('${BUSY}', 'lifetime', 1);
      insert into alert_prefs (user_id, nudges_off) values ('${STOPPED}', true);
      insert into nudge_sent (user_id, kind) values ('${SENT}', 'first-steps');
    `);
  });

  const ids = async (sql: string) => (await db.query<{ user_id: string }>(sql)).rows.map((r) => r.user_id);

  it("picks only confirmed, quiet, not-unsubscribed, not-yet-emailed accounts of the right age, and leaves excluded emails out", async () => {
    expect(await ids(`select user_id from nudge_candidates('first-steps', 2, 14, array['admin@x'])`)).toEqual([QUIET]);
  });

  it("keeps the functions away from signed-in users and the public", async () => {
    expect((await as(A, `select * from nudge_candidates('first-steps', 2, 14, '{}')`)).err).toBeTruthy();
    expect((await as(null, `select admin_engagement('{}')`)).err).toBeTruthy();
  });

  it("counts engagement without exposing anyone", async () => {
    const r = (await one(`select admin_engagement(array['admin@x']) as e`)).e as Record<string, number>;
    expect(r.practice).toBe(1);
    expect(r.did_nothing).toBeGreaterThanOrEqual(3);
    expect(Object.keys(r)).not.toContain("email");
  });
});
