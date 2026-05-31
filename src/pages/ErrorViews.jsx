import { useEffect } from 'react'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { useT } from '../hooks/useT'

export function Error404View() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  return (
    <div className="page-wrap notfound">
      <img className="nf-img" src="assets/404.png" alt="404 — page not found" />
      <h1 className="nf-title">{t('lostInSpace')}</h1>
      <p className="nf-sub">{t('pageNotFoundSub')}</p>
      <div className="nf-actions">
        <a className="pill pill-solid" href="#/forum">{I.back()} {t('backToForum')}</a>
        <a className="pill pill-line" href="#/search">{I.search()} {t('searchInstead')}</a>
      </div>
    </div>
  )
}

export function Error500View() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  return (
    <div className="page-wrap notfound">
      <div className="util-badge" style={{ background: 'rgba(255,59,48,.12)', color: '#FF3B30' }}>{I.shield()} 500 · Server error</div>
      <h1 className="nf-title">{t('somethingWentSideways')}</h1>
      <p className="nf-sub">{t('serverErrorSub')}</p>
      <div className="nf-actions">
        <button className="pill pill-solid" onClick={() => location.reload()}>{t('reload')}</button>
        <a className="pill pill-line" href="#/forum">{I.back()} {t('backToForum')}</a>
      </div>
    </div>
  )
}

export function MaintenanceView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  return (
    <div className="maint-screen">
      <div className="maint-stars"><Stars n={14} /></div>
      <div className="maint-inner">
        <div className="util-badge" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>{I.shield()} {t('maintenanceBadge')}</div>
        <h1>{t('maintenanceTitle')}</h1>
        <p>{t('maintenanceSub')}</p>
        <a className="pill pill-blue" href="#/forum" style={{ padding: '12px 26px' }}>{t('checkAgain')}</a>
      </div>
    </div>
  )
}
