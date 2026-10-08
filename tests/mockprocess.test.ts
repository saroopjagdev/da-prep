import { describe, expect, it } from "vitest";
import { getTest } from "@/lib/assess/tests";
import { FIRMS } from "@/lib/firms";
import { MOCKS, getMock } from "@/lib/mockprocess/definitions";

const WAVE_1 = ["pwc", "deloitte", "kpmg", "ey", "barclays", "rolls-royce", "bae-systems", "lloyds"];
const BANKS = ["goldman-sachs", "jp-morgan", "morgan-stanley", "bank-of-america", "hsbc"];
const WAVE_3 = ["amazon"];

describe("mock processes", () => {
  it("cover the hand-built firms exactly once", () => {
    expect(MOCKS.map((m) => m.firm).sort()).toEqual([...WAVE_1, ...BANKS, ...WAVE_3].sort());
  });

  it("every mock's framework fits what the scorer accepts (at most 12 items, short names)", async () => {
    const { ALL_MOCKS } = await import("@/lib/mockprocess/definitions");
    for (const m of ALL_MOCKS) {
      expect(m.framework.items.length, m.firm).toBeLessThanOrEqual(12);
      expect(m.framework.name.length, m.firm).toBeLessThanOrEqual(120);
      for (const i of m.framework.items) expect(i.length, `${m.firm}: ${i}`).toBeLessThanOrEqual(200);
    }
  });

  it("bank video stages match the video interview settings for that bank", async () => {
    const { getPreset } = await import("@/lib/hirevue");
    for (const slug of ["goldman-sachs", "morgan-stanley", "bank-of-america", "hsbc"]) {
      const v = getMock(slug)!.stages.find((s) => s.kind === "qa" && s.mode === "video");
      const p = getPreset(slug);
      expect(p.id, slug).toBe(slug);
      expect(v?.kind === "qa" && [v.prepSeconds, v.answerSeconds, v.retakes], slug).toEqual([p.thinkSeconds, p.answerSeconds, p.retakes]);
      expect(v?.kind === "qa" && v.prompts.length, slug).toBe(p.questions);
    }
  });

  it.each(MOCKS.map((m) => [m.firm, m] as const))("%s links to real firm stages and real tests", (slug, m) => {
    const firm = FIRMS.find((f) => f.slug === slug)!;
    const orders = new Set(firm.stages.map((s) => s.order));
    for (const stage of m.stages) {
      if (stage.stageOrder !== undefined) expect(orders.has(stage.stageOrder), `${stage.name}: stageOrder ${stage.stageOrder}`).toBe(true);
      if (stage.kind === "test") expect(getTest(stage.testId), `${stage.name}: ${stage.testId}`).toBeDefined();
    }
  });

  it.each(MOCKS.map((m) => [m.firm, m] as const))("%s runs its stages in the firm's order", (_slug, m) => {
    const orders = m.stages.map((s) => s.stageOrder).filter((o): o is number => o !== undefined);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(m.stages.length).toBeGreaterThanOrEqual(4);
  });

  it.each(MOCKS.map((m) => [m.firm, m] as const))("%s has usable question stages and a framework", (_slug, m) => {
    expect(m.framework.items.length).toBeGreaterThan(0);
    expect(m.stages.some((s) => s.kind === "qa" && s.mode === "interview")).toBe(true);
    for (const s of m.stages) {
      if (s.kind !== "qa") continue;
      expect(s.prompts.length, s.name).toBeGreaterThan(0);
      expect(s.answerSeconds, s.name).toBeGreaterThan(0);
      expect(s.prepSeconds, s.name).toBeGreaterThanOrEqual(0);
      const texts = s.prompts.map((p) => p.text.trim());
      expect(new Set(texts).size, `${s.name}: duplicate prompts`).toBe(texts.length);
      for (const t of texts) expect(t.length, s.name).toBeGreaterThan(15);
    }
  });

  it("states uncertainty for the least certain firm and for unreplicated stages", () => {
    const pwc = getMock("pwc")!;
    expect(pwc.confidence).not.toBe("official");
    expect(pwc.notes.join(" ")).toContain("least certain");
    for (const m of MOCKS) for (const s of m.stages) if (s.kind === "info" && /game|group|exercises/i.test(s.name)) expect(s.note, `${m.firm}: ${s.name}`).toBeDefined();
  });

  it("uses the firm's published counts where known", () => {
    const rr = getMock("rolls-royce")!.stages.find((s) => s.kind === "qa" && s.name.includes("interview"));
    expect(rr?.kind === "qa" && rr.prompts.length).toBe(7);
    const kpmgVideo = getMock("kpmg")!.stages.find((s) => s.kind === "qa" && s.mode === "video");
    expect(kpmgVideo?.kind === "qa" && kpmgVideo.prompts.length).toBe(6);
    expect(getMock("rolls-royce")!.framework.items).toHaveLength(4);
    expect(getMock("barclays")!.framework.items.map((i) => i.split(":")[0])).toEqual(["Respect", "Integrity", "Service", "Excellence", "Stewardship"]);
  });

  it("every firm case-study stimulus is a valid table", () => {
    for (const m of MOCKS) for (const s of m.stages) if (s.kind === "qa") for (const p of s.prompts) if (p.stimulus?.type === "table") for (const r of p.stimulus.rows) expect(r.length, `${m.firm} ${s.name}`).toBe(p.stimulus.columns.length);
  });
});

describe("question cleaning", () => {
  it("strips research annotations from reported questions", async () => {
    const { cleanQuestion } = await import("@/lib/mockprocess/definitions");
    expect(cleanQuestion("Why this role (for example corporate banking)? Note: the candidate was not asked 'why Barclays'.")).toBe("Why this role (for example corporate banking)?");
    expect(cleanQuestion("Describe a time you used a skill (the 'technical' questions were behavioural in style).")).toBe("Describe a time you used a skill.");
    expect(cleanQuestion("Tell me about a team success. (BrightStart)")).toBe("Tell me about a team success.");
    expect(cleanQuestion("Tell me about yourself.")).toBe("Tell me about yourself.");
  });

  it("no prompt shown to a candidate contains research annotations", () => {
    for (const m of MOCKS) for (const s of m.stages) if (s.kind === "qa") for (const p of s.prompts) expect(p.text, `${m.firm} ${s.name}`).not.toMatch(/\bNote:|candidate was|single report|reported by|\(reported/i);
  });
});
