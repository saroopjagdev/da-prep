import { describe, expect, it } from "vitest";
import { nextPrompt, pipelineCounts } from "@/lib/tracker-prompts";
import type { Application, Status } from "@/lib/types";

const app = (employer: string, status: Status, deadline = ""): Application => ({ id: employer, employer, role: "", deadline, status, notes: "" });
const today = "2026-10-21";

describe("pipelineCounts", () => {
  it("counts each stage in order, leaving out Rejected", () => {
    const c = pipelineCounts([app("A", "Interested"), app("B", "Interested"), app("C", "Applied"), app("D", "Rejected")]);
    expect(c.map((x) => x.status)).toEqual(["Interested", "Applied", "Online tests", "Video interview", "Assessment centre", "Offer"]);
    expect(c.find((x) => x.status === "Interested")?.n).toBe(2);
    expect(c.find((x) => x.status === "Applied")?.n).toBe(1);
  });
});

describe("nextPrompt", () => {
  it("says nothing for an empty list or only rejections", () => {
    expect(nextPrompt([], today)).toBeNull();
    expect(nextPrompt([app("A", "Rejected")], today)).toBeNull();
  });

  it("puts the latest stage first", () => {
    const apps = [app("A", "Interested"), app("B", "Applied"), app("C", "Online tests"), app("D", "Assessment centre")];
    expect(nextPrompt(apps, today)?.key).toBe("assessment-centre");
    expect(nextPrompt(apps.slice(0, 3), today)?.key).toBe("online-tests");
    expect(nextPrompt(apps.slice(0, 2), today)?.key).toBe("applied-waiting");
  });

  it("sends an assessment centre to the employer's mock process when there is one", () => {
    const p = nextPrompt([app("Barclays", "Assessment centre")], today, (e) => (e === "Barclays" ? "/mock/barclays" : null));
    expect(p?.href).toBe("/mock/barclays");
    expect(nextPrompt([app("Other", "Assessment centre")], today)?.href).toBe("/interview");
  });

  it("warns about a saved employer closing within a week, soonest first, and ignores later or past dates", () => {
    const p = nextPrompt([app("Late", "Interested", "2026-10-30"), app("Soon", "Interested", "2026-10-24"), app("Gone", "Interested", "2026-10-01")], today);
    expect(p).toMatchObject({ key: "closing-soon", employer: "Soon" });
    expect(p?.title).toContain("in 3 days");
    expect(nextPrompt([app("Tomorrow", "Interested", "2026-10-22")], today)?.title).toContain("tomorrow");
    expect(nextPrompt([app("Late", "Interested", "2026-10-30")], today)?.key).toBe("saved-first");
  });
});
