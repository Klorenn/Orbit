"use client";

import Link from "next/link";
import { ConnectWalletButton } from "@/components/auth/ConnectWalletButton";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-950 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <span className="text-xl font-semibold tracking-tight text-gray-950">
              Orbit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/forum"
              className="text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
            >
              Reports
            </Link>
            <Link
              href="/forum/projects"
              className="text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>

        <ConnectWalletButton />
      </nav>
    </header>
  );
}
