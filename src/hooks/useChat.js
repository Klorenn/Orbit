import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const LIMIT = 60

export function useChat(identity) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const fetch = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(LIMIT)
      if (mounted && data) setMessages(data)
      if (mounted) setLoading(false)
    }

    fetch()

    channelRef.current = supabase
      .channel('general-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (mounted) setMessages(prev => [...prev, payload.new])
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        if (mounted) setMessages(prev => prev.filter(m => m.id !== payload.old.id))
      })
      .subscribe()

    return () => {
      mounted = false
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  const sendMessage = async (text) => {
    if (!text.trim() || !identity) return
    await supabase.from('messages').insert({ author: identity, text: text.trim() })
  }

  const deleteMessage = async (id) => {
    await supabase.from('messages').delete().eq('id', id)
  }

  return { messages, loading, sendMessage, deleteMessage }
}
