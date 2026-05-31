/* ============================================================
   ORBIT FORUM — seed data + shared helpers
   ============================================================ */

const AV = {
  blue: 'assets/avatar-blue.png',
  red: 'assets/avatar-red.png',
  yellow: 'assets/avatar-yellow.png',
  purple: 'assets/avatar-purple.png',
  green: 'assets/avatar-green.png',
  orange: 'assets/avatar-orange.png',
  brown: 'assets/avatar-brown.png',
  gray: 'assets/avatar-gray.png',
  pink: 'assets/avatar-pink.png',
};
const AVATAR_OPTIONS = ['blue','purple','green','yellow','red','orange','brown','gray','pink'];
const COLORHEX = { blue:'#0090FF', red:'#FF3B30', yellow:'#FFD60A', purple:'#A855F7', green:'#10B981', orange:'#FF9500', brown:'#8B5E3C', gray:'#8A8F98', pink:'#FF2D9B' };

const CATEGORIES = [
  { id: 'reports',       name: 'Reports',        color: '#0090FF', desc: 'Ambassador reports — events, activities, and field work.' },
  { id: 'projects',      name: 'Projects',       color: '#A855F7', desc: 'New project proposals seeking signaling and collaborators.' },
  { id: 'events',        name: 'Events',         color: '#FFD60A', desc: 'Event announcements, calls for facilitators, and recaps.' },
  { id: 'feedback',      name: 'Feedback',       color: '#10B981', desc: 'Open discussion about the ecosystem and the forum itself.' },
  { id: 'announcements', name: 'Announcements',  color: '#FF3B30', desc: 'Official announcements. Moderators post; everyone reads.' },
  { id: 'get-started',   name: 'Get started',    color: '#0072CC', desc: 'Onboarding for new ambassadors — start here.' },
  { id: 'governance',    name: 'Governance',     color: '#7C5CFF', desc: 'Meta-governance — how the forum itself is run.' },
];
const catOf = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];

const ME = { name: 'you.fil', color: 'blue', addr: '0xA3f9…7E21', fulladdr: '0xA3f94C2b8D1e5F7a93C6e0B2d4A8f1C5b6E27E21',
  role: 'Ambassador', city: 'Your node', joined: 'Mar 2025', karma: 340, posts: 12, events: 3 };

function cid() {
  const c = 'abcdefghijkmnpqrstuvwxyz0123456789';
  let s = 'bafy';
  for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)];
  return s + '…' + Array.from({length:3}, ()=>c[Math.floor(Math.random()*c.length)]).join('');
}

const AMBASSADORS = {
  'olga.fil':  { name:'olga.fil',  color:'blue',   addr:'0x7C1a…9F03', role:'Ambassador', city:'Santiago, CL', joined:'Jan 2024', karma:1240, events:7, bio:'Organizing Filecoin meetups across the Southern Cone. Storage-deal evangelist.', socials:{ github:'olga-fil', x:'olgabuilds', discord:'olga#2207', telegram:'olgafil', website:'olga.xyz' } , banner:'green' },
  'mira.fil':  { name:'mira.fil',  color:'purple', addr:'0x2B8e…4D71', role:'Ambassador', city:'Lisbon, PT',   joined:'Feb 2024', karma:980,  events:4, bio:'Building tooling so ambassadors never touch a CLI. IPFS maximalist.', socials:{ github:'mira-codes', x:'mirabuilds', discord:'mira#0041', slack:'mira', telegram:'miradev' } , banner:'purple' },
  'tunde.fil': { name:'tunde.fil', color:'red',    addr:'0x9A3c…1E22', role:'Ambassador', city:'Lagos, NG',    joined:'May 2024', karma:760,  events:6, bio:'Running storage workshops across West Africa. Community first.', socials:{ github:'tunde-ng', x:'tundeonchain', telegram:'tundefil', discord:'tunde#9100' } , banner:'magenta' },
  'devi.fil':  { name:'devi.fil',  color:'green',  addr:'0x4F6d…8B90', role:'Ambassador', city:'Bangalore, IN', joined:'Mar 2024', karma:1120, events:5, bio:'Onboarding obsessive. If the funnel leaks, I will find the hole.', socials:{ github:'devi-fn', x:'devifunnels', discord:'devi#3321', website:'devi.dev' } , banner:'moon' },
  'kwame.fil': { name:'kwame.fil', color:'yellow', addr:'0x6E2a…3C44', role:'Ambassador', city:'Accra, GH',    joined:'Apr 2024', karma:640,  events:3, bio:'Wallet-native identity advocate. Less paperwork, more building.', socials:{ github:'kwame-gh', telegram:'kwamefil', x:'kwameid' } , banner:'gold' },
  'orbit-team.fil': { name:'orbit-team.fil', color:'blue', addr:'0x0001…CORE', role:'Core', city:'Constellation', joined:'Jan 2024', karma:0, events:0, bio:'Core stewards of the Orbit forum. Aligned with the Constellation Program.', socials:{ github:'orbit-forum', x:'orbitforum', discord:'orbit', website:'orbit.gov' } , banner:'asteroid' },
  'you.fil':   { ...ME, bio:'Filecoin Orbit ambassador. This is your public profile.', socials:{ github:'you-fil', x:'youonchain', discord:'you#0001', slack:'', telegram:'youfil', website:'you.xyz' } , banner:'green' },
};

