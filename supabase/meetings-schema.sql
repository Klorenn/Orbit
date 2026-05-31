-- Orbit Forum — Meetings Schema
-- Run in Supabase SQL Editor AFTER the main schema (supabase/schema.sql)

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
create policy "meetings are public"     on meetings for select using (true);
create policy "authed users can create" on meetings for insert with check (auth.role() = 'authenticated');
create policy "host can update"         on meetings for update using (auth.jwt()->>'sub' = host or auth.email() = host);

create table if not exists meeting_attendees (
  meeting_id  text not null references meetings(id) on delete cascade,
  attendee    text not null,
  created_at  timestamptz not null default now(),
  primary key (meeting_id, attendee)
);

alter table meeting_attendees enable row level security;
create policy "attendees are public"  on meeting_attendees for select using (true);
create policy "authed users can join" on meeting_attendees for insert with check (auth.role() = 'authenticated');
create policy "attendee can leave"    on meeting_attendees for delete using (auth.jwt()->>'sub' = attendee or auth.email() = attendee);

-- Seed meetings
insert into meetings (id, title, description, kind, host, when_label, duration_min, status, capacity, link)
values
  ('m1', 'Community call #18', 'Monthly Orbit community sync. All ambassadors welcome.', 'Community', 'orbit-team.fil', 'Mon Feb 03, 2026 · 18:00 UTC', 50, 'upcoming', 120, 'https://meet.google.com/orbit-m1'),
  ('m2', 'Evidence-pinning bot proposal review', 'Live walkthrough of the IPFS auto-pinning bot spec — open Q&A.', 'Proposal', 'mira.fil', 'Wed Feb 05, 2026 · 16:00 UTC', 40, 'upcoming', 40, null),
  ('m3', 'West Africa hub onboarding', 'Onboarding call for new ambassadors in the West Africa region.', 'Workshop', 'tunde.fil', 'Fri Feb 07, 2026 · 14:00 UTC', 60, 'upcoming', 30, null),
  ('m4', 'LatAm regional sync', 'Quarterly sync for LatAm ambassadors.', 'Community', 'olga.fil', 'Tue Jan 21, 2026 · 19:00 UTC', 50, 'past', 25, null),
  ('m5', 'FVM developer workshop', 'Hands-on FVM smart contract workshop for ambassadors.', 'Workshop', 'devi.fil', 'Thu Jan 16, 2026 · 15:00 UTC', 90, 'past', 18, null)
on conflict (id) do nothing;
