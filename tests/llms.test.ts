import { describe, expect, it } from "vitest";
import { GET as llms } from "@/app/llms.txt/route";
import { GET as llmsFull } from "@/app/llms-full.txt/route";
import { FIRMS } from "@/lib/firms";
import { PROVIDERS } from "@/lib/games/providers";
import { GUIDES } from "@/lib/guides";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms";

describe("llms.txt", () => {
  const short = buildLlmsTxt();
  it("starts with the site name and a one-line summary, and lists every guide, provider and researched employer", () => {
    expect(short.startsWith("# Level6\n")).toBe(true);
    expect(short).toMatch(/\n> /);
    for (const g of GUIDES) expect(short, g.slug).toContain(`/learn/${g.slug}`);
    for (const p of PROVIDERS) expect(short, p.id).toContain(`/games/provider/${p.id}`);
    for (const f of FIRMS) expect(short, f.slug).toContain(`/employers/${f.slug}`);
  });

  it("says what the data is and is not, and does not offer to pay for or rank anything", () => {
    expect(short).toMatch(/not stated/i);
    expect(short).toMatch(/not affiliated/i);
  });

  it("the full file carries the guide text, provider questions and employer timing", () => {
    const full = buildLlmsFullTxt();
    expect(full).toContain(GUIDES[0].intro.slice(0, 40));
    expect(full).toMatch(/\nQ: .*\?\nA: /);
    expect(full).toMatch(/When it opens:/);
    expect(full.length).toBeGreaterThan(short.length * 3);
  });

  it("are served as plain text", async () => {
    for (const r of [llms(), llmsFull()]) {
      expect(r.headers.get("content-type")).toMatch(/^text\/plain/);
      expect((await r.text()).length).toBeGreaterThan(200);
    }
  });
});
