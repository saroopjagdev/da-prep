-- The one "how is Level6 going?" email: accounts that have used something, never sent feedback, and were not asked before.
-- Reuses nudge_sent (kind 'feedback-ask') so it can never go twice, and alert_prefs.nudges_off (the unsubscribe link).
-- Off until FEEDBACK_EMAILS_ENABLED is set. p_exclude: lower-case emails left out. Safe to run again.
create or replace function feedback_ask_candidates(p_kind text, p_min_days int, p_max_days int, p_exclude text[])
returns table (user_id uuid, email text)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text
  from auth.users u
  where u.email_confirmed_at is not null
    and u.created_at <= now() - make_interval(days => p_min_days)
    and u.created_at >= now() - make_interval(days => p_max_days)
    and lower(u.email) <> all (coalesce(p_exclude, '{}'))
    and (
      exists (select 1 from user_data d where d.user_id = u.id and jsonb_typeof(d.value) = 'array' and jsonb_array_length(d.value) > 0)
      or exists (select 1 from usage g where g.user_id = u.id and (g.interviews > 0 or g.reviews > 0 or g.practice > 0 or g.applied))
      or exists (select 1 from ai_usage a where a.user_id = u.id and a.calls > 0)
    )
    and not exists (select 1 from feedback f where f.user_id = u.id)
    and not exists (select 1 from nudge_sent n where n.user_id = u.id and n.kind = p_kind)
    and not exists (select 1 from alert_prefs p where p.user_id = u.id and p.nudges_off)
  order by u.created_at
  limit 200;
$$;
revoke execute on function feedback_ask_candidates(text, int, int, text[]) from public, anon, authenticated;
grant execute on function feedback_ask_candidates(text, int, int, text[]) to service_role;
