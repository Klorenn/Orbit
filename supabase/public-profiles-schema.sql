-- Orbit Forum — Public Profiles Schema
-- Run in Supabase SQL Editor AFTER the main schema (supabase/schema.sql)
-- This table is readable by anyone and writable by identity (no auth.users FK required,
-- so wallet-connected users can also persist their profile).

create table if not exists public_profiles (
  identity    text primary key,
  handle      text,
  bio         text,
  city        text,
  avatar      text not null default 'blue',
  banner      text not null default 'green',
  socials     jsonb not null default '{}',
  karma       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public_profiles enable row level security;
create policy "public_profiles are public"   on public_profiles for select using (true);
create policy "anyone can insert profile"    on public_profiles for insert with check (true);
create policy "anyone can update profile"    on public_profiles for update using (true);
