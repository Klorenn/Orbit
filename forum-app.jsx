/* ============================================================
   ORBIT FORUM — router + views + app shell
   ============================================================ */
const { useState, useEffect, useRef } = React;
const O = window.ORBIT;
const {
  I, who, navTo, Stars, Vote, CategoryBadge, AmbassadorAvatar, PostCard, Comment,
  MarkdownEditor, renderMD, renderRich, WalletGate, Navbar, SocialLinks, ReactionBar, MentionInput,
  AboutView, AmbassadorsView, SearchView, LeaderboardView, EventDetailView, ProposalDetailView, Error404View,
  ProfileTabs, MyPostsView, NotificationsView, SettingsView, AdminView, Error500View, MaintenanceView,
} = window;

/* ---------- hash router ---------- */
function parseHash() {
  if (window.location.hash.includes('access_token=')) return { view: 'forum-home' };
  let h = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  const seg = h.split('/').filter(Boolean);
  if (seg.length === 0) return { view: 'forum-home' };
  if (seg[0] === 'forum') {
    if (seg.length === 1) return { view: 'forum-home' };
    if (seg[1] === 'new') return { view: 'forum-new' };
    if (!O.CATEGORIES.some(c=>c.id===seg[1])) return { view: 'notfound' };
    if (seg.length === 2) return { view: 'forum-category', cat: seg[1] };
    return { view: 'forum-thread', cat: seg[1], id: seg[2] };
  }
  if (seg[0] === 'profile') {
    const whoId = decodeURIComponent(seg[1] || 'me');
    if ((whoId==='me') && seg[2]) return { view: 'profile-sub', sub: seg[2] };
    return { view: 'profile', whoId };
  }
  if (seg[0] === 'admin') return { view: 'admin', section: seg[1] || 'home' };
  if (seg[0] === '500') return { view: 'error500' };
  if (seg[0] === 'maintenance') return { view: 'maintenance' };
  if (seg[0] === 'events') {
    if (seg[1] === 'new') return { view: 'forum-new', preset: 'Event' };
    if (seg[1]) return { view: 'event-detail', id: seg[1] };
    return { view: 'events' };
  }
  if (seg[0] === 'proposals') {
    if (seg[1] === 'new') return { view: 'forum-new', preset: 'Proposal' };
    if (seg[1]) return { view: 'proposal-detail', id: seg[1] };
    return { view: 'proposals' };
  }
  if (seg[0] === 'ambassadors') return { view: 'ambassadors' };
  if (seg[0] === 'leaderboard') return { view: 'leaderboard' };
  if (seg[0] === 'search') return { view: 'search', q: decodeURIComponent(seg[1] || '') };
  if (seg[0] === 'about') return { view: 'about' };
  if (seg[0] === 'docs') return { view: 'docs' };
  if (seg[0] === 'connect') return { view: 'connect' };
  return { view: 'notfound' };
}

/* ---------- left sidebar (categories) ---------- */
function Sidebar({ activeCat, counts }) {
  return (
    <aside className="side sticky">
      <h4>Categories</h4>
      <div className="cat-list">
        <a className={'cat'+(!activeCat?' active':'')} href="#/forum">
          <span className="dot" style={{background:'#0A0A0A'}}></span>All posts
          <span className="ct">{counts.all}</span>
        </a>
        {O.CATEGORIES.map(c=>(
          <a key={c.id} className={'cat'+(activeCat===c.id?' active':'')} href={'#/forum/'+c.id}>
            <span className="dot" style={{background:c.color}}></span>{c.name}
            <span className="ct">{counts[c.id]||0}</span>
          </a>
        ))}
      </div>
      <div className="side-card">
        <div className="sc-title">Forum, on-chain</div>
        <div className="stat-row"><span>Posts</span><span className="v">{counts.all}</span></div>
        <div className="stat-row"><span>Ambassadors</span><span className="v">318</span></div>
        <div className="stat-row"><span>Pinned to Filecoin</span><span className="v green">100%</span></div>
      </div>
    </aside>
  );
}

