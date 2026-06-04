import { useState, useEffect, useRef } from 'react'
import { AMBASSADORS } from '../data/constants'
import { supabase } from '../lib/supabase'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { useT } from '../hooks/useT'

export function SearchView({ q, posts, onVote, ambassadors: propAmbassadors }) {
  const [query, setQuery] = useState(q || '')
  const [dbPosts, setDbPosts] = useState(null)
  const debounceRef = useRef(null)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.trim().length < 3) { setDbPosts(null); return }
    debounceRef.current = setTimeout(async () => {
      const q = query.trim()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(30)
      if (data) setDbPosts(data.map(p => ({ ...p, cidStr: p.cid_str || '', upvoted: false, reactions: {}, comments: [] })))
    }, 320)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const ql = query.trim().toLowerCase()
  const localHits = ql ? posts.filter(p => {
    const bodyText = Array.isArray(p.body) ? p.body.join(' ') : (p.body || '')
    return (p.title + (p.excerpt || '') + bodyText + p.author).toLowerCase().includes(ql)
  }) : []
  const postHits = dbPosts !== null
    ? dbPosts.map(d => { const existing = posts.find(p => p.id === d.id); return existing || d })
    : localHits

  const ambSource = (propAmbassadors && propAmbassadors.length > 0)
    ? propAmbassadors
    : Object.values(AMBASSADORS).filter(u => u.name !== 'you.fil')
  const ambHits = ql ? ambSource.filter(u => (u.name + (u.city || '') + (u.bio || '')).toLowerCase().includes(ql)) : []

  return (
    <div className="page-wrap">
      <a className="back-link" href="/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('searchTitle')}</h1>
      <div className="amb-search big">{I.search()}<input autoFocus placeholder={t('searchPlaceholder')} value={query} onChange={e => setQuery(e.target.value)} /></div>
      {!ql && <p className="empty">{t('typeToSearch')}</p>}
      {ql && (
        <>
          {ambHits.length > 0 && <>
            <h3 className="section-h">{t('ambassadorsSection')} · {ambHits.length}</h3>
            <div className="amb-grid">
              {ambHits.map(u => (
                <a key={u.name} className="amb-card" href={'/profile/' + u.name}>
                  <AmbassadorAvatar user={u.name} size={48} link={false} nft />
                  <div className="amb-info"><div className="amb-name">{u.name}</div><div className="amb-city">{u.city}</div></div>
                </a>
              ))}
            </div>
          </>}
          <h3 className="section-h">{t('postsSection')} · {postHits.length}</h3>
          <div className="feed">
            {postHits.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
            {postHits.length === 0 && <p className="empty">{t('noPostsMatch')} "{query}".</p>}
          </div>
        </>
      )}
    </div>
  )
}
