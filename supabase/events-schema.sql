-- Orbit Forum — Events & RSVPs Schema
-- Run in Supabase SQL Editor AFTER the main schema (supabase/schema.sql)

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
create policy "events are public"        on events for select using (true);
create policy "authed users can create"  on events for insert with check (auth.role() = 'authenticated');
create policy "host can update"          on events for update using (auth.jwt()->>'sub' = host or auth.email() = host);

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

-- Seed events
insert into events (id, title, description, when_date, when_time, city, country, host, status, spots, agenda, meeting_link)
values
  ('e1', 'Lagos storage workshop', 'Hands-on Filecoin storage workshop. Venue: co-working space in Yaba, capacity 80.', '2026-01-25', '18:00 local', 'Lagos', 'NG', 'tunde.fil', 'upcoming', 80,
   '["Doors open + welcome", "Filecoin storage 101", "Live storage-deal demo", "Project lightning talks", "Open networking"]', null),
  ('e2', 'Buenos Aires meetup #2', 'Second Filecoin Orbit meetup in Buenos Aires.', '2026-02-08', '19:00 local', 'Buenos Aires', 'AR', 'olga.fil', 'upcoming', 40,
   '["Welcome + intros", "Filecoin ecosystem update", "Storage-deal demo", "Networking"]', null),
  ('e3', 'Lisbon FVM hack night', 'Filecoin Virtual Machine hack night.', '2026-02-21', '18:30 local', 'Lisbon', 'PT', 'mira.fil', 'upcoming', 30,
   '["Intro to FVM", "Hack session", "Show and tell", "Wrap up"]', null),
  ('e4', 'Santiago meetup #3', 'Third Filecoin Orbit meetup in Santiago.', '2025-11-14', '18:00 local', 'Santiago', 'CL', 'olga.fil', 'past', 64,
   '["Welcome", "Storage demo", "Project talks", "Networking"]', null),
  ('e5', 'Bangalore campus tour', 'Campus tour across three Bangalore universities.', '2025-10-30', '10:00 local', 'Bangalore', 'IN', 'devi.fil', 'past', 210,
   '["University 1: IISc", "University 2: NITK", "University 3: PES", "Wrap-up"]', null)
on conflict (id) do nothing;
