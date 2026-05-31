# Orbit Forum — Next.js Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Orbit Forum from plain HTML + CDN React to Next.js 15 App Router, enabling RainbowKit wallet auth and Supabase in subsequent phases.

**Architecture:** Hash-router is replaced by file-based App Router. Global `window.ORBIT` namespace is replaced by TypeScript imports. Top-level posts/profile state moves to React Context. All existing UI is preserved exactly — this is a structural migration, not a redesign.

**Tech Stack:** Next.js 15 (App Router), TypeScript, React 18, RainbowKit 2, wagmi 2, viem 2, @tanstack/react-query 5, @supabase/supabase-js 2, @supabase/ssr

---

## File Map

```
/Users/paukoh/Downloads/orbit-forum/   ← new project root
  app/
    layout.tsx                  ← root layout wrapping all providers + Navbar + Toast
    page.tsx                    ← redirect → /forum
    globals.css                 ← forum.css + orbit.css merged
    forum/
      page.tsx                  ← HomeView
      [cat]/
        page.tsx                ← CategoryView
        [id]/
          page.tsx              ← ThreadView
      new/
        page.tsx                ← NewPostView
    profile/
      [who]/
        page.tsx                ← ProfileView
      me/
        posts/page.tsx          ← MyPostsView
        notifications/page.tsx  ← NotificationsView
        settings/page.tsx       ← SettingsView
    events/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    proposals/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    ambassadors/page.tsx
    leaderboard/page.tsx
    search/page.tsx
    about/page.tsx
    docs/page.tsx
    connect/page.tsx            ← RainbowKit auth
    admin/
      page.tsx
      [section]/page.tsx
  components/
    ui/
      Icons.tsx                 ← all SVG icons (I object from forum-ui.jsx)
      Stars.tsx
      Vote.tsx
      CategoryBadge.tsx
      AmbassadorAvatar.tsx
      PostCard.tsx
      Comment.tsx
      ReactionBar.tsx
      MentionInput.tsx
      MarkdownEditor.tsx
      SocialLinks.tsx
      WalletGate.tsx
      Navbar.tsx
    layout/
      Sidebar.tsx
      Rail.tsx
      SortBar.tsx
    views/
      HomeView.tsx
      CategoryView.tsx
      ThreadView.tsx
      NewPostView.tsx
      ProfileView.tsx
      EventsView.tsx
      ProposalsView.tsx
      AmbassadorsView.tsx
      LeaderboardView.tsx
      SearchView.tsx
      AboutView.tsx
      DocsView.tsx
      ConnectView.tsx
      AdminView.tsx
    account/
      ProfileTabs.tsx
      MyPostsView.tsx
      NotificationsView.tsx
      SettingsView.tsx
    error/
      Error404View.tsx
      Error500View.tsx
      MaintenanceView.tsx
  lib/
    mock-data.ts                ← forum-data.js → TypeScript (types + seed data)
    render.ts                   ← renderMD, inlineMD, renderRich, renderMentions, Embed helpers
    utils.ts                    ← cid(), URL_RE
  context/
    PostsContext.tsx            ← posts state + vote/comment/publish handlers
    ProfileContext.tsx          ← myAvatar, myProfile, setters
    ToastContext.tsx            ← flash() + toast display
  providers/
    index.tsx                   ← WagmiProvider + RainbowKitProvider + QueryClientProvider
  config/
    wagmi.ts                    ← wagmi config + chains (mainnet + filecoin)
  hooks/
    useAuth.ts                  ← connected state from wagmi account
```

---

## Task 1: Scaffold Next.js project

**Files:** Creates `/Users/paukoh/Downloads/orbit-forum/`

- [ ] **Step 1.1: Create project**

```bash
cd /Users/paukoh/Downloads
npx create-next-app@latest orbit-forum \
  --typescript \
  --no-tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --eslint
cd orbit-forum
```

- [ ] **Step 1.2: Install all dependencies at once**

```bash
npm install \
  @rainbow-me/rainbowkit@^2 \
  wagmi@^2 \
  viem@^2 \
  @tanstack/react-query@^5 \
  @supabase/supabase-js@^2 \
  @supabase/ssr@^0
```

- [ ] **Step 1.3: Verify dev server starts**

```bash
npm run dev
```

Expected: server running at http://localhost:3000. Default Next.js page visible.

- [ ] **Step 1.4: Remove default boilerplate**

Delete:
- `app/page.tsx` (replace in Task 12)
- `app/globals.css` (replace in Task 2)
- `public/next.svg`
- `public/vercel.svg`

- [ ] **Step 1.5: Copy assets from old project**

```bash
cp -r "/Users/paukoh/Downloads/Gobernanza file/assets" /Users/paukoh/Downloads/orbit-forum/public/assets
cp -r "/Users/paukoh/Downloads/Gobernanza file/uploads" /Users/paukoh/Downloads/orbit-forum/public/uploads
cp -r "/Users/paukoh/Downloads/Gobernanza file/screenshots" /Users/paukoh/Downloads/orbit-forum/public/screenshots
```

---

## Task 2: Migrate CSS

**Files:**
- Create: `app/globals.css`

- [ ] **Step 2.1: Copy forum.css content**

Open `/Users/paukoh/Downloads/Gobernanza file/forum.css` and copy the FULL content to `app/globals.css`.

Then append the full content of `/Users/paukoh/Downloads/Gobernanza file/orbit.css` at the bottom of `app/globals.css`.

Remove from `app/globals.css`:
- Any `@import` lines that referenced external URLs that Next.js will handle via `layout.tsx`

- [ ] **Step 2.2: Update `app/layout.tsx` to import the CSS**

The import will be added in Task 10. Skip for now.

- [ ] **Step 2.3: Add menu-btn CSS (new from Supabase migration)**

At bottom of `app/globals.css` add:

```css
.menu-pop .menu-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 10px; font-size: 14.5px; font-weight: 500; background: none; border: none; cursor: pointer; text-align: left; transition: background .15s; }
.menu-pop .menu-btn:hover { background: rgba(10,10,10,.05); }
.menu-pop .menu-btn.menu-danger { color: var(--red); }
```

---

## Task 3: Types + mock data

**Files:**
- Create: `lib/mock-data.ts`
- Create: `lib/utils.ts`

- [ ] **Step 3.1: Create types + mock data**

Create `lib/mock-data.ts` — convert `forum-data.js` to TypeScript:

