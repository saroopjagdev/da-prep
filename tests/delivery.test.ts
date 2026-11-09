import { describe, expect, it } from "vitest";
import { analyseDelivery } from "@/lib/delivery";

const sentence = "In Year 11 I led a four person robotics team and we finished the build two days early after I split the jobs by strength";

describe("delivery analysis", () => {
  it("works out pace from words and seconds", () => {
    const d = analyseDelivery(sentence, 10);
    expect(d.words).toBe(25);
    expect(d.wpm).toBeNull(); // under 15 seconds is too short to judge
    const e = analyseDelivery(Array(2).fill(sentence).join(" "), 20);
    expect(e.wpm).toBe(150);
    expect(e.pace).toBe("good");
  });

  it("flags slow and fast pace", () => {
    expect(analyseDelivery(sentence, 20).pace).toBe("slow"); // 25 words in 20 s is 75 words a minute
    expect(analyseDelivery(Array(4).fill(sentence).join(" "), 20).pace).toBe("fast"); // 100 words in 20 s is 300
  });

  it("counts fillers but not ordinary uses of like", () => {
    const text = `${sentence}. Um, I mean, it was, like, hard, you know. I like robotics and it looks like a good plan, basically uh done.`;
    const d = analyseDelivery(text, 30);
    const get = (w: string) => d.fillers.find((f) => f.word === w)?.count ?? 0;
    expect(get("um / uh / er")).toBe(2);
    expect(get("you know")).toBe(1);
    expect(get("I mean")).toBe(1);
    expect(get("basically")).toBe(1);
    expect(get("like")).toBe(1); // only the pause-set-off one
    expect(d.fillerTotal).toBe(6);
  });

  it("reports the share of the time used and gives tips", () => {
    const short = analyseDelivery("I led a team and we did well and it was good and I learned a lot from it all", 20, 120);
    expect(short.usedShare).toBeCloseTo(20 / 120);
    expect(short.tips.join(" ")).toMatch(/under half the time/);
    const full = analyseDelivery(sentence, 120, 120);
    expect(full.tips.join(" ")).toMatch(/all the time/);
  });

  it("copes with empty text", () => {
    const d = analyseDelivery("", 0);
    expect(d.words).toBe(0);
    expect(d.wpm).toBeNull();
    expect(d.fillerTotal).toBe(0);
  });
});
