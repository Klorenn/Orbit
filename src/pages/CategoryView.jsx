import { useState } from 'react'
import { CATEGORIES, BANNERS, PROPOSALS, ME, PROP_STATUS, TRENDING, catOf, who } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'

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
        {CATEGORIES.map(c=>(
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
function Rail() {
  const banner = BANNERS.find(b=>b.id===who('you.fil').banner);
  return (
    <aside className="rail sticky">
      <div className={'profile-card'+(banner?' has-banner':'')} style={banner?{ backgroundImage:'url('+banner.src+')' }:null}>
        {banner ? <div className="pc-scrim"></div> : <Stars />}
        <AmbassadorAvatar user="you.fil" size={56} link={false} nft />
        <div className="pc-name">{ME.name}</div>
        <div className="pc-addr">{ME.addr}</div>
        <span className="pc-nft">{I.check()} Orbit Ambassador NFT</span>
        <div className="pc-grid">
          <div><div className="v">{ME.posts}</div><div className="l">Posts</div></div>
          <div><div className="v">{ME.karma}</div><div className="l">Karma</div></div>
        </div>
        <a href="#/profile/me" className="pill pill-line" style={{marginTop:16, width:'100%', justifyContent:'center'}}>View my profile</a>
      </div>
      <div className="rail-card">
        <h4>Active proposals</h4>
        {PROPOSALS.filter(p=>p.status!=='Approved'&&p.status!=='Draft').slice(0,3).map((p,i)=>(
          <a className="prop" key={i} href={p.threadId?('#/forum/'+p.cat+'/'+p.threadId):'#/proposals'}>
            <span className="pstat" style={{background:PROP_STATUS[p.status]}}></span>
            <div><div className="ptitle">{p.title}</div><div className="pmeta">{p.status} · {p.forVotes} in favor</div></div>
          </a>
        ))}
        <a href="#/proposals" className="rail-more">All proposals {I.back({style:{transform:'rotate(180deg)'},width:13,height:13})}</a>
      </div>
      <div className="rail-card">
        <h4>Trending</h4>
        <div className="trend">{TRENDING.map(t=><a key={t} href="#/forum">{t}</a>)}</div>
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
   VIEW: CATEGORY
   ============================================================ */
export function CategoryView({ cat, posts, onVote, counts }) {
  const [sort, setSort] = useState('latest');
  const c = catOf(cat);
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
