import { describe, expect, it } from "vitest";
import { overlap, repeats, extraBlocks, extraAdvice } from "@/lib/firms/dedupe";
import { FIRMS } from "@/lib/firms";
import { natwest } from "@/lib/firms/natwest";

describe("firm de-duplication", () => {
  it("scores repeats high and unrelated text low", () => {
    expect(overlap("Do the practice tests first", "Take the platform practice tests first")).toBeGreaterThan(0.6);
    expect(overlap("Apply on opening day", "Pre-employment screening by a case handler")).toBeLessThan(0.3);
    expect(repeats("", ["anything"])).toBe(false);
  });

  it("hides blocks a stage already states, and keeps ones it does not", () => {
    const labels = extraBlocks(natwest).map((x) => x.label);
    expect(labels).not.toContain("Video interview"); // stage 5 says the same
    const novel = { ...natwest, videoInterview: { text: "Candidates record answers on a tablet in a booth with a mentor present.", source: "x", confidence: "single-report" as const } };
    expect(extraBlocks(novel).map((x) => x.label)).toContain("Video interview");
  });

  it("never hides every block of every firm's advice", () => {
    for (const f of FIRMS) if (f.specificAdvice.length > 3) expect(extraAdvice(f).length, f.slug).toBeGreaterThan(0);
  });
});

import { directory, shortTiming } from "@/lib/directory";

describe("employer directory timing", () => {
  it("keeps the first sentence and cuts long text at a word", () => {
    expect(shortTiming("Opens in Spring.")).toBe("Opens in Spring.");
    const long = shortTiming("word ".repeat(60))!;
    expect(long.length).toBeLessThanOrEqual(141);
    expect(long.endsWith("…")).toBe(true);
    expect(shortTiming(undefined)).toBeUndefined();
  });

  it("carries timing and the research date for firms with a profile", () => {
    const nw = directory().find((e) => e.slug === "natwest")!;
    expect(nw.timing).toContain("Spring");
    expect(nw.verified).toBe("2026-10-03");
  });
});
