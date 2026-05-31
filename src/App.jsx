import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import {
  CATEGORIES, PROPOSALS, BANNERS, NOTIFICATIONS, ME, AMBASSADORS, EVENTS, DOCS, TRENDING,
  cid, catOf, who, navTo, PROP_STATUS
} from './data/constants'
import { usePosts } from './hooks/usePosts'
import { useVotes } from './hooks/useVotes'
import { useComments } from './hooks/useComments'
import { I } from './components/Icons'
import { Stars } from './components/Stars'
import { Vote } from './components/Vote'
import { CategoryBadge } from './components/CategoryBadge'
import { AmbassadorAvatar } from './components/AmbassadorAvatar'
import { PostCard } from './components/PostCard'
import { Comment } from './components/Comment'
import { MarkdownEditor, renderRich } from './components/MarkdownEditor'
import { WalletGate } from './components/WalletGate'
import { Navbar } from './components/Navbar'
import { SocialLinks } from './components/SocialLinks'
import { ReactionBar } from './components/ReactionBar'
import { MentionInput } from './components/MentionInput'
import { HomeView } from './pages/HomeView'
import { CategoryView } from './pages/CategoryView'
import { ThreadView } from './pages/ThreadView'
import { NewPostView } from './pages/NewPostView'
import { ProfileView } from './pages/ProfileView'
import { EventsView } from './pages/EventsView'
import { ProposalsView } from './pages/ProposalsView'
import { DocsView } from './pages/DocsView'
import { ConnectView } from './pages/ConnectView'
import { SearchView } from './pages/SearchView'
import { LeaderboardView } from './pages/LeaderboardView'
import { AmbassadorsView } from './pages/AmbassadorsView'
import { AboutView } from './pages/AboutView'
import { EventDetailView } from './pages/EventDetailView'
import { ProposalDetailView } from './pages/ProposalDetailView'
import { Error404View, Error500View, MaintenanceView } from './pages/ErrorViews'
import { MyPostsView, ProfileTabs } from './pages/account/MyPostsView'
import { NotificationsView } from './pages/account/NotificationsView'
import { SettingsView } from './pages/account/SettingsView'
import { AdminView } from './pages/account/AdminView'
import { MeetingsView, MeetingRoomView, ProposeMeetingView, OnboardingView } from './pages/MeetingsView'
import { SavedView } from './pages/SavedView'
import { LandingView } from './pages/LandingView'
import { MEETINGS, MEETING_KIND, BADGES, USER_BADGES, karmaBreakdown } from './data/constants'
import './styles/forum.css'
import './styles/orbit.css'
import '@rainbow-me/rainbowkit/styles.css'