```typescript
// lib/mock-data.ts
export type AvatarColor = 'blue'|'red'|'yellow'|'purple'|'green'|'orange'|'brown'|'gray'|'pink';
export type BannerId = 'green'|'purple'|'magenta'|'moon'|'gold'|'asteroid';

export interface Category { id: string; name: string; color: string; desc: string; }
export interface Social { key: string; label: string; prefix?: string; ph: string; }
export interface Reaction { count: number; mine: boolean; }
export interface Evidence { name: string; size: string; }

export interface Comment {
  id: string; author: string; time: string; text: string;
  reactions: Record<string, Reaction>; replies: Comment[];
  liked?: boolean; likes?: number;
}

export interface Post {
  id: string; cat: string; type: string; title: string; excerpt: string;
  body: string[]; author: string; time: string; upvotes: number; upvoted: boolean;
  cidStr: string; reactions: Record<string, Reaction>; evidence: Evidence[];
  comments: Comment[];
}

export interface Ambassador {
  name: string; color: AvatarColor; addr: string; role?: string;
  city: string; joined: string; karma: number; events: number;
  bio: string; socials: Record<string, string>; banner?: string;
}

export interface Proposal {
  id: string; title: string; summary: string; status: string;
  cat: string; author: string; forVotes: number; comments: number;
  threadId?: string;
}

export interface Event {
  id: string; title: string; city: string; month: string; day: string;
  spots: string; host: string; status: 'upcoming'|'past';
}

export interface Doc { id: string; title: string; body: string[]; }
export interface Banner { id: string; label: string; src: string; }

export const AV: Record<AvatarColor, string> = {
  blue: '/assets/avatar-blue.png', red: '/assets/avatar-red.png',
  yellow: '/assets/avatar-yellow.png', purple: '/assets/avatar-purple.png',
  green: '/assets/avatar-green.png', orange: '/assets/avatar-orange.png',
  brown: '/assets/avatar-brown.png', gray: '/assets/avatar-gray.png',
  pink: '/assets/avatar-pink.png',
};

export const AVATAR_OPTIONS: AvatarColor[] = ['blue','purple','green','yellow','red','orange','brown','gray','pink'];

export const COLORHEX: Record<AvatarColor, string> = {
  blue:'#0090FF', red:'#FF3B30', yellow:'#FFD60A', purple:'#A855F7',
  green:'#10B981', orange:'#FF9500', brown:'#8B5E3C', gray:'#8A8F98', pink:'#FF2D9B',
};

export const CATEGORIES: Category[] = [
  { id:'reports', name:'Reports', color:'#0090FF', desc:'Ambassador reports — events, activities, and field work.' },
  { id:'projects', name:'Projects', color:'#A855F7', desc:'New project proposals seeking signaling and collaborators.' },
  { id:'events', name:'Events', color:'#FFD60A', desc:'Event announcements, calls for facilitators, and recaps.' },
  { id:'feedback', name:'Feedback', color:'#10B981', desc:'Open discussion about the ecosystem and the forum itself.' },
  { id:'announcements', name:'Announcements', color:'#FF3B30', desc:'Official announcements. Moderators post; everyone reads.' },
  { id:'get-started', name:'Get started', color:'#0072CC', desc:'Onboarding for new ambassadors — start here.' },
  { id:'governance', name:'Governance', color:'#7C5CFF', desc:'Meta-governance — how the forum itself is run.' },
];

export const catOf = (id: string): Category => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];

export const SOCIALS: Social[] = [
  { key:'github', label:'GitHub', prefix:'@', ph:'username' },
  { key:'x', label:'X / Twitter', prefix:'@', ph:'handle' },
  { key:'discord', label:'Discord', prefix:'@', ph:'username#0000' },
  { key:'slack', label:'Slack', ph:'workspace' },
  { key:'telegram', label:'Telegram', prefix:'@', ph:'username' },
  { key:'instagram', label:'Instagram', prefix:'@', ph:'handle' },
  { key:'website', label:'Website', ph:'https://…' },
];

export const ME = {
  name: 'you.fil', color: 'blue' as AvatarColor,
  addr: '0xA3f9…7E21', fulladdr: '0xA3f94C2b8D1e5F7a93C6e0B2d4A8f1C5b6E27E21',
  role: 'Ambassador', city: 'Your node', joined: 'Mar 2025', karma: 340, posts: 12, events: 3,
};

export const PROP_STATUS: Record<string, string> = {
  Draft:'#9AA0AA', Discussion:'#0090FF', Voting:'#FFD60A', Approved:'#10B981',
};

export const AMBASSADORS: Record<string, Ambassador> = {
  'olga.fil':  { name:'olga.fil',  color:'blue',   addr:'0x7C1a…9F03', role:'Ambassador', city:'Santiago, CL',   joined:'Jan 2024', karma:1240, events:7,  bio:'Organizing Filecoin meetups across the Southern Cone. Storage-deal evangelist.', socials:{ github:'olga-fil', x:'olgabuilds', discord:'olga#2207', telegram:'olgafil', website:'olga.xyz' }, banner:'green' },
  'mira.fil':  { name:'mira.fil',  color:'purple', addr:'0x2B8e…4D71', role:'Ambassador', city:'Lisbon, PT',     joined:'Feb 2024', karma:980,  events:4,  bio:'Building tooling so ambassadors never touch a CLI. IPFS maximalist.', socials:{ github:'mira-codes', x:'mirabuilds', discord:'mira#0041', slack:'mira', telegram:'miradev' }, banner:'purple' },
  'tunde.fil': { name:'tunde.fil', color:'red',    addr:'0x9A3c…1E22', role:'Ambassador', city:'Lagos, NG',      joined:'May 2024', karma:760,  events:6,  bio:'Running storage workshops across West Africa. Community first.', socials:{ github:'tunde-ng', x:'tundeonchain', telegram:'tundefil', discord:'tunde#9100' }, banner:'magenta' },
  'devi.fil':  { name:'devi.fil',  color:'green',  addr:'0x4F6d…8B90', role:'Ambassador', city:'Bangalore, IN',  joined:'Mar 2024', karma:1120, events:5,  bio:'Onboarding obsessive. If the funnel leaks, I will find the hole.', socials:{ github:'devi-fn', x:'devifunnels', discord:'devi#3321', website:'devi.dev' }, banner:'moon' },
  'kwame.fil': { name:'kwame.fil', color:'yellow', addr:'0x6E2a…3C44', role:'Ambassador', city:'Accra, GH',      joined:'Apr 2024', karma:640,  events:3,  bio:'Wallet-native identity advocate. Less paperwork, more building.', socials:{ github:'kwame-gh', telegram:'kwamefil', x:'kwameid' }, banner:'gold' },
  'orbit-team.fil': { name:'orbit-team.fil', color:'blue', addr:'0x0001…CORE', role:'Core', city:'Constellation', joined:'Jan 2024', karma:0, events:0, bio:'Core stewards of the Orbit forum.', socials:{ github:'orbit-forum', x:'orbitforum', discord:'orbit', website:'orbit.gov' }, banner:'asteroid' },
  'you.fil':   { name:'you.fil', color:'blue', addr:'0xA3f9…7E21', role:'Ambassador', city:'Your node', joined:'Mar 2025', karma:340, events:3, bio:'Filecoin Orbit ambassador. This is your public profile.', socials:{ github:'you-fil', x:'youonchain', discord:'you#0001', slack:'', telegram:'youfil', website:'you.xyz' }, banner:'green' },
};

export const who = (key: string): Ambassador =>
  AMBASSADORS[key] || { name: key, color: 'blue', addr: '', role: '', city: '', joined: '', karma: 0, events: 0, bio: '', socials: {} };

export const BANNERS: Banner[] = [
  { id:'green',    label:'Aurora',    src:'/uploads/ChatGPT Image May 30, 2026, 08_16_41 AM.png' },
  { id:'purple',   label:'Nebula',    src:'/uploads/ChatGPT Image May 30, 2026, 08_15_46 AM.png' },
  { id:'magenta',  label:'Magenta',   src:'/uploads/ChatGPT Image May 28, 2026, 11_27_52 PM.png' },
  { id:'moon',     label:'Moon',      src:'/uploads/ChatGPT Image May 29, 2026, 01_22_25 PM.png' },
  { id:'gold',     label:'Gold',      src:'/uploads/ChatGPT Image May 30, 2026, 12_15_36 AM.png' },
  { id:'asteroid', label:'Asteroid',  src:'/uploads/ChatGPT Image May 30, 2026, 08_11_02 AM.png' },
];

export const TRENDING = ['#storage-deals','#ambassador-cohort-5','#FIP-0079','#satellite-grants','#IPFS-day','#governance-v2'];

export const NOTIFICATIONS = [
  { id:'n1', type:'comment', who:'mira.fil', text:'commented on your post', link:'/forum/reports/p1', time:'2h', unread:true },
  { id:'n2', type:'vote',    who:'tunde.fil', text:'upvoted your report',   link:'/forum/reports/p1', time:'5h', unread:true },
  { id:'n3', type:'mention', who:'devi.fil',  text:'mentioned you in Governance', link:'/forum/governance/p3', time:'1d', unread:false },
  { id:'n4', type:'event',   who:'kwame.fil', text:'created a new event in your region', link:'/events', time:'2d', unread:false },
  { id:'n5', type:'system',  who:'orbit-team.fil', text:'Ambassador cohort 5 is open', link:'/forum/announcements/p5', time:'3d', unread:false },
];

// Paste full SEED_POSTS, PROPOSALS, EVENTS, DOCS, ADMIN_STATS, FLAGGED, USERS_ADMIN, ALLOWLIST
// from /Users/paukoh/Downloads/Gobernanza file/forum-data.js verbatim (converted to TS const syntax)
// These are large arrays — copy them directly. Do NOT abbreviate.
export const SEED_POSTS: Post[] = [
  // Copy full array from forum-data.js
];

export const PROPOSALS: Proposal[] = [
  // Copy full array from forum-data.js
];

export const EVENTS: Event[] = [
  // Copy full array from forum-data.js
];

export const DOCS: Doc[] = [
  // Copy full array from forum-data.js
];
```