/* ---------- right rail ---------- */
function Rail({ myAvatar }) {
  const banner = O.BANNERS.find(b=>b.id===who('you.fil').banner);
  return (
    <aside className="rail sticky">
      <div className={'profile-card'+(banner?' has-banner':'')} style={banner?{ backgroundImage:'url('+banner.src+')' }:null}>
        {banner ? <div className="pc-scrim"></div> : <Stars />}
        <AmbassadorAvatar user="you.fil" size={56} link={false} nft />
        <div className="pc-name">{O.ME.name}</div>
        <div className="pc-addr">{O.ME.addr}</div>
        <span className="pc-nft">{I.check()} Orbit Ambassador NFT</span>
        <div className="pc-grid">
          <div><div className="v">{O.ME.posts}</div><div className="l">Posts</div></div>
          <div><div className="v">{O.ME.karma}</div><div className="l">Karma</div></div>
        </div>
        <a href="#/profile/me" className="pill pill-line" style={{marginTop:16, width:'100%', justifyContent:'center'}}>View my profile</a>
      </div>
      <div className="rail-card">
        <h4>Active proposals</h4>
        {O.PROPOSALS.filter(p=>p.status!=='Approved'&&p.status!=='Draft').slice(0,3).map((p,i)=>(
          <a className="prop" key={i} href={p.threadId?('#/forum/'+p.cat+'/'+p.threadId):'#/proposals'}>
            <span className="pstat" style={{background:O.PROP_STATUS[p.status]}}></span>
            <div><div className="ptitle">{p.title}</div><div className="pmeta">{p.status} · {p.forVotes} in favor</div></div>
          </a>
        ))}
        <a href="#/proposals" className="rail-more">All proposals {I.back({style:{transform:'rotate(180deg)'},width:13,height:13})}</a>
      </div>
      <div className="rail-card">
        <h4>Trending</h4>
        <div className="trend">{O.TRENDING.map(t=><a key={t} href="#/forum">{t}</a>)}</div>
      </div>
    </aside>
  );
}

/* ---------- sort bar ---------- */
function SortBar({ sort, setSort }) {
  return (
    <div className="sortbar">
      {[['latest','Latest'],['top','Top'],['discussed','Discussed'],['unanswered','Unanswered']].map(([k,l])=>(
        <button key={k} className={sort===k?'on':''} onClick={()=>setSort(k)}>{l}</button>
      ))}
    </div>
  );
}
function sortPosts(list, sort) {
  let l = [...list];
  if (sort==='top') l.sort((a,b)=>b.upvotes-a.upvotes);
  else if (sort==='discussed') l.sort((a,b)=>b.comments.length-a.comments.length);
  else if (sort==='unanswered') l = l.filter(p=>p.comments.length===0);
  return l;
}

/* ============================================================
   VIEW: FORUM HOME
   ============================================================ */
function HomeView({ posts, onVote, counts }) {
  const [sort, setSort] = useState('latest');
  const list = sortPosts(posts, sort);
  return (
    <div className="shell">
      <Sidebar activeCat={null} counts={counts} />
      <main>
        <div className="cat-cards">
          {O.CATEGORIES.slice(0,4).map(c=>(
            <a key={c.id} className="cat-card" href={'#/forum/'+c.id}>
              <span className="cc-dot" style={{background:c.color}}></span>
              <div className="cc-name">{c.name}</div>
              <div className="cc-ct">{counts[c.id]||0} posts</div>
            </a>
          ))}
        </div>
        <div className="feed-head">
          <div><div className="feed-title">Recent activity</div><div className="feed-sub">Across all categories · anyone reads, members post</div></div>
          <SortBar sort={sort} setSort={setSort} />
        </div>
        <div className="feed">
          {list.map(p=><PostCard key={p.id} post={p} onVote={onVote} />)}
        </div>
      </main>
      <Rail />
    </div>
  );
}

/* ============================================================
   VIEW: CATEGORY
   ============================================================ */
