import { describe, expect, it } from "vitest";
import type { Usage } from "@/components/useUsage";
import { allowances, countdown, daysLeft, left, limitReached, pipelineRows, shortDate } from "@/lib/dashboard";
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
