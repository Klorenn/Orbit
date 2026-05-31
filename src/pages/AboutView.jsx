import { useEffect } from 'react'
import { who } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'

export function AboutView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const team = ['orbit-team.fil', 'olga.fil', 'mira.fil', 'devi.fil', 'tunde.fil', 'kwame.fil']
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <div className="about-hero">
        <div className="ah-stars"><Stars n={14} /></div>
        <div className="ah-inner">
          <span className="cn-badge">{I.shield()} On-chain governance · Filecoin Orbit</span>
          <h1>A constellation of voices, building Filecoin together.</h1>
          <p>Orbit is the wallet-gated forum where Filecoin Orbit ambassadors publish reports, propose projects, and govern transparently — with every contribution pinned to IPFS and persisted on Filecoin.</p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(0,144,255,.1)', color: '#0090FF' }}>{I.pin()}</span>
          <h3>Our mission</h3>
          <p>Make the ambassadors' work visible. No more reports trapped in Airtable, conversations lost in Slack, or docs siloed on Drive — one open, on-chain record of the community's work.</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(168,85,247,.1)', color: '#A855F7' }}>{I.gov()}</span>
          <h3>How we govern</h3>
          <p>Anyone can read. Holders of the Orbit Ambassador NFT post, comment, and vote. Proposals that reach rough consensus are promoted to Metropolis for formal FIP signaling.</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(16,185,129,.1)', color: '#10B981' }}>{I.check()}</span>
          <h3>Eat our own dog food</h3>
          <p>Every report and attachment is pinned to IPFS and paid for via Filecoin storage deals. A community building decentralized storage shouldn't coordinate on Google Drive.</p>
        </div>
      </div>

      <h3 className="section-h">Aligned with the Constellation Program</h3>
      <p className="page-sub">Orbit is a contribution to the Filecoin Foundation's Constellation Program for modernizing governance. It complements Metropolis (FIP signaling) and fills the gap for ambassador activity and project debate.</p>
      <div className="logos-row">
        {['Filecoin Foundation', 'Protocol Labs', 'IPFS', 'FVM', 'Metropolis'].map(l => <span key={l} className="logo-chip">{l}</span>)}
      </div>

      <h3 className="section-h">The stewards</h3>
      <div className="team-grid">
        {team.map(t => { const u = who(t); return (
          <a key={t} className="team-card" href={'#/profile/' + u.name}>
            <AmbassadorAvatar user={t} size={52} link={false} nft />
            <div className="tc-name">{u.name}</div>
            <div className="tc-role">{u.role} · {u.city}</div>
          </a>
        )})}
      </div>
    </div>
  )
}
