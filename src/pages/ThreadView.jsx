import { useState, useEffect } from 'react'
import { ME, catOf, who, navTo } from '../data/constants'
import { I } from '../components/Icons'
import { Vote } from '../components/Vote'
import { CategoryBadge } from '../components/CategoryBadge'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { Comment } from '../components/Comment'
import { ReactionBar } from '../components/ReactionBar'
import { WalletGate } from '../components/WalletGate'
import { renderRich } from '../components/MarkdownEditor'
import { MentionInput } from '../components/MentionInput'
import { useT } from '../hooks/useT'

export function ThreadView({ cat, id, posts, connected, onConnect, onVote, onAddComment, onReact, onReply, onReactPost, onDelete, onUpdate, onDeleteComment, onReport, identity }) {
  const post = posts.find(p => p.id === id)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [saving, setSaving] = useState(false)
  const { t } = useT()
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!post) return <div className="page-wrap"><p className="empty">{t('postNotFound')} <a href="/forum">{t('backToForum')}</a></p></div>

  const u = who(post.author)
  const isAuthor = connected && identity && post.author === identity
  const submit = () => { if (!draft.trim()) return; onAddComment(post.id, draft.trim()); setDraft('') }
  const commentCount = post.comments.length
  const commentLabel = commentCount === 1 ? t('comment_singular') : t('comments')

  const startEdit = () => {
    setEditTitle(post.title)
    setEditBody(Array.isArray(post.body) ? post.body.join('\n\n') : (post.body || ''))
    setEditing(true)
  }
  const saveEdit = async () => {
    if (!editTitle.trim()) return
    setSaving(true)
    try {
      const bodyArr = editBody.split(/\n\n+/).map(s => s.trim()).filter(Boolean)
      await onUpdate(post.id, { title: editTitle.trim(), body: bodyArr })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }
  const handleDelete = async () => {
    if (!window.confirm(t('confirmDeletePost'))) return
    await onDelete(post.id)
    navTo('/forum/' + post.cat)
  }

  return (
    <div className="page-wrap thread">
      <a className="back-link" href={'/forum/' + post.cat}>{I.back()} {catOf(post.cat).name}</a>
      <div className="post-tags" style={{ marginTop: 12, marginBottom: 14 }}>
        <span className="tag type">{post.type}</span>
        <CategoryBadge cat={post.cat} soft />
        <span className="cid">◈ {post.cidStr}</span>
        <span className="post-author-actions">
          {!isAuthor && connected && (
            <button className="icon-btn" onClick={() => onReport && onReport(post.id)} title={t('reportPost')}>{I.flag({ width: 14, height: 14 })}</button>
          )}
          {isAuthor && !editing && (
            <>
              <button className="icon-btn" onClick={startEdit} title={t('editProfile')}>{I.edit({ width: 14, height: 14 })}</button>
              <button className="icon-btn danger" onClick={handleDelete} title={t('deletePost')}>{I.trash({ width: 14, height: 14 })}</button>
            </>
          )}
        </span>
      </div>

      {editing ? (
        <div className="post-edit-form">
          <input className="edit-title-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          <textarea className="edit-body-input" value={editBody} onChange={e => setEditBody(e.target.value)} rows={10} />
          <div className="edit-actions">
            <button className="pill pill-ghost" onClick={() => setEditing(false)}>{t('cancelBtn')}</button>
            <button className="pill pill-blue" onClick={saveEdit} disabled={saving}>{saving ? '…' : t('save')}</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="dt">{post.title}</h1>
          <div className="detail-author">
            <AmbassadorAvatar user={post.author} size={44} nft />
            <div>
              <div className="nm"><a href={'/profile/' + u.name}>{u.name}</a> {u.role && <span className="role">{u.role}</span>}</div>
              <div className="sub">{u.city} · {t('agoFormat').replace('{0}', post.time)}</div>
            </div>
            <Vote count={post.upvotes} voted={post.upvoted} onToggle={() => onVote(post.id)} row />
          </div>
          <div className="prose">{renderRich(Array.isArray(post.body) ? post.body.join('\n\n') : (post.body || ''))}</div>
          {(post.evidence || []).length > 0 && (
            <>
              <h3 className="evi-head">{t('evidenceOnFilecoin')}</h3>
              <div className="evidence">
                {post.evidence.map((e, i) => (
                  <div className="evi" key={i}><span className="ic">{I.doc()}</span><div><div className="en">{e.name}</div><div className="es">◈ {e.size}</div></div></div>
                ))}
              </div>
            </>
          )}
          <ReactionBar reactions={post.reactions} onReact={(emoji) => onReactPost(post.id, emoji)} />
        </>
      )}

      <div className="comments">
        <h3>{commentCount} {commentLabel}</h3>
        <WalletGate connected={connected} onConnect={onConnect} label={t('connectToComment')}>
          <div className="composer">
            <AmbassadorAvatar user="you.fil" size={38} link={false} />
            <div className="cbox">
              <MentionInput value={draft} onChange={setDraft} placeholder={t('addToDiscussion')}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }} />
              <div className="crow">
                <span className="hint">{I.shield()} {t('postingAs')} {ME.name} · {t('mentionHint')}</span>
                <button className="pill pill-blue" onClick={submit} style={{ opacity: draft.trim() ? 1 : .5 }}>{t('commentSend')}</button>
              </div>
            </div>
          </div>
        </WalletGate>
        {post.comments.map(cm => <Comment key={cm.id} c={cm} onReact={(cid, emoji) => onReact(post.id, cid, emoji)} onReply={(cid, text) => onReply(post.id, cid, text)} onDelete={onDeleteComment} identity={identity} />)}
        {post.comments.length === 0 && <p className="empty" style={{ textAlign: 'left', padding: '8px 0' }}>{t('noCommentsYet')}</p>}
      </div>
    </div>
  )
}
