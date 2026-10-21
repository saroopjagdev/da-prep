-- Aggregate engagement numbers for the admin page (/admin): how many accounts did anything, which features they used,
-- where their tracked applications sit, and how many came back. Counts only: no email, no row-level data leaves the
-- database. p_exclude is a list of lower-case emails left out (the admins' own accounts). Service role only.
create or replace function admin_engagement(p_exclude text[]) returns jsonb
language sql stable security definer set search_path = public as $$
  with u as (
    select id, created_at from auth.users where lower(email) <> all (coalesce(p_exclude, '{}'))
  ),
  t as (
    select d.user_id,
      coalesce(sum(jsonb_array_length(d.value)) filter (where d.key = 'applications'), 0) apps,
      coalesce(sum(jsonb_array_length(d.value)) filter (where d.key = 'practice'), 0) prac,
      coalesce(sum(jsonb_array_length(d.value)) filter (where d.key = 'sessions'), 0) sess,
      bool_or(d.updated_at > u.created_at + interval '1 day') later
    from user_data d join u on u.id = d.user_id
    where jsonb_typeof(d.value) = 'array'
    group by d.user_id
  ),
  l as (
    select user_id, max(interviews) i, max(reviews) r, max(practice) p, bool_or(applied) ap from usage group by user_id
  ),
  a as (select user_id, sum(calls) c from ai_usage group by user_id),
  per as (
    select u.id, u.created_at,
      coalesce(t.apps, 0) apps, coalesce(t.prac, 0) + coalesce(l.p, 0) prac,
      coalesce(l.i, 0) + coalesce(t.sess, 0) iv, coalesce(l.r, 0) rv, coalesce(a.c, 0) ai, coalesce(t.later, false) later
    from u left join t on t.user_id = u.id left join l on l.user_id = u.id left join a on a.user_id = u.id
  ),
  stages as (
    select e ->> 'status' status, count(*) n, count(distinct d.user_id) users
    from user_data d join u on u.id = d.user_id, jsonb_array_elements(d.value) e
    where d.key = 'applications' and jsonb_typeof(d.value) = 'array'
    group by 1
  )
  select jsonb_build_object(
    'accounts', (select count(*) from per),
    'did_nothing', (select count(*) from per where apps = 0 and prac = 0 and iv = 0 and rv = 0 and ai = 0),
    'tracker', (select count(*) from per where apps > 0),
    'tracker_only', (select count(*) from per where apps > 0 and prac + iv + rv = 0),
    'practice', (select count(*) from per where prac > 0),
    'interview', (select count(*) from per where iv > 0),
    'review', (select count(*) from per where rv > 0),
    'ai', (select count(*) from per where ai > 0),
    'came_back', (select count(*) from per where later),
    'following', (select count(distinct s.user_id) from alert_subscriptions s join u on u.id = s.user_id),
    'stages', coalesce((select jsonb_agg(jsonb_build_object('status', status, 'items', n, 'users', users) order by n desc) from stages), '[]'::jsonb)
  );
$$;
revoke execute on function admin_engagement(text[]) from public, anon, authenticated;
grant execute on function admin_engagement(text[]) to service_role;
