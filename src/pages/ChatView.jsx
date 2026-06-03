import { useState, useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import { useT } from '../hooks/useT'
import { who } from '../data/constants'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { I } from '../components/Icons'

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

export function ChatView({ connected, identity, onConnect }) {
  const { messages, loading, sendMessage, deleteMessage } = useChat(identity)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const { t } = useT()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = async (e) => {
    e?.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    await sendMessage(text)
    setText('')
    setSending(false)
    inputRef.current?.focus()
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  return (
    <div className="chat-wrap">
      <div className="chat-header">
        <span className="chat-hash">#</span>
        <div>
          <div className="chat-title">general</div>
          <div className="chat-sub">Canal abierto para todos los embajadores</div>
        </div>
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
          return (
            <div key={msg.id} className={'chat-msg' + (grouped ? ' chat-msg--grouped' : '')}>
              {!grouped && (
                <div className="chat-msg-head">
                  <AmbassadorAvatar user={msg.author} link={false} size={32} />
                  <span className="chat-author">{u.name || msg.author}</span>
                  {u.role && <span className="chat-role">{u.role}</span>}
                  <span className="chat-time">{timeLabel(msg.created_at)}</span>
                </div>
              )}
              <div className="chat-msg-body">
                {grouped && <div className="chat-msg-indent" />}
                <p className="chat-text">{msg.text}</p>
                {isMe && (
                  <button className="chat-del" onClick={() => deleteMessage(msg.id)} title="Borrar">
                    {I.trash({ width: 13, height: 13 })}
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-foot">
        {connected ? (
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
        ) : (
          <div className="chat-gate">
            <span>Conectá tu wallet para participar</span>
            <button className="pill pill-blue" onClick={onConnect}>Conectar</button>
          </div>
        )}
      </div>
    </div>
  )
}
