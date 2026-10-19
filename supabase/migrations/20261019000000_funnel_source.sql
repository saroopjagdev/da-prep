-- Which channel each funnel step came from (google, tiktok, school, direct...), still just a daily count. The source is a
-- short label from a fixed list (lib/funnel.ts), taken from the page's own referrer or utm_source. Nothing that identifies
-- a person, nothing stored in the browser. Rows written before this have source ''.
alter table funnel_daily add column if not exists source text not null default '';
alter table funnel_daily drop constraint if exists funnel_daily_pkey;
alter table funnel_daily add primary key (day, event, source);

create or replace function bump_funnel(p_day date, p_event text, p_source text) returns void
language sql security definer set search_path = public as $$
  insert into funnel_daily (day, event, source, n) values (p_day, p_event, coalesce(p_source, ''), 1)
  on conflict (day, event, source) do update set n = funnel_daily.n + 1;
$$;
revoke execute on function bump_funnel(date, text, text) from public, anon, authenticated;

-- The old two-argument bump_funnel stays, so a deploy that still calls it keeps working (it counts against source '').
-- Its body changes because the table's key now includes source.
create or replace function bump_funnel(p_day date, p_event text) returns void
language sql security definer set search_path = public as $$
  select bump_funnel(p_day, p_event, '');
$$;
revoke execute on function bump_funnel(date, text) from public, anon, authenticated;
