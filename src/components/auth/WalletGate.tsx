"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";

type WalletGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function WalletGate({ children, fallback }: WalletGateProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {fallback ?? (
          <>
            <p className="text-lg font-semibold text-ink mb-2">
              Connect your wallet to access this content
            </p>
            <p className="text-sm text-ink/50 max-w-md">
              This content requires authentication. Please sign in or connect
              your wallet to continue.
            </p>
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
