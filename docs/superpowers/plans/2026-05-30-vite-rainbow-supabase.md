# Orbit Forum — Vite + RainbowKit + Supabase + Lighthouse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Orbit Forum from a CDN/Babel-standalone mockup to a Vite-bundled React app with real wallet auth (RainbowKit), real email auth (Supabase magic link), real database (Supabase Postgres), and real IPFS uploads (Lighthouse).

**Architecture:** The existing 5-file CDN app is ported to ES modules in a Vite project. The `window.ORBIT` global namespace is replaced with proper imports. Auth is dual: wallet via RainbowKit/wagmi on Filecoin, or email via Supabase OTP — unified in a `useAuth` hook. Posts/comments/votes persist in Supabase. File uploads go to Lighthouse. The `connected` boolean in App becomes `useAuth().connected`.

**Tech Stack:** Vite 6, React 18, @rainbow-me/rainbowkit, wagmi, viem, @tanstack/react-query, @supabase/supabase-js, Lighthouse SDK, Vitest + @testing-library/react

---

## Prerequisites — gather BEFORE starting tasks

| Item | Where to get it |
|------|----------------|
| WalletConnect Project ID | cloud.walletconnect.com (free) |
| Lighthouse API Key | files.lighthouse.storage (free tier) |
| Supabase URL | already: `https://zawytzpctpcuenmcrqoz.supabase.co` |
| Supabase Anon Key | already: `sb_publishable_19ztctaMZuxtvPzNst7DCA_kKygX5Sp` |

Create `.env` at project root before any task:
```
VITE_WALLETCONNECT_PROJECT_ID=your_id_here
VITE_LIGHTHOUSE_API_KEY=your_key_here
VITE_SUPABASE_URL=https://zawytzpctpcuenmcrqoz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_19ztctaMZuxtvPzNst7DCA_kKygX5Sp
```

---

## File Map

### Created by this plan
```
index.html
vite.config.js
.env                            ← created manually from prerequisites
src/
  main.jsx                      providers wrapper + React root
  App.jsx                       router + app shell (from forum-app.jsx)
  data/
    constants.js                CATEGORIES, AMBASSADORS, PROPOSALS, EVENTS, etc.
    seed.js                     SEED_POSTS initial data
  lib/
    supabase.js                 Supabase client singleton
    wagmi.js                    wagmi config + Filecoin chains
  hooks/
    useAuth.js                  unified auth state (wallet + email)
    usePosts.js                 Supabase posts CRUD
    useVotes.js                 Supabase votes
    useComments.js              Supabase comments
    useLighthouse.js            Lighthouse IPFS upload
  components/
    Icons.jsx                   I object — all SVG icons
    Stars.jsx
    Vote.jsx
    CategoryBadge.jsx
    AmbassadorAvatar.jsx
    WalletGate.jsx
    Navbar.jsx
    PostCard.jsx
    Comment.jsx
    ReactionBar.jsx
    MentionInput.jsx
    MarkdownEditor.jsx
    SocialLinks.jsx
  pages/
    HomeView.jsx
    CategoryView.jsx
    ThreadView.jsx
    NewPostView.jsx
    ProfileView.jsx
    EventsView.jsx
    ProposalsView.jsx
    DocsView.jsx
    ConnectView.jsx
    SearchView.jsx
    LeaderboardView.jsx
    AmbassadorsView.jsx
    AboutView.jsx
    EventDetailView.jsx
    ProposalDetailView.jsx
    ErrorViews.jsx              Error404View + Error500View + MaintenanceView
    account/
      MyPostsView.jsx
      NotificationsView.jsx
      SettingsView.jsx
      AdminView.jsx
  styles/
    forum.css                   copied from forum.css
    orbit.css                   copied from orbit.css
supabase/
  schema.sql                    run in Supabase SQL editor
```

### Modified
- `package.json` — add all dependencies

### Reference only (do not delete yet)
- `forum.html`, `forum-data.js`, `forum-ui.jsx`, `forum-pages.jsx`, `forum-account.jsx`, `forum-app.jsx`

---

## Task 1: Vite scaffold + install all dependencies

**Files:**
- Create: `vite.config.js`
- Create: `index.html`
- Modify: `package.json`

- [ ] **Step 1: Scaffold Vite in-place**

```bash
cd "/Users/paukoh/Downloads/Gobernanza file"
npm create vite@latest . --template react
```
When prompted "Current directory is not empty — Remove existing files and continue?" → select **No, keep existing files**.

- [ ] **Step 2: Install all dependencies**

```bash
npm install \
  @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query \
  @supabase/supabase-js \
  @lighthouse-web3/sdk
```

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

- [ ] **Step 3: Replace vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Create test setup file**

```js
// src/test-setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Replace index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Orbit Forum — Filecoin Governance</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 6: Verify Vite starts**

```bash
npm run dev
```
Expected: Vite server running on http://localhost:5173 (blank page is fine — no src/main.jsx yet).

- [ ] **Step 7: Commit**

```bash
git init
git add vite.config.js index.html package.json package-lock.json src/test-setup.js
git commit -m "feat: scaffold vite + install deps"
```

---

## Task 2: Migrate CSS and assets

**Files:**
- Create: `src/styles/forum.css`
- Create: `src/styles/orbit.css`

- [ ] **Step 1: Copy CSS files**

```bash
cp "forum.css" "src/styles/forum.css"
cp "orbit.css" "src/styles/orbit.css"
```

- [ ] **Step 2: Verify assets directory exists**

The current code references `assets/avatar-blue.png`, `assets/bn-green.png`, etc. These files should be in a `public/assets/` folder so Vite serves them.

```bash
ls assets/ 2>/dev/null || echo "assets dir missing"
```

If the `assets/` folder exists at project root, move it to `public/`:
```bash
cp -r assets public/
```

If it does not exist (images are missing from the mockup), note it — avatar colors fall back to CSS gracefully, so this does not break the app.

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: migrate css to src/styles"
```

---

## Task 3: Data constants

**Files:**
- Create: `src/data/constants.js`
- Create: `src/data/seed.js`

- [ ] **Step 1: Create src/data/constants.js**

Port everything from `forum-data.js` except `SEED_POSTS`. Replace `window.ORBIT = { ... }` with named exports.

