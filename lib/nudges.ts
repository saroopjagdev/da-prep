// The one "first steps" email for an account that has not used anything yet. Pure: the sending and the database are in
// lib/server/nudges.ts. It reuses the deadline emails' unsubscribe link, which stops these too.
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import type { Email } from "@/lib/alerts";

export const NUDGE_KIND = "first-steps";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:34rem;color:#14213d;line-height:1.5">
<p style="margin:0 0 12px"><strong>Welcome to Level6.</strong> Here are three quick ways to start:</p>
<ul style="margin:0 0 16px;padding-left:20px">
${steps.map(([label, href]) => `<li style="margin:0 0 6px"><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
</ul>
<p style="color:#555;font-size:14px">Degree apprenticeship places often close early, so the sooner you know the dates, the better.</p>
<p style="color:#555;font-size:13px">You are getting this once because you created a Level6 account. <a href="${esc(unsub)}">Stop these and deadline emails</a>.<br>${esc(OPERATOR_NAME)}${CONTACT_EMAIL ? `, ${esc(CONTACT_EMAIL)}` : ""}</p>
</div>`;

  return { subject: "Three quick ways to start on Level6", text, html, headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
