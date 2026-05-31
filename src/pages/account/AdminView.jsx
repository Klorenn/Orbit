import { useState, useEffect } from 'react'
import { CATEGORIES, FLAGGED, USERS_ADMIN, ALLOWLIST, ADMIN_STATS, who } from '../../data/constants'
import { I } from '../../components/Icons'
import { AmbassadorAvatar } from '../../components/AmbassadorAvatar'
import { MarkdownEditor } from '../../components/MarkdownEditor'

const ADMIN_NAV = [
  ['home', 'Dashboard', 'grid'],
  ['reports', 'Reports', 'flag'],
  ['users', 'Users', 'shield'],
  ['categories', 'Categories', 'list'],
  ['allowlist', 'Allowlist', 'check'],
  ['announcements', 'Announcements', 'bell'],
]
const ROLE_COLOR = { Core: '#0090FF', Moderator: '#A855F7', Ambassador: '#10B981', Applicant: '#FFD60A', Member: '#9aa0aa' }
const FSTATUS_COLOR = { open: '#FF3B30', reviewing: '#FFD60A', resolved: '#10B981' }

function AdminHome() {
  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <p className="admin-sub">Moderator overview — the health of the constellation at a glance.</p>
      <div className="admin-stats">
        {ADMIN_STATS.map((s, i) => (
          <div className="admin-stat" key={i}><span className="as-dot" style={{ background: s.tone }}></span><div className="as-v">{s.value}</div><div className="as-l">{s.label}</div></div>
        ))}
      </div>
      <h3 className="section-h">Needs attention</h3>
      <div className="admin-table">
        <div className="at-head"><span>Item</span><span>Reason</span><span>Reporter</span><span>Status</span></div>
        {FLAGGED.filter(f => f.status !== 'resolved').map(f => (
          <a key={f.id} className="at-row" href="#/admin/reports">
            <span className="at-strong">{f.target}</span><span>{f.reason}</span><span>{f.reporter}</span>
            <span><span className="status-pill" style={{ background: FSTATUS_COLOR[f.status] + '22', color: FSTATUS_COLOR[f.status] }}>● {f.status}</span></span>
          </a>
        ))}
      </div>
      <div className="admin-quick">
        <a href="#/admin/announcements" className="pill pill-solid">{I.bell()} Post announcement</a>
        <a href="#/admin/allowlist" className="pill pill-line">{I.check()} Manage allowlist</a>
      </div>
    </>
  )
}

