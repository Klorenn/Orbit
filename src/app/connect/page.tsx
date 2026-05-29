"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { hasWalletConnect } from "@/lib/wagmi/config";
import Link from "next/link";

export default function ConnectPage() {
  if (!hasWalletConnect()) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gray-950 mx-auto flex items-center justify-center mb-8">
            <svg
              className="w-9 h-9 text-white"
              viewBox="0 0 256 256"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="128"
                cy="128"
                rx="98"
                ry="52"
                transform="rotate(-20 128 128)"
                stroke="currentColor"
                strokeWidth="15"
              />
              <circle cx="128" cy="128" r="33" fill="currentColor" />
              <circle cx="173" cy="69" r="17" fill="currentColor" />
            </svg>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-gray-950">
            Connect your wallet
          </h1>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Sign in with your Ethereum wallet to access the forum, publish
            reports, and participate in governance. WalletConnect coming soon
            — MetaMask already supported.
          </p>

          <div className="mt-10 space-y-4">
            <Link
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gray-950 text-white pl-7 pr-6 py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-colors"
            >
              Install MetaMask
              <span className="w-[38px] h-[38px] rounded-full bg-white text-gray-950 grid place-items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>

            <p className="text-sm text-gray-400">
              WalletConnect requires a project ID. Set{" "}
              <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
              </code>{" "}
              in your environment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gray-950 mx-auto flex items-center justify-center mb-8">
          <svg
            className="w-9 h-9 text-white"
            viewBox="0 0 256 256"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="128"
              cy="128"
              rx="98"
              ry="52"
              transform="rotate(-20 128 128)"
              stroke="currentColor"
              strokeWidth="15"
            />
            <circle cx="128" cy="128" r="33" fill="currentColor" />
            <circle cx="173" cy="69" r="17" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-gray-950">
          Connect your wallet
        </h1>
        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
          Sign in with your Ethereum wallet to access the forum, publish
          reports, and participate in governance.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <button
                type="button"
                onClick={openConnectModal}
                className="inline-flex items-center gap-3 bg-gray-950 text-white pl-7 pr-2 py-2 rounded-full font-medium text-base hover:bg-gray-800 transition-colors"
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
                {!mounted ? "Loading..." : "Connect Wallet"}
                <span className="w-[38px] h-[38px] rounded-full bg-white text-gray-950 grid place-items-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            )}
          </ConnectButton.Custom>

          <p className="text-sm text-gray-400 mt-4">
            Powered by RainbowKit · Filecoin EVM compatible
          </p>
        </div>
      </div>
    </div>
  );
}
