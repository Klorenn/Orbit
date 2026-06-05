import { useState, useRef } from 'react'
import { CATEGORIES, BANNERS, ME, PROP_STATUS, TRENDING, catOf, who, navTo, rankOf } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { useT } from '../hooks/useT'

/* ---------- left sidebar (categories) ---------- */
function Sidebar({ activeCat, counts }) {
  const { t } = useT()
  return (
    <aside className="side sticky">
      <h4>{t('categories')}</h4>
      <div className="cat-list">
        <a className={'cat'+(!activeCat?' active':'')} href="/forum" onClick={e=>{e.preventDefault();navTo('/forum')}}>
          <span className="dot" style={{background:'#0A0A0A'}}></span>{t('allPosts')}
          <span className="ct">{counts.all}</span>
        </a>
        {CATEGORIES.map(c=>(
          <a key={c.id} className={'cat'+(activeCat===c.id?' active':'')} href={'/forum/'+c.id} onClick={e=>{e.preventDefault();navTo('/forum/'+c.id)}}>
            <span className="dot" style={{background:c.color}}></span>{c.name}
            <span className="ct">{counts[c.id]||0}</span>
          </a>
        ))}
      </div>
      <div className="side-card">
        <div className="sc-title">{t('forumOnChain')}</div>
        <div className="stat-row"><span>{t('statPosts')}</span><span className="v">{counts.all}</span></div>
        <div className="stat-row"><span>{t('statAmbassadors')}</span><span className="v">{counts.ambassadors || 0}</span></div>
        <div className="stat-row"><span>{t('statPinned')}</span><span className="v green">100%</span></div>
      </div>
    </aside>
  );
}

/* ---------- right rail ---------- */
function Rail({ proposals = [], connected = false, myPosts = 0, myKarma = 0, myRole = 'Member', tagColors = {} }) {
  const { t } = useT()
  const [tipOpen, setTipOpen] = useState(false)
  const tipRef = useRef(null)
  const tipTimer = useRef(null)
  const openTip = () => { clearTimeout(tipTimer.current); setTipOpen(true) }
  const closeTip = () => { tipTimer.current = setTimeout(() => setTipOpen(false), 120) }
  const banner = connected ? BANNERS.find(b=>b.id===who('you.fil').banner) : null
  const ELEVATED = ['Admin', 'Moderator', 'Core']
  const badgeLabel = ELEVATED.includes(myRole) ? myRole : rankOf(myKarma).label
  const badgeColor = tagColors[badgeLabel] || (ELEVATED.includes(myRole)
    ? (myRole === 'Admin' ? '#FF3B30' : myRole === 'Moderator' ? '#A855F7' : '#0090FF')
    : rankOf(myKarma).color)
  return (
    <aside className="rail sticky">
      {connected ? (
        <div className={'profile-card'+(banner?' has-banner':'')} style={banner?{ backgroundImage:'url('+banner.src+')' }:null}>
          {banner ? <div className="pc-scrim"></div> : <Stars />}
          <AmbassadorAvatar user="you.fil" size={56} link={false} nft />
          <div className="pc-name">{ME.name}</div>
          {ME.addr && ME.addr !== ME.name && <div className="pc-addr">{ME.addr}</div>}
          {(() => {
            const tip = (t('badgeTip') || {})[badgeLabel] || (t('badgeTip') || {})['Ambassador'] || {}
            return (
          <span
            ref={tipRef}
            className="pc-nft"
            style={{cursor:'help',position:'relative', background: badgeColor + '22', color: badgeColor}}
            onMouseEnter={openTip}
            onMouseLeave={closeTip}
          >
            {I.check()} {badgeLabel}
            {tipOpen && (
              <div className="nft-tip" onMouseEnter={openTip} onMouseLeave={closeTip}>
                <div className="nft-tip-title">{tip.title}</div>
                <div className="nft-tip-body">{tip.body}</div>
              </div>
            )}
          </span>
            )
          })()}
          <div className="pc-grid">
            <a href="/profile/me/posts" style={{ textDecoration: 'none', color: 'inherit' }}><div className="v">{myPosts}</div><div className="l">{t('posts_stat')}</div></a>
            <a href="/profile/me" style={{ textDecoration: 'none', color: 'inherit' }}><div className="v">{myKarma}</div><div className="l">{t('karma_stat')}</div></a>
          </div>
          <a href="/profile/me" className="pill pill-line" style={{marginTop:16, width:'100%', justifyContent:'center'}}>{t('viewMyProfile')}</a>
        </div>
      ) : (
        <div className="profile-card rail-guest">
          <Stars />
          <div className="rg-title">{t('railGuestTitle')}</div>
          <div className="rg-sub">{t('railGuestSub')}</div>
          <a href="/connect" className="pill pill-blue rg-btn">{t('railGuestBtn')}</a>
        </div>
      )}
      <div className="rail-card">
        <h4>{t('activeProposals')}</h4>
        {proposals.filter(p=>p.status!=='Approved'&&p.status!=='Draft').slice(0,3).map((p,i)=>(
          <a className="prop" key={i} href={p.threadId?('/forum/'+p.cat+'/'+p.threadId):'/proposals'}>
            <span className="pstat" style={{background:PROP_STATUS[p.status]}}></span>
            <div><div className="ptitle">{p.title}</div><div className="pmeta">{p.status} · {p.forVotes} {t('inFavor')}</div></div>
          </a>
        ))}
        <a href="/proposals" className="rail-more">{t('allProposalsLink')} {I.back({style:{transform:'rotate(180deg)'},width:13,height:13})}</a>
      </div>
      <div className="rail-card">
        <h4>{t('trending')}</h4>
        <div className="trend">{TRENDING.map(tr=><a key={tr} href="/forum">{tr}</a>)}</div>
      </div>
    </aside>
  )
}

