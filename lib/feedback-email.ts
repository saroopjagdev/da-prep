// The one "how is it going?" email, sent once to an account that has used Level6 for a while and never sent feedback.
// Pure: the sending and the database are in lib/server/feedback-email.ts. It reuses the deadline emails' unsubscribe link,
// which stops this too. Everyone gets the same three equal choices; nothing is offered in return for an answer.
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import type { Email } from "@/lib/alerts";
import { RATING_CHOICES } from "@/lib/feedback-ask";
import { emailButton, emailLink, emailP, emailShell, esc } from "@/lib/email-layout";

export const FEEDBACK_ASK_KIND = "feedback-ask";

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

  const html = emailShell({
    site,
    preheader: "One tap tells us what is working and what is not.",
    heading: "How is Level6 going for you?",
    bodyHtml: [
      emailP("You have had a go at a few things now. Tell us what is working and what is not: we read every message and it decides what we fix next. It takes a minute."),
      `<p style="margin:0 0 12px">${RATING_CHOICES.map((c) => emailButton(c.label, link(c.rating), "secondary")).join("")}</p>`,
      emailP(`Or ${emailLink("just write to us", link())}.`, { muted: true }),
    ].join("\n"),
    footerHtml: `You are getting this once because you have been using Level6. <a href="${esc(unsub)}" style="color:#5d6e6f">Stop these and deadline emails</a>.<br>${esc(OPERATOR_NAME)}${CONTACT_EMAIL ? `, ${esc(CONTACT_EMAIL)}` : ""}`,
  });

  return { subject: "How is Level6 going?", text, html, headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
