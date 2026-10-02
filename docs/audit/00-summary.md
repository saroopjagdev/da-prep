# Phase 2 audit: summary and prioritised fix list

Date: 2 October 2026. Branch `shayaan`. Detail per area in this folder.

## How it was done
- Production build run locally; every page (78) visited in Chromium at **1366px and 375px** with automated accessibility (axe, WCAG 2.2 AA rules), sideways-scroll, console-error and link checks; Lighthouse on 8 key pages; keyboard tab-through.
- Full mock interview, tracker and statement review driven in the browser with the site's **fake-AI mode**.
- Every practice-test item checked: numbers recalculated, logic puzzles brute-forced, verbal/judgement items read.
- Database security rules tested for real against the actual migrations (22 attacks, all blocked).
- Code review of every API route, payments, limits; `npm audit`; secret scan of code and git history.

## What could NOT be tested (needs keys or web access)
| Not tested | Why | What's ready |
|---|---|---|
| Real AI question and feedback quality, consistency, injection resistance | No OpenAI key | 31 interview + 12 statement eval cases and a runner (`RUN_EVALS=1`) |
| Sign-up/login emails, cloud sync, server-side limits live | No Supabase project | Database rules tested locally (22/22) |
| Stripe checkout, webhook, portal, cancel, refund | No Stripe test keys | Code reviewed; unit tests exist |
| 229 external links on employer pages | Outbound web access blocked | Internal links all OK |
| Logged-in free vs Pro journeys in the browser | No accounts configured | Server logic reviewed and unit-tested |

## Scores (against the best competitor for each feature)
| Feature | Score | Main reasons | File |
|---|---|---|---|
| AI mock interviews | **5/10** | Interview page is generic (not firm/role aware); video mode not HireVue-accurate (60 s, unlimited re-records); no bank mocks; real AI unmeasured | 2.1 |
| Practice tests | **6/10** | Every answer correct, honest labels; small fixed banks; 5 trivial logic puzzles; no Cappfinity or job simulation | 2.2 |
| Firm profiles | **6/10** | Best-sourced in the market; 10 key finance employers missing; some 2027 dates wrong; reads like research notes | 2.3 |
| Statement review | **5/10** | Safe and honest; not firm-aware; unmeasured | 2.4-2.5 |
| Tracker | **5/10** | Works; everything typed by hand; no alerts | 2.4-2.5 |
| Accounts, payments, limits | **5/10** | Careful design; free-limit bypass; no price; checkout consumer-law gaps; untested live | 2.6 |
| Whole-site quality | **7/10** | Clean, accessible, no errors; speed 60-69 (one cause); employer pages share one title | 2.7 |
| Security and privacy | **8/10** | Rules proven, clean deps/secrets, strong headers; AI routes fail open if a setting is missing | 2.8 |
| Legal and compliance | **6/10** | Good privacy notice/terms; no operator identity, age check, DPIA, safeguarding policy | 2.9 |

## Prioritised fix-and-build list
Finance first; within each group, biggest impact for least effort first. Effort: **S** = a few hours, **M** = about a day, **L** = several days.

### Group A: quick, high-impact fixes (do first)
| # | Item | Fixes | Effort |
|---|---|---|---|
| A1 | Remove/scope the site-wide "Loading…" screen that causes the layout jump | Speed 60s → likely 90+ | S |
| A2 | Unique page titles, descriptions and share previews for every employer, sector, test and mock page | SEO | S |
| A3 | Update finance facts to 2027: Goldman (Operations route, open now), Barclays (open since Sept, £25,200), Lloyds, HSBC (Exeter, 96 UCAS), J.P. Morgan Scotland, Big 4 dates | Accuracy | S-M |
| A4 | Close the free-limit bypass, count all AI routes, add a daily cost budget, make AI routes fail closed in production | Cost, security | M |
| A5 | Mobile sideways-scroll (3 pages), home-page contrast, privacy table keyboard access, raw web addresses in text | Accessibility | S |
| A6 | Fix trivial/duplicate logic puzzles, duplicate pattern question, 2 debatable judgement answers | Test quality | S |
| A7 | HireVue mode: per-firm presets (think time, answer time, question count, re-records), one practice question, honest no-retake rule | Interview realism | M |
| A8 | "Fair use" instead of "unlimited"; age confirmation at sign-up | Legal | S |

### Group B: core finance builds
| # | Item | Effort |
|---|---|---|
| B1 | Add 10 finance employers: Bank of America, Deutsche Bank, UBS, Morgan Stanley, Citi, Rothschild & Co, BNY, CIBC, Bank of England, FCA (+ "firms that don't offer DAs" page) | L |
| B2 | Interview page: pick firm + programme; questions use the firm's process, values and reported themes; add commercial-awareness, school-leaver technical, "why apprenticeship" and ethics questions; marking rubric (structure, specificity, motivation, firm knowledge, commercial awareness, values) + "next 3 things to practise" | M-L |
| B3 | Investment-bank mock processes: Goldman Sachs, J.P. Morgan, Morgan Stanley, Bank of America, HSBC | L |
| B4 | Employer pages: plain-English "at a glance" box (dates/status, pay, length, degree), "what you'd actually do", "why this firm" talking points, buttons to matching tests/interview/mock | M |
| B5 | Finance home-page section, season calendar page, "who offers finance degree apprenticeships", myth-busting page | M |
| B6 | Tracker: add programmes from our firm data (dates, status, stages, checklist), rolling deadlines, notes | M |
| B7 | Bigger rotating test banks (numerical/verbal true-false generators, 3x judgement scenarios incl. finance) | M |
| B8 | Cappfinity-style tests (ranking/free-entry numerical, verbal, critical reasoning, time-recorded mode) | L |
| B9 | Job simulation / e-tray (inbox, mixed responses), used by HSBC/KPMG/Deloitte/EY mocks | L |
| B10 | Statement review: firm application questions and word limits, values-based criteria, "how employers view AI" explainer | M |

### Group C: payments, legal and safety (some need your decisions)
| # | Item | Needs | Effort |
|---|---|---|---|
| C1 | Checkout: price shown, pre-contract summary, immediate-start consent, payer 18+/parent | **Pricing decision** | M |
| C2 | Drafts for your lawyer: DPIA, safeguarding policy, child-friendly privacy summary, accessibility statement | — | M |
| C3 | Stripe webhook robustness (use subscription metadata, check payment status, block double subscriptions) | — | S |
| C4 | Database security test added to the repo's test suite | — | S |
| C5 | Strip phone numbers/emails before text goes to OpenAI | — | S |
| C6 | Remaining full-length/other test formats (Aon full length, NatWest Work Scenarios, SHL verbal, switchChallenge) | — | M |

### Group D: needs keys or you
| # | Item | Needs |
|---|---|---|
| D1 | Run the AI evaluation sets and tune prompts until they pass | OpenAI key |
| D2 | Stripe test-mode end-to-end and logged-in journeys | Stripe test keys + Supabase test project |
| D3 | External link check, re-verify "official" facts on live pages | Broader network access |
| D4 | Operator name, contact email, ICO fee (£52), lawyer review, Upstash, Supabase CAPTCHA/SMTP | You |

## Decisions I need from you
1. **Approve this list** (or reorder/remove items).
2. **Pricing** (for C1): Season Pass / monthly / both, and price.
3. Whether the **streak** feature stays (Children's Code nudge question; I'd keep it with no notifications or pressure messages).
