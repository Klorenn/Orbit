"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/auth/ConnectWalletButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[88rem] mx-auto flex items-center justify-between px-6 py-[22px]">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-[11px]">
            <div
              className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-colors ${
                scrolled
                  ? "bg-gray-950 text-white"
                  : "bg-white text-gray-950 shadow-[0_4px_16px_rgba(0,0,0,.22)]"
              }`}
            >
              <svg
                className="w-5 h-5"
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
            <span
              className={`text-2xl font-semibold tracking-[-0.03em] transition-colors ${
                scrolled ? "text-gray-950" : "text-white"
              }`}
            >
              Orbit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              ["Reports", "/forum"],
              ["Projects", "/proposals"],
              ["Events", "/events"],
              ["Docs", "/docs"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className={`text-base font-medium transition-colors ${
                  scrolled
                    ? "text-gray-500 hover:text-gray-950"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <ConnectWalletButton />
      </nav>
    </header>
  );
}
