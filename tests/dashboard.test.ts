import { describe, expect, it } from "vitest";
import type { Usage } from "@/components/useUsage";
import { allowances, countdown, daysLeft, left, limitReached, pipelineRows, proOffer, shortDate } from "@/lib/dashboard";
import type { Application, Status } from "@/lib/types";

const TODAY = "2026-11-10";
const app = (employer: string, status: Status, deadline = "", extra: Partial<Application> = {}): Application => ({ id: employer, employer, role: "", deadline, status, notes: "", ...extra });

describe("closing-date countdown", () => {
  it("counts the days, and is urgent inside a week", () => {
    expect(daysLeft("2026-11-17", TODAY)).toBe(7);
    expect(countdown(app("A", "Interested", "2026-11-10"), TODAY)).toEqual({ text: "Closes today", tone: "urgent" });
    expect(countdown(app("A", "Interested", "2026-11-11"), TODAY)).toEqual({ text: "Closes tomorrow", tone: "urgent" });
    expect(countdown(app("A", "Interested", "2026-11-14"), TODAY)).toEqual({ text: "Closes in 4 days", tone: "urgent" });
    expect(countdown(app("A", "Interested", "2026-11-24"), TODAY)).toEqual({ text: "Closes in 14 days", tone: "soon" });
    expect(countdown(app("A", "Interested", "2026-12-20"), TODAY)).toEqual({ text: "Closes 20 Dec", tone: "calm" });
    expect(countdown(app("A", "Interested", "2026-11-01"), TODAY)).toEqual({ text: "Closed", tone: "calm" });
  });
  it("says nothing once someone has applied, and nothing when there is no date", () => {
    expect(countdown(app("A", "Applied", "2026-11-12"), TODAY)).toBeNull();
    expect(countdown(app("A", "Interested"), TODAY)).toBeNull();
  });
  it("says rolling closes when full for a saved rolling employer without a date", () => {
    expect(countdown(app("A", "Interested", "", { rolling: true }), TODAY)).toEqual({ text: "Rolling: apply early", tone: "soon" });
  });
  it("formats a short date", () => expect(shortDate("2027-02-05")).toBe("5 Feb"));
});

describe("the order of tracked applications", () => {
  it("puts the soonest closing date first, then the furthest stage, then undated, then closed, and leaves out rejected", () => {
    const rows = pipelineRows(
      [
        app("Undated", "Interested"),
        app("Closed", "Interested", "2026-10-01"),
        app("Later", "Interested", "2026-12-01"),
        app("Applied", "Applied"),
        app("Centre", "Assessment centre"),
        app("Soon", "Interested", "2026-11-12"),
        app("Out", "Rejected"),
      ],
      TODAY,
    );
    expect(rows.map((a) => a.employer)).toEqual(["Soon", "Later", "Centre", "Applied", "Undated", "Closed"]);
  });
});

describe("free allowances and the upgrade moment", () => {
  const free = (used: number): Usage => ({ plan: "free", enforced: true, interviews: { used, limit: 1 }, practice: { used: 0, limit: 1 }, reviews: { used: 0, limit: 1 } });
  it("lists the allowances for a free member only when limits are on", () => {
    expect(allowances(free(0)).map((a) => a.key)).toEqual(["interviews", "practice", "reviews"]);
    expect(allowances({ plan: "pro", enforced: true })).toEqual([]);
    expect(allowances({ ...free(0), enforced: false })).toEqual([]);
    expect(allowances(null)).toEqual([]);
  });
  it("reaches the limit when any allowance is used up, never counting an allowance of zero", () => {
    expect(limitReached(free(0))).toBe(false);
    expect(limitReached(free(1))).toBe(true);
    expect(limitReached({ ...free(0), interviews: { used: 0, limit: 0 } })).toBe(false);
    expect(limitReached({ plan: "pro", enforced: true })).toBe(false);
  });
  it("never shows a negative number left", () => expect(left({ used: 3, limit: 1 })).toBe(0));
});

describe("the Pro offer for the stage someone has reached", () => {
  const free = (o: Partial<Usage> = {}): Usage => ({ plan: "free", enforced: true, interviews: { used: 0, limit: 1 }, practice: { used: 0, limit: 1 }, reviews: { used: 0, limit: 1 }, ...o });
  const p = (key: string, extra: object = {}) => ({ key, employer: "Arup", ...extra });

  it("names the employer and what is left for online tests", () => {
    const o = proOffer(p("online-tests"), free())!;
    expect(o.headline).toBe("Online tests at Arup");
    expect(o.body).toContain("1 free practice test left");
    expect(o.urgent).toBe(false);
    expect(o.surface).toBe("stage-online-tests");
  });
  it("turns urgent once the free practice is used up", () => {
    const o = proOffer(p("online-tests"), free({ practice: { used: 1, limit: 1 } }))!;
    expect(o.urgent).toBe(true);
    expect(o.body).toContain("used your free practice tests");
  });
  it("offers mock interviews for a video interview, and the whole process for an assessment centre with a mock", () => {
    expect(proOffer(p("video-interview"), free())!.body).toContain("1 free marked mock interview left");
    expect(proOffer(p("assessment-centre", { pro: true }), free())!.body).toContain("whole Arup process");
    expect(proOffer(p("assessment-centre"), free())!.body).toContain("every firm mock process");
  });
  it("makes no offer to Pro members, when limits are off, or for stages where practice is not the next need", () => {
    expect(proOffer(p("online-tests"), { plan: "pro", enforced: true })).toBeNull();
    expect(proOffer(p("online-tests"), { ...free(), enforced: false })).toBeNull();
    expect(proOffer(p("online-tests"), null)).toBeNull();
    expect(proOffer(p("saved-first"), free())).toBeNull();
    expect(proOffer(null, free())).toBeNull();
  });
});
