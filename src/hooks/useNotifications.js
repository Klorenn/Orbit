import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useNotifications(identity) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!identity) return
    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient', identity)
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setNotifications(data)
    }
    fetchNotifications()

    // Realtime: push new notifications without polling
    const channel = supabase
      .channel('notifications:' + identity)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: 'recipient=eq.' + identity,
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [identity])

  const markRead = useCallback(async (id) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n))
    await supabase.from('notifications').update({ unread: false }).eq('id', id)
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications(ns => ns.map(n => ({ ...n, unread: false })))
    if (!identity) return
    await supabase.from('notifications').update({ unread: false }).eq('recipient', identity).eq('unread', true)
  }, [identity])

  return { notifications, markRead, markAllRead }
}

export async function insertNotification({ recipient, type, actor, postId, text, link }) {
  if (!recipient || recipient === actor) return
  await supabase.from('notifications').insert({
    recipient, type, actor,
    post_id: postId || null,
    text, link: link || null,
    unread: true,
  })
}
