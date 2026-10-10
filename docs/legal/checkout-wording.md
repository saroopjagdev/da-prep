# Checkout wording (DRAFT, for lawyer review)

What the Plans page (`app/pricing/page.tsx`) shows before payment, as built on 2 October 2026. Prices are set in `lib/plans.ts` and must match the Stripe prices.

Changes since the version the lawyer approved (10 October 2026, after the first line below): the free allowances drop to 1 of each, with a one-off engagement reward of 2 more of each (apply via the tracker, take a mock interview, start a practice test); the Terms (Free and Pro plans) say so and reserve the right to withdraw the bonus where it is claimed through automated or repeated use. Earlier changes (10 October 2026): the free trial of Pro is removed; the free allowances (2 practice tests, 2 CV and statement reviews, 2 marked AI mock interviews) are now a total per account that does not renew, rather than weekly; the "Before you pay" block is cut to one paragraph (price, renewal, starts straight away, cancel any time) and links to the terms for the 14-day right to cancel, who the seller is and how payment is handled. Those details now sit in the Terms (Free and Pro plans, Who we are).

## Plans
- **Pro monthly, £9.99 a month.** "Renews every month until you cancel. Cancel any time from your account; Pro stays on until the end of the month you've paid for."

## "Before you pay" summary (one paragraph)
- "[plan]: [price], renewing until you cancel. Pro starts as soon as payment goes through, and you can cancel any time from this page. Full details, including your 14-day right to cancel and who you're buying from, are in the terms." (links to /terms)

## Free plan (as shown on the Plans page and in the Terms)
- Free account, no card, 16 or over. In total, per account, not renewing: 1 practice test, 1 CV and statement review and 1 marked AI mock interview (text or video, with feedback out of 100). Engagement reward: once an account has applied to an employer through the tracker (followed its Apply link), taken a marked AI mock interview and started a practice test, it gets 2 more of each, once.
- Firm mock processes are not part of the free plan; they are part of Pro.
- Browsing the opportunities tracker, employer guides and advice guides needs no account.

## Required confirmations (all three, checked again on the server and stored with the payment)
1. "The person paying is 18 or over. (If you're under 18, ask a parent or guardian to pay.)"
2. "I want Pro to start straight away, and I understand that if I cancel within 14 days I'll get a refund minus a fair amount for the time I've used."
3. "I agree to the terms and privacy notice."

## Questions for the lawyer
1. Is Pro best treated as a **digital service** (14-day cancellation with a proportionate deduction, as written) or **digital content** (right lost once supply begins with consent and acknowledgement)?
2. Is the 18+ payer confirmation enough, given most account holders are 16 to 17?
3. VAT: [operator: VAT registered or not?] Do prices need "including VAT"?
4. Trader information: is a contact email plus legal name enough, or is a geographic address needed on the page?
5. DMCC Act (expected spring 2027): what renewal reminders and cancellation steps should Pro monthly add before then?
