import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs helper shared with the watcher scripts
import { byEmployer, diff, isKnown, knownEmployers, norm } from "../scripts/lead-utils.mjs";

describe("vacancy lead helpers", () => {
  it("compares employer names without punctuation, case or company suffixes", () => {
    expect(norm("J.P. Morgan")).toBe(norm("jp-morgan"));
    expect(norm("KPMG UK")).toBe("kpmg");
    expect(norm("Barclays PLC")).toBe(norm("Barclays"));
  });

  it("recognises employers we already list and flags ones we do not", () => {
    const known = knownEmployers() as Set<string>;
    expect(known.size).toBeGreaterThan(50);
    expect(isKnown(known, "Goldman Sachs")).toBe(true);
    expect(isKnown(known, "Airbus")).toBe(true);
    expect(isKnown(known, "Totally Made Up Employer 9000")).toBe(false);
    expect(isKnown(known, "")).toBe(false);
  });

  it("reports new, gone and changed records, and nothing when they match", () => {
    const a = { employer: "A", deadline: "2026-11-01" };
    const prev = { 1: { id: "1", ...a }, 2: { id: "2", employer: "B", deadline: "" } };
    const now = { 1: { id: "1", ...a, deadline: "2026-12-01" }, 3: { id: "3", employer: "C", deadline: "" } };
    const d = diff(prev, now, ["deadline"]);
    expect(d.added.map((r: { id: string }) => r.id)).toEqual(["3"]);
    expect(d.removed.map((r: { id: string }) => r.id)).toEqual(["2"]);
    expect(d.changed[0].changes).toEqual(["deadline: 2026-11-01 -> 2026-12-01"]);
    expect(diff(prev, prev, ["deadline"])).toEqual({ added: [], removed: [], changed: [] });
  });

  it("groups by employer, biggest first", () => {
    expect(byEmployer([{ employer: "A" }, { employer: "B" }, { employer: "B" }]).map(([e]: [string]) => e)).toEqual(["B", "A"]);
  });
});
