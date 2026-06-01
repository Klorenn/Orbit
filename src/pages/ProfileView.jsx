import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AMBASSADORS, BANNERS, who } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { SocialLinks } from '../components/SocialLinks'
import { useT } from '../hooks/useT'
import { ProfileTabs } from './account/MyPostsView'

export function ProfileView({ whoId, myIdentity, posts, onVote, following = [], onToggleFollow, myAvatar, onSetMyAvatar }) {
  const isMe = whoId === 'me' || whoId === 'you.fil'
  const [fetchedProfile, setFetchedProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [eventsCount, setEventsCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const { t } = useT()

  useEffect(() => { window.scrollTo(0, 0) }, [whoId])

  useEffect(() => {
    setProfileLoading(true)
    setFetchedProfile(null)
    async function loadProfile() {
      const target = isMe ? myIdentity : whoId
      if (!target) { setProfileLoading(false); return }
      const { data } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('identity', target)
        .maybeSingle()
      if (data) setFetchedProfile(data)
      setProfileLoading(false)
    }
    loadProfile()
  }, [whoId, isMe, myIdentity])

  useEffect(() => {
    async function loadEventsCount() {
      const identity = isMe ? myIdentity : whoId
      if (!identity) return
      const { count } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('attendee', identity)
      if (count != null) setEventsCount(count)
    }
    loadEventsCount()
  }, [whoId, isMe, myIdentity])

  useEffect(() => {
    async function loadFollowCounts() {
      const identity = isMe ? myIdentity : whoId
      if (!identity) return
      const [{ count: frs }, { count: fng }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following', identity),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower', identity),
      ])
      if (frs != null) setFollowersCount(frs)
      if (fng != null) setFollowingCount(fng)
    }
    loadFollowCounts()
  }, [whoId, isMe, myIdentity])

  const truncAddr = (addr) => addr && addr.startsWith('0x') ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr
  const resolvedIdentity = isMe ? myIdentity : whoId
  const staticU = isMe
    ? { ...who('you.fil'), name: truncAddr(myIdentity) || 'you.fil', karma: 0, bio: '', city: '', socials: {} }
    : (AMBASSADORS[whoId] || { name: truncAddr(whoId) || whoId, color: 'blue', karma: 0 })
  const u = fetchedProfile
    ? {
        ...staticU,
        name: fetchedProfile.handle || truncAddr(resolvedIdentity) || resolvedIdentity || staticU.name,
        bio: fetchedProfile.bio || '',
        city: fetchedProfile.city || '',
        socials: typeof fetchedProfile.socials === 'object' ? fetchedProfile.socials : {},
        banner: fetchedProfile.banner || staticU.banner,
        color: fetchedProfile.avatar || staticU.color || 'blue',
        karma: fetchedProfile.karma ?? 0,
      }
    : staticU

  const authorKey = isMe ? (myIdentity || who('you.fil').name) : whoId
  const theirPosts = posts.filter(p => p.author === authorKey)
  const banner = BANNERS.find(b => b.id === u.banner) || null
  const isFollowing = !isMe && following.includes(whoId)

  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <div className={'profile-hero' + (banner ? ' has-banner' : '')} style={banner ? { backgroundImage: 'url(' + banner.src + ')' } : null}>
        {banner ? <div className="ph-banner-scrim"></div> : <div className="ph-stars"><Stars n={14} /></div>}
        <div className="ph-row">
          <AmbassadorAvatar user={isMe ? 'you.fil' : whoId} size={88} link={false} nft />
          <div className="ph-info">
            <div className="ph-name">{u.name} {u.role && <span className="role">{u.role}</span>}</div>
            <div className="ph-meta">{u.city}{u.city && u.joined ? ' · ' : ''}{u.joined ? 'joined ' + u.joined : ''}</div>
            <p className="ph-bio">{u.bio}</p>
            <div className="ph-socials"><SocialLinks socials={u.socials} /></div>
          </div>
          {isMe
            ? <a className="pill pill-line ph-edit" href="#/profile/me/settings">{I.edit()} {t('editProfile')}</a>
            : <button
                className={'pill ph-edit ' + (isFollowing ? 'pill-line' : 'pill-solid')}
                onClick={() => onToggleFollow && onToggleFollow(whoId)}
              >
                {isFollowing ? t('unfollow') : t('follow')}
              </button>}
        </div>
        <div className="ph-stats">
          <div><div className="v">{u.karma || 0}</div><div className="l">{t('karma_stat')}</div></div>
          <div><div className="v">{theirPosts.length}</div><div className="l">{t('posts_stat')}</div></div>
          <div><div className="v">{eventsCount}</div><div className="l">{t('events_stat')}</div></div>
          <div><div className="v">{followersCount}</div><div className="l">{t('followers_stat')}</div></div>
          <div><div className="v">{followingCount}</div><div className="l">{t('following_stat')}</div></div>
        </div>
      </div>

      {isMe && <ProfileTabs active="overview" />}

      <div className="feed-head" style={{ marginTop: isMe ? 6 : 34 }}>
        <div>
          <div className="feed-title">{isMe ? t('yourPosts') : u.name.split('.')[0] + t('theirPosts')}</div>
          <div className="feed-sub">{theirPosts.length} {t('published')}</div>
        </div>
      </div>
      <div className="feed">
        {theirPosts.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {theirPosts.length === 0 && <p className="empty">{t('noPostsYet')}{isMe && <> <a href="#/forum/new">{t('writeFirst')}</a></>}</p>}
      </div>
    </div>
  )
}
