-- State for the daily LinkedIn job (lib/server/linkedin.ts). Written to be safe to re-run.
-- linkedin_posts: one row per post, keyed "<kind>:<date>". The row is inserted BEFORE the post is sent, so two runs can never
--   both publish the same post (the second insert hits the primary key). urn is filled in once LinkedIn accepts it.
-- linkedin_comments: every comment we have dealt with, so each is answered once. status "skipped" rows are the ones left
--   for a person; detail says why.
create table if not exists linkedin_posts (
  key text primary key,
  kind text not null,
  text text not null,
  urn text,
  posted_at timestamptz not null default now()
);
create table if not exists linkedin_comments (
  comment_urn text primary key,
  post_urn text not null,
  status text not null check (status in ('replied', 'skipped')),
  detail text not null default '',
  created_at timestamptz not null default now()
);
alter table linkedin_posts enable row level security;
alter table linkedin_comments enable row level security;
-- No policies on purpose: only our server (service role) reads or writes these.
