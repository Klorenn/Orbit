"use client";

import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useState } from "react";

export function ConnectWalletButton() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2">
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-red-500 font-medium"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
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
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <rect x="2.5" y="6" width="19" height="13" rx="3" />
                    <path d="M2.5 10h19" />
                  </svg>
                </span>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-950 block">
                    {connector.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {connector.id === "injected"
                      ? "Rainbow, MetaMask, OKX, Phantom..."
                      : connector.id}
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
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
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-2 px-3 pb-1">
              <p className="text-[11px] text-gray-400">
                Don&apos;t have a wallet?{" "}
                <a
                  href="https://rainbow.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0090FF] hover:underline"
                >
                  Get Rainbow
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
