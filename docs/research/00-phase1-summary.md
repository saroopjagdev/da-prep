# Phase 1 research: summary

Date: 2 October 2026. Branch `shayaan`.

## Files
| File | Topic |
|---|---|
| `10-market.md` | Demand, competition, salaries, month-by-month 2027 season calendar, audience size |
| `11-finance-employers.md` | Which finance firms run Level 6 degree apprenticeships; plain-English role guide |
| `finance-firms/*.md` | One fact table per firm (19 files), plus `existing-profiles-updates.md` for firms already in the app |
| `12-online-assessments.md` | Test provider per firm; formats; screen look and feel; strategies; replica gaps |
| `13-video-interviews.md` | HireVue mechanics; per-firm settings; reported questions by type; what good answers look like |
| `14-assessment-centres.md` | Superdays, assessment centres, exercise types, what separates offers |
| `15-competitors.md` | 25+ competitors with prices and a feature table |
| `16-users.md` | Ranked student pain points |
| `17-pricing-business.md` | Prices in the market, our real AI cost per user, recommended pricing, channels |

Older files `01`-`04` are still valid background.

## How reliable this is
- **Only web search worked.** This session's network blocks opening web pages directly, including employer sites, gov.uk, Reddit and The Student Room. Every fact was seen through a **search-engine summary** of the linked page. Facts labelled OFFICIAL came from the firm's own URL but weren't read in full. Re-check before publishing as official.
- **Reddit could not be searched at all**, and TikTok/YouTube comments weren't reachable. User research leans on UCAS/Sutton Trust/ISE surveys and The Student Room summaries. "Quotes" are paraphrases.
- Where sources disagree (e.g. which test provider Deutsche Bank uses), the file shows both.

## Top 10 findings and what they mean for the site

1. **Nine finance employers with real degree apprenticeships have no profile on the site**: Morgan Stanley, Bank of America, Deutsche Bank, UBS, Citi, BNY, Rothschild & Co, CIBC and the Bank of England (plus the FCA). These are the high-finance names students search for. → Add them first, starting with BofA, Deutsche, UBS and Morgan Stanley.

2. **Several famous names don't run degree apprenticeships at all**: Lazard, BlackRock (18-month Level 4), Schroders (says so), BNP Paribas (Level 3/4), probably Nomura, Fidelity, M&G, L&G. → Say so clearly ("who actually offers a finance degree apprenticeship"). Honest, useful, and good for search traffic.

3. **The 2027 season has already started**: J.P. Morgan opened in early September; Barclays posted 2027 roles on 9 and 18 September; Goldman Sachs, Deloitte, KPMG and EY are open now. Asset managers and regulators open in January-February. → Update dates now (Barclays, Lloyds, Goldman's Operations route are out of date in the app). Build a month-by-month season plan and alerts.

4. **Competition is high and rising**: 11.3 applications per degree-level vacancy on the government site in 2025/26 (2.8 two years earlier); bank intakes are tiny (J.P. Morgan ~70 a year). → The value proposition is real; avoid any "guaranteed offer" language.

5. **The video interview is the main screen at investment banks** (Goldman, J.P. Morgan, Morgan Stanley, BofA, BlackRock), typically 30 seconds' thinking time, 2-3 minutes to answer, no retakes, one practice question. Settings differ by firm (HSBC 2 min / 2 min; UBS 1 min / 2 min; BlackRock 90 s answers). → HireVue mode needs exact per-firm presets and no-retake behaviour. Phase 2 will check what ours does now.

6. **The main test providers are SHL, Cappfinity and HireVue**; Aon matters for Morgan Stanley and Pymetrics for J.P. Morgan. → Our biggest replica gaps are **Cappfinity-style tests** (HSBC, EY, Deloitte), a **job simulation / e-tray** (HSBC, KPMG), full-length Aon scales, and SHL verbal. Don't simulate games; explain them.

7. **A direct competitor exists: Intervyo** (UK finance, firm-specific HireVue practice, tests, tracker; £29.99/month or £139/season). Trackr owns deadline tracking (£30/season). Both are built mainly for university students. → Our space is **school leavers + finance degree apprenticeships + sourced, honest facts**, priced as a season pass.

8. **Students' biggest problems**: not knowing how the process works (1 in 3 get no apprenticeship information from school; only 26% of teachers feel confident helping), juggling many portals and deadlines, long silences and no feedback, failing video interviews and numerical tests, and weak commercial awareness. → Add a guided season plan, a tracker with real dates, "what happens next" per firm, a weekly commercial-awareness brief for 17-year-olds, and a STAR builder that uses school and part-time-job examples.

9. **AI costs are low per user, but the current limits leave a gap**: a typical AI interview costs about 4-7p and a review about 3p, so a typical paying user costs about £1-£5 a season. But the daily cap (150 AI calls) allows about £12 a day per account, and two AI routes (interview marking, STAR) aren't counted against the free allowance. → Fix in Phase 2/3: a per-user daily cost budget, and count marking against free limits.

10. **Pricing**: students already pay £30-£140 per season for digital prep, and parents pay £100-£500 for human coaching. → Recommendation (your decision): **free tier + £49 one-off Season Pass (no auto-renew) + optional £9.99/month + free bursary passes + school licences**. Gross margin is about 70-88% for typical users. **Under-18s can generally cancel contracts for non-essentials**, so the payer should be an adult; this needs a lawyer's check.

## Other things I noticed
- Some forum advice says "there are no front-office apprenticeships". That's outdated: GS FICC & Equities, BofA Global Markets, Deutsche IBCM, CIBC and Rothschild Global Advisory are front office, though places are few. A myth-busting page would help students.
- Queen Mary's Applied Finance degree and Exeter are the common degree partners; a short explainer comparing them would help students choose.
- ISE: 52% of employers worry school leavers misrepresent themselves with AI; 45% give no guidance. → An AI-use policy page and "coach, don't write" design in the statement reviewer.

## Decisions I need from you (before or during Phase 2)
1. Pricing model and price points (section 3 of `17-pricing-business.md`).
2. Whether to add the "doesn't run degree apprenticeships" firms as short info pages.
3. Network access: Phase 2 and 4 go better if this environment can open web pages (for re-checking official pages and links).
4. Phase 2 needs to test the real AI and Stripe. For that I need, in this environment's settings (never pasted into chat): an **OpenAI API key**, **Stripe test-mode keys** and, ideally, a **Supabase test project**. Without them I'll test with the built-in fake AI mode and unit tests, and I'll tell you exactly what remains untested.
