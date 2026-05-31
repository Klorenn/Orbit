import { useState, useEffect } from 'react'
import { AMBASSADORS } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'

const postCountFor = (posts, name) => posts.filter(p => p.author === name).length

export function AmbassadorsView({ posts }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [q, setQ] = useState('')
  const all = Object.values(AMBASSADORS).filter(u => u.role !== 'Core' && u.name !== 'you.fil')
  const list = all.filter(u => (u.name + u.city).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Ambassadors</h1>
      <p className="page-sub">{all.length} verified ambassadors across the constellation. Every one holds the Orbit Ambassador NFT.</p>
      <div className="amb-search">{I.search()}<input placeholder="Search by name or city…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="amb-grid">
        {list.map(u => (
          <a key={u.name} className="amb-card" href={'#/profile/' + u.name}>
            <AmbassadorAvatar user={u.name} size={56} link={false} nft />
            <div className="amb-info">
              <div className="amb-name">{u.name}</div>
              <div className="amb-city">{u.city}</div>
            </div>
            <p className="amb-bio">{u.bio}</p>
            <div className="amb-stats">
              <span><strong>{u.karma}</strong> karma</span>
              <span className="dotsep"></span>
              <span><strong>{postCountFor(posts, u.name)}</strong> posts</span>
              <span className="dotsep"></span>
              <span><strong>{u.events || 0}</strong> events</span>
            </div>
          </a>
        ))}
        {list.length === 0 && <p className="empty">No ambassadors match "{q}".</p>}
      </div>
    </div>
  )
}