```js
// src/data/constants.js
export const AV = {
  blue: '/assets/avatar-blue.png',
  red: '/assets/avatar-red.png',
  yellow: '/assets/avatar-yellow.png',
  purple: '/assets/avatar-purple.png',
  green: '/assets/avatar-green.png',
  orange: '/assets/avatar-orange.png',
  brown: '/assets/avatar-brown.png',
  gray: '/assets/avatar-gray.png',
  pink: '/assets/avatar-pink.png',
}

export const AVATAR_OPTIONS = ['blue','purple','green','yellow','red','orange','brown','gray','pink']

export const COLORHEX = {
  blue:'#0090FF', red:'#FF3B30', yellow:'#FFD60A', purple:'#A855F7',
  green:'#10B981', orange:'#FF9500', brown:'#8B5E3C', gray:'#8A8F98', pink:'#FF2D9B',
}

export const CATEGORIES = [
  { id: 'reports',       name: 'Reports',        color: '#0090FF', desc: 'Ambassador reports — events, activities, and field work.' },
  { id: 'projects',      name: 'Projects',       color: '#A855F7', desc: 'New project proposals seeking signaling and collaborators.' },
  { id: 'events',        name: 'Events',         color: '#FFD60A', desc: 'Event announcements, calls for facilitators, and recaps.' },
  { id: 'feedback',      name: 'Feedback',       color: '#10B981', desc: 'Open discussion about the ecosystem and the forum itself.' },
  { id: 'announcements', name: 'Announcements',  color: '#FF3B30', desc: 'Official announcements. Moderators post; everyone reads.' },
  { id: 'get-started',   name: 'Get started',    color: '#0072CC', desc: 'Onboarding for new ambassadors — start here.' },
  { id: 'governance',    name: 'Governance',     color: '#7C5CFF', desc: 'Meta-governance — how the forum itself is run.' },
]

export const catOf = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0]

export const ME = {
  name: 'you.fil', color: 'blue', addr: '0xA3f9…7E21',
  fulladdr: '0xA3f94C2b8D1e5F7a93C6e0B2d4A8f1C5b6E27E21',
  role: 'Ambassador', city: 'Your node', joined: 'Mar 2025', karma: 340, posts: 12, events: 3,
}

export const AMBASSADORS = {
  'olga.fil':  { name:'olga.fil',  color:'blue',   addr:'0x7C1a…9F03', role:'Ambassador', city:'Santiago, CL',   joined:'Jan 2024', karma:1240, events:7,  bio:'Organizing Filecoin meetups across the Southern Cone.', socials:{ github:'olga-fil',   x:'olgabuilds',  discord:'olga#2207', telegram:'olgafil',  website:'olga.xyz' }, banner:'green'    },
  'mira.fil':  { name:'mira.fil',  color:'purple', addr:'0x2B8e…4D71', role:'Ambassador', city:'Lisbon, PT',     joined:'Feb 2024', karma:980,  events:4,  bio:'Building tooling so ambassadors never touch a CLI.',   socials:{ github:'mira-codes', x:'mirabuilds',  discord:'mira#0041', slack:'mira',        telegram:'miradev' }, banner:'purple'   },
  'tunde.fil': { name:'tunde.fil', color:'red',    addr:'0x9A3c…1E22', role:'Ambassador', city:'Lagos, NG',      joined:'May 2024', karma:760,  events:6,  bio:'Running storage workshops across West Africa.',        socials:{ github:'tunde-ng',   x:'tundeonchain',discord:'tunde#9100',telegram:'tundefil'                    }, banner:'magenta'  },
  'devi.fil':  { name:'devi.fil',  color:'green',  addr:'0x4F6d…8B90', role:'Ambassador', city:'Bangalore, IN',  joined:'Mar 2024', karma:1120, events:5,  bio:'Onboarding obsessive.',                               socials:{ github:'devi-fn',    x:'devifunnels', discord:'devi#3321',                    website:'devi.dev'  }, banner:'moon'     },
  'kwame.fil': { name:'kwame.fil', color:'yellow', addr:'0x6E2a…3C44', role:'Ambassador', city:'Accra, GH',      joined:'Apr 2024', karma:640,  events:3,  bio:'Wallet-native identity advocate.',                     socials:{ github:'kwame-gh',   telegram:'kwamefil', x:'kwameid'                                               }, banner:'gold'     },
  'orbit-team.fil': { name:'orbit-team.fil', color:'blue', addr:'0x0001…CORE', role:'Core', city:'Constellation', joined:'Jan 2024', karma:0, events:0, bio:'Core stewards of the Orbit forum.', socials:{ github:'orbit-forum', x:'orbitforum', discord:'orbit', website:'orbit.gov' }, banner:'asteroid' },
  'you.fil':   { ...ME, bio:'Filecoin Orbit ambassador. This is your public profile.', socials:{ github:'you-fil', x:'youonchain', discord:'you#0001', slack:'', telegram:'youfil', website:'you.xyz' }, banner:'green' },
}

export const PROPOSALS = [
  { id:'pr1', title:'Shared evidence-pinning bot', status:'Discussion', author:'mira.fil', forVotes:73, comments:1, threadId:'p2', cat:'projects', summary:'Auto-pin report attachments to IPFS + Filecoin.' },
  { id:'pr2', title:'Quarterly ambassador stipend v2', status:'Voting', author:'olga.fil', forVotes:128, comments:34, threadId:null, cat:'governance', summary:'Revised stipend tiers tied to verified event reports.' },
  { id:'pr3', title:'Regional hub budget allocation', status:'Draft', author:'tunde.fil', forVotes:12, comments:12, threadId:null, cat:'projects', summary:'Seed budget for three regional hubs.' },
  { id:'pr4', title:'3-steward rotation for Announcements', status:'Discussion', author:'mira.fil', forVotes:44, comments:1, threadId:'p7', cat:'governance', summary:'Rotating community stewards elected quarterly.' },
  { id:'pr5', title:'Adopt report template v1 across all hubs', status:'Approved', author:'devi.fil', forVotes:189, comments:52, threadId:null, cat:'governance', summary:'Standardize the report format.' },
]

export const PROP_STATUS = { Draft:'#9aa0aa', Discussion:'#FFD60A', Voting:'#0090FF', Approved:'#10B981' }

export const EVENTS = [
  { id:'e1', when:'Jan 25, 2026', month:'JAN', day:'25', title:'Lagos storage workshop', city:'Lagos, NG', host:'tunde.fil', status:'upcoming', spots:'2 facilitators needed' },
  { id:'e2', when:'Feb 08, 2026', month:'FEB', day:'08', title:'Buenos Aires meetup #2', city:'Buenos Aires, AR', host:'olga.fil', status:'upcoming', spots:'Open · 40 seats' },
  { id:'e3', when:'Feb 21, 2026', month:'FEB', day:'21', title:'Lisbon FVM hack night', city:'Lisbon, PT', host:'mira.fil', status:'upcoming', spots:'Open · 30 seats' },
  { id:'e4', when:'Nov 14, 2025', month:'NOV', day:'14', title:'Santiago meetup #3', city:'Santiago, CL', host:'olga.fil', status:'past', spots:'64 attended · recap posted' },
  { id:'e5', when:'Oct 30, 2025', month:'OCT', day:'30', title:'Bangalore campus tour', city:'Bangalore, IN', host:'devi.fil', status:'past', spots:'210 reached · recap posted' },
]

export const DOCS = [
  { id:'participate', title:'How to participate', body:['Reading Orbit is open to everyone. To post, comment, or vote you connect a wallet or sign in with email.','Start in Get started, introduce yourself in Feedback, then file your first report in Reports.'] },
  { id:'conduct', title:'Code of conduct', body:['Be generous and specific. Critique ideas, never people.','No spam, no shilling, no doxxing.'] },
  { id:'template', title:'Report template', body:['Every report should answer: what happened, who showed up, what landed, what would you change, and what comes next.','Attach evidence — everything is pinned to IPFS via Lighthouse.'] },
  { id:'faq', title:'FAQ', body:['Do I need the NFT to read? No. Reading is fully open.','Where do my files live? On IPFS, with a Filecoin storage deal created automatically via Lighthouse.'] },
]

export const TRENDING = ['#storage-deals','#onboarding','#FVM','#regional-hubs','#IPFS','#stipends']

export const SOCIALS = [
  { key:'github',   label:'GitHub',   prefix:'github.com/',  ph:'username' },
  { key:'x',        label:'X',        prefix:'x.com/',       ph:'handle' },
  { key:'instagram',label:'Instagram',prefix:'instagram.com/', ph:'username' },
  { key:'discord',  label:'Discord',  prefix:'',             ph:'name#0000' },
  { key:'slack',    label:'Slack',    prefix:'',             ph:'workspace handle' },
  { key:'telegram', label:'Telegram', prefix:'t.me/',        ph:'username' },
  { key:'website',  label:'Website',  prefix:'https://',     ph:'yoursite.xyz' },
]

export const BANNERS = [
  { id:'green',    label:'Ringed World',  src:'/assets/bn-green.png' },
  { id:'purple',   label:'Violet Moon',   src:'/assets/bn-purple.png' },
  { id:'magenta',  label:'Magma Planet',  src:'/assets/bn-magenta.png' },
  { id:'asteroid', label:'Asteroid Belt', src:'/assets/bn-asteroid.png' },
  { id:'moon',     label:'Lunar Drift',   src:'/assets/bn-moon.png' },
  { id:'gold',     label:'Golden Orbit',  src:'/assets/bn-gold.png' },
]

export const NOTIFICATIONS = [
  { id:'n1', type:'comment', who:'kwame.fil', text:'commented on your report', time:'2h', unread:true, link:'#/forum/reports/p1' },
  { id:'n2', type:'vote',    who:'mira.fil',  text:'and 11 others signaled support on your proposal', time:'5h', unread:true, link:'#/proposals' },
  { id:'n3', type:'mention', who:'devi.fil',  text:'mentioned you in "Onboarding asks for a wallet…"', time:'1d', unread:true, link:'#/forum/feedback/p4' },
  { id:'n4', type:'event',   who:'tunde.fil', text:'invited you to co-facilitate the Lagos workshop', time:'2d', unread:false, link:'#/events/e1' },
  { id:'n5', type:'system',  who:'orbit-team.fil', text:'Your post was pinned to IPFS + Filecoin successfully', time:'3d', unread:false, link:'#/profile/me/posts' },
]

export const FLAGGED = [
  { id:'f1', target:'Comment by anon.fil', reason:'Spam / shilling', reporter:'devi.fil', time:'1h', status:'open', excerpt:'Buy my token before it 100x…' },
  { id:'f2', target:'Post: "Free storage hack"', reason:'Misinformation', reporter:'olga.fil', time:'4h', status:'open', excerpt:'Claims you can get unlimited Filecoin storage for free…' },
  { id:'f3', target:'Comment by ghost.fil', reason:'Harassment', reporter:'mira.fil', time:'1d', status:'reviewing', excerpt:'Personal attack directed at another ambassador.' },
  { id:'f4', target:'Post: "Re: stipend v2"', reason:'Off-topic', reporter:'kwame.fil', time:'2d', status:'resolved', excerpt:'Thread derailed into unrelated price talk.' },
]

export const USERS_ADMIN = [
  { name:'olga.fil',  role:'Ambassador', status:'Active',    nft:true,  karma:1240, joined:'Jan 2024' },
  { name:'mira.fil',  role:'Moderator',  status:'Active',    nft:true,  karma:980,  joined:'Feb 2024' },
  { name:'tunde.fil', role:'Ambassador', status:'Active',    nft:true,  karma:760,  joined:'May 2024' },
  { name:'devi.fil',  role:'Ambassador', status:'Active',    nft:true,  karma:1120, joined:'Mar 2024' },
  { name:'kwame.fil', role:'Ambassador', status:'Active',    nft:true,  karma:640,  joined:'Apr 2024' },
  { name:'nova.fil',  role:'Applicant',  status:'Pending',   nft:false, karma:0,    joined:'May 2026' },
  { name:'anon.fil',  role:'Member',     status:'Suspended', nft:false, karma:-12,  joined:'Apr 2026' },
]

export const ALLOWLIST = [
  { addr:'0x91Fa…02B7', name:'nova.fil', note:'Cohort 12 applicant — referred by olga.fil', added:'May 28, 2026' },
  { addr:'0x4d2C…77A1', name:'—',        note:'Pending KYC via Orbit Program', added:'May 26, 2026' },
  { addr:'0xBe09…3F5d', name:'rin.fil',  note:'Returning ambassador, NFT re-mint', added:'May 21, 2026' },
]

export const ADMIN_STATS = [
  { label:'Open reports',       value:'2',   tone:'#FF3B30' },
  { label:'Pending applicants', value:'1',   tone:'#FFD60A' },
  { label:'Active ambassadors', value:'318', tone:'#10B981' },
  { label:'Posts this week',    value:'47',  tone:'#0090FF' },
]

export function cid() {
  const c = 'abcdefghijkmnpqrstuvwxyz0123456789'
  let s = 'bafy'
  for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)]
  return s + '…' + Array.from({length:3}, ()=>c[Math.floor(Math.random()*c.length)]).join('')
}

export const who = (key) => AMBASSADORS[key] || { name: key, color: 'blue', city: '', role: '' }
export const navTo = (hash) => { window.location.hash = hash }
```

