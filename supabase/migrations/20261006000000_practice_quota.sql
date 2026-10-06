-- Weekly free allowance for practice tests, counted per account. period holds an ISO week such as '2026-W41',
-- the same period key reviews use, so both live in one usage row.
alter table usage add column if not exists practice int not null default 0;

create or replace function consume_practice(p_uid uuid, p_period text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_plan text; v_count int;
begin
  select plan into v_plan from profiles where id = p_uid;
  if v_plan = 'pro' then return true; end if;
  insert into usage (user_id, period, interviews, reviews, practice) values (p_uid, p_period, 0, 0, 0)
    on conflict do nothing;
  update usage set practice = practice + 1
    where user_id = p_uid and period = p_period and practice < p_limit
    returning practice into v_count;
  return v_count is not null;
end $$;
revoke execute on function consume_practice(uuid, text, int) from public, anon, authenticated;
