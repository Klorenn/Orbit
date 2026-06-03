import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { I } from '../components/Icons'
import { useT } from '../hooks/useT'
import { navTo } from '../data/constants'

export function ConnectView({ connected }) {
  const { t } = useT()

  useEffect(() => {
    if (connected) navTo('#/forum')
  }, [connected])

  return (
    <div className="connect-page-full">
      <div className="connect-shell">
        <a className="cn-brand" href="#/forum">
          <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
            <circle cx="128" cy="128" r="33" fill="currentColor" />
            <circle cx="173" cy="69" r="17" fill="currentColor" />
          </svg>
          <span>Orbit</span>
        </a>

        <h1 className="cn-title">{t('joinConstellationTitle')}</h1>
        <p className="cn-filecoin-tag">{t('filecoinAmbassadorTag')}</p>
        <p className="cn-sub">{t('readingOpenAll')}</p>

        <div className="cn-options">
          <div className="cn-option">
            <div className="cn-opt-head">
              <span className="cn-opt-num">1</span>
              <div>
                <div className="cn-opt-label">{t('connectWalletLabel')}</div>
                <div className="cn-opt-desc">{t('identityBody')}</div>
              </div>
            </div>
            <div className="cn-opt-action">
              <ConnectButton label={t('connectWalletLabel')} />
            </div>
          </div>

          <div className="cn-divider"><span>or</span></div>

          <div className="cn-option cn-option--locked">
            <div className="cn-opt-head">
              <span className="cn-opt-num cn-opt-num--locked">2</span>
              <div>
                <div className="cn-opt-label">{t('connectEmailLabel')} <span className="cn-soon-badge">Próximamente</span></div>
                <div className="cn-opt-desc">{t('connectEmailDesc')}</div>
              </div>
            </div>
            <div className="cn-locked-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Esta opción estará disponible pronto
            </div>
          </div>
        </div>

        <p className="cn-note">{I.shield()} {t('connectNote')}</p>
        <a className="cn-guest" href="#/forum">{t('browseAsGuest')}</a>
      </div>
    </div>
  )
}
