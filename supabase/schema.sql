-- Orbit Forum — Supabase Schema
-- Run this in the Supabase SQL editor at supabase.com/dashboard → SQL Editor

-- Posts
create table if not exists posts (
  id          text primary key default ('p' || replace(gen_random_uuid()::text, '-', '')),
  cat         text not null,
  type        text not null,
  title       text not null,
  excerpt     text,
  body        jsonb not null default '[]',
  author      text not null,
  author_type text not null default 'wallet',
  upvotes     integer not null default 1,
  cid_str     text,
  reactions   jsonb not null default '{}',
  evidence    jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

alter table posts enable row level security;
create policy "posts are public"       on posts for select using (true);
create policy "authed users can post"  on posts for insert with check (auth.role() = 'authenticated');
create policy "author can update"      on posts for update using (auth.jwt()->>'sub' = author or auth.email() = author);
create policy "author can delete post" on posts for delete using (auth.jwt()->>'sub' = author or auth.email() = author);

-- Votes (one per user per post)
create table if not exists votes (
  post_id    text not null references posts(id) on delete cascade,
  voter      text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, voter)
);

alter table votes enable row level security;
create policy "votes are public"      on votes for select using (true);
create policy "authed users can vote" on votes for insert with check (auth.role() = 'authenticated');
create policy "author can unvote"     on votes for delete using (auth.jwt()->>'sub' = voter or auth.email() = voter);

-- Comments
create table if not exists comments (
  id          text primary key default ('c' || replace(gen_random_uuid()::text, '-', '')),
  post_id     text not null references posts(id) on delete cascade,
  parent_id   text references comments(id) on delete cascade,
  author      text not null,
  author_type text not null default 'wallet',
  text        text not null,
  reactions   jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

alter table comments enable row level security;
create policy "comments are public"       on comments for select using (true);
create policy "authed users can comment"  on comments for insert with check (auth.role() = 'authenticated');
create policy "author can delete comment" on comments for delete using (auth.jwt()->>'sub' = author or auth.email() = author);

-- Public profiles (one per identity — wallet address or email prefix)
create table if not exists public_profiles (
  identity   text primary key,
  handle     text,
  bio        text,
  city       text,
  avatar     text not null default 'blue',
  banner     text not null default 'green',
  socials    jsonb not null default '{}',
  karma      integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public_profiles enable row level security;
create policy "profiles are public"       on public_profiles for select using (true);
create policy "authed users can upsert"   on public_profiles for insert with check (auth.role() = 'authenticated');
create policy "owner can update profile"  on public_profiles for update using (auth.jwt()->>'sub' = identity or auth.email() = identity);

-- Karma auto-sync: recalculates when post upvotes change
create or replace function update_author_karma()
returns trigger as $$
begin
  update public_profiles
  set karma = (select coalesce(sum(upvotes), 0) from posts where author = NEW.author)
  where identity = NEW.author;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger karma_sync
  after insert or update of upvotes on posts
  for each row execute function update_author_karma();

-- Notifications
create table if not exists notifications (
  id        text primary key default ('n' || replace(gen_random_uuid()::text, '-', '')),
  recipient text not null,
  type      text not null,
  actor     text not null,
  post_id   text references posts(id) on delete set null,
  text      text not null,
  link      text,
  unread    boolean not null default true,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;
create policy "recipient can read notifs"   on notifications for select using (recipient = auth.jwt()->>'sub' or recipient = auth.email());
create policy "authed users can notify"     on notifications for insert with check (auth.role() = 'authenticated');
create policy "recipient can update notifs" on notifications for update using (recipient = auth.jwt()->>'sub' or recipient = auth.email());

-- Events
create table if not exists events (
  id           text primary key default ('e' || replace(gen_random_uuid()::text, '-', '')),
  title        text not null,
  description  text,
  when_date    date not null,
  when_time    text,
  city         text not null,
  country      text not null default '',
  host         text not null,
  status       text not null default 'upcoming',
  spots        integer,
  agenda       jsonb not null default '[]',
  meeting_link text,
  created_at   timestamptz not null default now()
);

alter table events enable row level security;
create policy "events are public"      on events for select using (true);
create policy "authed users can post events" on events for insert with check (auth.role() = 'authenticated');

-- RSVPs
create table if not exists rsvps (
  event_id   text not null references events(id) on delete cascade,
  attendee   text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, attendee)
);

alter table rsvps enable row level security;
create policy "rsvps are public"        on rsvps for select using (true);
create policy "authed users can rsvp"   on rsvps for insert with check (auth.role() = 'authenticated');
create policy "attendee can cancel"     on rsvps for delete using (auth.jwt()->>'sub' = attendee or auth.email() = attendee);

-- Meetings
create table if not exists meetings (
  id           text primary key default ('m' || replace(gen_random_uuid()::text, '-', '')),
  title        text not null,
  description  text,
  kind         text not null default 'Community',
  host         text not null,
  when_label   text,
  duration_min integer not null default 50,
  status       text not null default 'upcoming',
  capacity     integer,
  link         text,
  created_at   timestamptz not null default now()
);

alter table meetings enable row level security;
create policy "meetings are public"         on meetings for select using (true);
create policy "authed users can propose"    on meetings for insert with check (auth.role() = 'authenticated');
create policy "host can update meeting"     on meetings for update using (auth.jwt()->>'sub' = host or auth.email() = host);

-- Meeting attendees
create table if not exists meeting_attendees (
  meeting_id text not null references meetings(id) on delete cascade,
  attendee   text not null,
  created_at timestamptz not null default now(),
  primary key (meeting_id, attendee)
);

alter table meeting_attendees enable row level security;
create policy "attendees are public"        on meeting_attendees for select using (true);
create policy "authed users can join"       on meeting_attendees for insert with check (auth.role() = 'authenticated');
create policy "attendee can leave"          on meeting_attendees for delete using (auth.jwt()->>'sub' = attendee or auth.email() = attendee);

-- Bookmarks
create table if not exists bookmarks (
  identity   text not null,
  post_id    text not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (identity, post_id)
);

alter table bookmarks enable row level security;
create policy "owner can read bookmarks"   on bookmarks for select using (auth.jwt()->>'sub' = identity or auth.email() = identity);
create policy "authed users can bookmark"  on bookmarks for insert with check (auth.role() = 'authenticated');
create policy "owner can unbookmark"       on bookmarks for delete using (auth.jwt()->>'sub' = identity or auth.email() = identity);

-- Follows
create table if not exists follows (
  follower   text not null,
  following  text not null,
  created_at timestamptz not null default now(),
  primary key (follower, following)
);

alter table follows enable row level security;
create policy "follows are public"        on follows for select using (true);
create policy "authed users can follow"   on follows for insert with check (auth.role() = 'authenticated');
create policy "follower can unfollow"     on follows for delete using (auth.jwt()->>'sub' = follower or auth.email() = follower);
