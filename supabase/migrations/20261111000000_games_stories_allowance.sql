-- Free allowances for practice game rounds and AI-drafted STAR stories, counted per account in the same lifetime usage
-- row as interviews, reviews and practice tests. Pro is not counted. Safe to run again.
alter table usage add column if not exists games int not null default 0;
alter table usage add column if not exists stories int not null default 0;

create or replace function consume_game(p_uid uuid, p_period text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_plan text; v_count int;
begin
  select plan into v_plan from profiles where id = p_uid;
  if v_plan = 'pro' then return true; end if;
  insert into usage (user_id, period, interviews, reviews, practice, games, stories) values (p_uid, p_period, 0, 0, 0, 0, 0)
    on conflict do nothing;
  update usage set games = games + 1
    where user_id = p_uid and period = p_period and games < p_limit
    returning games into v_count;
  return v_count is not null;
end $$;
revoke execute on function consume_game(uuid, text, int) from public, anon, authenticated;
grant execute on function consume_game(uuid, text, int) to service_role;

create or replace function consume_story(p_uid uuid, p_period text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_plan text; v_count int;
begin
  select plan into v_plan from profiles where id = p_uid;
  if v_plan = 'pro' then return true; end if;
  insert into usage (user_id, period, interviews, reviews, practice, games, stories) values (p_uid, p_period, 0, 0, 0, 0, 0)
    on conflict do nothing;
  update usage set stories = stories + 1
    where user_id = p_uid and period = p_period and stories < p_limit
    returning stories into v_count;
  return v_count is not null;
end $$;
revoke execute on function consume_story(uuid, text, int) from public, anon, authenticated;
grant execute on function consume_story(uuid, text, int) to service_role;
