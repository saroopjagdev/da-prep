-- Free trial of Pro: one per account. During a Stripe trial the account is on Pro (profiles.plan = 'pro'), so the
-- allowance functions need no change; these columns only mark that a trial happened and when it ends, so the app can
-- show a countdown, apply the lower trial caps and stop offering a second trial. Only the service role writes them.
alter table profiles add column if not exists trial_used boolean not null default false;
alter table profiles add column if not exists trial_ends_at timestamptz;
