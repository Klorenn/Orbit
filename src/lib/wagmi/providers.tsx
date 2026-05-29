"use client";

import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getWagmiConfig, hasWalletConnect } from "./config";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: ReactNode }) {
  if (!hasWalletConnect()) {
    return <>{children}</>;
  }

  const config = getWagmiConfig();
  if (!config) return <>{children}</>;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
