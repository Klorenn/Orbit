import { useEffect } from 'react'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'

export function Error404View() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="page-wrap notfound">
      <img className="nf-img" src="assets/404.png" alt="404 — page not found" />
      <h1 className="nf-title">Lost in space.</h1>
      <p className="nf-sub">This page drifted out of orbit — it doesn't exist or has moved.</p>
      <div className="nf-actions">
        <a className="pill pill-solid" href="#/forum">{I.back()} Back to the forum</a>
        <a className="pill pill-line" href="#/search">{I.search()} Search instead</a>
      </div>
    </div>
  )
}

export function Error500View() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="page-wrap notfound">
      <div className="util-badge" style={{ background: 'rgba(255,59,48,.12)', color: '#FF3B30' }}>{I.shield()} 500 · Server error</div>
      <h1 className="nf-title">Something went sideways.</h1>
      <p className="nf-sub">A signal got lost in transit. Our nodes are on it — try again in a moment.</p>
      <div className="nf-actions">
        <button className="pill pill-solid" onClick={() => location.reload()}>Reload</button>
        <a className="pill pill-line" href="#/forum">{I.back()} Back to the forum</a>
      </div>
    </div>
  )
}

export function MaintenanceView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="maint-screen">
      <div className="maint-stars"><Stars n={14} /></div>
      <div className="maint-inner">
        <div className="util-badge" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>{I.shield()} Scheduled maintenance</div>
        <h1>We're re-pinning the constellation.</h1>
        <p>Orbit is briefly offline for a storage upgrade. Your data is safe on Filecoin — we'll be back shortly.</p>
        <a className="pill pill-blue" href="#/forum" style={{ padding: '12px 26px' }}>Check again</a>
      </div>
    </div>
  )
}
