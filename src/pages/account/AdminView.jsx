import { useState, useEffect } from 'react'
import { CATEGORIES, ALLOWLIST, RANKS, who } from '../../data/constants'
import { supabase } from '../../lib/supabase'
import { I } from '../../components/Icons'
import { AmbassadorAvatar } from '../../components/AmbassadorAvatar'
import { MarkdownEditor } from '../../components/MarkdownEditor'
import { DEFAULT_TAG_COLORS } from '../../hooks/useForumConfig'

const ADMIN_NAV = [
  ['home', 'Dashboard', 'grid'],
  ['reports', 'Reports', 'flag'],
  ['users', 'Users', 'shield'],
  ['bans', 'Bans', 'ban'],
  ['categories', 'Categories', 'list'],
  ['allowlist', 'Allowlist', 'check'],
  ['announcements', 'Announcements', 'bell'],
  ['appearance', 'Appearance', 'edit'],
]
const ROLE_COLOR = { Core: '#0090FF', Moderator: '#A855F7', Ambassador: '#10B981', Applicant: '#FFD60A', Member: '#9aa0aa' }
const FSTATUS_COLOR = { open: '#FF3B30', reviewing: '#FFD60A', resolved: '#10B981' }

function AdminHome({ posts = [], ambassadors = [] }) {
  const [profileCount, setProfileCount] = useState(null)
  const [openFlags, setOpenFlags] = useState([])
  useEffect(() => {
    supabase.from('public_profiles').select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (count != null) setProfileCount(count) })
    supabase.from('reports').select('*').neq('status', 'resolved').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOpenFlags(data) })
  }, [])
  const stats = [
    { value: posts.length, label: 'Total posts', tone: '#0090FF' },
    { value: profileCount ?? ambassadors.length, label: 'Profiles', tone: '#10B981' },
    { value: openFlags.length, label: 'Open flags', tone: openFlags.length > 0 ? '#FF3B30' : '#10B981' },
    { value: posts.filter(p => p.cid_str).length, label: 'Pinned to IPFS', tone: '#A855F7' },
  ]
  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <p className="admin-sub">Moderator overview — the health of the constellation at a glance.</p>
      <div className="admin-stats">
        {stats.map((s, i) => (
          <div className="admin-stat" key={i}><span className="as-dot" style={{ background: s.tone }}></span><div className="as-v">{s.value}</div><div className="as-l">{s.label}</div></div>
        ))}
      </div>
      <h3 className="section-h">Needs attention</h3>
      <div className="admin-table">
        <div className="at-head"><span>Post ID</span><span>Reason</span><span>Reporter</span><span>Status</span></div>
        {openFlags.map(f => (
          <a key={f.id} className="at-row" href="/admin/reports">
            <span className="at-strong">{String(f.post_id).slice(0, 8)}…</span><span>{f.reason}</span><span>{f.reporter ? String(f.reporter).slice(0, 10) + '…' : '—'}</span>
            <span><span className="status-pill" style={{ background: FSTATUS_COLOR[f.status] + '22', color: FSTATUS_COLOR[f.status] }}>● {f.status}</span></span>
          </a>
        ))}
        {openFlags.length === 0 && <div className="at-row"><span style={{ color: '#10B981' }}>{I.check()} All clear — no open flags</span></div>}
      </div>
      <div className="admin-quick">
        <a href="/admin/announcements" className="pill pill-solid">{I.bell()} Post announcement</a>
        <a href="/admin/allowlist" className="pill pill-line">{I.check()} Manage allowlist</a>
      </div>
    </>
  )
}

