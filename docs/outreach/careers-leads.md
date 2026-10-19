# Getting Level6 in front of sixth-formers

A plan for new traffic, and ready-to-send text. Nothing here has been sent: read it, change the wording to sound like you, and send it yourself.

## Why this and not ads

By 19 October we had about 118 accounts but only about 20 visitors a day and under 1% paying. Sign-ups from visitors are fine (roughly 1 in 5); the problem is volume. Schools and careers advisers are the cheapest way to reach 16 to 18 year olds, because one teacher tells a whole year group, and a free, useful, printable page is easy to pass on.

## The thing to send them

`/deadlines` is a one-page, print-friendly list of who is open for the 2027 intake and when they close. It is public (no account needed), updates hourly from our tracker, and has Print and Share buttons. Send that, not the whole product.

## Tagged links (so the funnel report shows what works)

Always use these exact `utm_source` values; anything else is counted as "other". Read the results with `node scripts/funnel.mjs 14` (needs `.env.local`).

| Where you share it | Link |
| --- | --- |
| Email to a school or college careers lead | `https://www.level6.uk/deadlines?utm_source=school` (use `college` for colleges, `careers` for careers hubs and local authorities) |
| Newsletter or mailing list | `https://www.level6.uk/deadlines?utm_source=email` |
| TikTok bio or video link | `https://www.level6.uk/?utm_source=tiktok` |
| Instagram bio | `https://www.level6.uk/?utm_source=instagram` |
| Reddit or Discord reply | `https://www.level6.uk/employers/<employer>?utm_source=reddit` (or `discord`) |
| The Student Room | `https://www.level6.uk/deadlines?utm_source=studentroom` |
| WhatsApp or Snapchat group | `https://www.level6.uk/deadlines?utm_source=whatsapp` (or `snapchat`) |
| LinkedIn post | `https://www.level6.uk/deadlines?utm_source=linkedin` |

The share buttons on the site add `utm_source=share` themselves.

## Email to a careers lead (short version)

Subject: Free list of 2027 degree apprenticeship closing dates for your sixth form

> Hello,
>
> I run Level6, a free tool that helps school leavers apply for degree apprenticeships. I thought your students might find this useful: one page showing which employers are open for the 2027 intake and when they close, soonest first, with where each date came from. It updates as employers change their dates, and you can print it or save it as a PDF for a careers wall or newsletter:
>
> https://www.level6.uk/deadlines?utm_source=school
>
> Students can also make a free account to track the employers they want, and practise the tests and video interviews those employers use. There is no cost and no card needed. I'd be glad to hear if there is anything that would make it more useful for your students.
>
> Thank you,
> [Your name]
> Level6, [contact email]

Tips: send to a named careers or post-16 lead, not a generic address; one short follow-up two weeks later at most; Monday or Tuesday mornings in term time. Check each school's own contact rules before bulk emailing, and do not buy lists. Keep a simple note of who you emailed and when, and stop contacting anyone who asks you to.

## Short post for Reddit, Student Room or Discord

Only when it answers a real question, for example someone asking when an employer opens. Reply helpfully first; put the link last, once.

> Barclays and a few others are open now. This list has the closing dates for the 2027 intake with where each one came from (they can change, so check the employer's own page too): https://www.level6.uk/deadlines?utm_source=reddit

Read each community's rules about links before posting, and do not post the same message in many places.

## Short-video ideas (TikTok, Instagram Reels, YouTube Shorts)

- "Deadlines this week" (15 seconds, read from `/deadlines`).
- "What the [employer] video interview is really like" (from the employer guide and mock).
- "I applied through a degree apprenticeship, here is the order I did things in".

Put the link in your bio, tagged with the matching `utm_source`.

## Employer and university early-careers teams

Ask to be listed as a free preparation resource on their early-careers or "how to apply" pages. Some do, and links from employer sites also help search ranking. Send the `/employers/<employer>` guide for their own programme, not the home page.

## What to measure

Run `node scripts/funnel.mjs 14` weekly. For each source it shows visits, which kind of page the visit began on (home, employer guide, advice page, tool), and sign-up submits from the home page. Keep the channels that bring visitors who sign up; drop the rest. Pricing views, upgrade prompts shown and checkouts started are now counted too, so you can see whether visitors ever reach the upgrade step.
