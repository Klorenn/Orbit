import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { http } from 'wagmi'

// Fallback prevents crash when .env is not configured yet.
// WalletConnect connections will fail until a real project ID is set.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'orbit-forum-dev-placeholder'

export const wagmiConfig = getDefaultConfig({
  appName: 'Orbit Forum',
  projectId,
  chains: [filecoin, filecoinCalibration],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
  ssr: false,
})
