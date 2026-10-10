-- Engagement reward: whether this account has followed an Apply link from the tracker. It lives on the same lifetime
-- usage row as the interview, review and practice counts; the server unlocks the bonus allowances from all of them.
alter table usage add column if not exists applied boolean not null default false;
