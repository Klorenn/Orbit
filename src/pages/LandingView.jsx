import { useEffect, useState, useRef } from 'react'
import { AV } from '../data/constants'

const heroBrands = [
  ['Protocol Labs', 'font-family:Georgia,serif;font-weight:700;letter-spacing:-.02em;font-size:15px'],
  ['IPFS', 'font-family:Arial,sans-serif;font-weight:900;letter-spacing:.08em;font-size:13px;text-transform:uppercase'],
  ['Lotus', "font-family:'Trebuchet MS',sans-serif;font-weight:600;letter-spacing:.01em;font-size:15px;font-style:italic"],
  ['FVM', "font-family:'Courier New',monospace;font-weight:700;letter-spacing:.12em;font-size:13px;text-transform:uppercase"],
  ['Lighthouse', "font-family:Palatino,'Book Antiqua',serif;font-weight:400;letter-spacing:-.01em;font-size:16px"],
  ['Boost', "font-family:Impact,'Arial Narrow',sans-serif;font-weight:400;letter-spacing:.04em;font-size:14px"],
  ['web3.storage', 'font-family:Verdana,sans-serif;font-weight:700;letter-spacing:-.03em;font-size:13px'],
  ['Singularity', "font-family:'Times New Roman',serif;font-weight:400;letter-spacing:.02em;font-size:15px"],
]
const backers = [
  ['Filecoin Foundation', "font-family:'Times New Roman',serif;font-weight:400;letter-spacing:.02em;font-size:15px"],
  ['Protocol Labs', "font-family:'Arial Black',Arial,sans-serif;font-weight:900;letter-spacing:.08em;font-size:16px"],
  ['Metropolis', 'font-family:Impact,sans-serif;font-weight:700;letter-spacing:.05em;font-size:19px'],
  ['Constellation', 'font-family:Georgia,serif;font-weight:600;letter-spacing:-.02em;font-size:18px'],
  ['FVM', 'font-family:Helvetica,Arial,sans-serif;font-weight:700;letter-spacing:-.01em;font-size:15px'],
  ['IPFS', 'font-family:Verdana,sans-serif;font-weight:700;letter-spacing:.06em;font-size:14px;text-transform:uppercase'],
  ['Lotus', "font-family:'Courier New',monospace;font-weight:700;letter-spacing:.18em;font-size:14px"],
  ['Lighthouse', 'font-family:Palatino,serif;font-weight:500;letter-spacing:.03em;font-size:16px'],
]

function makeMarqueeHTML(list) {
  const html = list.map(([name, style]) => `<span class="m-item" style="${style}">${name}</span>`).join('')
  return html + html
}