const SEED_POSTS = [
  {
    id: 'p1', cat: 'reports', type: 'Report',
    title: 'Filecoin Orbit meetup, Santiago — 64 builders, 9 storage demos',
    excerpt: 'Full recap of our November ambassador meetup: turnout, the storage-deal live demo, three new project leads, and what we would change next time.',
    body: [
      'We hosted the third Filecoin Orbit meetup in Santiago on November 14th, with 64 confirmed builders and a waitlist of 30+. This was our biggest turnout yet — nearly double the August session.',
      'The highlight was a live storage-deal demo where two attendees pinned a dataset to IPFS and made a Filecoin deal end-to-end in under eight minutes. Seeing it work live, on a projector, did more for conviction than any slide ever has.',
      'Full recording of the demo:',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'The demo repo, if you want to follow along:',
      'https://github.com/filecoin-project/lotus',
      'Three concrete project leads came out of the night, all now drafted as proposals in the Projects category. We also collected 41 pieces of feedback on the onboarding flow — summarized and attached below as evidence. Join the regional chat to coordinate the next one:',
      'https://t.me/filecoinorbit',
    ],
    author: 'olga.fil', time: '6h', upvotes: 47, upvoted: false, cidStr: 'bafyq8x2k…m31',
    reactions: { '🔥':{count:12,mine:false}, '🚀':{count:7,mine:false}, '🎉':{count:4,mine:false} },
    evidence: [{ name: 'santiago-recap.pdf', size: 'bafy…a7c' }, { name: 'feedback-41.csv', size: 'bafy…9d2' }],
    comments: [
      { id:'c1', author:'kwame.fil', time:'4h', text:'64 is huge. What channel drove the most signups — the local university or the Discord push?', reactions:{ '🔥':{count:4,mine:false}, '👀':{count:2,mine:false} }, replies:[
        { id:'r1', author:'olga.fil', time:'4h', text:'Mostly the university list — I will break down the numbers in the recap thread.', reactions:{ '👍':{count:3,mine:false} } },
      ] },
      { id:'c2', author:'olga.fil', time:'3h', text:'University mailing list, easily. Discord brought the diehards but the list brought the volume. Thanks for hosting @kwame.fil — your onboarding sheet was clutch.', reactions:{ '🙌':{count:6,mine:false} }, replies:[] },
    ],
  },
  {
    id: 'p2', cat: 'projects', type: 'Proposal',
    title: 'Proposal: a shared evidence-pinning bot for all ambassador reports',
    excerpt: 'A small service that auto-pins any report attachment to IPFS and opens a Filecoin deal, so ambassadors never touch a CLI. Seeking signaling before I build.',
    body: [
      'Right now every ambassador pins evidence manually, and half of us get it wrong. I propose a small bot — open source, community-run — that takes any attachment dropped into a report and pins it to IPFS, then queues a Filecoin storage deal automatically.',
      'The ask here is signaling, not budget yet. If there is appetite, I will draft a full FIP-style spec with cost estimates and a maintenance plan.',
    ],
    author: 'mira.fil', time: '1d', upvotes: 73, upvoted: true, cidStr: 'bafyz0p4n…k88',
    reactions: { '👍':{count:18,mine:false}, '🙌':{count:9,mine:false} },
    evidence: [{ name: 'pinning-bot-sketch.md', size: 'bafy…3f1' }],
    comments: [
      { id:'c3', author:'devi.fil', time:'20h', text:'Strong +1. I would use this tomorrow. Happy to co-maintain.', reactions:{ '🚀':{count:8,mine:false}, '❤️':{count:3,mine:false} }, replies:[] },
    ],
  },
  {
    id: 'p3', cat: 'events', type: 'Event',
    title: 'Lagos storage workshop — call for two co-facilitators',
    excerpt: 'Planning a hands-on Filecoin storage workshop in Lagos for late January. Venue is locked. Looking for two ambassadors to co-run the deal-making station.',
    body: [
      'Venue and date are set: January 25th, co-working space in Yaba, capacity 80. I need two co-facilitators comfortable walking people through making a storage deal hands-on.',
      'Travel stipend available for facilitators traveling from outside Lagos. Drop a comment if you are in and I will follow up.',
    ],
    author: 'tunde.fil', time: '2d', upvotes: 31, upvoted: false, cidStr: 'bafyk2m9q…x14',
    evidence: [], comments: [],
  },
  {
    id: 'p4', cat: 'feedback', type: 'Feedback',
    title: 'Onboarding asks for a wallet before explaining why — we lose people there',
    excerpt: 'Watched five newcomers bounce at the wallet prompt because nothing told them reading is free. Suggesting a read-only preview before any connect step.',
    body: [
      'At three events now I have watched the same thing: a curious newcomer hits the wallet-connect prompt, assumes the whole forum is gated, and leaves. They never learn that reading is completely open.',
      'Proposal: let visitors browse the full forum read-only, and only surface the connect step the moment they try to post, comment, or vote. Gate the action, not the door.',
    ],
    author: 'devi.fil', time: '3d', upvotes: 58, upvoted: false, cidStr: 'bafyw7t3r…b09',
    evidence: [],
    comments: [
      { id:'c4', author:'olga.fil', time:'2d', text:'This matches exactly what I saw in Santiago. Gate the action, not the door — well put.', reactions:{ '👍':{count:5,mine:false} }, replies:[] },
    ],
  },
  {
    id: 'p5', cat: 'announcements', type: 'Announcement',
    title: 'Orbit now complements Metropolis for FIP signaling',
    excerpt: 'Quick note: ambassador proposals that reach rough consensus here can now be promoted to Metropolis for formal FIP signaling. Details and the bridge inside.',
    body: [
      'As part of aligning with the Constellation Program, proposals in the Projects category that reach rough consensus can now be promoted directly to Metropolis for formal FIP signaling.',
      'This keeps early debate where it belongs — fast, open, and ambassador-driven — while handing the formal vote to the tooling built for it.',
    ],
    author: 'orbit-team.fil', time: '4d', upvotes: 96, upvoted: false, cidStr: 'bafye5h1d…z42',
    evidence: [{ name: 'metropolis-bridge.md', size: 'bafy…c55' }], comments: [],
  },
  {
    id: 'p6', cat: 'get-started', type: 'Guide',
    title: 'New here? Read this first — how Orbit works in 4 minutes',
    excerpt: 'Welcome to the constellation. Here is everything you need to go from connecting your wallet to publishing your first report.',
    body: [
      'Welcome! Orbit is the wallet-gated forum for Filecoin Orbit ambassadors. Reading is open to everyone — you only need to connect a wallet to post, comment, or vote.',
      'Step one: connect your wallet (top right). Step two: hold the Orbit Ambassador NFT to unlock posting. Step three: introduce yourself in Feedback, then file your first report in Reports.',
      'Every post and attachment you publish is pinned to IPFS and persisted on Filecoin — your work outlives any single server.',
    ],
    author: 'orbit-team.fil', time: '1w', upvotes: 134, upvoted: false, cidStr: 'bafyg3s8w…q07',
    evidence: [{ name: 'report-template.md', size: 'bafy…t01' }], comments: [],
  },
  {
    id: 'p7', cat: 'governance', type: 'Discussion',
    title: 'How should we moderate Announcements? Proposing a 3-steward rotation',
    excerpt: 'Announcements is the one post-restricted category. Proposing a rotating set of three stewards, elected quarterly by karma-weighted signaling.',
    body: [
      'Right now Announcements can only be posted by core. As we grow, that bottleneck will hurt. I propose a rotating set of three community stewards, elected every quarter via karma-weighted signaling here in Governance.',
      'Stewards would have posting rights in Announcements and a soft mandate to keep it signal, not noise. Thoughts on term length and the election mechanism?',
    ],
    author: 'mira.fil', time: '5d', upvotes: 44, upvoted: false, cidStr: 'bafyv9c2k…h63',
    evidence: [], comments: [
      { id:'c5', author:'devi.fil', time:'4d', text:'Quarterly feels right. I would cap stewards to two terms in a row to keep it fresh.', reactions:{ '👀':{count:2,mine:false} }, replies:[] },
    ],
  },
  {
    id: 'p8', cat: 'reports', type: 'Report',
    title: 'Bangalore campus tour — 3 universities, 210 students reached',
    excerpt: 'A week-long campus tour across three Bangalore universities. Turnout, the demos that landed, and the two students who are now drafting proposals.',
    body: [
      'Over five days we ran sessions at three universities in Bangalore, reaching about 210 students total. The hook that worked everywhere: "your cloud storage can disappear; this cannot."',
      'Two students have already drafted project proposals and one is co-facilitating our next workshop. Full slide deck and sign-up numbers attached.',
    ],
    author: 'devi.fil', time: '3d', upvotes: 52, upvoted: false, cidStr: 'bafyd4k7m…p28',
    evidence: [{ name: 'campus-tour-deck.pdf', size: 'bafy…d44' }], comments: [],
  },
];

