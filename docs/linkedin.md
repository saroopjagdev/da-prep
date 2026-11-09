# LinkedIn: daily post and comment replies

What it does, in `lib/server/linkedin.ts`, run by the Vercel cron in `vercel.json` (08:00 UTC, Monday to Friday) at `/api/social/linkedin/run`:

1. **Posts once a day** (weekdays) from the tracker: employers closing in the next two weeks, open now, or opening soon. Every name and date comes from a tracker row.
2. **Replies to comments** on posts from the last 7 days, but only where the reply can be built from the tracker (a named employer's dates, with the day we last checked) or is a short thank-you. Everything else is left for a person and recorded as `skipped` in `linkedin_comments` (the `detail` column says why).

It uses LinkedIn's official API only. It does not scrape, comment on other people's posts, send connection requests or messages, or use any extension. LinkedIn's rules (User Agreement 8.2) ban bots doing those, and the account at risk is yours.

## The freshness gate (why it may post nothing)

A row is only used if its source is `official` and `checked` is within 14 days (`MAX_AGE_DAYS` in `lib/linkedin/content.ts`). If no row passes, that day has no post and the run says so. So the job is only as good as the tracker: work through the watcher issues (see `docs/next-steps.md`, section 1b) and keep `checked` dates current.

## Switches (all off by default)

| Variable | Effect |
| --- | --- |
| `LINKEDIN_ENABLED=true` | The job runs. Without LINKEDIN_LIVE it only returns what it would post or reply. |
| `LINKEDIN_LIVE=true` | It really posts and replies. |
| `LINKEDIN_REPLIES_ENABLED=true` | Turns on replies. Needs a company page author (below). |
| `LINKEDIN_AUTHOR_URN` | `urn:li:person:...` (your profile) or `urn:li:organization:...` (the Level6 page). |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_TOKEN_EXPIRES` | The token, and the date it stops working (warns 10 days before). |
| `LINKEDIN_API_VERSION` | Optional `Linkedin-Version` header, `YYYYMM`. Default `202610`. |

Preview a day safely (nothing is sent): with `LINKEDIN_ENABLED=true` and `LINKEDIN_LIVE` unset, call
`GET /api/social/linkedin/run?task=post` with `Authorization: Bearer $CRON_SECRET`. The response includes the full draft text.

## Setup, in order

**1. Your own profile first (works the same day).**
1. Go to https://www.linkedin.com/developers/apps and create an app. It needs a LinkedIn Page to associate with (see 2; create the page first if you have none).
2. On the app's Products tab add **Share on LinkedIn** (self-serve). That grants `w_member_social`.
3. Run the 3-legged OAuth flow with the `w_member_social` scope (the app's Auth tab has the redirect URL setup and an OAuth token tool). Copy the access token. Note the expiry LinkedIn shows.
4. Your person URN is `urn:li:person:<id>`; the id comes from `GET https://api.linkedin.com/v2/userinfo` (`sub`) with the token if you also add the "Sign In with LinkedIn using OpenID Connect" product.
5. Set the variables above in Vercel (Production), apply the migration `supabase/migrations/20261109000000_linkedin.sql`, redeploy, preview with the call above, then set `LINKEDIN_LIVE=true`.

**2. The Level6 company page (needed for reading and answering comments).**
1. Create the page at https://www.linkedin.com/company/setup/new/ (you must be a super admin).
2. On the developer app, request **Community Management API** access (Development tier). LinkedIn reviews this by hand and checks the app is verified by the page. It adds `r_organization_social_feed` and `w_organization_social_feed` (read and reply to comments) and `w_organization_social` (post as the page).
3. When approved, repeat the OAuth flow with those scopes, set `LINKEDIN_AUTHOR_URN=urn:li:organization:<page id>`, a new token and expiry, and `LINKEDIN_REPLIES_ENABLED=true`.

Reading comments on a personal profile is not available through the API (`r_member_social` is restricted), which is why replies wait for the page.

## Tokens

Access tokens are short-lived (a third-party guide says 60 days; check the expiry LinkedIn shows you). When `LINKEDIN_TOKEN_EXPIRES` is near the run returns a `warning`; when it has passed the run stops with a message. Repeat the OAuth flow and replace the two variables.

## Tracking

Every link carries `utm_source=linkedin`, `utm_campaign=<post kind or reply>` and, for posts, `utm_content=<date>`. Read results with `node scripts/funnel.mjs 14`.

## Keep it human

Posts and replies must never say they were written by a model, and nothing is sent to anyone but the audience of the page. Review `linkedin_comments` rows with `status = 'skipped'` and answer those yourself.
