import { describe, expect, it } from "vitest";
import { closedOn, editEntries, getField, longDate, setField, staleRows, syncEntry } from "../scripts/tracker-sync-lib.mjs";

const TODAY = "2026-11-10";
const FAA = "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000000001";
const faaEntry = (closes = "2026-12-07", checked = "2026-10-19") =>
  `  {\n    name: "Acme",\n    source: "${FAA}",\n    closes: "${closes}",\n    state: "open",\n    note: "Read from the advert, closing ${longDate(closes)}. Confirm on the one you want.",\n    confidence: "official",\n    checked: "${checked}",\n  },`;
const pageEntry = (checked = "2026-10-20") =>
  `  {\n    name: "Beta",\n    source: "https://beta.example/apprenticeships",\n    state: "open",\n    note: "n",\n    confidence: "official",\n    checked: "${checked}",\n  },`;
const base = { today: TODAY, jobs: {}, pages: {}, history: () => null, closedPage: async () => null };

describe("reading and writing fields", () => {
  it("reads and sets a field without touching the rest or the line endings", () => {
    const t = faaEntry().replace(/\n/g, "\r\n");
    expect(getField(t, "closes")).toBe("2026-12-07");
    const u = setField(t, "checked", "2026-11-10");
    expect(getField(u, "checked")).toBe("2026-11-10");
    expect(u.replace("2026-11-10", "2026-10-19")).toBe(t);
    expect(u.includes("\r\n")).toBe(true);
  });
  it("formats and parses dates the way the notes and the advert pages use them", () => {
    expect(longDate("2026-12-07")).toBe("7 December 2026");
    expect(closedOn("This apprenticeship closed on Friday 30 October 2026.")).toBe("2026-10-30");
    expect(closedOn("Closes in 3 days (Thursday 5 November 2026)")).toBeNull();
  });
});

describe("a government advert row", () => {
  it("is re-confirmed when the advert is still listed with the same date", async () => {
    const r = await syncEntry(faaEntry(), { ...base, jobs: { "2000000001": { deadline: "2026-12-07" } } });
    expect(getField(r.text, "checked")).toBe(TODAY);
    expect(r.events[0].kind).toBe("reconfirmed");
  });
  it("takes the new closing date, in the field and in the note", async () => {
    const r = await syncEntry(faaEntry(), { ...base, jobs: { "2000000001": { deadline: "2026-12-14" } } });
    expect(getField(r.text, "closes")).toBe("2026-12-14");
    expect(getField(r.text, "note")).toContain("14 December 2026");
    expect(getField(r.text, "note")).not.toContain("7 December");
    expect(r.events[0].kind).toBe("date-changed");
  });
  it("closes the row with the date the advert's own page gives when it has left the feed", async () => {
    const r = await syncEntry(faaEntry(), { ...base, closedPage: async () => "<p>This apprenticeship closed on Friday 30 October 2026.</p>" });
    expect(getField(r.text, "closes")).toBe("2026-10-30");
    expect(getField(r.text, "state")).toBe("closed");
    expect(r.events[0].kind).toBe("closed-early");
  });
  it("does not close a row on the feed alone: a page that does not say closed leaves it for a person", async () => {
    const r = await syncEntry(faaEntry(), { ...base, closedPage: async () => "<p>Closes in 20 days</p>" });
    expect(r.text).toBe(faaEntry());
    expect(r.events[0].kind).toBe("needs-person");
  });
  it("leaves a past date alone when the advert has left the feed (the date already closes it)", async () => {
    const r = await syncEntry(faaEntry("2026-10-31"), base);
    expect(r.text).toBe(faaEntry("2026-10-31"));
    expect(r.events).toEqual([]);
  });
  it("changes nothing when the feed could not be read", async () => {
    const r = await syncEntry(faaEntry(), { ...base, jobs: null });
    expect(r.text).toBe(faaEntry());
  });
});

describe("an employer page row", () => {
  const signals = ["Applications open in November."];
  const page = { name: "Beta", checked: TODAY, signals };
  const url = "https://beta.example/apprenticeships";

  it("is re-confirmed when the dates wording is exactly what it was before the page was last read", async () => {
    let asked = "";
    const r = await syncEntry(pageEntry(), { ...base, pages: { [url]: page }, history: (u: string, d: string) => ((asked = `${u} ${d}`), signals) });
    expect(getField(r.text, "checked")).toBe(TODAY);
    expect(asked).toBe(`${url} 2026-10-20`);
    expect(r.events[0].kind).toBe("page-unchanged");
  });
  it("goes to a person when the wording changed", async () => {
    const r = await syncEntry(pageEntry(), { ...base, pages: { [url]: page }, history: () => ["Applications open in October."] });
    expect(r.text).toBe(pageEntry());
    expect(r.events[0]).toMatchObject({ kind: "needs-person", detail: expect.stringContaining("changed") });
  });
  it("goes to a person when there is no earlier snapshot, or the page was not read today", async () => {
    expect((await syncEntry(pageEntry(), { ...base, pages: { [url]: page } })).events[0].detail).toContain("no earlier snapshot");
    expect((await syncEntry(pageEntry(), { ...base, pages: { [url]: { ...page, checked: "2026-11-01" } }, history: () => signals })).events[0].detail).toContain("could not be read");
  });
});

describe("a firm row with no source line", () => {
  const firm = `  {\n    slug: "acme",\n    state: "open",\n    note: "n",\n    confidence: "official",\n    checked: "2026-10-20",\n  },`;
  const sig = ["a"];
  const pages = { "https://a.example/1": { name: "acme", checked: TODAY, signals: sig }, "https://a.example/2": { name: "acme", checked: TODAY, signals: sig } };
  it("is re-confirmed only when every official page is unchanged", async () => {
    expect(getField((await syncEntry(firm, { ...base, pages, history: () => sig })).text, "checked")).toBe(TODAY);
    const mixed = await syncEntry(firm, { ...base, pages, history: (u: string) => (u.endsWith("1") ? sig : ["b"]) });
    expect(mixed.text).toBe(firm);
    expect(mixed.events[0].kind).toBe("needs-person");
  });
  it("is left to a person when none of its pages is watched", async () => {
    expect((await syncEntry(firm, base)).events[0].detail).toContain("none of the firm's official pages");
  });
});

describe("the whole file", () => {
  it("rebuilds the file exactly, changing only the rows that were proved", async () => {
    const src = `// header\nexport const WINDOWS = [\n${faaEntry()}\n${pageEntry()}\n];\n`;
    const out = await editEntries(src, async (t: string) => (await syncEntry(t, { ...base, jobs: { "2000000001": { deadline: "2026-12-07" } } })).text);
    expect(out).toBe(src.replace(`checked: "2026-10-19"`, `checked: "${TODAY}"`));
  });
  it("lists rows not checked in two weeks, oldest first, skipping ones already closed by date", () => {
    const src = `x\n${faaEntry("2026-12-07", "2026-10-01")}\n${pageEntry("2026-11-05")}\n${faaEntry("2026-10-31", "2026-09-01")}\n`;
    expect(staleRows(src, TODAY).map((s: { name: string }) => s.name)).toEqual(["Acme"]);
  });
});
