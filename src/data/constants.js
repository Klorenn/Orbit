/* ============================================================
   ORBIT FORUM — shared constants and helpers (ES module)
   ============================================================ */

export const SUPER_ADMIN = '0x5c84eb03e22f370051a3612090ff5a3328111367'

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
  navy: '/assets/avatar-navy.png',
  indigo: '/assets/avatar-indigo.png',
  lavender: '/assets/avatar-lavender.png',
  coral: '/assets/avatar-coral.png',
  gold: '/assets/avatar-gold.png',
  olive: '/assets/avatar-olive.png',
  mint: '/assets/avatar-mint.png',
};
export const AVATAR_OPTIONS = ['blue','navy','indigo','lavender','purple','green','mint','yellow','gold','orange','coral','red','olive','brown','gray','pink'];
export const COLORHEX = { blue:'#0090FF', red:'#FF3B30', yellow:'#FFD60A', purple:'#A855F7', green:'#10B981', orange:'#FF9500', brown:'#8B5E3C', gray:'#8A8F98', pink:'#FF2D9B' };

export const CATEGORIES = [
  { id: 'reports',       name: 'Reports',        color: '#0090FF', desc: 'Ambassador reports — events, activities, and field work.' },
  { id: 'projects',      name: 'Projects',       color: '#A855F7', desc: 'New project proposals seeking signaling and collaborators.' },
  { id: 'events',        name: 'Events',         color: '#FFD60A', desc: 'Event announcements, calls for facilitators, and recaps.' },
  { id: 'feedback',      name: 'Feedback',       color: '#10B981', desc: 'Open discussion about the ecosystem and the forum itself.' },
  { id: 'announcements', name: 'Announcements',  color: '#FF3B30', desc: 'Official announcements. Moderators post; everyone reads.' },
  { id: 'get-started',   name: 'Get started',    color: '#0072CC', desc: 'Onboarding for new ambassadors — start here.' },
  { id: 'governance',    name: 'Governance',     color: '#7C5CFF', desc: 'Meta-governance — how the forum itself is run.' },
];
export const catOf = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];

export const ME = { name: 'you.fil', color: 'blue', addr: '0xA3f9…7E21', fulladdr: '0xA3f94C2b8D1e5F7a93C6e0B2d4A8f1C5b6E27E21',
  role: 'Ambassador', city: 'Your node', joined: 'Mar 2025', karma: 340, posts: 12, events: 3 };

export function cid() {
  const c = 'abcdefghijkmnpqrstuvwxyz0123456789';
  let s = 'bafy';
  for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)];
  return s + '…' + Array.from({length:3}, ()=>c[Math.floor(Math.random()*c.length)]).join('');
}

export const AMBASSADORS = {
  'olga.fil':  { name:'olga.fil',  color:'blue',   addr:'0x7C1a…9F03', role:'Ambassador', city:'Lima, PE', joined:'Jan 2024', karma:1240, events:7, bio:'Filecoin Ambassador and community builder across LatAm. Leading the Orbit Program as Project Lead Manager.', socials:{ github:'olga-fil', x:'0lga_tech', discord:'olga#2207', telegram:'olgafil', website:'olga.xyz' } , banner:'green' },
  'mira.fil':  { name:'mira.fil',  color:'purple', addr:'0x2B8e…4D71', role:'Ambassador', city:'Lisbon, PT',   joined:'Feb 2024', karma:980,  events:4, bio:'Building tooling so ambassadors never touch a CLI. IPFS maximalist.', socials:{ github:'mira-codes', x:'mirabuilds', discord:'mira#0041', slack:'mira', telegram:'miradev' } , banner:'purple' },
  'tunde.fil': { name:'tunde.fil', color:'red',    addr:'0x9A3c…1E22', role:'Ambassador', city:'Lagos, NG',    joined:'May 2024', karma:760,  events:6, bio:'Running storage workshops across West Africa. Community first.', socials:{ github:'tunde-ng', x:'tundeonchain', telegram:'tundefil', discord:'tunde#9100' } , banner:'magenta' },
  'devi.fil':  { name:'devi.fil',  color:'green',  addr:'0x4F6d…8B90', role:'Ambassador', city:'Bangalore, IN', joined:'Mar 2024', karma:1120, events:5, bio:'Onboarding obsessive. If the funnel leaks, I will find the hole.', socials:{ github:'devi-fn', x:'devifunnels', discord:'devi#3321', website:'devi.dev' } , banner:'moon' },
  'kwame.fil': { name:'kwame.fil', color:'yellow', addr:'0x6E2a…3C44', role:'Ambassador', city:'Accra, GH',    joined:'Apr 2024', karma:640,  events:3, bio:'Wallet-native identity advocate. Less paperwork, more building.', socials:{ github:'kwame-gh', telegram:'kwamefil', x:'kwameid' } , banner:'gold' },
  'orbit-team.fil': { name:'orbit-team.fil', color:'blue', addr:'0x0001…CORE', role:'Core', city:'Constellation', joined:'Jan 2024', karma:0, events:0, bio:'Core stewards of the Orbit forum. Aligned with the Constellation Program.', socials:{ github:'orbit-forum', x:'orbitforum', discord:'orbit', website:'orbit.gov' } , banner:'asteroid' },
  'you.fil':   { ...ME, bio:'Filecoin Orbit ambassador. This is your public profile.', socials:{ github:'you-fil', x:'youonchain', discord:'you#0001', slack:'', telegram:'youfil', website:'you.xyz' } , banner:'green' },
};