function AdminReports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('reports').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setItems(data); setLoading(false) })
  }, [])
  const act = async (id, status) => {
    await supabase.from('reports').update({ status }).eq('id', id)
    setItems(it => it.map(f => f.id === id ? { ...f, status } : f))
  }
  return (
    <>
      <h1 className="admin-title">Flagged content</h1>
      <p className="admin-sub">Reports raised by the community. Review, dismiss, or remove.</p>
      {loading && <p className="empty">Loading reports…</p>}
      {!loading && items.length === 0 && <p className="empty" style={{ color: '#10B981' }}>{I.check()} No reports — all clear.</p>}
      <div className="report-list">
        {items.map(f => (
          <div className="report-card" key={f.id}>
            <div className="rc-top">
              <span className="status-pill" style={{ background: FSTATUS_COLOR[f.status] + '22', color: FSTATUS_COLOR[f.status] }}>● {f.status}</span>
              <span className="rc-reason">{I.flag()} {f.reason}</span>
              <span className="rc-time">by {f.reporter ? String(f.reporter).slice(0, 16) : 'anon'}</span>
            </div>
            <div className="rc-target">Post ID: {f.post_id}</div>
            <div className="rc-actions">
              <button className="pill pill-line" onClick={() => act(f.id, 'resolved')}>{I.check()} Dismiss</button>
              {f.status === 'open' && <button className="pill pill-line" onClick={() => act(f.id, 'reviewing')}>Mark reviewing</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const ROLES = ['Newcomer', 'Member', 'Contributor', 'Ambassador', 'Moderator', 'Core', 'Admin']

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('public_profiles').select('identity, handle, karma, role, created_at').order('karma', { ascending: false })
      .then(({ data }) => { if (data) setUsers(data); setLoading(false) })
  }, [])

  const setRole = async (identity, role) => {
    const { error } = await supabase.from('public_profiles').update({ role }).eq('identity', identity)
    if (!error) setUsers(us => us.map(u => u.identity === identity ? { ...u, role } : u))
  }

  return (
    <>
      <h1 className="admin-title">Users &amp; roles</h1>
      <p className="admin-sub">Profiles registered on the forum. Admins can change any user's role.</p>
      {loading && <p className="empty">Loading profiles…</p>}
      {!loading && users.length === 0 && <p className="empty">No profiles yet.</p>}
      {!loading && users.length > 0 && (
        <div className="admin-table users">
          <div className="at-head"><span>User</span><span>Handle</span><span>Karma</span><span>Role</span></div>
          {users.map(u => (
            <div className="at-row" key={u.identity}>
              <span className="at-user"><AmbassadorAvatar user={u.identity} size={30} link={false} /><b className="at-mono" style={{ fontSize: 12 }}>{u.identity.length > 16 ? u.identity.slice(0, 8) + '…' + u.identity.slice(-4) : u.identity}</b></span>
              <span>{u.handle || <span style={{ opacity: .4 }}>—</span>}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{u.karma}</span>
              <span>
                <select
                  className="at-role-select"
                  value={u.role || 'Member'}
                  onChange={e => setRole(u.identity, e.target.value)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </span>
            </div>
          ))}
        </div>
      )}
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
      <p className="admin-sub">Wallets allowed to participate before minting the Orbit Ambassador — for new cohorts.</p>
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

function AdminBans() {
  const [bans, setBans] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('bans').select('*').order('banned_at', { ascending: false })
      .then(({ data }) => { if (data) setBans(data); setLoading(false) })
  }, [])
  const unban = async (identity) => {
    await supabase.from('bans').delete().eq('identity', identity)
    setBans(bs => bs.filter(b => b.identity !== identity))
  }
  return (
    <>
      <h1 className="admin-title">Chat bans</h1>
      <p className="admin-sub">Users suspended from the general chat. Unban from here or directly in the chat.</p>
      {loading && <p className="empty">Loading…</p>}
      {!loading && bans.length === 0 && <p className="empty" style={{ color: '#10B981' }}>{I.check()} No active bans.</p>}
      {!loading && bans.length > 0 && (
        <div className="admin-table">
          <div className="at-head"><span>User</span><span>Reason</span><span>Banned by</span><span>Date</span><span></span></div>
          {bans.map(b => (
            <div className="at-row" key={b.identity}>
              <span className="at-user"><AmbassadorAvatar user={b.identity} size={28} link={false} /><b className="at-mono" style={{ fontSize: 12 }}>{b.identity.length > 16 ? b.identity.slice(0, 8) + '…' + b.identity.slice(-4) : b.identity}</b></span>
              <span>{b.reason || <span style={{ opacity: .4 }}>—</span>}</span>
              <span className="at-mono" style={{ fontSize: 12 }}>{b.banned_by ? b.banned_by.slice(0, 10) + '…' : '—'}</span>
              <span style={{ fontSize: 12, opacity: .6 }}>{new Date(b.banned_at).toLocaleDateString()}</span>
              <span><button className="pill pill-line" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => unban(b.identity)}>Desbanear</button></span>
            </div>
          ))}
        </div>
      )}
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

const ELEVATED_ROLES = ['Admin', 'Moderator', 'Core']

function AdminAppearance({ tagColors, saveTagColors }) {
  const [colors, setColors] = useState({ ...DEFAULT_TAG_COLORS, ...tagColors })
  const [saved, setSaved] = useState(false)
  useEffect(() => { setColors({ ...DEFAULT_TAG_COLORS, ...tagColors }) }, [tagColors])
  const set = (key, val) => setColors(c => ({ ...c, [key]: val }))
  const save = async () => {
    await saveTagColors(colors)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const allLabels = [
    ...ELEVATED_ROLES,
    ...RANKS.map(r => r.label),
  ]

  return (
    <>
      <h1 className="admin-title">Appearance</h1>
      <p className="admin-sub">Customize badge colors for roles and rank tiers. Changes take effect immediately for all users.</p>
      <div className="set-card" style={{ maxWidth: 600 }}>
        <h3 style={{ marginBottom: 4 }}>Roles</h3>
        <p className="set-sub" style={{ marginBottom: 16 }}>Assigned by admins from the Users panel.</p>
        {ELEVATED_ROLES.map(label => (
          <div key={label} className="appearance-row">
            <span className="ar-preview" style={{ background: colors[label] + '22', color: colors[label] }}>{label}</span>
            <label className="ar-label">{label}</label>
            <input type="color" value={colors[label] || '#888888'} onChange={e => set(label, e.target.value)} className="ar-color" />
            <span className="ar-hex">{colors[label]}</span>
          </div>
        ))}
        <h3 style={{ marginTop: 24, marginBottom: 4 }}>Rank tiers</h3>
        <p className="set-sub" style={{ marginBottom: 16 }}>Earned automatically by karma.</p>
        {RANKS.map(r => (
          <div key={r.label} className="appearance-row">
            <span className="ar-preview" style={{ background: colors[r.label] + '22', color: colors[r.label] }}>{r.label}</span>
            <label className="ar-label">{r.label} <span style={{ opacity: .5, fontSize: 12 }}>≥{r.min} karma</span></label>
            <input type="color" value={colors[r.label] || '#888888'} onChange={e => set(r.label, e.target.value)} className="ar-color" />
            <span className="ar-hex">{colors[r.label]}</span>
          </div>
        ))}
        <div className="settings-foot" style={{ marginTop: 20, paddingTop: 18 }}>
          <span></span>
          <button className="pill pill-blue" onClick={save} style={{ padding: '11px 24px' }}>
            {saved ? <>{I.check()} Saved</> : 'Save colors'}
          </button>
        </div>
      </div>
    </>
  )
}

export function AdminView({ section, posts = [], ambassadors = [], tagColors = {}, saveTagColors = () => {} }) {
  useEffect(() => { window.scrollTo(0, 0) }, [section])
  const sec = section || 'home'
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-brand">{I.grid()} <span>Moderation</span></div>
        {ADMIN_NAV.map(([k, l, ic]) => (
          <a key={k} href={'/admin' + (k === 'home' ? '' : '/' + k)} className={sec === k ? 'on' : ''}>{I[ic]()} {l}</a>
        ))}
        <a href="/forum" className="admin-exit">{I.back()} Exit to forum</a>
      </aside>
      <main className="admin-main">
        {sec === 'home' && <AdminHome posts={posts} ambassadors={ambassadors} />}
        {sec === 'reports' && <AdminReports />}
        {sec === 'users' && <AdminUsers />}
        {sec === 'bans' && <AdminBans />}
        {sec === 'categories' && <AdminCategories />}
        {sec === 'allowlist' && <AdminAllowlist />}
        {sec === 'announcements' && <AdminAnnouncements />}
        {sec === 'appearance' && <AdminAppearance tagColors={tagColors} saveTagColors={saveTagColors} />}
      </main>
    </div>
  )
}
