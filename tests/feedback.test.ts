import { beforeEach, describe, expect, it, vi } from "vitest";

const userFromRequest = vi.fn();
let inserted: Record<string, unknown>[] = [];
let existing = 0;
let featuredRows: unknown[] = [];
let updateRows: unknown[] = [{ id: "x" }];
const updates: { patch: Record<string, unknown>; filters: [string, unknown][] }[] = [];

const builder = () => {
  const state = { op: "select", patch: {} as Record<string, unknown>, filters: [] as [string, unknown][] };
  const q: Record<string, unknown> = {};
  q.select = (_c?: string, opts?: { head?: boolean }) => {
    if (opts?.head) return { eq: () => Promise.resolve({ count: existing, error: null }) };
    if (state.op === "update") return Promise.resolve({ data: updateRows, error: null });
    return q;
  };
  q.insert = async (row: Record<string, unknown>) => {
    inserted.push(row);
    return { error: null };
  };
  q.update = (patch: Record<string, unknown>) => {
    state.op = "update";
    state.patch = patch;
    return q;
  };
  for (const m of ["eq", "not"]) q[m] = (col: string, val: unknown) => (state.filters.push([col, val]), updates.push({ patch: state.patch, filters: state.filters }), q);
  q.order = () => q;
  q.limit = async () => ({ data: featuredRows, error: null });
  return q;
};
vi.mock("@/lib/server/auth", () => ({
  admin: () => ({ from: () => builder() }),
  userFromRequest: (...a: unknown[]) => userFromRequest(...a),
}));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: async () => true }));
vi.mock("@/lib/server/safety", () => ({ screenText: async () => null }));

import { POST as sendFeedback } from "@/app/api/feedback/route";
import { GET as publicComments } from "@/app/api/testimonials/route";
import { POST as feature } from "@/app/api/admin/feedback/route";
import { feedbackInput, publicComments as toPublic } from "@/lib/feedback";

const post = (body: unknown) => new Request("http://x/api/feedback", { method: "POST", body: JSON.stringify(body) });

beforeEach(() => {
  userFromRequest.mockReset();
  inserted = [];
  existing = 0;
  featuredRows = [];
  updateRows = [{ id: "x" }];
  updates.length = 0;
});

describe("feedback input", () => {
  it("needs a message, and a name when permission to show it is given", () => {
    expect(feedbackInput.safeParse({ message: "" }).success).toBe(false);
    expect(feedbackInput.safeParse({ message: "Useful", mayQuote: true }).success).toBe(false);
    expect(feedbackInput.safeParse({ message: "Useful", mayQuote: true, displayName: "Aisha, Year 13" }).success).toBe(true);
    expect(feedbackInput.safeParse({ message: "Not useful at all", rating: 1 }).success).toBe(true);
    expect(feedbackInput.safeParse({ message: "x", rating: 6 }).success).toBe(false);
  });
});

describe("POST /api/feedback", () => {
  it("needs a signed-in member", async () => {
    userFromRequest.mockResolvedValue(null);
    expect((await sendFeedback(post({ message: "hi" }))).status).toBe(401);
  });

  it("saves low and high ratings in exactly the same way: the rating never changes what happens", async () => {
    userFromRequest.mockResolvedValue({ id: "u1" });
    for (const rating of [1, 2, 3, 4, 5]) expect((await sendFeedback(post({ message: "my view", rating }))).status).toBe(200);
    expect(inserted).toHaveLength(5);
    expect(inserted.every((r) => r.user_id === "u1" && r.may_quote === false && r.display_name === null)).toBe(true);
  });

  it("stores a display name only when permission to show the comment was given", async () => {
    userFromRequest.mockResolvedValue({ id: "u1" });
    await sendFeedback(post({ message: "Great", mayQuote: true, displayName: "Aisha, Year 13" }));
    await sendFeedback(post({ message: "Fine", mayQuote: false, displayName: "Should not be kept" }));
    expect(inserted[0]).toMatchObject({ may_quote: true, display_name: "Aisha, Year 13" });
    expect(inserted[1]).toMatchObject({ may_quote: false, display_name: null });
  });

  it("stops one account sending more than the cap", async () => {
    userFromRequest.mockResolvedValue({ id: "u1" });
    existing = 5;
    expect((await sendFeedback(post({ message: "again" }))).status).toBe(409);
    expect(inserted).toHaveLength(0);
  });
});

describe("what the public site can see", () => {
  const row = (over: Partial<{ id: string; message: string; display_name: string | null; may_quote: boolean; featured: boolean }>) => ({ id: "1", message: "Helpful", display_name: "Sam", may_quote: true, featured: true, ...over });

  it("shows only comments that were chosen, with permission and a name", () => {
    const out = toPublic([row({}), row({ id: "2", featured: false }), row({ id: "3", may_quote: false }), row({ id: "4", display_name: null })]);
    expect(out.map((c) => c.id)).toEqual(["1"]);
  });

  it("exposes only the words and the name, and removes contact details that slipped in", () => {
    const [c] = toPublic([row({ message: "Brilliant, email me at sam@example.com" })]);
    expect(Object.keys(c).sort()).toEqual(["id", "name", "quote"]);
    expect(c.quote).not.toContain("sam@example.com");
  });

  it("GET /api/testimonials returns the same safe shape and is cacheable", async () => {
    featuredRows = [{ ...row({}), user_id: "secret", rating: 5 }];
    const res = await publicComments();
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    const body = (await res.json()) as { comments: Record<string, unknown>[] };
    expect(body.comments).toEqual([{ id: "1", quote: "Helpful", name: "Sam" }]);
  });
});

describe("POST /api/admin/feedback", () => {
  const call = (body: unknown) => feature(new Request("http://x/api/admin/feedback", { method: "POST", body: JSON.stringify(body) }));
  const admin = { id: "a", email: "ssjagdev@outlook.com", email_confirmed_at: "2026-01-01" };

  it("is a 404 for anyone who is not an admin", async () => {
    userFromRequest.mockResolvedValue({ id: "u", email: "someone@else.com", email_confirmed_at: "2026-01-01" });
    expect((await call({ id: "1", featured: true })).status).toBe(404);
  });

  it("only features a comment whose author gave permission and a name", async () => {
    userFromRequest.mockResolvedValue(admin);
    expect((await call({ id: "1", featured: true })).status).toBe(200);
    const cols = updates.flatMap((u) => u.filters.map((f) => f[0]));
    expect(cols).toContain("may_quote");
    expect(cols).toContain("display_name");
    updateRows = [];
    expect((await call({ id: "2", featured: true })).status).toBe(409);
  });
});
