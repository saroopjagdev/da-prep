// The shared look of every email Level6 sends (deadline alerts, first steps, feedback). Pure string building so it can be
// tested. Email clients ignore most modern CSS, so this is a table layout with inline styles only, the site's own colours,
// and system fonts. The plain-text version of each email is separate and unchanged.

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const NAVY = "#13334d";
const TEAL = "#007e82";
const TEAL_SOFT = "#e6f2f2";
const INK = "#1b2829";
const MUTED = "#5d6e6f";
const LINE = "#dde3e3";
const PAGE = "#f3f6f6";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** A call to action that renders as a real button in Outlook as well as phones (a padded table cell, not just a styled link). */
export function emailButton(label: string, href: string, kind: "primary" | "secondary" = "primary"): string {
  const bg = kind === "primary" ? TEAL : "#ffffff";
  const fg = kind === "primary" ? "#ffffff" : NAVY;
  const border = kind === "primary" ? TEAL : "#b8c6c6";
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display:inline-table;margin:0 8px 8px 0"><tr><td style="background:${bg};border:1px solid ${border};border-radius:8px"><a href="${esc(href)}" style="display:inline-block;padding:11px 20px;font-family:${FONT};font-size:15px;font-weight:600;line-height:1.2;color:${fg};text-decoration:none">${esc(label)}</a></td></tr></table>`;
}

/** A short boxed note, for a date, a count or a caveat that should stand apart from the paragraph text. */
export function emailNote(innerHtml: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px"><tr><td style="background:${TEAL_SOFT};border-left:3px solid ${TEAL};border-radius:4px;padding:12px 14px;font-family:${FONT};font-size:14px;line-height:1.5;color:${INK}">${innerHtml}</td></tr></table>`;
}

/** A normal paragraph in the email's body style. */
export const emailP = (innerHtml: string, opts: { muted?: boolean } = {}) =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:${opts.muted ? 14 : 16}px;line-height:1.55;color:${opts.muted ? MUTED : INK}">${innerHtml}</p>`;

/** A link in the email's accent colour. */
export const emailLink = (label: string, href: string) => `<a href="${esc(href)}" style="color:${TEAL};font-weight:600;text-decoration:underline">${esc(label)}</a>`;

/**
 * Wrap an email body in the Level6 layout: a navy header with the name, a white card for the content, and a quiet footer.
 * `preheader` is the grey preview line some inboxes show beside the subject. `footerHtml` is the "why you got this" line
 * with its unsubscribe link, which every email must carry.
 */
export function emailShell(opts: { preheader: string; heading: string; bodyHtml: string; footerHtml: string; site: string }): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:${PAGE}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${PAGE}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px">
<tr><td style="background:${NAVY};border-radius:12px 12px 0 0;padding:18px 24px"><a href="${esc(opts.site)}" style="font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:-0.2px;color:#ffffff;text-decoration:none">Level<span style="color:#7fd1d4">6</span></a></td></tr>
<tr><td style="background:#ffffff;border:1px solid ${LINE};border-top:0;border-radius:0 0 12px 12px;padding:28px 24px 12px">
<h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:${NAVY}">${esc(opts.heading)}</h1>
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:16px 24px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED}">${opts.footerHtml}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
