# Record of processing activities (DRAFT)

**Status:** draft. Prepared 2 October 2026 from the code. UK GDPR Article 30. [Operator: confirm and keep up to date.]

**Controller:** [legal name, address, email]. **Data protection lead:** [name].

| Activity | Categories of people | Categories of data | Purpose | Lawful basis (to confirm) | Recipients / processors | Transfers outside UK | Retention | Security |
|---|---|---|---|---|---|---|---|---|
| Accounts and sign-in | Users 16+ | Email; Google profile basics if used | Provide accounts | Contract | Supabase (EU); Google (US, optional) | US (Google): provider safeguards | Until account deletion | Supabase auth; RLS |
| Cloud sync | Signed-in users | Tracker, stories, practice and interview records | Sync between devices | Contract | Supabase (EU) | None | Until deleted by user | RLS; 1 MB cap per collection; tests |
| AI questions and feedback | All users | Text they enter; voice recordings for transcription | Provide feedback | Contract / legitimate interests | OpenAI (US) | US: OpenAI's UK transfer terms | Not stored by us; OpenAI API retention | Moderation; length limits; schema-checked outputs |
| Usage limits | Signed-in users | Counts per day, and a lifetime total (interviews, practice tests, reviews, AI calls) | Fair use, cost control | Legitimate interests | Supabase (EU); Upstash (rate limits) | [Upstash region: confirm] | Deleted with account | Server-only functions |
| Payments | Payers (18+) | Stripe customer ID; plan; pass end date; consent record | Take payment, provide Pro | Contract; legal obligation (accounting) | Stripe (EU/US) | US: Stripe's safeguards | As required by law (typically 6 years for accounting) | Stripe-hosted checkout; webhook signature check |
| Hosting | All visitors | IP address, request logs | Run the site; prevent abuse | Legitimate interests | Vercel (global) | US/EU: Vercel's safeguards | Vercel log retention | HTTPS; rate limiting |
| Safeguarding records | People who contact us with a concern | Contact details; description of the concern | Protect young people | Vital interests / legitimate interests / legal obligation | DSL only | None | [Per safeguarding adviser] | Restricted access |

## Processor agreements to put in place
| Processor | Agreement | Where to accept it |
|---|---|---|
| OpenAI | Data Processing Addendum | OpenAI platform settings |
| Supabase | DPA | Supabase dashboard (organisation, legal documents) |
| Vercel | DPA | Vercel dashboard or vercel.com/legal |
| Stripe | Data Processing Agreement (part of Stripe's services agreement) | Stripe dashboard |
| Upstash (if used) | DPA | Upstash console |
