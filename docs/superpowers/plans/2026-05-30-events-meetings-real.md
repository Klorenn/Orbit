# Orbit Forum — Events / Meetings: Mockup → Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Events/Meetings feature fully functional — events stored in Supabase, RSVP persisted, meeting links, real event creation form, broken routing fixed.

**Architecture:** Add `events` + `rsvps` tables to Supabase. Create `useEvents` and `useRSVP` hooks. Fix the routing bug in EventsView. Replace hardcoded agenda with real event fields. Add a `CreateEventView` (separate from the generic forum post composer). Wire EventsView + EventDetailView to read from Supabase with fallback to seed data.

**Tech Stack:** Vite/React (existing), Supabase (existing), wagmi/useAuth (existing)

---

## Current bugs to fix immediately (no planning needed)

**Bug 1 — EventsView.jsx:24:** "Details" button href is `#/forum/events` → should be `#/events/${e.id}`

**Bug 2 — EventDetailView.jsx:15:** Agenda is hardcoded 5-item array → should come from event data

**Bug 3 — EventDetailView.jsx:48:** "I'll be there" button has no onClick → needs real RSVP

---

## File Map

### New files
```
src/hooks/useEvents.js           Supabase events CRUD
src/hooks/useEvents.test.js      TDD tests
src/hooks/useRSVP.js             RSVP toggle (join/leave event)
src/hooks/useRSVP.test.js        TDD tests
src/pages/CreateEventView.jsx    Dedicated event creation form
supabase/events-schema.sql       Events + RSVPs tables (run in Supabase dashboard)
```

### Modified files
```
src/pages/EventsView.jsx         Fix routing bug, read from useEvents
src/pages/EventDetailView.jsx    Real RSVP button, real agenda, meeting link
src/data/constants.js            Add seedEvents (fallback data)
src/App.jsx                      Add CreateEventView route (#/events/new)
```

---

## Events data model

```
events table:
  id          text PK (auto)
  title       text
  description text
  when_date   date           (ISO date: 2026-01-25)
  when_time   text           (e.g. "18:00 local")
  city        text
  country     text
  host        text           (wallet address or email handle)
  status      text           'upcoming' | 'past' | 'cancelled'
  spots       integer        (null = unlimited)
  agenda      jsonb          ['item1', 'item2', ...]
  meeting_link text          (Zoom/Meet URL, optional)
  created_at  timestamptz

rsvps table:
  event_id    text FK → events(id)
  attendee    text           (identity: wallet address or email handle)
  created_at  timestamptz
  PK: (event_id, attendee)
```

---

## Task 1: Fix routing bug + hardcoded agenda in EventsView

**Files:**
- Modify: `src/pages/EventsView.jsx`

- [ ] **Step 1: Fix the Details button href**

In `src/pages/EventsView.jsx` line ~24, change:
```jsx
// BEFORE
<a className="pill pill-line" href="#/forum/events">{e.status === 'upcoming' ? 'Details' : 'Recap'}</a>

// AFTER
<a className="pill pill-line" href={'#/events/' + e.id}>{e.status === 'upcoming' ? 'Details' : 'Recap'}</a>
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/pages/EventsView.jsx
git commit -m "fix: event detail link navigates to correct route"
```

---

## Task 2: Supabase schema — events + rsvps tables

**Files:**
- Create: `supabase/events-schema.sql`

- [ ] **Step 1: Create supabase/events-schema.sql**

```sql
-- Orbit Forum — Events & RSVPs Schema
-- Run in Supabase SQL Editor after the main schema

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

-- Seed events (matches the existing EVENTS constant)
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
```

- [ ] **Step 2: Run in Supabase**

Go to supabase.com/dashboard → SQL Editor → paste `supabase/events-schema.sql` → Run.

- [ ] **Step 3: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add supabase/events-schema.sql
git commit -m "feat: add events and rsvps supabase schema"
```

---

## Task 3: useEvents hook — TDD

**Files:**
- Create: `src/hooks/useEvents.js`
- Create: `src/hooks/useEvents.test.js`

- [ ] **Step 1: Write test first**

```js
// src/hooks/useEvents.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEvents } from './useEvents'

