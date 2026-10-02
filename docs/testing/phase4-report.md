# Phase 4: testing report

Date: 2 October 2026. Branch `shayaan`. Everything below was run in this session unless it says otherwise.

## Summary
| Area | Result |
|---|---|
| Unit and integration tests (`npm test`) | **493 passed**, 2 skipped (the live AI evaluations, which need an OpenAI key) |
| End-to-end journeys (`npm run test:e2e`) | **46 passed**: 8 journeys and 15 page checks, on desktop and phone sizes |
| Hostile input against every API route | **75 cases passed**: clean 4xx responses, no crashes, no leaked internals, no AI calls on bad input |
| Database security (row-level security, quotas, Pro pass) | **12 checks passed** on the real migrations (PGlite) |
| Accessibility crawl | **105 pages × 2 sizes**: 0 axe violations, no sideways scrolling, one main heading each, no page errors |
| Lighthouse (production build, 10 key pages) | Performance 90-100 (mobile), 96-100 (desktop); accessibility 100; best practices 100; SEO 100 (tracker 63 on purpose: it is excluded from search) |
| Load (production build, 50 connections, 15 s each) | 750-1,070 requests a second, p99 under 125 ms, 0 errors |
| Abuse (20 connections hammering an AI route) | 8,017 requests all refused cleanly (sign-in required in production), server stayed healthy |
| Dependencies (`npm audit`, all and production-only) | 0 vulnerabilities |
| Security headers | CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy and Permissions-Policy present; no `X-Powered-By` |
| Type check and lint | Clean (9 existing style warnings, 0 errors) |

## What testing found and fixed
1. **Mock process pages were slow on phones** (Lighthouse 78): the browser built every practice test bank. The server now passes only the tests a mock uses. Mobile performance 97-98; main-thread blocking 760 ms to 140 ms.
2. **Mock pages jumped while loading** (layout shift 0.675 on phones): the intro now renders straight away. Shift 0.
3. **Supabase address with `/rest/v1/` broke sign-in**: this environment's `NEXT_PUBLIC_SUPABASE_URL` ends in `/rest/v1/`. The client and the security policy now use the bare origin whatever is configured. Worth correcting the setting itself too (it should be `https://<project>.supabase.co`).
4. **Security-policy warning in every browser**: the zod library probes for `eval`, which the policy blocks. Zod's jitless mode is now on in the browser. Best practices 100.
5. **A flaky test under load**: a 22-request rate-limit test hit its 5-second timeout when run alongside the database test; it now has 20 seconds.
6. Earlier in this phase: **duplicate subscriptions** (two checkout tabs) and **pass refunds** are now handled; **personal details** (emails, phone numbers, postcodes, NI numbers) are removed before text reaches the AI.

## How to run it
- Unit and integration: `npm test`
- End-to-end: `npm run test:e2e` (starts or reuses a dev server on port 3001 with canned AI)
- Live AI evaluations: `RUN_EVALS=1 OPENAI_API_KEY=... npx vitest run tests/evals.test.ts` (about 5-10p)
- CI (`.github/workflows/ci.yml`): lint, type check, unit tests, audit and build, plus a new e2e job. It runs on pull requests and on pushes to `master`, so it hasn't run on this branch yet.

## Not tested, and why
| Not tested | Why | What it needs |
|---|---|---|
| Real AI quality (questions, marking, transcription) | No OpenAI key in this environment; all AI used canned responses | Run the live evaluations (43 cases ready in `evals/`) and tune prompts |
| Real payments end to end | No Stripe test keys | Stripe test mode: buy both plans, cancel, refund, resend webhooks |
| Real sign-in and sync | Supabase isn't reachable from this environment | A Supabase test project; sign in, sync, delete account |
| Moderation and self-harm signposting with the real service | Needs the OpenAI key | One manual check with a test phrase |
| External links (sources, employer pages) | Outbound web requests are blocked here | A link checker run where the network allows it |
| Screen readers and real disabled users | Automated tools only | Manual testing with NVDA/VoiceOver, and ideally a few users |
| Real phones and Safari | Chromium only | A quick pass on an iPhone and an Android phone |
| Load on the real host and AI rate limits | Local production build only; AI routes need keys | A short load test after deployment, with Upstash configured |
