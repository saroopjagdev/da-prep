# Competitor layouts (viewed 3 Oct 2026, public logged-out pages)

Pages viewed: the-trackr.com (home), app.the-trackr.com/uk-finance (tracker table), intervyo.co.uk (home).
Feature and pricing research is in `15-competitors.md`; this note is about page layout only.

## What each does

**Intervyo home** (single long page): top nav with Features, Browse, Firm Packs, Pricing; a prominent "Search firms" action
next to "Start free"; then one block per product (HireVue practice, live interview, psychometric tests) each with an
example report or question beside the text; a four-step "alert, prep, track, offer" flow; pricing on the home page; sample
testimonials and statistics; a short FAQ; a closing call to action.

**Trackr home**: dark hero with two actions (Browse Trackers, Get Started); a grid of tracker categories; counts of
employers and opportunities; a "Resource Hub" of timeline guides (including a UK finance apprenticeship timeline).

**Trackr tracker table**: one dense table. Search, filter by your own status, filter by open status, tabs by programme
type; rows grouped by firm tier; columns for company, programme, opening date, closing date and latest stage; open and
closed dates colour-coded; a per-row "my status" dropdown.

## What we changed to align

| Pattern | Where it matters | Change |
|---|---|---|
| Firm search as a first-class action | Visitors arrive thinking of an employer | Home hero search sends people to `/employers?q=`; list prefills from it |
| Dates visible in the list | Trackr's core value | Each employer row shows a short sourced timing line and the research date; "researched process guide only" filter and a result count |
| Pricing and FAQ on the home page | Intervyo converts on one page | Home now has a plans teaser (Free / Pro £9.99 a month, from `lib/plans.ts`) and four quick answers, with no FAQ markup |
| One area per job | Intervyo groups by product | Tab switchers for practice tests and written feedback; single nav entries |

## Not copied, on purpose

- Colour-coded open/closed status and exact dates: our profile `timeline` fields are free text, so a computed status
  would be a guess. This needs structured `opens`/`closes` dates added to each researched profile first.
- Email alerts when applications open: needs an email service and a consent flow.
- Testimonials and "got an offer" claims: we have no real ones, and we do not make them up.
- Outcome statistics: we do not have our own data.
