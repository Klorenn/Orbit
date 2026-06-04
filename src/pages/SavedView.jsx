import { useEffect } from 'react'
import { I } from '../components/Icons'
import { PostCard } from '../components/PostCard'
import { useSaved } from '../components/BookmarkBtn'
import { useT } from '../hooks/useT'

export function SavedView({ posts, onVote }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const saved = useSaved()
  const list = posts.filter(p => saved.includes(p.id))
  return (
    <div className="page-wrap">
      <a className="back-link" href="/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('savedPostsTitle')}</h1>
      <div className="feed" style={{ marginTop: 18 }}>
        {list.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {list.length === 0 && <p className="empty">{t('noSavedPosts')}</p>}
      </div>
    </div>
  )
}
