-- A single "first steps" email to accounts that signed up and have not used anything yet. Off until NUDGES_ENABLED is set.
-- nudge_sent stops it ever going twice; alert_prefs.nudges_off is set by the unsubscribe link in the email.
alter table alert_prefs add column if not exists nudges_off boolean not null default false;

create table if not exists nudge_sent (
  user_id uuid not null references auth.users on delete cascade,
  kind text not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, kind)
);
alter table nudge_sent enable row level security;
-- No policies on purpose: only our server (service role) reads or writes it.

-- Accounts of a given age (in days) with a confirmed email that have not used the tracker, practice tests, mocks,
-- reviews or any AI feature, have not been sent this nudge, and have not unsubscribed. p_exclude: lower-case emails left out.
create or replace function nudge_candidates(p_kind text, p_min_days int, p_max_days int, p_exclude text[])
returns table (user_id uuid, email text)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text
  from auth.users u
  where u.email_confirmed_at is not null
    and u.created_at <= now() - make_interval(days => p_min_days)
    and u.created_at >= now() - make_interval(days => p_max_days)
    and lower(u.email) <> all (coalesce(p_exclude, '{}'))
    and not exists (select 1 from user_data d where d.user_id = u.id and jsonb_typeof(d.value) = 'array' and jsonb_array_length(d.value) > 0)
    and not exists (select 1 from usage g where g.user_id = u.id and (g.interviews > 0 or g.reviews > 0 or g.practice > 0 or g.applied))
    and not exists (select 1 from ai_usage a where a.user_id = u.id and a.calls > 0)
    and not exists (select 1 from nudge_sent n where n.user_id = u.id and n.kind = p_kind)
    and not exists (select 1 from alert_prefs p where p.user_id = u.id and p.nudges_off)
  order by u.created_at
  limit 200;
$$;
revoke execute on function nudge_candidates(text, int, int, text[]) from public, anon, authenticated;
grant execute on function nudge_candidates(text, int, int, text[]) to service_role;
