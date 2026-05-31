import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Stars } from '../components/Stars'
import { I } from '../components/Icons'
import { supabase } from '../lib/supabase'

export function ConnectView() {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const send = async () => {
    if (!email.trim() || phase === 'sending') return
    setPhase('sending')
    setErrMsg('')
    const redirectTo = window.location.href.split('#')[0]
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (error) { setPhase('error'); setErrMsg(error.message) }
    else setPhase('sent')
  }

  return (
    <div className="page-wrap connect-page">
      <div className="connect-card">
        <div className="cn-stars"><Stars n={14} /></div>
        <div className="cn-inner">
          <h1>Join the constellation</h1>
          <p>Reading is open to everyone. Sign in to post, comment, and vote.</p>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 600, marginBottom: 10 }}>Option 1 — Connect your wallet</p>
            <ConnectButton label="Connect wallet" />
          </div>

          <div className="wg-sep"><span>or</span></div>

          <p style={{ fontWeight: 600, margin: '16px 0 10px' }}>Option 2 — Sign in with email</p>
          {phase === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <span className="cn-badge">{I.check()} Magic link sent</span>
              <p>Check <b>{email}</b> and click the link.</p>
            </div>
          ) : (
            <>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder="you@example.com" style={{ width: '100%', marginBottom: 10 }} />
              {phase === 'error' && <p style={{ color: '#FF3B30', fontSize: 14 }}>{errMsg}</p>}
              <button className="pill pill-line" style={{ width: '100%', opacity: email.trim() ? 1 : 0.5 }} onClick={send}>
                {phase === 'sending' ? 'Sending…' : 'Send magic link'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
