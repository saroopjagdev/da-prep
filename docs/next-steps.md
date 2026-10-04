# Next steps and handover

Written 2 October 2026; updated the same day after the finance rebuild (branch `shayaan`). For launch status and steps read `docs/LAUNCH.md`. Read `README.md` for what the app is, and `AGENTS.md` before touching any Next.js code (this is Next 16, and its docs live in `node_modules/next/dist/docs/`).

## Where things stand

Built and tested: the app and its AI features, accounts and cloud sync (Supabase), limits and payments code (Stripe: £9.99 a month), security hardening, privacy notice and terms (plus legal drafts in `docs/legal/`), 42 firm profiles, 19 assessment replicas (`/tests`, including Cappfinity-style tests, job simulations, full-length Aon scales and switch puzzles), 13 firm mock processes (`/mock`) and a finance hub. 493 unit tests and 46 Playwright journeys pass (`npm test`, `npm run test:e2e`) and the production build works. Testing results: `docs/testing/phase4-report.md`.

Not yet done, in priority order:

### 1. Launch blockers that need an account, a key or a person

**Status on 3 Oct 2026**
- Done: Stripe live mode (product, £9.99 price, webhook at www.level6.uk/api/stripe/webhook, billing portal); Vercel Production vars for AI, accounts, limits; lawyer review of /privacy and /terms.
- Check `https://www.level6.uk/api/health`: `payments`, `paymentsReady` and `passSecret` must all be true after the last redeploy.
- **TODO tomorrow (4 Oct): support email.** Choose the mail router for `support@level6.uk`, set it up on the domain, then set `NEXT_PUBLIC_CONTACT_EMAIL` in Vercel Production and redeploy. The legal pages and the footer show this address.
- TODO: Resend SMTP for Supabase sign-in email (needs the level6.uk domain verified in Resend), Supabase Site URL and redirect URLs, Upstash Redis, revoke the Supabase access token used during setup.
- Dependabot: six open PRs (#1 to #6); each needs testing before merging. Master CI was red until PR #7.
See `docs/LAUNCH.md` (launch blockers and set-up steps). In short:
1. Email provider for Supabase magic links (the built-in one allows 2 emails an hour for the whole project). Resend is being set up.
2. Supabase auth settings: Site URL, redirect URLs for the production domain.
3. Stripe: product, price, webhook, customer portal, then one test-mode run (checkout, cancel, refund, account deletion with a live subscription). The Stripe code is unit tested but has never run against Stripe.
4. Upstash Redis (rate limits shared across serverless instances), Vercel project and domain, `NEXT_PUBLIC_OPERATOR_NAME` and `NEXT_PUBLIC_CONTACT_EMAIL` for the legal pages.
5. **Lawyer review of `/privacy` and `/terms`**, ICO registration, and a short DPIA (users are under 18). Do not launch publicly without this.
6. Revoke any Supabase access token used during setup.

### 1b. Opportunities research backlog (started 4 Oct 2026)
`/opportunities` lists 196 employers: 41 with a researched guide, and about 155 that are only **listed** (name and programme names in `lib/listings.ts`, status "Not confirmed"). The listed names come from public listings; they carry no dates, stages or providers on purpose.

To research an employer and move it up:
1. Find its own apprenticeship page (not a third-party summary). Read the dates and stages. If a page only describes last year's cycle, say so.
2. Add an entry to `WINDOWS` in `lib/opportunities.ts`: `name` (as in listings.ts) or `slug`, `opens`/`closes` as ISO dates (or month, or a label), `confidence`, `checked` (today), and `source` (required when there is no profile). Never infer a date.
3. For employers worth a full guide (stages, tests, reported questions), add `lib/firms/<slug>.ts` and register it in `lib/firms/index.ts`. The same `WINDOWS` entry then uses `slug`.
4. `npm test` checks every entry has a source, valid dates and a check date.

What we learned: large employers mostly advertise on their own sites (the government's Find an Apprenticeship search returned 0 results for Barclays), many publish no dates until they open (September to November), and search-engine summaries mix in previous cycles. Expect 2 to 4 page reads per employer. Re-check open rows every week or two in the application season.

Do not copy another tracker's dates, stages or assessment providers. Those are their compiled research and cannot be traced to a source we can cite.

### 2. Content (the biggest quality lever)
- **Wave 2 firms.** Ten were re-researched on 2 Oct 2026 (Aviva, Cisco, Google, JP Morgan, IBM, HSBC, BMW, Experian, Microsoft, Santander); see `docs/research/04-firm-processes-wave2.md`. The result was mostly corrections, because the official pages and candidate sites are blocked to plain fetches. The other 14 profiles (Airbus, Amazon, Arup, AtkinsRéalis, BDO, BT, Capgemini, Civil Service Fast Track (closed scheme), Goldman Sachs, Grant Thornton, JLR, Forvis Mazars, Metropolitan Police, NatWest) have not been re-verified. Method: official page first, record source and confidence, never invent.
- **Reported past questions are thin.** Several firms have none (BMW, Cisco, Experian, Microsoft, Santander, Google). Glassdoor, TheStudentRoom and Reddit return 403 to plain fetches: use browser automation or a person with a browser. Only record a question if you have a real source URL; paraphrase, tag confidence.
- **Blocked sources to retry:** Arctic Shores and HireVue official pages, the SHL OPQ fact sheet, SHL Verify Verbal, Civil Service Fast Stream tests, Talent Q Dimensions, pwc.co.uk.
- **Per-claim freshness.** Every profile carries one bulk `lastVerified` date. Add per-claim dates and structured fields (salary, deadline, status) in `lib/firms/types.ts`, and flag past-cycle dates automatically. Re-check each profile before each application cycle.
- Finish the "still to do" list in `docs/research/01-selection-process.md`.

### 3. Replicas and mock processes
- **More firms and tests.** Add mock processes for the other firms (see "How to add a firm mock" below). Missing replica formats: gamified tasks (Arctic Shores, Pymetrics, BAE), Talent Q and CCAT-style speed tests, full-length scales tests (the real ones are 37 to 49 items; ours are 18), group-exercise simulation, in-tray.
- **Item banks are small.** Adaptive pools are 28 to 32 items; real tests draw from far larger pools. Grow banks by adding generator templates and hand-written items, and keep the independent-recompute tests passing.
- **Voice answers in the mock stages** have not been exercised in an automated browser test (no microphone). Test manually on Chrome and Safari.
- **Interview prompts** in `lib/interview.ts` still use fixed stages. Mock stages score through `/api/mock/score`; consider unifying.
- **Free allowance for mocks:** a mock currently counts as one interview (2 a month on Free). Revisit once there is usage data.

### 4. Engineering
- Add Sentry (or similar) and structured logging; `/api/health` exists.
- Add real browser tests (Playwright) for the runner, the mock flow and sign-in. Today these are verified by hand.
- Full accessibility audit (only the practice tests have had a pass, plus the new components were built with labels and live regions but not audited).
- The CSP allows inline scripts; moving to a per-request nonce makes every page dynamic.
- Free-interview allowance is counted when an interview starts and can be inflated by a client faking history; the daily budget bounds the cost.
- `docs/LAUNCH.md` "Known limitations" lists more.

## How to work in this repo

```
npm install
npm run dev        # http://localhost:3000
npm test           # vitest, 493 tests
npm run test:e2e   # Playwright journeys (starts a dev server with MOCK_AI=1)
npm run check:freshness  # employer guides not re-verified in 150 days
npx tsc --noEmit && npm run lint && npm run build
```
Copy `.env.example` to `.env.local`. `MOCK_AI=1` serves canned AI output so every screen works offline (ignored in production). `.env.local` is gitignored: never commit keys.

**Rules that matter**
- Replicas use **original items**. Never copy a vendor's or employer's real questions.
- Every firm fact needs a **source URL and a confidence level** (`official`, `multiple-candidate-reports`, `single-report`, `inferred`). Say "unverified" in `gaps` rather than guess.
- Text that goes to a model must pass through `esc()` in `lib/prompt.ts`; free text from users goes through `screenText()` in `lib/server/safety.ts`; every AI route starts with `guardAi()` in `lib/server/guard.ts`.
- `lib/server/` may use the Supabase service-role key. Never import it from client code.
- Database changes are SQL files in `supabase/migrations/`, written to be safe to re-run. A new `user_data` collection needs a migration widening `user_data_key_check`, an entry in `COLLECTIONS` in `lib/backup.ts`, and care with the 1 MB per-key cap.

**How to add a firm mock** (`lib/mockprocess/definitions.ts`)
1. Make sure the firm profile in `lib/firms/<firm>.ts` is researched and its stages are accurate.
2. Add a `MockProcess`: `stageOrder` links each stage to a real `FirmStage.order`; reuse replica tests by `testId`; use `reported()` for sourced questions plus original prompts; use `NOT_REPLICATED()` for games and group exercises; put every uncertainty in `note`.
3. Run `npm test`: `tests/mockprocess.test.ts` checks the links, ordering and that no research annotation leaks into a prompt.

**How to add a replica test** (`lib/assess/`)
1. Items: add to a bank in `lib/assess/banks/` (generated items must expose an independent check; see `tests/banks-*.test.ts`).
2. Register the test in `lib/assess/tests.ts` with accurate counts and timings, `formatNotes` that say what is confirmed and what is approximated, and `sources`.
3. `tests/assess-catalog.test.ts` validates every test and that a perfect candidate scores full marks.

**Gotchas**
- Next 16 differences: the error boundary prop is `retry`, not `reset`; the middleware file is `proxy`. Check the bundled docs.
- On Windows, git prints "LF will be replaced by CRLF" warnings. They are harmless.
- When automating a browser tab that is in the background, Chrome throttles timers to about one second; drive React with microtask yields instead of `setTimeout`.
- Test data created in your own browser (localStorage keys `da-prep:*`) shows up in your Progress page: clear it after manual testing.

## Where the research lives
`docs/research/01-selection-process.md` (interim, original), `02-assessment-formats.md` (vendor formats, sourced), `03-firm-processes-wave1.md` (the eight firms). Each profile's `gaps` field lists what could not be verified.

## Home banner logos
The sliding employer banner on the home page (`components/FirmMarquee.tsx`, list in `app/page.tsx`) shows each employer's name as a wordmark. To show a logo instead, add `public/logos/<slug>.svg` (or `.png`), for example `public/logos/barclays.svg`. Only add logos you are licensed or otherwise permitted to use: they are the employers' trademarks, and the banner must not suggest the employer endorses Level6.

Banner logos and where they came from: see `docs/logo-sources.md`.

## Signup funnel counters and the email code
**Counters.** The home page and sign-in steps add one to an anonymous daily total (table `funnel_daily`; events in `lib/funnel.ts`; endpoint `app/api/event/route.ts`). No user id, IP, cookie or per-visit row is stored, and nothing is kept in the browser. Apply `supabase/migrations/20261004000000_funnel.sql` once (Supabase SQL editor). Read it with `node scripts/funnel.mjs [days]`. There is no A/B variant storage on purpose (it would need cookie-style consent), so judge a change by comparing the days before and after it. The privacy notice says this in plain words.

**8-digit email code.** The sign-in form can also take the code from the email, so a phone user does not have to leave their browser. It stays hidden until you do both of these:
1. In Supabase (Authentication, Email templates, Magic link) make the body include the code, for example:
   `<h2>Your Level6 sign-in</h2><p>Your code: <strong>{{ .Token }}</strong></p><p>Or <a href="{{ .ConfirmationURL }}">sign in with this link</a>.</p>`
2. Set `NEXT_PUBLIC_EMAIL_CODE=true` in Vercel (Production) and redeploy.
The code length is 8 and it lasts an hour (Supabase Authentication settings).