const PROPOSALS = [
  { id:'pr1', title:'Shared evidence-pinning bot', status:'Discussion', author:'mira.fil', forVotes:73, comments:1, threadId:'p2', cat:'projects', summary:'Auto-pin report attachments to IPFS + Filecoin so ambassadors never touch a CLI.' },
  { id:'pr2', title:'Quarterly ambassador stipend v2', status:'Voting', author:'olga.fil', forVotes:128, comments:34, threadId:null, cat:'governance', summary:'Revised stipend tiers tied to verified event reports and project contributions.' },
  { id:'pr3', title:'Regional hub budget allocation', status:'Draft', author:'tunde.fil', forVotes:12, comments:12, threadId:null, cat:'projects', summary:'Seed budget for three regional hubs: West Africa, South Asia, LatAm.' },
  { id:'pr4', title:'3-steward rotation for Announcements', status:'Discussion', author:'mira.fil', forVotes:44, comments:1, threadId:'p7', cat:'governance', summary:'Rotating community stewards elected quarterly by karma-weighted signaling.' },
  { id:'pr5', title:'Adopt report template v1 across all hubs', status:'Approved', author:'devi.fil', forVotes:189, comments:52, threadId:null, cat:'governance', summary:'Standardize the report format so reports are comparable and searchable.' },
];
const PROP_STATUS = { Draft:'#9aa0aa', Discussion:'#FFD60A', Voting:'#0090FF', Approved:'#10B981' };