- [ ] **Step 3.2: Copy the large seed arrays**

Open `/Users/paukoh/Downloads/Gobernanza file/forum-data.js`.
Copy `SEED_POSTS`, `PROPOSALS`, `EVENTS`, `DOCS`, `ADMIN_STATS`, `FLAGGED`, `USERS_ADMIN`, `ALLOWLIST` arrays verbatim into `lib/mock-data.ts`, adding TypeScript type annotations (`as Post[]`, etc.).

- [ ] **Step 3.3: Create lib/utils.ts**

```typescript
// lib/utils.ts
const CHARS = 'abcdefghijkmnpqrstuvwxyz0123456789';
export function cid(): string {
  let s = 'bafy';
  for (let i = 0; i < 8; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s + '…' + Array.from({length:3}, () => CHARS[Math.floor(Math.random()*CHARS.length)]).join('');
}

export const URL_RE = /^https?:\/\//i;
```

---

## Task 4: Context (state shared across pages)

**Files:**
- Create: `context/PostsContext.tsx`
- Create: `context/ProfileContext.tsx`
- Create: `context/ToastContext.tsx`

- [ ] **Step 4.1: Create ToastContext**

```tsx
// context/ToastContext.tsx
'use client';
import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface ToastCtx { flash: (msg: string) => void; toast: string; }
const ToastContext = createContext<ToastCtx>({ flash: () => {}, toast: '' });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  };
  return (
    <ToastContext.Provider value={{ flash, toast }}>
      {children}
      <div className={'toast' + (toast ? ' show' : '')}><span className="tdot"></span>{toast}</div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
```

- [ ] **Step 4.2: Create ProfileContext**

```tsx
// context/ProfileContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { AMBASSADORS, AvatarColor, BannerId } from '@/lib/mock-data';
import { useToast } from './ToastContext';

interface ProfileUpdates { bio?: string; city?: string; socials?: Record<string,string>; banner?: string; }
interface ProfileCtx {
  myAvatar: AvatarColor;
  setMyAvatar: (c: AvatarColor) => void;
  myProfile: ProfileUpdates;
  setMyProfile: (u: ProfileUpdates) => void;
}
const ProfileContext = createContext<ProfileCtx>({} as ProfileCtx);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { flash } = useToast();
  const [myAvatar, setMyAvatarState] = useState<AvatarColor>(() =>
    (typeof localStorage !== 'undefined' ? localStorage.getItem('orbit-avatar') : null) as AvatarColor || 'blue'
  );
  const [myProfile, setMyProfileState] = useState<ProfileUpdates>(() => {
    try { return JSON.parse(localStorage.getItem('orbit-profile') || '{}'); } catch { return {}; }
  });

  const setMyAvatar = (col: AvatarColor) => {
    setMyAvatarState(col);
    localStorage.setItem('orbit-avatar', col);
    AMBASSADORS['you.fil'].color = col;
    flash('Avatar updated');
  };
  const setMyProfile = (updates: ProfileUpdates) => {
    const next = { ...myProfile, ...updates };
    setMyProfileState(next);
    localStorage.setItem('orbit-profile', JSON.stringify(next));
    const me = AMBASSADORS['you.fil'];
    if (updates.bio != null) me.bio = updates.bio;
    if (updates.city != null) me.city = updates.city;
    if (updates.socials) me.socials = { ...me.socials, ...updates.socials };
    if (updates.banner != null) me.banner = updates.banner;
    flash('Profile saved');
  };

  return (
    <ProfileContext.Provider value={{ myAvatar, setMyAvatar, myProfile, setMyProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
```

- [ ] **Step 4.3: Create PostsContext**

