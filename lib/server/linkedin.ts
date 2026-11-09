import { createPost, listComments, replyToComment, type Fetch } from "@/lib/linkedin/api";
import { pickPost, type Draft } from "@/lib/linkedin/content";
import { decideReply } from "@/lib/linkedin/replies";
import { opportunityRows, type OpportunityRow } from "@/lib/opportunities";
import { admin } from "@/lib/server/auth";

/** Safety caps on one run, so a bug cannot flood the page. */
export const MAX_REPLIES_PER_RUN = 10;
/** Only posts this recent are checked for comments. */
export const REPLY_WINDOW_DAYS = 7;
/** Warn when the access token has this long left. */
export const TOKEN_WARN_DAYS = 10;

export type PostRow = { key: string; urn: string | null; kind: string; posted_at: string };
/** Everything the run remembers. Supabase in production, a Map in the tests. */
export interface Store {
  /** Reserve the day's post. False when it is already reserved or posted, so two runs can never both publish it. */
  claimPost(key: string, kind: string, text: string): Promise<boolean>;
  finishPost(key: string, urn: string): Promise<void>;
  releasePost(key: string): Promise<void>;
  hasPost(key: string): Promise<boolean>;
  recentPosts(sinceIso: string): Promise<PostRow[]>;
  /** Comments already handled (replied to or deliberately skipped). */
  handled(commentUrns: string[]): Promise<Set<string>>;
  saveComment(commentUrn: string, postUrn: string, status: "replied" | "skipped", detail: string): Promise<void>;
}

export type RunResult = {
  skipped?: string;
  mode?: "dry-run" | "live";
  warning?: string;
  post?: { skipped?: string; draft?: Pick<Draft, "key" | "kind" | "names" | "text">; posted?: string; error?: string };
  replies?: { skipped?: string; replied: number; left: number; error?: string; preview?: { comment: string; reply: string }[] };
};

export function supabaseStore(): Store | null {
  const a = admin();
  if (!a) return null;
  return {
    async claimPost(key, kind, text) {
      const { error } = await a.from("linkedin_posts").insert({ key, kind, text });
      if (!error) return true;
      if (error.code === "23505") return false;
      throw new Error(`linkedin_posts: ${error.message}`);
    },
    async finishPost(key, urn) {
      await a.from("linkedin_posts").update({ urn }).eq("key", key);
    },
    async releasePost(key) {
      await a.from("linkedin_posts").delete().eq("key", key);
    },
    async hasPost(key) {
      const { data } = await a.from("linkedin_posts").select("key").eq("key", key).maybeSingle();
      return Boolean(data);
    },
    async recentPosts(sinceIso) {
      const { data } = await a.from("linkedin_posts").select("key,urn,kind,posted_at").gte("posted_at", sinceIso).not("urn", "is", null);
      return (data ?? []) as PostRow[];
    },
    async handled(urns) {
      if (!urns.length) return new Set();
      const { data } = await a.from("linkedin_comments").select("comment_urn").in("comment_urn", urns);
      return new Set((data ?? []).map((r: { comment_urn: string }) => r.comment_urn));
    },
    async saveComment(commentUrn, postUrn, status, detail) {
      await a.from("linkedin_comments").upsert({ comment_urn: commentUrn, post_urn: postUrn, status, detail }, { onConflict: "comment_urn", ignoreDuplicates: true });
    },
  };
}

type Deps = { store?: Store | null; fetch?: Fetch; now?: Date; rows?: OpportunityRow[]; env?: Record<string, string | undefined> };

/**
 * The daily LinkedIn job: publish today's post, then answer comments on recent posts. Does nothing unless LINKEDIN_ENABLED
 * is "true", and only talks to LinkedIn when LINKEDIN_LIVE is "true"; otherwise it returns what it WOULD do. Replies only
 * run when LINKEDIN_REPLIES_ENABLED is "true", which needs a company page with Community Management API access (a personal
 * profile's comments cannot be read through the API).
 */
