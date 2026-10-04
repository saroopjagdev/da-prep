-- Anonymous daily counters for the signup funnel: how many times each step happened that day, nothing more.
-- No user id, no IP, no cookie, no per-visit rows. Only our server (service role) can read or write it.
create table if not exists funnel_daily (
  day date not null,
  event text not null,
  n int not null default 0,
  primary key (day, event)
);
alter table funnel_daily enable row level security;
-- No policies on purpose: clients cannot read or write this table.

create or replace function bump_funnel(p_day date, p_event text) returns void
language sql security definer set search_path = public as $$
  insert into funnel_daily (day, event, n) values (p_day, p_event, 1)
  on conflict (day, event) do update set n = funnel_daily.n + 1;
$$;
revoke execute on function bump_funnel(date, text) from public, anon, authenticated;
