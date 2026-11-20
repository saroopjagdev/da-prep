import { describe, expect, it } from "vitest";
import { quickAnswers } from "@/lib/firms/answers";
import { FIRMS } from "@/lib/firms";

describe("quick answers on employer guides", () => {
  it("every guide yields clear answers with real text, and never 'undefined'", () => {
    for (const f of FIRMS) {
      const a = quickAnswers(f);
      expect(a.length, f.slug).toBeGreaterThanOrEqual(3);
      for (const x of a) {
        expect(x.q.endsWith("?"), `${f.slug} ${x.q}`).toBe(true);
        expect(x.a.length, `${f.slug} ${x.q}`).toBeGreaterThan(20);
        expect(`${x.q} ${x.a}`, f.slug).not.toMatch(/undefined|null|\[object/);
      }
    }
  });

  it("only say 'degree-level routes' when a programme names a degree or Level 6 or 7", () => {
    for (const f of FIRMS) {
      const first = quickAnswers(f).find((x) => x.q.startsWith("Does "));
      if (first?.a.startsWith("Its guide lists degree-level routes.")) {
        expect(f.programmes.some((p) => /degree|level 6|level 7|graduate apprentice/i.test(`${p.name} ${p.level} ${p.degree ?? ""}`)), f.slug).toBe(true);
      }
    }
  });

  it("include the live application window when one is passed in, and leave out questions the profile cannot answer", () => {
    const f = FIRMS[0];
    expect(quickAnswers(f, "Applications are open until 1 January 2027.").some((x) => x.a.includes("open until 1 January 2027"))).toBe(true);
    const bare = { ...f, pay: undefined, oa: undefined };
    expect(quickAnswers(bare).some((x) => /pay\?|online tests/.test(x.q))).toBe(false);
  });

  it("UBS now carries its two sourced reported questions", () => {
    const ubs = FIRMS.find((f) => f.slug === "ubs")!;
    expect(ubs.questions.length).toBe(2);
    for (const q of ubs.questions) expect(q.source.startsWith("https://")).toBe(true);
  });
});