export const PROPOSALS = [
  { id:'pr1', title:'Shared evidence-pinning bot', status:'Discussion', author:'mira.fil', forVotes:73, comments:1, threadId:'p2', cat:'projects', summary:'Auto-pin report attachments to IPFS + Filecoin so ambassadors never touch a CLI.' },
  { id:'pr2', title:'Quarterly ambassador stipend v2', status:'Voting', author:'olga.fil', forVotes:128, comments:34, threadId:null, cat:'governance', summary:'Revised stipend tiers tied to verified event reports and project contributions.' },
  { id:'pr3', title:'Regional hub budget allocation', status:'Draft', author:'tunde.fil', forVotes:12, comments:12, threadId:null, cat:'projects', summary:'Seed budget for three regional hubs: West Africa, South Asia, LatAm.' },
  { id:'pr4', title:'3-steward rotation for Announcements', status:'Discussion', author:'mira.fil', forVotes:44, comments:1, threadId:'p7', cat:'governance', summary:'Rotating community stewards elected quarterly by karma-weighted signaling.' },
  { id:'pr5', title:'Adopt report template v1 across all hubs', status:'Approved', author:'devi.fil', forVotes:189, comments:52, threadId:null, cat:'governance', summary:'Standardize the report format so reports are comparable and searchable.' },
];
export const PROP_STATUS = { Draft:'#9aa0aa', Discussion:'#FFD60A', Voting:'#0090FF', Approved:'#10B981' };

export const EVENTS = [
  { id:'e1', when:'Jan 25, 2026', month:'JAN', day:'25', title:'Lagos storage workshop', city:'Lagos, NG', host:'tunde.fil', status:'upcoming', spots:'2 facilitators needed' },
  { id:'e2', when:'Feb 08, 2026', month:'FEB', day:'08', title:'Buenos Aires meetup #2', city:'Buenos Aires, AR', host:'olga.fil', status:'upcoming', spots:'Open · 40 seats' },
  { id:'e3', when:'Feb 21, 2026', month:'FEB', day:'21', title:'Lisbon FVM hack night', city:'Lisbon, PT', host:'mira.fil', status:'upcoming', spots:'Open · 30 seats' },
  { id:'e4', when:'Nov 14, 2025', month:'NOV', day:'14', title:'Santiago meetup #3', city:'Santiago, CL', host:'olga.fil', status:'past', spots:'64 attended · recap posted' },
  { id:'e5', when:'Oct 30, 2025', month:'OCT', day:'30', title:'Bangalore campus tour', city:'Bangalore, IN', host:'devi.fil', status:'past', spots:'210 reached · recap posted' },
];