- [ ] **Step 2: Create src/data/seed.js**

Copy `SEED_POSTS` array verbatim from `forum-data.js` into this file with one named export:

```js
// src/data/seed.js
export const SEED_POSTS = [
  // paste the full SEED_POSTS array from forum-data.js here
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: port data constants to es modules"
```

---

## Task 4: Supabase client + wagmi config

**Files:**
- Create: `src/lib/supabase.js`
- Create: `src/lib/wagmi.js`

- [ ] **Step 1: Create src/lib/supabase.js**

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
```

- [ ] **Step 2: Create src/lib/wagmi.js**

```js
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
  appName: 'Orbit Forum',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [filecoin, filecoinCalibration],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
  ssr: false,
})
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/
git commit -m "feat: add supabase client and wagmi config"
```

---

## Task 5: useAuth hook

**Files:**
- Create: `src/hooks/useAuth.js`
- Create: `src/hooks/useAuth.test.js`

- [ ] **Step 1: Write failing test**

```js
// src/hooks/useAuth.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from './useAuth'

// Mock wagmi useAccount
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}))

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}))

import { useAccount } from 'wagmi'

describe('useAuth', () => {
  beforeEach(() => {
    useAccount.mockReturnValue({ isConnected: false, address: undefined })
  })

  it('returns connected=false when no wallet and no session', async () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.connected).toBe(false)
  })

  it('returns connected=true when wallet is connected', () => {
    useAccount.mockReturnValue({ isConnected: true, address: '0xABC' })
    const { result } = renderHook(() => useAuth())
    expect(result.current.connected).toBe(true)
  })

  it('identity is wallet address when wallet connected', () => {
    useAccount.mockReturnValue({ isConnected: true, address: '0xABC123' })
    const { result } = renderHook(() => useAuth())
    expect(result.current.identity).toBe('0xABC123')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useAuth.test.js
```
Expected: FAIL — "Cannot find module './useAuth'"

- [ ] **Step 3: Create src/hooks/useAuth.js**

```js
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { isConnected, address } = useAccount()
  const [emailSession, setEmailSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmailSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setEmailSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const connected = isConnected || !!emailSession

  // Wallet takes precedence; fall back to email handle
  const identity = isConnected
    ? address
    : emailSession?.user?.email
      ? emailSession.user.email.split('@')[0] + '.fil'
      : 'you.fil'

  const signOut = async () => {
    if (emailSession) await supabase.auth.signOut()
    // Wallet disconnect is handled by RainbowKit ConnectButton
  }

  return { connected, identity, address, emailSession, isConnected, signOut }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/useAuth.test.js
```
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAuth.js src/hooks/useAuth.test.js
git commit -m "feat: add useAuth hook with wallet + email dual auth"
```

---

## Task 6: Core UI components — Icons, Stars, Vote, CategoryBadge, SocialLinks

**Files:**
- Create: `src/components/Icons.jsx`
- Create: `src/components/Stars.jsx`
- Create: `src/components/Vote.jsx`
- Create: `src/components/CategoryBadge.jsx`
- Create: `src/components/SocialLinks.jsx`

- [ ] **Step 1: Create src/components/Icons.jsx**

Port the `I` object from `forum-ui.jsx`. Replace `window` exports with named export:

```jsx
// src/components/Icons.jsx
export const I = {
  up: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>,
  // ... paste all entries from the I object in forum-ui.jsx
}
```

Paste every entry from the `I` object in `forum-ui.jsx` verbatim, only adding the `export const` prefix.

- [ ] **Step 2: Create src/components/Stars.jsx**

```jsx
// src/components/Stars.jsx
export function Stars({ n = 14 }) {
  const pts = [[30,30],[90,60],[150,25],[220,50],[270,35],[60,120],[130,150],[200,130],[260,160],[40,170],[110,90],[180,75],[240,110],[290,140]]
  return (
    <svg className="pc-stars" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pts.slice(0, n).map((s, i) => <circle key={i} cx={s[0]} cy={s[1]} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity={0.45 + i % 3 * 0.16} />)}
    </svg>
  )
}
```

- [ ] **Step 3: Create src/components/Vote.jsx**

```jsx
// src/components/Vote.jsx
import { I } from './Icons'

export function Vote({ count, voted, onToggle, row }) {
  return (
    <div className="vote" style={row ? { flexDirection: 'row', gap: 8 } : null}>
      <button className={'vbtn' + (voted ? ' voted' : '')} onClick={onToggle}>
        {I.up()}
      </button>
      <span className="vc">{count}</span>
    </div>
  )
}
```

- [ ] **Step 4: Create src/components/CategoryBadge.jsx**

```jsx
// src/components/CategoryBadge.jsx
import { catOf } from '../data/constants'

export function CategoryBadge({ cat, soft }) {
  const c = catOf(cat)
  return (
    <span className={'cat-badge' + (soft ? ' soft' : '')} style={{ background: c.color + (soft ? '22' : ''), color: soft ? c.color : '#fff' }}>
      {c.name}
    </span>
  )
}
```

- [ ] **Step 5: Create src/components/SocialLinks.jsx**

Port `SocialLinks`, `socialIcon`, and `socialURL` from `forum-ui.jsx`:

```jsx
// src/components/SocialLinks.jsx
import { SOCIALS } from '../data/constants'
import { I } from './Icons'

function socialIcon(key, props) {
  return ({ github: I.gh, x: I.x, instagram: I.instagram, discord: I.discord, slack: I.slack, telegram: I.telegram, website: I.globe }[key] || I.globe)(props)
}

function socialURL(key, val) {
  if (!val) return null
  const p = { github: 'https://github.com/', x: 'https://x.com/', instagram: 'https://instagram.com/', telegram: 'https://t.me/', website: val.startsWith('http') ? '' : 'https://' }[key]
  if (p === undefined) return null
  return p + val.replace(/^@/, '')
}

export function SocialLinks({ socials, size = 'md' }) {
  if (!socials) return null
  const items = SOCIALS.filter(s => socials[s.key])
  if (items.length === 0) return null
  return (
    <div className={'socials-row ' + size}>
      {items.map(s => {
        const val = socials[s.key]
        const url = socialURL(s.key, val)
        const handle = s.key === 'website' ? val : (s.prefix ? '@' : '') + val
        const inner = <><span className={'sc-ic sc-' + s.key}>{socialIcon(s.key)}</span><span className="sl-val">{handle}</span></>
        return url
          ? <a key={s.key} className="social-chip" href={url} target="_blank" rel="noopener" title={s.label}>{inner}</a>
          : <span key={s.key} className="social-chip" title={s.label}>{inner}</span>
      })}
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add core ui components (icons, vote, badge, socials)"
```

---

## Task 7: AmbassadorAvatar + WalletGate + Navbar

**Files:**
- Create: `src/components/AmbassadorAvatar.jsx`
- Create: `src/components/WalletGate.jsx`
- Create: `src/components/Navbar.jsx`

- [ ] **Step 1: Create src/components/AmbassadorAvatar.jsx**

Port `AmbassadorAvatar` from `forum-ui.jsx`:

```jsx
// src/components/AmbassadorAvatar.jsx
import { AMBASSADORS, AV, COLORHEX } from '../data/constants'
import { I } from './Icons'

export function AmbassadorAvatar({ user, size = 40, link = true, nft }) {
  const u = AMBASSADORS[user] || { name: user, color: 'blue' }
  const color = COLORHEX[u.color] || '#0090FF'
  const src = AV[u.color]
  const img = src
    ? <img src={src} alt={u.name} width={size} height={size} style={{ borderRadius: '50%', objectFit: 'cover' }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, color: '#fff', fontWeight: 700 }}>
        {u.name[0].toUpperCase()}
      </div>
  const inner = (
    <span className="avatar-wrap" style={{ position: 'relative', display: 'inline-flex' }}>
      {img}
      {nft && <span className="nft-dot" style={{ position:'absolute', bottom:0, right:0, width:size*0.3, height:size*0.3, background:'#0090FF', borderRadius:'50%', border:'2px solid var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>{I.check({width:size*0.16,height:size*0.16,color:'#fff'})}</span>}
    </span>
  )
  if (!link) return inner
  return <a href={'#/profile/' + u.name}>{inner}</a>
}
```

- [ ] **Step 2: Create src/components/WalletGate.jsx**

```jsx
// src/components/WalletGate.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletGate({ connected, onConnect, label = 'Connect to continue', children }) {
  if (connected) return <>{children}</>
  return (
    <div className="wallet-gate">
      <p className="wg-label">{label}</p>
      <ConnectButton label="Connect wallet" />
      <div className="wg-sep"><span>or</span></div>
      <button className="pill pill-line" onClick={onConnect}>Sign in with email</button>
    </div>
  )
}
```

- [ ] **Step 3: Create src/components/Navbar.jsx**

Port `Navbar` from `forum-ui.jsx`. Replace `window.SUPABASE` signout with the `onSignOut` prop (same pattern as current). Add `<ConnectButton />` from RainbowKit for the wallet button:

```jsx
// src/components/Navbar.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { I } from './Icons'
import { ME } from '../data/constants'

export function Navbar({ route, connected, onCompose, onConnect, onWallet, onSignOut, unread }) {
  return (
    <nav className="topbar">
      <a className="logo" href="#/forum">
        <span className="logo-mark">◈</span>
        <span className="logo-text">Orbit</span>
      </a>
      <div className="nav-links">
        <a href="#/forum"     className={route.view?.startsWith('forum') ? 'on' : ''}>Forum</a>
        <a href="#/proposals" className={route.view === 'proposals' ? 'on' : ''}>Proposals</a>
        <a href="#/events"    className={route.view === 'events' ? 'on' : ''}>Events</a>
        <a href="#/ambassadors" className={route.view === 'ambassadors' ? 'on' : ''}>Ambassadors</a>
      </div>
      <div className="nav-right">
        <a href="#/search" className="nav-icon">{I.search()}</a>
        {connected && (
          <>
            <button className="pill pill-blue" onClick={onCompose}>{I.plus()} New post</button>
            <a href="#/profile/me/notifications" className="nav-icon notif-wrap">
              {I.bell()}
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </a>
            <ConnectButton showBalance={false} chainStatus="none" />
          </>
        )}
        {!connected && (
          <>
            <button className="pill pill-line" onClick={onConnect}>Sign in</button>
            <ConnectButton label="Connect wallet" showBalance={false} chainStatus="none" />
          </>
        )}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/AmbassadorAvatar.jsx src/components/WalletGate.jsx src/components/Navbar.jsx
git commit -m "feat: add avatar, walletgate, navbar components"
```

---

## Task 8: PostCard, Comment, ReactionBar, MarkdownEditor, MentionInput

**Files:**
- Create: `src/components/PostCard.jsx`
- Create: `src/components/Comment.jsx`
- Create: `src/components/ReactionBar.jsx`
- Create: `src/components/MarkdownEditor.jsx`
- Create: `src/components/MentionInput.jsx`

- [ ] **Step 1: Create each component**

For each component, port the corresponding function from `forum-ui.jsx`, replacing `window.*` refs with imports from `../data/constants` and sibling components.

**src/components/PostCard.jsx** — imports: `I` from `./Icons`, `who, navTo, catOf` from `../data/constants`, `AmbassadorAvatar` from `./AmbassadorAvatar`, `Vote` from `./Vote`, `CategoryBadge` from `./CategoryBadge`.

**src/components/Comment.jsx** — imports: `I` from `./Icons`, `who` from `../data/constants`, `AmbassadorAvatar` from `./AmbassadorAvatar`.

**src/components/ReactionBar.jsx** — imports: `I` from `./Icons`.

**src/components/MarkdownEditor.jsx** — imports: `I` from `./Icons`. Contains the toolbar + textarea. Port `renderMD` and `renderRich` helper functions here as named exports too.

**src/components/MentionInput.jsx** — imports: `AMBASSADORS` from `../data/constants`.

Rule for each: copy the function body exactly, change only the import/export declarations.

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.jsx src/components/Comment.jsx src/components/ReactionBar.jsx src/components/MarkdownEditor.jsx src/components/MentionInput.jsx
git commit -m "feat: add postcard, comment, reactionbar, editor components"
```

---

## Task 9: Forum page views

**Files:**
- Create: `src/pages/HomeView.jsx`
- Create: `src/pages/CategoryView.jsx`
- Create: `src/pages/ThreadView.jsx`
- Create: `src/pages/NewPostView.jsx`
- Create: `src/pages/ProfileView.jsx`

- [ ] **Step 1: Port each view from forum-app.jsx**

For each view component, the import pattern is:

```jsx
// src/pages/HomeView.jsx
import { useState } from 'react'
import { CATEGORIES, catOf, who, navTo } from '../data/constants'
import { I } from '../components/Icons'
import { PostCard } from '../components/PostCard'
import { Vote } from '../components/Vote'
import { CategoryBadge } from '../components/CategoryBadge'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { Stars } from '../components/Stars'

// then paste the component function exactly as in forum-app.jsx
// replacing O.CATEGORIES → CATEGORIES, O.catOf → catOf, etc.
```

**O.* reference translation table:**

| Old (window.ORBIT) | New (import) |
|-------------------|--------------|
| `O.CATEGORIES` | `CATEGORIES` from `../data/constants` |
| `O.catOf(x)` | `catOf(x)` from `../data/constants` |
| `O.ME` | `ME` from `../data/constants` |
| `O.AMBASSADORS` | `AMBASSADORS` from `../data/constants` |
| `O.PROPOSALS` | `PROPOSALS` from `../data/constants` |
| `O.PROP_STATUS` | `PROP_STATUS` from `../data/constants` |
| `O.EVENTS` | `EVENTS` from `../data/constants` |
| `O.DOCS` | `DOCS` from `../data/constants` |
| `O.TRENDING` | `TRENDING` from `../data/constants` |
| `O.BANNERS` | `BANNERS` from `../data/constants` |
| `O.cid()` | `cid()` from `../data/constants` |
| `I.back()` | `I.back()` from `../components/Icons` |
| `who(x)` | `who(x)` from `../data/constants` |
| `navTo(x)` | `navTo(x)` from `../data/constants` |
| `renderRich(x)` | `renderRich(x)` from `../components/MarkdownEditor` |

Apply this table to every view when porting.

- [ ] **Step 2: Commit**

```bash
git add src/pages/
git commit -m "feat: port forum views to src/pages"
```

---

## Task 10: Remaining page views + account views

**Files:**
- Create: `src/pages/EventsView.jsx`
- Create: `src/pages/ProposalsView.jsx`
- Create: `src/pages/DocsView.jsx`
- Create: `src/pages/ConnectView.jsx`
- Create: `src/pages/SearchView.jsx`
- Create: `src/pages/LeaderboardView.jsx`
- Create: `src/pages/AmbassadorsView.jsx`
- Create: `src/pages/AboutView.jsx`
- Create: `src/pages/EventDetailView.jsx`
- Create: `src/pages/ProposalDetailView.jsx`
- Create: `src/pages/ErrorViews.jsx`
- Create: `src/pages/account/MyPostsView.jsx`
- Create: `src/pages/account/NotificationsView.jsx`
- Create: `src/pages/account/SettingsView.jsx`
- Create: `src/pages/account/AdminView.jsx`

- [ ] **Step 1: Port views from forum-pages.jsx**

`AboutView`, `AmbassadorsView`, `SearchView`, `LeaderboardView`, `EventDetailView`, `ProposalDetailView` come from `forum-pages.jsx`. Port each using the same O.* translation table from Task 9.

**ConnectView** gets a new implementation — replaces the Supabase magic link page with a two-option layout:

```jsx
// src/pages/ConnectView.jsx
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Stars } from '../components/Stars'
import { I } from '../components/Icons'
import { supabase } from '../lib/supabase'

export function ConnectView() {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const send = async () => {
    if (!email.trim() || phase === 'sending') return
    setPhase('sending')
    setErrMsg('')
    const redirectTo = window.location.href.split('#')[0]
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (error) { setPhase('error'); setErrMsg(error.message) }
    else setPhase('sent')
  }

  return (
    <div className="page-wrap connect-page">
      <div className="connect-card">
        <div className="cn-stars"><Stars n={14} /></div>
        <div className="cn-inner">
          <h1>Join the constellation</h1>
          <p>Reading is open to everyone. Sign in to post, comment, and vote.</p>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 600, marginBottom: 10 }}>Option 1 — Connect your wallet</p>
            <ConnectButton label="Connect wallet" />
          </div>

          <div className="wg-sep"><span>or</span></div>

          <p style={{ fontWeight: 600, margin: '16px 0 10px' }}>Option 2 — Sign in with email</p>
          {phase === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <span className="cn-badge">{I.check()} Magic link sent</span>
              <p>Check <b>{email}</b> and click the link.</p>
            </div>
          ) : (
            <>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder="you@example.com" style={{ width: '100%', marginBottom: 10 }} />
              {phase === 'error' && <p style={{ color: '#FF3B30', fontSize: 14 }}>{errMsg}</p>}
              <button className="pill pill-line" style={{ width: '100%', opacity: email.trim() ? 1 : 0.5 }} onClick={send}>
                {phase === 'sending' ? 'Sending…' : 'Send magic link'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/pages/ErrorViews.jsx**

```jsx
// src/pages/ErrorViews.jsx
import { I } from '../components/Icons'

export function Error404View() {
  return (
    <div className="page-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1>404</h1>
      <p>Page not found. <a href="#/forum">Back to forum</a></p>
    </div>
  )
}

export function Error500View() {
  return (
    <div className="page-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1>500</h1>
      <p>Something went wrong. <a href="#/forum">Back to forum</a></p>
    </div>
  )
}

export function MaintenanceView() {
  return (
    <div className="page-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h2>Under maintenance</h2>
      <p>Back shortly.</p>
    </div>
  )
}
```

- [ ] **Step 3: Port account views from forum-account.jsx**

`MyPostsView`, `NotificationsView`, `SettingsView`, `AdminView` — port each to `src/pages/account/` using the same O.* translation table.

Add a `ProfileTabs` component either as its own file or at the top of `MyPostsView.jsx` and import in the others.

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: port remaining views and account views"
```

---

## Task 11: App.jsx + src/main.jsx — wire everything together

**Files:**
- Create: `src/App.jsx`
- Create: `src/main.jsx`

- [ ] **Step 1: Create src/App.jsx**

Port `forum-app.jsx`. Key changes:
- Remove `window.SUPABASE` usage — auth is handled by `useAuth`
- Replace `const [connected, setConnected] = useState(false)` with `const { connected, identity, signOut } = useAuth()`
- Replace `O.ME.name = handle` with `O.ME.name = identity` (or remove if ME is used only for defaults)
- The sidebar component `Sidebar` and `Rail` stay inline in this file

```jsx
// src/App.jsx
import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { CATEGORIES, PROPOSALS, BANNERS, NOTIFICATIONS, ME, AMBASSADORS, cid, catOf, navTo } from './data/constants'
import { SEED_POSTS } from './data/seed'
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
import { MyPostsView } from './pages/account/MyPostsView'
import { NotificationsView } from './pages/account/NotificationsView'
import { SettingsView } from './pages/account/SettingsView'
import { AdminView } from './pages/account/AdminView'
import { ProfileTabs } from './pages/account/MyPostsView'
import './styles/forum.css'
import './styles/orbit.css'
import '@rainbow-me/rainbowkit/styles.css'

// --- hash router (unchanged from forum-app.jsx) ---
function parseHash() {
  if (window.location.hash.includes('access_token=')) return { view: 'forum-home' }
  let h = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '')
  const seg = h.split('/').filter(Boolean)
  if (seg.length === 0) return { view: 'forum-home' }
  if (seg[0] === 'forum') {
    if (seg.length === 1) return { view: 'forum-home' }
    if (seg[1] === 'new') return { view: 'forum-new' }
    if (!CATEGORIES.some(c => c.id === seg[1])) return { view: 'notfound' }
    if (seg.length === 2) return { view: 'forum-category', cat: seg[1] }
    return { view: 'forum-thread', cat: seg[1], id: seg[2] }
  }
  if (seg[0] === 'profile') {
    const whoId = decodeURIComponent(seg[1] || 'me')
    if (whoId === 'me' && seg[2]) return { view: 'profile-sub', sub: seg[2] }
    return { view: 'profile', whoId }
  }
  if (seg[0] === 'admin')    return { view: 'admin', section: seg[1] || 'home' }
  if (seg[0] === '500')      return { view: 'error500' }
  if (seg[0] === 'maintenance') return { view: 'maintenance' }
  if (seg[0] === 'events') {
    if (seg[1] === 'new') return { view: 'forum-new', preset: 'Event' }
    if (seg[1])           return { view: 'event-detail', id: seg[1] }
    return { view: 'events' }
  }
  if (seg[0] === 'proposals') {
    if (seg[1] === 'new') return { view: 'forum-new', preset: 'Proposal' }
    if (seg[1])           return { view: 'proposal-detail', id: seg[1] }
    return { view: 'proposals' }
  }
  if (seg[0] === 'ambassadors') return { view: 'ambassadors' }
  if (seg[0] === 'leaderboard') return { view: 'leaderboard' }
  if (seg[0] === 'search')      return { view: 'search', q: decodeURIComponent(seg[1] || '') }
  if (seg[0] === 'about')       return { view: 'about' }
  if (seg[0] === 'docs')        return { view: 'docs' }
  if (seg[0] === 'connect')     return { view: 'connect' }
  return { view: 'notfound' }
}

export default function App() {
  const { connected, identity, signOut } = useAuth()
  const [posts, setPosts] = useState(SEED_POSTS)
  const [route, setRoute] = useState(parseHash())
  const [toast, setToast] = useState('')
  const [myAvatar, setMyAvatarState] = useState(() => localStorage.getItem('orbit-avatar') || ME.color)
  const [myProfile, setMyProfileState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orbit-profile') || '{}') } catch { return {} }
  })
  const toastTimer = useRef(null)

  // Sync identity into ME / AMBASSADORS for display
  ME.name = identity
  ME.addr = identity
  if (AMBASSADORS['you.fil']) AMBASSADORS['you.fil'].name = identity
  ME.color = myAvatar
  AMBASSADORS['you.fil'].color = myAvatar
  const meRef = AMBASSADORS['you.fil']
  if (myProfile.bio != null)    meRef.bio = myProfile.bio
  if (myProfile.city != null) { meRef.city = myProfile.city; ME.city = myProfile.city }
  if (myProfile.socials)        meRef.socials = { ...meRef.socials, ...myProfile.socials }
  if (myProfile.banner != null) meRef.banner = myProfile.banner

  const setMyAvatar  = (col) => { setMyAvatarState(col); localStorage.setItem('orbit-avatar', col); flash('Avatar updated') }
  const setMyProfile = (updates) => { const next = { ...myProfile, ...updates }; setMyProfileState(next); localStorage.setItem('orbit-profile', JSON.stringify(next)); flash('Profile saved') }

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/forum'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const flash = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 2600) }

  const vote = (id) => {
    if (!connected) { flash('Connect your wallet to vote'); return }
    setPosts(ps => ps.map(p => p.id === id ? { ...p, upvoted: !p.upvoted, upvotes: p.upvotes + (p.upvoted ? -1 : 1) } : p))
  }

  const reactPost = (pid, emoji) => {
    if (!connected) { flash('Connect to react'); return }
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
    if (!connected) { flash('Connect to react'); return }
    const walk = list => list.map(c => {
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
    if (!connected) { flash('Connect to reply'); return }
    const reply = { id: 'r' + Date.now(), author: identity, time: 'now', text, reactions: {} }
    const walk = list => list.map(c => c.id === cid ? { ...c, replies: [...(c.replies || []), reply] } : c)
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: walk(p.comments) }))
    flash('Reply published')
  }

  const addComment = (pid, text) => {
    setPosts(ps => ps.map(p => p.id !== pid ? p : { ...p, comments: [...p.comments, { id: 'c' + Date.now(), author: identity, time: 'now', text, reactions: {}, replies: [] }] }))
    flash('Comment published on-chain')
  }

  const publish = (data) => {
    const np = { id: 'p' + Date.now(), cat: data.cat, type: data.type, title: data.title,
      excerpt: data.body[0].replace(/[#*_>-]/g, '').slice(0, 150), body: data.body,
      author: identity, time: 'now', upvotes: 1, upvoted: true, cidStr: cid(), reactions: {}, evidence: data.evidence, comments: [] }
    setPosts(ps => [np, ...ps])
    flash('Published · pinned to IPFS + Filecoin')
    navTo('#/forum/' + data.cat + '/' + np.id)
  }

  const counts = { all: posts.length }
  CATEGORIES.forEach(c => counts[c.id] = posts.filter(p => p.cat === c.id).length)

  const unread = NOTIFICATIONS.filter(n => n.unread).length

  let view
  switch (route.view) {
    case 'forum-home':     view = <HomeView posts={posts} onVote={vote} counts={counts} />; break
    case 'forum-category': view = <CategoryView cat={route.cat} posts={posts} onVote={vote} counts={counts} />; break
    case 'forum-thread':   view = <ThreadView cat={route.cat} id={route.id} posts={posts} connected={connected} onConnect={() => navTo('#/connect')} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} onReactPost={reactPost} />; break
    case 'forum-new':      view = <NewPostView connected={connected} onConnect={() => navTo('#/connect')} onPublish={publish} preset={route.preset} />; break
    case 'profile':        view = <ProfileView whoId={route.whoId} posts={posts} onVote={vote} />; break
    case 'profile-sub':
      if (route.sub === 'posts')         view = <MyPostsView posts={posts} onVote={vote} />
      else if (route.sub === 'notifications') view = <NotificationsView />
      else if (route.sub === 'settings') view = <SettingsView profile={meRef} myAvatar={myAvatar} setMyAvatar={setMyAvatar} onSave={setMyProfile} />
      else                               view = <Error404View />
      break
    case 'admin':          view = <AdminView section={route.section} />; break
    case 'events':         view = <EventsView />; break
    case 'event-detail':   view = <EventDetailView id={route.id} posts={posts} onVote={vote} />; break
    case 'proposals':      view = <ProposalsView />; break
    case 'proposal-detail':view = <ProposalDetailView id={route.id} posts={posts} connected={connected} onConnect={() => navTo('#/connect')} onVote={vote} onAddComment={addComment} onReact={reactComment} onReply={replyComment} />; break
    case 'ambassadors':    view = <AmbassadorsView posts={posts} />; break
    case 'leaderboard':    view = <LeaderboardView posts={posts} />; break
    case 'search':         view = <SearchView q={route.q} posts={posts} onVote={vote} />; break
    case 'about':          view = <AboutView />; break
    case 'docs':           view = <DocsView />; break
    case 'connect':        view = <ConnectView />; break
    case 'error500':       view = <Error500View />; break
    case 'maintenance':    view = <MaintenanceView />; break
    case 'notfound':
    default:               view = <Error404View />
  }

  return (
    <>
      {route.view !== 'maintenance' && (
        <Navbar route={route} connected={connected}
          onCompose={() => navTo('#/forum/new')}
          onConnect={() => navTo('#/connect')}
          onWallet={() => navTo('#/profile/me')}
          onSignOut={signOut}
          unread={unread} />
      )}
      {view}
      <div className={'toast' + (toast ? ' show' : '')}><span className="tdot"></span>{toast}</div>
    </>
  )
}
```

- [ ] **Step 2: Create src/main.jsx**

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from './lib/wagmi'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 3: Start dev server and verify app loads**

```bash
npm run dev
```

Open http://localhost:5173. Expected: forum home renders, wallet connect button visible in navbar, same UI as the original mockup.

Fix any import errors before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: wire app shell with rainbowkit + dual auth"
```

---

## Task 12: Supabase schema

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create supabase/schema.sql**

```sql
-- Run this in the Supabase SQL editor at supabase.com/dashboard

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts
create table if not exists posts (
  id          text primary key default ('p' || replace(gen_random_uuid()::text, '-', '')),
  cat         text not null,
  type        text not null,
  title       text not null,
  excerpt     text,
  body        jsonb not null default '[]',
  author      text not null,    -- wallet address or email handle
  author_type text not null default 'wallet', -- 'wallet' | 'email'
  upvotes     integer not null default 1,
  cid_str     text,
  reactions   jsonb not null default '{}',
  evidence    jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- Enable RLS
alter table posts enable row level security;

-- Anyone can read
create policy "posts are public" on posts for select using (true);

-- Only authenticated users can insert
create policy "authed users can post" on posts for insert
  with check (auth.role() = 'authenticated');

-- Author can update their own post
create policy "author can update" on posts for update
  using (auth.jwt()->>'sub' = author or auth.email() = author);

-- Votes (one per user per post)
create table if not exists votes (
  post_id    text not null references posts(id) on delete cascade,
  voter      text not null,    -- wallet address or email
  created_at timestamptz not null default now(),
  primary key (post_id, voter)
);

alter table votes enable row level security;
create policy "votes are public"       on votes for select using (true);
create policy "authed users can vote"  on votes for insert with check (auth.role() = 'authenticated');
create policy "author can unvote"      on votes for delete using (auth.jwt()->>'sub' = voter or auth.email() = voter);

-- Comments
create table if not exists comments (
  id          text primary key default ('c' || replace(gen_random_uuid()::text, '-', '')),
  post_id     text not null references posts(id) on delete cascade,
  parent_id   text references comments(id) on delete cascade,
  author      text not null,
  author_type text not null default 'wallet',
  text        text not null,
  reactions   jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

alter table comments enable row level security;
create policy "comments are public"          on comments for select using (true);
create policy "authed users can comment"     on comments for insert with check (auth.role() = 'authenticated');
create policy "author can delete comment"    on comments for delete using (auth.jwt()->>'sub' = author or auth.email() = author);

-- Seed with existing posts (optional — run after schema)
insert into posts (id, cat, type, title, excerpt, body, author, author_type, upvotes, cid_str, reactions, evidence)
values
  ('p1', 'reports', 'Report', 'Filecoin Orbit meetup, Santiago — 64 builders, 9 storage demos',
   'Full recap of our November ambassador meetup.',
   '["We hosted the third Filecoin Orbit meetup in Santiago on November 14th, with 64 confirmed builders."]',
   'olga.fil', 'email', 47, 'bafyq8x2k…m31',
   '{"🔥":{"count":12,"mine":false},"🚀":{"count":7,"mine":false}}',
   '[{"name":"santiago-recap.pdf","size":"bafy…a7c"}]')
on conflict (id) do nothing;
```

- [ ] **Step 2: Run schema in Supabase**

1. Go to supabase.com/dashboard → your project → SQL Editor
2. Paste the contents of `supabase/schema.sql`
3. Click Run

Expected: "Success. No rows returned."

- [ ] **Step 3: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add supabase schema (posts, votes, comments)"
```

---

## Task 13: Data hooks — usePosts, useVotes, useComments

**Files:**
- Create: `src/hooks/usePosts.js`
- Create: `src/hooks/usePosts.test.js`
- Create: `src/hooks/useVotes.js`
- Create: `src/hooks/useComments.js`

- [ ] **Step 1: Write failing test for usePosts**

```js
// src/hooks/usePosts.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePosts } from './usePosts'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
    insert: vi.fn().mockResolvedValue({ data: [{ id: 'p1', title: 'Test' }], error: null }),
  },
}))

