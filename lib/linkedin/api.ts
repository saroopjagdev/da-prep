// A small client for the parts of LinkedIn's official API we use: create a post, read comments, reply to a comment.
// Shapes follow LinkedIn's Posts API and Comments API docs (learn.microsoft.com/linkedin/marketing/community-management).
// `fetch` is passed in so the tests never touch the network. Nothing here is a bot or a scraper: it is the sanctioned
// API, used with a member's or page admin's own consent token.
import type { Comment } from "@/lib/linkedin/replies";

const BASE = "https://api.linkedin.com/rest";
/** The Linkedin-Version header (YYYYMM). Marketing version 202511 is retired on 16 Nov 2026, so default to a later one. */
export const LINKEDIN_VERSION = process.env.LINKEDIN_API_VERSION || "202610";

export type Fetch = typeof fetch;
export class LinkedInError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const headers = (token: string, json = false): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
  "Linkedin-Version": LINKEDIN_VERSION,
  "X-Restli-Protocol-Version": "2.0.0",
  ...(json ? { "Content-Type": "application/json" } : {}),
});

async function fail(res: Response, what: string): Promise<never> {
  const body = (await res.text().catch(() => "")).slice(0, 300);
  throw new LinkedInError(`${what} failed (${res.status}): ${body}`, res.status);
}

/** Publishes a text post as `author` (a person or organization URN). Returns the new post's URN. */
export async function createPost(o: { token: string; author: string; text: string; fetch?: Fetch }): Promise<string> {
  const res = await (o.fetch ?? fetch)(`${BASE}/posts`, {
    method: "POST",
    headers: headers(o.token, true),
    body: JSON.stringify({
      author: o.author,
      commentary: o.text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (res.status !== 201) return fail(res, "Creating the post");
  const id = res.headers.get("x-restli-id");
  if (!id) throw new LinkedInError("Creating the post returned no id", res.status);
  return id;
}

/** First-level comments on a post. Needs read access (organization pages with Community Management approval). */
export async function listComments(o: { token: string; postUrn: string; fetch?: Fetch }): Promise<Comment[]> {
  const res = await (o.fetch ?? fetch)(`${BASE}/socialActions/${encodeURIComponent(o.postUrn)}/comments`, { headers: headers(o.token) });
  if (!res.ok) return fail(res, "Reading comments");
  const data = (await res.json()) as { elements?: { id: string; commentUrn: string; actor: string; message?: { text?: string }; parentComment?: string }[] };
  return (data.elements ?? []).map((e) => ({ id: e.id, urn: e.commentUrn, actor: e.actor, text: e.message?.text ?? "", parent: e.parentComment }));
}

/** Replies under a comment, as `actor`. */
export async function replyToComment(o: { token: string; actor: string; postUrn: string; commentUrn: string; text: string; fetch?: Fetch }): Promise<void> {
  const res = await (o.fetch ?? fetch)(`${BASE}/socialActions/${encodeURIComponent(o.commentUrn)}/comments`, {
    method: "POST",
    headers: headers(o.token, true),
    body: JSON.stringify({ actor: o.actor, object: o.postUrn, message: { text: o.text }, parentComment: o.commentUrn }),
  });
  if (res.status !== 201) return fail(res, "Replying to a comment");
}