export const DOCS = [
  {
    id: 'participate',
    title: { es: 'Cómo participar', en: 'How to participate' },
    body: {
      es: [
        'Leer Orbit es abierto para todos, sin necesidad de cuenta ni wallet. Para publicar, comentar o votar necesitás conectar tu wallet de Filecoin.',
        'Comenzá presentándote en la categoría Feedback, luego publicá tu primer reporte en Reports. Las propuestas van en Projects y la meta-gobernanza en Governance.',
        'Cada publicación se ancla automáticamente en IPFS y se persiste en Filecoin mediante Lighthouse. Tu contenido vive en la red, no en nuestros servidores.',
        'El karma se acumula con votos positivos de otros embajadores. Un mayor karma refleja confianza y contribución al programa.',
      ],
      en: [
        'Reading Orbit is open to everyone — no account or wallet needed. To post, comment, or vote you need to connect a Filecoin wallet.',
        'Start by introducing yourself in the Feedback category, then file your first report in Reports. Proposals go in Projects and meta-governance in Governance.',
        'Every post is automatically pinned to IPFS and persisted on Filecoin via Lighthouse. Your content lives on the network, not on our servers.',
        'Karma accumulates through upvotes from other ambassadors. Higher karma reflects trust and contribution to the program.',
      ],
    },
  },
  {
    id: 'conduct',
    title: { es: 'Código de conducta', en: 'Code of conduct' },
    body: {
      es: [
        'Sé generoso y específico. Criticá ideas, nunca personas. Asumí buena fe: la mayoría de los desacuerdos son contexto faltante, no mala intención.',
        'Sin spam, sin shilling, sin doxxing. Announcements es solo señal — no usarlo para autopromoción. Los moderadores pueden eliminar publicaciones que rompan estas reglas.',
        'Los reportes deben ser precisos y verificables. Adjuntá evidencia siempre que sea posible: fotos, listas de asistentes, capturas, feedback.',
        'Las propuestas deben tener un autor claro, una motivación honesta y estar abiertas a debate constructivo antes de pasar a votación.',
      ],
      en: [
        'Be generous and specific. Critique ideas, never people. Assume good faith — most disagreements are missing context, not bad intent.',
        'No spam, no shilling, no doxxing. Announcements is signal-only — don\'t use it for self-promotion. Stewards may remove posts that break these rules.',
        'Reports should be accurate and verifiable. Attach evidence whenever possible: photos, sign-up sheets, screenshots, feedback forms.',
        'Proposals must have a clear author, an honest motivation, and be open to constructive debate before moving to a vote.',
      ],
    },
  },
  {
    id: 'template',
    title: { es: 'Plantilla de reporte', en: 'Report template' },
    body: {
      es: [
        'Todo reporte debe responder: ¿qué pasó?, ¿quién participó?, ¿qué logros hubo?, ¿qué mejorarías?, ¿qué viene después?',
        'Adjuntá evidencia: fotos del evento, planilla de asistentes, capturas de pantalla de feedback, métricas de alcance.',
        'Mencioná la categoría exacta: meetup, workshop, campus tour, demo day, hack night, panel, etc. Ayuda a clasificar el impacto del programa.',
        'Si hubo problemas logísticos, mencionarlos es valioso. Los reportes honestos generan más confianza y karma que los perfectos.',
      ],
      en: [
        'Every report should answer: what happened, who showed up, what landed, what would you change, and what comes next.',
        'Attach evidence: event photos, sign-up sheets, screenshots of feedback forms, and reach metrics.',
        'Specify the event type: meetup, workshop, campus tour, demo day, hack night, panel, etc. It helps classify program impact.',
        'If there were logistical issues, mentioning them is valuable. Honest reports generate more trust and karma than polished ones.',
      ],
    },
  },
  {
    id: 'proposals',
    title: { es: 'Proceso de propuestas', en: 'Proposal process' },
    body: {
      es: [
        'Una propuesta pasa por cuatro estados: Borrador → Discusión → Votación → Aprobada. Los stewards mueven las propuestas entre estados.',
        'Para iniciar una propuesta: publicá un hilo en la categoría Projects con el título, motivación, propuesta concreta y métricas de éxito.',
        'El período de discusión dura al menos 7 días. Las propuestas con comentarios activos se priorizan para revisión.',
        'La señalización on-chain en Voting requiere wallet. Los votos son públicos y permanentes. Una propuesta aprobada se puede llevar a Metropolis para ejecución formal.',
      ],
      en: [
        'A proposal moves through four states: Draft → Discussion → Voting → Approved. Stewards advance proposals between states.',
        'To start a proposal: create a thread in the Projects category with the title, motivation, concrete proposal, and success metrics.',
        'The discussion period lasts at least 7 days. Proposals with active comments are prioritized for review.',
        'On-chain signaling in Voting requires a wallet. Votes are public and permanent. An approved proposal can be taken to Metropolis for formal execution.',
      ],
    },
  },
  {
    id: 'credential',
    title: { es: 'Credencial Orbit Ambassador', en: 'Orbit Ambassador Credential' },
    body: {
      es: [
        '🚀 Próximamente — La credencial Orbit Ambassador es un token soulbound (no transferible) en la red Filecoin que acredita tu membresía en el programa.',
        'Una vez desplegado el contrato, los embajadores aprobados podrán claimearla desde esta misma página con un clic. El contrato verificará tu dirección contra la lista aprobada y minteará el token directamente en tu wallet.',
        'La credencial desbloquea publicar, comentar, votar y organizar reuniones. Es prueba de membresía sin papeles, sin intermediarios.',
        'Activá las notificaciones en tu perfil para que te avisemos cuando el claim esté disponible.',
      ],
      en: [
        '🚀 Coming soon — The Orbit Ambassador credential is a soulbound (non-transferable) token on the Filecoin network that certifies your membership in the program.',
        'Once the contract is deployed, approved ambassadors will be able to claim it from this page with a single click. The contract verifies your address against the approved list and mints the token directly to your wallet.',
        'The credential unlocks posting, commenting, voting, and hosting meetings. It\'s proof of membership — no paperwork, no intermediaries.',
        'Enable notifications on your profile and we\'ll alert you when claiming opens.',
      ],
    },
  },
  {
    id: 'storage',
    title: { es: 'Almacenamiento IPFS + Filecoin', en: 'IPFS + Filecoin storage' },
    body: {
      es: [
        'Cada archivo que adjuntás a una publicación se sube automáticamente a IPFS mediante Lighthouse y se crea un deal de almacenamiento en Filecoin.',
        'Tu contenido recibe un CID (Content Identifier) — un hash único que identifica el archivo en la red. Podés usarlo para verificar que el contenido no fue modificado.',
        'Los deals de Filecoin tienen una duración mínima. Si el deal expira, el contenido sigue disponible en IPFS mientras haya nodos que lo pinen.',
        'No dependemos de ningún servidor central. Si Orbit desaparece mañana, todos los archivos siguen accesibles por su CID en la red IPFS/Filecoin.',
      ],
      en: [
        'Every file you attach to a post is automatically uploaded to IPFS via Lighthouse and a Filecoin storage deal is created.',
        'Your content gets a CID (Content Identifier) — a unique hash that identifies the file on the network. You can use it to verify content hasn\'t been modified.',
        'Filecoin deals have a minimum duration. If a deal expires, the content is still available on IPFS as long as nodes are pinning it.',
        'We don\'t rely on any central server. If Orbit disappears tomorrow, all files remain accessible by their CID on the IPFS/Filecoin network.',
      ],
    },
  },
  {
    id: 'faq',
    title: { es: 'Preguntas frecuentes', en: 'FAQ' },
    body: {
      es: [
        '¿Necesito wallet para leer? No. La lectura es completamente abierta. La wallet solo desbloquea publicar, comentar y votar.',
        '¿Dónde viven mis archivos? En IPFS, con un deal de almacenamiento en Filecoin creado automáticamente mediante Lighthouse.',
        '¿Puedo editar una publicación? Sí, hasta que tenga respuestas. Después, las ediciones agregan una nota de revisión para mantener la transparencia.',
        '¿Qué pasa si pierdo acceso a mi wallet? Tus publicaciones y karma quedan vinculados a la dirección. Podés continuar con otra wallet, pero el historial permanece en la anterior.',
        '¿Cómo se calcula el karma? Cada voto positivo en tus publicaciones y comentarios suma karma. Los votos negativos restan. El karma no se puede comprar ni transferir.',
      ],
      en: [
        'Do I need a wallet to read? No. Reading is fully open. A wallet only unlocks posting, commenting, and voting.',
        'Where do my files live? On IPFS, with a Filecoin storage deal created automatically via Lighthouse.',
        'Can I edit a post? Yes, until it has replies. After that, edits append a revision note for transparency.',
        'What if I lose access to my wallet? Your posts and karma are tied to that address. You can continue with a new wallet, but the history stays with the original address.',
        'How is karma calculated? Each upvote on your posts and comments adds karma. Downvotes subtract. Karma cannot be bought or transferred.',
      ],
    },
  },
  {
    id: 'governance',
    title: { es: 'Gobernanza del foro', en: 'Forum governance' },
    body: {
      es: [
        'Orbit es gobernado por sus embajadores. Los stewards (moderadores) son elegidos por rotación trimestral entre embajadores con alto karma.',
        'Las decisiones sobre categorías, reglas y procesos se debaten en Governance antes de implementarse. Cualquier embajador puede iniciar un debate de gobernanza.',
        'El equipo de Orbit Program (Protocol Labs) mantiene derechos de veto en situaciones de emergencia (spam masivo, exploits, contenido ilegal). Este veto es público y registrado.',
        'Los cambios al código del foro se proponen en GitHub y se anuncian en Announcements. El roadmap es abierto y las contribuciones son bienvenidas.',
      ],
      en: [
        'Orbit is governed by its ambassadors. Stewards (moderators) are chosen by quarterly rotation among high-karma ambassadors.',
        'Decisions about categories, rules, and processes are debated in Governance before implementation. Any ambassador can start a governance discussion.',
        'The Orbit Program team (Protocol Labs) retains veto rights in emergency situations (mass spam, exploits, illegal content). This veto is public and recorded.',
        'Changes to the forum code are proposed on GitHub and announced in Announcements. The roadmap is open and contributions are welcome.',
      ],
    },
  },
];

