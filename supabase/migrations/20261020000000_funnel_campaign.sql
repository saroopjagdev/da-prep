-- Which campaign inside a channel (for example the TikTok video or bio link) each funnel step came from. It is the link's
-- utm_campaign, cleaned to a short lowercase label (letters, digits, - and _; at most 40 characters) in lib/funnel.ts.
-- Still just a daily count: nothing that identifies a person. Rows written before this have campaign ''.
alter table funnel_daily add column if not exists campaign text not null default '';
alter table funnel_daily drop constraint if exists funnel_daily_pkey;
alter table funnel_daily add primary key (day, event, source, campaign);

create or replace function bump_funnel(p_day date, p_event text, p_source text, p_campaign text) returns void
language sql security definer set search_path = public as $$
  insert into funnel_daily (day, event, source, campaign, n) values (p_day, p_event, coalesce(p_source, ''), coalesce(p_campaign, ''), 1)
  on conflict (day, event, source, campaign) do update set n = funnel_daily.n + 1;
$$;
revoke execute on function bump_funnel(date, text, text, text) from public, anon, authenticated;

-- The three-argument version stays so a deploy that still calls it keeps working (it counts against campaign '').
create or replace function bump_funnel(p_day date, p_event text, p_source text) returns void
language sql security definer set search_path = public as $$
  select bump_funnel(p_day, p_event, p_source, '');
$$;
revoke execute on function bump_funnel(date, text, text) from public, anon, authenticated;
