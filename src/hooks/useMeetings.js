import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function normalizeMeeting(row) {
  return {
    ...row,
    desc: row.description || row.desc || '',
    when: row.when_label || row.when || '',
    durationMin: row.duration_min || row.durationMin || 50,
    attendees: (row.meeting_attendees || []).map(a => a.attendee),
  }
}

export function useMeetings(identity) {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    async function fetchMeetings() {
      const { data, error } = await supabase
        .from('meetings')
        .select('*, meeting_attendees(attendee)')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) setMeetings(data.map(normalizeMeeting))
    }
    fetchMeetings()
  }, [])

  const joinMeeting = useCallback(async (id) => {
    if (!identity) return
    setMeetings(ms => ms.map(m => m.id !== id ? m : {
      ...m,
      attendees: m.attendees.includes(identity) ? m.attendees : [...m.attendees, identity],
    }))
    await supabase.from('meeting_attendees')
      .upsert({ meeting_id: id, attendee: identity }, { onConflict: 'meeting_id,attendee' })
  }, [identity])

  const leaveMeeting = useCallback(async (id) => {
    if (!identity) return
    setMeetings(ms => ms.map(m => m.id !== id ? m : {
      ...m,
      attendees: m.attendees.filter(a => a !== identity),
    }))
    await supabase.from('meeting_attendees')
      .delete().eq('meeting_id', id).eq('attendee', identity)
  }, [identity])

  const proposeMeeting = useCallback(async (m) => {
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title: m.title, description: m.desc || m.description || '', kind: m.kind || 'Community',
        host: identity || m.host,
        when_label: m.when, duration_min: m.durationMin || 50,
        status: 'upcoming', capacity: m.capacity || null,
      })
      .select('*, meeting_attendees(attendee)')
      .single()
    const result = (!error && data) ? normalizeMeeting(data) : { ...m, id: 'm' + Date.now(), attendees: [] }
    setMeetings(ms => [result, ...ms])
    return result
  }, [identity])

  const deleteMeeting = useCallback(async (id) => {
    setMeetings(ms => ms.filter(m => m.id !== id))
    await supabase.from('meetings').delete().eq('id', id)
  }, [])

  const updateMeeting = useCallback(async (id, updates) => {
    setMeetings(ms => ms.map(m => m.id !== id ? m : { ...m, ...updates }))
    await supabase.from('meetings').update({
      title: updates.title,
      description: updates.desc || updates.description || '',
      kind: updates.kind,
      when_label: updates.when,
      duration_min: updates.durationMin || 50,
      capacity: updates.capacity || null,
    }).eq('id', id)
  }, [])

  return { meetings, setMeetings, joinMeeting, leaveMeeting, proposeMeeting, deleteMeeting, updateMeeting }
}
