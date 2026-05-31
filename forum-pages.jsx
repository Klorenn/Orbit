/* ============================================================
   ORBIT FORUM — extra public pages (exported to window)
   about · ambassadors · search · leaderboard · event/proposal detail
   ============================================================ */
const { useState: useStateP, useEffect: useEffectP } = React;
const OP = window.ORBIT;
const { I: Ip, who: whoP, Stars: StarsP, AmbassadorAvatar: AvatarP, PostCard: PostCardP, CategoryBadge: BadgeP, Vote: VoteP, renderMD: renderMDp, Comment: CommentP, WalletGate: GateP } = window;

const postCountFor = (posts, name) => posts.filter(p=>p.author===name).length;

/* ============================================================
   ABOUT
   ============================================================ */
function AboutView() {
  useEffectP(()=>{ window.scrollTo(0,0); }, []);
  const team = ['orbit-team.fil','olga.fil','mira.fil','devi.fil','tunde.fil','kwame.fil'];
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{Ip.back()} Back to forum</a>
      <div className="about-hero">
        <div className="ah-stars"><StarsP n={14} /></div>
        <div className="ah-inner">
          <span className="cn-badge">{Ip.shield()} On-chain governance · Filecoin Orbit</span>
          <h1>A constellation of voices, building Filecoin together.</h1>
          <p>Orbit is the wallet-gated forum where Filecoin Orbit ambassadors publish reports, propose projects, and govern transparently — with every contribution pinned to IPFS and persisted on Filecoin.</p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="ac-ic" style={{background:'rgba(0,144,255,.1)', color:'#0090FF'}}>{Ip.pin()}</span>
          <h3>Our mission</h3>
          <p>Make the ambassadors' work visible. No more reports trapped in Airtable, conversations lost in Slack, or docs siloed on Drive — one open, on-chain record of the community's work.</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{background:'rgba(168,85,247,.1)', color:'#A855F7'}}>{Ip.gov()}</span>
          <h3>How we govern</h3>
          <p>Anyone can read. Holders of the Orbit Ambassador NFT post, comment, and vote. Proposals that reach rough consensus are promoted to Metropolis for formal FIP signaling.</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{background:'rgba(16,185,129,.1)', color:'#10B981'}}>{Ip.check()}</span>
          <h3>Eat our own dog food</h3>
          <p>Every report and attachment is pinned to IPFS and paid for via Filecoin storage deals. A community building decentralized storage shouldn't coordinate on Google Drive.</p>
        </div>
      </div>

      <h3 className="section-h">Aligned with the Constellation Program</h3>
      <p className="page-sub">Orbit is a contribution to the Filecoin Foundation's Constellation Program for modernizing governance. It complements Metropolis (FIP signaling) and fills the gap for ambassador activity and project debate.</p>
      <div className="logos-row">
        {['Filecoin Foundation','Protocol Labs','IPFS','FVM','Metropolis'].map(l=><span key={l} className="logo-chip">{l}</span>)}
      </div>

      <h3 className="section-h">The stewards</h3>
      <div className="team-grid">
        {team.map(t=>{ const u=whoP(t); return (
          <a key={t} className="team-card" href={'#/profile/'+u.name}>
            <AvatarP user={t} size={52} link={false} nft />
            <div className="tc-name">{u.name}</div>
            <div className="tc-role">{u.role} · {u.city}</div>
          </a>
        ); })}
      </div>
    </div>
  );
}

/* ============================================================
   AMBASSADORS DIRECTORY
   ============================================================ */
function AmbassadorsView({ posts }) {
  useEffectP(()=>{ window.scrollTo(0,0); }, []);
  const [q, setQ] = useStateP('');
  const all = Object.values(OP.AMBASSADORS).filter(u=>u.role!=='Core' && u.name!=='you.fil');
  const list = all.filter(u=> (u.name+u.city).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{Ip.back()} Back to forum</a>
      <h1 className="page-title">Ambassadors</h1>
      <p className="page-sub">{all.length} verified ambassadors across the constellation. Every one holds the Orbit Ambassador NFT.</p>
      <div className="amb-search">{Ip.search()}<input placeholder="Search by name or city…" value={q} onChange={e=>setQ(e.target.value)} /></div>
      <div className="amb-grid">
        {list.map(u=>(
          <a key={u.name} className="amb-card" href={'#/profile/'+u.name}>
            <AvatarP user={u.name} size={56} link={false} nft />
            <div className="amb-info">
              <div className="amb-name">{u.name}</div>
              <div className="amb-city">{u.city}</div>
            </div>
            <p className="amb-bio">{u.bio}</p>
            <div className="amb-stats">
              <span><strong>{u.karma}</strong> karma</span>
              <span className="dotsep"></span>
              <span><strong>{postCountFor(posts, u.name)}</strong> posts</span>
              <span className="dotsep"></span>
              <span><strong>{u.events||0}</strong> events</span>
            </div>
          </a>
        ))}
        {list.length===0 && <p className="empty">No ambassadors match "{q}".</p>}
      </div>
    </div>
  );
}

