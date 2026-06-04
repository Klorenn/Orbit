import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useT } from './hooks/useT'
import {
  CATEGORIES, ME, AMBASSADORS, SUPER_ADMIN,
  cid, who, navTo,
} from './data/constants'
import { usePosts } from './hooks/usePosts'
import { useVotes } from './hooks/useVotes'
import { useComments } from './hooks/useComments'
import { useProfile } from './hooks/useProfile'
import { useEvents } from './hooks/useEvents'
import { useProposals } from './hooks/useProposals'
import { useMeetings } from './hooks/useMeetings'
import { useAmbassadors } from './hooks/useAmbassadors'
import { useForumConfig } from './hooks/useForumConfig'
import { useNotifications, insertNotification } from './hooks/useNotifications'
import { supabase } from './lib/supabase'
import { useFollows } from './hooks/useFollows'
import { BookmarksProvider } from './contexts/BookmarksContext'
import { I } from './components/Icons'
import { Navbar } from './components/Navbar'
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
import { BlogView } from './pages/BlogView'
import { ChatView } from './pages/ChatView'
import './styles/forum.css'
import '@rainbow-me/rainbowkit/styles.css'

/* ---------- path router ---------- */
function parseHash() {
  if (window.location.hash.includes('access_token=')) return { view: 'forum-home' };
  let h = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const seg = h.split('/').filter(Boolean);
  if (seg.length === 0) return { view: 'landing' };
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
  if (seg[0] === 'docs') return { view: 'docs' }
  if (seg[0] === 'blog') return { view: 'blog' };
  if (seg[0] === 'connect') return { view: 'connect' };
  if (seg[0] === 'chat') return { view: 'chat' };
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
  const { t } = useT()
  const { connected, identity, address, isConnected, signOut: authSignOut } = useAuth()
  const displayAddr = isConnected && address ? address.slice(0, 5) + '…' + address.slice(-4) : identity
  const { posts, setPosts, loadMore, hasMore, loadingMore, createPost, updatePost, deletePost } = usePosts(identity)
  const { toggleVote } = useVotes()
  const { addComment: addCommentDB, deleteComment: deleteCommentDB } = useComments()
  const { profile: myProfile, avatar: myAvatar, saveProfile, saveAvatar } = useProfile(identity)
  const displayName = myProfile?.handle?.trim() || displayAddr
  const isAdmin = !!(identity && (
    identity.toLowerCase() === SUPER_ADMIN ||
    myProfile?.role === 'Admin'
  ))
  const { events, myRsvps, rsvp, cancelRsvp } = useEvents(identity)
  const { proposals } = useProposals(posts)
  const { meetings, joinMeeting: _joinMeeting, leaveMeeting, proposeMeeting } = useMeetings(identity)
  const { ambassadors } = useAmbassadors()
  const { tagColors, saveTagColors } = useForumConfig()
  const { notifications, markRead, markAllRead } = useNotifications(identity)
  const { following, toggleFollow } = useFollows(identity)
  const [route, setRoute] = useState(parseHash())
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  // Sync identity into ME and AMBASSADORS
  ME.name = displayName
  ME.addr = displayAddr
  if (AMBASSADORS['you.fil']) AMBASSADORS['you.fil'].name = displayName

  // apply avatar choice to ME / AMBASSADORS so it shows everywhere (sync, before render of children)
  ME.color = myAvatar
  AMBASSADORS['you.fil'].color = myAvatar

  // Map wallet address → display info so PostCard shows handle + correct avatar
  if (identity) {
    AMBASSADORS[identity] = { ...(AMBASSADORS[identity] || {}), name: displayName, color: myAvatar }
  }

  // apply profile edits (bio, city, socials) to you.fil
  const meRef = AMBASSADORS['you.fil']
  if (myProfile.bio != null) meRef.bio = myProfile.bio
  if (myProfile.city != null) { meRef.city = myProfile.city; ME.city = myProfile.city; }
  if (myProfile.socials) meRef.socials = { ...meRef.socials, ...myProfile.socials }
  if (myProfile.banner != null) meRef.banner = myProfile.banner

  const setMyAvatar = (col) => { saveAvatar(col); flash(t('flashAvatarUpdated')) }
  const setMyProfile = (updates) => { saveProfile(updates); flash(t('flashProfileSaved')) }

  useEffect(() => {
    const onPop = () => setRoute(parseHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
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

  // First-time login → onboarding
  useEffect(() => {
    if (!connected) return
    const alreadyOnboarded = localStorage.getItem('orbit-onboarded')
    if (alreadyOnboarded) return
    const hasProfile = myProfile && (myProfile.bio || myProfile.city || myProfile.handle)
    if (hasProfile) { localStorage.setItem('orbit-onboarded', 'true'); return }
    const safe = ['onboarding', 'connect', 'landing', 'maintenance']
    if (!safe.includes(route.view)) navTo('/onboarding')
  }, [connected, route.view])

  const joinMeeting = (id) => {
    if (!connected) { flash(t('flashConnectToJoin')); return }
    _joinMeeting(id)
    navTo('/meetings/' + id)
  }

  const connect = () => navTo('/connect')

  const vote = async (id) => {
    if (!connected) { flash(t('flashConnectToVote')); return }
    const post = posts.find(p => p.id === id)
    if (!post) return
    try {
      await toggleVote({ postId: id, voter: identity, currentlyVoted: post.upvoted })
      if (!post.upvoted && post.author && post.author !== identity) {
        insertNotification({
          recipient: post.author,
          type: 'vote',
          actor: identity,
          postId: id,
          text: t('notifUpvoted') + ' ' + post.title,
          link: '/forum/' + post.cat + '/' + id,
        })
      }
      setPosts(ps => ps.map(p => p.id === id
        ? { ...p, upvoted: !p.upvoted, upvotes: p.upvotes + (p.upvoted ? -1 : 1) }
        : p))
    } catch (e) {
      flash('Vote failed: ' + e.message)
    }
  }

  const reactPost = (pid, emoji) => {
    if (!connected) { flash(t('flashConnectToReact')); return; }
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
    if (!connected) { flash(t('flashConnectToReact')); return; }
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
    if (!connected) { flash(t('flashConnectToReply')); return; }
    const reply = { id: 'r' + Date.now(), author: identity || 'you.fil', time: 'now', text, reactions: {} }
    const walk = (list) => list.map(c => c.id === cid ? { ...c, replies: [...(c.replies || []), reply] } : c)
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walk(p.comments) }))
    flash(t('flashReplyPublished'))
  }

  const addComment = async (pid, text) => {
    try {
      const comment = await addCommentDB({ postId: pid, author: identity, text })
      setPosts(ps => ps.map(p => {
        if (p.id !== pid) return p
        // Fire notification to post author
        if (p.author && p.author !== identity) {
          insertNotification({
            recipient: p.author,
            type: 'comment',
            actor: identity,
            postId: pid,
            text: t('notifCommented') + ' ' + p.title,
            link: '/forum/' + p.cat + '/' + pid,
          })
        }
        return { ...p, comments: [...(p.comments || []), { ...comment, reactions: {}, replies: [] }] }
      }))
      flash(t('flashCommentPublished'))
    } catch (e) {
      flash('Comment failed: ' + e.message)
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await deleteCommentDB(commentId)
      setPosts(ps => ps.map(p => {
        const removeFromList = (list) => list
          .filter(c => c.id !== commentId)
          .map(c => c.replies ? { ...c, replies: removeFromList(c.replies) } : c)
        return { ...p, comments: removeFromList(p.comments) }
      }))
    } catch (e) {
      flash('Delete failed: ' + e.message)
    }
  }

  const publish = async (data) => {
    try {
      const post = await createPost({
        cat: data.cat, type: data.type, title: data.title,
        body: data.body, evidence: data.evidence,
        author: identity, cidStr: data.cidStr || cid(),
      })
      if (data.type === 'Event' && data.eventDate) {
        await supabase.from('events').insert({
          title: data.title,
          when_date: data.eventDate,
          city: data.eventCity || '',
          country: data.eventCountry || '',
          host: identity,
          status: 'upcoming',
          post_id: post.id,
        })
      }
      flash(t('flashPostPublished'))
      navTo('/forum/' + data.cat + '/' + post.id)
    } catch (e) {
      flash('Publish failed: ' + e.message)
    }
  }

  const signOut = async () => {
    await authSignOut()
    navTo('/')
    flash(t('flashSignedOut'))
  }

  const followUser = async (target) => {
    if (!connected) { flash(t('flashConnectToVote')); return }
    const wasFollowing = following.includes(target)
    await toggleFollow(target)
    if (!wasFollowing && target !== identity) {
      insertNotification({
        recipient: target,
        type: 'follow',
        actor: identity,
        postId: null,
        text: t('notifFollowed'),
        link: '/profile/' + encodeURIComponent(identity),
      })
    }
  }

  const reportPost = async (postId) => {
    if (!connected) { flash(t('flashConnectToVote')); return }
    const reason = window.prompt(t('reportReason'))
    if (!reason || !reason.trim()) return
    try {
      await supabase.from('reports').insert({ post_id: postId, reporter: identity, reason: reason.trim(), status: 'open' })
      flash(t('reportSent'))
    } catch (e) {
      flash('Report failed: ' + e.message)
    }
  }

  const counts = { all: posts.length, ambassadors: ambassadors.length }
  CATEGORIES.forEach(c => counts[c.id] = posts.filter(p => p.cat === c.id).length)

  const goCompose = () => navTo('/forum/new')

  let view
  switch (route.view) {
    case 'forum-home':
      view = <HomeView posts={posts} onVote={vote} counts={counts} proposals={proposals} connected={connected} identity={identity} following={following} onLoadMore={loadMore} hasMore={hasMore} loadingMore={loadingMore} myRole={myProfile?.role || 'Member'} tagColors={tagColors} />
      break
    case 'forum-category':
      view = <CategoryView cat={route.cat} posts={posts} onVote={vote} counts={counts} proposals={proposals} connected={connected} identity={identity} following={following} onLoadMore={loadMore} hasMore={hasMore} loadingMore={loadingMore} />
      break
    case 'forum-thread':
      view = <ThreadView cat={route.cat} id={route.id} posts={posts} connected={connected} identity={identity} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} onReactPost={reactPost} onUpdate={updatePost} onDelete={deletePost} onDeleteComment={deleteComment} onReport={reportPost} />
      break
    case 'forum-new':
      view = <NewPostView connected={connected} onConnect={connect} onPublish={publish} preset={route.preset} />
      break
    case 'profile':
      view = <ProfileView whoId={route.whoId} myIdentity={identity} posts={posts} onVote={vote} following={following} onToggleFollow={followUser} myAvatar={myAvatar} onSetMyAvatar={setMyAvatar} />
      break
    case 'profile-sub':
      if (route.sub === 'posts') view = <MyPostsView posts={posts} onVote={vote} identity={identity} />
      else if (route.sub === 'notifications') view = <NotificationsView notifications={notifications} markRead={markRead} markAllRead={markAllRead} />
      else if (route.sub === 'settings') view = <SettingsView profile={myProfile} myAvatar={myAvatar} setMyAvatar={setMyAvatar} onSave={setMyProfile} />
      else view = <Error404View />
      break
    case 'admin':
      view = isAdmin
        ? <AdminView section={route.section} posts={posts} ambassadors={ambassadors} tagColors={tagColors} saveTagColors={saveTagColors} />
        : <Error404View />
      break
    case 'events':
      view = <EventsView events={events} myRsvps={myRsvps} connected={connected} onRsvp={async (id) => { const e = await rsvp(id); if (e) flash('RSVP failed: ' + e.message) }} onCancel={async (id) => { const e = await cancelRsvp(id); if (e) flash('Cancel failed: ' + e.message) }} />
      break
    case 'event-detail':
      view = <EventDetailView id={route.id} events={events} myRsvps={myRsvps} connected={connected} onRsvp={async (id) => { const e = await rsvp(id); if (e) flash('RSVP failed: ' + e.message) }} onCancel={async (id) => { const e = await cancelRsvp(id); if (e) flash('Cancel failed: ' + e.message) }} posts={posts} onVote={vote} />
      break
    case 'proposals':
      view = <ProposalsView proposals={proposals} />
      break
    case 'proposal-detail':
      view = <ProposalDetailView id={route.id} proposals={proposals} posts={posts} connected={connected} onConnect={connect} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} />
      break
    case 'ambassadors':
      view = <AmbassadorsView posts={posts} ambassadors={ambassadors} />
      break
    case 'leaderboard':
      view = <LeaderboardView posts={posts} ambassadors={ambassadors} />
      break
    case 'search':
      view = <SearchView q={route.q} posts={posts} onVote={vote} ambassadors={ambassadors} />
      break
    case 'about':
      view = <AboutView />
      break
    case 'docs':
      view = <DocsView />
      break
    case 'blog':
      view = <BlogView />
      break
    case 'connect':
      view = <ConnectView connected={connected} />
      break
    case 'chat':
      view = <ChatView connected={connected} identity={identity} onConnect={() => navTo('/connect')} isAdmin={isAdmin} />
      break
    case 'meetings':
      view = <MeetingsView meetings={meetings} onJoin={joinMeeting} />
      break
    case 'meeting-room':
      view = <MeetingRoomView id={route.id} meetings={meetings} onJoin={joinMeeting} onLeave={leaveMeeting} />
      break
    case 'meeting-new':
      view = <ProposeMeetingView connected={connected} onConnect={() => navTo('/connect')} onPublish={async (m) => { await proposeMeeting(m); navTo('/meetings') }} />
      break
    case 'onboarding':
      view = <OnboardingView onFinish={(data) => {
        setMyAvatar(data.avatar)
        setMyProfile({ ...data.profile, handle: data.profile.handle || '' })
        localStorage.setItem('orbit-onboarded', 'true')
        flash(t('flashWelcome'))
        navTo('/forum')
      }} />
      break
    case 'saved':
      view = <SavedView posts={posts} onVote={vote} />
      break
    case 'landing':
      view = <LandingView connected={connected} identity={displayName} address={displayAddr} myAvatar={myAvatar} onSignOut={signOut} />
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

  const unread = notifications.filter(n => n.unread).length
  const maximized = route.view === 'maintenance' || route.view === 'landing'

  return (
    <BookmarksProvider identity={identity}>
      {!maximized && (
        <Navbar
          route={route}
          connected={connected}
          identity={displayName}
          address={displayAddr}
          fullAddress={address}
          myAvatar={myAvatar}
          isAdmin={isAdmin}
          onCompose={goCompose}
          onConnect={() => navTo('/connect')}
          onWallet={() => navTo('/profile/me')}
          onSignOut={signOut}
          unread={unread}
        />
      )}
      {view}
      <div className={'toast' + (toast ? ' show' : '')}><span className="tdot"></span>{toast}</div>
    </BookmarksProvider>
  )
}
