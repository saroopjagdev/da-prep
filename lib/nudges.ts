// The one "first steps" email for an account that has not used anything yet. Pure: the sending and the database are in
// lib/server/nudges.ts. It reuses the deadline emails' unsubscribe link, which stops these too.
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import type { Email } from "@/lib/alerts";
import { emailButton, emailP, emailShell, esc } from "@/lib/email-layout";

export const NUDGE_KIND = "first-steps";

export function buildNudgeEmail(unsubscribeToken: string, site = SITE_URL): Email {
  const unsub = `${site}/unsubscribe?t=${unsubscribeToken}`;
  const oneClick = `${site}/api/alerts/unsubscribe?t=${unsubscribeToken}`;
  const steps = [
    ["See who is open now and when they close", `${site}/deadlines?utm_source=email&utm_campaign=first-steps`],
    ["Add the employers you like to your free tracker", `${site}/opportunities?utm_source=email&utm_campaign=first-steps`],
    ["Try a practice test: every answer is explained", `${site}/practice?utm_source=email&utm_campaign=first-steps`],
  ] as const;
  const footer = `You are getting this once because you created a Level6 account. Stop these and deadline emails with one click: ${unsub}`;

  const text = [
    "Welcome to Level6. Here are three quick ways to start:",
    "",
    ...steps.map(([label, href]) => `- ${label}: ${href}`),
    "",
    "Degree apprenticeship places often close early, so the sooner you know the dates, the better.",
    "",
    footer,
    `${OPERATOR_NAME}${CONTACT_EMAIL ? `, ${CONTACT_EMAIL}` : ""}`,
  ].join("\n");

  const html = emailShell({
    site,
    preheader: "See who is open, track your favourites, and try a practice test.",
    heading: "Welcome to Level6",
    bodyHtml: [
      emailP("Here are three quick ways to start:"),
      `<p style="margin:0 0 12px">${steps.map(([label, href], i) => emailButton(label, href, i === 0 ? "primary" : "secondary")).join("<br>")}</p>`,
      emailP("Degree apprenticeship places often close early, so the sooner you know the dates, the better.", { muted: true }),
    ].join("\n"),
    footerHtml: `You are getting this once because you created a Level6 account. <a href="${esc(unsub)}" style="color:#5d6e6f">Stop these and deadline emails</a>.<br>${esc(OPERATOR_NAME)}${CONTACT_EMAIL ? `, ${esc(CONTACT_EMAIL)}` : ""}`,
  });

  return { subject: "Three quick ways to start on Level6", text, html, headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
