-- Migration: wire votes table → posts.upvotes → karma_sync trigger
-- Previously: votes were inserted/deleted but posts.upvotes never changed,
-- so karma_sync never fired and karma stayed frozen at default.

-- Step 1: trigger that increments/decrements posts.upvotes on every vote
create or replace function sync_post_upvotes()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update posts set upvotes = upvotes + 1 where id = NEW.post_id;
  elsif (TG_OP = 'DELETE') then
    update posts set upvotes = greatest(upvotes - 1, 0) where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists votes_sync on votes;
create trigger votes_sync
  after insert or delete on votes
  for each row execute function sync_post_upvotes();

-- Step 2: backfill posts.upvotes to match actual vote count (truth from votes table)
-- Posts default to 1; we reset to real count (0 if nobody voted yet).
update posts p
set upvotes = coalesce((
  select count(*)::integer from votes v where v.post_id = p.id
), 0);
