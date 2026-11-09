import { describe, expect, it, vi } from "vitest";
import { createPost, listComments, replyToComment } from "@/lib/linkedin/api";
import { MAX_AGE_DAYS, MAX_NAMES, passesGate, pickPost } from "@/lib/linkedin/content";
import { decideReply, namedEmployer } from "@/lib/linkedin/replies";
import { runLinkedIn, type PostRow, type Store } from "@/lib/server/linkedin";
import type { OpportunityRow } from "@/lib/opportunities";

const TUE = new Date("2026-11-10T08:00:00Z"); // a Tuesday: closing soon first
const TODAY = "2026-11-10";

const row = (o: Partial<OpportunityRow> & { name: string }): OpportunityRow => ({
  sectors: ["finance"],
  programmes: [],
  status: "open",
  opens: "",
  closes: "",
  rolling: false,
  providers: [],
  confidence: "official",
  checked: "2026-11-08",
  ...o,
});
const closing = (name: string, iso: string, extra: Partial<OpportunityRow> = {}) => row({ name, closesIso: iso, closes: iso, ...extra });

describe("the freshness gate", () => {
  it("lets an official, recently read row through", () => expect(passesGate(closing("A", "2026-11-12"), TODAY)).toBe(true));
  it("blocks a row last read more than the allowed days ago", () => {
    const old = new Date(Date.parse(TODAY) - (MAX_AGE_DAYS + 1) * 86_400_000).toISOString().slice(0, 10);
    expect(passesGate(closing("A", "2026-11-12", { checked: old }), TODAY)).toBe(false);
  });
  it("blocks anything not from the employer's own page", () => {
    expect(passesGate(closing("A", "2026-11-12", { confidence: "single-report" }), TODAY)).toBe(false);
    expect(passesGate(closing("A", "2026-11-12", { checked: undefined }), TODAY)).toBe(false);
  });
});

describe("the day's post", () => {
  it("names only employers closing in the next two weeks, soonest first, with the tagged link", () => {
    const rows = [closing("Later", "2026-12-20"), closing("Soon", "2026-11-12"), closing("Sooner", "2026-11-11")];
    const p = pickPost(rows, TUE);
    expect("draft" in p && p.draft.kind).toBe("closing-soon");
    if (!("draft" in p)) throw new Error("expected a draft");
    expect(p.draft.names).toEqual(["Sooner", "Soon"]);
    expect(p.draft.text).toContain("utm_source=linkedin&utm_campaign=closing-soon&utm_content=2026-11-10");
    expect(p.draft.text).not.toContain("Later");
    expect(p.draft.key).toBe("closing-soon:2026-11-10");
  });
  it("never names a stale row, and says so when nothing passes", () => {
    const stale = closing("Stale", "2026-11-12", { checked: "2026-09-01" });
    expect(pickPost([stale], TUE)).toEqual({ skip: "no tracker rows pass the freshness gate for any post type today" });
  });
  it("caps the names in one post", () => {
    const rows = Array.from({ length: 9 }, (_, i) => closing(`Firm ${i}`, `2026-11-${String(11 + (i % 3)).padStart(2, "0")}`));
    const p = pickPost(rows, TUE);
    expect("draft" in p && p.draft.names.length).toBe(MAX_NAMES);
  });
  it("falls back to another kind when the preferred one is empty", () => {
    const p = pickPost([closing("Later", "2026-12-20")], TUE);
    expect("draft" in p && p.draft.kind).toBe("now-open");
  });
  it("does not post at the weekend", () => {
    expect(pickPost([closing("A", "2026-11-12")], new Date("2026-11-14T08:00:00Z"))).toEqual({ skip: "weekend: no post" });
  });
  it("does not repeat a post that has gone out", () => {
    const p = pickPost([closing("A", "2026-11-12")], TUE, (k) => k === "closing-soon:2026-11-10");
    expect(p).toEqual({ skip: "already posted closing-soon:2026-11-10" });
  });
});

