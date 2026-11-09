// Decides whether a comment on one of our posts gets an automatic reply, and writes it. Pure.
//
// The rule is narrow on purpose. We reply only when the whole reply can come from the tracker or is a short thanks:
//   - a short thank-you gets a short thank-you back (the wording varies by comment, so it does not read as a stamp);
//   - a question about when a named employer opens or closes gets that employer's row, with the day it was last checked.
// Everything else (complaints, anything about a person, long comments, links, questions we cannot answer from sourced
// data, or an employer whose row fails the freshness gate) is left for a person. Nothing here ever invents a date.
import { SITE_URL } from "@/lib/site";
import type { OpportunityRow } from "@/lib/opportunities";
import { STATUS_LABEL, formatWhen } from "@/lib/opportunities";
import { passesGate } from "@/lib/linkedin/content";

export type Comment = { id: string; urn: string; actor: string; text: string; parent?: string };
export type Decision = { reply: string; why: "thanks" | "employer-dates" } | { skip: string };

const MAX_LENGTH = 400;
const THANKS = /^\s*(thanks?|thank you|cheers|great|brilliant|useful|helpful|love this|well done|excellent|fantastic|really good|good stuff)\b[\s\S]{0,100}$/i;
const ASKS_ABOUT_DATES = /\b(when|open|opens|opening|close|closes|closing|deadline|date|dates|apply|applications?)\b/i;
const NEEDS_A_PERSON = /\b(refund|complain|unfair|scam|lawyer|solicitor|gdpr|delete my|data protection|disab|ill|unwell|anxious|struggl|bullied|suicid|self[- ]harm|abuse|safeguard)/i;

const THANKS_REPLIES = [
  "Thank you, glad it's useful. If anything looks out of date, tell us and we'll check the employer's page.",
  "Thanks for reading. We re-check each employer's own page regularly, and flag when we last did.",
  "Much appreciated. Say if there's an employer you'd like us to add.",
];

/** A stable small number from the comment id, so the same comment always gets the same wording. */
const pick = (id: string) => [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** The one employer a comment names, or null when it names none or several (then a person should look). */
export function namedEmployer(text: string, rows: OpportunityRow[]): OpportunityRow | null {
  const t = ` ${norm(text)} `;
  const hits = rows.filter((r) => {
    const n = norm(r.name);
    return n.length >= 3 && t.includes(` ${n} `);
  });
  return hits.length === 1 ? hits[0] : null;
}

function datesReply(r: OpportunityRow): string {
  const bits: string[] = [`${r.name}: ${STATUS_LABEL[r.status].toLowerCase()}`];
  if (r.status === "open" || r.status === "closed") {
    if (r.closesIso) bits.push(`closes ${r.closes}`);
    else if (r.rolling) bits.push("applications are reviewed as they arrive and close when the role is full");
  }
  if (r.status === "opening-soon" && r.opens) bits.push(`opens ${r.opens}`);
  const link = r.slug ? `${SITE_URL}/employers/${r.slug}?utm_source=linkedin&utm_campaign=reply` : `${SITE_URL}/deadlines?utm_source=linkedin&utm_campaign=reply`;
  return `${bits.join(", ")}. We last checked their page on ${formatWhen(r.checked!)}. Always confirm on the employer's own site before applying: ${link}`;
}

export function decideReply(c: Comment, ownActor: string, rows: OpportunityRow[], today: string): Decision {
  if (c.actor === ownActor) return { skip: "our own comment" };
  const text = c.text.trim();
  if (!text) return { skip: "empty" };
  if (text.length > MAX_LENGTH) return { skip: "long comment: a person should read it" };
  if (/https?:\/\/|www\./i.test(text)) return { skip: "contains a link" };
  if (NEEDS_A_PERSON.test(text)) return { skip: "sensitive wording: a person should reply" };

  const row = namedEmployer(text, rows);
  if (row && ASKS_ABOUT_DATES.test(text) && text.includes("?")) {
    if (!passesGate(row, today)) return { skip: `${row.name}: dates not fresh enough to quote` };
    return { reply: datesReply(row), why: "employer-dates" };
  }
  if (THANKS.test(text) && !text.includes("?")) return { reply: THANKS_REPLIES[pick(c.id) % THANKS_REPLIES.length], why: "thanks" };
  return { skip: "not a thank-you or a dates question we can answer from the tracker" };
}
