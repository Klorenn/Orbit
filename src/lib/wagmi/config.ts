import { http, createConfig } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const filecoin = defineChain({
  id: 314,
  name: "Filecoin",
  nativeCurrency: {
    decimals: 18,
    name: "Filecoin",
    symbol: "FIL",
  },
  rpcUrls: {
    default: { http: ["https://api.node.glif.io/rpc/v1"] },
  },
  blockExplorers: {
    default: {
      name: "Filfox",
      url: "https://filfox.info/en",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 3328594,
    },
  },
});

export const filecoinCalibration = defineChain({
  id: 314159,
  name: "Filecoin Calibration",
  nativeCurrency: {
    decimals: 18,
    name: "Test Filecoin",
    symbol: "tFIL",
  },
  rpcUrls: {
    default: {
      http: ["https://api.calibration.node.glif.io/rpc/v1"],
    },
  },
  blockExplorers: {
    default: {
      name: "Filfox Calibration",
      url: "https://calibration.filfox.info/en",
    },
  },
  testnet: true,
});

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function hasWalletConnect() {
  return !!projectId;
}

export function getWagmiConfig() {
  if (!projectId) return null;

  return getDefaultConfig({
    appName: "Orbit — Filecoin Governance Forum",
    projectId,
    chains: [filecoin, filecoinCalibration],
    ssr: true,
  });
}
