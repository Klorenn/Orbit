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
