import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { I } from '../components/Icons'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'
import { navTo } from '../data/constants'

export function ConnectView({ connected }) {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const { t } = useT()

  useEffect(() => {
    if (connected) navTo('#/forum')
  }, [connected])

  const send = async () => {
    if (!email.trim() || phase === 'sending') return
    setPhase('sending')
    setErrMsg('')
    const redirectTo = window.location.origin + '/'
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (error) { setPhase('error'); setErrMsg(error.message) }
    else setPhase('sent')
  }

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

          <div className="cn-option">
            <div className="cn-opt-head">
              <span className="cn-opt-num">2</span>
              <div>
                <div className="cn-opt-label">{t('connectEmailLabel')}</div>
                <div className="cn-opt-desc">{t('connectEmailDesc')}</div>
              </div>
            </div>
            {phase === 'sent' ? (
              <div className="cn-sent">
                <span className="cn-badge">{I.check()} {t('magicLinkSent')}</span>
                <p className="cn-sent-hint">{t('checkEmailHint')}</p>
              </div>
            ) : (
              <div className="cn-email-form">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') send() }}
                  placeholder="you@example.com"
                  className="cn-email-input"
                />
                {phase === 'error' && <p className="cn-error">{errMsg}</p>}
                <button
                  className="pill pill-blue cn-send-btn"
                  style={{ opacity: email.trim() ? 1 : 0.45 }}
                  onClick={send}
                >
                  {phase === 'sending' ? t('sendingLabel') : t('sendMagicLink')}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="cn-note">{I.shield()} {t('connectNote')}</p>
        <a className="cn-guest" href="#/forum">{t('browseAsGuest')}</a>
      </div>
    </div>
  )
}
