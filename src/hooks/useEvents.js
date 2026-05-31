import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function transformEvent(row) {
  const d = new Date(row.when_date + 'T12:00:00')
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase()
  const day = String(d.getDate()).padStart(2, '0')
  const when = d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
  const cityLabel = row.city + (row.country ? ', ' + row.country : '')
  const spotsLabel = row.status === 'past'
    ? (row.spots ? `${row.spots} attended` : 'Past event')
    : (row.spots ? `Open · ${row.spots} seats` : 'Open')
  return { ...row, month, day, when, city: cityLabel, spots: spotsLabel }
}

export function useEvents(identity) {
  const [events, setEvents] = useState([])
  const [myRsvps, setMyRsvps] = useState([])

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('when_date', { ascending: true })
      if (!error && data && data.length > 0) setEvents(data.map(transformEvent))
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (!identity) return
    async function fetchRsvps() {
      const { data } = await supabase
        .from('rsvps')
        .select('event_id')
        .eq('attendee', identity)
      if (data) setMyRsvps(data.map(r => r.event_id))
    }
    fetchRsvps()
  }, [identity])

  const rsvp = useCallback(async (eventId) => {
    if (!identity) return new Error('Not connected')
    const { error } = await supabase
      .from('rsvps')
      .insert({ event_id: eventId, attendee: identity })
    if (!error) setMyRsvps(r => [...r, eventId])
    return error
  }, [identity])

  const cancelRsvp = useCallback(async (eventId) => {
    if (!identity) return new Error('Not connected')
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('attendee', identity)
    if (!error) setMyRsvps(r => r.filter(id => id !== eventId))
    return error
  }, [identity])

  return { events, myRsvps, rsvp, cancelRsvp }
}
