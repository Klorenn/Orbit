import { useEffect } from 'react'
import { AMBASSADORS } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'

const postCountFor = (posts, name) => posts.filter(p => p.author === name).length

export function LeaderboardView({ posts }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const ranked = Object.values(AMBASSADORS).filter(u => u.role !== 'Core' && u.name !== 'you.fil')
    .map(u => ({ ...u, pc: postCountFor(posts, u.name) }))
    .sort((a, b) => b.karma - a.karma)
  const medal = ['#FFD60A', '#C0C7D0', '#CD7F4E']
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Leaderboard</h1>
      <p className="page-sub">Ambassadors ranked by karma — earned through reports, proposals, and helpful contributions.</p>
      <div className="lb-list">
        {ranked.map((u, i) => (
          <a key={u.name} className="lb-row" href={'#/profile/' + u.name}>
            <span className="lb-rank" style={i < 3 ? { background: medal[i], color: '#0A0E27' } : null}>{i + 1}</span>
            <AmbassadorAvatar user={u.name} size={42} link={false} nft />
            <div className="lb-info"><div className="lb-name">{u.name}</div><div className="lb-city">{u.city}</div></div>
            <div className="lb-stats">
              <div className="lb-stat"><strong>{u.karma}</strong><span>karma</span></div>
              <div className="lb-stat"><strong>{u.pc}</strong><span>posts</span></div>
              <div className="lb-stat"><strong>{u.events || 0}</strong><span>events</span></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
