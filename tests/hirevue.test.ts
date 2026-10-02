import { describe, expect, it } from "vitest";
import { MAX_QUESTIONS } from "@/lib/interview";
import { VIDEO_PRESETS, getPreset, mmss, spoken } from "@/lib/hirevue";

describe("video interview presets", () => {
  it("are realistic and sourced", () => {
    expect(new Set(VIDEO_PRESETS.map((p) => p.id)).size).toBe(VIDEO_PRESETS.length);
    for (const p of VIDEO_PRESETS) {
      expect(p.questions, p.id).toBeGreaterThanOrEqual(1);
      expect(p.questions, p.id).toBeLessThanOrEqual(MAX_QUESTIONS);
      expect(p.thinkSeconds, p.id).toBeGreaterThanOrEqual(15);
      expect(p.answerSeconds, p.id).toBeGreaterThanOrEqual(60);
      expect(p.answerSeconds, p.id).toBeLessThanOrEqual(300);
      expect(p.retakes, p.id).toBeGreaterThanOrEqual(0);
      expect(p.source, p.id).toMatch(/^https:\/\//);
      expect(p.note.length, p.id).toBeGreaterThan(30);
    }
  });

  it("defaults to the typical preset for unknown ids", () => {
    expect(getPreset("nope").id).toBe("typical");
    expect(getPreset("blackrock").answerSeconds).toBe(90);
  });

  it("formats times", () => {
    expect(mmss(120)).toBe("2:00");
    expect(mmss(30)).toBe("0:30");
    expect(mmss(-4)).toBe("0:00");
    expect(spoken(90)).toBe("1 minute 30 seconds");
    expect(spoken(180)).toBe("3 minutes");
    expect(spoken(30)).toBe("30 seconds");
  });
});
