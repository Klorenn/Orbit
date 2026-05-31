// src/components/WalletGate.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletGate({ connected, onConnect, label = 'Connect to continue', children }) {
  if (connected) return <>{children}</>
  return (
    <div className="wallet-gate">
      <p className="wg-label">{label}</p>
      <ConnectButton label="Connect wallet" />
      <div className="wg-sep"><span>or</span></div>
      <button className="pill pill-line" onClick={onConnect}>Sign in with email</button>
    </div>
  )
}
