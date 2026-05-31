import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useT } from '../hooks/useT'

export function WalletGate({ connected, onConnect, label, children }) {
  const { t } = useT()
  if (connected) return <>{children}</>
  return (
    <div className="wallet-gate">
      <p className="wg-label">{label || t('connect')}</p>
      <ConnectButton label={t('connectWalletLabel')} />
      <div className="wg-sep"><span>or</span></div>
      <button className="pill pill-line" onClick={onConnect}>{t('signInWithEmail')}</button>
    </div>
  )
}