```tsx
// context/PostsContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment, SEED_POSTS, cid as makeCid } from '@/lib/mock-data';
import { cid } from '@/lib/utils';
import { useToast } from './ToastContext';

interface PostsCtx {
  posts: Post[];
  vote: (id: string) => void;
  reactPost: (pid: string, emoji: string) => void;
  reactComment: (pid: string, cid: string, emoji: string) => void;
  replyComment: (pid: string, cid: string, text: string) => void;
  addComment: (pid: string, text: string) => void;
  publish: (data: { cat: string; type: string; title: string; body: string; evidence: {name:string;size:string}[] }) => void;
}
const PostsContext = createContext<PostsCtx>({} as PostsCtx);

export function PostsProvider({ children, connected }: { children: ReactNode; connected: boolean }) {
  const { flash } = useToast();
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);

  const vote = (id: string) => {
    if (!connected) { flash('Connect your wallet to vote'); return; }
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, upvoted: !p.upvoted, upvotes: p.upvotes + (p.upvoted ? -1 : 1) } : p));
  };

  const reactPost = (pid: string, emoji: string) => {
    if (!connected) { flash('Connect your wallet to react'); return; }
    setPosts(ps => ps.map(p => {
      if (p.id !== pid) return p;
      const r = { ...(p.reactions || {}) };
      const cur = r[emoji] || { count: 0, mine: false };
      r[emoji] = { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine };
      if (r[emoji].count <= 0) delete r[emoji];
      return { ...p, reactions: r };
    }));
  };

  const walkReact = (list: Comment[], cid: string, emoji: string): Comment[] =>
    list.map(c => {
      if (c.id === cid) {
        const r = { ...(c.reactions || {}) };
        const cur = r[emoji] || { count: 0, mine: false };
        r[emoji] = { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine };
        if (r[emoji].count <= 0) delete r[emoji];
        return { ...c, reactions: r };
      }
      if (c.replies) return { ...c, replies: walkReact(c.replies, cid, emoji) };
      return c;
    });

  const reactComment = (pid: string, commentId: string, emoji: string) => {
    if (!connected) { flash('Connect your wallet to react'); return; }
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walkReact(p.comments, commentId, emoji) }));
  };

  const walkReply = (list: Comment[], cid: string, text: string): Comment[] =>
    list.map(c => c.id === cid
      ? { ...c, replies: [...(c.replies || []), { id: 'r' + Date.now(), author: 'you.fil', time: 'now', text, reactions: {}, replies: [] }] }
      : c);

  const replyComment = (pid: string, commentId: string, text: string) => {
    if (!connected) { flash('Connect your wallet to reply'); return; }
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walkReply(p.comments, commentId, text) }));
    flash('Reply published on-chain');
  };

  const addComment = (pid: string, text: string) => {
    setPosts(ps => ps.map(p => p.id !== pid ? p : {
      ...p, comments: [...p.comments, { id: 'c' + Date.now(), author: 'you.fil', time: 'now', text, reactions: {}, replies: [] }]
    }));
    flash('Comment published on-chain');
  };

  const publish = (data: { cat: string; type: string; title: string; body: string; evidence: {name:string;size:string}[] }) => {
    const np: Post = {
      id: 'p' + Date.now(), cat: data.cat, type: data.type, title: data.title,
      excerpt: data.body.replace(/[#*_>-]/g, '').slice(0, 150) + (data.body.length > 150 ? '…' : ''),
      body: data.body.split(/\n{2,}/).filter(Boolean),
      author: 'you.fil', time: 'now', upvotes: 1, upvoted: true,
      cidStr: cid(), reactions: {}, evidence: data.evidence, comments: [],
    };
    setPosts(ps => [np, ...ps]);
    flash('Published · pinned to IPFS + Filecoin');
  };

  return (
    <PostsContext.Provider value={{ posts, vote, reactPost, reactComment, replyComment, addComment, publish }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
```

---

## Task 5: wagmi config + RainbowKit providers

**Files:**
- Create: `config/wagmi.ts`
- Create: `providers/index.tsx`

- [ ] **Step 5.1: Create wagmi config**

```typescript
// config/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, filecoin, filecoinCalibration } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Orbit Forum',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // get free ID at https://cloud.reown.com
  chains: [mainnet, filecoin, filecoinCalibration],
  ssr: true,
});
```

> **Note:** Replace `YOUR_WALLETCONNECT_PROJECT_ID` with a free project ID from https://cloud.reown.com. Required for WalletConnect modals.

- [ ] **Step 5.2: Create Providers wrapper**

```tsx
// providers/index.tsx
'use client';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#0090FF', borderRadius: 'medium' })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## Task 6: useAuth hook

**Files:**
- Create: `hooks/useAuth.ts`

- [ ] **Step 6.1: Create hook**

```typescript
// hooks/useAuth.ts
'use client';
import { useAccount, useDisconnect } from 'wagmi';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return {
    connected: isConnected,
    address,
    signOut: () => disconnect(),
  };
}
```

---

## Task 7: Primitive UI components

**Files:** `components/ui/Icons.tsx`, `Stars.tsx`, `Vote.tsx`, `CategoryBadge.tsx`, `AmbassadorAvatar.tsx`

- [ ] **Step 7.1: Create Icons.tsx**

Copy the `I` object from `forum-ui.jsx` lines 8–51, converting to TypeScript:

```tsx
// components/ui/Icons.tsx
import { SVGProps } from 'react';
type P = SVGProps<SVGSVGElement>;

export const I = {
  up:   (p?: P) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  cmt:  (p?: P) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>,
  // ... copy ALL icon functions from forum-ui.jsx lines 8–51
  // Every icon in the I object must be included. Do not abbreviate.
};
```

> Copy all ~45 icon functions verbatim from `forum-ui.jsx`. Every function in `I` must be present.

- [ ] **Step 7.2: Create Stars.tsx**

```tsx
// components/ui/Stars.tsx
const PTS = [[30,30],[90,60],[150,25],[220,50],[270,35],[60,120],[130,150],[200,130],[260,160],[40,170],[110,90],[180,75],[240,110],[290,140]];

export function Stars({ n = 14 }: { n?: number }) {
  return (
    <svg className="pc-stars" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {PTS.slice(0, n).map((s, i) => (
        <circle key={i} cx={s[0]} cy={s[1]} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity={0.45 + i % 3 * 0.16} />
      ))}
    </svg>
  );
}
```

- [ ] **Step 7.3: Create Vote.tsx**

```tsx
// components/ui/Vote.tsx
import { I } from './Icons';

interface Props { count: number; voted: boolean; onToggle: () => void; row?: boolean; }

export function Vote({ count, voted, onToggle, row }: Props) {
  return (
    <div className="vote" style={row ? { flexDirection:'row', gap:8 } : undefined}>
      <button className={voted ? 'voted' : ''} onClick={e => { e.stopPropagation(); e.preventDefault(); onToggle(); }} aria-label="Upvote">
        <I.up />
      </button>
      <span className="n">{count}</span>
    </div>
  );
}
```

- [ ] **Step 7.4: Create CategoryBadge.tsx**

```tsx
// components/ui/CategoryBadge.tsx
import { catOf } from '@/lib/mock-data';

export function CategoryBadge({ cat, soft }: { cat: string; soft?: boolean }) {
  const c = catOf(cat);
  return (
    <span className={'tag ' + (soft ? 'soft' : '')}>
      <span className="dot" style={{ background: c.color }}></span>{c.name}
    </span>
  );
}
```

- [ ] **Step 7.5: Create AmbassadorAvatar.tsx**

```tsx
// components/ui/AmbassadorAvatar.tsx
import { AV, who } from '@/lib/mock-data';
import { I } from './Icons';

interface Props { user: string; size?: number; nft?: boolean; link?: boolean; }

