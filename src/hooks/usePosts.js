import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_POSTS } from '../data/seed'

export function usePosts() {
  const [posts, setPosts] = useState(SEED_POSTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data && data.length > 0) setPosts(data)
  }

  useEffect(() => { fetchPosts() }, [])

  const createPost = async ({ cat, type, title, body, evidence, author, cidStr }) => {
    const excerpt = body[0]?.replace(/[#*_>-]/g, '').slice(0, 150) || ''
    const { data, error } = await supabase
      .from('posts')
      .insert({ cat, type, title, excerpt, body, author, evidence, cid_str: cidStr, upvotes: 1 })
      .select()
      .single()
    if (error) throw new Error(error.message)
    setPosts(ps => [data, ...ps])
    return data
  }

  return { posts, setPosts, loading, error, fetchPosts, createPost }
}