function CategoryView({ cat, posts, onVote, counts }) {
  const [sort, setSort] = useState('latest');
  const c = O.catOf(cat);
  const list = sortPosts(posts.filter(p=>p.cat===cat), sort);
  return (
    <div className="shell">
      <Sidebar activeCat={cat} counts={counts} />
      <main>
        <a className="back-link" href="#/forum">{I.back()} All categories</a>
        <div className="feed-head" style={{marginTop:10}}>
          <div>
            <div className="feed-title" style={{display:'flex',alignItems:'center',gap:12}}>
              <span className="cc-dot" style={{background:c.color, width:14, height:14}}></span>{c.name}
            </div>
            <div className="feed-sub">{c.desc}</div>
          </div>
          <SortBar sort={sort} setSort={setSort} />
        </div>
        <div className="feed">
          {list.map(p=><PostCard key={p.id} post={p} onVote={onVote} />)}
          {list.length===0 && <p className="empty">No posts in {c.name} yet — be the first.</p>}
        </div>
      </main>
      <Rail />
    </div>
  );
}

/* ============================================================
   VIEW: THREAD (full page)
   ============================================================ */
function ThreadView({ cat, id, posts, connected, onConnect, onVote, onAddComment, onReact, onReply, onReactPost }) {
  const post = posts.find(p=>p.id===id);
  const [draft, setDraft] = useState('');
  useEffect(()=>{ window.scrollTo(0,0); }, [id]);
  if (!post) return <div className="page-wrap"><p className="empty">Post not found. <a href="#/forum">Back to forum</a></p></div>;
  const u = who(post.author);
  const submit = () => { if(!draft.trim()) return; onAddComment(post.id, draft.trim()); setDraft(''); };
  return (
    <div className="page-wrap thread">
      <a className="back-link" href={'#/forum/'+post.cat}>{I.back()} {O.catOf(post.cat).name}</a>
      <div className="post-tags" style={{marginTop:12, marginBottom:14}}>
        <span className="tag type">{post.type}</span>
        <CategoryBadge cat={post.cat} soft />
        <span className="cid">◈ {post.cidStr}</span>
      </div>
      <h1 className="dt">{post.title}</h1>
      <div className="detail-author">
        <AmbassadorAvatar user={post.author} size={44} nft />
        <div>
          <div className="nm"><a href={'#/profile/'+u.name}>{u.name}</a> {u.role && <span className="role">{u.role}</span>}</div>
          <div className="sub">{u.city} · {post.time} ago</div>
        </div>
        <Vote count={post.upvotes} voted={post.upvoted} onToggle={()=>onVote(post.id)} row />
      </div>
      <div className="prose">{renderRich(post.body.join('\n\n'))}</div>
      {post.evidence.length>0 && (
        <>
          <h3 className="evi-head">Evidence · on Filecoin</h3>
          <div className="evidence">
            {post.evidence.map((e,i)=>(
              <div className="evi" key={i}><span className="ic">{I.doc()}</span><div><div className="en">{e.name}</div><div className="es">◈ {e.size}</div></div></div>
            ))}
          </div>
        </>
      )}
      <ReactionBar reactions={post.reactions} onReact={(emoji)=>onReactPost(post.id, emoji)} />
      <div className="comments">
        <h3>{post.comments.length} comment{post.comments.length!==1?'s':''}</h3>
        <WalletGate connected={connected} onConnect={onConnect} label="Connect your wallet to comment">
          <div className="composer">
            <AmbassadorAvatar user="you.fil" size={38} link={false} />
            <div className="cbox">
              <MentionInput value={draft} onChange={setDraft} placeholder="Add to the discussion… use @ to mention someone"
                onKeyDown={e=>{ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)) submit(); }} />
              <div className="crow">
                <span className="hint">{I.shield()} Posting as {O.ME.name} · @ to mention · ⌘↵ to send</span>
                <button className="pill pill-blue" onClick={submit} style={{opacity:draft.trim()?1:.5}}>Comment</button>
              </div>
            </div>
          </div>
        </WalletGate>
        {post.comments.map(cm=><Comment key={cm.id} c={cm} onReact={(cid,emoji)=>onReact(post.id, cid, emoji)} onReply={(cid,text)=>onReply(post.id, cid, text)} />)}
        {post.comments.length===0 && <p className="empty" style={{textAlign:'left',padding:'8px 0'}}>No comments yet — be the first to weigh in.</p>}
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: NEW POST (compose page)
   ============================================================ */