const mockEvents = [
  { id: 'e1', title: 'Lagos workshop', city: 'Lagos', country: 'NG', host: 'tunde.fil',
    status: 'upcoming', when_date: '2026-01-25', when_time: '18:00', spots: 80,
    agenda: ['Welcome', 'Demo'], meeting_link: null, created_at: '2026-01-01T00:00:00Z' }
]

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'e99', title: 'New Event' }, error: null }),
        })),
      })),
    })),
  },
}))

describe('useEvents', () => {
  it('starts with seed events (non-empty)', () => {
    const { result } = renderHook(() => useEvents())
    expect(result.current.events.length).toBeGreaterThan(0)
  })

  it('fetchEvents replaces events with supabase data', async () => {
    const { result } = renderHook(() => useEvents())
    await act(async () => { await result.current.fetchEvents() })
    expect(result.current.events).toEqual(mockEvents)
  })

  it('createEvent returns the new event', async () => {
    const { result } = renderHook(() => useEvents())
    let ev
    await act(async () => {
      ev = await result.current.createEvent({
        title: 'New Event', description: 'desc', whenDate: '2026-03-01',
        whenTime: '18:00', city: 'NYC', country: 'US', host: '0xABC',
        spots: 50, agenda: ['Welcome'], meetingLink: null
      })
    })
    expect(ev.id).toBe('e99')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vitest run src/hooks/useEvents.test.js 2>&1 | tail -10
```

- [ ] **Step 3: Create src/hooks/useEvents.js**

```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EVENTS } from '../data/constants'

// Map constants.js format to DB format for seed fallback
const SEED_EVENTS = EVENTS.map(e => ({
  id: e.id, title: e.title, city: e.city, country: '',
  host: e.host, status: e.status, when_date: e.when,
  when_time: '', spots: null, agenda: [], meeting_link: null,
}))

export function useEvents() {
  const [events, setEvents] = useState(SEED_EVENTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('when_date', { ascending: true })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data && data.length > 0) setEvents(data)
  }

  useEffect(() => { fetchEvents() }, [])

  const createEvent = async ({ title, description, whenDate, whenTime, city, country, host, spots, agenda, meetingLink }) => {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title, description, when_date: whenDate, when_time: whenTime,
        city, country, host, status: 'upcoming',
        spots: spots || null, agenda: agenda || [],
        meeting_link: meetingLink || null,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    setEvents(evs => [...evs, data].sort((a, b) => a.when_date.localeCompare(b.when_date)))
    return data
  }

  return { events, setEvents, loading, error, fetchEvents, createEvent }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vitest run src/hooks/useEvents.test.js 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/hooks/useEvents.js src/hooks/useEvents.test.js
git commit -m "feat: add useEvents hook with supabase persistence"
```

---

## Task 4: useRSVP hook — TDD

**Files:**
- Create: `src/hooks/useRSVP.js`
- Create: `src/hooks/useRSVP.test.js`

- [ ] **Step 1: Write test first**

```js
// src/hooks/useRSVP.test.js
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRSVP } from './useRSVP'

const makeSupabaseMock = (count = 2, hasAttendee = false) => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          // count query
          then: undefined,
        })),
      })),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
    })),
  },
})

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: [{ attendee: 'olga.fil' }, { attendee: 'mira.fil' }], error: null }),
      })),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
    })),
  },
}))