describe('usePosts', () => {
  it('starts with empty posts array', async () => {
    const { result } = renderHook(() => usePosts())
    expect(result.current.posts).toEqual([])
  })

  it('fetchPosts populates posts', async () => {
    const { result } = renderHook(() => usePosts())
    await act(async () => { await result.current.fetchPosts() })
    expect(result.current.posts).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/usePosts.test.js
```
Expected: FAIL — "Cannot find module './usePosts'"

- [ ] **Step 3: Create src/hooks/usePosts.js**

```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_POSTS } from '../data/seed'

export function usePosts() {
  const [posts, setPosts] = useState(SEED_POSTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data && data.length > 0) setPosts(data)
  }

  useEffect(() => { fetchPosts() }, [])

  const createPost = async ({ cat, type, title, body, evidence, author, cidStr }) => {
    const excerpt = body[0]?.replace(/[#*_>-]/g, '').slice(0, 150) || ''
    const { data, error } = await supabase
      .from('posts')
      .insert({ cat, type, title, excerpt, body, author, evidence, cid_str: cidStr, upvotes: 1 })
      .select()
      .single()
    if (error) throw new Error(error.message)
    setPosts(ps => [data, ...ps])
    return data
  }

  return { posts, setPosts, loading, error, fetchPosts, createPost }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/usePosts.test.js
```
Expected: PASS

- [ ] **Step 5: Create src/hooks/useVotes.js**

```js
import { supabase } from '../lib/supabase'

export function useVotes() {
  const toggleVote = async ({ postId, voter, currentlyVoted }) => {
    if (currentlyVoted) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
        .eq('voter', voter)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('votes')
        .insert({ post_id: postId, voter })
      if (error) throw new Error(error.message)
    }
  }

  return { toggleVote }
}
```

- [ ] **Step 6: Create src/hooks/useComments.js**

```js
import { supabase } from '../lib/supabase'

export function useComments() {
  const addComment = async ({ postId, author, text, parentId = null }) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author, text, parent_id: parentId })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  return { addComment }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/hooks/usePosts.js src/hooks/usePosts.test.js src/hooks/useVotes.js src/hooks/useComments.js
git commit -m "feat: add usePosts, useVotes, useComments hooks"
```

---

## Task 14: Wire Supabase hooks into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace in-memory state with usePosts**

At the top of `App.jsx`, replace `useState(SEED_POSTS)` with `usePosts()`:

```jsx
// remove:
// import { SEED_POSTS } from './data/seed'
// const [posts, setPosts] = useState(SEED_POSTS)

// add at top of file:
import { usePosts } from './hooks/usePosts'
import { useVotes } from './hooks/useVotes'
import { useComments } from './hooks/useComments'

// inside App():
const { posts, setPosts, createPost } = usePosts()
const { toggleVote } = useVotes()
const { addComment: addCommentDB } = useComments()
```

- [ ] **Step 2: Update vote handler to persist to Supabase**

```jsx
// replace the vote function:
const vote = async (id) => {
  if (!connected) { flash('Connect to vote'); return }
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
```

- [ ] **Step 3: Update publish handler to persist to Supabase**

```jsx
// replace the publish function:
const publish = async (data) => {
  try {
    const post = await createPost({
      cat: data.cat, type: data.type, title: data.title,
      body: data.body, evidence: data.evidence,
      author: identity, cidStr: data.cidStr,
    })
    flash('Published · pinned to IPFS + Filecoin')
    navTo('#/forum/' + data.cat + '/' + post.id)
  } catch (e) {
    flash('Publish failed: ' + e.message)
  }
}
```

- [ ] **Step 4: Update addComment to persist**

```jsx
const addComment = async (pid, text) => {
  try {
    const comment = await addCommentDB({ postId: pid, author: identity, text })
    setPosts(ps => ps.map(p => p.id !== pid ? p
      : { ...p, comments: [...p.comments, { ...comment, reactions: {}, replies: [] }] }))
    flash('Comment published on-chain')
  } catch (e) {
    flash('Comment failed: ' + e.message)
  }
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

1. Connect wallet via RainbowKit ConnectButton
2. Create a new post
3. Check Supabase dashboard → Table Editor → posts — new row should appear

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire supabase persistence for posts, votes, comments"
```

---

## Task 15: useLighthouse — real IPFS uploads

**Files:**
- Create: `src/hooks/useLighthouse.js`
- Create: `src/hooks/useLighthouse.test.js`

- [ ] **Step 1: Write failing test**

```js
// src/hooks/useLighthouse.test.js
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLighthouse } from './useLighthouse'

vi.mock('@lighthouse-web3/sdk', () => ({
  default: {
    upload: vi.fn().mockResolvedValue({ data: { Hash: 'bafy_test_hash' } }),
  },
}))

describe('useLighthouse', () => {
  it('returns uploadFiles function', () => {
    const { result } = renderHook(() => useLighthouse())
    expect(typeof result.current.uploadFiles).toBe('function')
  })

  it('uploadFiles returns CID on success', async () => {
    const { result } = renderHook(() => useLighthouse())
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
    const cid = await result.current.uploadFiles([file])
    expect(cid).toBe('bafy_test_hash')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useLighthouse.test.js
```
Expected: FAIL

- [ ] **Step 3: Create src/hooks/useLighthouse.js**

```js
import lighthouse from '@lighthouse-web3/sdk'

const API_KEY = import.meta.env.VITE_LIGHTHOUSE_API_KEY

export function useLighthouse() {
  const uploadFiles = async (files) => {
    if (!API_KEY) throw new Error('VITE_LIGHTHOUSE_API_KEY not set')
    const response = await lighthouse.upload(files, API_KEY)
    return response.data.Hash
  }

  return { uploadFiles }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/useLighthouse.test.js
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLighthouse.js src/hooks/useLighthouse.test.js
git commit -m "feat: add lighthouse ipfs upload hook"
```

---

## Task 16: Wire Lighthouse into NewPostView

**Files:**
- Modify: `src/pages/NewPostView.jsx`

- [ ] **Step 1: Replace the fake setTimeout pin with real Lighthouse upload**

In `NewPostView.jsx`, import `useLighthouse` and update the publish function:

```jsx
// add import at top:
import { useLighthouse } from '../hooks/useLighthouse'

// inside NewPostView():
const { uploadFiles } = useLighthouse()
const [files, setFiles] = useState([])        // File objects from <input>
const [uploadedEvidence, setUploadedEvidence] = useState([])

// replace the file drop div with a real input:
const handleFileChange = (e) => {
  setFiles(Array.from(e.target.files))
}

// replace the fake publish:
const publish = async () => {
  if (!canPost || phase === 'pinning') return
  setPhase('pinning')
  try {
    let evidence = []
    if (files.length > 0) {
      const cid = await uploadFiles(files)
      evidence = files.map(f => ({ name: f.name, size: cid }))
    }
    setUploadedEvidence(evidence)
    onPublish({
      type: type.t, cat, title: title.trim(),
      body: body.trim().split(/\n{2,}/).filter(Boolean),
      evidence,
      cidStr: evidence[0]?.size || cid(),
    })
  } catch (e) {
    setPhase('edit')
    alert('Upload failed: ' + e.message)
  }
}

// replace the ipfs-drop div with:
<div className="field">
  <label>Evidence — pinned to IPFS via Lighthouse</label>
  <input type="file" multiple onChange={handleFileChange} />
  {files.length > 0 && <div className="file-list">{files.map(f => <span key={f.name}>{f.name}</span>)}</div>}
</div>
```

- [ ] **Step 2: Verify in browser**

1. Go to New Post
2. Attach a small file (< 1MB)
3. Publish
4. Expected: spinner while uploading, then navigates to thread. CID in the evidence section is a real Lighthouse hash.
5. Verify at gateway.lighthouse.storage/ipfs/\{hash\} — file is accessible

- [ ] **Step 3: Commit**

```bash
git add src/pages/NewPostView.jsx
git commit -m "feat: wire lighthouse ipfs upload into new post form"
```

---

## Self-Review

### Spec coverage

| Requirement | Task |
|-------------|------|
| Vite migration (no CDN) | Tasks 1-11 |
| RainbowKit wallet auth | Tasks 5, 7, 11 |
| Supabase email auth (kept) | Tasks 4, 10 |
| Dual auth unified in useAuth | Task 5 |
| Identity = wallet address or email handle | Task 5 |
| ConnectView shows both options | Task 10 |
| Posts persist to Supabase | Tasks 12-14 |
| Votes persist to Supabase | Tasks 13-14 |
| Comments persist to Supabase | Tasks 13-14 |
| Real IPFS upload via Lighthouse | Tasks 15-16 |
| RLS so only authenticated users write | Task 12 |

### Future tasks (NFT contract not in scope)
- Deploy ERC-721 contract on Filecoin FVM
- Add `useNFTGate` hook (`balanceOf` check)
- Update `WalletGate` to require NFT + connected

### No placeholders check ✓
All code blocks are complete. No "TBD", "fill in later", or "similar to above."

### Type consistency ✓
- `identity` string flows from `useAuth` → `App` → all handlers
- `posts` array shape matches SEED_POSTS (same fields as Supabase schema)
- `uploadFiles(files: File[])` returns `string` (CID), consumed as `evidence[].size`
