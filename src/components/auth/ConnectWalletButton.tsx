"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <button
            type="button"
            onClick={connected ? undefined : openConnectModal}
            className="nav-pill bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
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
            {connected && (
              <span>
                {account.displayName}
              </span>
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
