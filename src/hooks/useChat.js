import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const LIMIT = 60

export function useChat(identity, isAdmin = false) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannedUsers, setBannedUsers] = useState([])
  const channelRef = useRef(null)

  const isBanned = bannedUsers.includes(identity)

  useEffect(() => {
    let mounted = true

    const fetchBans = async () => {
      const { data } = await supabase.from('bans').select('identity')
      if (mounted && data) setBannedUsers(data.map(b => b.identity))
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(LIMIT)
      if (mounted && data) setMessages(data)
      if (mounted) setLoading(false)
    }

    fetchBans()
    fetchMessages()

    channelRef.current = supabase
      .channel('general-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (mounted) setMessages(prev => {
          const exists = prev.some(m => m.id === payload.new.id)
          return exists
            ? prev
            : [...prev.filter(m => !(m._optimistic && m.author === payload.new.author && m.text === payload.new.text)), payload.new]
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        if (mounted) setMessages(prev => prev.filter(m => m.id !== payload.old.id))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bans' }, (payload) => {
        if (mounted) setBannedUsers(prev => [...prev, payload.new.identity])
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bans' }, (payload) => {
        if (mounted) setBannedUsers(prev => prev.filter(id => id !== payload.old.identity))
      })
      .subscribe()

    return () => {
      mounted = false
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  const sendMessage = async (text) => {
    if (!text.trim() || !identity || isBanned) return
    const optimistic = {
      id: crypto.randomUUID(),
      author: identity,
      text: text.trim(),
      created_at: new Date().toISOString(),
      _optimistic: true,
    }
    setMessages(prev => [...prev, optimistic])
    const { data } = await supabase.from('messages').insert({ author: identity, text: text.trim() }).select().single()
    if (data) {
      setMessages(prev => prev.map(m =>
        m._optimistic && m.text === text.trim() && m.author === identity ? data : m
      ))
    }
  }

  const deleteMessage = async (id) => {
    await supabase.from('messages').delete().eq('id', id)
  }

  const banUser = async (targetIdentity, reason = '') => {
    if (!isAdmin || !targetIdentity || targetIdentity === identity) return
    await supabase.from('bans').insert({ identity: targetIdentity, banned_by: identity, reason })
  }

  const unbanUser = async (targetIdentity) => {
    if (!isAdmin) return
    await supabase.from('bans').delete().eq('identity', targetIdentity)
  }

  return { messages, loading, sendMessage, deleteMessage, banUser, unbanUser, bannedUsers, isBanned }
}