const EVENTS = [
  { id:'e1', when:'Jan 25, 2026', month:'JAN', day:'25', title:'Lagos storage workshop', city:'Lagos, NG', host:'tunde.fil', status:'upcoming', spots:'2 facilitators needed' },
  { id:'e2', when:'Feb 08, 2026', month:'FEB', day:'08', title:'Buenos Aires meetup #2', city:'Buenos Aires, AR', host:'olga.fil', status:'upcoming', spots:'Open · 40 seats' },
  { id:'e3', when:'Feb 21, 2026', month:'FEB', day:'21', title:'Lisbon FVM hack night', city:'Lisbon, PT', host:'mira.fil', status:'upcoming', spots:'Open · 30 seats' },
  { id:'e4', when:'Nov 14, 2025', month:'NOV', day:'14', title:'Santiago meetup #3', city:'Santiago, CL', host:'olga.fil', status:'past', spots:'64 attended · recap posted' },
  { id:'e5', when:'Oct 30, 2025', month:'OCT', day:'30', title:'Bangalore campus tour', city:'Bangalore, IN', host:'devi.fil', status:'past', spots:'210 reached · recap posted' },
];

const DOCS = [
  { id:'participate', title:'How to participate', body:[
    'Reading Orbit is open to everyone. To post, comment, or vote you connect a wallet and hold the Orbit Ambassador NFT.',
    'Start in Get started, introduce yourself in Feedback, then file your first report in Reports. Keep proposals in Projects and meta-governance in Governance.',
  ]},
  { id:'conduct', title:'Code of conduct', body:[
    'Be generous and specific. Critique ideas, never people. Assume good faith — most disagreements are missing context, not bad intent.',
    'No spam, no shilling, no doxxing. Announcements is signal-only. Stewards may remove posts that break these rules.',
  ]},
  { id:'template', title:'Report template', body:[
    'Every report should answer: what happened, who showed up, what landed, what would you change, and what comes next.',
    'Attach evidence — photos, slides, sign-up sheets, feedback. Everything is pinned to IPFS and persisted on Filecoin automatically.',
  ]},
  { id:'faq', title:'FAQ', body:[
    'Do I need the NFT to read? No. Reading is fully open. The NFT only unlocks posting, commenting, and voting.',
    'Where do my files live? On IPFS, with a Filecoin storage deal created automatically via Lighthouse.',
    'Can I edit a post? Yes, until it has replies. After that, edits append a revision note for transparency.',
  ]},
];

