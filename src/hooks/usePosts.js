import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (s < 60) return s + 's'
  if (s < 3600) return Math.floor(s / 60) + 'm'
  if (s < 86400) return Math.floor(s / 3600) + 'h'
  if (s < 2592000) return Math.floor(s / 86400) + 'd'
  return Math.floor(s / 2592000) + 'mo'
}

function normalizePost(p, commentsMap, myVotes) {
  return {
    ...p,
    cidStr: p.cid_str || p.cidStr || '',
    upvoted: myVotes.has(p.id),
    reactions: p.reactions || {},
    time: p.time || (p.created_at ? timeAgo(p.created_at) : '?'),
    comments: (commentsMap[p.id] || []).map(c => ({
      ...c,
      reactions: c.reactions || {},
      replies: [],
    })),
  }
}

const PAGE_SIZE = 20

export function usePosts(identity) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const offsetRef = useRef(0)
  const identityRef = useRef(identity)
  identityRef.current = identity

  const fetchBatch = async (currentIdentity, offset, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const { data: postsData, error: postsErr } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (append) setLoadingMore(false)
    else setLoading(false)

    if (postsErr) { setError(postsErr.message); setHasMore(false); return }
    if (!postsData || postsData.length === 0) { setHasMore(false); return }

    setHasMore(postsData.length === PAGE_SIZE)
    offsetRef.current = offset + postsData.length

    const postIds = postsData.map(p => p.id)
    const [commentsRes, votesRes] = await Promise.all([
      supabase.from('comments').select('*').in('post_id', postIds),
      currentIdentity
        ? supabase.from('votes').select('post_id').eq('voter', currentIdentity)
        : Promise.resolve({ data: [] }),
    ])

    const commentsMap = {}
    for (const c of (commentsRes.data || [])) {
      if (!commentsMap[c.post_id]) commentsMap[c.post_id] = []
      commentsMap[c.post_id].push(c)
    }
    const myVotes = new Set((votesRes.data || []).map(v => v.post_id))
    const normalized = postsData.map(p => normalizePost(p, commentsMap, myVotes))
    setPosts(prev => append ? [...prev, ...normalized] : normalized)
  }

  const fetchPosts = (currentIdentity) => {
    offsetRef.current = 0
    setHasMore(true)
    fetchBatch(currentIdentity, 0, false)
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    fetchBatch(identityRef.current, offsetRef.current, true)
  }

  useEffect(() => {
    fetchBatch(identity, 0, false)

    // Realtime: new posts
    const postsChannel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const me = identityRef.current
        if (payload.new.author === me) return // we already added it optimistically
        setPosts(prev => {
          if (prev.some(p => p.id === payload.new.id)) return prev
          return [normalizePost(payload.new, {}, new Set()), ...prev]
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.map(p =>
          p.id === payload.new.id
            ? { ...p, upvotes: payload.new.upvotes, title: payload.new.title, body: payload.new.body, excerpt: payload.new.excerpt }
            : p
        ))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id))
      })
      .subscribe()

    // Realtime: new comments
    const commentsChannel = supabase
      .channel('comments-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        const c = payload.new
        if (c.author === identityRef.current) return // already added optimistically
        setPosts(prev => prev.map(p =>
          p.id !== c.post_id ? p
            : { ...p, comments: [...(p.comments || []), { ...c, reactions: {}, replies: [] }] }
        ))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(postsChannel)
      supabase.removeChannel(commentsChannel)
    }
  }, [identity])

  const createPost = async ({ cat, type, title, body, evidence, author, cidStr }) => {
    const excerpt = (Array.isArray(body) ? body[0] : body)?.replace(/[#*_>-]/g, '').slice(0, 150) || ''
    const { data, error } = await supabase
      .from('posts')
      .insert({ cat, type, title, excerpt, body, author, evidence, cid_str: cidStr, upvotes: 1 })
      .select()
      .single()
    if (error) throw new Error(error.message)
    const normalized = normalizePost(data, {}, new Set())
    setPosts(ps => [normalized, ...ps])
    return normalized
  }

  const updatePost = async (id, { title, body }) => {
    const excerpt = (Array.isArray(body) ? body[0] : body)?.replace(/[#*_>-]/g, '').slice(0, 150) || ''
    const { error } = await supabase.from('posts').update({ title, body, excerpt }).eq('id', id)
    if (error) throw new Error(error.message)
    setPosts(ps => ps.map(p => p.id === id ? { ...p, title, body, excerpt } : p))
  }

  const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setPosts(ps => ps.filter(p => p.id !== id))
  }

  return { posts, setPosts, loading, loadingMore, hasMore, loadMore, error, fetchPosts: () => fetchPosts(identity), createPost, updatePost, deletePost }
}
