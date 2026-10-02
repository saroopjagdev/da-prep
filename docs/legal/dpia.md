# Data Protection Impact Assessment (DRAFT)

**Status:** draft for legal review. Not legal advice. Prepared 2 October 2026 from the code in this repository.
**Controller:** [operator legal name and address]. **Contact:** [email].
**Review date:** before public launch, then every 12 months or when processing changes.

## 1. Why a DPIA
Level6 is an online service likely to be used by children (most users are 16 to 18). The ICO's Age Appropriate Design Code (Children's Code) expects a DPIA for such services. The service also sends user-written text and voice recordings to an AI provider in the United States.

## 2. What the service does
Practice tools for UK degree apprenticeship applications: AI mock interviews (text or recorded voice), practice tests, mock application processes, statement and answer review, an application tracker and a stories bank. A free tier and paid Pro plans (£17 a month subscription, or a £30 one-off 3-month pass).

## 3. Data, where it goes and why

| Data | Source | Where it's held | Purpose | Lawful basis (to confirm) | Kept for |
|---|---|---|---|---|---|
| Tracker, stories, practice scores, interview history | User | **The user's browser only**, unless they sign in | The tools the user asked for | Not received by us without an account | Until the user clears it |
| Email address | User (sign-in) | Supabase (EU, Ireland) | Account and sign-in | Contract [lawyer: confirm for 16 to 17-year-olds] | Until account deletion |
| Synced copies of the data above | User (signed in) | Supabase (EU) | Sync between devices | Contract | Until the user deletes it or the account |
| Plan, pass end date, Stripe customer ID | Stripe webhook | Supabase (EU) | Provide Pro | Contract | Account life; payment records as the law requires |
| Usage counts (interviews, reviews, AI calls a day) | Server | Supabase (EU) | Free limits, fair use and cost control | Legitimate interests | Deleted with the account |
| IP address | Request | In memory or Upstash (rate limiting) for minutes | Abuse prevention | Legitimate interests | Minutes; not linked to the profile |
| Job adverts, CV or statement text, interview answers, STAR notes | User | Sent to OpenAI (US) per request; not stored by Level6's servers | Generate questions and feedback | Contract / legitimate interests | OpenAI API retention for abuse monitoring (up to 30 days per OpenAI's policy; [confirm current terms]) |
| Voice recordings (video-style interviews only) | User | Sent to OpenAI (US) for transcription; not stored by Level6 | Transcribe spoken answers | Contract / consent via the browser permission | As above |
| Payment details | User | Stripe (EU and US) only | Take payment | Contract | Stripe's retention |
| Consent record for a purchase (adult payer, immediate start, terms) | User | Stripe payment metadata | Evidence of consumer-law consent | Legal obligation / legitimate interests | With the payment record |

**Not collected:** names (beyond what users type in, which we ask them not to), dates of birth, location, contacts, analytics, advertising identifiers, cross-site tracking.

## 4. Children's Code standards

| Standard | How the service meets it | Gaps |
|---|---|---|
| 1 Best interests | Free tier with no ads; tools support a real goal (getting an apprenticeship); support signposting in the safety filter | — |
| 2 DPIA | This document | Finish and sign off |
| 3 Age-appropriate application | Accounts are 16+ with a confirmation at sign-up; under-16s can use everything without an account (data stays on their device); payers must confirm they're 18+ | Age is self-declared; [decide whether that's proportionate] |
| 4 Transparency | Privacy notice with a short plain-English summary at the top; "just in time" notices before AI processing and voice recording | Lawyer to review the summary |
| 5 Detrimental use | No ads, no infinite feeds, no notifications, no dark patterns. The home page "streak" counts practice days only, with no pressure messages, rewards or reminders | Justify the streak here (below) |
| 6 Policies and community standards | Terms explain acceptable use and AI rules | — |
| 7 Default settings | Highest privacy by default: no account needed; data local by default | — |
| 8 Data minimisation | Only an email for accounts; content isn't stored on our servers | — |
| 9 Data sharing | Not shared or sold; never shared with employers | — |
| 10 Geolocation | Not collected | — |
| 11 Parental controls | None; service is for 16+ with optional accounts | [Confirm none needed] |
| 12 Profiling | None for marketing. The work-style questionnaire produces a profile shown only to the user, stored locally, not used for decisions | — |
| 13 Nudge techniques | No pressure to buy; Pro upsell appears only when a limit is reached | — |
| 14 Connected toys and devices | Not applicable | — |
| 15 Online tools | Users can export (Backup) and delete their account and cloud data themselves | — |

**The streak:** a daily practice count to encourage steady preparation. Lower risk because it has no notifications, no rewards, no loss messages and no social comparison. [Operator: confirm you're happy keeping it on this basis.]

## 5. Risks and controls

| Risk | Likelihood | Impact | Controls in place | Remaining risk |
|---|---|---|---|---|
| A child types personal details about themselves or others into AI features | Medium | Medium | Notices asking users not to; emails, UK phone numbers, postcodes and NI numbers are removed automatically before sending (`lib/redact.ts`); content not stored by us; OpenAI told not to train on API data | Low-Medium: names and street addresses can't be detected reliably |
| Text reveals self-harm or risk | Low | High | OpenAI moderation runs first; self-harm content returns Childline, Samaritans, SHOUT and 999 instead of feedback | Moderation fails open if unavailable; see the safeguarding policy |
| Inaccurate AI feedback harms an application | Medium | Medium | Feedback labelled as AI and possibly wrong; employer facts limited to sourced research; evaluation set ready (evals/) | Low-Medium; run the evaluations with a real key before launch |
| Account takeover | Low | Medium | Supabase magic link or Google sign-in; no passwords stored by us | Enable Supabase CAPTCHA and custom email sending |
| Cross-user data access | Low | High | Row-level security on every table; automated tests (tests/db.test.ts) | Low |
| Bypassing paid limits | Low | Low | Server-side counts; signed practice passes; daily caps | Low |
| International transfers (OpenAI, Stripe, Vercel, Google) | Certain | Medium | UK transfer safeguards (IDTA/addendum) via each provider's terms | [Lawyer: confirm each provider's transfer mechanism] |
| Minors entering contracts | Medium | Medium | Payer must confirm 18+; consent recorded with the payment | [Lawyer: confirm wording] |

## 6. Consultation
[Operator: consider asking a few students and parents to read the privacy summary and checkout wording and say whether it's clear.]

## 7. Sign-off
| Role | Name | Date | Decision |
|---|---|---|---|
| Operator | | | |
| Reviewer (lawyer) | | | |
