import { describe, expect, it } from "vitest";
import { getTest } from "@/lib/assess/tests";
import { FIRMS, getFirm } from "@/lib/firms";
import { glance, practiceLinks, programmeLength } from "@/lib/firms/glance";

const FINANCE = ["goldman-sachs", "jp-morgan", "hsbc", "barclays", "lloyds", "natwest", "santander", "bank-of-america", "deutsche-bank", "ubs", "morgan-stanley", "citi", "rothschild", "bny", "cibc", "bank-of-england", "fca"];

describe("employer page summary", () => {
  it("gives every firm the six at-a-glance rows with some text", () => {
    for (const f of FIRMS) {
      const rows = glance(f);
      expect(rows.map((r) => r.label), f.slug).toEqual(["Dates", "Pay", "Length", "Degree", "Entry", "Stages"]);
      for (const r of rows) expect(r.value.trim().length, `${f.slug} ${r.label}`).toBeGreaterThan(2);
    }
  });

  it("reads programme length from the profile", () => {
    expect(programmeLength(getFirm("bank-of-america")!)).toBe("4 years");
    expect(programmeLength(getFirm("fca")!)).toBe("18 to 36 months");
  });

  it("only shows pay when a sourced figure exists", () => {
    expect(glance(getFirm("fca")!).find((r) => r.label === "Pay")!.value).toContain("£25,700");
    expect(glance(getFirm("goldman-sachs")!).find((r) => r.label === "Pay")!.value).toMatch(/Not published/);
  });

  it("gives every finance firm a day-to-day summary, and sources for every talking point and pay figure", () => {
    for (const s of FINANCE) expect(getFirm(s)!.dayToDay?.length, s).toBeGreaterThan(0);
    for (const f of FIRMS) {
      for (const w of f.whyThisFirm ?? []) expect(w.source, f.slug).toMatch(/^https:\/\/\S+$/);
      if (f.pay) expect(f.pay.source, f.slug).toMatch(/^https:\/\/\S+$/);
    }
  });

  it("links to the mock, interview, video timings and matching real tests", () => {
    const gs = practiceLinks(getFirm("goldman-sachs")!).map((l) => l.href);
    expect(gs[0]).toBe("/mock/goldman-sachs");
    expect(gs).toContain("/interview?firm=goldman-sachs");
    expect(gs).toContain("/interview?firm=goldman-sachs&mode=video");
    const ms = practiceLinks(getFirm("morgan-stanley")!).map((l) => l.href);
    expect(ms).toContain("/tests/scales-numerical");
    for (const f of FIRMS) for (const l of practiceLinks(f)) if (l.href.startsWith("/tests/")) expect(getTest(l.href.slice(7)), l.href).toBeDefined();
  });
});

describe("links to the newer test formats", () => {
  it("sends NatWest to work scenarios and Morgan Stanley to switch puzzles", () => {
    expect(practiceLinks(getFirm("natwest")!).map((l) => l.href)).toContain("/tests/work-scenarios");
    expect(practiceLinks(getFirm("morgan-stanley")!).map((l) => l.href)).toContain("/tests/switch-challenge");
  });
});
