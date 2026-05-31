/* ============================================================
   ORBIT FORUM — account (posts/notifications/settings),
   admin panel, and utility states (500 / maintenance)
   ============================================================ */
const { useState: useStateA, useEffect: useEffectA } = React;
const OA = window.ORBIT;
const { I: Ia, who: whoA, Stars: StarsA, AmbassadorAvatar: AvatarA, PostCard: PostCardA, SocialLinks: SocialsA, CategoryBadge: BadgeA, MarkdownEditor: MDA, navTo: navA } = window;

/* ---------- profile tab bar ---------- */
function ProfileTabs({ active }) {
  const tabs = [['overview','Overview','#/profile/me'],['posts','Posts','#/profile/me/posts'],['notifications','Notifications','#/profile/me/notifications'],['settings','Settings','#/profile/me/settings']];
  return <div className="prof-tabs">{tabs.map(([k,l,h])=><a key={k} href={h} className={active===k?'on':''}>{l}</a>)}</div>;
}

/* ============================================================
   MY POSTS
   ============================================================ */
function MyPostsView({ posts, onVote }) {
  useEffectA(()=>{ window.scrollTo(0,0); }, []);
  const mine = posts.filter(p=>p.author==='you.fil');
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{Ia.back()} My profile</a>
      <h1 className="page-title">My posts</h1>
      <ProfileTabs active="posts" />
      <div className="feed" style={{marginTop:18}}>
        {mine.map(p=><PostCardA key={p.id} post={p} onVote={onVote} />)}
        {mine.length===0 && <p className="empty">You haven't published yet. <a href="#/forum/new">Write your first post →</a></p>}
      </div>
    </div>
  );
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
const NOTIF_ICON = { comment:'cmt', vote:'up', mention:'reply', event:'cal', system:'check' };
function NotificationsView() {
  useEffectA(()=>{ window.scrollTo(0,0); }, []);
  const [items, setItems] = useStateA(OA.NOTIFICATIONS.map(n=>({...n})));
  const markAll = () => setItems(it=>it.map(n=>({...n, unread:false})));
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{Ia.back()} My profile</a>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
        <h1 className="page-title" style={{marginBottom:0}}>Notifications</h1>
        <button className="pill pill-line" onClick={markAll}>{Ia.check()} Mark all read</button>
      </div>
      <ProfileTabs active="notifications" />
      <div className="notif-list" style={{marginTop:18}}>
        {items.map(n=>(
          <a key={n.id} className={'notif-row'+(n.unread?' unread':'')} href={n.link} onClick={()=>setItems(it=>it.map(x=>x.id===n.id?{...x,unread:false}:x))}>
            <span className={'ni-ic ni-'+n.type}>{Ia[NOTIF_ICON[n.type]||'bell']()}</span>
            <AvatarA user={n.who} size={36} link={false} />
            <div className="ni-body"><span className="ni-text"><b>{n.who}</b> {n.text}</span><span className="ni-time">{n.time} ago</span></div>
            {n.unread && <span className="ni-dot"></span>}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS (editable profile + socials + avatar)
   ============================================================ */
function SettingsView({ profile, myAvatar, setMyAvatar, onSave }) {
  useEffectA(()=>{ window.scrollTo(0,0); }, []);
  const [bio, setBio] = useStateA(profile.bio || '');
  const [city, setCity] = useStateA(profile.city || '');
  const [socials, setSocials] = useStateA({ ...(profile.socials||{}) });
  const [banner, setBanner] = useStateA(profile.banner || 'green');
  const setS = (k,v) => setSocials(s=>({ ...s, [k]:v }));
  const save = () => onSave({ bio, city, socials, banner });
  const pickBanner = (id) => { setBanner(id); onSave({ banner:id }); };
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{Ia.back()} My profile</a>
      <h1 className="page-title">Settings</h1>
      <ProfileTabs active="settings" />

      <section className="set-card" style={{marginTop:18}}>
        <h3>Profile banner</h3>
        <p className="set-sub">Choose a cosmic backdrop for your profile. It shows behind your name and avatar.</p>
        <div className="banner-grid">
          {OA.BANNERS.map(b=>(
            <button key={b.id} className={'banner-opt'+(banner===b.id?' on':'')} onClick={()=>pickBanner(b.id)} aria-label={b.label}>
              <img src={b.src} alt={b.label} />
              <span className="bn-label">{b.label}</span>
              {banner===b.id && <span className="bn-check">{Ia.check()}</span>}
            </button>
          ))}
        </div>
      </section>

      <div className="settings-grid" style={{marginTop:16}}>
        <section className="set-card">
          <h3>Avatar</h3>
          <p className="set-sub">Your astronaut shows on every post, comment, and vote.</p>
          <div className="ap-grid">
            {OA.AVATAR_OPTIONS.map(col=>(
              <button key={col} className={'ap-opt'+(myAvatar===col?' on':'')} onClick={()=>setMyAvatar(col)} aria-label={col}>
                <img src={OA.AV[col]} alt={col} />{myAvatar===col && <span className="ap-check">{Ia.check()}</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="set-card">
          <h3>Identity</h3>
          <div className="field"><label>Wallet handle</label>
            <div className="locked-field">{OA.ME.name} <span className="lock">{Ia.shield()} wallet-bound</span></div>
          </div>
          <div className="field"><label>City</label>
            <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="City, Country" />
          </div>
          <div className="field"><label>Bio</label>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell the constellation who you are." style={{minHeight:90}} />
          </div>
        </section>

        <section className="set-card">
          <h3>Social links</h3>
          <p className="set-sub">Add your GitHub, X, Discord, Slack, Telegram and website — shown on your public profile.</p>
          <div className="social-fields">
            {OA.SOCIALS.map(s=>(
              <div className="social-field" key={s.key}>
                <span className="sf-ic">{window.socialIcon(s.key)}</span>
                <span className="sf-prefix">{s.prefix || s.label+':'}</span>
                <input type="text" value={socials[s.key]||''} placeholder={s.ph} onChange={e=>setS(s.key, e.target.value)} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="settings-foot">
        <span className="note">{Ia.shield()} Changes are saved locally and signed by {OA.ME.name}</span>
        <button className="pill pill-blue" onClick={save} style={{padding:'11px 26px'}}>Save changes</button>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
const ADMIN_NAV = [
  ['home','Dashboard','grid'], ['reports','Reports','flag'], ['users','Users','shield'],
  ['categories','Categories','list'], ['allowlist','Allowlist','check'], ['announcements','Announcements','bell'],
];
const ROLE_COLOR = { Core:'#0090FF', Moderator:'#A855F7', Ambassador:'#10B981', Applicant:'#FFD60A', Member:'#9aa0aa' };
const USTATUS_COLOR = { Active:'#10B981', Pending:'#FFD60A', Suspended:'#FF3B30' };
const FSTATUS_COLOR = { open:'#FF3B30', reviewing:'#FFD60A', resolved:'#10B981' };

function AdminView({ section }) {
  useEffectA(()=>{ window.scrollTo(0,0); }, [section]);
  const sec = section || 'home';
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-brand">{Ia.grid()} <span>Moderation</span></div>
        {ADMIN_NAV.map(([k,l,ic])=>(
          <a key={k} href={'#/admin'+(k==='home'?'':'/'+k)} className={sec===k?'on':''}>{Ia[ic]()} {l}</a>
        ))}
        <a href="#/forum" className="admin-exit">{Ia.back()} Exit to forum</a>
      </aside>
      <main className="admin-main">
        {sec==='home' && <AdminHome />}
        {sec==='reports' && <AdminReports />}
        {sec==='users' && <AdminUsers />}
        {sec==='categories' && <AdminCategories />}
        {sec==='allowlist' && <AdminAllowlist />}
        {sec==='announcements' && <AdminAnnouncements />}
      </main>
    </div>
  );
}

function AdminHome() {
  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <p className="admin-sub">Moderator overview — the health of the constellation at a glance.</p>
      <div className="admin-stats">
        {OA.ADMIN_STATS.map((s,i)=>(
          <div className="admin-stat" key={i}><span className="as-dot" style={{background:s.tone}}></span><div className="as-v">{s.value}</div><div className="as-l">{s.label}</div></div>
        ))}
      </div>
      <h3 className="section-h">Needs attention</h3>
      <div className="admin-table">
        <div className="at-head"><span>Item</span><span>Reason</span><span>Reporter</span><span>Status</span></div>
        {OA.FLAGGED.filter(f=>f.status!=='resolved').map(f=>(
          <a key={f.id} className="at-row" href="#/admin/reports">
            <span className="at-strong">{f.target}</span><span>{f.reason}</span><span>{f.reporter}</span>
            <span><span className="status-pill" style={{background:FSTATUS_COLOR[f.status]+'22', color:FSTATUS_COLOR[f.status]}}>● {f.status}</span></span>
          </a>
        ))}
      </div>
      <div className="admin-quick">
        <a href="#/admin/announcements" className="pill pill-solid">{Ia.bell()} Post announcement</a>
        <a href="#/admin/allowlist" className="pill pill-line">{Ia.check()} Manage allowlist</a>
      </div>
    </>
  );
}

function AdminReports() {
  const [items, setItems] = useStateA(OA.FLAGGED.map(f=>({...f})));
  const act = (id, status) => setItems(it=>it.map(f=>f.id===id?{...f, status}:f));
  return (
    <>
      <h1 className="admin-title">Flagged content</h1>
      <p className="admin-sub">Reports raised by the community. Review, dismiss, or remove.</p>
      <div className="report-list">
        {items.map(f=>(
          <div className="report-card" key={f.id}>
            <div className="rc-top">
              <span className="status-pill" style={{background:FSTATUS_COLOR[f.status]+'22', color:FSTATUS_COLOR[f.status]}}>● {f.status}</span>
              <span className="rc-reason">{Ia.flag()} {f.reason}</span>
              <span className="rc-time">reported by {f.reporter} · {f.time} ago</span>
            </div>
            <div className="rc-target">{f.target}</div>
            <p className="rc-excerpt">"{f.excerpt}"</p>
            <div className="rc-actions">
              <button className="pill pill-line" onClick={()=>act(f.id,'resolved')}>{Ia.check()} Dismiss</button>
              <button className="pill pill-danger" onClick={()=>act(f.id,'resolved')}>{Ia.ban()} Remove content</button>
              {f.status==='open' && <button className="pill pill-line" onClick={()=>act(f.id,'reviewing')}>Mark reviewing</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminUsers() {
  const [users, setUsers] = useStateA(OA.USERS_ADMIN.map(u=>({...u})));
  const ROLES = ['Core','Moderator','Ambassador','Applicant','Member'];
  const setRole = (name, role) => setUsers(us=>us.map(u=>u.name===name?{...u, role}:u));
  const toggle = (name) => setUsers(us=>us.map(u=>u.name===name?{...u, status:u.status==='Suspended'?'Active':'Suspended'}:u));
  return (
    <>
      <h1 className="admin-title">Users &amp; roles</h1>
      <p className="admin-sub">Manage ambassadors, moderators, and applicants.</p>
      <div className="admin-table users">
        <div className="at-head"><span>User</span><span>Role</span><span>NFT</span><span>Karma</span><span>Actions</span></div>
        {users.map(u=>(
          <div className="at-row" key={u.name}>
            <span className="at-user"><AvatarA user={whoA(u.name).color?u.name:'you.fil'} size={30} link={false} /><b>{u.name}</b></span>
            <span><select className="role-select" value={u.role} onChange={e=>setRole(u.name, e.target.value)} style={{color:ROLE_COLOR[u.role]}}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</select></span>
            <span>{u.nft ? <span className="nft-yes">{Ia.check()} Held</span> : <span className="nft-no">—</span>}</span>
            <span style={{fontVariantNumeric:'tabular-nums'}}>{u.karma}</span>
            <span><button className={'pill '+(u.status==='Suspended'?'pill-line':'pill-danger')} onClick={()=>toggle(u.name)}>{u.status==='Suspended'?'Reinstate':'Suspend'}</button></span>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminCategories() {
  const [cats, setCats] = useStateA(OA.CATEGORIES.map(c=>({...c})));
  const [name, setName] = useStateA('');
  const add = () => { if(!name.trim()) return; setCats(cs=>[...cs, {id:name.toLowerCase().replace(/\s+/g,'-'), name:name.trim(), color:'#0090FF', desc:'New category'}]); setName(''); };
  return (
    <>
      <h1 className="admin-title">Categories</h1>
      <p className="admin-sub">The seven channels that organize the forum.</p>
      <div className="cat-admin-list">
        {cats.map(c=>(
          <div className="cat-admin-row" key={c.id}>
            <span className="ca-dot" style={{background:c.color}}></span>
            <div><div className="ca-name">{c.name}</div><div className="ca-desc">{c.desc}</div></div>
            <code className="ca-slug">/{c.id}</code>
          </div>
        ))}
      </div>
      <div className="cat-add">
        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="New category name" />
        <button className="pill pill-solid" onClick={add}>{Ia.plus()} Add category</button>
      </div>
    </>
  );
}

function AdminAllowlist() {
  const [list, setList] = useStateA(OA.ALLOWLIST.map(a=>({...a})));
  const [addr, setAddr] = useStateA('');
  const add = () => { if(!addr.trim()) return; setList(l=>[{addr:addr.trim(), name:'—', note:'Added manually', added:'Just now'}, ...l]); setAddr(''); };
  return (
    <>
      <h1 className="admin-title">Allowlist</h1>
      <p className="admin-sub">Wallets allowed to participate before minting the Orbit Ambassador NFT — for new cohorts.</p>
      <div className="allow-add">
        <input type="text" value={addr} onChange={e=>setAddr(e.target.value)} placeholder="0x… wallet address" />
        <button className="pill pill-solid" onClick={add}>{Ia.plus()} Add to allowlist</button>
      </div>
      <div className="admin-table allow">
        <div className="at-head"><span>Address</span><span>Linked</span><span>Note</span><span>Added</span></div>
        {list.map((a,i)=>(
          <div className="at-row" key={i}>
            <span className="at-mono">{a.addr}</span><span>{a.name}</span><span className="at-note">{a.note}</span><span>{a.added}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminAnnouncements() {
  const [title, setTitle] = useStateA('');
  const [body, setBody] = useStateA('');
  const [done, setDone] = useStateA(false);
  const post = () => { if(!title.trim()||!body.trim()) return; setDone(true); setTimeout(()=>{ setDone(false); setTitle(''); setBody(''); }, 2200); };
  return (
    <>
      <h1 className="admin-title">Post an announcement</h1>
      <p className="admin-sub">Only moderators can post to the Announcements channel. It reaches every ambassador.</p>
      <div className="set-card" style={{maxWidth:640}}>
        <div className="field"><label>Title</label><input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's the news?" /></div>
        <div className="field"><label>Message</label><MDA value={body} onChange={setBody} placeholder="Write the announcement. Markdown supported." /></div>
        <div className="settings-foot" style={{marginTop:18, paddingTop:18}}>
          <span className="note">{Ia.shield()} Posts to #announcements · pinned to IPFS</span>
          <button className="pill pill-blue" onClick={post} style={{padding:'11px 24px'}}>{done ? <span className="publishing">{Ia.check()} Published</span> : 'Publish announcement'}</button>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   UTILITY: 500 + MAINTENANCE
   ============================================================ */
function Error500View() {
  useEffectA(()=>{ window.scrollTo(0,0); }, []);
  return (
    <div className="page-wrap notfound">
      <div className="util-badge" style={{background:'rgba(255,59,48,.12)', color:'#FF3B30'}}>{Ia.shield()} 500 · Server error</div>
      <h1 className="nf-title">Something went sideways.</h1>
      <p className="nf-sub">A signal got lost in transit. Our nodes are on it — try again in a moment.</p>
      <div className="nf-actions">
        <button className="pill pill-solid" onClick={()=>location.reload()}>Reload</button>
        <a className="pill pill-line" href="#/forum">{Ia.back()} Back to the forum</a>
      </div>
    </div>
  );
}
function MaintenanceView() {
  useEffectA(()=>{ window.scrollTo(0,0); }, []);
  return (
    <div className="maint-screen">
      <div className="maint-stars"><StarsA n={14} /></div>
      <div className="maint-inner">
        <div className="util-badge" style={{background:'rgba(255,255,255,.12)', color:'#fff', borderColor:'rgba(255,255,255,.2)'}}>{Ia.shield()} Scheduled maintenance</div>
        <h1>We're re-pinning the constellation.</h1>
        <p>Orbit is briefly offline for a storage upgrade. Your data is safe on Filecoin — we'll be back shortly.</p>
        <a className="pill pill-blue" href="#/forum" style={{padding:'12px 26px'}}>Check again</a>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileTabs, MyPostsView, NotificationsView, SettingsView, AdminView, Error500View, MaintenanceView });
