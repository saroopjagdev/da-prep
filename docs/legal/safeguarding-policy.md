# Safeguarding policy (DRAFT)

**Status:** draft for review by a safeguarding adviser and lawyer. Not professional advice. Prepared 2 October 2026.
**Designated safeguarding lead:** [name, contact]. **Deputy:** [name, contact].

## 1. Scope and principles
Level6 is used mostly by 16 to 18-year-olds. We don't provide a chat service between people, don't publish user content and don't keep the text people type into AI features. So our main safeguarding duties are to:
- point anyone who seems to be at risk to help immediately;
- respond properly if someone contacts us (email or feedback) with a concern;
- keep the product design safe for young people.

The welfare of the young person comes first. Everyone involved in running Level6 reads this policy.

## 2. What the product does automatically
- **Moderation before AI.** Text written into AI features (interview answers, statements, STAR notes, job adverts) is checked by OpenAI's moderation service first (`lib/server/safety.ts`).
- **Self-harm signposting.** If the text is flagged for self-harm, no feedback is given. The user sees free, confidential support: Childline 0800 1111 (under 19s), Samaritans 116 123, text SHOUT to 85258, and 999 in an emergency.
- **Other harmful content** (for example violence or sexual content) is refused with a neutral message.
- **No storage.** Because we don't store this text, we can't identify or contact the person afterwards, and we don't monitor content.
- **Known limit:** if the moderation service is unavailable, requests go ahead without the check ("fail open"). [Decide whether to fail closed for interview answers instead, accepting some downtime.]
- The privacy notice also lists support services.

## 3. When someone contacts us with a concern
This covers an email, message or feedback that suggests a young person is at risk of harm (from themselves or others), or reports abuse, exploitation or bullying.

1. **Immediate danger:** if the message suggests someone is in immediate danger and you know where they are, call 999.
2. **Reply promptly and kindly** (within one working day; sooner if urgent). Thank them, take it seriously, don't promise confidentiality you can't keep, and give the support numbers above.
3. **Pass it to the designated safeguarding lead (DSL) the same day.**
4. **The DSL decides** whether to refer: to the police (101, or 999 in an emergency), the local authority children's services where the young person lives, or the NSPCC helpline (0808 800 5000) for advice.
5. **Record it** (see section 5).
6. **Don't investigate yourself** or contact any alleged abuser.

## 4. Concerns about someone who works on Level6
Report to the DSL, or to the deputy if the concern is about the DSL. For allegations against anyone working with children, the DSL contacts the Local Authority Designated Officer (LADO) for advice.

## 5. Records
Keep a short, factual, dated record of each concern: what was received, what was done, who it was referred to and when. Store it securely with access limited to the DSL and deputy. Keep it [for the period your adviser recommends], then delete it. Records contain personal data, so the privacy notice covers them as "safeguarding records" [add to the privacy notice].

## 6. Safe design commitments
- No messaging between users, no public profiles, no user-generated public content.
- No advertising, tracking, notifications or pressure messages.
- Feedback stays encouraging and honest; AI prompts tell the model it is speaking to a school leaver aged 16 to 19.
- Accounts are 16+; under-16s can use everything without an account.

## 7. Review
Review this policy every 12 months, after any serious incident, or when the product changes (for example if a chat or community feature is added).
