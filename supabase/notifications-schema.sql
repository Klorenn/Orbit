-- Orbit Forum — Notifications Schema
-- Run in Supabase SQL Editor AFTER the main schema (supabase/schema.sql)

create table if not exists notifications (
  id          text primary key default ('n' || replace(gen_random_uuid()::text, '-', '')),
  recipient   text not null,
  type        text not null,   -- comment | vote | mention | system
  actor       text not null,
  post_id     text references posts(id) on delete cascade,
  text        text not null,
  link        text,
  unread      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table notifications enable row level security;
create policy "anyone can read notifications" on notifications for select using (true);
create policy "anyone can insert notification" on notifications for insert with check (true);
create policy "recipient can update"           on notifications for update using (true);
create policy "recipient can delete"           on notifications for delete using (true);

create index if not exists notifications_recipient_idx on notifications (recipient, created_at desc);
