// src/components/Navbar.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { I } from './Icons'

export function Navbar({ route, connected, onCompose, onConnect, onWallet, onSignOut, unread }) {
  return (
    <nav className="topbar">
      <a className="logo" href="#/forum">
        <span className="logo-mark">◈</span>
        <span className="logo-text">Orbit</span>
      </a>
      <div className="nav-links">
        <a href="#/forum" className={route.view?.startsWith('forum') ? 'on' : ''}>Forum</a>
        <a href="#/proposals" className={route.view === 'proposals' ? 'on' : ''}>Proposals</a>
        <a href="#/events" className={route.view === 'events' ? 'on' : ''}>Events</a>
        <a href="#/ambassadors" className={route.view === 'ambassadors' ? 'on' : ''}>Ambassadors</a>
        <a href="#/meetings" className={route.view?.startsWith('meeting') ? 'on' : ''}>Meetings</a>
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
          </>
        )}
        {!connected && (
          <button className="pill pill-line" onClick={onConnect}>Sign in</button>
        )}
        <ConnectButton showBalance={false} chainStatus="none" />
      </div>
    </nav>
  )
}
