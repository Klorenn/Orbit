import { useState, useRef, useEffect } from 'react'

import { I } from './Icons'
import { AV } from '../data/constants'
import { T } from '../i18n'

const NAV = {
  es: [
    ['Foro', '/forum'],
    ['Reuniones', '/meetings'],
    ['Eventos', '/events'],
    ['Propuestas', '/proposals'],
    ['Embajadores', '/ambassadors'],
    ['Docs', '/docs'],
    ['Blog', '/blog'],
  ],
  en: [
    ['Forum', '/forum'],
    ['Meetings', '/meetings'],
    ['Events', '/events'],
    ['Proposals', '/proposals'],
    ['Ambassadors', '/ambassadors'],
    ['Docs', '/docs'],
    ['Blog', '/blog'],
  ],
}

function isActive(view, href) {
  if (href === '/forum') return view?.startsWith('forum')
  if (href === '/meetings') return view?.startsWith('meeting')
  if (href === '/events') return view === 'events' || view === 'event-detail'
  if (href === '/proposals') return view === 'proposals' || view === 'proposal-detail'
  if (href === '/ambassadors') return view === 'ambassadors'
  if (href === '/docs') return view === 'docs'
  if (href === '/blog') return view === 'blog'
  return false
}

function ProfileChip({ identity, address, fullAddress, myAvatar, onSignOut, unread, isAdmin }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('orbit-lang') || 'es')
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    const toCopy = fullAddress || address
    if (!toCopy) return
    navigator.clipboard.writeText(toCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('orbit-theme', next ? 'dark' : 'light')
  }

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es'
    setLang(next)
    localStorage.setItem('orbit-lang', next)
    window.dispatchEvent(new CustomEvent('orbit-lang', { detail: next }))
  }

  const avatarSrc = AV[myAvatar] || AV.blue

  return (
    <div className="profile-chip-wrap" ref={ref}>
      <button className="profile-chip" onClick={() => setOpen(o => !o)}>
        <img className="chip-av" src={avatarSrc} alt="" />
        <div className="chip-info">
          <span className="chip-name">{identity || 'you.fil'}</span>
          {address && address !== identity && <span className="chip-addr">{address}</span>}
        </div>
        <svg className="chip-caret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="profile-dropdown">
          {(fullAddress || address) && (
            <div className="pd-header">
              <span className="pd-h-name">{identity}</span>
              <button className="pd-h-addr" onClick={copyAddress} title={lang === 'es' ? 'Copiar dirección' : 'Copy address'}>
                {copied
                  ? (lang === 'es' ? '✓ Copiado' : '✓ Copied')
                  : <>…{(fullAddress || address || '').slice(-4)}</>
                }
              </button>
            </div>
          )}
          <div className="pd-sep" />
          <a className="pd-item" href="/profile/me" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            {(T[lang] || T.es).myProfile}
          </a>
          <a className="pd-item" href="/profile/me/posts" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {(T[lang] || T.es).myPosts}
          </a>
          <a className="pd-item" href="/saved" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
            {(T[lang] || T.es).saved}
          </a>
          <a className="pd-item" href="/profile/me/notifications" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
            {(T[lang] || T.es).notifications}
            {unread > 0 && <span className="pd-badge">{unread}</span>}
          </a>
          <a className="pd-item" href="/profile/me/settings" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
            {(T[lang] || T.es).settings}
          </a>
          <div className="pd-sep" />
          <button className="pd-item" onClick={toggleDark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            {(T[lang] || T.es).darkMode}
            <span className="pd-toggle">{dark ? 'On' : 'Off'}</span>
          </button>
          <button className="pd-item" onClick={toggleLang}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
            {lang === 'es' ? 'English' : 'Español'}
          </button>
          {isAdmin && <>
            <div className="pd-sep" />
            <a className="pd-item" href="/admin" onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
              {(T[lang] || T.es).adminPanel}
            </a>
          </>}
          <div className="pd-sep" />
          <button className="pd-item pd-danger" onClick={() => { setOpen(false); onSignOut() }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            {(T[lang] || T.es).signOut}
          </button>
        </div>
      )}
    </div>
  )
}

function PrefsButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('orbit-lang') || 'es')

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    const handler = (e) => setLang(e.detail)
    window.addEventListener('orbit-lang', handler)
    return () => window.removeEventListener('orbit-lang', handler)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('orbit-theme', next ? 'dark' : 'light')
  }

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es'
    setLang(next)
    localStorage.setItem('orbit-lang', next)
    window.dispatchEvent(new CustomEvent('orbit-lang', { detail: next }))
  }

  return (
    <div className="prefs-wrap" ref={ref}>
      <button className="nav-icon" onClick={() => setOpen(o => !o)} title={lang === 'es' ? 'Preferencias' : 'Preferences'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div className="prefs-dropdown">
          <button className="pd-item" onClick={toggleDark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            {(T[lang] || T.es).darkMode}
            <span className="pd-toggle">{dark ? 'On' : 'Off'}</span>
          </button>
          <button className="pd-item" onClick={toggleLang}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
            {lang === 'es' ? 'English' : 'Español'}
          </button>
        </div>
      )}
    </div>
  )
}

export function Navbar({ route, connected, identity, address, fullAddress, myAvatar, isAdmin, onCompose, onConnect, onWallet, onSignOut, unread }) {
  const [lang, setLang] = useState(() => localStorage.getItem('orbit-lang') || 'es')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => setLang(e.detail)
    window.addEventListener('orbit-lang', handler)
    return () => window.removeEventListener('orbit-lang', handler)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      const close = () => setMobileOpen(false)
      window.addEventListener('hashchange', close)
      return () => window.removeEventListener('hashchange', close)
    }
  }, [mobileOpen])

  const links = NAV[lang] || NAV.es
  const newPostLabel = lang === 'es' ? 'Nueva entrada' : 'New post'

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <a className="fbrand" href="/">
          <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
            <circle cx="128" cy="128" r="33" fill="currentColor" />
            <circle cx="173" cy="69" r="17" fill="currentColor" />
          </svg>
          <span className="word">Orbit</span>
        </a>

        <div className="topnav">
          {links.map(([label, href]) => (
            <a key={href} href={href} className={isActive(route.view, href) ? 'on' : ''}>{label}</a>
          ))}
        </div>

        {mobileOpen && (
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)}>
            <div className="mobile-nav-panel" onClick={e => e.stopPropagation()}>
              {links.map(([label, href]) => (
                <a key={href} href={href} className={isActive(route.view, href) ? 'on' : ''} onClick={() => setMobileOpen(false)}>{label}</a>
              ))}
            </div>
          </div>
        )}

        <div className="topbar-right">
          <button className="nav-burger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <a href="/search" className="nav-icon">{I.search()}</a>

          {connected ? (
            <>
              <a href="/profile/me/notifications" className="nav-icon notif-wrap">
                {I.bell()}
                {unread > 0 && <span className="notif-badge">{unread}</span>}
              </a>
              <button className="pill pill-blue" onClick={onCompose}>{I.plus()} <span>{newPostLabel}</span></button>
              <ProfileChip identity={identity} address={address} fullAddress={fullAddress} myAvatar={myAvatar} isAdmin={isAdmin} onSignOut={onSignOut} unread={unread} />
            </>
          ) : (
            <>
              <PrefsButton />
              <button className="pill pill-line" onClick={onConnect}>{(T[lang] || T.es).signIn}</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
