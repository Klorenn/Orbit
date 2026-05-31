import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
  appName: 'Orbit Forum',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [filecoin, filecoinCalibration],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
  ssr: false,
})