const TRENDING = ['#storage-deals', '#onboarding', '#FVM', '#regional-hubs', '#IPFS', '#stipends'];

/* social network config — order + meta for rendering */
const SOCIALS = [
  { key:'github',   label:'GitHub',   prefix:'github.com/',  ph:'username' },
  { key:'x',        label:'X',        prefix:'x.com/',       ph:'handle' },
  { key:'instagram',label:'Instagram',prefix:'instagram.com/', ph:'username' },
  { key:'discord',  label:'Discord',  prefix:'',             ph:'name#0000' },
  { key:'slack',    label:'Slack',    prefix:'',             ph:'workspace handle' },
  { key:'telegram', label:'Telegram', prefix:'t.me/',        ph:'username' },
  { key:'website',  label:'Website',  prefix:'https://',     ph:'yoursite.xyz' },
];

/* profile banners — users choose one (cannot upload) */
const BANNERS = [
  { id:'green',    label:'Ringed World',  src:'assets/bn-green.png' },
  { id:'purple',   label:'Violet Moon',   src:'assets/bn-purple.png' },
  { id:'magenta',  label:'Magma Planet',  src:'assets/bn-magenta.png' },
  { id:'asteroid', label:'Asteroid Belt', src:'assets/bn-asteroid.png' },
  { id:'moon',     label:'Lunar Drift',   src:'assets/bn-moon.png' },
  { id:'gold',     label:'Golden Orbit',  src:'assets/bn-gold.png' },
];

