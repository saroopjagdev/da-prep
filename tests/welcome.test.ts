import { describe, expect, it } from "vitest";
import { STARTER_TARGET } from "@/lib/dashboard";
import { gateLabel, isFunnelEvent } from "@/lib/funnel";
import { welcomeProgress, welcomeSteps } from "@/lib/welcome";

const none = { tracked: 0, practice: 0, sessions: 0 };

describe("the Get set up checklist", () => {
  it("lists three steps in order, none done for a new account", () => {
    const steps = welcomeSteps(none);
    expect(steps.map((s) => s.key)).toEqual(["track", "practice", "mock"]);
    expect(steps.every((s) => !s.done)).toBe(true);
    expect(welcomeProgress(steps)).toMatchObject({ done: 0, total: 3, complete: false });
    expect(welcomeProgress(steps).next?.key).toBe("track");
  });

  it("needs the same number of tracked employers as the Start here card", () => {
    expect(welcomeSteps({ ...none, tracked: STARTER_TARGET - 1 })[0].done).toBe(false);
    expect(welcomeSteps({ ...none, tracked: STARTER_TARGET })[0].done).toBe(true);
    expect(welcomeSteps(none)[0].title).toContain(String(STARTER_TARGET));
  });

  it("marks a step done by using it once, and points at the first step still to do", () => {
    const steps = welcomeSteps({ tracked: STARTER_TARGET, practice: 1, sessions: 0 });
    expect(steps.map((s) => s.done)).toEqual([true, true, false]);
    const p = welcomeProgress(steps);
    expect(p).toMatchObject({ done: 2, total: 3, complete: false });
    expect(p.next?.key).toBe("mock");
  });

  it("is complete, with nothing left to do, once all three are done", () => {
    const p = welcomeProgress(welcomeSteps({ tracked: 5, practice: 2, sessions: 1 }));
    expect(p.complete).toBe(true);
    expect(p.next).toBeNull();
  });

  it("links each step to a real page", () => {
    expect(welcomeSteps(none).map((s) => s.href)).toEqual(["/opportunities", "/practice", "/interview"]);
  });
});

describe("welcome and gate counters", () => {
  it("lets the browser count the two checklist steps", () => {
    expect(isFunnelEvent("welcome_view")).toBe(true);
    expect(isFunnelEvent("welcome_click")).toBe(true);
  });

  it("labels a sign-up gate with the tool it was shown on", () => {
    expect(gateLabel("/practice")).toBe("practice");
    expect(gateLabel("/mock/hsbc")).toBe("mock");
    expect(gateLabel("/games/stroop")).toBe("games");
    expect(gateLabel("/interview/")).toBe("interview");
    expect(gateLabel("/")).toBe("");
    expect(gateLabel("")).toBe("");
  });
});
