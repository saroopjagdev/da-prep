-- Deadline email alerts. A signed-in person follows employers from the tracker; once a day we email them when a followed
-- employer opens and a week before it closes. Everything here is read and written only by our server (service role): there
-- are no policies on purpose, so clients cannot read or change another person's alerts. All three tables are removed
-- with the account.
create table if not exists alert_subscriptions (
  user_id uuid not null references auth.users on delete cascade,
  employer_key text not null,
  employer_name text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, employer_key)
);
alter table alert_subscriptions enable row level security;

-- One private token per person, used only in the unsubscribe link in each email.
create table if not exists alert_prefs (
  user_id uuid primary key references auth.users on delete cascade,
  token uuid not null unique default gen_random_uuid()
);
alter table alert_prefs enable row level security;

-- What we have already emailed, so the same news is never sent twice.
create table if not exists alert_sent (
  user_id uuid not null references auth.users on delete cascade,
  event_key text not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, event_key)
);
alter table alert_sent enable row level security;
