import { useEffect } from 'react'
import { I } from '../../components/Icons'
import { PostCard } from '../../components/PostCard'

export function ProfileTabs({ active }) {
  const tabs = [
    ['overview', 'Overview', '#/profile/me'],
    ['posts', 'Posts', '#/profile/me/posts'],
    ['notifications', 'Notifications', '#/profile/me/notifications'],
    ['settings', 'Settings', '#/profile/me/settings'],
  ]
  return (
    <div className="prof-tabs">
      {tabs.map(([k, l, h]) => <a key={k} href={h} className={active === k ? 'on' : ''}>{l}</a>)}
    </div>
  )
}

export function MyPostsView({ posts, onVote }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const mine = posts.filter(p => p.author === 'you.fil')
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{I.back()} My profile</a>
      <h1 className="page-title">My posts</h1>
      <ProfileTabs active="posts" />
      <div className="feed" style={{ marginTop: 18 }}>
        {mine.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {mine.length === 0 && <p className="empty">You haven't published yet. <a href="#/forum/new">Write your first post →</a></p>}
      </div>
    </div>
  )
}
