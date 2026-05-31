import { useEffect } from 'react'

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

export function LandingView() {
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

  return (
    <div className="page">
      {/* NAV + HERO WRAPPER */}
      <div className="hero-wrap">
        <nav className="nav">
          <div className="inner nav-row">
            <a className="brand" href="#top" aria-label="Orbit home">
              <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
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
            <button className="nav-pill" type="button" onClick={() => { window.location.hash = '#/forum' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="6" width="19" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M2.5 10h19" stroke="currentColor" strokeWidth="2" /><circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
              </svg>
              <span className="lbl">Connect Wallet</span>
            </button>
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
              <span className="hero-eyebrow reveal"><span className="dot"></span>The Filecoin ambassador forum</span>
              <h1 className="display reveal" data-delay="1">A constellation of voices, building Filecoin together.</h1>
              <p className="sub reveal" data-delay="2">The wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and shape the future of decentralized storage — transparently, on-chain.</p>
              <a className="btn btn-arrow on-light reveal" data-delay="3" href="#/forum">
                Connect Wallet to Join
                <span className="circle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </a>
              <div className="hero-bottom reveal" data-delay="3">
                <div className="marquee hero-marquee">
                  <div className="marquee-track" id="heroMarquee"></div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* MEET ORBIT */}
      <section className="section" id="meet" data-screen-label="Meet Orbit">
        <div className="inner">
          <div className="intro-row has-astros">
            <div className="intro-left">
              <h2 className="h2 reveal">Meet Orbit.</h2>
              <a className="btn btn-arrow on-dark reveal" data-delay="1" href="#how">
                Discover it
                <span className="circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </a>
            </div>
            <div className="intro-astro reveal" data-delay="1"><img className="astro-mid" style={{ '--rot': '-3deg' }} src="/assets/blue.png" alt="Orbit astronaut" /></div>
            <p className="lede reveal" data-delay="1">Orbit is the wallet-gated forum where Filecoin ambassadors publish their work in the open — reports, proposals, and debate, all anchored to real on-chain identity.</p>
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
                <h3 className="card-title">Visible work, finally</h3>
                <p className="c-body">Every event report and proposal lives in one public forum — readable by anyone, attributed to a real on-chain identity. No more work trapped in Airtable, Slack, or Drive.</p>
              </div>
            </div>

            <div className="cell dark has-astro reveal" data-delay="1">
              <div className="c-top">
                <span className="card-title">Identity without paperwork</span>
                <span className="badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="3" /><path d="M2 10h20" /><circle cx="17.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" /></svg></span>
              </div>
              <img className="cell-astro" style={{ '--rot': '3deg' }} src="/assets/green.png" alt="" />
              <p className="c-body">Sign in with your wallet. No emails, no passwords, no central gatekeeper — your wallet is your key.</p>
            </div>

            <div className="cell light has-astro reveal" data-delay="2">
              <div className="c-top">
                <span className="card-title">Stored on Filecoin</span>
                <span className="badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg></span>
              </div>
              <img className="cell-astro" style={{ '--rot': '-3deg' }} src="/assets/red.png" alt="" />
              <p className="c-body">Reports and evidence are pinned to IPFS and persisted through Filecoin storage deals. We eat our own dog food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BACKED BY */}
      <section className="section tight" id="backed" data-screen-label="Backed by">
        <div className="inner backed">
          <p className="label reveal">Aligned with the Constellation Program — and the people modernizing Filecoin governance.</p>
          <div className="marquee backers-marquee reveal" data-delay="1">
            <div className="marquee-track" id="backersMarquee"></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how" data-screen-label="How it works">
        <div className="inner modes">
          <div className="modes-left">
            <span className="eyebrow reveal">Orbit in practice</span>
            <h2 className="h2 reveal" data-delay="1">How it works</h2>
            <p className="desc reveal" data-delay="1">Three steps, no friction. Connect once, and your identity, your posts, and your votes all travel with your wallet.</p>
            <ol className="steps">
              <li className="reveal" data-delay="1"><span className="n">01</span><div><h4>Connect your wallet</h4><p>Sign-in with Ethereum. No emails, no passwords — your wallet is your identity.</p></div></li>
              <li className="reveal" data-delay="2"><span className="n">02</span><div><h4>Verified by NFT</h4><p>Hold the Orbit Ambassador NFT to post reports and proposals. Anyone can read; members shape the record.</p></div></li>
              <li className="reveal" data-delay="3"><span className="n">03</span><div><h4>Govern transparently</h4><p>Proposals, signaling, and outcomes are all on-chain — pinned to IPFS, persisted on Filecoin.</p></div></li>
            </ol>
          </div>

          <div className="modes-card reveal" data-delay="1">
            <video autoPlay loop muted playsInline poster="/assets/hero-end.png">
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>
            <div className="scrim"></div>
            <div className="mc-content">
              <h3 className="h3">Connect. Post. Govern.</h3>
              <p>From a field event in Santiago to a protocol proposal — the whole arc of an ambassador's work happens in one place, in the open, owned by the community that made it.</p>
              <a className="link-arrow" href="#join">
                <span className="circle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                Read the docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="section" id="voices" data-screen-label="Voices">
        <div className="inner">
          <div className="intro-row" style={{ marginBottom: 0 }}>
            <div className="intro-left">
              <span className="eyebrow reveal">From the ambassadors</span>
              <h2 className="h2 reveal" data-delay="1" style={{ marginTop: 8 }}>Voices from the constellation.</h2>
            </div>
            <p className="lede reveal" data-delay="1">Hundreds of ambassadors across dozens of cities — finally sharing one record of the work.</p>
          </div>
          <div className="voices-grid">
            <figure className="voice reveal">
              <blockquote className="quote">"Finally I can see what other ambassadors are building."</blockquote>
              <figcaption className="by"><span className="av" style={{ background: '#0090FF' }}></span><span><span className="name">Olga</span><br /><span className="city">Santiago, Chile</span></span></figcaption>
            </figure>
            <figure className="voice reveal" data-delay="1">
              <blockquote className="quote">"Wallet-gating means real identity without the paperwork."</blockquote>
              <figcaption className="by"><span className="av" style={{ background: '#FFD60A' }}></span><span><span className="name">Kwame</span><br /><span className="city">Accra, Ghana</span></span></figcaption>
            </figure>
            <figure className="voice reveal" data-delay="2">
              <blockquote className="quote">"Our reports live on Filecoin now. As they should."</blockquote>
              <figcaption className="by"><span className="av" style={{ background: '#A855F7' }}></span><span><span className="name">Mira</span><br /><span className="city">Lisbon, Portugal</span></span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="section" id="join" data-screen-label="Join" style={{ paddingTop: 0 }}>
        <div className="inner">
          <div className="join-card reveal">
            <img className="join-art" src="/assets/ready-voice-v3.png" alt="Ready to add your voice? Report, propose, debate, research and connect — all through Orbit." />
            <a className="btn btn-arrow on-light join-cta" href="#/forum">
              Connect Wallet
              <span className="circle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </a>
          </div>
          <p className="fine">Don't have the NFT yet? <a href="#">Apply to the Orbit Program →</a></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="inner">
          <div className="footer-top">
            <div className="brand-block">
              <a className="brand" href="#top">
                <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                  <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
                  <circle cx="128" cy="128" r="33" fill="currentColor" /><circle cx="173" cy="69" r="17" fill="currentColor" />
                </svg>
                <span className="word">Orbit</span>
              </a>
              <p className="tag">A constellation of voices.</p>
            </div>
            <div className="footer-col"><h5>Product</h5><a href="#">Forum</a><a href="#">Reports</a><a href="#">Projects</a></div>
            <div className="footer-col"><h5>Community</h5><a href="#">Discord</a><a href="#">GitHub</a><a href="#">X</a></div>
            <div className="footer-col"><h5>Governance</h5><a href="#">FIPs</a><a href="#">Metropolis</a><a href="#">Constellation</a></div>
            <div className="footer-col"><h5>Legal</h5><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Conduct</a></div>
          </div>
          <div className="footer-bottom">
            <span>Built on Filecoin · Stored on IPFS · © 2026 Orbit</span>
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
