import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { I } from '../components/Icons'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'
import { navTo } from '../data/constants'

export function ConnectView({ connected }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [phase, setPhase] = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const { t } = useT()

  useEffect(() => {
    if (connected) navTo('#/forum')
  }, [connected])

  const submit = async () => {
    if (!email.trim() || !password.trim() || phase === 'loading') return
    setPhase('loading')
    setErrMsg('')

    let error
    if (mode === 'signup') {
      const res = await supabase.auth.signUp({ email: email.trim(), password: password.trim() })
      error = res.error
      if (!error) {
        const res2 = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() })
        error = res2.error
      }
    } else {
      const res = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() })
      error = res.error
    }

    if (error) {
      setPhase('error')
      if (error.message.toLowerCase().includes('invalid login')) {
        setErrMsg('Email o contraseña incorrectos.')
      } else if (error.message.toLowerCase().includes('already registered')) {
        setErrMsg('Ya existe una cuenta con ese email. Iniciá sesión.')
        setMode('signin')
      } else {
        setErrMsg(error.message)
      }
    } else {
      setPhase('done')
    }
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

            {phase === 'done' ? (
              <div className="cn-sent">
                <span className="cn-badge">{I.check()} {mode === 'signup' ? 'Cuenta creada' : 'Sesión iniciada'}</span>
                <p className="cn-sent-hint">Redirigiendo al foro…</p>
              </div>
            ) : (
              <div className="cn-email-form">
                <div className="cn-mode-toggle">
                  <button
                    type="button"
                    className={mode === 'signin' ? 'on' : ''}
                    onClick={() => { setMode('signin'); setErrMsg(''); setPhase('idle') }}
                  >Iniciar sesión</button>
                  <button
                    type="button"
                    className={mode === 'signup' ? 'on' : ''}
                    onClick={() => { setMode('signup'); setErrMsg(''); setPhase('idle') }}
                  >Crear cuenta</button>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit() }}
                  placeholder="you@example.com"
                  className="cn-email-input"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit() }}
                  placeholder={mode === 'signup' ? 'Elegí una contraseña' : 'Contraseña'}
                  className="cn-email-input"
                  style={{ marginTop: 8 }}
                />
                {phase === 'error' && <p className="cn-error">{errMsg}</p>}
                <button
                  type="button"
                  className="pill pill-blue cn-send-btn"
                  style={{ opacity: email.trim() && password.trim() ? 1 : 0.45 }}
                  onClick={submit}
                  disabled={phase === 'loading'}
                >
                  {phase === 'loading' ? '…' : mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
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
