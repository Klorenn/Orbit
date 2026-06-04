import { useState, useEffect, useRef, useMemo } from 'react'
import { useChat } from '../hooks/useChat'
import { useT } from '../hooks/useT'
import { who, rankOf } from '../data/constants'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { I } from '../components/Icons'

const URL_RE = /https?:\/\/[^\s<>"']+/g

function renderText(text) {
  const parts = []
  let last = 0
  let m
  URL_RE.lastIndex = 0
  while ((m = URL_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const url = m[0].replace(/[.,;!?]+$/, '')
    parts.push(
      <a key={m.index} href={url} target="_blank" rel="noopener noreferrer" className="chat-link">
        {url}
      </a>
    )
    last = m.index + url.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function timeLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return Math.floor(diff / 60) + 'm'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h'
  return d.toLocaleDateString('es', { month: 'short', day: 'numeric' })
}

function isSameAuthorAndClose(a, b) {
  return a && b && a.author === b.author &&
    Math.abs(new Date(b.created_at) - new Date(a.created_at)) < 120000
}

function MembersSidebar({ messages, identity, bannedUsers }) {
  const members = useMemo(() => {
    const seen = new Map()
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (!seen.has(m.author)) seen.set(m.author, m.created_at)
    }
    return Array.from(seen.entries()).map(([author, lastSeen]) => ({
      author,
      lastSeen,
      u: who(author),
      isBanned: bannedUsers.includes(author),
    }))
  }, [messages, bannedUsers])

  if (members.length === 0) return null

  return (
    <aside className="chat-members">
      <div className="chat-members-title">Miembros activos <span className="chat-members-ct">{members.length}</span></div>
      <div className="chat-members-list">
        {members.map(({ author, u, isBanned }) => {
          const rank = rankOf(u.karma || 0)
          const isMe = author === identity
          return (
            <a
              key={author}
              href={`#/profile/${encodeURIComponent(author)}`}
              className={'chat-member' + (isBanned ? ' chat-member--banned' : '') + (isMe ? ' chat-member--me' : '')}
            >
              <span className="chat-member-av">
                <AmbassadorAvatar user={author} size={28} link={false} />
                <span className="chat-member-dot" style={{ background: isBanned ? '#FF3B30' : '#10B981' }} />
              </span>
              <div className="chat-member-info">
                <div className="chat-member-name">{u.name || author.slice(0, 8) + '…'}</div>
                <div className="chat-member-rank" style={{ color: rank.color }}>{rank.label}</div>
              </div>
              {isBanned && <span className="chat-member-banned-icon" title="Baneado">{I.ban({ width: 11, height: 11 })}</span>}
            </a>
          )
        })}
      </div>
    </aside>
  )
}

function BanModal({ target, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return (
    <div className="ban-overlay" onClick={onCancel}>
      <div className="ban-modal" onClick={e => e.stopPropagation()}>
        <div className="ban-modal-title">Banear usuario</div>
        <div className="ban-modal-user">{target}</div>
        <input
          className="ban-modal-input"
          placeholder="Razón (opcional)"
          value={reason}
          onChange={e => setReason(e.target.value)}
          autoFocus
        />
        <div className="ban-modal-actions">
          <button className="pill pill-line" onClick={onCancel}>Cancelar</button>
          <button className="pill pill-red" onClick={() => onConfirm(reason)}>Banear</button>
        </div>
      </div>
    </div>
  )
}

export function ChatView({ connected, identity, onConnect, isAdmin = false }) {
  const { messages, loading, sendMessage, deleteMessage, banUser, unbanUser, bannedUsers, isBanned } = useChat(identity, isAdmin)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [banTarget, setBanTarget] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const { t } = useT()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = async (e) => {
    e?.preventDefault()
    if (!text.trim() || sending || isBanned) return
    setSending(true)
    await sendMessage(text)
    setText('')
    setSending(false)
    inputRef.current?.focus()
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const handleBanConfirm = async (reason) => {
    await banUser(banTarget, reason)
    setBanTarget(null)
  }

  return (
    <div className="chat-layout">
      <MembersSidebar messages={messages} identity={identity} bannedUsers={bannedUsers} />
    <div className="chat-wrap">
      {banTarget && (
        <BanModal
          target={banTarget}
          onConfirm={handleBanConfirm}
          onCancel={() => setBanTarget(null)}
        />
      )}

      <div className="chat-header">
        <span className="chat-hash">#</span>
        <div>
          <div className="chat-title">general</div>
          <div className="chat-sub">Canal abierto para todos los embajadores</div>
        </div>
        {isAdmin && (
          <span className="chat-admin-badge">Admin</span>
        )}
      </div>

      <div className="chat-feed">
        {loading && <div className="chat-loading">Cargando mensajes…</div>}
        {!loading && messages.length === 0 && (
          <div className="chat-empty">
            <p>Nadie ha escrito aún.</p>
            <p className="chat-empty-hint">Sé el primero en decir algo.</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const prev = messages[i - 1]
          const grouped = isSameAuthorAndClose(prev, msg)
          const u = who(msg.author)
          const isMe = msg.author === identity
          const isAuthorBanned = bannedUsers.includes(msg.author)
          const canDelete = isMe || isAdmin
          const canBan = isAdmin && !isMe && !isAuthorBanned
          const canUnban = isAdmin && !isMe && isAuthorBanned
          return (
            <div key={msg.id} className={'chat-msg' + (grouped ? ' chat-msg--grouped' : '') + (isAuthorBanned ? ' chat-msg--banned' : '')}>
              {!grouped && (
                <div className="chat-msg-head">
                  <AmbassadorAvatar user={msg.author} link={false} size={32} />
                  <span className="chat-author">{u.name || msg.author}</span>
                  {u.role && <span className="chat-role">{u.role}</span>}
                  {isAuthorBanned && <span className="chat-banned-badge">Baneado</span>}
                  <span className="chat-time">{timeLabel(msg.created_at)}</span>
                </div>
              )}
              <div className="chat-msg-body">
                {grouped && <div className="chat-msg-indent" />}
                <p className="chat-text">{renderText(msg.text)}</p>
                <div className="chat-msg-actions">
                  {canDelete && (
                    <button className="chat-del" onClick={() => deleteMessage(msg.id)} title="Borrar mensaje">
                      {I.trash({ width: 13, height: 13 })}
                    </button>
                  )}
                  {canBan && (
                    <button className="chat-ban-btn" onClick={() => setBanTarget(msg.author)} title="Banear usuario">
                      {I.shield({ width: 13, height: 13 })}
                    </button>
                  )}
                  {canUnban && (
                    <button className="chat-unban-btn" onClick={() => unbanUser(msg.author)} title="Desbanear usuario">
                      {I.check({ width: 13, height: 13 })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-foot">
        {!connected ? (
          <div className="chat-gate">
            <span>Conectá tu wallet para participar</span>
            <button className="pill pill-blue" onClick={onConnect}>Conectar</button>
          </div>
        ) : isBanned ? (
          <div className="chat-gate chat-gate--banned">
            <span>Tu cuenta está suspendida del chat</span>
          </div>
        ) : (
          <form className="chat-form" onSubmit={submit}>
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Escribí un mensaje…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={onKey}
              maxLength={500}
              autoComplete="off"
            />
            <button className="chat-send pill pill-blue" type="submit" disabled={!text.trim() || sending}>
              {I.send({ width: 16, height: 16 })}
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
  )
}