const L = {
  es: {
    forum: 'Entrar al foro', disconnect: 'Desconectar', cta: 'Entrar al foro', ctaGuest: 'Conectar wallet',
    connectWallet: 'Conectar wallet',
    heroEyebrow: 'El foro de embajadores Filecoin',
    heroH1: 'Una constelación de voces, construyendo Filecoin juntos.',
    heroP: 'El foro con wallet-gate donde los embajadores de Filecoin publican reports, proponen proyectos y dan forma al futuro del almacenamiento descentralizado — de forma transparente, on-chain.',
    meetH2: 'Conocé Orbit.',
    discoverIt: 'Descubrilo',
    meetLede: 'Orbit es el foro con wallet-gate donde los embajadores de Filecoin publican su trabajo en abierto — reports, propuestas y debate, todos anclados a identidad real on-chain.',
    visibleWorkTitle: 'Trabajo visible, por fin',
    visibleWorkBody: 'Cada report de evento y propuesta vive en un foro público — legible por cualquiera, atribuido a una identidad real on-chain. Sin más trabajo atrapado en Airtable, Slack o Drive.',
    identityTitle: 'Identidad sin papeles',
    identityBody: 'Iniciá sesión con tu wallet. Sin emails, sin contraseñas, sin intermediarios — tu wallet es tu identidad.',
    storedTitle: 'Almacenado en Filecoin',
    storedBody: 'Los reports y la evidencia están anclados en IPFS y persistidos a través de storage deals de Filecoin. Comemos nuestra propia comida.',
    backerLabel: 'Alineado con el Programa Constellation — y las personas que modernizan la gobernanza de Filecoin.',
    howEyebrow: 'Orbit en la práctica',
    howH2: 'Cómo funciona',
    howDesc: 'Tres pasos, sin fricciones. Conectate una vez, y tu identidad, tus posts y tus votos viajan con tu wallet.',
    step1H: 'Conectá tu wallet',
    step1P: 'Iniciá sesión con Ethereum. Sin emails, sin contraseñas — tu wallet es tu identidad.',
    step2H: 'Verificado por credencial',
    step2P: 'Tenés el Orbit Ambassador credential para publicar reports y propuestas. Cualquiera puede leer; los miembros dan forma al registro.',
    step3H: 'Gobernás de forma transparente',
    step3P: 'Las propuestas, la señalización y los resultados están todos on-chain — anclados en IPFS, persistidos en Filecoin.',
    mcH3: 'Conectate. Publicá. Goberná.',
    mcP: 'Desde un evento en Santiago hasta una propuesta de protocolo — todo el arco del trabajo de un embajador ocurre en un lugar, en abierto, propiedad de la comunidad que lo creó.',
    readDocs: 'Leer los docs',
    voicesEyebrow: 'De los embajadores',
    voicesH2: 'Voces de la constelación.',
    voicesLede: 'Embajadores de todo el mundo — coordinándose por fin en un solo lugar.',
    quote1: '"Orbit le dio a nuestra comunidad de LatAm un espacio para coordinarnos, compartir nuestro trabajo y tener influencia real en cómo evoluciona el programa."',
    joinCta: 'Conectar wallet',
    notAmbassador: '¿No sos embajador aún?',
    applyLink: 'Aplicá al Programa Orbit →',
    footerTag: 'Una constelación de voces.',
    product: 'Producto', community: 'Comunidad', governance: 'Gobernanza', legal: 'Legal',
    footerBottom: 'Construido en Filecoin · Almacenado en IPFS · © 2026 Orbit',
  },
  en: {
    forum: 'Go to forum', disconnect: 'Sign out', cta: 'Go to forum', ctaGuest: 'Connect Wallet to Join',
    connectWallet: 'Connect Wallet',
    heroEyebrow: 'The Filecoin ambassador forum',
    heroH1: 'A constellation of voices, building Filecoin together.',
    heroP: 'The wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and shape the future of decentralized storage — transparently, on-chain.',
    meetH2: 'Meet Orbit.',
    discoverIt: 'Discover it',
    meetLede: 'Orbit is the wallet-gated forum where Filecoin ambassadors publish their work in the open — reports, proposals, and debate, all anchored to real on-chain identity.',
    visibleWorkTitle: 'Visible work, finally',
    visibleWorkBody: 'Every event report and proposal lives in one public forum — readable by anyone, attributed to a real on-chain identity. No more work trapped in Airtable, Slack, or Drive.',
    identityTitle: 'Identity without paperwork',
    identityBody: 'Sign in with your wallet. No emails, no passwords, no central gatekeeper — your wallet is your key.',
    storedTitle: 'Stored on Filecoin',
    storedBody: 'Reports and evidence are pinned to IPFS and persisted through Filecoin storage deals. We eat our own dog food.',
    backerLabel: 'Aligned with the Constellation Program — and the people modernizing Filecoin governance.',
    howEyebrow: 'Orbit in practice',
    howH2: 'How it works',
    howDesc: 'Three steps, no friction. Connect once, and your identity, your posts, and your votes all travel with your wallet.',
    step1H: 'Connect your wallet',
    step1P: 'Sign-in with Ethereum. No emails, no passwords — your wallet is your identity.',
    step2H: 'Verified by credential',
    step2P: 'Hold the Orbit Ambassador credential to post reports and proposals. Anyone can read; members shape the record.',
    step3H: 'Govern transparently',
    step3P: 'Proposals, signaling, and outcomes are all on-chain — pinned to IPFS, persisted on Filecoin.',
    mcH3: 'Connect. Post. Govern.',
    mcP: 'From a field event in Santiago to a protocol proposal — the whole arc of an ambassador\'s work happens in one place, in the open, owned by the community that made it.',
    readDocs: 'Read the docs',
    voicesEyebrow: 'From the ambassadors',
    voicesH2: 'Voices from the constellation.',
    voicesLede: 'Ambassadors across the world — finally coordinating in one place.',
    quote1: '"Orbit gave our LatAm community a space to coordinate, share our work, and have real influence over how the program evolves."',
    joinCta: 'Connect Wallet',
    notAmbassador: 'Not an ambassador yet?',
    applyLink: 'Apply to the Orbit Program →',
    footerTag: 'A constellation of voices.',
    product: 'Product', community: 'Community', governance: 'Governance', legal: 'Legal',
    footerBottom: 'Built on Filecoin · Stored on IPFS · © 2026 Orbit',
  },
}
const CHIP_T = L