export function AmbassadorAvatar({ user, size = 26, nft = false, link = true }: Props) {
  const u = typeof user === 'string' ? who(user) : user;
  const img = <img className="av" src={AV[u.color]} alt="" style={{ width: size, height: size, borderRadius: '50%' }} />;
  const node = nft ? (
    <span style={{ position:'relative', display:'inline-block', lineHeight:0 }}>
      {img}
      <span style={{ position:'absolute', right:-2, bottom:-2, width:size*0.46, height:size*0.46, borderRadius:'50%', background:'#10B981', color:'#fff', display:'grid', placeItems:'center', border:'2px solid #fff' }}>
        <I.check width={size*0.26} height={size*0.26} />
      </span>
    </span>
  ) : img;
  if (!link) return node;
  return <a href={'/profile/' + u.name} onClick={e => e.stopPropagation()} style={{ lineHeight:0 }}>{node}</a>;
}
```

---

## Task 8: Content UI components

**Files:** `components/ui/PostCard.tsx`, `Comment.tsx`, `ReactionBar.tsx`, `SocialLinks.tsx`

- [ ] **Step 8.1: Create PostCard.tsx**

```tsx
// components/ui/PostCard.tsx
'use client';
import Link from 'next/link';
import { Post, who } from '@/lib/mock-data';
import { Vote } from './Vote';
import { CategoryBadge } from './CategoryBadge';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { I } from './Icons';

interface Props { post: Post; onVote: (id: string) => void; }

