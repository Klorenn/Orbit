"use client";

import { useConnect, useAccount } from "wagmi";
import { useState } from "react";
import Link from "next/link";

export default function ConnectPage() {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const [connecting, setConnecting] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full">
        <div className="text-center">
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
            {isConnected ? "Connected" : "Connect your wallet"}
          </h1>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            {isConnected
              ? `Wallet ${address?.slice(0, 6)}...${address?.slice(-4)} connected to Orbit.`
              : "Sign in with your wallet to access the forum, publish reports, and participate in governance."}
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              type="button"
              disabled={connecting === connector.id || isConnected}
              onClick={() => {
                setConnecting(connector.id);
                connect({ connector });
              }}
              className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <span className="w-10 h-10 rounded-full bg-gray-950 flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="2.5" y="6" width="19" height="13" rx="3" />
                  <path d="M2.5 10h19" />
                  <circle cx="17" cy="14.5" r="1.4" fill="white" stroke="none" />
                </svg>
              </span>
              <div className="flex-1">
                <span className="text-base font-semibold text-gray-950 block">
                  {connector.name}
                </span>
                <span className="text-sm text-gray-400">
                  {connector.id === "injected"
                    ? "Rainbow, MetaMask, or any browser wallet"
                    : "Connect via QR code"}
                </span>
              </div>
              {connecting === connector.id ? (
                <span className="text-sm text-gray-400">Connecting...</span>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          ))}

          {connectors.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No wallet detected.</p>
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-950 text-white pl-6 pr-2 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Install MetaMask
                <span className="w-[32px] h-[32px] rounded-full bg-white text-gray-950 grid place-items-center">
                  <svg
                    width="14"
                    height="14"
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
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Filecoin EVM compatible · No WalletConnect project ID required for
          browser wallets
        </p>
      </div>
    </div>
  );
}
