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
    create table auth.users (id uuid primary key, email text);
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
    expect(blocked(await as(A, `update profiles set pro_until=now() + interval '1 year' where id='${A}'`))).toBe(true);
    expect((await as(A, `insert into profiles (id, plan) values ('${A}','pro') on conflict (id) do update set plan='pro'`)).err).toBeTruthy();
    expect(blocked(await as(A, `update usage set interviews=0 where user_id='${A}'`))).toBe(true);
  });

  it("does not let signed-in users call the server-only functions", async () => {
    for (const sql of [
      `select consume_interview('${A}','2026-10',99)`,
      `select consume_review('${A}','2026-W40',99)`,
      `select consume_ai_call('${A}','2026-10-02',9999)`,
      `select is_pro('${A}')`,
      `select extend_pro_pass('${A}', 120)`,
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

  it("treats an unexpired pass as Pro, and a lapsed one as Free", async () => {
    expect((await one(`select is_pro('${A}') as p`)).p).toBe(false);
    const until = (await one(`select extend_pro_pass('${A}', 3) as u`)).u as Date;
    const months = (until.getTime() - Date.now()) / (30.4 * 86_400_000);
    expect(months).toBeGreaterThan(2.9);
    expect(months).toBeLessThan(3.1);
    expect((await one(`select is_pro('${A}') as p`)).p).toBe(true);
    expect((await one(`select consume_interview('${A}','2026-10',2) as ok`)).ok).toBe(true);
    await db.exec(`update profiles set pro_until = now() - interval '1 day' where id='${A}'`);
    expect((await one(`select is_pro('${A}') as p`)).p).toBe(false);
    expect((await one(`select consume_interview('${A}','2026-10',2) as ok`)).ok).toBe(false);
  });

  it("adds a second pass on to the end of the first", async () => {
    await db.exec(`update profiles set pro_until = null where id='${A}'`);
    await one(`select extend_pro_pass('${A}', 3)`);
    const until = (await one(`select extend_pro_pass('${A}', 3) as u`)).u as Date;
    expect((until.getTime() - Date.now()) / (30.4 * 86_400_000)).toBeGreaterThan(5.8);
  });

  it("takes a refunded pass back off the end date, never earlier than now", async () => {
    await db.exec(`update profiles set pro_until = now() + interval '6 months' where id='${A}'`);
    const until = (await one(`select shorten_pro_pass('${A}', 3) as u`)).u as Date;
    const months = (until.getTime() - Date.now()) / (30.4 * 86_400_000);
    expect(months).toBeGreaterThan(2.8);
    expect(months).toBeLessThan(3.2);
    const now = (await one(`select shorten_pro_pass('${A}', 12) as u`)).u as Date;
    expect(Math.abs(now.getTime() - Date.now())).toBeLessThan(60_000);
    expect((await as(A, `select shorten_pro_pass('${A}', 1)`)).err).toBeTruthy();
  });

  it("treats the monthly subscription as Pro", async () => {
    await db.exec(`update profiles set plan='pro', pro_until=null where id='${B}'`);
    expect((await one(`select is_pro('${B}') as p`)).p).toBe(true);
    expect((await one(`select consume_review('${B}','2026-W40',0) as ok`)).ok).toBe(true);
  });

  it("removes every row when a user is deleted", async () => {
    await db.exec(`delete from auth.users where id='${B}'`);
    const n = (await one(`select (select count(*) from user_data where user_id='${B}') + (select count(*) from usage where user_id='${B}') + (select count(*) from profiles where id='${B}') as n`)).n;
    expect(Number(n)).toBe(0);
  });
});
