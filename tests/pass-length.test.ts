import { describe, expect, it } from "vitest";
import { PASS_PLAN, PASS_SAVING_PENCE, passEnds, passSavingText } from "@/lib/plans";

describe("how long a Season Pass lasts", () => {
  it("is six months from the moment it was bought", () => {
    expect(PASS_PLAN.months).toBe(6);
    expect(passEnds(new Date("2026-11-12T10:00:00Z")).toISOString()).toBe("2027-05-12T10:00:00.000Z");
    expect(passEnds(new Date("2026-09-01T00:00:00Z")).toISOString()).toBe("2027-03-01T00:00:00.000Z");
  });

  it("crosses the year end", () => {
    expect(passEnds(new Date("2026-12-20T08:30:00Z")).toISOString()).toBe("2027-06-20T08:30:00.000Z");
    expect(passEnds(new Date("2027-08-15T12:00:00Z")).toISOString()).toBe("2028-02-15T12:00:00.000Z");
  });

  it("ends on the last day of a shorter month, not in the next one", () => {
    expect(passEnds(new Date("2026-08-31T12:00:00Z")).toISOString()).toBe("2027-02-28T12:00:00.000Z");
    expect(passEnds(new Date("2027-08-31T12:00:00Z")).toISOString()).toBe("2028-02-29T12:00:00.000Z"); // 2028 is a leap year
    expect(passEnds(new Date("2026-05-31T12:00:00Z")).toISOString()).toBe("2026-11-30T12:00:00.000Z");
  });
});

describe("what the Season Pass saves", () => {
  it("is six months of monthly Pro minus the pass price, and is stated on the page", () => {
    expect(PASS_SAVING_PENCE).toBe(2094);
    expect(passSavingText()).toContain("£20.94");
    expect(passSavingText()).toContain("£9.99 a month for 6 months");
  });
});
