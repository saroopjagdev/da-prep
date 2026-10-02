# Pricing, costs and reaching users (Phase 1.8)

Research date 2 October 2026. Labels as elsewhere. Prices via search summaries. Exchange-rate assumption: **$1 = £0.77** (JUDGEMENT; check on the day).

**Nothing here is decided.** Pricing, anything that costs money, and the legal points are your calls; this file gives options and a recommendation.

## 1. What students and parents already pay for

| Product | Price | Model | Label | Source |
|---|---|---|---|---|
| Intervyo (closest competitor) | £29.99/month; **Season Pass £139/year**; firm packs £69/£119 one-off; free tier | Subscription + season + packs | OFFICIAL | [Intervyo vs Trackr](https://www.intervyo.co.uk/compare/intervyo-vs-trackr) |
| Trackr | **£30 per season** (2027 UK Finance), +£15 per extra category; expires May | Season pass | OFFICIAL | [Trackr premium](https://the-trackr.com/premium/) |
| Hugo (AI DA interviews) | £30/month | Subscription | MULTI-REPORT | [Hugo](https://tryhugo.ai/) |
| Practice Aptitude Tests | £39/year or £29/month (as summarised); £7.99 per test | Both | MULTI-REPORT | [SoftwareSuggest](https://www.softwaresuggest.com/practice-aptitude-tests) |
| JobTestPrep | £39-£69 per licence; £99 for 3 packs / 3 months | Time-limited packs | OFFICIAL | [JTP plans](https://www.jobtestprep.co.uk/plans-faqs) |
| Graduates First | £45.95-£52.95 **lifetime** | One-off | OFFICIAL | [GF premium](https://www.graduatesfirst.com/product/assessment-tests-practice) |
| Big Interview | $39/month, $299 lifetime | Both | MULTI-REPORT | [IGotAnOffer](https://igotanoffer.com/en/advice/big-interview-alternatives) |
| Human interview coaching | £50-£150/hour; mock interview package £249 | Per session | MULTI-REPORT | [Happy Hire](https://www.wearehappyhire.com/answers/interview-coaching-guide), [Your Interview Coach](https://www.yourinterviewcoach.co.uk/pricing/) |
| Personal statement tutoring/review | £20-£70/hour; review service £95-£115; 5 sessions £495 | Per session | MULTI-REPORT | [Tutor House](https://tutorhouse.co.uk/a/personal-statement-support), [BlackStone](https://www.blackstonetutors.com/personal-statement-services/) |
| Unifrog (schools pay) | about £3,000/year for a 1,000-pupil school | School licence | MULTI-REPORT | [Chapter Schools](https://chapterschools.com/vs/unifrog) |
| Pathway CTM, Sutton Trust, Bright Network, Springpod | Free (employer- or charity-funded) | Free | OFFICIAL | `15-competitors.md` |

Takeaways (JUDGEMENT): students pay **£30-£140 a season** for digital prep; parents pay **£100-£500** for human help; a free tier is essential because strong free options exist.

## 2. Our cost per user (from the actual code)

### What the code does today
- Models (`lib/ai.ts`): **"fast" = gpt-6-luna** (interview questions, STAR drafts); **"smart" = gpt-6.1-sol** (marking interviews, mocks, reviews); **gpt-transcribe** for voice answers; moderation via `omni-moderation-latest` (free).
- System prompts are short: 616-900 characters (about 150-230 tokens) each, measured on this branch.
- Input caps: job ad and CV up to 6,000 characters each; answers up to 4,000 characters (6,000 in mocks); 5 questions per interview.
- Output caps (`maxTokens`): next question 2,000; interview score 10,000; mock stage score 9,000; review 6,000; STAR 4,000. Sol and Luna are reasoning models, so hidden reasoning counts as output tokens.
- One automatic retry on invalid JSON (rare, but can double the cost of a call).
- Limits (`lib/server/guard.ts`, `usage.ts`): 150 AI calls per user per day (Pro included); per-minute caps; Free = 2 interviews a month and 2 reviews a week.

### Prices
| Item | Price | Label | Source |
|---|---|---|---|
| gpt-6.1-sol | $2 / 1M input tokens, $10 / 1M output | MULTI-REPORT | [OpenRouter Sol](https://openrouter.ai/openai/gpt-6.1-sol), [OpenAI intro](https://openai.com/index/introducing-gpt-6-1-sol/), [eesel](https://www.eesel.ai/blog/gpt-6-1-sol-pricing) |
| gpt-6-luna | $0.10 / 1M input, $0.50 / 1M output | MULTI-REPORT | [OpenRouter Luna](https://openrouter.ai/openai/gpt-6-luna), [MarkTechPost](https://www.marktechpost.com/2026/09/22/openai-releases-gpt-6-sol-and-luna-50-cheaper-api-pricing-and-benchmarks/) |
| gpt-transcribe | $0.0045 / minute | MULTI-REPORT | [CostGoat](https://costgoat.com/pricing/openai-transcription), [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| Moderation | free | JUDGEMENT (OpenAI has long made moderation free; confirm) | — |

### Estimates (JUDGEMENT; "typical" assumes ~500-token job ad and CV, ~250-token answers, ~800 output tokens on Luna calls, ~4,000 on Sol calls; "worst" uses the caps)

| Action | Calls | Typical cost | Worst case |
|---|---|---|---|
| AI interview, typed answers (5 questions + marking) | 5 x Luna + 1 x Sol | **$0.05 (≈ 4p)** | $0.13 (≈ 10p) |
| AI interview, spoken answers (+5 x 1.5 min audio) | + transcription | **$0.085 (≈ 6.5p)** | $0.20 (≈ 15p) |
| Firm mock process (≈ 3 scored stages) | 3 x Sol (+ audio) | **$0.18 (≈ 14p)** | $0.40 (≈ 31p) |
| Statement / answer review | 1 x Sol | **$0.035 (≈ 3p)** | $0.065 (≈ 5p) |
| STAR builder | 1 x Luna | $0.002 (≈ 0.2p) | $0.003 |

Per user per month (JUDGEMENT):
- Free user at the limits (2 interviews, ~8 reviews): **≈ 40p**
- Typical Pro (10 interviews, 8 reviews, 3 mocks): **≈ £1.30**
- Heavy Pro (40 interviews, 20 reviews, 10 mocks): **≈ £5**
- **Abuse ceiling today**: 150 calls/day x up to $0.11 (scoring calls) ≈ **£12 a day per account**. Also, `/api/interview/score` and `/api/star` don't count against the free allowance, so a free account calling them directly could spend up to that ceiling. **Flag for the Phase 2 audit**: add a per-user daily *cost* budget and count scoring against the free allowance.

### Fixed monthly costs
| Service | Cost | Label | Source |
|---|---|---|---|
| Supabase Pro | $25/month (100k MAU included) | MULTI-REPORT | [UI Bakery](https://uibakery.io/blog/supabase-pricing) |
| Vercel Pro | $20/month per developer seat (+ usage beyond credit) | MULTI-REPORT | [Costbench](https://costbench.com/software/developer-tools/vercel/) |
| Upstash Redis | free tier (256 MB, 500k commands/month) | OFFICIAL | [Upstash pricing](https://upstash.com/pricing/redis) |
| Email (Resend) | free tier likely enough at first (check limits) | JUDGEMENT | — |
| Domain | about £10-£20/year | JUDGEMENT | — |
| **Total** | **≈ £40-£60/month** before scale | JUDGEMENT | — |

### Payment fees
| Item | Fee | Label | Source |
|---|---|---|---|
| Stripe, standard UK card | 1.5% + 20p | MULTI-REPORT | [We Are Founders](https://www.wearefounders.uk/stripe-fees-uk-2026/) |
| Stripe Billing (subscriptions) | 0.7% of billing volume | MULTI-REPORT | [Flexprice](https://flexprice.io/blog/stripe-pricing-breakdown-2026), [Stripe pricing](https://stripe.com/pricing) |
| One-off payment (no Billing) | card fee only | JUDGEMENT | — |
| VAT | 20%, only once taxable turnover passes the VAT threshold (check current figure with HMRC/accountant) | JUDGEMENT | — |

## 3. Recommended pricing model (JUDGEMENT; for your decision)

### Recommendation: generous Free tier + a one-off **Season Pass**, with a monthly option and school licences

| Plan | What | Price (suggested) | Why |
|---|---|---|---|
| **Free** | All firm profiles, calendar and tracker; all practice tests (fixed item sets); 2 AI interviews a month; 2 reviews a month; STAR builder | £0 | Free competitors exist (charities, Bright Network). Builds trust and SEO |
| **Season Pass** (main product) | Everything, with fair-use AI limits, from purchase until **31 August** of the application year; **one payment, no auto-renew** | **£49** (launch £39) | Matches how students apply (Sept-March); undercuts Intervyo (£139) and sits above Trackr (£30) with far more features. No auto-renew means no cancellation traps, simpler consumer-law compliance and easier for parents |
| **Monthly** | Same as Season Pass, cancel any time | **£9.99/month** | For short bursts (e.g. one HireVue next week). Needs proper auto-renewal notices |
| **Bursary** | Free Season Pass for students eligible for free school meals or bursaries, via school or charity code | £0 | Fairness; marketing; aligns with Sutton Trust/Pathway CTM partners |
| **School / college licence** | Season Pass for a year group + teacher dashboard (no student data shown without consent) | **£5 per student**, or £300-£1,500 per school (tiered) | Schools already pay ~£3k/year for Unifrog; teachers are a trusted channel |

**Under-18 payments:** contracts with minors for non-essentials are generally **voidable by the minor** ([Gillhams](https://www.gillhams.com/2022/11/28/can-minors-enter-into-contractual-agreements/), [Law and Parents](https://www.lawandparents.co.uk/minors-entering-into-contracts.html)). Suggest the payer must confirm they are **18 or over** (normally a parent or guardian), with a "send a payment link to a parent" flow. **Legal question for a lawyer**: confirm the approach, plus the 14-day cancellation right for digital content and how it applies once a student starts using AI features.

### Gross margin at the suggested prices (JUDGEMENT)
| | Season Pass £49 | Monthly £9.99 |
|---|---|---|
| Stripe fees | ≈ £0.94 (1.5% + 20p) | ≈ £0.42 (incl. 0.7% Billing) |
| VAT (only if VAT-registered; price incl. VAT) | £8.17 | £1.67 |
| AI cost, typical user | ≈ £5 over a season | ≈ £1.30 |
| AI cost, heavy user | ≈ £20 over a season | ≈ £5 |
| **Gross margin, typical, not VAT-registered** | **≈ 88%** | **≈ 83%** |
| Gross margin, typical, VAT-registered | ≈ 71% | ≈ 66% |
| Gross margin, heavy, VAT-registered | ≈ 41% | ≈ 29% |

Break-even on fixed costs (~£50/month, ~£600/year): about **14 Season Passes a year**.

## 4. How to reach users (JUDGEMENT unless sourced)

| Channel | Why | Notes / risk |
|---|---|---|
| **SEO**: pages per firm and stage ("Goldman Sachs degree apprenticeship HireVue questions", "BofA Global Markets apprenticeship deadline", "which banks offer degree apprenticeships") | Intervyo, Trackr, prep sites and TSR all rank this way; students search firm by firm | Our sourced profiles are an advantage; add the 9 missing banks first. Facts must stay current each season |
| **The Student Room** | Every firm has an annual thread; students compare progress there | Contribute genuinely (season timelines, myth-busting); disclose affiliation; TSR has paid options |
| **TikTok / Instagram / YouTube Shorts** | Where 16-18s are; "day in the life of a degree apprentice" content performs | **Children's Code and advertising rules (ASA/CAP) apply to marketing aimed at under-18s; no targeting minors by profiling.** Ask a lawyer before paid ads |
| **Reddit** (r/UKApprenticeships, r/6thForm) | Active DA communities | Couldn't research directly this session; follow sub rules |
| **Schools and careers advisers** | Teachers lack confidence in apprenticeship applications (26% vs 90% for university, UCAS/Sutton Trust) | Free teacher resources + school licence; Careers Hubs; Amazing Apprenticeships' resource listings |
| **Charities and outreach** (Pathway CTM, Sutton Trust, Young Professionals, upReach) | Trusted by students and employers | Offer bursary codes; partner rather than compete |
| **Parents** | Often pay; want safety and value | Parent guide page; clear privacy and AI-use policy |
| **Employers** (later) | Banks fund outreach (Pathway CTM is employer-funded) | Possible sponsored "insight" content; must keep independence clear |

## 5. Open questions for you
1. Season Pass vs monthly vs both, and price points.
2. Bursary scheme: yes/no, and who verifies eligibility.
3. School licences: pursue now or after launch?
4. Will you register for VAT voluntarily (affects margin)?
5. Lawyer review of the under-18 payment approach and cancellation terms.