describe("which comments get an automatic reply", () => {
  const rows = [closing("Barclays", "2026-12-07", { slug: "barclays", closes: "7 Dec 2026" }), closing("NatWest", "2026-12-10", { slug: "natwest" }), closing("Old Co", "2026-12-07", { checked: "2026-09-01" })];
  const c = (text: string, id = "1", actor = "urn:li:person:x") => ({ id, urn: `urn:li:comment:(a,${id})`, actor, text });
  const ME = "urn:li:organization:1";

  it("answers a dates question from the row, with the day it was last checked", () => {
    const d = decideReply(c("When does Barclays close?"), ME, rows, TODAY);
    expect("reply" in d && d.reply).toContain("Barclays: open, closes 7 Dec 2026");
    expect("reply" in d && d.reply).toContain("last checked their page on 8 Nov 2026");
    expect("reply" in d && d.reply).toContain("/employers/barclays");
  });
  it("leaves a stale employer to a person", () => {
    expect(decideReply(c("When does Old Co close?"), ME, rows, TODAY)).toEqual({ skip: "Old Co: dates not fresh enough to quote" });
  });
  it("thanks a thank-you, with wording that depends on the comment", () => {
    const a = decideReply(c("Thanks, really useful", "1"), ME, rows, TODAY);
    expect("reply" in a && a.why).toBe("thanks");
    const same = decideReply(c("Thanks, really useful", "1"), ME, rows, TODAY);
    expect(a).toEqual(same);
  });
  it("leaves everything else to a person", () => {
    for (const t of ["Which one should I pick?", "This is a scam", "Check https://example.com", "When does Barclays or NatWest close?", "x".repeat(401), "I feel anxious about applying"]) {
      expect("skip" in decideReply(c(t), ME, rows, TODAY), t).toBe(true);
    }
  });
  it("never replies to itself", () => expect(decideReply(c("Thanks!", "2", ME), ME, rows, TODAY)).toEqual({ skip: "our own comment" }));
  it("finds exactly one named employer, or none", () => {
    expect(namedEmployer("what about natwest", rows)?.name).toBe("NatWest");
    expect(namedEmployer("barclays and natwest", rows)).toBeNull();
    expect(namedEmployer("nothing here", rows)).toBeNull();
  });
});

describe("the API client", () => {
  const resp = (status: number, body: unknown = {}, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers });

  it("creates a post with the version headers and returns its URN", async () => {
    const f = vi.fn(async () => resp(201, {}, { "x-restli-id": "urn:li:share:1" }));
    const urn = await createPost({ token: "tok", author: "urn:li:person:a", text: "hello", fetch: f as unknown as typeof fetch });
    expect(urn).toBe("urn:li:share:1");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.linkedin.com/rest/posts");
    expect((init.headers as Record<string, string>)["Linkedin-Version"]).toMatch(/^\d{6}$/);
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body as string)).toMatchObject({ author: "urn:li:person:a", commentary: "hello", visibility: "PUBLIC", lifecycleState: "PUBLISHED" });
  });
  it("throws with LinkedIn's status when a post is refused", async () => {
    const f = async () => resp(403, { message: "ACCESS_DENIED" });
    await expect(createPost({ token: "t", author: "a", text: "x", fetch: f as unknown as typeof fetch })).rejects.toMatchObject({ status: 403 });
  });
  it("reads comments from an encoded URN and replies under a comment", async () => {
    const f = vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === "POST"
        ? resp(201)
        : resp(200, { elements: [{ id: "9", commentUrn: "urn:li:comment:(a,9)", actor: "urn:li:person:z", message: { text: "Thanks" } }] }),
    );
    const list = await listComments({ token: "t", postUrn: "urn:li:share:1", fetch: f as unknown as typeof fetch });
    expect(list).toEqual([{ id: "9", urn: "urn:li:comment:(a,9)", actor: "urn:li:person:z", text: "Thanks", parent: undefined }]);
    expect((f.mock.calls[0] as unknown as [string])[0]).toContain(encodeURIComponent("urn:li:share:1"));
    await replyToComment({ token: "t", actor: "urn:li:organization:1", postUrn: "urn:li:share:1", commentUrn: "urn:li:comment:(a,9)", text: "ta", fetch: f as unknown as typeof fetch });
    const body = JSON.parse((f.mock.calls[1] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ actor: "urn:li:organization:1", object: "urn:li:share:1", parentComment: "urn:li:comment:(a,9)", message: { text: "ta" } });
  });
});

function memoryStore() {
  const posts = new Map<string, { kind: string; urn: string | null; at: string }>();
  const comments = new Map<string, { status: string; detail: string }>();
  const store: Store = {
    async claimPost(key, kind) {
      if (posts.has(key)) return false;
      posts.set(key, { kind, urn: null, at: TUE.toISOString() });
      return true;
    },
    async finishPost(key, urn) {
      posts.get(key)!.urn = urn;
    },
    async releasePost(key) {
      posts.delete(key);
    },
    async hasPost(key) {
      return posts.has(key);
    },
    async recentPosts() {
      return [...posts].filter(([, v]) => v.urn).map(([key, v]): PostRow => ({ key, urn: v.urn, kind: v.kind, posted_at: v.at }));
    },
    async handled(urns) {
      return new Set(urns.filter((u) => comments.has(u)));
    },
    async saveComment(urn, _post, status, detail) {
      comments.set(urn, { status, detail });
    },
  };
  return { store, posts, comments };
}

const LIVE = { LINKEDIN_ENABLED: "true", LINKEDIN_LIVE: "true", LINKEDIN_ACCESS_TOKEN: "tok", LINKEDIN_AUTHOR_URN: "urn:li:person:a" };