export const TRENDING = ['#governance', '#LatAm', '#Filecoin', '#ProPGF', '#Orbit', '#eventos', '#propuestas', '#web3'];

/* social network config — order + meta for rendering */
export const SOCIALS = [
  { key:'github',   label:'GitHub',   prefix:'github.com/',  ph:'username' },
  { key:'x',        label:'X',        prefix:'x.com/',       ph:'handle' },
  { key:'instagram',label:'Instagram',prefix:'instagram.com/', ph:'username' },
  { key:'discord',  label:'Discord',  prefix:'',             ph:'name#0000' },
  { key:'slack',    label:'Slack',    prefix:'',             ph:'workspace handle' },
  { key:'telegram', label:'Telegram', prefix:'t.me/',        ph:'username' },
  { key:'website',  label:'Website',  prefix:'https://',     ph:'yoursite.xyz' },
];

/* profile banners — users choose one (cannot upload) */
export const BANNERS = [
  { id:'green',    label:'Ringed World',  src:'/assets/bn-green.png' },
  { id:'purple',   label:'Violet Moon',   src:'/assets/bn-purple.png' },
  { id:'magenta',  label:'Magma Planet',  src:'/assets/bn-magenta.png' },
  { id:'asteroid', label:'Asteroid Belt', src:'/assets/bn-asteroid.png' },
  { id:'moon',     label:'Lunar Drift',   src:'/assets/bn-moon.png' },
  { id:'gold',     label:'Golden Orbit',  src:'/assets/bn-gold.png' },
];

