-- Migration: add missing profile columns
-- Run in Supabase SQL Editor

alter table public_profiles
  add column if not exists "fullName" text,
  add column if not exists skills    jsonb not null default '[]',
  add column if not exists repos     jsonb not null default '[]';

-- Clean up any self-follows that may have been created before the guard
delete from follows where follower = following;
