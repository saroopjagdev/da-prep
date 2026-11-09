# Keeping the tracker current

The tracker (`lib/opportunities.ts`, shown on `/opportunities` and `/deadlines`, and the source for the LinkedIn posts) is only worth anything if its dates are right. The rule it has always had: **never infer a date; every row cites the page it came from and the day that page was read** (`checked`).

The problem to solve: `checked` was typed by hand, so the tracker was only as fresh as the last person who sat down with 40 browser tabs. The watchers found changes daily but nothing turned them into edits.

## The approach: prove it, or ask a person

Every day (`.github/workflows/watch-employers.yml`, then `scripts/tracker-sync.mjs`, rules in `scripts/tracker-sync-lib.mjs`) each row is put through the same question: *does a source we already cite prove the row is still true, or has changed?*

| Layer | Evidence | What happens | Who |
| --- | --- | --- |
| 1. Government advert row (source is a Find an apprenticeship advert) | The official vacancy feed read today | Still listed with the same date: `checked` is set to today. Different date: the closing date (and the same date in the note) is updated. Gone from the feed: the advert's own page is fetched, and only if it says "closed on <date>" is the row closed with that date. | Automatic, in a pull request |
| 2. Employer page row | The page's sentences about opening and closing, read today, compared with the snapshot from before the day a person last read it | Word for word the same: `checked` is set to today. | Automatic, in a pull request |
| 3. Changed page, unreadable page, or no earlier snapshot | none | Listed in the issue **Tracker rows to re-read**, which is rewritten daily. | A person reads the page |
| 4. Vacancy leads (new employers, new roles) | feeds | Issue **Vacancy leads** (comments daily). | A person researches the employer |

Layers 1 and 2 land in one pull request, `auto/tracker-sync`, rebuilt from master every day. Merging it takes a glance at the report in the description. Nothing is ever pushed to master by the workflow, and the PR is only opened after the opportunity tests pass on the changed file.

Why this is safe: a row is only touched when the evidence is the cited source itself, a "closed" claim needs the advert page to say so (not just absence from a feed, which can fail to load; the feed is also ignored if it holds under 50 adverts or is not from today), and anything doubtful goes to a person instead.

## What stays human, and why

- **Pages that block automated readers** (about 19) and pages with no stable text (news lists): the watcher cannot prove them unchanged. They sit in "Tracker rows to re-read". A person (or a monthly browser pass) reads them.
- **First read of a new row**: the page rule compares against history, so a row needs one human read; after that it stays current while the page does not change.
- **New employers and new roles**: research, never inference (`docs/next-steps.md`, section 1b).
- **A page whose wording about dates did not change but whose real dates did** (for example a date inside a script-rendered widget): the sentence comparison cannot see this. It is the reason the pull request is reviewed rather than auto-merged, and why the "Tracker rows to re-read" list exists.

## Safety nets downstream

- The `/deadlines` and `/opportunities` pages show the day each row was last checked.
- The LinkedIn job (`docs/linkedin.md`) refuses to name a row not checked in the last 14 days, so a lapse in this process makes the posts stop, not go wrong.
- `statusOf` closes a row automatically once its closing date has passed, and the pages rebuild hourly.

## Running it by hand

```
node scripts/tracker-sync.mjs --dry            # show what would change, write nothing
node scripts/tracker-sync.mjs                  # apply to lib/opportunities.ts
node scripts/tracker-sync.mjs --today 2026-11-02   # use the evidence from that day (when testing against older snapshots)
```
It needs `data/watch/state.json` and `data/watch/faa-state.json` from a watcher run, and `origin/watch-data` fetched for the history.

## One setting to switch on

The workflow opens the pull request itself only if the repository allows it: **Settings > Actions > General > Workflow permissions > "Allow GitHub Actions to create and approve pull requests"**. Until it is on, the workflow still pushes the branch and opens an issue with the compare link ("Tracker changes ready to merge").

## Later options

- A scheduled browser pass (monthly) over the pages that block automated readers.
- Auto-merge the tracker pull request when it only contains layer 1 changes and the tests pass.