describe("the daily run", () => {
  const rows = [closing("Soon", "2026-11-12", { slug: "soon" })];
  const ok = () => vi.fn(async () => new Response("{}", { status: 201, headers: { "x-restli-id": "urn:li:share:7" } }));

  it("does nothing unless switched on", async () => {
    expect(await runLinkedIn("both", { env: {}, rows, now: TUE })).toEqual({ skipped: "LINKEDIN_ENABLED is not true" });
  });
  it("dry run shows the post and never calls LinkedIn or the store", async () => {
    const f = vi.fn();
    const { store, posts } = memoryStore();
    const r = await runLinkedIn("post", { env: { LINKEDIN_ENABLED: "true" }, rows, now: TUE, fetch: f as unknown as typeof fetch, store });
    expect(r.mode).toBe("dry-run");
    expect(r.post?.draft?.names).toEqual(["Soon"]);
    expect(f).not.toHaveBeenCalled();
    expect(posts.size).toBe(0);
  });
  it("posts once, and a second run the same day does not post again", async () => {
    const f = ok();
    const { store } = memoryStore();
    const first = await runLinkedIn("post", { env: LIVE, rows, now: TUE, fetch: f as unknown as typeof fetch, store });
    expect(first.post?.posted).toBe("urn:li:share:7");
    const second = await runLinkedIn("post", { env: LIVE, rows, now: TUE, fetch: f as unknown as typeof fetch, store });
    expect(second.post?.skipped).toBe("already posted closing-soon:2026-11-10");
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("releases the day's slot when LinkedIn refuses, so the next run can try again", async () => {
    const { store, posts } = memoryStore();
    const bad = vi.fn(async () => new Response("no", { status: 500 }));
    const r = await runLinkedIn("post", { env: LIVE, rows, now: TUE, fetch: bad as unknown as typeof fetch, store });
    expect(r.post?.error).toContain("500");
    expect(posts.size).toBe(0);
  });
  it("stops with a message when the token has expired and warns when it is close", async () => {
    const { store } = memoryStore();
    expect((await runLinkedIn("post", { env: { ...LIVE, LINKEDIN_TOKEN_EXPIRES: "2026-11-01" }, rows, now: TUE, store })).skipped).toContain("expired");
    const near = await runLinkedIn("post", { env: { ...LIVE, LINKEDIN_TOKEN_EXPIRES: "2026-11-15" }, rows, now: TUE, fetch: ok() as unknown as typeof fetch, store });
    expect(near.warning).toContain("expires in");
  });
  it("will not go live without somewhere to remember what it posted", async () => {
    expect((await runLinkedIn("post", { env: LIVE, rows, now: TUE, store: null })).skipped).toContain("Supabase");
  });
  it("only replies when switched on and posting as a company page", async () => {
    const { store } = memoryStore();
    expect((await runLinkedIn("replies", { env: LIVE, rows, now: TUE, store })).replies?.skipped).toContain("LINKEDIN_REPLIES_ENABLED");
    const asPerson = await runLinkedIn("replies", { env: { ...LIVE, LINKEDIN_REPLIES_ENABLED: "true" }, rows, now: TUE, store });
    expect(asPerson.replies?.skipped).toContain("company page");
  });
  it("replies once to a thank-you, leaves the rest, and does not answer the same comment twice", async () => {
    const env = { ...LIVE, LINKEDIN_AUTHOR_URN: "urn:li:organization:1", LINKEDIN_REPLIES_ENABLED: "true" };
    const { store, comments } = memoryStore();
    await store.claimPost("closing-soon:2026-11-09", "closing-soon", "t");
    await store.finishPost("closing-soon:2026-11-09", "urn:li:share:7");
    const calls: string[] = [];
    const f = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? "GET"} ${decodeURIComponent(url)}`);
      if (!init?.method)
        return new Response(
          JSON.stringify({
            elements: [
              { id: "1", commentUrn: "urn:li:comment:(a,1)", actor: "urn:li:person:p", message: { text: "Thanks, useful" } },
              { id: "2", commentUrn: "urn:li:comment:(a,2)", actor: "urn:li:person:q", message: { text: "Which should I pick?" } },
            ],
          }),
          { status: 200 },
        );
      return new Response("{}", { status: 201 });
    });
    const first = await runLinkedIn("replies", { env, rows, now: TUE, fetch: f as unknown as typeof fetch, store });
    expect(first.replies).toMatchObject({ replied: 1, left: 1 });
    expect(comments.get("urn:li:comment:(a,1)")?.status).toBe("replied");
    expect(comments.get("urn:li:comment:(a,2)")?.status).toBe("skipped");
    const second = await runLinkedIn("replies", { env, rows, now: TUE, fetch: f as unknown as typeof fetch, store });
    expect(second.replies).toMatchObject({ replied: 0, left: 0 });
    expect(calls.filter((c) => c.startsWith("POST")).length).toBe(1);
  });
});