function LandingChip({ identity, myAvatar, onSignOut, lang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const t = CHIP_T[lang] || CHIP_T.en
  return (
    <div className="ln-chip-wrap" ref={ref}>
      <button className="ln-chip" onClick={() => setOpen(o => !o)}>
        <img className="ln-av" src={AV[myAvatar] || AV.blue} alt="" />
        <span className="ln-name">{identity || 'you.fil'}</span>
        <svg className="ln-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="ln-menu">
          <a className="ln-item" href="#/forum" onClick={() => setOpen(false)}>{t.forum} →</a>
          <button className="ln-item ln-disconnect" onClick={() => { setOpen(false); onSignOut() }}>{t.disconnect}</button>
        </div>
      )}
    </div>
  )
}

export function LandingView({ connected, identity, myAvatar, onSignOut }) {
  const [lang, setLang] = useState(() => localStorage.getItem('orbit-lang') || 'en')
  useEffect(() => {
    const handler = (e) => setLang(e.detail)
    window.addEventListener('orbit-lang', handler)
    return () => window.removeEventListener('orbit-lang', handler)
  }, [])

  // Inject orbit.css only while landing is mounted — avoids conflicts with forum.css
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/orbit.css'
    link.id = 'orbit-landing-css'
    document.head.appendChild(link)
    return () => { document.getElementById('orbit-landing-css')?.remove() }
  }, [])

  useEffect(() => {
    const heroMarqueeEl = document.getElementById('heroMarquee')
    if (heroMarqueeEl) heroMarqueeEl.innerHTML = makeMarqueeHTML(heroBrands)
    const backersMarqueeEl = document.getElementById('backersMarquee')
    if (backersMarqueeEl) backersMarqueeEl.innerHTML = makeMarqueeHTML(backers)

    // Scroll reveal
    const reveals = Array.from(document.querySelectorAll('.reveal'))
    function checkReveal() {
      const vh = window.innerHeight || document.documentElement.clientHeight
      for (let i = reveals.length - 1; i >= 0; i--) {
        const el = reveals[i]
        if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add('in'); reveals.splice(i, 1) }
      }
    }
    checkReveal()
    window.addEventListener('scroll', checkReveal, { passive: true })
    window.addEventListener('resize', checkReveal)
    const t = setTimeout(checkReveal, 400)

    // Ping-pong hero video
    const v = document.getElementById('heroVideo')
    if (v) {
      v.loop = false
      let dir = 1, rafId = null, lastTs = null
      const EPS = 0.08
      function reverseStep(ts) {
        if (lastTs == null) lastTs = ts
        const dt = (ts - lastTs) / 1000; lastTs = ts
        const t2 = v.currentTime - dt
        if (t2 <= 0) { v.currentTime = 0; dir = 1; lastTs = null; v.play().catch(() => {}); return }
        v.currentTime = t2
        rafId = requestAnimationFrame(reverseStep)
      }
      function startReverse() { cancelAnimationFrame(rafId); v.pause(); lastTs = null; rafId = requestAnimationFrame(reverseStep) }
      v.addEventListener('timeupdate', () => {
        if (dir === 1 && v.duration && v.currentTime >= v.duration - EPS) { dir = -1; startReverse() }
      })
      v.addEventListener('ended', () => { if (dir === 1) { dir = -1; startReverse() } })
      const tryPlay = () => v.play().catch(() => {})
      if (v.readyState >= 2) tryPlay(); else v.addEventListener('canplay', tryPlay, { once: true })
    }

    // Smooth anchor scroll
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'))
    const handleAnchor = (e) => {
      const a = e.currentTarget
      const id = a.getAttribute('href')
      if (!id || id.length < 2 || id.startsWith('#/')) return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      const y = target.getBoundingClientRect().top + window.scrollY - 12
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    anchors.forEach(a => a.addEventListener('click', handleAnchor))

    return () => {
      window.removeEventListener('scroll', checkReveal)
      window.removeEventListener('resize', checkReveal)
      clearTimeout(t)
      anchors.forEach(a => a.removeEventListener('click', handleAnchor))
    }
  }, [])

  const tl = L[lang] || L.en

  return (
    <div className="page">
      {/* NAV + HERO WRAPPER */}
      <div className="hero-wrap">
        <nav className="nav">
          <div className="inner nav-row">
            <a className="brand" href="#/forum" aria-label="Orbit — enter forum">
              <svg className="logo" width="38" height="38" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
                <circle cx="128" cy="128" r="33" fill="currentColor" />
                <circle cx="173" cy="69" r="17" fill="currentColor" />
              </svg>
              <span className="word" style={{ color: 'rgb(94, 94, 94)' }}>Orbit</span>
            </a>
            <div className="nav-links">
              <a href="#meet">Reports</a>
              <a href="#how">Projects</a>
              <a href="#voices">Events</a>
              <a href="#backed">Docs</a>
              <a href="#join">News</a>
            </div>
            {connected ? (
              <LandingChip identity={identity} myAvatar={myAvatar} onSignOut={onSignOut} lang={lang} />
            ) : (
              <button className="nav-pill" type="button" onClick={() => { window.location.hash = '#/forum' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="6" width="19" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M2.5 10h19" stroke="currentColor" strokeWidth="2" /><circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
                </svg>
                <span className="lbl">{tl.connectWallet}</span>
              </button>
            )}
          </div>
        </nav>

        <a id="top"></a>
        <header className="hero" data-screen-label="Hero">
          <div className="hero-card">
            <video className="hero-video" id="heroVideo" autoPlay loop muted playsInline poster="/assets/hero-poster.png">
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-scrim"></div>
            <div className="inner hero-content">
              <span className="hero-eyebrow reveal"><span className="dot"></span>{tl.heroEyebrow}</span>
              <h1 className="display reveal" data-delay="1">{tl.heroH1}</h1>
              <p className="sub reveal" data-delay="2">{tl.heroP}</p>
              <a className="btn btn-arrow on-light reveal" data-delay="3" href="#/forum">
                {connected ? tl.cta : tl.ctaGuest}
                <span className="circle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </a>
              <div className="hero-bottom reveal" data-delay="3">
                <div className="marquee hero-marquee">
                  <div className="marquee-track" id="heroMarquee"></div>
                </div>
              </div>
              <a className="scroll-hint" href="#meet" aria-label="Scroll down">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* MEET ORBIT */}
      <section className="section" id="meet" data-screen-label="Meet Orbit">
        <div className="inner">
          <div className="intro-row has-astros">
            <div className="intro-left">
              <h2 className="h2 reveal">{tl.meetH2}</h2>
              <a className="btn btn-arrow on-dark reveal" data-delay="1" href="#how">
                {tl.discoverIt}
                <span className="circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </a>
            </div>
            <div className="intro-astro reveal" data-delay="1"><img className="astro-mid" style={{ '--rot': '-3deg' }} src="/assets/blue.png" alt="Orbit astronaut" /></div>
            <p className="lede reveal" data-delay="1">{tl.meetLede}</p>
          </div>

          <div className="bento">
            <div className="cell span2 scene reveal">
              <img className="scene-bg" src="/assets/space.png" alt="" />
              <div className="scene-scrim"></div>
              <svg className="scene-lines" viewBox="0 0 660 460" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <line x1="430" y1="120" x2="540" y2="250" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 8" />
                <line x1="540" y1="250" x2="380" y2="370" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 8" />
                <line x1="430" y1="120" x2="380" y2="370" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 8" opacity=".6" />
                <circle cx="430" cy="120" r="3" fill="#fff" /><circle cx="540" cy="250" r="4" fill="#0090FF" /><circle cx="380" cy="370" r="3" fill="#fff" />
              </svg>
              <img className="scene-astro a-yellow" style={{ '--rot': '-6deg' }} src="/assets/yellow.png" alt="" />
              <img className="scene-astro a-purple" style={{ '--rot': '4deg' }} src="/assets/purple.png" alt="" />
              <span className="badge scene-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></span>
              <div className="scene-text">
                <h3 className="card-title">{tl.visibleWorkTitle}</h3>
                <p className="c-body">{tl.visibleWorkBody}</p>
              </div>
            </div>

            <div className="cell dark has-astro reveal" data-delay="1">
              <div className="c-top">
                <span className="card-title">{tl.identityTitle}</span>
                <span className="badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="3" /><path d="M2 10h20" /><circle cx="17.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" /></svg></span>
              </div>
              <img className="cell-astro" style={{ '--rot': '3deg' }} src="/assets/green.png" alt="" />
              <p className="c-body">{tl.identityBody}</p>
            </div>

            <div className="cell light has-astro reveal" data-delay="2">
              <div className="c-top">
                <span className="card-title">{tl.storedTitle}</span>
                <span className="badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg></span>
              </div>
              <img className="cell-astro" style={{ '--rot': '-3deg' }} src="/assets/red.png" alt="" />
              <p className="c-body">{tl.storedBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BACKED BY */}
      <section className="section tight" id="backed" data-screen-label="Backed by">
        <div className="inner backed">
          <p className="label reveal">{tl.backerLabel}</p>
          <div className="marquee backers-marquee reveal" data-delay="1">
            <div className="marquee-track" id="backersMarquee"></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how" data-screen-label="How it works">
        <div className="inner modes">
          <div className="modes-left">
            <span className="eyebrow reveal">{tl.howEyebrow}</span>
            <h2 className="h2 reveal" data-delay="1">{tl.howH2}</h2>
            <p className="desc reveal" data-delay="1">{tl.howDesc}</p>
            <ol className="steps">
              <li className="reveal" data-delay="1"><span className="n">01</span><div><h4>{tl.step1H}</h4><p>{tl.step1P}</p></div></li>
              <li className="reveal" data-delay="2"><span className="n">02</span><div><h4>{tl.step2H}</h4><p>{tl.step2P}</p></div></li>
              <li className="reveal" data-delay="3"><span className="n">03</span><div><h4>{tl.step3H}</h4><p>{tl.step3P}</p></div></li>
            </ol>
          </div>

          <div className="modes-card reveal" data-delay="1">
            <video autoPlay loop muted playsInline poster="/assets/hero-end.png">
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>
            <div className="scrim"></div>
            <div className="mc-content">
              <h3 className="h3">{tl.mcH3}</h3>
              <p>{tl.mcP}</p>
              <a className="link-arrow" href="#join">
                <span className="circle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                {tl.readDocs}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="section" id="voices" data-screen-label="Voices">
        <div className="inner">
          <div className="voices-header reveal">
            <span className="eyebrow">{tl.voicesEyebrow}</span>
            <h2 className="h2" style={{ marginTop: 8 }}>{tl.voicesH2}</h2>
            <p className="voices-lede">{tl.voicesLede}</p>
          </div>
          <figure className="voice voice--featured reveal">
            <blockquote className="quote">{tl.quote1}</blockquote>
            <figcaption className="by">
              <img className="av av--photo" src="/assets/olga ramos.jpeg" alt="Olga Ramos" />
              <div className="by-text">
                <div className="name">Olga Ramos</div>
                <div className="voice-role">Filecoin Ambassador · <a href="https://x.com/0lga_tech" target="_blank" rel="noopener noreferrer" className="voice-x">@0lga_tech</a></div>
                <div className="city">Lima, Perú</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="section" id="join" data-screen-label="Join" style={{ paddingTop: 0 }}>
        <div className="inner">
          <div className="join-card reveal">
            <img className="join-art" src="/assets/ready-voice-v3.png" alt="Ready to add your voice? Report, propose, debate, research and connect — all through Orbit." />
            <a className="btn btn-arrow on-light join-cta" href="#/forum">
              {tl.joinCta}
              <span className="circle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </a>
          </div>
          <p className="fine">{tl.notAmbassador} <a href="#">{tl.applyLink}</a></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="inner">
          <div className="footer-top">
            <div className="brand-block">
              <a className="brand" href="#top">
                <svg className="logo" width="38" height="38" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                  <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
                  <circle cx="128" cy="128" r="33" fill="currentColor" /><circle cx="173" cy="69" r="17" fill="currentColor" />
                </svg>
                <span className="word">Orbit</span>
              </a>
              <p className="tag">{tl.footerTag}</p>
            </div>
            <div className="footer-col"><h5>{tl.product}</h5><a href="#">Forum</a><a href="#">Reports</a><a href="#">Projects</a></div>
            <div className="footer-col"><h5>{tl.community}</h5><a href="#">Discord</a><a href="#">GitHub</a><a href="#">X</a></div>
            <div className="footer-col"><h5>{tl.governance}</h5><a href="#">FIPs</a><a href="#">Metropolis</a><a href="#">Constellation</a></div>
            <div className="footer-col"><h5>{tl.legal}</h5><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Conduct</a></div>
          </div>
          <div className="footer-bottom">
            <span>{tl.footerBottom}</span>
            <div className="socials">
              <a href="#" aria-label="X"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
              <a href="#" aria-label="GitHub"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z" /></svg></a>
              <a href="#" aria-label="Discord"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.2.358-.43.84-.59 1.222a18.27 18.27 0 00-5.487 0A12.6 12.6 0 009.21 3a19.74 19.74 0 00-4.43 1.369C1.99 8.59 1.225 12.7 1.6 16.75a19.94 19.94 0 006.073 3.07c.49-.668.927-1.377 1.302-2.122a12.9 12.9 0 01-2.05-.984c.172-.126.34-.258.502-.394 3.95 1.84 8.22 1.84 12.122 0 .164.14.332.272.502.394-.654.388-1.345.72-2.052.984.375.745.81 1.453 1.3 2.122a19.9 19.9 0 006.075-3.07c.44-4.69-.752-8.766-3.158-12.381zM8.02 14.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.955 2.42-2.157 2.42zm7.96 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.946 2.42-2.157 2.42z" /></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