export const NOTIFICATIONS = [
  { id:'n1', type:'comment', who:'kwame.fil', text:'commented on your report "Filecoin Orbit meetup, Santiago"', time:'2h', unread:true, link:'/forum/reports/p1' },
  { id:'n2', type:'vote',    who:'mira.fil',  text:'and 11 others signaled support on your proposal', time:'5h', unread:true, link:'/proposals' },
  { id:'n3', type:'mention', who:'devi.fil',  text:'mentioned you in "Onboarding asks for a wallet…"', time:'1d', unread:true, link:'/forum/feedback/p4' },
  { id:'n4', type:'event',   who:'tunde.fil', text:'invited you to co-facilitate the Lagos workshop', time:'2d', unread:false, link:'/events/e1' },
  { id:'n5', type:'system',  who:'orbit-team.fil', text:'Your post was pinned to IPFS + Filecoin successfully', time:'3d', unread:false, link:'/profile/me/posts' },
];

/* admin / moderation data */
export const FLAGGED = [
  { id:'f1', target:'Comment by anon.fil', reason:'Spam / shilling', reporter:'devi.fil', time:'1h', status:'open', excerpt:'Buy my token before it 100x, link in bio…' },
  { id:'f2', target:'Post: "Free storage hack"', reason:'Misinformation', reporter:'olga.fil', time:'4h', status:'open', excerpt:'Claims you can get unlimited Filecoin storage for free with this trick…' },
  { id:'f3', target:'Comment by ghost.fil', reason:'Harassment', reporter:'mira.fil', time:'1d', status:'reviewing', excerpt:'Personal attack directed at another ambassador.' },
  { id:'f4', target:'Post: "Re: stipend v2"', reason:'Off-topic', reporter:'kwame.fil', time:'2d', status:'resolved', excerpt:'Thread derailed into unrelated price talk.' },
];
export const USERS_ADMIN = [
  { name:'olga.fil',  role:'Ambassador', status:'Active', nft:true,  karma:1240, joined:'Jan 2024' },
  { name:'mira.fil',  role:'Moderator',  status:'Active', nft:true,  karma:980,  joined:'Feb 2024' },
  { name:'tunde.fil', role:'Ambassador', status:'Active', nft:true,  karma:760,  joined:'May 2024' },
  { name:'devi.fil',  role:'Ambassador', status:'Active', nft:true,  karma:1120, joined:'Mar 2024' },
  { name:'kwame.fil', role:'Ambassador', status:'Active', nft:true,  karma:640,  joined:'Apr 2024' },
  { name:'nova.fil',  role:'Applicant',  status:'Pending', nft:false, karma:0,    joined:'May 2026' },
  { name:'anon.fil',  role:'Member',     status:'Suspended', nft:false, karma:-12, joined:'Apr 2026' },
];
export const ALLOWLIST = [
  { addr:'0x91Fa…02B7', name:'nova.fil',  note:'Cohort 12 applicant — referred by olga.fil', added:'May 28, 2026' },
  { addr:'0x4d2C…77A1', name:'—',         note:'Pending KYC via Orbit Program', added:'May 26, 2026' },
  { addr:'0xBe09…3F5d', name:'rin.fil',   note:'Returning ambassador, NFT re-mint', added:'May 21, 2026' },
];
export const ADMIN_STATS = [
  { label:'Open reports', value:'2', tone:'#FF3B30' },
  { label:'Pending applicants', value:'1', tone:'#FFD60A' },
  { label:'Active ambassadors', value:'318', tone:'#10B981' },
  { label:'Posts this week', value:'47', tone:'#0090FF' },
];

