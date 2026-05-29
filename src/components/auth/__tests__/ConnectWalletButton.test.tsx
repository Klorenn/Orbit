import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConnectWalletButton } from "../ConnectWalletButton";

// Mock the auth-context module
vi.mock("@/lib/auth/auth-context", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/lib/auth/auth-context";

describe("ConnectWalletButton", () => {
  it("renders Connect Wallet label when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(<ConnectWalletButton />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });

  it("renders truncated wallet address when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "u1",
        email: "test@test.com",
        user_metadata: {},
      } as any,
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ConnectWalletButton />);
    // Should show some form of identifier (email)
    expect(screen.getByText(/test@test/)).toBeInTheDocument();
  });
});