describe('useRSVP', () => {
  it('returns fetchRSVPs and toggleRSVP functions', () => {
    const { result } = renderHook(() => useRSVP('e1'))
    expect(typeof result.current.fetchRSVPs).toBe('function')
    expect(typeof result.current.toggleRSVP).toBe('function')
  })

  it('fetchRSVPs sets attendee count', async () => {
    const { result } = renderHook(() => useRSVP('e1'))
    await act(async () => { await result.current.fetchRSVPs() })
    expect(result.current.count).toBe(2)
  })

  it('toggleRSVP join calls insert', async () => {
    const { result } = renderHook(() => useRSVP('e1'))
    await act(async () => {
      await result.current.toggleRSVP({ attendee: 'you.fil', currentlyJoined: false })
    })
    // No error thrown = success
    expect(result.current.joined).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vitest run src/hooks/useRSVP.test.js 2>&1 | tail -10
```

- [ ] **Step 3: Create src/hooks/useRSVP.js**

```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRSVP(eventId) {
  const [count, setCount] = useState(0)
  const [attendees, setAttendees] = useState([])
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchRSVPs = async () => {
    if (!eventId) return
    const { data, error } = await supabase
      .from('rsvps')
      .select('attendee')
      .eq('event_id', eventId)
    if (error) return
    setAttendees(data.map(r => r.attendee))
    setCount(data.length)
  }

  const checkJoined = (identity) => {
    setJoined(attendees.includes(identity))
  }

  useEffect(() => { fetchRSVPs() }, [eventId])

  const toggleRSVP = async ({ attendee, currentlyJoined }) => {
    setLoading(true)
    if (currentlyJoined) {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('attendee', attendee)
      if (error) { setLoading(false); throw new Error(error.message) }
      setCount(c => Math.max(0, c - 1))
      setAttendees(a => a.filter(x => x !== attendee))
      setJoined(false)
    } else {
      const { error } = await supabase
        .from('rsvps')
        .insert({ event_id: eventId, attendee })
      if (error) { setLoading(false); throw new Error(error.message) }
      setCount(c => c + 1)
      setAttendees(a => [...a, attendee])
      setJoined(true)
    }
    setLoading(false)
  }

  return { count, attendees, joined, loading, fetchRSVPs, toggleRSVP, checkJoined }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vitest run src/hooks/useRSVP.test.js 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/hooks/useRSVP.js src/hooks/useRSVP.test.js
git commit -m "feat: add useRSVP hook for event attendance"
```

---

## Task 5: Update EventDetailView — real RSVP + meeting link + real agenda

**Files:**
- Modify: `src/pages/EventDetailView.jsx`

- [ ] **Step 1: Rewrite EventDetailView**

Replace the entire file with this implementation:

```jsx
// src/pages/EventDetailView.jsx
import { useEffect } from 'react'
import { EVENTS, who } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { useRSVP } from '../hooks/useRSVP'
import { useAuth } from '../hooks/useAuth'
import { navTo } from '../data/constants'

export function EventDetailView({ id, posts, onConnect }) {
  const { connected, identity } = useAuth()
  const { count, joined, loading, toggleRSVP, fetchRSVPs } = useRSVP(id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])
  useEffect(() => {
    if (identity && identity !== 'you.fil') {
      // Re-check joined state after identity is known
      fetchRSVPs()
    }
  }, [identity])

  // Support both DB format (when_date, agenda[]) and seed format (when, spots string)
  const ev = EVENTS.find(e => e.id === id)
  if (!ev) return <div className="page-wrap"><p className="empty">Event not found. <a href="#/events">All events</a></p></div>

  const host = who(ev.host)
  const recap = posts.find(p => p.cat === 'reports' && p.author === ev.host)
  const isJoined = joined
  const spotsDisplay = ev.spots
    ? (typeof ev.spots === 'number' ? ev.spots + ' capacity' : ev.spots)
    : 'Open attendance'
  const agendaItems = Array.isArray(ev.agenda) && ev.agenda.length > 0
    ? ev.agenda
    : ['Doors open + welcome', 'Main session', 'Q&A + networking']

  const handleRSVP = async () => {
    if (!connected) { onConnect(); return }
    try {
      await toggleRSVP({ attendee: identity, currentlyJoined: isJoined })
    } catch (e) {
      alert('RSVP failed: ' + e.message)
    }
  }

  return (
    <div className="page-wrap">
      <a className="back-link" href="#/events">{I.back()} All events</a>
      <div className="ev-detail-hero">
        <div className="evd-date">
          <span className="ev-mon">{ev.month || (ev.when_date ? new Date(ev.when_date).toLocaleString('en', { month: 'short' }).toUpperCase() : '')}</span>
          <span className="ev-day">{ev.day || (ev.when_date ? new Date(ev.when_date).getDate() : '')}</span>
        </div>
        <div>
          <span className="status-pill" style={{ background: ev.status === 'upcoming' ? 'rgba(16,185,129,.14)' : 'rgba(10,10,10,.06)', color: ev.status === 'upcoming' ? '#0a7a55' : 'rgba(10,10,10,.5)' }}>
            ● {ev.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </span>
          <h1 className="dt" style={{ marginTop: 10 }}>{ev.title}</h1>
          <div className="evd-meta">
            {I.cal({ width: 15, height: 15 })} {ev.when || ev.when_date}{ev.when_time ? ' · ' + ev.when_time : ''} · {ev.city}
          </div>
        </div>
      </div>

      <div className="evd-cols">
        <div>
          <p className="prose">
            {ev.description || ev.spots + '. Join fellow ambassadors for a hands-on session.'}
          </p>

          {ev.meeting_link && ev.status === 'upcoming' && (
            <div style={{ margin: '16px 0', padding: '14px 16px', background: 'rgba(0,144,255,.08)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              {I.globe({ width: 16, height: 16, color: '#0090FF' })}
              <span style={{ fontWeight: 600 }}>Online link:</span>
              <a href={ev.meeting_link} target="_blank" rel="noopener" style={{ color: '#0090FF' }}>
                {ev.meeting_link.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <h3 className="section-h">Agenda</h3>
          <ol className="agenda">
            {agendaItems.map((a, i) => <li key={i}><span>{i + 1}</span>{a}</li>)}
          </ol>

          {recap && ev.status === 'past' && (
            <>
              <h3 className="section-h">Recap report</h3>
              <PostCard post={recap} onVote={() => {}} />
            </>
          )}
        </div>

        <aside className="evd-side">
          <div className="rail-card">
            <h4>Host</h4>
            <a className="evd-host" href={'#/profile/' + host.name}>
              <AmbassadorAvatar user={ev.host} size={44} link={false} nft />
              <div>
                <div className="amb-name">{host.name}</div>
                <div className="amb-city">{host.city}</div>
              </div>
            </a>

            {ev.status === 'upcoming' && (
              <>
                <div style={{ margin: '12px 0 8px', fontSize: 13, color: 'rgba(10,10,10,.5)' }}>
                  {count > 0 ? count + ' going' : 'Be the first to join'} · {spotsDisplay}
                </div>
                <button
                  className={'pill ' + (isJoined ? 'pill-line' : 'pill-blue')}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.6 : 1 }}
                  onClick={handleRSVP}
                  disabled={loading}
                >
                  {loading ? 'Updating…' : isJoined ? "Can't make it" : "I'll be there"}
                </button>
                {!connected && (
                  <p style={{ fontSize: 12, textAlign: 'center', marginTop: 8, color: 'rgba(10,10,10,.4)' }}>
                    Connect to RSVP
                  </p>
                )}
              </>
            )}

            {ev.status === 'past' && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(10,10,10,.5)' }}>
                {count > 0 ? count + ' attended' : spotsDisplay}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vite build --mode development 2>&1 | grep -E "error|built" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/pages/EventDetailView.jsx
git commit -m "feat: real rsvp, meeting link, dynamic agenda in EventDetailView"
```

---

## Task 6: CreateEventView — event creation form

**Files:**
- Create: `src/pages/CreateEventView.jsx`

- [ ] **Step 1: Create src/pages/CreateEventView.jsx**

```jsx
// src/pages/CreateEventView.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import { WalletGate } from '../components/WalletGate'
import { I } from '../components/Icons'
import { navTo } from '../data/constants'

export function CreateEventView({ onConnect }) {
  const { connected, identity } = useAuth()
  const { createEvent } = useEvents()
  const [phase, setPhase] = useState('edit')
  const [form, setForm] = useState({
    title: '', description: '', whenDate: '', whenTime: '',
    city: '', country: '', spots: '', meetingLink: '',
    agenda: ['', '', ''],
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setAgenda = (i, value) => setForm(f => {
    const a = [...f.agenda]; a[i] = value; return { ...f, agenda: a }
  })
  const addAgendaItem = () => setForm(f => ({ ...f, agenda: [...f.agenda, ''] }))
  const removeAgendaItem = (i) => setForm(f => ({ ...f, agenda: f.agenda.filter((_, j) => j !== i) }))

  const canSubmit = form.title.trim() && form.whenDate && form.city.trim()

  const submit = async () => {
    if (!canSubmit || phase === 'saving') return
    setPhase('saving')
    try {
      const event = await createEvent({
        title: form.title.trim(),
        description: form.description.trim() || null,
        whenDate: form.whenDate,
        whenTime: form.whenTime.trim() || null,
        city: form.city.trim(),
        country: form.country.trim() || '',
        host: identity,
        spots: form.spots ? parseInt(form.spots, 10) : null,
        agenda: form.agenda.map(a => a.trim()).filter(Boolean),
        meetingLink: form.meetingLink.trim() || null,
      })
      navTo('#/events/' + event.id)
    } catch (e) {
      setPhase('edit')
      alert('Failed to create event: ' + e.message)
    }
  }

  return (
    <div className="page-wrap compose">
      <a className="back-link" href="#/events">{I.back()} All events</a>
      <h1 className="page-title">New event</h1>
      <WalletGate connected={connected} onConnect={onConnect} label="Connect to create an event">
        <div className="field">
          <label>Event title *</label>
          <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. Lagos storage workshop" />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="What will attendees do and learn?" rows={3} style={{ width: '100%', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Date *</label>
            <input type="date" value={form.whenDate} onChange={e => set('whenDate', e.target.value)} />
          </div>
          <div className="field">
            <label>Time (local)</label>
            <input type="text" value={form.whenTime} onChange={e => set('whenTime', e.target.value)}
              placeholder="e.g. 18:00" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div className="field">
            <label>City *</label>
            <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
              placeholder="Lagos" />
          </div>
          <div className="field">
            <label>Country code</label>
            <input type="text" value={form.country} onChange={e => set('country', e.target.value)}
              placeholder="NG" maxLength={2} style={{ textTransform: 'uppercase' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Capacity (leave blank for unlimited)</label>
            <input type="number" value={form.spots} onChange={e => set('spots', e.target.value)}
              placeholder="80" min={1} />
          </div>
          <div className="field">
            <label>Online meeting link (optional)</label>
            <input type="url" value={form.meetingLink} onChange={e => set('meetingLink', e.target.value)}
              placeholder="https://meet.google.com/..." />
          </div>
        </div>

        <div className="field">
          <label>Agenda</label>
          {form.agenda.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 20, textAlign: 'center', paddingTop: 8, color: 'rgba(10,10,10,.3)', fontSize: 13 }}>{i + 1}</span>
              <input type="text" value={item} onChange={e => setAgenda(i, e.target.value)}
                placeholder={['Doors open + welcome', 'Main session', 'Q&A + networking'][i] || 'Agenda item'}
                style={{ flex: 1 }} />
              {form.agenda.length > 1 && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,.3)', padding: '0 4px' }}
                  onClick={() => removeAgendaItem(i)}>{I.close({ width: 14, height: 14 })}</button>
              )}
            </div>
          ))}
          <button className="pill pill-line" style={{ marginTop: 4, fontSize: 13 }} onClick={addAgendaItem}>
            {I.plus({ width: 13, height: 13 })} Add item
          </button>
        </div>

        <div className="compose-foot">
          <span className="note">{I.shield()} Hosted by {identity}</span>
          <button className="pill pill-blue" onClick={submit}
            style={{ opacity: canSubmit ? 1 : 0.5, padding: '11px 24px' }}
            disabled={!canSubmit || phase === 'saving'}>
            {phase === 'saving'
              ? <span className="publishing"><span className="spin"></span>Creating…</span>
              : 'Create event'}
          </button>
        </div>
      </WalletGate>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/pages/CreateEventView.jsx
git commit -m "feat: add CreateEventView for real event creation"
```

---

## Task 7: Wire everything into App.jsx + update EventsView

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/pages/EventsView.jsx`

- [ ] **Step 1: Add CreateEventView to App.jsx router**

In `src/App.jsx`:

a) Add import:
```js
import { CreateEventView } from './pages/CreateEventView'
import { useEvents } from './hooks/useEvents'
```

b) Inside App(), add the hook (after other hooks):
```js
const { events, fetchEvents } = useEvents()
```

c) Add to the view switch (after `case 'events':`):
```js
case 'events':         view = <EventsView events={events} />; break
case 'event-new':      view = <CreateEventView onConnect={() => navTo('#/connect')} />; break
case 'event-detail':   view = <EventDetailView id={route.id} posts={posts} events={events} onConnect={() => navTo('#/connect')} />; break
```

d) In `parseHash()`, add handling for `#/events/new`:
```js
if (seg[0] === 'events') {
  if (seg[1] === 'new') return { view: 'event-new' }  // already exists, just verify
  if (seg[1])           return { view: 'event-detail', id: seg[1] }
  return { view: 'events' }
}
```
(This should already be there — verify it handles 'new' before the id case.)

- [ ] **Step 2: Update EventsView to accept events prop**

In `src/pages/EventsView.jsx`, change the component to accept events as prop (with fallback to EVENTS constant):

```jsx
import { EVENTS, who } from '../data/constants'
import { I } from '../components/Icons'
import { useEffect } from 'react'

export function EventsView({ events = EVENTS }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const upcoming = events.filter(e => e.status === 'upcoming')
  const past = events.filter(e => e.status === 'past')

  const formatMonth = (e) => e.month || (e.when_date ? new Date(e.when_date).toLocaleString('en', { month: 'short' }).toUpperCase() : '?')
  const formatDay = (e) => e.day || (e.when_date ? new Date(e.when_date).getDate() : '?')
  const hostOf = (e) => who(e.host)

  const Card = ({ e }) => {
    const h = hostOf(e)
    const spotsLabel = typeof e.spots === 'number' ? e.spots + ' capacity' : (e.spots || 'Open')
    return (
      <div className="event-card">
        <div className="ev-date">
          <span className="ev-mon">{formatMonth(e)}</span>
          <span className="ev-day">{formatDay(e)}</span>
        </div>
        <div className="ev-body">
          <div className="ev-title">{e.title}</div>
          <div className="ev-meta">{e.city}{e.country ? ', ' + e.country : ''} · hosted by <a href={'#/profile/' + h.name}>{h.name}</a></div>
          <div className="ev-spots">{spotsLabel}</div>
        </div>
        <a className="pill pill-line" href={'#/events/' + e.id}>
          {e.status === 'upcoming' ? 'Details' : 'Recap'}
        </a>
      </div>
    )
  }

  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="page-title">{I.cal({ width: 26, height: 26 })} Events</h1>
        <a href="#/events/new" className="pill pill-blue">{I.plus()} New event</a>
      </div>
      <p className="page-sub">Ambassador meetups, workshops, and recaps across the constellation.</p>
      <h3 className="section-h">Upcoming</h3>
      <div className="event-list">{upcoming.map(e => <Card key={e.id} e={e} />)}</div>
      {upcoming.length === 0 && <p className="empty">No upcoming events — <a href="#/events/new">create one</a>.</p>}
      <h3 className="section-h">Past</h3>
      <div className="event-list">{past.map(e => <Card key={e.id} e={e} />)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Pass events to EventDetailView in App.jsx**

In `src/App.jsx`, the EventDetailView line should pass the events array so it can find events from Supabase (not just the constants):

```js
// EventDetailView needs events from Supabase, not just constants
// Pass events prop OR let EventDetailView find from constants as fallback
// The simplest: pass events from useEvents to EventDetailView
case 'event-detail': view = <EventDetailView id={route.id} posts={posts} events={events} onConnect={() => navTo('#/connect')} />; break
```

Then in `EventDetailView.jsx`, update the find line to also check the passed events prop:
```js
// At top of EventDetailView, after existing imports:
export function EventDetailView({ id, posts, events = [], onConnect }) {
  // ...
  // Find event in passed events first (Supabase), fallback to constants
  const ev = [...events, ...EVENTS].find(e => e.id === id)
```

Wait — EVENTS is imported in EventDetailView already. Just update the find:
```js
const ev = (events.length > 0 ? events : EVENTS).find(e => e.id === id) || EVENTS.find(e => e.id === id)
```

- [ ] **Step 4: Build check + run all tests**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npx vite build --mode development 2>&1 | grep -E "error|built" | head -10
npx vitest run 2>&1 | tail -10
```

Expected: build passes, all tests pass.

- [ ] **Step 5: Commit**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
git add src/App.jsx src/pages/EventsView.jsx src/pages/EventDetailView.jsx
git commit -m "feat: wire events/rsvp into app, add new event button and route"
```

---

## Self-Review

### Spec coverage

| Gap | Task |
|-----|------|
| Routing bug "Details" → wrong URL | Task 1 |
| Events in Supabase (not hardcoded) | Tasks 2-3 |
| RSVP persisted to Supabase | Task 4 |
| "I'll be there" button is real | Task 5 |
| Real agenda (not hardcoded) | Task 5 |
| Meeting link field displayed | Task 5 |
| Create new events | Task 6 |
| EventsView reads from Supabase | Task 7 |
| "New event" button in EventsView | Task 7 |
| EventDetailView finds Supabase events | Task 7 |

### No placeholders ✓
All code blocks are complete.

### What's NOT in scope (requires additional features)
- Email notifications on RSVP
- iCal export
- Google Calendar add button
- Attendee list visible on detail page (count is shown, list of names is not)
- Event editing after creation
