# Launch guide

Written 2 October 2026 for branch `shayaan`. Plain-English steps to take Level6 live, what must happen first, how to run it once it's live, and an honest verdict. Replaces `docs/launch-checklist.md`.

## Verdict: not ready for public launch yet, but close

**The product is built and tested as far as possible without real accounts.** 493 automated tests and 46 browser journeys pass. Every one of 105 pages passes automated accessibility checks on desktop and phone. Key pages score 90-100 on Lighthouse, the production build handled about 1,000 requests a second without errors, and no known security issues remain.

**What stops a public launch today** is not code. It's five things that need you:
1. A lawyer's review of the legal drafts (`docs/legal/`), the privacy notice and the terms, plus the ICO fee.
2. Your legal name and contact email on the site.
3. The real AI checked for quality (the evaluation set is ready; it needs an OpenAI key and about 10p).
4. Stripe set up and a test purchase of each plan run end to end.
5. Supabase email sending (the built-in service only allows a few sign-in emails an hour).

**Recommended path:** do steps 1 to 6 below, run a **private beta** with 10 to 30 students for two to three weeks (the app works fully without payments switched on), then switch on payments and launch publicly. The application season is open now, so a beta in October and a public launch in November catches most of the remaining deadlines (many banks close in January).

## 1. Launch blockers (must do)
| # | What | Who | Cost |
|---|---|---|---|
| 1 | Lawyer reviews `docs/legal/*`, `/privacy`, `/terms` and the checkout wording (questions listed in `docs/legal/checkout-wording.md`) | You + lawyer | Lawyer's fee |
| 2 | Pay the ICO data protection fee | You | Likely £52 a year (Tier 1) |
| 3 | Set `NEXT_PUBLIC_OPERATOR_NAME` and `NEXT_PUBLIC_CONTACT_EMAIL`; decide VAT status | You | Free |
| 4 | Sign the processor agreements: OpenAI, Supabase, Vercel, Stripe, Upstash (click-through in each dashboard; list in `docs/legal/records-of-processing.md`) | You | Free |
| 5 | Run the AI evaluations and fix anything out of band: `RUN_EVALS=1 OPENAI_API_KEY=... npx vitest run tests/evals.test.ts` | Me, with a key | About 10p a run |
| 6 | Stripe test-mode run: buy monthly, cancel; buy the pass, refund it; resend a webhook; delete an account with a live subscription | You + me | Free in test mode |
| 7 | Supabase custom email (SMTP), e.g. Resend | You | Free tier is enough to start |
| 8 | Name a designated safeguarding lead and finish `docs/legal/safeguarding-policy.md` with an adviser | You | Adviser's time |

## Live site status (from Saroop's notes, 2 October 2026)
- The site is live at **https://www.level6.uk** (the bare `level6.uk` redirects there). Use the `www` address everywhere: `NEXT_PUBLIC_SITE_URL=https://www.level6.uk`, Supabase's Site URL, and especially the **Stripe webhook URL `https://www.level6.uk/api/stripe/webhook`** (Stripe doesn't follow redirects).
- When last checked, the live `/api/health` showed AI, accounts and payments all off: the Vercel Production environment variables weren't set. Set them and redeploy (`NEXT_PUBLIC_*` values are fixed at build time).
- The live site deploys from `master`. Shayaan's branch was reviewed and merged into master on 2 October 2026, with the 3-month pass removed (Pro is one £9.99 a month plan), so it goes live with the next deploy.
- **Stripe test mode is set up with the £9.99 a month price**, which is the agreed price. Checkout verifies the Stripe price against `lib/plans.ts` before taking money. Create the same price again in live mode and set `STRIPE_PRICE_ID` in Vercel.

## 2. Set-up steps, in order
1. **Supabase** (accounts and sync). Apply every file in `supabase/migrations/` in order. Under Authentication: Site URL = your domain; Redirect URLs = `https://<domain>/**`; magic-link expiry 15 minutes; turn on CAPTCHA; set custom SMTP. Make sure `NEXT_PUBLIC_SUPABASE_URL` is just `https://<project>.supabase.co` (the app now copes with a pasted `/rest/v1/`, but fix the setting anyway).
2. **OpenAI.** Create an API key; set a monthly spending limit in the OpenAI dashboard (the app also caps each user at 150 AI calls a day).
3. **Stripe.** One Pro product with one price: £9.99 a month, recurring, GBP. Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`. Webhook to `/api/stripe/webhook` with `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.updated` and `customer.subscription.deleted`; set `STRIPE_WEBHOOK_SECRET`. Turn on the customer portal.
4. **Upstash Redis** (free tier) so rate limits work across servers: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
5. **Vercel.** Import the repo, set every variable in `.env.example` plus `NEXT_PUBLIC_SITE_URL`, set `PASS_SECRET` to a long random string of its own (practice sessions are signed with it; do not reuse the Supabase service-role key), deploy, connect the domain. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` too: the per-session and daily caps only hold across servers with it.
6. **Check `/api/health`** on the live site: everything you set up should say `true` (`paymentsReady` and `contactSet` included).
7. **Google sign-in** (optional): OAuth client in Google Cloud, then enable it in Supabase.

