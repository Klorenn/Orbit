import { useEffect } from 'react'
import { I } from '../../components/Icons'
import { PostCard } from '../../components/PostCard'
import { useT } from '../../hooks/useT'

export function ProfileTabs({ active }) {
  const { t } = useT()
  const tabs = [
    ['overview', t('tabOverview'), '/profile/me'],
    ['posts', t('tabPosts'), '/profile/me/posts'],
    ['notifications', t('tabNotifications'), '/profile/me/notifications'],
    ['settings', t('tabSettings'), '/profile/me/settings'],
  ]
  return (
    <div className="prof-tabs">
      {tabs.map(([k, l, h]) => <a key={k} href={h} className={active === k ? 'on' : ''}>{l}</a>)}
    </div>
  )
}

export function MyPostsView({ posts, onVote, identity }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const mine = posts.filter(p => identity ? p.author === identity : p.author === 'you.fil')
  return (
    <div className="page-wrap">
      <a className="back-link" href="/profile/me">{I.back()} {t('backToProfile')}</a>
      <h1 className="page-title">{t('myPostsTitle')}</h1>
      <ProfileTabs active="posts" />
      <div className="feed" style={{ marginTop: 18 }}>
        {mine.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {mine.length === 0 && <p className="empty">{t('noMyPosts')}<a href="/forum/new">{t('writeFirstLink')}</a></p>}
      </div>
    </div>
  )
}
