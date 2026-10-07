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
