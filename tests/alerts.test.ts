import { describe, expect, it } from "vitest";
import { ALERT_CYCLE, CLOSING_SOON_DAYS, alertKey, buildEmail, daysUntil, dueAlerts } from "@/lib/alerts";
import type { OpportunityRow } from "@/lib/opportunities";

const today = new Date("2026-10-19T09:00:00Z");
const row = (o: Partial<OpportunityRow>): OpportunityRow => ({ name: "Acme", sectors: [], programmes: [], status: "open", opens: "", closes: "", rolling: false, providers: [], ...o });
const sub = (user_id: string, r: OpportunityRow) => ({ user_id, employer_key: alertKey(r) });

describe("deadline alert logic", () => {
  it("keys an employer by its guide slug, or its name reduced to letters and digits", () => {
    expect(alertKey({ slug: "goldman-sachs", name: "Goldman Sachs" })).toBe("goldman-sachs");
    expect(alertKey({ name: "Marks & Spencer (UK)" })).toBe("marksandspencer" + "uk");
  });

  it("counts whole days to a date, negative once it has passed", () => {
    expect(daysUntil("2026-10-19", today)).toBe(0);
    expect(daysUntil("2026-10-26", today)).toBe(7);
    expect(daysUntil("2026-10-18", today)).toBe(-1);
  });

  it("says an employer is open once, and not again after it has been sent", () => {
    const r = row({ closesIso: "2026-12-18" });
    const due = dueAlerts([r], [sub("u1", r)], [], today);
    expect(due.get("u1")).toMatchObject([{ kind: "open", name: "Acme", mark: [`${ALERT_CYCLE}:open:acme`] }]);
    const again = dueAlerts([r], [sub("u1", r)], [{ user_id: "u1", event_key: `${ALERT_CYCLE}:open:acme` }], today);
    expect(again.size).toBe(0);
  });

  it("warns in the last week before closing, once, and only sends that when both are due", () => {
    const r = row({ closesIso: "2026-10-24" });
    const due = dueAlerts([r], [sub("u1", r)], [], today).get("u1")!;
    expect(due).toHaveLength(1);
    expect(due[0]).toMatchObject({ kind: "closing", days: 5 });
    expect(due[0].mark.sort()).toEqual([`${ALERT_CYCLE}:closing:acme`, `${ALERT_CYCLE}:open:acme`].sort());
    const sent = due[0].mark.map((event_key) => ({ user_id: "u1", event_key }));
    expect(dueAlerts([r], [sub("u1", r)], sent, today).size).toBe(0);
  });

  it("does not warn before the last week, after closing, or for rolling employers", () => {
    const early = row({ closesIso: `2026-10-${19 + CLOSING_SOON_DAYS + 1}` });
    const done = [{ user_id: "u1", event_key: `${ALERT_CYCLE}:open:acme` }];
    expect(dueAlerts([early], [sub("u1", early)], done, today).size).toBe(0);
    const passed = row({ closesIso: "2026-10-18" });
    expect(dueAlerts([passed], [sub("u1", passed)], done, today).size).toBe(0);
    const rolling = row({ closesIso: "2026-10-22", rolling: true });
    expect(dueAlerts([rolling], [sub("u1", rolling)], done, today).size).toBe(0);
  });

  it("sends nothing for an employer that is not open, or that has gone from the tracker", () => {
    const soon = row({ status: "opening-soon" });
    const closed = row({ name: "Beta", status: "closed" });
    expect(dueAlerts([soon, closed], [sub("u1", soon), sub("u1", closed), { user_id: "u1", employer_key: "gone" }], [], today).size).toBe(0);
  });

  it("gathers one person's news together and keeps each person's separate", () => {
    const a = row({ name: "Acme" });
    const b = row({ name: "Beta", slug: "beta" });
    const due = dueAlerts([a, b], [sub("u1", a), sub("u1", b), sub("u2", a)], [], today);
    expect(due.get("u1")).toHaveLength(2);
    expect(due.get("u2")).toHaveLength(1);
  });
});

describe("the alert email", () => {
  const token = "11111111-2222-3333-4444-555555555555";
  const alerts = [
    { kind: "open" as const, key: "acme", name: "Acme <Ltd>", applyUrl: "https://acme.example/apply", closes: "18 December 2026", mark: [] },
    { kind: "closing" as const, key: "beta", name: "Beta", slug: "beta", days: 1, closes: "20 October 2026", mark: [] },
  ];

  it("has a one-click unsubscribe link in the body and the headers, and the employer's own apply link", () => {
    const e = buildEmail(alerts, token, "https://www.level6.uk");
    expect(e.subject).toBe("2 updates on employers you follow");
    expect(e.text).toContain(`https://www.level6.uk/unsubscribe?t=${token}`);
    expect(e.text).toContain("https://acme.example/apply");
    expect(e.text).toContain("Beta closes tomorrow (20 October 2026)");
    expect(e.headers["List-Unsubscribe"]).toBe(`<https://www.level6.uk/api/alerts/unsubscribe?t=${token}>`);
    expect(e.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });

  it("escapes employer names in the HTML", () => {
    const e = buildEmail(alerts, token, "https://www.level6.uk");
    expect(e.html).toContain("Acme &lt;Ltd&gt;");
    expect(e.html).not.toContain("<Ltd>");
  });

  it("names the employer in the subject when there is one update", () => {
    expect(buildEmail([alerts[0]], token).subject).toBe("Acme <Ltd> is now open for applications");
    expect(buildEmail([alerts[1]], token).subject).toBe("Beta closes tomorrow (20 October 2026)");
  });
});
