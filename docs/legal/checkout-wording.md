# Checkout wording (DRAFT, for lawyer review)

What the Plans page (`app/pricing/page.tsx`) shows before payment, as built on 2 October 2026. Prices are set in `lib/plans.ts` and must match the Stripe prices.

Changes since the version the lawyer last saw (7 October 2026): the free plan now includes one marked AI mock interview a week (it was none); firm mock processes are stated as Pro-only; "written feedback" is now called "CV and statement review". Terms (Free and Pro plans) were updated to match, and the "What you get" summary now lists the first three Pro items so it includes mock processes.

## Plans
- **Pro monthly, £9.99 a month.** "Renews every month until you cancel. Cancel any time from your account; Pro stays on until the end of the month you've paid for."

## "Before you pay" summary
- **You're buying:** [plan]: [price]. Prices are in pounds sterling.
- **What you get:** Unlimited practice tests. Unlimited AI mock interviews, within fair-use limits (up to 25 marked interviews a day). Every firm mock process, stage by stage. (CV and statement review, within fair-use limits of up to 40 a day, is listed on the plan card; the summary shows the first three items.)

## Free plan (as shown on the Plans page and in the Terms)
- Free account, no card, 16 or over. Each week: 2 practice tests, 2 CV and statement reviews and 1 marked AI mock interview (text or video, with feedback out of 100). Allowances reset on Monday.
- Firm mock processes are not part of the free plan; they are part of Pro.
- Browsing the opportunities tracker, employer guides and advice guides needs no account.
- **How billing works:** [plan summary above].
- **Starting and cancelling:** "Pro starts as soon as payment goes through. You have 14 days to cancel. Because you're asking Pro to start straight away, if you cancel within those 14 days we'll refund you minus a fair amount for the time you've already had Pro."
- **Who you're buying from:** [operator name] · [contact email]. "Payments are handled securely by Stripe; we never see your card details."

## Free trial of Pro (NEW, 8 October 2026, for lawyer review)
A 2-day free trial, once per person, on top of the free plan. It is a Stripe subscription trial: the card is taken at the start, Pro is on straight away, and the card is charged £9.99 automatically when the trial ends unless the person cancels first.

What the person sees, and where:
- **Plans page, before payment:** a "Free trial" line in the "Before you pay" summary: "2 days free if you start with the trial. You enter a card now. If you do not cancel before [exact date and time, 48 hours from now], your card is charged £9.99 then, and every month after, until you cancel. You can cancel any time from this page. The free trial is once per person." Two buttons: "Start my 2-day free trial" and "Subscribe now without the trial: £9.99 a month". The same three confirmations are required.
- **Stripe checkout page:** "Free for 2 days, then £9.99 a month until you cancel. Your card is charged automatically when the trial ends unless you cancel first from the Plans page on Level6."
- **Every prompt that offers the trial:** "Card needed. 2 days free, then £9.99 a month unless you cancel first."
- **During the trial:** a banner on every page: "Pro trial: [time left] left. Your card is charged £9.99 on [date and time] unless you cancel first. Manage or cancel." It turns amber in the last 24 hours. The dashboard plan card and the Plans page show the same.
- **Terms:** new section "Free trial of Pro". Privacy notice: records whether the trial was used and when it ends.
- **Limits during the trial:** AI features have lower daily caps than normal Pro fair use (about 5 marked interviews and 10 reviews a day, 60 AI calls a day in total), disclosed in the Terms in general terms.
- **Abuse:** one trial per account, and none for anyone who has had a subscription. A card is needed, which deters repeat trials, but the same card on a new account is not blocked.

Questions for the lawyer:
1. Is the pre-contract information sufficient for a trial that converts to a paid subscription (price after the trial, date of first charge, how to cancel, renewal)?
2. The 14-day right to cancel is stated as running from the day the trial starts. Is that right, and does a charge at the end of day 2 need any extra wording?
3. DMCC Act (expected spring 2027): we show a countdown and the charge date in the app; Stripe can also send a trial-ending email. Do we need a separate reminder before the first charge, and by what channel?
4. Most account holders are 16 to 17 but the payer must be 18 or over. Is the existing 18+ payer confirmation enough for a trial that needs a card?
5. May we refuse a second trial where we suspect repeat sign-ups, as the Terms say?

## Required confirmations (all three, checked again on the server and stored with the payment)
1. "The person paying is 18 or over. (If you're under 18, ask a parent or guardian to pay.)"
2. "I want Pro to start straight away, and I understand that if I cancel within 14 days I'll get a refund minus a fair amount for the time I've used."
3. "I've read this summary and agree to the terms and privacy notice."

## Questions for the lawyer
1. Is Pro best treated as a **digital service** (14-day cancellation with a proportionate deduction, as written) or **digital content** (right lost once supply begins with consent and acknowledgement)?
2. Is the 18+ payer confirmation enough, given most account holders are 16 to 17?
3. VAT: [operator: VAT registered or not?] Do prices need "including VAT"?
4. Trader information: is a contact email plus legal name enough, or is a geographic address needed on the page?
5. DMCC Act (expected spring 2027): what renewal reminders and cancellation steps should Pro monthly add before then?