/* ---------- hash router ---------- */
function parseHash() {
  if (window.location.hash.includes('access_token=')) return { view: 'forum-home' };
  let h = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  const seg = h.split('/').filter(Boolean);
  if (seg.length === 0) return { view: 'forum-home' };
  if (seg[0] === 'forum') {
    if (seg.length === 1) return { view: 'forum-home' };
    if (seg[1] === 'new') return { view: 'forum-new' };
    if (!CATEGORIES.some(c => c.id === seg[1])) return { view: 'notfound' };
    if (seg.length === 2) return { view: 'forum-category', cat: seg[1] };
    return { view: 'forum-thread', cat: seg[1], id: seg[2] };
  }
  if (seg[0] === 'profile') {
    const whoId = decodeURIComponent(seg[1] || 'me');
    if ((whoId === 'me') && seg[2]) return { view: 'profile-sub', sub: seg[2] };
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
  if (seg[0] === 'meetings') {
    if (seg[1] === 'new') return { view: 'meeting-new' };
    if (seg[1]) return { view: 'meeting-room', id: seg[1] };
    return { view: 'meetings' };
  }
  if (seg[0] === 'onboarding') return { view: 'onboarding' };
  if (seg[0] === 'saved') return { view: 'saved' };
  if (seg[0] === 'landing') return { view: 'landing' };
  return { view: 'notfound' };
}

export default function App() {
  const { connected, identity, signOut: authSignOut } = useAuth()
  const { posts, setPosts, createPost } = usePosts()
  const { toggleVote } = useVotes()
  const { addComment: addCommentDB } = useComments()
  const [route, setRoute] = useState(parseHash())
  const [toast, setToast] = useState('')
  const [myAvatar, setMyAvatarState] = useState(() => localStorage.getItem('orbit-avatar') || ME.color)
  const [myProfile, setMyProfileState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orbit-profile') || '{}'); } catch (e) { return {}; }
  })
  const toastTimer = useRef(null)
  const [meetings, setMeetings] = useState(MEETINGS)

  // Sync identity into ME and AMBASSADORS
  ME.name = identity
  ME.addr = identity
  if (AMBASSADORS['you.fil']) AMBASSADORS['you.fil'].name = identity

  // apply avatar choice to ME / AMBASSADORS so it shows everywhere (sync, before render of children)
  ME.color = myAvatar
  AMBASSADORS['you.fil'].color = myAvatar

  // apply profile edits (bio, city, socials) to you.fil
  const meRef = AMBASSADORS['you.fil']
  if (myProfile.bio != null) meRef.bio = myProfile.bio
  if (myProfile.city != null) { meRef.city = myProfile.city; ME.city = myProfile.city; }
  if (myProfile.socials) meRef.socials = { ...meRef.socials, ...myProfile.socials }
  if (myProfile.banner != null) meRef.banner = myProfile.banner

  const setMyAvatar = (col) => { setMyAvatarState(col); localStorage.setItem('orbit-avatar', col); flash('Avatar updated'); }
  const setMyProfile = (updates) => {
    const next = { ...myProfile, ...updates }
    setMyProfileState(next)
    localStorage.setItem('orbit-profile', JSON.stringify(next))
    flash('Profile saved')
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/forum'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const flash = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }

  useEffect(() => {
    const h = (e) => flash(e.detail)
    window.addEventListener('orbit-toast', h)
    return () => window.removeEventListener('orbit-toast', h)
  }, [])

  const joinMeeting = (id) => {
    if (!connected) { flash('Connect to join meetings'); return }
    setMeetings(ms => ms.map(m => m.id !== id ? m : { ...m, attendees: m.attendees.includes(identity) ? m.attendees : [...m.attendees, identity] }))
    navTo('#/meetings/' + id)
  }
  const leaveMeeting = (id) => {
    setMeetings(ms => ms.map(m => m.id !== id ? m : { ...m, attendees: m.attendees.filter(a => a !== identity) }))
  }

  const connect = () => navTo('#/connect')

  const vote = async (id) => {
    if (!connected) { flash('Connect your wallet to vote'); return }
    const post = posts.find(p => p.id === id)
    if (!post) return
    try {
      await toggleVote({ postId: id, voter: identity, currentlyVoted: post.upvoted })
      setPosts(ps => ps.map(p => p.id === id
        ? { ...p, upvoted: !p.upvoted, upvotes: p.upvotes + (p.upvoted ? -1 : 1) }
        : p))
    } catch (e) {
      flash('Vote failed: ' + e.message)
    }
  }

  const reactPost = (pid, emoji) => {
    if (!connected) { flash('Connect your wallet to react'); return; }
    setPosts(ps => ps.map(p => {
      if (p.id !== pid) return p
      const r = { ...(p.reactions || {}) }
      const cur = r[emoji] || { count: 0, mine: false }
      r[emoji] = { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine }
      if (r[emoji].count <= 0) delete r[emoji]
      return { ...p, reactions: r }
    }))
  }

  const reactComment = (pid, cid, emoji) => {
    if (!connected) { flash('Connect your wallet to react'); return; }
    const walk = (list) => list.map(c => {
      if (c.id === cid) {
        const r = { ...(c.reactions || {}) }
        const cur = r[emoji] || { count: 0, mine: false }
        r[emoji] = { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine }
        if (r[emoji].count <= 0) delete r[emoji]
        return { ...c, reactions: r }
      }
      if (c.replies) return { ...c, replies: walk(c.replies) }
      return c
    })
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walk(p.comments) }))
  }

  const replyComment = (pid, cid, text) => {
    if (!connected) { flash('Connect your wallet to reply'); return; }
    const reply = { id: 'r' + Date.now(), author: 'you.fil', time: 'now', text, reactions: {} }
    const walk = (list) => list.map(c => c.id === cid ? { ...c, replies: [...(c.replies || []), reply] } : c)
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walk(p.comments) }))
    flash('Reply published on-chain')
  }

  const addComment = async (pid, text) => {
    try {
      const comment = await addCommentDB({ postId: pid, author: identity, text })
      setPosts(ps => ps.map(p => p.id !== pid ? p
        : { ...p, comments: [...(p.comments || []), { ...comment, reactions: {}, replies: [] }] }))
      flash('Comment published on-chain')
    } catch (e) {
      flash('Comment failed: ' + e.message)
    }
  }

  const publish = async (data) => {
    try {
      const post = await createPost({
        cat: data.cat, type: data.type, title: data.title,
        body: data.body, evidence: data.evidence,
        author: identity, cidStr: data.cidStr || cid(),
      })
      flash('Published · pinned to IPFS + Filecoin')
      navTo('#/forum/' + data.cat + '/' + post.id)
    } catch (e) {
      flash('Publish failed: ' + e.message)
    }
  }

  const signOut = async () => {
    await authSignOut()
    navTo('#/forum')
    flash('Signed out')
  }

  const counts = { all: posts.length }
  CATEGORIES.forEach(c => counts[c.id] = posts.filter(p => p.cat === c.id).length)

  const goCompose = () => navTo('#/forum/new')

  let view
  switch (route.view) {
    case 'forum-home':
      view = <HomeView posts={posts} onVote={vote} counts={counts} />
      break
    case 'forum-category':
      view = <CategoryView cat={route.cat} posts={posts} onVote={vote} counts={counts} />
      break
    case 'forum-thread':
      view = <ThreadView cat={route.cat} id={route.id} posts={posts} connected={connected} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} onReactPost={reactPost} />
      break
    case 'forum-new':
      view = <NewPostView connected={connected} onConnect={connect} onPublish={publish} preset={route.preset} />
      break
    case 'profile':
      view = <ProfileView whoId={route.whoId} posts={posts} onVote={vote} />
      break
    case 'profile-sub':
      if (route.sub === 'posts') view = <MyPostsView posts={posts} onVote={vote} />
      else if (route.sub === 'notifications') view = <NotificationsView />
      else if (route.sub === 'settings') view = <SettingsView profile={meRef} myAvatar={myAvatar} setMyAvatar={setMyAvatar} onSave={setMyProfile} />
      else view = <Error404View />
      break
    case 'admin':
      view = <AdminView section={route.section} />
      break
    case 'events':
      view = <EventsView />
      break
    case 'event-detail':
      view = <EventDetailView id={route.id} posts={posts} onVote={vote} />
      break
    case 'proposals':
      view = <ProposalsView />
      break
    case 'proposal-detail':
      view = <ProposalDetailView id={route.id} posts={posts} connected={connected} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} />
      break
    case 'ambassadors':
      view = <AmbassadorsView posts={posts} />
      break
    case 'leaderboard':
      view = <LeaderboardView posts={posts} />
      break
    case 'search':
      view = <SearchView q={route.q} posts={posts} onVote={vote} />
      break
    case 'about':
      view = <AboutView />
      break
    case 'docs':
      view = <DocsView />
      break
    case 'connect':
      view = <ConnectView />
      break
    case 'meetings':
      view = <MeetingsView meetings={meetings} onJoin={joinMeeting} />
      break
    case 'meeting-room':
      view = <MeetingRoomView id={route.id} meetings={meetings} onJoin={joinMeeting} onLeave={leaveMeeting} />
      break
    case 'meeting-new':
      view = <ProposeMeetingView connected={connected} onConnect={() => navTo('#/connect')} onPublish={(m) => { setMeetings(ms => [m, ...ms]); navTo('#/meetings') }} />
      break
    case 'onboarding':
      view = <OnboardingView />
      break
    case 'saved':
      view = <SavedView posts={posts} onVote={vote} />
      break
    case 'landing':
      view = <LandingView />
      break
    case 'error500':
      view = <Error500View />
      break
    case 'maintenance':
      view = <MaintenanceView />
      break
    case 'notfound':
      view = <Error404View />
      break
    default:
      view = <Error404View />
  }

  const unread = (NOTIFICATIONS || []).filter(n => n.unread).length
  const maximized = route.view === 'maintenance'

  return (
    <>
      {!maximized && (
        <Navbar
          route={route}
          connected={connected}
          onCompose={goCompose}
          onConnect={() => navTo('#/connect')}
          onWallet={() => navTo('#/profile/me')}
          onSignOut={signOut}
          unread={unread}
        />
      )}
      {view}
      <div className={'toast' + (toast ? ' show' : '')}><span className="tdot"></span>{toast}</div>
    </>
  )
}
