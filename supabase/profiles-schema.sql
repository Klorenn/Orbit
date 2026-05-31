-- Orbit Forum — Profiles Schema
-- Run in Supabase SQL Editor AFTER the main schema (supabase/schema.sql)

create table if not exists profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  identity    text,
  handle      text,
  bio         text,
  city        text,
  avatar      text not null default 'blue',
  banner      text not null default 'green',
  socials     jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "profiles are public"         on profiles for select using (true);
create policy "user can insert own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "user can update own profile" on profiles for update using (auth.uid() = user_id);