const NOTIFICATIONS = [
  { id:'n1', type:'comment', who:'kwame.fil', text:'commented on your report "Filecoin Orbit meetup, Santiago"', time:'2h', unread:true, link:'#/forum/reports/p1' },
  { id:'n2', type:'vote',    who:'mira.fil',  text:'and 11 others signaled support on your proposal', time:'5h', unread:true, link:'#/proposals' },
  { id:'n3', type:'mention', who:'devi.fil',  text:'mentioned you in "Onboarding asks for a wallet…"', time:'1d', unread:true, link:'#/forum/feedback/p4' },
  { id:'n4', type:'event',   who:'tunde.fil', text:'invited you to co-facilitate the Lagos workshop', time:'2d', unread:false, link:'#/events/e1' },
  { id:'n5', type:'system',  who:'orbit-team.fil', text:'Your post was pinned to IPFS + Filecoin successfully', time:'3d', unread:false, link:'#/profile/me/posts' },
];

/* admin / moderation data */
const FLAGGED = [
  { id:'f1', target:'Comment by anon.fil', reason:'Spam / shilling', reporter:'devi.fil', time:'1h', status:'open', excerpt:'Buy my token before it 100x, link in bio…' },
  { id:'f2', target:'Post: "Free storage hack"', reason:'Misinformation', reporter:'olga.fil', time:'4h', status:'open', excerpt:'Claims you can get unlimited Filecoin storage for free with this trick…' },
  { id:'f3', target:'Comment by ghost.fil', reason:'Harassment', reporter:'mira.fil', time:'1d', status:'reviewing', excerpt:'Personal attack directed at another ambassador.' },
  { id:'f4', target:'Post: "Re: stipend v2"', reason:'Off-topic', reporter:'kwame.fil', time:'2d', status:'resolved', excerpt:'Thread derailed into unrelated price talk.' },
];
const USERS_ADMIN = [
  { name:'olga.fil',  role:'Ambassador', status:'Active', nft:true,  karma:1240, joined:'Jan 2024' },
  { name:'mira.fil',  role:'Moderator',  status:'Active', nft:true,  karma:980,  joined:'Feb 2024' },
  { name:'tunde.fil', role:'Ambassador', status:'Active', nft:true,  karma:760,  joined:'May 2024' },
  { name:'devi.fil',  role:'Ambassador', status:'Active', nft:true,  karma:1120, joined:'Mar 2024' },
  { name:'kwame.fil', role:'Ambassador', status:'Active', nft:true,  karma:640,  joined:'Apr 2024' },
  { name:'nova.fil',  role:'Applicant',  status:'Pending', nft:false, karma:0,    joined:'May 2026' },
  { name:'anon.fil',  role:'Member',     status:'Suspended', nft:false, karma:-12, joined:'Apr 2026' },
];
const ALLOWLIST = [
  { addr:'0x91Fa…02B7', name:'nova.fil',  note:'Cohort 12 applicant — referred by olga.fil', added:'May 28, 2026' },
  { addr:'0x4d2C…77A1', name:'—',         note:'Pending KYC via Orbit Program', added:'May 26, 2026' },
  { addr:'0xBe09…3F5d', name:'rin.fil',   note:'Returning ambassador, NFT re-mint', added:'May 21, 2026' },
];
const ADMIN_STATS = [
  { label:'Open reports', value:'2', tone:'#FF3B30' },
  { label:'Pending applicants', value:'1', tone:'#FFD60A' },
  { label:'Active ambassadors', value:'318', tone:'#10B981' },
  { label:'Posts this week', value:'47', tone:'#0090FF' },
];

window.ORBIT = { AV, AVATAR_OPTIONS, COLORHEX, CATEGORIES, catOf, ME, cid, SEED_POSTS, AMBASSADORS, PROPOSALS, PROP_STATUS, EVENTS, DOCS, TRENDING, SOCIALS, BANNERS, NOTIFICATIONS, FLAGGED, USERS_ADMIN, ALLOWLIST, ADMIN_STATS };
