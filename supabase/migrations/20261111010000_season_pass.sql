-- The Season Pass: Pro for a fixed period, paid once. pro_until holds the end of that period (null for monthly
-- subscribers and free accounts). The daily job moves a pass holder back to free once it has passed. Safe to re-run.
alter table profiles add column if not exists pro_until timestamptz;
