import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { AMBASSADORS, BANNERS, SUPER_ADMIN, SKILLS, SPECIALTIES, RANKS, who, rankOf, karmaBreakdown } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'
import { SocialLinks } from '../components/SocialLinks'
import { useT } from '../hooks/useT'
import { ProfileTabs } from './account/MyPostsView'

function FollowListModal({ type, profileIdentity, isMe, onToggleFollow, onClose, onCountChange }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useT()

  const load = useCallback(async () => {
    setLoading(true)
    // followers of profileIdentity OR people profileIdentity follows
    const filter = type === 'followers' ? { following: profileIdentity } : { follower: profileIdentity }
    const identityCol = type === 'followers' ? 'follower' : 'following'

    const { data: rows } = await supabase.from('follows').select(identityCol).match(filter)
    if (!rows || rows.length === 0) { setItems([]); setLoading(false); return }

    const ids = rows.map(r => r[identityCol])
    const { data: profiles } = await supabase.from('public_profiles').select('identity,handle,avatar').in('identity', ids)
    const profileMap = Object.fromEntries((profiles || []).map(p => [p.identity, p]))

    setItems(ids.map(id => ({ identity: id, profile: profileMap[id] || null })))
    setLoading(false)
  }, [type, profileIdentity])

  useEffect(() => { load() }, [load])

  const truncAddr = id => id?.startsWith('0x') ? id.slice(0, 6) + '…' + id.slice(-4) : id
  const displayName = item => item.profile?.handle || truncAddr(item.identity) || item.identity

  const removeFollower = async (followerIdentity) => {
    await supabase.from('follows').delete().eq('follower', followerIdentity).eq('following', profileIdentity)
    setItems(prev => prev.filter(i => i.identity !== followerIdentity))
    onCountChange?.('followers', -1)
  }

  const handleUnfollow = (targetIdentity) => {
    onToggleFollow?.(targetIdentity)
    setItems(prev => prev.filter(i => i.identity !== targetIdentity))
    onCountChange?.('following', -1)
  }

  const title = type === 'followers'
    ? (t('followers_stat') || 'Followers')
    : (t('following_stat') || 'Following')

  return (
    <div className="modal-scrim open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 'min(480px, 100%)', maxHeight: '70vh' }}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 12 }}>
          {loading && <p className="empty" style={{ opacity: .5 }}>Cargando…</p>}
          {!loading && items.length === 0 && (
            <p className="empty" style={{ opacity: .6 }}>
              {type === 'followers' ? 'Nadie te sigue todavía.' : 'No seguís a nadie todavía.'}
            </p>
          )}
          {!loading && items.map(item => (
            <div key={item.identity} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <AmbassadorAvatar user={item.identity} size={38} color={item.profile?.avatar} link />
              <a href={'/profile/' + item.identity} style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'inherit', textDecoration: 'none' }} onClick={onClose}>
                {displayName(item)}
              </a>
              {isMe && type === 'followers' && (
                <button className="pill pill-line" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => removeFollower(item.identity)}>
                  Eliminar
                </button>
              )}
              {isMe && type === 'following' && (
                <button className="pill pill-line" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => handleUnfollow(item.identity)}>
                  {t('unfollow') || 'Unfollow'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KarmaModal({ karma, onClose }) {
  const breakdown = karmaBreakdown({ karma })
  const rank = rankOf(karma)
  const nextRank = RANKS.find(r => r.min > karma)

  return (
    <div className="modal-scrim open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 'min(440px, 100%)' }}>
        <div className="modal-head">
          <h2>Karma</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-.04em' }}>{karma}</div>
            <div>
              <div style={{ fontWeight: 600, color: rank.color, fontSize: 14 }}>{rank.label}</div>
              {nextRank && (
                <div style={{ fontSize: 12, color: 'rgba(var(--ink-rgb),.5)', marginTop: 2 }}>
                  {nextRank.min - karma} karma para {nextRank.label}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink-rgb),.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
              Cómo se distribuye
            </div>
            {breakdown.map(s => (
              <div key={s.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{s.label}</span>
                  <span style={{ color: s.tone, fontWeight: 600 }}>{s.value}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'rgba(var(--ink-rgb),.08)' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: s.tone, width: karma > 0 ? s.pct + '%' : '0%', transition: 'width .4s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(var(--ink-rgb),.04)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Cómo ganar karma</div>
            <div style={{ fontSize: 12.5, color: 'rgba(var(--ink-rgb),.65)', lineHeight: 1.55 }}>
              Cada upvote que recibe uno de tus posts suma 1 karma. Publicá reportes de eventos, propuestas de gobernanza y contribuciones técnicas — el contenido útil atrae más votos.
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink-rgb),.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
              Rangos
            </div>
            {RANKS.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', opacity: karma >= r.min ? 1 : 0.35 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: karma >= r.min ? 600 : 400 }}>{r.label}</div>
                <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(var(--ink-rgb),.45)' }}>{r.min}+</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const isMe = whoId === 'me' || whoId === 'you.fil' || (!!myIdentity && whoId === myIdentity)
  const [fetchedProfile, setFetchedProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [theirPosts, setTheirPosts] = useState([])
  const [realKarma, setRealKarma] = useState(null)
  const [eventsCount, setEventsCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followModal, setFollowModal] = useState(null) // 'followers' | 'following' | null
  const [karmaOpen, setKarmaOpen] = useState(false)
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

  // Dynamic OG meta tags
  useEffect(() => {
    if (!u.name) return
    const profileSkills = fetchedProfile?.skills || []
    const skillLabels = [
      ...SPECIALTIES.filter(s => profileSkills.includes(s.id)).map(s => s.label),
      ...SKILLS.filter(s => profileSkills.includes(s.id)).map(s => s.label),
    ].slice(0, 4)

    const displayName = fetchedProfile?.fullName || u.name
    const params = new URLSearchParams({
      name: displayName,
      ...(fetchedProfile?.fullName && { handle: u.name }),
      role: u.role || 'Ambassador',
      ...(u.city && { city: u.city }),
      banner: u.banner || 'galaxy2',
      avatar: u.color || 'blue',
      ...(skillLabels.length && { skills: skillLabels.join(',') }),
    })
    const ogUrl = `/api/og-profile?${params}`

    const setMeta = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(prop.startsWith('og:') || prop.startsWith('twitter:') ? 'property' : 'name', prop); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    setMeta('og:title', `${u.name} · Orbit`)
    setMeta('og:description', u.bio || `${u.role || 'Filecoin Ambassador'} on Orbit`)
    setMeta('og:image', ogUrl)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', `${u.name} · Orbit`)
    setMeta('twitter:image', ogUrl)

    return () => {
      setMeta('og:title', 'Orbit — Filecoin Ambassador Forum')
      setMeta('og:image', '/og.png')
      setMeta('twitter:image', '/og.png')
    }
  }, [u.name, u.banner, u.color, u.role, u.city, u.bio, fetchedProfile?.skills])
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
            {fetchedProfile?.fullName && <div className="ph-fullname">{fetchedProfile.fullName}</div>}
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
            [u.karma || 0, t('karma_stat'), t('tip_karma'), 'karma'],
            [theirPosts.length, t('posts_stat'), t('tip_posts'), null],
            [eventsCount, t('events_stat'), t('tip_events'), null],
            [followersCount, t('followers_stat'), t('tip_followers'), 'followers'],
            [followingCount, t('following_stat'), t('tip_following'), 'following'],
          ].map(([val, label, tip, modalKey]) => (
            modalKey
              ? <button key={label} className="ph-stat ph-stat-btn" title={tip} onClick={() => modalKey === 'karma' ? setKarmaOpen(true) : setFollowModal(modalKey)}>
                  <div className="v">{val}</div>
                  <div className="l">{label}</div>
                  <div className="ph-stat-tip">{tip}</div>
                </button>
              : <div key={label} className="ph-stat" title={tip}>
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

      {karmaOpen && <KarmaModal karma={u.karma || 0} onClose={() => setKarmaOpen(false)} />}

      {followModal && (
        <FollowListModal
          type={followModal}
          profileIdentity={resolvedIdentity}
          isMe={isMe}
          onToggleFollow={onToggleFollow}
          onClose={() => setFollowModal(null)}
          onCountChange={(type, delta) => {
            if (type === 'followers') setFollowersCount(c => c + delta)
            if (type === 'following') setFollowingCount(c => c + delta)
          }}
        />
      )}
    </div>
  )
}
