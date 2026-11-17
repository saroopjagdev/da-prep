-- Feedback people send through the site, and the few comments chosen to be shown on it.
-- Everyone who signs in can send feedback, whatever they think of Level6: nothing here routes people by their rating.
-- A comment is only ever public when BOTH the person ticked the permission (may_quote) and an admin chose it (featured).
-- No policies on purpose: only our server (service role) reads or writes it. Safe to run again.
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  rating smallint check (rating is null or rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 1000),
  may_quote boolean not null default false,
  display_name text check (display_name is null or char_length(display_name) between 1 and 40),
  featured boolean not null default false,
  -- A comment cannot be shown without the permission and the name the person chose.
  constraint feedback_featured_needs_permission check (not featured or (may_quote and display_name is not null))
);
alter table feedback enable row level security;
create index if not exists feedback_user_idx on feedback (user_id);
create index if not exists feedback_featured_idx on feedback (created_at desc) where featured;