export function PostCard({ post, onVote }: Props) {
  const u = who(post.author);
  return (
    <Link className="post" href={'/forum/' + post.cat + '/' + post.id}>
      <Vote count={post.upvotes} voted={post.upvoted} onToggle={() => onVote(post.id)} />
      <div className="post-main">
        <div className="post-tags">
          <span className="tag type">{post.type}</span>
          <CategoryBadge cat={post.cat} soft />
          <span className="cid" title="Pinned to IPFS / Filecoin">◈ {post.cidStr}</span>
        </div>
        <h3 className="pt">{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="post-meta">
          <span className="who">
            <AmbassadorAvatar user={post.author} link={false} />
            <span className="nm">{u.name}</span>
          </span>
          {u.role && <span className="role">{u.role}</span>}
          <span className="dotsep"></span>
          <span>{u.city}</span>
          <span className="dotsep"></span>
          <span>{post.time} ago</span>
          <span className="dotsep"></span>
          <span className="cmtcount"><I.cmt /> {post.comments.length}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 8.2: Create Comment.tsx**

Copy `Comment` component from `forum-ui.jsx` lines 160–204, converting:
- `href={'#/profile/'+u.name}` → use `AmbassadorAvatar` which already has the right href (updated in Task 7.5)
- `useStateA` → `useState`
- Props type: `{ c: Comment; onReact: (cid:string, emoji:string)=>void; onReply: (cid:string, text:string)=>void; depth?: number; }`

```tsx
// components/ui/Comment.tsx
'use client';
import { useState } from 'react';
import { Comment as CommentType, who } from '@/lib/mock-data';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { MentionInput } from './MentionInput';
import { I } from './Icons';

const REACTIONS = ['👍','🚀','🔥','❤️','🎉','👀','🙌','😄'];

function renderMentions(text: string) {
  // copy renderMentions from forum-ui.jsx — but use React.Fragment and no window.ORBIT dep
  return text; // placeholder — expand in Step 8.3
}

interface Props {
  c: CommentType;
  onReact: (cid: string, emoji: string) => void;
  onReply: (cid: string, text: string) => void;
  depth?: number;
}

export function Comment({ c, onReact, onReply, depth = 0 }: Props) {
  const u = who(c.author);
  const [picker, setPicker] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const reactions = c.reactions || {};
  const keys = Object.keys(reactions).filter(k => reactions[k].count > 0);
  const submit = () => { if (draft.trim()) { onReply(c.id, draft.trim()); setDraft(''); setReplying(false); } };
  return (
    <div className={'cmt' + (depth ? ' cmt-reply' : '')}>
      <AmbassadorAvatar user={c.author} size={depth ? 30 : 38} />
      <div style={{ flex:1, minWidth:0 }}>
        <div className="ch"><span className="nm">{u.name}</span>{u.role && <span className="role">{u.role}</span>}<span className="tm">· {c.time} ago</span></div>
        <p className="ctext">{c.text}</p>
        {keys.length > 0 && (
          <div className="react-row">
            {keys.map(k => <button key={k} className={'react-chip' + (reactions[k].mine ? ' mine' : '')} onClick={() => onReact(c.id, k)}><span className="re">{k}</span> {reactions[k].count}</button>)}
          </div>
        )}
        <div className="cact">
          <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
            <button className={picker ? 'on' : ''} onClick={() => setPicker(p => !p)}><I.smile /> React</button>
            {picker && <div className="emoji-pop">{REACTIONS.map(e => <button key={e} type="button" onClick={() => { onReact(c.id, e); setPicker(false); }}>{e}</button>)}</div>}
          </div>
          {depth === 0 && <button onClick={() => setReplying(r => !r)}><I.reply /> Reply</button>}
        </div>
        {replying && (
          <div className="reply-box">
            <MentionInput autoFocus value={draft} onChange={setDraft} placeholder={'Reply to ' + u.name + '… use @ to mention'}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }} />
            <div className="rb-row">
              <button className="pill pill-line" onClick={() => { setReplying(false); setDraft(''); }}>Cancel</button>
              <button className="pill pill-blue" onClick={submit} style={{ opacity: draft.trim() ? 1 : .5 }}>Reply</button>
            </div>
          </div>
        )}
        {c.replies && c.replies.length > 0 && (
          <div className="reply-thread">
            {c.replies.map(r => <Comment key={r.id} c={r} onReact={onReact} onReply={onReply} depth={depth+1} />)}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 8.3: Create ReactionBar.tsx**

Copy `ReactionBar` from `forum-ui.jsx` lines 207–220, converting to TypeScript component with proper imports.

```tsx
// components/ui/ReactionBar.tsx
'use client';
import { useState } from 'react';
import { Reaction } from '@/lib/mock-data';
import { I } from './Icons';

const REACTIONS = ['👍','🚀','🔥','❤️','🎉','👀','🙌','😄'];

export function ReactionBar({ reactions, onReact }: { reactions: Record<string,Reaction>; onReact: (emoji:string)=>void }) {
  const [picker, setPicker] = useState(false);
  const r = reactions || {};
  const keys = Object.keys(r).filter(k => r[k].count > 0);
  return (
    <div className="post-reacts">
      {keys.map(k => <button key={k} className={'react-chip' + (r[k].mine ? ' mine' : '')} onClick={() => onReact(k)}><span className="re">{k}</span> {r[k].count}</button>)}
      <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
        <button className={'react-add' + (picker ? ' on' : '')} onClick={() => setPicker(p => !p)}><I.smile /> React</button>
        {picker && <div className="emoji-pop">{REACTIONS.map(e => <button key={e} type="button" onClick={() => { onReact(e); setPicker(false); }}>{e}</button>)}</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 8.4: Create SocialLinks.tsx**

Copy `SocialLinks` + `socialIcon` + `socialURL` from `forum-ui.jsx` lines 54–81, converting to TypeScript.

---

## Task 9: MentionInput + MarkdownEditor

**Files:** `components/ui/MentionInput.tsx`, `components/ui/MarkdownEditor.tsx`, `lib/render.ts`

- [ ] **Step 9.1: Create lib/render.ts**

Copy `renderMD`, `inlineMD`, `renderRich`, `renderMentions`, `parseEmbed`, `Embed`, `URL_RE` from `forum-ui.jsx` lines 499–576, converting to TypeScript. Remove all `window.ORBIT` references — import from `@/lib/mock-data` instead.

- [ ] **Step 9.2: Create MentionInput.tsx**

Copy `MentionInput` + `caretXY` from `forum-ui.jsx` lines 236–297. Change `Object.values(AMBASSADORS)` to import from `@/lib/mock-data`.

```tsx
// components/ui/MentionInput.tsx
'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AMBASSADORS, Ambassador } from '@/lib/mock-data';
import { AmbassadorAvatar } from './AmbassadorAvatar';

// caretXY helper — copy verbatim from forum-ui.jsx lines 284–297

interface Props { value: string; onChange: (v:string)=>void; placeholder?: string; onKeyDown?: (e:KeyboardEvent<HTMLTextAreaElement>)=>void; autoFocus?: boolean; }

export function MentionInput({ value, onChange, placeholder, onKeyDown, autoFocus }: Props) {
  // copy full implementation from forum-ui.jsx lines 236–281
  // Replace window.ORBIT.AMBASSADORS → import AMBASSADORS from mock-data
}
```

- [ ] **Step 9.3: Create MarkdownEditor.tsx**

Copy `MarkdownEditor` from `forum-ui.jsx` lines 329–460. No window globals — all slash commands and file handling are self-contained.

---

## Task 10: WalletGate + Navbar

**Files:** `components/ui/WalletGate.tsx`, `components/ui/Navbar.tsx`

- [ ] **Step 10.1: Create WalletGate.tsx**

```tsx
// components/ui/WalletGate.tsx
import { ReactNode } from 'react';
import { I } from './Icons';

interface Props { connected: boolean; onConnect: () => void; children: ReactNode; label?: string; }

export function WalletGate({ connected, onConnect, children, label }: Props) {
  if (connected) return <>{children}</>;
  return (
    <div className="gate">
      <span className="gate-ic"><I.shield /></span>
      <div className="gate-txt">
        <strong>{label || 'Sign in to take part'}</strong>
        <span>Reading is open. Connect your wallet to post, comment, or vote.</span>
      </div>
      <button className="pill pill-blue" onClick={onConnect}>Connect Wallet</button>
    </div>
  );
}
```

- [ ] **Step 10.2: Create Navbar.tsx**

```tsx
// components/ui/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ME, NOTIFICATIONS } from '@/lib/mock-data';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { I } from './Icons';

const LINKS = [
  { label:'Forum', href:'/forum', match:'forum' },
  { label:'Events', href:'/events', match:'events' },
  { label:'Proposals', href:'/proposals', match:'proposals' },
  { label:'Ambassadors', href:'/ambassadors', match:'ambassadors' },
  { label:'Docs', href:'/docs', match:'docs' },
];

interface Props { connected: boolean; unread?: number; }

export function Navbar({ connected, unread = 0 }: Props) {
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const NOTIF = NOTIFICATIONS.slice(0, 4);

  useEffect(() => {
    const close = () => { setMenu(false); setBell(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="fbrand" href="/">
          <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
            <circle cx="128" cy="128" r="33" fill="currentColor" />
            <circle cx="173" cy="69" r="17" fill="currentColor" />
          </svg>
          <span className="word">Orbit</span>
        </Link>
        <nav className="topnav">
          {LINKS.map(l => <Link key={l.href} href={l.href} className={pathname.startsWith('/'+l.match) ? 'on' : ''}>{l.label}</Link>)}
        </nav>
        <div className="topbar-right">
          <Link className="nav-icon" href="/search" title="Search"><I.search /></Link>
          {connected && (
            <div className="nav-pop-wrap" onClick={e => e.stopPropagation()}>
              <button className="nav-icon" title="Notifications" onClick={() => { setBell(b => !b); setMenu(false); }}>
                <I.bell />{unread > 0 && <span className="nav-dot"></span>}
              </button>
              {bell && (
                <div className="popover notif-pop">
                  <div className="pop-head"><strong>Notifications</strong><Link href="/profile/me/notifications">See all</Link></div>
                  {NOTIF.map(n => (
                    <Link key={n.id} className={'notif-item' + (n.unread ? ' unread' : '')} href={n.link}>
                      <AmbassadorAvatar user={n.who} size={32} link={false} />
                      <div><span className="ni-text"><b>{n.who}</b> {n.text}</span><span className="ni-time">{n.time} ago</span></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className="pill pill-solid" onClick={() => router.push('/forum/new')}><I.plus /> New post</button>
          {connected ? (
            <div className="nav-pop-wrap" onClick={e => e.stopPropagation()}>
              <button className="wallet" onClick={() => { setMenu(m => !m); setBell(false); }} title="Account">
                <span className="nft"><I.check /> Orbit</span>
                <span className="addr">{ME.addr}</span>
                <AmbassadorAvatar user="you.fil" size={26} link={false} />
              </button>
              {menu && (
                <div className="popover menu-pop">
                  <div className="menu-mobile-nav">
                    {LINKS.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
                    <div className="menu-sep"></div>
                  </div>
                  <Link href="/profile/me"><I.globe /> My profile</Link>
                  <Link href="/profile/me/posts"><I.doc /> My posts</Link>
                  <Link href="/profile/me/notifications"><I.bell /> Notifications {unread > 0 && <span className="menu-badge">{unread}</span>}</Link>
                  <Link href="/profile/me/settings"><I.edit /> Settings</Link>
                  <div className="menu-sep"></div>
                  <Link href="/admin"><I.grid /> Admin panel</Link>
                  <div className="menu-sep"></div>
                  <ConnectButton.Custom>
                    {({ openAccountModal }) => (
                      <button className="menu-btn menu-danger" onClick={openAccountModal}><I.ban /> Disconnect</button>
                    )}
                  </ConnectButton.Custom>
                </div>
              )}
            </div>
          ) : (
            <ConnectButton label="Connect Wallet" />
          )}
        </div>
      </div>
    </header>
  );
}
```

---

## Task 11: Layout components (Sidebar, Rail, SortBar)

**Files:** `components/layout/Sidebar.tsx`, `Rail.tsx`, `SortBar.tsx`

- [ ] **Step 11.1: Create SortBar.tsx**

```tsx
// components/layout/SortBar.tsx
'use client';
const SORTS = [['latest','Latest'],['top','Top'],['discussed','Discussed'],['unanswered','Unanswered']] as const;

interface Props { sort: string; setSort: (s: string) => void; }

export function SortBar({ sort, setSort }: Props) {
  return (
    <div className="sortbar">
      {SORTS.map(([k, l]) => <button key={k} className={sort === k ? 'on' : ''} onClick={() => setSort(k)}>{l}</button>)}
    </div>
  );
}
```

- [ ] **Step 11.2: Create Sidebar.tsx**

Copy `Sidebar` from `forum-app.jsx` lines 53–77. Replace `href="#/forum/"+c.id` with `href={"/forum/"+c.id}`. Remove `window.ORBIT` — import from mock-data.

- [ ] **Step 11.3: Create Rail.tsx**

Copy `Rail` from `forum-app.jsx` lines 80–111. Replace all `href="#/..."` with Next.js `/...` paths. Import `BANNERS`, `PROPOSALS`, `PROP_STATUS`, `TRENDING` from mock-data.

---

## Task 12: Root layout + app entry

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 12.1: Create root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { ToastProvider } from '@/context/ToastContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { NavbarWrapper } from '@/components/ui/NavbarWrapper';

const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-hanken' });

export const metadata: Metadata = { title: 'Orbit Forum — Filecoin Governance', description: 'Wallet-gated governance forum for Filecoin Orbit ambassadors.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={hanken.className}>
        <Providers>
          <ToastProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 12.2: Create NavbarWrapper (client boundary for auth state)**

```tsx
// components/ui/NavbarWrapper.tsx
'use client';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const { connected } = useAuth();
  const unread = NOTIFICATIONS.filter(n => n.unread).length;
  return <Navbar connected={connected} unread={unread} />;
}
```

- [ ] **Step 12.3: Create home redirect**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation';
export default function Home() { redirect('/forum'); }
```

- [ ] **Step 12.4: Verify skeleton loads**

```bash
npm run dev
```

Expected: http://localhost:3000 redirects to /forum. Navbar renders (may be unstyled — that's OK at this step).

---

## Task 13: Forum pages (home, category, thread)

**Files:** `components/views/HomeView.tsx`, `CategoryView.tsx`, `ThreadView.tsx`, and their pages

- [ ] **Step 13.1: Create ForumLayout (shared posts context)**

```tsx
// app/forum/layout.tsx
'use client';
import { ReactNode } from 'react';
import { PostsProvider } from '@/context/PostsContext';
import { useAuth } from '@/hooks/useAuth';

export default function ForumLayout({ children }: { children: ReactNode }) {
  const { connected } = useAuth();
  return <PostsProvider connected={connected}>{children}</PostsProvider>;
}
```

- [ ] **Step 13.2: Create sortPosts helper**

```typescript
// lib/sort-posts.ts
import { Post } from '@/lib/mock-data';
export function sortPosts(list: Post[], sort: string): Post[] {
  const l = [...list];
  if (sort === 'top') return l.sort((a, b) => b.upvotes - a.upvotes);
  if (sort === 'discussed') return l.sort((a, b) => b.comments.length - a.comments.length);
  if (sort === 'unanswered') return l.filter(p => p.comments.length === 0);
  return l;
}
```

- [ ] **Step 13.3: Create HomeView**

Copy `HomeView` from `forum-app.jsx` lines 135–162. Replace `#/` hrefs with `/`. Import from context + lib.

```tsx
// components/views/HomeView.tsx
'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/mock-data';
import { usePosts } from '@/context/PostsContext';
import { sortPosts } from '@/lib/sort-posts';
import { PostCard } from '@/components/ui/PostCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Rail } from '@/components/layout/Rail';
import { SortBar } from '@/components/layout/SortBar';
import Link from 'next/link';

export function HomeView() {
  const { posts, vote } = usePosts();
  const [sort, setSort] = useState('latest');
  const counts: Record<string, number> = { all: posts.length };
  CATEGORIES.forEach(c => { counts[c.id] = posts.filter(p => p.cat === c.id).length; });
  const list = sortPosts(posts, sort);
  return (
    <div className="shell">
      <Sidebar activeCat={null} counts={counts} />
      <main>
        <div className="cat-cards">
          {CATEGORIES.slice(0, 4).map(c => (
            <Link key={c.id} className="cat-card" href={'/forum/' + c.id}>
              <span className="cc-dot" style={{ background: c.color }}></span>
              <div className="cc-name">{c.name}</div>
              <div className="cc-ct">{counts[c.id] || 0} posts</div>
            </Link>
          ))}
        </div>
        <div className="feed-head">
          <div><div className="feed-title">Recent activity</div><div className="feed-sub">Across all categories · anyone reads, members post</div></div>
          <SortBar sort={sort} setSort={setSort} />
        </div>
        <div className="feed">{list.map(p => <PostCard key={p.id} post={p} onVote={vote} />)}</div>
      </main>
      <Rail />
    </div>
  );
}
```

- [ ] **Step 13.4: Create forum pages**

```tsx
// app/forum/page.tsx
import { HomeView } from '@/components/views/HomeView';
export default function ForumPage() { return <HomeView />; }
```

```tsx
// app/forum/[cat]/page.tsx
import { CategoryView } from '@/components/views/CategoryView';
export default function CatPage({ params }: { params: { cat: string } }) {
  return <CategoryView cat={params.cat} />;
}
```

```tsx
// app/forum/[cat]/[id]/page.tsx
import { ThreadView } from '@/components/views/ThreadView';
export default function ThreadPage({ params }: { params: { cat: string; id: string } }) {
  return <ThreadView cat={params.cat} id={params.id} />;
}
```

- [ ] **Step 13.5: Create CategoryView**

Copy `CategoryView` from `forum-app.jsx` lines 167–193. Replace hrefs. Same pattern as HomeView.

- [ ] **Step 13.6: Create ThreadView**

Copy `ThreadView` from `forum-app.jsx` lines 198–254. Replace all `#/` hrefs with `/`. Import `usePosts`, `useAuth`.

```tsx
// Key replacement in ThreadView:
// Old: <WalletGate connected={connected} onConnect={onConnect} ...>
// New: <WalletGate connected={connected} onConnect={() => router.push('/connect')} ...>
// Import useRouter from 'next/navigation', useAuth from '@/hooks/useAuth'
```

- [ ] **Step 13.7: Verify forum home loads**

```bash
npm run dev
```

Visit http://localhost:3000/forum. Expected: post list renders with existing mock data.

---

## Task 14: NewPost page

**Files:** `components/views/NewPostView.tsx`, `app/forum/new/page.tsx`

- [ ] **Step 14.1: Create NewPostView**

Copy `NewPostView` from `forum-app.jsx` lines 259–325. Key changes:
- `onPublish` comes from `usePosts().publish`
- `connected` and `onConnect` from `useAuth`
- `useRouter().push('/forum/'+data.cat+'/'+np.id)` replaces `navTo`
- Remove `preset` prop for now (add back if needed)

- [ ] **Step 14.2: Create new post page**

```tsx
// app/forum/new/page.tsx
import { NewPostView } from '@/components/views/NewPostView';
export default function NewPage() { return <NewPostView />; }
```

---

## Task 15: Connect page (RainbowKit)

**Files:** `app/connect/page.tsx`, `components/views/ConnectView.tsx`

- [ ] **Step 15.1: Create ConnectView**

```tsx
// components/views/ConnectView.tsx
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Stars } from '@/components/ui/Stars';
import { I } from '@/components/ui/Icons';

export function ConnectView() {
  return (
    <div className="page-wrap connect-page">
      <div className="connect-card">
        <div className="cn-stars"><Stars n={14} /></div>
        <div className="cn-inner">
          <span className="cn-badge"><I.shield /> Sign-In With Ethereum</span>
          <h1>Connect your wallet</h1>
          <p>Reading Orbit is open to everyone. Connect your wallet and hold the Orbit Ambassador NFT to post, comment, and vote.</p>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
            <ConnectButton label="Connect Wallet" />
          </div>
          <div className="cn-steps">
            <div><span>1</span> Sign a message — no gas, no password</div>
            <div><span>2</span> We verify your Orbit NFT on-chain</div>
            <div><span>3</span> You are in — your wallet is your identity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 15.2: Create connect page**

```tsx
// app/connect/page.tsx
import { ConnectView } from '@/components/views/ConnectView';
export default function ConnectPage() { return <ConnectView />; }
```

- [ ] **Step 15.3: Verify RainbowKit modal opens**

Visit http://localhost:3000/connect. Click "Connect Wallet". Expected: RainbowKit modal appears with MetaMask, WalletConnect, etc.

---

## Task 16: Profile + account pages

**Files:** All under `app/profile/`, `components/views/ProfileView.tsx`, `components/account/`

- [ ] **Step 16.1: Create ProfileTabs**

Copy `ProfileTabs` from `forum-account.jsx` lines 10–12. Replace `href="#/profile/me/..."` with `/profile/me/...`.

- [ ] **Step 16.2: Create ProfileView**

Copy `ProfileView` from `forum-app.jsx` lines 330–372. Replace hrefs. Use `usePosts`, `useAuth`, `useProfile`.

- [ ] **Step 16.3: Create profile pages**

```tsx
// app/profile/me/page.tsx
import { ProfileView } from '@/components/views/ProfileView';
export default function MyProfilePage() { return <ProfileView whoId="me" />; }

// app/profile/[who]/page.tsx
import { ProfileView } from '@/components/views/ProfileView';
export default function ProfilePage({ params }: { params: { who: string } }) {
  return <ProfileView whoId={params.who} />;
}

// app/profile/me/posts/page.tsx
import { MyPostsView } from '@/components/account/MyPostsView';
export default function MyPostsPage() { return <MyPostsView />; }

// app/profile/me/notifications/page.tsx
import { NotificationsView } from '@/components/account/NotificationsView';
export default function NotificationsPage() { return <NotificationsView />; }

// app/profile/me/settings/page.tsx
import { SettingsView } from '@/components/account/SettingsView';
export default function SettingsPage() { return <SettingsView />; }
```

- [ ] **Step 16.4: Create account sub-components**

Copy `MyPostsView`, `NotificationsView`, `SettingsView` from `forum-account.jsx`. Replace hrefs. Use `useProfile` for settings state.

---

## Task 17: Remaining public pages

**Files:** Events, Proposals, Ambassadors, Leaderboard, Search, About, Docs — all under their respective `app/` routes

- [ ] **Step 17.1: Copy view components**

Copy these views from `forum-pages.jsx`, converting to TypeScript:
- `AboutView` → `components/views/AboutView.tsx`
- `AmbassadorsView` → `components/views/AmbassadorsView.tsx`
- `LeaderboardView` → `components/views/LeaderboardView.tsx`
- `SearchView` → `components/views/SearchView.tsx`
- `EventsView` + `EventDetailView` → `components/views/EventsView.tsx`
- `ProposalsView` + `ProposalDetailView` → `components/views/ProposalsView.tsx`

Key conversion: all `href="#/..."` → `/...`. All `window.ORBIT.*` → import from mock-data.

- [ ] **Step 17.2: Create pages**

```
app/events/page.tsx                 → <EventsView />
app/events/[id]/page.tsx            → <EventDetailView id={params.id} />
app/proposals/page.tsx              → <ProposalsView />
app/proposals/[id]/page.tsx         → <ProposalDetailView id={params.id} />
app/ambassadors/page.tsx            → <AmbassadorsView />
app/leaderboard/page.tsx            → <LeaderboardView />
app/search/page.tsx                 → <SearchView q={searchParams.q || ''} />
app/about/page.tsx                  → <AboutView />
app/docs/page.tsx                   → <DocsView />
```

---

## Task 18: Admin + error pages

**Files:** `app/admin/`, `app/not-found.tsx`, `app/error.tsx`

- [ ] **Step 18.1: Copy AdminView components**

Copy `AdminView`, `AdminHome`, `AdminReports`, `AdminUsers`, `AdminCategories`, `AdminAllowlist`, `AdminAnnouncements` from `forum-account.jsx`. Replace hrefs.

- [ ] **Step 18.2: Create admin pages**

```tsx
// app/admin/page.tsx
import { AdminView } from '@/components/views/AdminView';
export default function AdminPage() { return <AdminView section="home" />; }

// app/admin/[section]/page.tsx
import { AdminView } from '@/components/views/AdminView';
export default function AdminSection({ params }: { params: { section: string } }) {
  return <AdminView section={params.section} />;
}
```

- [ ] **Step 18.3: Create 404 + error pages**

```tsx
// app/not-found.tsx
import { Error404View } from '@/components/error/Error404View';
export default function NotFound() { return <Error404View />; }

// app/error.tsx
'use client';
import { Error500View } from '@/components/error/Error500View';
export default function Error() { return <Error500View />; }
```

Copy `Error404View`, `Error500View`, `MaintenanceView` from `forum-account.jsx`, converting hrefs.

---

## Task 19: Verify full app

- [ ] **Step 19.1: Run dev server**

```bash
npm run dev
```

- [ ] **Step 19.2: Check each route**

| Route | Expected |
|---|---|
| `/` | Redirects to `/forum` |
| `/forum` | Post list renders |
| `/forum/reports` | Filtered posts |
| `/forum/reports/p1` | Thread detail with comments |
| `/forum/new` | Compose form |
| `/connect` | RainbowKit ConnectButton visible |
| `/profile/me` | Profile view |
| `/events` | Events list |
| `/proposals` | Proposals list |
| `/ambassadors` | Grid of ambassadors |
| `/admin` | Admin dashboard |
| `/nonexistent` | 404 page |

- [ ] **Step 19.3: Verify wallet connect flow**

1. Click "Connect Wallet" in Navbar
2. RainbowKit modal opens
3. Connect MetaMask (or any wallet)
4. Navbar shows wallet address
5. WalletGate components unlock (can comment/vote)
6. Disconnect from account menu → reverts to logged-out state

- [ ] **Step 19.4: Commit**

```bash
git init
git add .
git commit -m "feat: migrate Orbit Forum to Next.js App Router with RainbowKit"
```

---

## Quick Reference: Conversion Patterns

These patterns apply everywhere during the migration:

| Old (plain HTML) | New (Next.js) |
|---|---|
| `href="#/forum/X"` | `href="/forum/X"` or `<Link href="/forum/X">` |
| `window.ORBIT.CATEGORIES` | `import { CATEGORIES } from '@/lib/mock-data'` |
| `window.location.hash = '#/X'` | `router.push('/X')` |
| `window.scrollTo(0,0)` on useEffect | Remove (Next.js handles scroll) |
| `const { useState } = React` | `import { useState } from 'react'` |
| `type="text/babel" src="..."` | Normal TypeScript import |
| `Object.assign(window, { X })` | `export function X` |
| `useEffect(()=>{ window.scrollTo(0,0) }, [])` | Remove entirely |
| `window.supabase` / `window.SUPABASE` | `import { supabase } from '@/config/supabase'` |
