// src/hooks/useFilecoinBlog.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

export function useFilecoinBlog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('blog_cache')
        .select('articles, fetched_at')
        .eq('id', 1)
        .maybeSingle()

      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      if (data?.articles) setArticles(data.articles)
      setLoading(false)

      const stale = !data || (Date.now() - new Date(data.fetched_at).getTime() > TWENTY_FOUR_HOURS)
      if (stale) {
        supabase.functions.invoke('sync-filecoin-blog')
          .then(() => {
            return supabase
              .from('blog_cache')
              .select('articles')
              .eq('id', 1)
              .maybeSingle()
          })
          .then(({ data: updated }) => {
            if (updated?.articles) setArticles(updated.articles)
          })
          .catch(() => { /* background refresh failure is silent */ })
      }
    }
    load()
  }, [])

  return { articles, loading, error }
}
