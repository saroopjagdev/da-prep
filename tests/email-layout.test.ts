import { describe, expect, it } from "vitest";
import { buildEmail } from "@/lib/alerts";
import { emailButton, emailShell, esc } from "@/lib/email-layout";
import { buildFeedbackEmail } from "@/lib/feedback-email";
import { buildNudgeEmail } from "@/lib/nudges";

describe("email layout", () => {
  it("escapes what it is given", () => {
    expect(esc(`<a href="x">&`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;");
    expect(emailButton('Go "now"', "https://x.test/?a=1&b=2")).toContain("https://x.test/?a=1&amp;b=2");
  });
  it("wraps content with the brand header, a hidden preview line and the footer", () => {
    const html = emailShell({ site: "https://x.test", preheader: "Preview <text>", heading: "Hello", bodyHtml: "<p>Body</p>", footerHtml: "Footer" });
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Level<span");
    expect(html).toContain("Preview &lt;text&gt;");
    expect(html).toContain("<p>Body</p>");
    expect(html).toContain("Footer");
  });
  it("puts every email in the layout and keeps an unsubscribe link in each", () => {
    const emails = [
      buildEmail([{ kind: "open", name: "Acme", closes: "1 Dec", slug: "acme", applyUrl: "https://acme.test/apply" } as never], "tok", "https://x.test"),
      buildNudgeEmail("tok", "https://x.test"),
      buildFeedbackEmail("tok", "https://x.test"),
    ];
    for (const e of emails) {
      expect(e.html).toContain("<!doctype html>");
      expect(e.html).toContain("https://x.test/unsubscribe?t=tok");
      expect(e.text).toContain("https://x.test/unsubscribe?t=tok");
      expect(e.headers["List-Unsubscribe"]).toContain("tok");
    }
  });
});
