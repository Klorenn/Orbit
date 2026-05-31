import { useEffect } from 'react'
import { I } from '../components/Icons'
import { PostCard } from '../components/PostCard'
import { useSaved } from '../components/BookmarkBtn'

export function SavedView({ posts, onVote }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const saved = useSaved()
  const list = posts.filter(p => saved.includes(p.id))
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Saved posts</h1>
      <div className="feed" style={{ marginTop: 18 }}>
        {list.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {list.length === 0 && <p className="empty">No saved posts yet — bookmark posts to find them here.</p>}
      </div>
    </div>
  )
}
