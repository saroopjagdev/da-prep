-- One-off 3-month Pro pass alongside the monthly subscription. A pass sets pro_until; the subscription sets plan.
-- Someone is Pro while either is true, so a lapsed pass or cancelled subscription falls back to Free on its own.
alter table profiles add column if not exists pro_until timestamptz;

create or replace function is_pro(p_uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select plan = 'pro' or coalesce(pro_until > now(), false) from profiles where id = p_uid), false);
$$;
revoke execute on function is_pro(uuid) from public, anon, authenticated;

create or replace function consume_interview(p_uid uuid, p_period text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  if is_pro(p_uid) then return true; end if;
  insert into usage (user_id, period, interviews) values (p_uid, p_period, 0)
    on conflict do nothing;
  update usage set interviews = interviews + 1
    where user_id = p_uid and period = p_period and interviews < p_limit
    returning interviews into v_count;
  return v_count is not null;
end $$;
revoke execute on function consume_interview(uuid, text, int) from public, anon, authenticated;

create or replace function consume_review(p_uid uuid, p_period text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  if is_pro(p_uid) then return true; end if;
  insert into usage (user_id, period, interviews, reviews) values (p_uid, p_period, 0, 0)
    on conflict do nothing;
  update usage set reviews = reviews + 1
    where user_id = p_uid and period = p_period and reviews < p_limit
    returning reviews into v_count;
  return v_count is not null;
end $$;
revoke execute on function consume_review(uuid, text, int) from public, anon, authenticated;

-- Extend a pass by whole months from whichever is later: now or the current end date. Called by the Stripe webhook
-- (service role) once a pass payment is confirmed. Returns the new end date.
create or replace function extend_pro_pass(p_uid uuid, p_months int)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v_until timestamptz;
begin
  insert into profiles (id) values (p_uid) on conflict do nothing;
  update profiles
    set pro_until = greatest(coalesce(pro_until, now()), now()) + make_interval(months => p_months)
    where id = p_uid
    returning pro_until into v_until;
  return v_until;
end $$;
revoke execute on function extend_pro_pass(uuid, int) from public, anon, authenticated;

-- Take months back off a pass when its payment is refunded (never earlier than now). Service role only.
create or replace function shorten_pro_pass(p_uid uuid, p_months int)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v_until timestamptz;
begin
  update profiles
    set pro_until = case when pro_until is null then null else greatest(now(), pro_until - make_interval(months => p_months)) end
    where id = p_uid
    returning pro_until into v_until;
  return v_until;
end $$;
revoke execute on function shorten_pro_pass(uuid, int) from public, anon, authenticated;
