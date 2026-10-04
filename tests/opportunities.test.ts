import { describe, expect, it } from "vitest";
import { FIRMS } from "@/lib/firms";
import { LISTED, normName } from "@/lib/listings";
import { WINDOWS, formatWhen, opportunityRows, statusOf, type WindowEntry } from "@/lib/opportunities";

const w = (over: Partial<WindowEntry>): WindowEntry => ({ slug: "x", confidence: "official", checked: "2026-10-03", ...over });
const day = (s: string) => new Date(`${s}T12:00:00Z`);

describe("statusOf", () => {
  it("is not confirmed when we have no entry", () => {
    expect(statusOf(undefined, day("2026-10-04"))).toBe("not-confirmed");
  });

  it("flips to open on the opening date and closed after the closing date", () => {
    const e = w({ opens: "2026-10-05", closes: "2026-10-26" });
    expect(statusOf(e, day("2026-10-04"))).toBe("opening-soon");
    expect(statusOf(e, day("2026-10-05"))).toBe("open");
    expect(statusOf(e, day("2026-10-26"))).toBe("open");
    expect(statusOf(e, day("2026-10-27"))).toBe("closed");
  });

  it("treats a month-only opening as the first of that month", () => {
    const e = w({ opens: "2027-02" });
    expect(statusOf(e, day("2027-01-31"))).toBe("opening-soon");
    expect(statusOf(e, day("2027-02-01"))).toBe("open");
  });

  it("uses a stated state only when no date applies", () => {
    expect(statusOf(w({ state: "open" }), day("2026-10-04"))).toBe("open");
    expect(statusOf(w({ state: "not-announced", opensLabel: "Spring 2027" }), day("2026-10-04"))).toBe("not-announced");
  });
});

describe("formatWhen", () => {
  it("formats full dates and months", () => {
    expect(formatWhen("2026-10-05")).toBe("5 Oct 2026");
    expect(formatWhen("2027-02")).toBe("Feb 2027");
  });
});

describe("opportunity data", () => {
  it("only names employers we know, and gives a source to any without a profile", () => {
    const slugs = new Set(FIRMS.map((f) => f.slug));
    const listed = new Set(LISTED.map((l) => normName(l.name)));
    for (const e of WINDOWS) {
      if (e.slug) expect(slugs.has(e.slug), e.slug).toBe(true);
      else {
        expect(e.name && listed.has(normName(e.name)), String(e.name)).toBe(true);
        expect(e.source, `${e.name} needs the page it was read from`).toMatch(/^https:\/\//);
      }
    }
  });

  it("has valid ISO dates and a check date for every entry", () => {
    for (const e of WINDOWS) {
      const id = e.slug ?? e.name;
      for (const d of [e.opens, e.closes].filter(Boolean) as string[]) expect(d, id).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(e.checked, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.opens || e.opensLabel || e.state, `${id} says nothing about when it opens`).toBeTruthy();
    }
  });

  it("has one entry per employer", () => {
    const slugs = WINDOWS.map((e) => e.slug ?? normName(e.name ?? ""));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("lists each employer once: researched ones first, then listed ones we have not researched", () => {
    const rows = opportunityRows(day("2026-10-04"));
    const names = rows.map((r) => r.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
    const researched = rows.filter((r) => r.slug);
    expect(researched.length).toBeGreaterThanOrEqual(FIRMS.length - 2); // hidden profiles aside
    const firstUnresearched = rows.findIndex((r) => !r.slug);
    expect(rows.slice(firstUnresearched).every((r) => !r.slug && r.status === "not-confirmed" && r.vacancyUrl)).toBe(true);
    // Researched rows lead, open ones before the rest.
    expect(rows.slice(0, firstUnresearched).map((r) => r.status).lastIndexOf("open")).toBeLessThan(
      rows.slice(0, firstUnresearched).findIndex((r) => r.status === "closed" || r.status === "not-confirmed") + 1 || 1e9,
    );
  });

  it("matches listed names to researched profiles instead of duplicating them", () => {
    const rows = opportunityRows(day("2026-10-04"));
    for (const n of ["barclays", "goldman sachs", "ubs", "bdo", "jlr"]) expect(rows.filter((r) => r.name.toLowerCase().includes(n)).length, n).toBe(1);
  });
});
