import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AMBASSADORS, BANNERS, SUPER_ADMIN, SKILLS, SPECIALTIES, who, rankOf } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { SocialLinks } from '../components/SocialLinks'
import { useT } from '../hooks/useT'
import { ProfileTabs } from './account/MyPostsView'

function repoMeta(url = '') {
  const isGitLab = url.includes('gitlab.com')
  const match = url.match(/(?:github|gitlab)\.com\/([^/]+)\/([^/?#]+)/)
  const owner = match?.[1] || ''
  const name = match?.[2]?.replace(/\.git$/, '') || url.split('/').filter(Boolean).pop() || url
  return { isGitLab, icon: isGitLab ? 'devicon-gitlab-plain' : 'devicon-github-plain', owner, name }
}

function RepoCard({ repo }) {
  const { icon, owner, name, isGitLab } = repoMeta(repo.url)
  return (
    <a className={'repo-card' + (isGitLab ? ' repo-card--gitlab' : '')} href={repo.url} target="_blank" rel="noopener noreferrer">
      <i className={icon + ' repo-card-icon'} />
      <div className="repo-card-info">
        {owner && <span className="repo-card-owner">{owner}</span>}
        <span className="repo-card-name">{repo.name || name}</span>
      </div>
      <svg className="repo-card-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
    </a>
  )
}

export function ProfileView({ whoId, myIdentity, posts, onVote, following = [], onToggleFollow, myAvatar, onSetMyAvatar }) {
  const isMe = whoId === 'me' || whoId === 'you.fil'
  const [fetchedProfile, setFetchedProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [theirPosts, setTheirPosts] = useState([])
  const [realKarma, setRealKarma] = useState(null)
  const [eventsCount, setEventsCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const { t } = useT()

  useEffect(() => { window.scrollTo(0, 0) }, [whoId])

  useEffect(() => {
    setProfileLoading(true)
    setFetchedProfile(null)
    setTheirPosts([])
    setRealKarma(null)
    async function load() {
      const target = isMe ? myIdentity : whoId
      if (!target) { setProfileLoading(false); return }

      const [profileRes, postsRes, rsvpRes, frsRes, fngRes] = await Promise.all([
        supabase.from('public_profiles').select('*').eq('identity', target).maybeSingle(),
        supabase.from('posts').select('*').eq('author', target).order('created_at', { ascending: false }),
        supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('attendee', target),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following', target),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower', target),
      ])

      if (profileRes.data) setFetchedProfile(profileRes.data)
      if (postsRes.data) {
        const enriched = postsRes.data.map(p => ({ ...p, comments: p.comments || [], upvoted: false }))
        setTheirPosts(enriched)
        const karma = enriched.reduce((s, p) => s + (p.upvotes || 0), 0)
        setRealKarma(karma)
        // sync karma in DB if it drifted
        if (profileRes.data && profileRes.data.karma !== karma) {
          supabase.from('public_profiles').update({ karma }).eq('identity', target)
        }
      }
      if (rsvpRes.count != null) setEventsCount(rsvpRes.count)
      if (frsRes.count != null) setFollowersCount(frsRes.count)
      if (fngRes.count != null) setFollowingCount(fngRes.count)
      setProfileLoading(false)
    }
    load()
  }, [whoId, isMe, myIdentity])

  const truncAddr = (addr) => addr && addr.startsWith('0x') ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr
  const longTruncAddr = (addr) => addr && addr.startsWith('0x') ? addr.slice(0, 9) + '…' + addr.slice(-4) : addr
  const resolvedIdentity = isMe ? myIdentity : whoId
  const [copied, setCopied] = useState(false)
  const copyAddr = () => {
    if (!resolvedIdentity) return
    navigator.clipboard.writeText(resolvedIdentity).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
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
        karma: realKarma ?? fetchedProfile.karma ?? 0,
        role: fetchedProfile.role || staticU.role || 'Member',
      }
    : { ...staticU, karma: realKarma ?? staticU.karma ?? 0 }

  const isAdmin = resolvedIdentity && (
    resolvedIdentity.toLowerCase() === SUPER_ADMIN ||
    u.role === 'Admin'
  )
  const banner = BANNERS.find(b => b.id === u.banner) || null
  const isFollowing = !isMe && following.includes(whoId)

  return (
    <div className="page-wrap">
      <a className="back-link" href="/forum">{I.back()} {t('backToForum')}</a>
      <div className={'profile-hero' + (banner ? ' has-banner' : '') + (banner?.light ? ' banner-light' : '')} style={banner ? { backgroundImage: 'url(' + banner.src + ')' } : null}>
        {banner ? <div className="ph-banner-scrim"></div> : <div className="ph-stars"><Stars n={14} /></div>}
        <div className="ph-row">
          <AmbassadorAvatar user={isMe ? 'you.fil' : whoId} size={88} link={false} nft color={isMe ? myAvatar : u.color} />
          <div className="ph-info">
            <div className="ph-name">
              {u.name}
              {isAdmin && <span className="role" data-role="Admin">Admin</span>}
              {!isAdmin && u.role && u.role !== 'Member' && <span className="role" data-role={u.role}>{u.role}</span>}
              {(() => {
                const r = rankOf(u.karma)
                const tip = (t('badgeTip') || {})[r.label] || {}
                return (
                  <span className="rank-badge-wrap">
                    <span className="rank-badge" style={{ background: r.color + '22', color: r.color, border: '1px solid ' + r.color + '55' }}>{r.label}</span>
                    {tip.title && (
                      <span className="rank-badge-tip">
                        <strong>{tip.title}</strong>
                        <span>{tip.body}</span>
                      </span>
                    )}
                  </span>
                )
              })()}
            </div>
            {resolvedIdentity?.startsWith('0x') && (
              <button className="ph-addr-copy" onClick={copyAddr}>
                {copied ? '✓ Copiado' : longTruncAddr(resolvedIdentity)}
              </button>
            )}
            <div className="ph-meta">{u.city}{u.city && u.joined ? ' · ' : ''}{u.joined ? 'joined ' + u.joined : ''}</div>
            <p className="ph-bio">{u.bio}</p>
            <div className="ph-socials"><SocialLinks socials={u.socials} /></div>
            {(() => {
              const profileSkills = fetchedProfile?.skills || []
              const profileRepos = Array.isArray(fetchedProfile?.repos) ? fetchedProfile.repos : []
              const specDefs = SPECIALTIES.filter(s => profileSkills.includes(s.id))
              const skillDefs = SKILLS.filter(s => profileSkills.includes(s.id))
              if (!specDefs.length && !skillDefs.length && !profileRepos.length) return null
              return (
                <div className="ph-tech">
                  {specDefs.length > 0 && (
                    <div className="spec-list">
                      {specDefs.map(s => (
                        <span key={s.id} className="spec-tag" style={{ background: s.color + '18', color: s.color, borderColor: s.color + '40' }}>
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {skillDefs.length > 0 && (
                    <div className="skill-list">
                      {skillDefs.map(s => (
                        <span key={s.id} className="skill-chip" title={s.label}>
                          <i className={s.icon} />
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {profileRepos.length > 0 && (
                    <div className="repo-cards">
                      {profileRepos.map((r, i) => <RepoCard key={i} repo={r} />)}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
          {isMe
            ? <a className="pill pill-line ph-edit" href="/profile/me/settings">{I.edit()} {t('editProfile')}</a>
            : <button
                className={'pill ph-edit ' + (isFollowing ? 'pill-line' : 'pill-solid')}
                onClick={() => onToggleFollow && onToggleFollow(whoId)}
              >
                {isFollowing ? t('unfollow') : t('follow')}
              </button>}
        </div>
        <div className="ph-stats">
          {[
            [u.karma || 0, t('karma_stat'), t('tip_karma')],
            [theirPosts.length, t('posts_stat'), t('tip_posts')],
            [eventsCount, t('events_stat'), t('tip_events')],
            [followersCount, t('followers_stat'), t('tip_followers')],
            [followingCount, t('following_stat'), t('tip_following')],
          ].map(([val, label, tip]) => (
            <div key={label} className="ph-stat" title={tip}>
              <div className="v">{val}</div>
              <div className="l">{label}</div>
              <div className="ph-stat-tip">{tip}</div>
            </div>
          ))}
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
        {profileLoading && <p className="empty" style={{ opacity: .5 }}>Cargando…</p>}
        {!profileLoading && theirPosts.map(p => <PostCard key={p.id} post={p} onVote={onVote} />)}
        {!profileLoading && theirPosts.length === 0 && <p className="empty">{t('noPostsYet')}{isMe && <> <a href="/forum/new">{t('writeFirst')}</a></>}</p>}
      </div>
    </div>
  )
}
