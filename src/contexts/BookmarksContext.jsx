import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const BookmarksContext = createContext({ saved: [], toggle: () => {} })

const LS_KEY = 'orbit-saved'
function getLSSaved() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] } }

export function BookmarksProvider({ identity, children }) {
  const [saved, setSaved] = useState(getLSSaved)

  useEffect(() => {
    if (!identity) return
    supabase.from('bookmarks').select('post_id').eq('identity', identity)
      .then(({ data }) => {
        if (data) {
          const ids = data.map(r => r.post_id)
          setSaved(ids)
          localStorage.setItem(LS_KEY, JSON.stringify(ids))
        }
      })
  }, [identity])

  const toggle = async (postId) => {
    const isOn = saved.includes(postId)
    const next = isOn ? saved.filter(x => x !== postId) : [...saved, postId]
    setSaved(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    if (identity) {
      if (isOn) {
        await supabase.from('bookmarks').delete().eq('identity', identity).eq('post_id', postId)
      } else {
        await supabase.from('bookmarks').insert({ identity, post_id: postId })
      }
    }
  }

  return <BookmarksContext.Provider value={{ saved, toggle }}>{children}</BookmarksContext.Provider>
}

export function useBookmarks() { return useContext(BookmarksContext) }