/* ============================================================
   SEARCH
   ============================================================ */
function SearchView({ q, posts, onVote }) {
  const [query, setQuery] = useStateP(q || '');
  useEffectP(()=>{ window.scrollTo(0,0); }, []);
  const ql = query.trim().toLowerCase();
  const postHits = ql ? posts.filter(p=> (p.title+p.excerpt+p.body.join(' ')+p.author).toLowerCase().includes(ql)) : [];
  const ambHits = ql ? Object.values(OP.AMBASSADORS).filter(u=>u.name!=='you.fil' && (u.name+u.city+(u.bio||'')).toLowerCase().includes(ql)) : [];
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{Ip.back()} Back to forum</a>
      <h1 className="page-title">Search</h1>
      <div className="amb-search big">{Ip.search()}<input autoFocus placeholder="Search posts, proposals, ambassadors…" value={query} onChange={e=>setQuery(e.target.value)} /></div>
      {!ql && <p className="empty">Type to search across the whole forum.</p>}
      {ql && (
        <>
          {ambHits.length>0 && <>
            <h3 className="section-h">Ambassadors · {ambHits.length}</h3>
            <div className="amb-grid">
              {ambHits.map(u=>(
                <a key={u.name} className="amb-card" href={'#/profile/'+u.name}>
                  <AvatarP user={u.name} size={48} link={false} nft />
                  <div className="amb-info"><div className="amb-name">{u.name}</div><div className="amb-city">{u.city}</div></div>
                </a>
              ))}
            </div>
          </>}
          <h3 className="section-h">Posts · {postHits.length}</h3>
          <div className="feed">
            {postHits.map(p=><PostCardP key={p.id} post={p} onVote={onVote} />)}
            {postHits.length===0 && <p className="empty">No posts match "{query}".</p>}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   LEADERBOARD
   ============================================================ */
function LeaderboardView({ posts }) {
  useEffectP(()=>{ window.scrollTo(0,0); }, []);
  const ranked = Object.values(OP.AMBASSADORS).filter(u=>u.role!=='Core' && u.name!=='you.fil')
    .map(u=>({ ...u, pc: postCountFor(posts, u.name) }))
    .sort((a,b)=>b.karma-a.karma);
  const medal = ['#FFD60A','#C0C7D0','#CD7F4E'];
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{Ip.back()} Back to forum</a>
      <h1 className="page-title">Leaderboard</h1>
      <p className="page-sub">Ambassadors ranked by karma — earned through reports, proposals, and helpful contributions.</p>
      <div className="lb-list">
        {ranked.map((u,i)=>(
          <a key={u.name} className="lb-row" href={'#/profile/'+u.name}>
            <span className="lb-rank" style={i<3?{background:medal[i], color:'#0A0E27'}:null}>{i+1}</span>
            <AvatarP user={u.name} size={42} link={false} nft />
            <div className="lb-info"><div className="lb-name">{u.name}</div><div className="lb-city">{u.city}</div></div>
            <div className="lb-stats">
              <div className="lb-stat"><strong>{u.karma}</strong><span>karma</span></div>
              <div className="lb-stat"><strong>{u.pc}</strong><span>posts</span></div>
              <div className="lb-stat"><strong>{u.events||0}</strong><span>events</span></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   EVENT DETAIL
   ============================================================ */
function EventDetailView({ id, posts }) {
  useEffectP(()=>{ window.scrollTo(0,0); }, [id]);
  const ev = OP.EVENTS.find(e=>e.id===id);
  if (!ev) return <div className="page-wrap"><p className="empty">Event not found. <a href="#/events">All events</a></p></div>;
  const host = whoP(ev.host);
  const recap = posts.find(p=>p.cat==='reports' && p.author===ev.host);
  const agenda = ['Doors open + welcome', 'Filecoin storage 101', 'Live storage-deal demo', 'Project lightning talks', 'Open networking'];
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/events">{Ip.back()} All events</a>
      <div className="ev-detail-hero">
        <div className="evd-date"><span className="ev-mon">{ev.month}</span><span className="ev-day">{ev.day}</span></div>
        <div>
          <span className={'status-pill'} style={{background: ev.status==='upcoming'?'rgba(16,185,129,.14)':'rgba(10,10,10,.06)', color: ev.status==='upcoming'?'#0a7a55':'rgba(10,10,10,.5)'}}>● {ev.status==='upcoming'?'Upcoming':'Past'}</span>
          <h1 className="dt" style={{marginTop:10}}>{ev.title}</h1>
          <div className="evd-meta">{Ip.cal({width:15,height:15})} {ev.when} · {ev.city}</div>
        </div>
      </div>
      <div className="evd-cols">
        <div>
          <p className="prose"><span>{ev.spots}. Join fellow ambassadors for a hands-on session — bring a laptop and curiosity. Reading the forum is open to all; connect your wallet to RSVP and post your own recap afterward.</span></p>
          <h3 className="section-h">Agenda</h3>
          <ol className="agenda">{agenda.map((a,i)=><li key={i}><span>{i+1}</span>{a}</li>)}</ol>
          {recap && ev.status==='past' && <>
            <h3 className="section-h">Recap report</h3>
            <PostCardP post={recap} onVote={()=>{}} />
          </>}
        </div>
        <aside className="evd-side">
          <div className="rail-card">
            <h4>Host</h4>
            <a className="evd-host" href={'#/profile/'+host.name}>
              <AvatarP user={ev.host} size={44} link={false} nft />
              <div><div className="amb-name">{host.name}</div><div className="amb-city">{host.city}</div></div>
            </a>
            <button className="pill pill-blue" style={{width:'100%', justifyContent:'center', marginTop:14}}>{ev.status==='upcoming'?"I'll be there":'View recap'}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   PROPOSAL DETAIL
   ============================================================ */
const FLOW = ['Draft','Discussion','Voting','Approved'];
function ProposalDetailView({ id, posts }) {
  useEffectP(()=>{ window.scrollTo(0,0); }, [id]);
  const pr = OP.PROPOSALS.find(p=>p.id===id);
  if (!pr) return <div className="page-wrap"><p className="empty">Proposal not found. <a href="#/proposals">All proposals</a></p></div>;
  const author = whoP(pr.author);
  const stageIdx = FLOW.indexOf(pr.status);
  const thread = pr.threadId ? posts.find(p=>p.id===pr.threadId) : null;
  const pct = Math.min(100, Math.round(pr.forVotes / 2));
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/proposals">{Ip.back()} All proposals</a>
      <div className="pl-top" style={{marginTop:14, marginBottom:12}}>
        <span className="status-pill" style={{background:OP.PROP_STATUS[pr.status]+'22', color:OP.PROP_STATUS[pr.status]}}>● {pr.status}</span>
        <BadgeP cat={pr.cat} soft />
      </div>
      <h1 className="dt">{pr.title}</h1>
      <div className="detail-author">
        <AvatarP user={pr.author} size={44} nft />
        <div><div className="nm"><a href={'#/profile/'+author.name}>{author.name}</a> <span className="role">{author.role}</span></div><div className="sub">{author.city}</div></div>
      </div>

      <div className="prop-flow">
        {FLOW.map((s,i)=>(
          <div key={s} className={'pf-step'+(i<=stageIdx?' done':'')+(i===stageIdx?' current':'')}>
            <span className="pf-dot">{i<stageIdx?Ip.check():i+1}</span>
            <span className="pf-label">{s}</span>
            {i<FLOW.length-1 && <span className="pf-line"></span>}
          </div>
        ))}
      </div>

      <p className="prose" style={{marginTop:10}}>{pr.summary} This proposal is currently in the <strong>{pr.status}</strong> stage. Rough consensus reached here can be promoted to Metropolis for formal FIP signaling.</p>

      <div className="vote-bar-card">
        <div className="vbc-top"><span>In favor</span><span><strong>{pr.forVotes}</strong> signals</span></div>
        <div className="vote-bar"><span style={{width:pct+'%'}}></span></div>
        <div className="vbc-actions">
          <button className="pill pill-blue">{Ip.up({width:15,height:15})} Signal support</button>
          {thread ? <a className="pill pill-line" href={'#/forum/'+thread.cat+'/'+thread.id}>{Ip.cmt()} Open discussion ({pr.comments})</a>
                  : <button className="pill pill-line">{Ip.cmt()} {pr.comments} comments</button>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AboutView, AmbassadorsView, SearchView, LeaderboardView, EventDetailView, ProposalDetailView, Error404View });

/* ============================================================
   404
   ============================================================ */
function Error404View() {
  useEffectP(()=>{ window.scrollTo(0,0); }, []);
  return (
    <div className="page-wrap notfound">
      <img className="nf-img" src="assets/404.png" alt="404 — page not found" />
      <h1 className="nf-title">Lost in space.</h1>
      <p className="nf-sub">This page drifted out of orbit — it doesn't exist or has moved.</p>
      <div className="nf-actions">
        <a className="pill pill-solid" href="#/forum">{Ip.back()} Back to the forum</a>
        <a className="pill pill-line" href="#/search">{Ip.search()} Search instead</a>
      </div>
    </div>
  );
}
window.Error404View = Error404View;
