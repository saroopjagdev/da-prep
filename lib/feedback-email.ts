// The one "how is it going?" email, sent once to an account that has used Level6 for a while and never sent feedback.
// Pure: the sending and the database are in lib/server/feedback-email.ts. It reuses the deadline emails' unsubscribe link,
// which stops this too. Everyone gets the same three equal choices; nothing is offered in return for an answer.
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import type { Email } from "@/lib/alerts";
import { RATING_CHOICES } from "@/lib/feedback-ask";

export const FEEDBACK_ASK_KIND = "feedback-ask";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildFeedbackEmail(unsubscribeToken: string, site = SITE_URL): Email {
  const unsub = `${site}/unsubscribe?t=${unsubscribeToken}`;
  const oneClick = `${site}/api/alerts/unsubscribe?t=${unsubscribeToken}`;
  const link = (rating?: number) => `${site}/feedback?${rating ? `r=${rating}&` : ""}utm_source=email&utm_campaign=feedback-ask`;
  const footer = `You are getting this once because you have been using Level6. Stop these and deadline emails with one click: ${unsub}`;

  const text = [
    "How is Level6 going for you?",
    "",
    "You have had a go at a few things now. Tell us what is working and what is not: we read every message and it decides what we fix next. It takes a minute.",
    "",
    ...RATING_CHOICES.map((c) => `- ${c.label}: ${link(c.rating)}`),
    "",
    `Or just write to us: ${link()}`,
    "",
    footer,
    `${OPERATOR_NAME}${CONTACT_EMAIL ? `, ${CONTACT_EMAIL}` : ""}`,
  ].join("\n");

  const button = (label: string, href: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:8px 16px;border:1px solid #c9d3e3;border-radius:8px;color:#14213d;text-decoration:none;font-weight:600">${esc(label)}</a>`;
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:34rem;color:#14213d;line-height:1.5">
<p style="margin:0 0 12px"><strong>How is Level6 going for you?</strong></p>
<p style="margin:0 0 16px">You have had a go at a few things now. Tell us what is working and what is not: we read every message and it decides what we fix next. It takes a minute.</p>
<p style="margin:0 0 8px">${RATING_CHOICES.map((c) => button(c.label, link(c.rating))).join("")}</p>
<p style="color:#555;font-size:14px">Or <a href="${esc(link())}">just write to us</a>.</p>
<p style="color:#555;font-size:13px">You are getting this once because you have been using Level6. <a href="${esc(unsub)}">Stop these and deadline emails</a>.<br>${esc(OPERATOR_NAME)}${CONTACT_EMAIL ? `, ${esc(CONTACT_EMAIL)}` : ""}</p>
</div>`;

  return { subject: "How is Level6 going?", text, html, headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
