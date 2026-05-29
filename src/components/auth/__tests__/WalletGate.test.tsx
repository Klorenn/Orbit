import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletGate } from "../WalletGate";

// Mock the auth-context module
vi.mock("@/lib/auth/auth-context", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/lib/auth/auth-context";

describe("WalletGate", () => {
  it("shows children when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "u1", email: "test@test.com" } as any,
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <WalletGate>
        <div data-testid="protected-content">Secret Content</div>
      </WalletGate>,
    );

    expect(
      screen.getByTestId("protected-content"),
    ).toBeInTheDocument();
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("shows fallback message when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <WalletGate>
        <div>Protected</div>
      </WalletGate>,
    );

    expect(
      screen.getByText("Connect your wallet to access this content"),
    ).toBeInTheDocument();
  });

  it("shows custom fallback when provided", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <WalletGate fallback={<div data-testid="custom-fallback">Sign In Required</div>}>
        <div>Protected</div>
      </WalletGate>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Sign In Required")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <WalletGate>
        <div>Protected</div>
      </WalletGate>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
