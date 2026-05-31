import { useEffect } from 'react'
import { BANNERS, who } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { SocialLinks } from '../components/SocialLinks'

// temporary placeholder — will be replaced in Task 10
function ProfileTabs({ active }) {
  const tabs = [['overview','Overview','#/profile/me'],['posts','Posts','#/profile/me/posts'],['notifications','Notifications','#/profile/me/notifications'],['settings','Settings','#/profile/me/settings']]
  return <div className="prof-tabs">{tabs.map(([k,l,h])=><a key={k} href={h} className={active===k?'on':''}>{l}</a>)}</div>
}

/* ============================================================
   VIEW: PROFILE
   ============================================================ */
export function ProfileView({ whoId, posts, onVote }) {
  const isMe = whoId==='me' || whoId==='you.fil';
  const u = isMe ? who('you.fil') : who(whoId);
  useEffect(()=>{ window.scrollTo(0,0); }, [whoId]);
  const theirPosts = posts.filter(p=>p.author===(isMe?'you.fil':whoId));
  const banner = (BANNERS.find(b=>b.id===u.banner) || null);
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
        <div><div className="feed-title">{isMe?'Your posts':u.name.split('.')[0]+'’s posts'}</div><div className="feed-sub">{theirPosts.length} published · all pinned to Filecoin</div></div>
      </div>
      <div className="feed">
        {theirPosts.map(p=><PostCard key={p.id} post={p} onVote={onVote} />)}
        {theirPosts.length===0 && <p className="empty">No posts yet.{isMe && <> <a href="#/forum/new">Write your first →</a></>}</p>}
      </div>
    </div>
  );
}