function AdminReports() {
  const [items, setItems] = useState(FLAGGED.map(f => ({ ...f })))
  const act = (id, status) => setItems(it => it.map(f => f.id === id ? { ...f, status } : f))
  return (
    <>
      <h1 className="admin-title">Flagged content</h1>
      <p className="admin-sub">Reports raised by the community. Review, dismiss, or remove.</p>
      <div className="report-list">
        {items.map(f => (
          <div className="report-card" key={f.id}>
            <div className="rc-top">
              <span className="status-pill" style={{ background: FSTATUS_COLOR[f.status] + '22', color: FSTATUS_COLOR[f.status] }}>● {f.status}</span>
              <span className="rc-reason">{I.flag()} {f.reason}</span>
              <span className="rc-time">reported by {f.reporter} · {f.time} ago</span>
            </div>
            <div className="rc-target">{f.target}</div>
            <p className="rc-excerpt">"{f.excerpt}"</p>
            <div className="rc-actions">
              <button className="pill pill-line" onClick={() => act(f.id, 'resolved')}>{I.check()} Dismiss</button>
              <button className="pill pill-danger" onClick={() => act(f.id, 'resolved')}>{I.ban()} Remove content</button>
              {f.status === 'open' && <button className="pill pill-line" onClick={() => act(f.id, 'reviewing')}>Mark reviewing</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function AdminUsers() {
  const [users, setUsers] = useState(USERS_ADMIN.map(u => ({ ...u })))
  const ROLES = ['Core', 'Moderator', 'Ambassador', 'Applicant', 'Member']
  const setRole = (name, role) => setUsers(us => us.map(u => u.name === name ? { ...u, role } : u))
  const toggle = (name) => setUsers(us => us.map(u => u.name === name ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u))
  return (
    <>
      <h1 className="admin-title">Users &amp; roles</h1>
      <p className="admin-sub">Manage ambassadors, moderators, and applicants.</p>
      <div className="admin-table users">
        <div className="at-head"><span>User</span><span>Role</span><span>NFT</span><span>Karma</span><span>Actions</span></div>
        {users.map(u => (
          <div className="at-row" key={u.name}>
            <span className="at-user"><AmbassadorAvatar user={who(u.name).color ? u.name : 'you.fil'} size={30} link={false} /><b>{u.name}</b></span>
            <span><select className="role-select" value={u.role} onChange={e => setRole(u.name, e.target.value)} style={{ color: ROLE_COLOR[u.role] }}>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></span>
            <span>{u.nft ? <span className="nft-yes">{I.check()} Held</span> : <span className="nft-no">—</span>}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{u.karma}</span>
            <span><button className={'pill ' + (u.status === 'Suspended' ? 'pill-line' : 'pill-danger')} onClick={() => toggle(u.name)}>{u.status === 'Suspended' ? 'Reinstate' : 'Suspend'}</button></span>
          </div>
        ))}
      </div>
    </>
  )
}

function AdminCategories() {
  const [cats, setCats] = useState(CATEGORIES.map(c => ({ ...c })))
  const [name, setName] = useState('')
  const add = () => {
    if (!name.trim()) return
    setCats(cs => [...cs, { id: name.toLowerCase().replace(/\s+/g, '-'), name: name.trim(), color: '#0090FF', desc: 'New category' }])
    setName('')
  }
  return (
    <>
      <h1 className="admin-title">Categories</h1>
      <p className="admin-sub">The seven channels that organize the forum.</p>
      <div className="cat-admin-list">
        {cats.map(c => (
          <div className="cat-admin-row" key={c.id}>
            <span className="ca-dot" style={{ background: c.color }}></span>
            <div><div className="ca-name">{c.name}</div><div className="ca-desc">{c.desc}</div></div>
            <code className="ca-slug">/{c.id}</code>
          </div>
        ))}
      </div>
      <div className="cat-add">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="New category name" />
        <button className="pill pill-solid" onClick={add}>{I.plus()} Add category</button>
      </div>
    </>
  )
}

function AdminAllowlist() {
  const [list, setList] = useState(ALLOWLIST.map(a => ({ ...a })))
  const [addr, setAddr] = useState('')
  const add = () => {
    if (!addr.trim()) return
    setList(l => [{ addr: addr.trim(), name: '—', note: 'Added manually', added: 'Just now' }, ...l])
    setAddr('')
  }
  return (
    <>
      <h1 className="admin-title">Allowlist</h1>
      <p className="admin-sub">Wallets allowed to participate before minting the Orbit Ambassador NFT — for new cohorts.</p>
      <div className="allow-add">
        <input type="text" value={addr} onChange={e => setAddr(e.target.value)} placeholder="0x… wallet address" />
        <button className="pill pill-solid" onClick={add}>{I.plus()} Add to allowlist</button>
      </div>
      <div className="admin-table allow">
        <div className="at-head"><span>Address</span><span>Linked</span><span>Note</span><span>Added</span></div>
        {list.map((a, i) => (
          <div className="at-row" key={i}>
            <span className="at-mono">{a.addr}</span><span>{a.name}</span><span className="at-note">{a.note}</span><span>{a.added}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function AdminAnnouncements() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [done, setDone] = useState(false)
  const post = () => {
    if (!title.trim() || !body.trim()) return
    setDone(true)
    setTimeout(() => { setDone(false); setTitle(''); setBody('') }, 2200)
  }
  return (
    <>
      <h1 className="admin-title">Post an announcement</h1>
      <p className="admin-sub">Only moderators can post to the Announcements channel. It reaches every ambassador.</p>
      <div className="set-card" style={{ maxWidth: 640 }}>
        <div className="field"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's the news?" /></div>
        <div className="field"><label>Message</label><MarkdownEditor value={body} onChange={setBody} placeholder="Write the announcement. Markdown supported." /></div>
        <div className="settings-foot" style={{ marginTop: 18, paddingTop: 18 }}>
          <span className="note">{I.shield()} Posts to #announcements · pinned to IPFS</span>
          <button className="pill pill-blue" onClick={post} style={{ padding: '11px 24px' }}>
            {done ? <span className="publishing">{I.check()} Published</span> : 'Publish announcement'}
          </button>
        </div>
      </div>
    </>
  )
}

export function AdminView({ section }) {
  useEffect(() => { window.scrollTo(0, 0) }, [section])
  const sec = section || 'home'
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-brand">{I.grid()} <span>Moderation</span></div>
        {ADMIN_NAV.map(([k, l, ic]) => (
          <a key={k} href={'#/admin' + (k === 'home' ? '' : '/' + k)} className={sec === k ? 'on' : ''}>{I[ic]()} {l}</a>
        ))}
        <a href="#/forum" className="admin-exit">{I.back()} Exit to forum</a>
      </aside>
      <main className="admin-main">
        {sec === 'home' && <AdminHome />}
        {sec === 'reports' && <AdminReports />}
        {sec === 'users' && <AdminUsers />}
        {sec === 'categories' && <AdminCategories />}
        {sec === 'allowlist' && <AdminAllowlist />}
        {sec === 'announcements' && <AdminAnnouncements />}
      </main>
    </div>
  )
}
