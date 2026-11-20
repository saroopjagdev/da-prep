import { describe, expect, it } from "vitest";
import { DAY, FRESH, GAP_DAYS, LATER_DAYS, MAX_ASKS, MIN_MOMENTS, RATING_CHOICES, afterLater, afterMoment, afterNever, afterShown, parseState, ratingFromParam, shouldAsk } from "@/lib/feedback-ask";
import { buildFeedbackEmail } from "@/lib/feedback-email";

const NOW = 1_800_000_000_000;
const ready = (n = MIN_MOMENTS) => Array.from({ length: n }).reduce<typeof FRESH>((s) => afterMoment(s), FRESH);

describe("when the in-site feedback ask appears", () => {
  it("waits for a second useful result, so it is never the first thing someone meets", () => {
    expect(shouldAsk(ready(1), NOW, false)).toBe(false);
    expect(shouldAsk(ready(2), NOW, false)).toBe(true);
  });

  it("is never shown to an account that has already sent feedback", () => {
    expect(shouldAsk(ready(5), NOW, true)).toBe(false);
  });

  it("leaves a month before asking again after it was shown and ignored", () => {
    const s = afterShown(ready(), NOW);
    expect(shouldAsk(s, NOW + (GAP_DAYS - 1) * DAY, false)).toBe(false);
    expect(shouldAsk(s, NOW + GAP_DAYS * DAY, false)).toBe(true);
  });

  it('"Maybe later" is not a no: it asks again in two weeks', () => {
    const s = afterLater(afterShown(ready(), NOW), NOW);
    expect(s.stopped).toBe(false);
    expect(shouldAsk(s, NOW + (LATER_DAYS - 1) * DAY, false)).toBe(false);
    expect(shouldAsk(s, NOW + LATER_DAYS * DAY, false)).toBe(true);
  });

  it('"Don\'t ask again" stops it for good', () => {
    const s = afterNever(ready());
    expect(shouldAsk(s, NOW + 365 * DAY, false)).toBe(false);
  });

  it("never asks more than three times in all", () => {
    let s = ready();
    for (let i = 0; i < MAX_ASKS; i++) s = afterShown(s, NOW);
    expect(shouldAsk(s, NOW + 999 * DAY, false)).toBe(false);
  });

  it("copes with missing or damaged saved state", () => {
    expect(parseState(null)).toEqual(FRESH);
    expect(parseState("not json")).toEqual(FRESH);
    expect(parseState('{"moments":"x","shown":-1,"stopped":"yes"}')).toEqual(FRESH);
    expect(parseState('{"moments":3,"shown":1,"nextAt":5,"stopped":true}')).toEqual({ moments: 3, shown: 1, nextAt: 5, stopped: true });
  });
});

describe("the one-tap rating links", () => {
  it("only accept a whole rating from 1 to 5", () => {
    expect(ratingFromParam("5")).toBe(5);
    for (const bad of ["0", "6", "2.5", "abc", "", null, undefined]) expect(ratingFromParam(bad)).toBeUndefined();
  });
  it("offer the same three choices to everyone", () => {
    expect(RATING_CHOICES.map((c) => c.rating)).toEqual([5, 3, 2]);
  });
});

describe("the feedback email", () => {
  const e = buildFeedbackEmail("11111111-2222-3333-4444-555555555555", "https://example.test");
  it("links to the form with each rating and an unsubscribe, and offers nothing in return", () => {
    for (const c of RATING_CHOICES) expect(e.text).toContain(`https://example.test/feedback?r=${c.rating}&utm_source=email`);
    expect(e.text).toContain("https://example.test/unsubscribe?t=11111111-2222-3333-4444-555555555555");
    expect(e.headers["List-Unsubscribe"]).toContain("/api/alerts/unsubscribe?t=");
    expect(e.html).toContain("Not great");
    expect(`${e.subject} ${e.text}`.toLowerCase()).not.toMatch(/reward|discount|free month|prize/);
  });
});
