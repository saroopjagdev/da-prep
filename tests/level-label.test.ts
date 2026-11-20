import { describe, expect, it } from "vitest";
import { levelInfo } from "@/lib/level-label";
import { opportunityRows } from "@/lib/opportunities";
import { SECTOR_IDS } from "@/lib/sectors";

describe("level labels for lists", () => {
  it("say plainly when an employer has no degree apprenticeship, and when one is degree level", () => {
    expect(levelInfo({ pageSlug: "dains", programmes: [] })).toEqual({ label: "No degree apprenticeship found", tone: "other" });
    expect(levelInfo({ pageSlug: "cranswick", programmes: [] }).tone).toBe("degree");
    expect(levelInfo({ pageSlug: "aon", programmes: [] })).toEqual({ label: "Level not stated", tone: "unknown" });
  });

  it("read a listing's own title when we hold no page, and never guess beyond it", () => {
    expect(levelInfo({ programmes: ["Degree Apprenticeship Programme 2027"] }).tone).toBe("degree");
    expect(levelInfo({ programmes: ["School Leaver Programme 2027"] })).toEqual({ label: "Level not confirmed", tone: "unknown" });
  });

  it("every sector has employers to show, including law and public sector", () => {
    const rows = opportunityRows(new Date());
    for (const id of SECTOR_IDS) expect(rows.filter((r) => r.sectors.includes(id)).length, id).toBeGreaterThan(0);
    expect(rows.filter((r) => r.sectors.includes("law")).length).toBeGreaterThanOrEqual(5);
    expect(rows.filter((r) => r.sectors.includes("public")).length).toBeGreaterThanOrEqual(6);
  });
});
