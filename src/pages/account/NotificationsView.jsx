import { useState, useEffect } from 'react'
import { NOTIFICATIONS } from '../../data/constants'
import { I } from '../../components/Icons'
import { AmbassadorAvatar } from '../../components/AmbassadorAvatar'
import { ProfileTabs } from './MyPostsView'

const NOTIF_ICON = { comment: 'cmt', vote: 'up', mention: 'reply', event: 'cal', system: 'check' }

export function NotificationsView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [items, setItems] = useState(NOTIFICATIONS.map(n => ({ ...n })))
  const markAll = () => setItems(it => it.map(n => ({ ...n, unread: false })))
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{I.back()} My profile</a>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Notifications</h1>
        <button className="pill pill-line" onClick={markAll}>{I.check()} Mark all read</button>
      </div>
      <ProfileTabs active="notifications" />
      <div className="notif-list" style={{ marginTop: 18 }}>
        {items.map(n => (
          <a key={n.id} className={'notif-row' + (n.unread ? ' unread' : '')} href={n.link}
            onClick={() => setItems(it => it.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
            <span className={'ni-ic ni-' + n.type}>{I[NOTIF_ICON[n.type] || 'bell']()}</span>
            <AmbassadorAvatar user={n.who} size={36} link={false} />
            <div className="ni-body"><span className="ni-text"><b>{n.who}</b> {n.text}</span><span className="ni-time">{n.time} ago</span></div>
            {n.unread && <span className="ni-dot"></span>}
          </a>
        ))}
      </div>
    </div>
  )
}
