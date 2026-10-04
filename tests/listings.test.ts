import { describe, expect, it } from "vitest";
import { LISTED, normName, vacancySearchUrl } from "@/lib/listings";

describe("listed employers", () => {
  it("has a name, a sector and a programme for each, with no duplicates", () => {
    for (const l of LISTED) {
      expect(l.name, l.name).toBeTruthy();
      expect(l.sectors.length, l.name).toBeGreaterThan(0);
      expect(l.sectors.every(Boolean), l.name).toBe(true);
      expect(l.programmes.length, l.name).toBeGreaterThan(0);
    }
    const keys = LISTED.map((l) => normName(l.name));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("holds no dates or assessment providers (those need a source)", () => {
    expect(JSON.stringify(LISTED)).not.toMatch(/\b(Cappfinity|Cut-e|SHL|Arctic Shores|Talent-Q|HireVue|Pymetrics)\b/);
  });

  it("normalises names so profiles and listings match", () => {
    expect(normName("J.P. Morgan")).toBe(normName("JP Morgan"));
    expect(normName("Forvis Mazars")).toBe(normName("Forvis Mazars UK"));
  });

  it("builds an official vacancy search link without guessing a careers page", () => {
    expect(vacancySearchUrl("Procter & Gamble")).toBe("https://www.findapprenticeship.service.gov.uk/apprenticeships?searchTerm=Procter%20%26%20Gamble");
  });
});