export function who(name) {
  return AMBASSADORS[name] || { name, color: 'gray', addr: '0x???', role: 'Member' };
}

export function navTo(path) {
  const clean = path.replace(/^#/, '') || '/'
  history.pushState(null, '', clean)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const MEETINGS = [
  { id:'m1', title:'Weekly ambassador sync', host:'orbit-team.fil', kind:'Community', status:'live',
    when:'Now · started 12 min ago', durationMin:60, capacity:50,
    desc:'Open weekly call for all ambassadors. Share what you shipped, blockers, and what is coming. Drop in any time.',
    attendees:['olga.fil','mira.fil','devi.fil','kwame.fil','tunde.fil'], speaking:'olga.fil' },
  { id:'m2', title:'Proposal review — Regional hub budget', host:'tunde.fil', kind:'Proposal', status:'live',
    when:'Now · started 4 min ago', durationMin:45, capacity:30,
    desc:'Live walkthrough of the West Africa / South Asia / LatAm hub budget before it goes to Voting. Bring questions.',
    attendees:['tunde.fil','devi.fil','mira.fil'], speaking:'tunde.fil' },
  { id:'m3', title:'New ambassador onboarding circle', host:'devi.fil', kind:'Workshop', status:'upcoming',
    when:'Today, 18:00 UTC', durationMin:45, capacity:25,
    desc:'A friendly intro session for newcomers: wallet setup, the NFT, and posting your first report. No question too small.',
    attendees:['devi.fil','kwame.fil'], speaking:null },
  { id:'m4', title:'Storage-deal office hours', host:'mira.fil', kind:'Workshop', status:'upcoming',
    when:'Tomorrow, 15:00 UTC', durationMin:60, capacity:40,
    desc:'Bring your CID and we will make a Filecoin deal live. Hands-on help with Lighthouse and IPFS pinning.',
    attendees:['mira.fil','olga.fil'], speaking:null },
  { id:'m5', title:'Governance roundtable — steward rotation', host:'orbit-team.fil', kind:'Admin', status:'upcoming',
    when:'Fri, 16:00 UTC', durationMin:50, capacity:30,
    desc:'Admin-hosted discussion on the 3-steward rotation for Announcements ahead of the formal vote.',
    attendees:['orbit-team.fil','mira.fil','olga.fil','devi.fil'], speaking:null },
  { id:'m6', title:'LatAm hub kickoff', host:'olga.fil', kind:'Community', status:'ended',
    when:'Yesterday', durationMin:55, capacity:50,
    desc:'First call of the LatAm regional hub. Recording and notes pinned to the thread.',
    attendees:['olga.fil','tunde.fil','devi.fil','kwame.fil','mira.fil','orbit-team.fil'], speaking:null },
]

export const MEETING_KIND = { Community:'#0090FF', Proposal:'#A855F7', Workshop:'#10B981', Admin:'#FF9500' }

export const BADGES = [
  { id:'first-report', icon:'📡', label:'First Report', desc:'Published your first ambassador report', tone:'#0090FF' },
  { id:'host', icon:'🎙️', label:'Meeting Host', desc:'Hosted a live Orbit meeting', tone:'#A855F7' },
  { id:'organizer', icon:'🌍', label:'Event Organizer', desc:'Ran 3+ community events', tone:'#10B981' },
  { id:'proposer', icon:'🗳️', label:'Proposer', desc:'Authored a governance proposal', tone:'#FF9500' },
  { id:'storage', icon:'🛰️', label:'Storage Pro', desc:'Pinned 50+ files to Filecoin', tone:'#2AABEE' },
  { id:'streak', icon:'🔥', label:'On a Streak', desc:'Active 8 weeks in a row', tone:'#FF3B30' },
  { id:'mentor', icon:'🤝', label:'Mentor', desc:'Onboarded a new ambassador', tone:'#FFD60A' },
  { id:'constellation', icon:'⭐', label:'Constellation', desc:'1,000+ karma earned', tone:'#7C5CFF' },
]

export const USER_BADGES = {
  'olga.fil':['first-report','host','organizer','proposer','constellation','streak'],
  'mira.fil':['first-report','host','proposer','storage','constellation'],
  'tunde.fil':['first-report','organizer','host','mentor'],
  'devi.fil':['first-report','organizer','mentor','constellation','storage'],
  'kwame.fil':['first-report','mentor'],
  'orbit-team.fil':['host','constellation','storage'],
  'you.fil':['first-report','storage','mentor'],
}

export const RANKS = [
  { min: 0,    label: 'Newcomer',          color: '#8A8F98' },
  { min: 50,   label: 'Member',            color: '#0090FF' },
  { min: 250,  label: 'Contributor',       color: '#10B981' },
  { min: 600,  label: 'Ambassador',        color: '#A855F7' },
  { min: 1200, label: 'Senior Ambassador', color: '#FF9500' },
  { min: 2500, label: 'Veteran',           color: '#FFD60A' },
]
export const rankOf = (karma = 0) =>
  [...RANKS].reverse().find(r => karma >= r.min) || RANKS[0]

export const karmaBreakdown = (u) => {
  const total = u.karma || 0
  return [
    { label:'Reports & posts', pct:42, tone:'#0090FF' },
    { label:'Helpful comments', pct:24, tone:'#10B981' },
    { label:'Events hosted', pct:18, tone:'#FFD60A' },
    { label:'Proposals & votes', pct:16, tone:'#A855F7' },
  ].map(s => ({ ...s, value: Math.round(total * s.pct / 100) }))
}
