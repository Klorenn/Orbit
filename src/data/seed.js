// src/data/seed.js
export const SEED_POSTS = [
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
