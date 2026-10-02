import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({ supabase: () => null }));

import { postJson } from "@/lib/api";

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
}

describe("postJson practice passes", () => {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  let replies: unknown[] = [];

  beforeEach(() => {
    calls.length = 0;
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, headers: init.headers as Record<string, string> });
      return new Response(JSON.stringify(replies.shift() ?? {}), { status: 200 });
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("stores a pass from a response and sends it on later calls until it expires", async () => {
    replies = [{ question: "Q1", pass: "abc.def", kind: "interview", expires: Date.now() + 60_000 }, { question: "Q2" }];
    await postJson("/api/interview/next", {});
    expect(calls[0].headers["x-pass-interview"]).toBeUndefined();
    await postJson("/api/interview/next", {});
    expect(calls[1].headers["x-pass-interview"]).toBe("abc.def");

    localStorage.setItem("da-prep:pass:interview", JSON.stringify({ pass: "old", expires: Date.now() - 1 }));
    replies = [{}];
    await postJson("/api/interview/next", {});
    expect(calls[2].headers["x-pass-interview"]).toBeUndefined();
  });

  it("ignores malformed pass fields", async () => {
    replies = [{ pass: 123, kind: "interview", expires: 1 }, { pass: "x", kind: "admin", expires: Date.now() + 1000 }, {}];
    await postJson("/api/x", {});
    await postJson("/api/x", {});
    await postJson("/api/x", {});
    expect(Object.keys(calls[2].headers).filter((h) => h.startsWith("x-pass"))).toEqual([]);
  });
});
