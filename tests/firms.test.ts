import { describe, expect, it } from "vitest";
import { FINANCE_NO_DEGREE_ROUTE, directory } from "@/lib/directory";
import { FIRMS } from "@/lib/firms";

const url = /^https?:\/\/\S+$/;

describe("firm profiles", () => {
  it("have unique slugs and names", () => {
    expect(new Set(FIRMS.map((f) => f.slug)).size).toBe(FIRMS.length);
    expect(new Set(FIRMS.map((f) => f.name)).size).toBe(FIRMS.length);
  });

  it.each(FIRMS.map((f) => [f.slug, f] as const))("%s has the required content", (_slug, f) => {
    expect(f.name.trim()).not.toBe("");
    expect(f.sector.trim()).not.toBe("");
    expect(f.programmes.length).toBeGreaterThan(0);
    expect(f.stages.length).toBeGreaterThan(0);
    expect(f.values.length).toBeGreaterThan(0);
    expect(f.specificAdvice.length).toBeGreaterThan(0);
    expect(f.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(f.lastVerified))).toBe(false);
  });

  it.each(FIRMS.map((f) => [f.slug, f] as const))("%s uses well-formed source URLs", (_slug, f) => {
    const urls = [
      f.entry.source,
      f.timeline.source,
      ...f.stages.map((s) => s.source),
      ...f.questions.map((q) => q.source),
      ...f.officialLinks,
    ];
    for (const u of urls) expect(u, u).toMatch(url);
  });

  it("orders stages sequentially", () => {
    for (const f of FIRMS) {
      const orders = f.stages.map((s) => s.order);
      expect(orders, f.slug).toEqual([...orders].sort((a, b) => a - b));
    }
  });
});

describe("employer directory", () => {
  const entries = directory();

  it("has unique names", () => {
    expect(new Set(entries.map((e) => e.name)).size).toBe(entries.length);
  });

  it("links every advertised firm profile exactly once", () => {
    const slugs = entries.flatMap((e) => (e.slug ? [e.slug] : []));
    expect(new Set(slugs).size).toBe(slugs.length);
    const known = new Set(FIRMS.map((f) => f.slug));
    for (const s of slugs) expect(known.has(s)).toBe(true);
    for (const f of FIRMS) {
      if (f.slug === "civil-service-fast-track") continue;
      expect(slugs, f.slug).toContain(f.slug);
    }
  });

  it("does not advertise the closed Civil Service Fast Track scheme", () => {
    expect(entries.some((e) => /fast track/i.test(e.name))).toBe(false);
  });
});

describe("finance coverage", () => {
  const finance = ["bank-of-america", "bank-of-england", "bny", "cibc", "citi", "deutsche-bank", "fca", "morgan-stanley", "rothschild", "ubs"];

  it("includes the finance employers from the 2026 research", () => {
    const slugs = new Set(FIRMS.map((f) => f.slug));
    for (const s of finance) expect(slugs.has(s), s).toBe(true);
  });

  it("lists every finance profile under the finance filter", () => {
    const entries = directory();
    for (const s of finance) expect(entries.find((e) => e.slug === s)?.sectors, s).toContain("finance");
  });

  it("records what could not be verified for each new finance profile", () => {
    for (const s of finance) expect(FIRMS.find((f) => f.slug === s)!.gaps.length, s).toBeGreaterThan(0);
  });

  it("lists firms without a degree route with a source, and never one we profile", () => {
    const names = new Set(FIRMS.map((f) => f.name.toLowerCase()));
    for (const n of FINANCE_NO_DEGREE_ROUTE) {
      expect(n.source, n.name).toMatch(/^https:\/\/\S+$/);
      expect(names.has(n.name.toLowerCase()), n.name).toBe(false);
    }
  });
});
