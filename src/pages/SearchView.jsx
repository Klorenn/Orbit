import { useState, useEffect } from 'react'
import { AMBASSADORS } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'

export function SearchView({ q, posts, onVote }) {
  const [query, setQuery] = useState(q || '')
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const ql = query.trim().toLowerCase()
  const postHits = ql ? posts.filter(p => (p.title + p.excerpt + p.body.join(' ') + p.author).toLowerCase().includes(ql)) : []
  const ambHits = ql ? Object.values(AMBASSADORS).filter(u => u.name !== 'you.fil' && (u.name + u.city + (u.bio || '')).toLowerCase().includes(ql)) : []
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Search</h1>
      <div className="amb-search big">{I.search()}<input autoFocus placeholder="Search posts, proposals, ambassadors…" value={query} onChange={e => setQuery(e.target.value)} /></div>
      {!ql && <p className="empty">Type to search across the whole forum.</p>}
      {ql && (
        <>
          {ambHits.length > 0 && <>
            <h3 className="section-h">Ambassadors · {ambHits.length}</h3>
            <div className="amb-grid">
              {ambHits.map(u => (
                <a key={u.name} className="amb-card" href={'#/profile/' + u.name}>
                  <AmbassadorAvatar user={u.name} size={48} link={false} nft />
                  <div className="amb-info"><div className="amb-name">{u.name}</div><div className="amb-city">{u.city}</div></div>
                </a>
              ))}
            </div>
          </>}
          <h3 className="section-h">Posts · {postHits.length}</h3>
          <div className="feed">
            {postHits.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
            {postHits.length === 0 && <p className="empty">No posts match "{query}".</p>}
          </div>
        </>
      )}
    </div>
  )
}
