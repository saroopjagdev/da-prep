# Level6

AI mock interviews, practice tests, an application tracker and guides for UK degree apprenticeship applicants.

## Features
- **Mock interview** (`/interview`): pick an employer and programme from the researched guides (or paste a job advert) and an interview type (motivation, competency, strengths, commercial awareness, technical, ethics); questions use the firm's process, values and reported questions, and marking rates six skills with three next steps. Each question has its own planned theme so none repeat; text, or timed video style (60s) that is spoken only, with no typing: a microphone picker and test, a live level meter, live captions where the browser supports them, your voice recorded and transcribed, and the transcript shown read-only before marking (video style needs `https` or `http://localhost`: browsers block the microphone on network addresses such as `http://192.168.x.x`); optional read-aloud, text-mode dictation and camera self-view; STAR feedback, score and stronger sample answers.
- **Practice tests** (`/practice`): 48 original SJT, numerical, verbal and logical questions with explanations, timers and a review of the ones you missed.
- **Assessment replicas** (`/tests`): 19 tests that follow the published format of real employer assessments (SHL Verify Interactive numerical, inductive and deductive; Aon-style statements in short and full length; switch puzzles; Cappfinity-style numerical, verbal and critical reasoning, time-recorded; two inbox job simulations; four situational judgement formats including finance scenarios and SHL work scenarios; two work-style questionnaires) with original questions. Larger pools rotate between attempts. Each shows what is confirmed and what is approximated. Engine in `lib/assess/` (item kinds, scoring, adaptive approximation, validation), banks in `lib/assess/banks/`, catalogue in `lib/assess/tests.ts`.
- **Firm mock processes** (`/mock`): Goldman Sachs, J.P. Morgan, Morgan Stanley, Bank of America, HSBC, PwC, Deloitte, KPMG, EY, Barclays, Rolls-Royce, BAE Systems and Lloyds, stage by stage in the firm's real order, with replica tests, video-style questions, exercises and interviews marked against the firm's own values (`lib/mockprocess/`). Research behind both is in `docs/research/02` and `03`.
- **CV checker** (`/cv`): paste a CV for school-leaver-specific feedback (score, fixed checklist, section notes, bullet rewrites), optionally checked against an employer or advert. Contact details, links and dates of birth are stripped server-side before the text reaches the AI (`redactForCv`), the CV is not stored, and it counts as one of the free reviews.
- **Statement review** (`/review`): choose the employer and the application question (with its word limit where known); feedback on five criteria, plus what employers say about AI. **Stories bank** with AI STAR builder (`/stories`).
- **Tracker** (`/tracker`): add a programme from the employer guides with its stages as a checklist and last cycle's dates; closing-date warnings and calendar (.ics) export.
- **Employers** (`/employers`): 42 sourced guides with an at-a-glance box, what you'd actually do, why-this-firm talking points and links to matching practice; plus finance firms without a degree route.
- **Finance hub** (`/finance`): who hires, a month-by-month application calendar and myths checked against sources.
- **Progress** (`/progress`): score trend, STAR coverage, and every past interview with full feedback.
- **Sectors** (`/sectors`): what is shared by every degree apprenticeship and what differs for seven sector groups.
- **Content**: process guide, tips (tests, video interviews, assessment centres), timeline, employers, FAQ.
- **Data**: backup/restore as JSON and clear local data from the account page.
- Optional **accounts + cloud sync** (Supabase) and **free-tier limits + Pro** (Stripe): £9.99 a month.

## Run
```
cp .env.example .env.local   # add OPENAI_API_KEY, or set MOCK_AI=1 to develop without one
npm install
npm run dev                  # http://localhost:3000
npm test                     # vitest (unit, integration, database security with PGlite)
npm run test:e2e             # Playwright journeys on desktop and phone sizes
npm run lint && npx tsc --noEmit && npm run build
```
Without Supabase env vars the app is local-only (data in the browser). Without Stripe / `ENFORCE_LIMITS`, everything is free.

`MOCK_AI=1` serves canned AI responses so every screen can be developed and tested offline. It is ignored in production builds.

## Enabling accounts
1. Create a Supabase project and apply `supabase/migrations/*.sql` (SQL editor or `supabase db push`). The migration is safe to re-run.
2. Enable Email (magic link) and, optionally, Google in Auth providers; add your site URL to the redirect list.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Enabling limits and payments
1. In Stripe, create a Pro product with one recurring price that matches `lib/plans.ts` (£9.99 a month, GBP). Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`. Checkout refuses to take money if the Stripe price's amount, currency or interval differs from `lib/plans.ts`.
2. Point a webhook at `/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.updated` and `customer.subscription.deleted`; set `STRIPE_WEBHOOK_SECRET`. Pro is only granted once a payment is marked paid, and the subscription sets `profiles.plan`. Enable the customer portal in the Stripe dashboard (Settings, Billing, Customer portal) so "Manage or cancel" works.
3. Limits switch on automatically in production once Supabase is configured (set `ENFORCE_LIMITS=false` to opt out, or `true` to force them on in development). All AI routes then require sign-in, share a 150-calls-a-day budget per user (`DAILY_AI_CALLS` in `lib/server/guard.ts`) plus a daily cap per expensive route, and free users get 2 interviews, 2 practice tests and 2 reviews in total (`FREE_INTERVIEWS`, `FREE_PRACTICE`, `FREE_REVIEWS` in `lib/plans.ts`, counted against `FREE_PERIOD`); Pro has fair-use limits only. Starting an interview or mock process issues a signed practice pass (`lib/server/pass.ts`) that its follow-up questions, marking and transcription must present, so the free allowance can't be skipped.
4. Production: set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` so rate limits are shared across serverless instances, and `NEXT_PUBLIC_OPERATOR_NAME` / `NEXT_PUBLIC_CONTACT_EMAIL` for the legal pages.

## Deploying
Any Node host works (Vercel is the simplest). Set the environment variables above, including `NEXT_PUBLIC_SITE_URL`. CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and a build on every push and pull request.

## Layout
- `app/` pages and API routes (`app/api/*`); `components/` shared UI; `lib/` prompts, schemas, question bank, sector packs, store, backup and calendar helpers; `lib/server/` service-role helpers (never import from client code); `supabase/migrations/`; `tests/`.
- AI provider: OpenAI Responses API in `lib/ai.ts`. Two tiers, set by `OPENAI_MODEL` (marking and feedback, default `gpt-6.1-sol`) and `OPENAI_MODEL_FAST` (questions and STAR drafts, default `gpt-6-luna`), and `OPENAI_TRANSCRIBE_MODEL` (video-style voice answers, default `gpt-transcribe`). Requests use `store: false`. Canned dev responses: `lib/mocks.ts`.

## Before going public
See `docs/LAUNCH.md` for the launch blockers, set-up steps and verdict, and `docs/testing/phase4-report.md` for test results. In short: the privacy notice and terms need a lawyer's review; Stripe and Google sign-in are untested against live services; Supabase's built-in email is capped at 2 per hour, so add an SMTP provider; employer data in `lib/firms/*` and `lib/employers.ts` needs ongoing re-verification.
