import { describe, expect, it } from "vitest";
import { directory } from "@/lib/directory";
import { FIRMS, getFirm } from "@/lib/firms";
import { applicationsToIcs } from "@/lib/ics";
import { fromTemplate, trackerFirms, trackerTemplate } from "@/lib/tracker";

describe("tracker templates from firm guides", () => {
  it("copies the firm's stages as a checklist, in order, with dates as a guide", () => {
    const t = trackerTemplate(getFirm("goldman-sachs")!, 2);
    expect(t.employer).toBe("Goldman Sachs");
    expect(t.role).toMatch(/Operations/);
    expect(t.checklist!.map((c) => c.label)).toEqual(["Online application", "HireVue video interview", "HackerRank assessment", "Superday"]);
    expect(t.checklist!.every((c) => !c.done)).toBe(true);
    expect(t.rolling).toBe(true);
    expect(t.datesHint).toMatch(/^Opens:/);
  });

  it("builds a template for every programme of every firm", () => {
    for (const f of trackerFirms(FIRMS)) {
      expect(f.programmes.length, f.slug).toBe(getFirm(f.slug)!.programmes.length);
      for (const p of f.programmes) expect(p.checklist!.length, f.slug).toBeGreaterThan(0);
    }
  });

  it("gives each new item its own checklist", () => {
    const t = trackerTemplate(getFirm("ubs")!);
    const a = fromTemplate(t, "a");
    const b = fromTemplate(t, "b");
    a.checklist![0].done = true;
    expect(b.checklist![0].done).toBe(false);
    expect(t.checklist![0].done).toBe(false);
    expect(a).toMatchObject({ id: "a", status: "Interested", deadline: "", notes: "" });
  });

  it("attaches a template to every directory entry that has a guide", () => {
    for (const e of directory()) if (e.slug) expect(e.template?.firm, e.name).toBe(e.slug);
  });

  it("skips rolling items without a date in the calendar export", () => {
    const ics = applicationsToIcs([fromTemplate(trackerTemplate(getFirm("ubs")!), "x")]);
    expect(ics).not.toContain("BEGIN:VEVENT");
  });
});