/* ---------- sort bar ---------- */
function SortBar({ sort, setSort }) {
  const { t } = useT()
  return (
    <div className="sortbar">
      {[['latest', t('sortLatest')],['top', t('sortTop')],['discussed', t('sortDiscussed')],['unanswered', t('sortUnanswered')],['following', t('sortFollowing')]].map(([k,l])=>(
        <button key={k} className={sort===k?'on':''} onClick={()=>setSort(k)}>{l}</button>
      ))}
    </div>
  );
}

function sortPosts(list, sort, following = []) {
  let l = [...list];
  if (sort==='top') l.sort((a,b)=>b.upvotes-a.upvotes);
  else if (sort==='discussed') l.sort((a,b)=>b.comments.length-a.comments.length);
  else if (sort==='unanswered') l = l.filter(p=>p.comments.length===0);
  else if (sort==='following') l = l.filter(p=>following.includes(p.author));
  return l;
}

/* ============================================================
   VIEW: CATEGORY
   ============================================================ */
export function CategoryView({ cat, posts, onVote, counts, proposals, connected, identity, following = [], onLoadMore, hasMore, loadingMore, myRole = 'Member', tagColors = {}, myKarma: myKarmaProp = 0 }) {
  const [sort, setSort] = useState('latest');
  const { t } = useT()
  const c = catOf(cat);
  const list = sortPosts(posts.filter(p=>p.cat===cat), sort, following);
  const myPosts = posts.filter(p => p.author === identity).length
  const myKarma = myKarmaProp || posts.filter(p => p.author === identity).reduce((s, p) => s + (p.upvotes || 0), 0)
  return (
    <div className="shell">
      <Sidebar activeCat={cat} counts={counts} />
      <main>
        <a className="back-link" href="/forum" onClick={e=>{e.preventDefault();navTo('/forum')}}>{I.back()} {t('allCategories')}</a>
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
          {list.length===0 && sort!=='following' && <p className="empty">{t('noPostsInCat').replace('{cat}', c.name)}</p>}
          {list.length===0 && sort==='following' && <p className="empty">{following.length===0 ? t('sortFollowingEmptyNone') : t('sortFollowingEmpty')}</p>}
        </div>
        {sort === 'latest' && hasMore && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <button className="pill pill-line" onClick={onLoadMore} disabled={loadingMore}>
              {loadingMore ? '…' : t('loadMore')}
            </button>
          </div>
        )}
      </main>
      <Rail proposals={proposals} connected={connected} myPosts={myPosts} myKarma={myKarma} myRole={myRole} tagColors={tagColors} />
    </div>
  );
}
