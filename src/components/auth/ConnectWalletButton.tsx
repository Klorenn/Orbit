"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { hasWalletConnect } from "@/lib/wagmi/config";
import Link from "next/link";

export function ConnectWalletButton() {
  if (!hasWalletConnect()) {
    return (
      <Link
        href="/connect"
        className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="6"
            width="19"
            height="13"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M2.5 10h19" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
        </svg>
        Connect Wallet
      </Link>
    );
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <button
            type="button"
            onClick={connected ? undefined : openConnectModal}
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2.5"
                y="6"
                width="19"
                height="13"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M2.5 10h19" stroke="currentColor" strokeWidth="2" />
              <circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
            </svg>
            {!ready && <span>Loading...</span>}
            {ready && !connected && <span>Connect Wallet</span>}
            {connected && <span>{account.displayName}</span>}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
