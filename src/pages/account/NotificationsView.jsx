import { useEffect } from 'react'
import { I } from '../../components/Icons'
import { AmbassadorAvatar } from '../../components/AmbassadorAvatar'
import { ProfileTabs } from './MyPostsView'
import { useT } from '../../hooks/useT'

const NOTIF_ICON = { comment: 'cmt', vote: 'up', mention: 'reply', event: 'cal', system: 'check', follow: 'check' }

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (s < 60) return s + 's'
  if (s < 3600) return Math.floor(s / 60) + 'm'
  if (s < 86400) return Math.floor(s / 3600) + 'h'
  return Math.floor(s / 86400) + 'd'
}

export function NotificationsView({ notifications = [], markRead, markAllRead }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()

  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{I.back()} {t('backToProfile')}</a>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{t('notificationsTitle')}</h1>
        {notifications.some(n => n.unread) && (
          <button className="pill pill-line" onClick={markAllRead}>{I.check()} {t('markAllRead')}</button>
        )}
      </div>
      <ProfileTabs active="notifications" />
      <div className="notif-list" style={{ marginTop: 18 }}>
        {notifications.length === 0 && <p className="empty">{t('noNotifications')}</p>}
        {notifications.map(n => (
          <a key={n.id} className={'notif-row' + (n.unread ? ' unread' : '')}
            href={n.link || '#/forum'}
            onClick={() => n.unread && markRead(n.id)}>
            <span className={'ni-ic ni-' + n.type}>{I[NOTIF_ICON[n.type] || 'bell']()}</span>
            <AmbassadorAvatar user={n.actor} size={36} link={false} />
            <div className="ni-body">
              <span className="ni-text"><b>{n.actor}</b> {n.text}</span>
              <span className="ni-time">{t('agoFormat').replace('{0}', timeAgo(n.created_at))}</span>
            </div>
            {n.unread && <span className="ni-dot"></span>}
          </a>
        ))}
      </div>
    </div>
  )
}
