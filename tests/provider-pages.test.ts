import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { PREPARE_GENERAL, PROVIDERS } from "@/lib/games/providers";
import { PUBLIC_PATHS, SITE_URL } from "@/lib/site";

describe("game provider pages", () => {
  it("every provider says when its sources were last read, with a real date", () => {
    for (const p of PROVIDERS) {
      expect(p.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(p.checked).getTime())).toBe(false);
    }
  });

  it("every provider answers real questions in full, and the named ones have a title written for search", () => {
    for (const p of PROVIDERS) {
      expect(p.faqs?.length ?? 0).toBeGreaterThan(0);
      for (const f of p.faqs ?? []) {
        expect(f.q.endsWith("?")).toBe(true);
        expect(f.a.length).toBeGreaterThan(40);
      }
      if (p.id !== "general") expect(p.seoTitle, p.id).toBeTruthy();
    }
  });

  it("sources are https links", () => {
    for (const p of PROVIDERS) for (const s of p.sources) expect(s.startsWith("https://"), `${p.id} ${s}`).toBe(true);
  });

  it("does not promise a pass mark or a replica it does not have", () => {
    const neurosight = PROVIDERS.find((p) => p.id === "neurosight")!;
    const text = (neurosight.faqs ?? []).map((f) => f.a).join(" ");
    expect(text).toMatch(/No pass mark is published/);
    expect(text).toMatch(/not public/);
    expect(neurosight.caution).toMatch(/not replicated/i);
  });

  it("general preparation advice is short and non-empty", () => {
    expect(PREPARE_GENERAL.length).toBeGreaterThanOrEqual(4);
  });
});

describe("sitemap", () => {
  const urls = sitemap().map((u) => u.url);
  it("includes every provider page and the parents page, but not the /mock redirect", () => {
    for (const p of PROVIDERS) expect(urls).toContain(`${SITE_URL}/games/provider/${p.id}`);
    expect(PUBLIC_PATHS).toContain("/parents");
    expect(PUBLIC_PATHS).not.toContain("/mock");
  });
  it("dates provider pages from when their sources were read", () => {
    const entry = sitemap().find((u) => u.url.endsWith("/games/provider/neurosight"));
    expect(entry?.lastModified).toEqual(new Date("2026-11-20"));
  });
});
