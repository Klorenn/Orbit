import { useEffect } from 'react'
import { who } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { useT } from '../hooks/useT'

export function AboutView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const team = ['orbit-team.fil', 'olga.fil', 'mira.fil', 'devi.fil', 'tunde.fil', 'kwame.fil']
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <div className="about-hero">
        <div className="ah-stars"><Stars n={14} /></div>
        <div className="ah-inner">
          <span className="cn-badge">{I.shield()} {t('aboutHeroTag')}</span>
          <h1>{t('aboutHeroH1')}</h1>
          <p>{t('aboutHeroP')}</p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(0,144,255,.1)', color: '#0090FF' }}>{I.pin()}</span>
          <h3>{t('missionTitle')}</h3>
          <p>{t('missionBody')}</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(168,85,247,.1)', color: '#A855F7' }}>{I.gov()}</span>
          <h3>{t('governTitle')}</h3>
          <p>{t('governBody')}</p>
        </div>
        <div className="about-card">
          <span className="ac-ic" style={{ background: 'rgba(16,185,129,.1)', color: '#10B981' }}>{I.check()}</span>
          <h3>{t('dogfoodTitle')}</h3>
          <p>{t('dogfoodBody')}</p>
        </div>
      </div>

      <h3 className="section-h">{t('alignedTitle')}</h3>
      <p className="page-sub">{t('alignedSub')}</p>
      <div className="logos-row">
        {['Filecoin Foundation', 'Protocol Labs', 'IPFS', 'FVM', 'Metropolis'].map(l => <span key={l} className="logo-chip">{l}</span>)}
      </div>

      <h3 className="section-h">{t('stewardsTitle')}</h3>
      <div className="team-grid">
        {team.map(id => { const u = who(id); return (
          <a key={id} className="team-card" href={'#/profile/' + u.name}>
            <AmbassadorAvatar user={id} size={52} link={false} nft />
            <div className="tc-name">{u.name}</div>
            <div className="tc-role">{u.role} · {u.city}</div>
          </a>
        )})}
      </div>
    </div>
  )
}