const TYPES = [ {t:'Report',cat:'reports'},{t:'Proposal',cat:'projects'},{t:'Event',cat:'events'},{t:'Feedback',cat:'feedback'},{t:'Discussion',cat:'governance'} ];
function NewPostView({ connected, onConnect, onPublish, preset }) {
  const presetType = preset ? (TYPES.find(t=>t.t===preset) || TYPES[0]) : TYPES[0];
  const [type, setType] = useState(presetType);
  const [cat, setCat] = useState(presetType.cat);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState('edit');
  const [tab, setTab] = useState('write');
  useEffect(()=>{ window.scrollTo(0,0); }, []);
  const canPost = title.trim() && body.trim();
  const pickType = (t) => { setType(t); setCat(t.cat); };
  const publish = () => {
    if(!canPost || phase==='pinning') return;
    setPhase('pinning');
    setTimeout(()=>{ onPublish({ type:type.t, cat, title:title.trim(), body:body.trim().split(/\n{2,}/).filter(Boolean),
      evidence: files.map(f=>({ name:f, size:'bafy…'+Math.random().toString(36).slice(2,5) })) }); }, 1500);
  };
  return (
    <div className="page-wrap compose">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">{preset==='Proposal'?'New proposal':preset==='Event'?'New event':'New post'}</h1>
      <WalletGate connected={connected} onConnect={onConnect} label="Connect your wallet to publish">
        <div className="field">
          <label>Type</label>
          <div className="type-row">{TYPES.map(t=><button key={t.t} className={type.t===t.t?'on':''} onClick={()=>pickType(t)}>{t.t}</button>)}</div>
        </div>
        <div className="field">
          <label>Category</label>
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            {O.CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Title</label>
          <input type="text" placeholder="A clear, specific headline" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div className="field">
          <div className="body-head">
            <label style={{marginBottom:0}}>Body</label>
            <div className="wp-tabs">
              <button type="button" className={tab==='write'?'on':''} onClick={()=>setTab('write')}>Write</button>
              <button type="button" className={tab==='preview'?'on':''} onClick={()=>setTab('preview')}>Preview</button>
            </div>
          </div>
          {tab==='write'
            ? <MarkdownEditor value={body} onChange={setBody} placeholder="Write your post. Use big headings, paste a YouTube / GitHub / WhatsApp / X link to embed it, and separate paragraphs with a blank line." />
            : <div className="prose preview-box">{body.trim() ? renderRich(body) : <p className="empty" style={{textAlign:'left'}}>Nothing to preview yet — write something first.</p>}</div>}
        </div>
        <div className="field">
          <label>Evidence — drag &amp; drop, pinned to IPFS via Lighthouse</label>
          <div className="ipfs-drop" onClick={()=>setFiles(f=>[...f, ['recap.pdf','data.csv','notes.md','slides.pdf','photos.zip'][f.length%5]])}>
            <span className="ic">{I.pin()}</span>
            <div><strong>Drop files to pin</strong><span>{files.length? files.join(' · ') : 'Images, PDFs, datasets — persisted on Filecoin'}</span></div>
          </div>
        </div>
        <div className="compose-foot">
          <span className="note">{I.shield()} Signed by {O.ME.name} · stored on Filecoin</span>
          <button className="pill pill-blue" onClick={publish} style={{opacity:canPost?1:.5, padding:'11px 24px'}}>
            {phase==='pinning' ? <span className="publishing"><span className="spin"></span>Pinning to IPFS…</span> : 'Publish post'}
          </button>
        </div>
      </WalletGate>
    </div>
  );
}

/* ============================================================
   VIEW: PROFILE
   ============================================================ */
function ProfileView({ whoId, posts, onVote }) {
  const isMe = whoId==='me' || whoId==='you.fil';
  const u = isMe ? who('you.fil') : who(whoId);
  useEffect(()=>{ window.scrollTo(0,0); }, [whoId]);
  const theirPosts = posts.filter(p=>p.author===(isMe?'you.fil':whoId));
  const banner = (O.BANNERS.find(b=>b.id===u.banner) || null);
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <div className={'profile-hero'+(banner?' has-banner':'')} style={banner?{ backgroundImage:'url('+banner.src+')' }:null}>
        {banner ? <div className="ph-banner-scrim"></div> : <div className="ph-stars"><Stars n={14} /></div>}
        <div className="ph-row">
          <AmbassadorAvatar user={isMe?'you.fil':whoId} size={88} link={false} nft />
          <div className="ph-info">
            <div className="ph-name">{u.name} {u.role && <span className="role">{u.role}</span>}</div>
            <div className="ph-meta">{u.city} · joined {u.joined}</div>
            <p className="ph-bio">{u.bio}</p>
            <div className="ph-socials"><SocialLinks socials={u.socials} /></div>
          </div>
          {isMe
            ? <a className="pill pill-line ph-edit" href="#/profile/me/settings">{I.edit()} Edit profile</a>
            : <button className="pill pill-solid ph-edit">Follow</button>}
        </div>
        <div className="ph-stats">
          <div><div className="v">{u.karma}</div><div className="l">Karma</div></div>
          <div><div className="v">{theirPosts.length}</div><div className="l">Posts</div></div>
          <div><div className="v">{u.events||0}</div><div className="l">Events</div></div>
          <div><div className="v">{I.check({width:18,height:18})}</div><div className="l">NFT verified</div></div>
        </div>
      </div>

      {isMe && <ProfileTabs active="overview" />}

      <div className="feed-head" style={{marginTop:isMe?6:34}}>
        <div><div className="feed-title">{isMe?'Your posts':u.name.split('.')[0]+'\u2019s posts'}</div><div className="feed-sub">{theirPosts.length} published · all pinned to Filecoin</div></div>
      </div>
      <div className="feed">
        {theirPosts.map(p=><PostCard key={p.id} post={p} onVote={onVote} />)}
        {theirPosts.length===0 && <p className="empty">No posts yet.{isMe && <> <a href="#/forum/new">Write your first →</a></>}</p>}
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: EVENTS
   ============================================================ */
function EventsView() {
  useEffect(()=>{ window.scrollTo(0,0); }, []);
  const upcoming = O.EVENTS.filter(e=>e.status==='upcoming');
  const past = O.EVENTS.filter(e=>e.status==='past');
  const Card = ({e}) => {
    const h = who(e.host);
    return (
      <div className="event-card">
        <div className="ev-date"><span className="ev-mon">{e.month}</span><span className="ev-day">{e.day}</span></div>
        <div className="ev-body">
          <div className="ev-title">{e.title}</div>
          <div className="ev-meta">{e.city} · hosted by <a href={'#/profile/'+h.name}>{h.name}</a></div>
          <div className="ev-spots">{e.spots}</div>
        </div>
        <a className="pill pill-line" href="#/forum/events">{e.status==='upcoming'?'Details':'Recap'}</a>
      </div>
    );
  };
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">{I.cal({width:26,height:26})} Events</h1>
      <p className="page-sub">Ambassador meetups, workshops, and recaps across the constellation.</p>
      <h3 className="section-h">Upcoming</h3>
      <div className="event-list">{upcoming.map(e=><Card key={e.id} e={e} />)}</div>
      <h3 className="section-h">Past</h3>
      <div className="event-list">{past.map(e=><Card key={e.id} e={e} />)}</div>
    </div>
  );
}

/* ============================================================
   VIEW: PROPOSALS
   ============================================================ */
function ProposalsView() {
  useEffect(()=>{ window.scrollTo(0,0); }, []);
  const [filter, setFilter] = useState('All');
  const statuses = ['All','Draft','Discussion','Voting','Approved'];
  const list = O.PROPOSALS.filter(p=>filter==='All'||p.status===filter);
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">{I.gov({width:26,height:26})} Proposals</h1>
      <p className="page-sub">Projects in debate, with live status. Rough consensus here can be promoted to Metropolis.</p>
      <div className="sortbar" style={{marginBottom:20, width:'fit-content'}}>
        {statuses.map(s=><button key={s} className={filter===s?'on':''} onClick={()=>setFilter(s)}>{s}</button>)}
      </div>
      <div className="prop-list">
        {list.map(p=>{
          const h = who(p.author);
          const inner = (
            <>
              <div className="pl-top">
                <span className="status-pill" style={{background:O.PROP_STATUS[p.status]+'22', color:O.PROP_STATUS[p.status]}}>● {p.status}</span>
                <CategoryBadge cat={p.cat} soft />
              </div>
              <div className="pl-title">{p.title}</div>
              <p className="pl-sum">{p.summary}</p>
              <div className="pl-meta">
                <AmbassadorAvatar user={p.author} size={22} link={false} /> <span className="nm">{h.name}</span>
                <span className="dotsep"></span><span>{I.up({width:13,height:13})} {p.forVotes}</span>
                <span className="dotsep"></span><span>{I.cmt()} {p.comments}</span>
              </div>
            </>
          );
          return p.threadId
            ? <a key={p.id} className="prop-row" href={'#/forum/'+p.cat+'/'+p.threadId}>{inner}</a>
            : <div key={p.id} className="prop-row">{inner}</div>;
        })}
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: DOCS
   ============================================================ */
function DocsView() {
  useEffect(()=>{ window.scrollTo(0,0); }, []);
  const [active, setActive] = useState(O.DOCS[0].id);
  const doc = O.DOCS.find(d=>d.id===active);
  return (
    <div className="page-wrap docs">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Documentation</h1>
      <p className="page-sub">Everything you need to participate in Orbit.</p>
      <div className="docs-grid">
        <nav className="docs-nav">
          {O.DOCS.map(d=><button key={d.id} className={active===d.id?'on':''} onClick={()=>setActive(d.id)}>{d.title}</button>)}
          <a className="docs-cta" href="#/forum/new">{I.plus()} Write a post</a>
        </nav>
        <article className="docs-body prose">
          <h2>{doc.title}</h2>
          {doc.body.map((p,i)=><p key={i}>{p}</p>)}
        </article>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: CONNECT (Supabase magic-link)
   ============================================================ */
function ConnectView() {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState('');
  useEffect(()=>{ window.scrollTo(0,0); }, []);

  const send = async () => {
    if (!email.trim() || phase === 'sending') return;
    setPhase('sending'); setErrMsg('');
    const redirectTo = window.location.href.split('#')[0];
    const { error } = await window.SUPABASE.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo }
    });
    if (error) { setPhase('error'); setErrMsg(error.message); }
    else setPhase('sent');
  };

  return (
    <div className="page-wrap connect-page">
      <div className="connect-card">
        <div className="cn-stars"><Stars n={14} /></div>
        <div className="cn-inner">
          <span className="cn-badge">{I.shield()} Sign in with email</span>
          <h1>Join the constellation</h1>
          <p>Reading Orbit is open to everyone. Sign in with your email to post, comment, and vote.</p>
          {phase === 'sent' ? (
            <div style={{textAlign:'center'}}>
              <span className="cn-badge" style={{background:'rgba(16,185,129,.15)', color:'#10B981', marginBottom:12, display:'inline-flex'}}>{I.check()} Magic link sent</span>
              <p>Check <b>{email}</b> and click the link to sign in.</p>
            </div>
          ) : (
            <>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter') send(); }} placeholder="you@example.com"
                style={{width:'100%', marginBottom:10}} />
              {phase==='error' && <p style={{color:'#FF3B30', fontSize:14, marginBottom:8}}>{errMsg}</p>}
              <button className="pill pill-blue" style={{padding:'13px 28px', fontSize:16, width:'100%', opacity:email.trim()?1:.5}} onClick={send}>
                {phase==='sending' ? <span className="publishing"><span className="spin"></span>Sending…</span> : 'Send magic link'}
              </button>
            </>
          )}
          <div className="cn-steps">
            <div><span>1</span> Enter your email — no password needed</div>
            <div><span>2</span> Click the magic link in your inbox</div>
            <div><span>3</span> You are in — contribute to governance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const [posts, setPosts] = useState(O.SEED_POSTS);
  const [route, setRoute] = useState(parseHash());
  const [connected, setConnected] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [myAvatar, setMyAvatarState] = useState(() => localStorage.getItem('orbit-avatar') || O.ME.color);
  const [myProfile, setMyProfileState] = useState(() => { try { return JSON.parse(localStorage.getItem('orbit-profile')||'{}'); } catch(e){ return {}; } });
  const toastTimer = useRef(null);

  // apply avatar choice to ME / AMBASSADORS so it shows everywhere (sync, before render of children)
  O.ME.color = myAvatar; O.AMBASSADORS['you.fil'].color = myAvatar;
  // apply profile edits (bio, city, socials) to you.fil
  const meRef = O.AMBASSADORS['you.fil'];
  if (myProfile.bio != null) meRef.bio = myProfile.bio;
  if (myProfile.city != null) { meRef.city = myProfile.city; O.ME.city = myProfile.city; }
  if (myProfile.socials) meRef.socials = { ...meRef.socials, ...myProfile.socials };
  if (myProfile.banner != null) meRef.banner = myProfile.banner;
  const setMyAvatar = (col) => { setMyAvatarState(col); localStorage.setItem('orbit-avatar', col); flash('Avatar updated'); };
  const setMyProfile = (updates) => { const next = { ...myProfile, ...updates }; setMyProfileState(next); localStorage.setItem('orbit-profile', JSON.stringify(next)); flash('Profile saved'); };

  useEffect(()=>{
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '#/forum';
    return ()=>window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(()=>{
    window.SUPABASE.auth.getSession().then(({ data: { session } }) => {
      if (session) { setConnected(true); applySession(session); }
    });
    const { data: { subscription } } = window.SUPABASE.auth.onAuthStateChange((_event, session) => {
      setConnected(!!session);
      if (session) { applySession(session); if (parseHash().view === 'connect') navTo('#/forum'); }
    });
    return () => subscription.unsubscribe();
  }, []);

  function applySession(session) {
    const email = session.user.email || '';
    const handle = email.split('@')[0];
    O.ME.name = handle;
    O.ME.addr = email;
    if (O.AMBASSADORS['you.fil']) {
      O.AMBASSADORS['you.fil'].name = handle;
    }
  }

  const flash = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(()=>setToast(''), 2600); };

  const vote = (id) => { if(!connected){ flash('Connect your wallet to vote'); return; }
    setPosts(ps=>ps.map(p=>p.id===id?{...p, upvoted:!p.upvoted, upvotes:p.upvotes+(p.upvoted?-1:1)}:p)); };
  const reactPost = (pid, emoji) => {
    if(!connected){ flash('Connect your wallet to react'); return; }
    setPosts(ps=>ps.map(p=>{
      if (p.id!==pid) return p;
      const r = { ...(p.reactions||{}) }; const cur = r[emoji] || { count:0, mine:false };
      r[emoji] = { count: cur.count + (cur.mine?-1:1), mine: !cur.mine };
      if (r[emoji].count<=0) delete r[emoji];
      return { ...p, reactions:r };
    }));
  };
  const likeComment = (pid, cid) => setPosts(ps=>ps.map(p=>p.id!==pid?p:{...p, comments:p.comments.map(c=>c.id!==cid?c:{...c, liked:!c.liked, likes:c.likes+(c.liked?-1:1)})}));
  // toggle an emoji reaction on a comment or reply (recursive)
  const reactComment = (pid, cid, emoji) => {
    if(!connected){ flash('Connect your wallet to react'); return; }
    const walk = (list) => list.map(c=>{
      if (c.id===cid) {
        const r = { ...(c.reactions||{}) }; const cur = r[emoji] || { count:0, mine:false };
        r[emoji] = { count: cur.count + (cur.mine?-1:1), mine: !cur.mine };
        if (r[emoji].count<=0) delete r[emoji];
        return { ...c, reactions:r };
      }
      if (c.replies) return { ...c, replies: walk(c.replies) };
      return c;
    });
    setPosts(ps=>ps.map(p=>p.id!==pid?p:{...p, comments:walk(p.comments)}));
  };
  const replyComment = (pid, cid, text) => {
    if(!connected){ flash('Connect your wallet to reply'); return; }
    const reply = { id:'r'+Date.now(), author:'you.fil', time:'now', text, reactions:{} };
    const walk = (list) => list.map(c=> c.id===cid ? { ...c, replies:[...(c.replies||[]), reply] } : c);
    setPosts(ps=>ps.map(p=>p.id!==pid?p:{...p, comments:walk(p.comments)}));
    flash('Reply published on-chain');
  };
  const addComment = (pid, text) => { setPosts(ps=>ps.map(p=>p.id!==pid?p:{...p, comments:[...p.comments, {id:'c'+Date.now(), author:'you.fil', time:'now', text, reactions:{}, replies:[]}]})); flash('Comment published on-chain'); };
  const publish = (data) => {
    const np = { id:'p'+Date.now(), cat:data.cat, type:data.type, title:data.title,
      excerpt:data.body[0].replace(/[#*_>-]/g,'').slice(0,150)+(data.body[0].length>150?'…':''), body:data.body,
      author:'you.fil', time:'now', upvotes:1, upvoted:true, cidStr:O.cid(), reactions:{}, evidence:data.evidence, comments:[] };
    setPosts(ps=>[np, ...ps]);
    flash('Published · pinned to IPFS + Filecoin');
    navTo('#/forum/'+data.cat+'/'+np.id);
  };
  const signOut = async () => {
    await window.SUPABASE.auth.signOut();
    setConnected(false);
    navTo('#/forum');
    flash('Signed out');
  };

  const counts = { all: posts.length };
  O.CATEGORIES.forEach(c=>counts[c.id]=posts.filter(p=>p.cat===c.id).length);

  const goCompose = () => navTo('#/forum/new');

  let view;
  switch (route.view) {
    case 'forum-home': view = <HomeView posts={posts} onVote={vote} counts={counts} />; break;
    case 'forum-category': view = <CategoryView cat={route.cat} posts={posts} onVote={vote} counts={counts} />; break;
    case 'forum-thread': view = <ThreadView cat={route.cat} id={route.id} posts={posts} connected={connected} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} onReactPost={reactPost} />; break;
    case 'forum-new': view = <NewPostView connected={connected} onConnect={connect} onPublish={publish} preset={route.preset} />; break;
    case 'profile': view = <ProfileView whoId={route.whoId} posts={posts} onVote={vote} />; break;
    case 'profile-sub':
      if (route.sub==='posts') view = <MyPostsView posts={posts} onVote={vote} />;
      else if (route.sub==='notifications') view = <NotificationsView />;
      else if (route.sub==='settings') view = <SettingsView profile={meRef} myAvatar={myAvatar} setMyAvatar={setMyAvatar} onSave={setMyProfile} />;
      else view = <Error404View />;
      break;
    case 'admin': view = <AdminView section={route.section} />; break;
    case 'events': view = <EventsView />; break;
    case 'event-detail': view = <EventDetailView id={route.id} posts={posts} onVote={vote} />; break;
    case 'proposals': view = <ProposalsView />; break;
    case 'proposal-detail': view = <ProposalDetailView id={route.id} posts={posts} connected={connected} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} />; break;
    case 'ambassadors': view = <AmbassadorsView posts={posts} />; break;
    case 'leaderboard': view = <LeaderboardView posts={posts} />; break;
    case 'search': view = <SearchView q={route.q} posts={posts} onVote={vote} />; break;
    case 'about': view = <AboutView />; break;
    case 'docs': view = <DocsView />; break;
    case 'connect': view = <ConnectView />; break;
    case 'error500': view = <Error500View />; break;
    case 'maintenance': view = <MaintenanceView />; break;
    case 'notfound': view = <Error404View />; break;
    default: view = <Error404View />;
  }

  const unread = (O.NOTIFICATIONS||[]).filter(n=>n.unread).length;
  const maximized = route.view==='maintenance';

  return (
    <>
      {!maximized && <Navbar route={route} connected={connected} onCompose={goCompose} onConnect={()=>navTo('#/connect')} onWallet={()=>navTo('#/profile/me')} onSignOut={signOut} unread={unread} />}
      {view}
      <div className={'toast'+(toast?' show':'')}><span className="tdot"></span>{toast}</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