export async function runLinkedIn(task: "post" | "replies" | "both" = "both", d: Deps = {}): Promise<RunResult> {
  const env = d.env ?? process.env;
  if (env.LINKEDIN_ENABLED !== "true") return { skipped: "LINKEDIN_ENABLED is not true" };
  const live = env.LINKEDIN_LIVE === "true";
  const out: RunResult = { mode: live ? "live" : "dry-run" };
  const token = env.LINKEDIN_ACCESS_TOKEN;
  const author = env.LINKEDIN_AUTHOR_URN;
  const now = d.now ?? new Date();

  if (live) {
    if (!token || !author) return { skipped: "LINKEDIN_ACCESS_TOKEN and LINKEDIN_AUTHOR_URN must be set to go live" };
    const exp = env.LINKEDIN_TOKEN_EXPIRES ? Date.parse(env.LINKEDIN_TOKEN_EXPIRES) : NaN;
    if (!Number.isNaN(exp)) {
      if (exp <= now.getTime()) return { skipped: "the LinkedIn access token has expired: sign in again and replace it" };
      const left = Math.floor((exp - now.getTime()) / 86_400_000);
      if (left <= TOKEN_WARN_DAYS) out.warning = `the LinkedIn access token expires in ${left} day(s)`;
    }
  }
  const store = d.store === undefined ? supabaseStore() : d.store;
  if (live && !store) return { skipped: "Supabase is not configured, so a live run could not remember what it posted" };
  const rows = d.rows ?? opportunityRows(now);
  const f = d.fetch;

  if (task !== "replies") {
    const pick = pickPost(rows, now);
    if ("skip" in pick) out.post = { skipped: pick.skip };
    else {
      const draft = pick.draft;
      const shown = { key: draft.key, kind: draft.kind, names: draft.names, text: draft.text };
      if (!live) out.post = { draft: shown };
      else if (!(await store!.claimPost(draft.key, draft.kind, draft.text))) out.post = { skipped: `already posted ${draft.key}` };
      else {
        try {
          const urn = await createPost({ token: token!, author: author!, text: draft.text, fetch: f });
          await store!.finishPost(draft.key, urn);
          out.post = { draft: shown, posted: urn };
        } catch (e) {
          await store!.releasePost(draft.key).catch(() => {});
          out.post = { draft: shown, error: (e as Error).message };
        }
      }
    }
  }

  if (task !== "post") {
    if (env.LINKEDIN_REPLIES_ENABLED !== "true") out.replies = { skipped: "LINKEDIN_REPLIES_ENABLED is not true", replied: 0, left: 0 };
    else if (!author?.startsWith("urn:li:organization:")) out.replies = { skipped: "replies need LINKEDIN_AUTHOR_URN to be a company page (urn:li:organization:...)", replied: 0, left: 0 };
    else if (!token) out.replies = { skipped: "LINKEDIN_ACCESS_TOKEN is not set", replied: 0, left: 0 };
    else if (!store) out.replies = { skipped: "Supabase is not configured", replied: 0, left: 0 };
    else out.replies = await runReplies({ store, token, author, rows, now, fetch: f, live });
  }
  return out;
}

async function runReplies(o: { store: Store; token: string; author: string; rows: OpportunityRow[]; now: Date; fetch?: Fetch; live: boolean }): Promise<NonNullable<RunResult["replies"]>> {
  const today = o.now.toISOString().slice(0, 10);
  const since = new Date(o.now.getTime() - REPLY_WINDOW_DAYS * 86_400_000).toISOString();
  const res: NonNullable<RunResult["replies"]> = { replied: 0, left: 0, preview: [] };
  try {
    for (const post of await o.store.recentPosts(since)) {
      if (!post.urn) continue;
      const comments = await listComments({ token: o.token, postUrn: post.urn, fetch: o.fetch });
      const done = await o.store.handled(comments.map((c) => c.urn));
      for (const c of comments) {
        if (done.has(c.urn) || c.parent) continue; // answered already, or a reply rather than a first-level comment
        const verdict = decideReply(c, o.author, o.rows, today);
        if ("skip" in verdict) {
          if (o.live) await o.store.saveComment(c.urn, post.urn, "skipped", verdict.skip);
          res.left++;
          continue;
        }
        if (res.replied >= MAX_REPLIES_PER_RUN) continue;
        if (!o.live) {
          res.preview!.push({ comment: c.text, reply: verdict.reply });
          res.replied++;
          continue;
        }
        await replyToComment({ token: o.token, actor: o.author, postUrn: post.urn, commentUrn: c.urn, text: verdict.reply, fetch: o.fetch });
        await o.store.saveComment(c.urn, post.urn, "replied", verdict.why);
        res.replied++;
      }
    }
  } catch (e) {
    res.error = (e as Error).message;
  }
  if (!res.preview!.length) delete res.preview;
  return res;
}
