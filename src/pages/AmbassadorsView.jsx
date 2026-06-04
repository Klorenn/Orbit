import { useState, useEffect } from 'react'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { useT } from '../hooks/useT'

const postCountFor = (posts, identity) => posts.filter(p => p.author === identity).length

export function AmbassadorsView({ posts, ambassadors: propAmbassadors }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const [q, setQ] = useState('')

  const loading = !propAmbassadors
  const all = propAmbassadors || []
  const list = all.filter(u => (u.name + (u.city || '')).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="page-wrap">
      <a className="back-link" href="/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('ambassadorsTitle')}</h1>
      <p className="page-sub">{all.length} {t('ambassadorsSubCount')}</p>
      <div className="amb-search">{I.search()}<input placeholder={t('searchByNameCity')} value={q} onChange={e => setQ(e.target.value)} /></div>
      {loading && <p className="empty" style={{ opacity: .5 }}>Cargando…</p>}
      <div className="amb-grid">
        {!loading && list.map(u => {
          const key = u.identity || u.name
          return (
            <a key={key} className="amb-card" href={'/profile/' + encodeURIComponent(key)}>
              <AmbassadorAvatar user={key} size={56} link={false} nft />
              <div className="amb-info">
                <div className="amb-name">
                  {u.name}
                  {u.role && !['Ambassador', 'Member', 'Newcomer', 'Contributor', 'Senior Ambassador', 'Veteran'].includes(u.role) && (
                    <span className="role" data-role={u.role}>{u.role}</span>
                  )}
                </div>
                <div className="amb-city">{u.city}</div>
              </div>
              <p className="amb-bio">{u.bio}</p>
              <div className="amb-stats">
                <span><strong>{u.karma || 0}</strong> {t('karma')}</span>
                <span className="dotsep"></span>
                <span><strong>{postCountFor(posts, key)}</strong> {t('postsLabel')}</span>
                <span className="dotsep"></span>
                <span><strong>{u.events || 0}</strong> {t('eventsLabel')}</span>
              </div>
            </a>
          )
        })}
        {list.length === 0 && <p className="empty">{t('noAmbassadorsMatch')} "{q}".</p>}
      </div>
    </div>
  )
}