## 3. Before going public: manual checks
- [ ] Sign in by email and Google on a phone and a laptop; save tracker items; check they sync; delete the account.
- [ ] One real interview of each type, one video interview on Chrome and Safari, one bank mock, one statement review.
- [ ] Type a self-harm test phrase into an answer and check the support message appears.
- [ ] Buy each plan in Stripe test mode and check `/pricing` shows the right state; refund the pass and check Pro ends.
- [ ] Run a link checker over the employer guides (outbound links couldn't be checked from this environment).
- [ ] Quick screen-reader pass (VoiceOver on iPhone, NVDA on Windows) through the interview and a test.
- [ ] Re-read every employer guide's dates for the current season (`npm run check:freshness`).

## 4. Running it once it's live
| Need | Recommendation | Decision needed? |
|---|---|---|
| **Uptime** | Point a free monitor (e.g. UptimeRobot or Better Stack) at `https://<domain>/api/health` every 5 minutes, alerting your email | No, free |
| **Errors** | Start with Vercel's logs. Add Sentry (free tier) if volume grows, but it sends error details to a US company: scrub request bodies, sign its DPA and add it to the privacy notice | **Yes** (privacy) |
| **Analytics** | The privacy notice promises **no analytics**. If you want numbers, use a cookieless, privacy-first tool (Vercel Web Analytics or Plausible), update the privacy notice and the DPIA first, and never track individuals | **Yes** (privacy, Children's Code) |
| **Costs** | OpenAI spending cap; per-user daily caps already enforced; watch the OpenAI usage page weekly in the first month | No |
| **Backups** | Check your Supabase plan's backups (the free plan has limited or no point-in-time recovery). Users without accounts keep data on their device and can download a backup from the tracker | **Yes** if you need paid backups |
| **Emails** | Sign-in emails via your SMTP provider; Stripe sends receipts. Before the DMCC subscription rules start (expected spring 2027), add renewal reminders for Pro monthly | Later |
| **Rollback** | Vercel keeps every deployment; "Promote to production" on the previous one undoes a bad release in seconds | No |
| **Security** | Dependabot and `npm audit` run in CI; revoke any setup access tokens; rotate keys if anyone leaves | No |

## 5. Keeping content fresh
Employer facts go out of date every year; this is the biggest quality risk.
- **Late August, every year:** run `npm run check:freshness`, then re-verify each employer guide (dates, pay, entry grades, process), the season calendar (`lib/finance.ts`) and the myths page. Update `lastVerified` only after re-checking.
- **September to January:** check the big banks' pages every two weeks while applications are open; adverts change.
- **Rules:** every fact needs a source URL and a confidence label; write "not confirmed" rather than guess; never copy real test questions.
- Research notes live in `docs/research/`; the method is in `docs/next-steps.md`.

## 6. Known limitations (be honest with users)
- **AI feedback** has only been tested with canned responses here. It must be evaluated with the real model before launch, and it can still be wrong.
- **Replica tests copy formats, not real questions.** They aren't calibrated against real norm groups, so scores aren't predictions.
- **Employer facts** were mostly gathered through search summaries, because direct page access was blocked in this environment. Each fact is labelled and sourced, but official pages should be re-read by a person.
- **Games and group exercises** (Arctic Shores, Pymetrics, BAE games, assessment-centre group tasks) aren't simulated.
- **Voice answers** have been tested with a fake microphone in Chromium only.
- **The CSP allows inline scripts** (Next.js needs them without per-request nonces).

## Where everything is
- What testing found: `docs/testing/phase4-report.md`
- Audit and fix list: `docs/audit/`
- Research: `docs/research/`
- Legal drafts: `docs/legal/`
- Handover for developers: `docs/next-steps.md` and `README.md`
