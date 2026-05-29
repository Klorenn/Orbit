import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-provider";
import type React from "react";

// Test component that consumes the auth context
function TestConsumer() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="is-loading">{isLoading ? "loading" : "loaded"}</div>
      <div data-testid="is-authenticated">
        {isAuthenticated ? "authenticated" : "anonymous"}
      </div>
      <div data-testid="user-email">{user?.email ?? "no-user"}</div>
    </div>
  );
}

describe("AuthProvider", () => {
  it("provides initial unauthenticated state", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("is-loading")).toHaveTextContent("loading");
    expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
      "anonymous",
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
  });

  it("throws when useAuth is used outside of provider", () => {
    // Suppress console.error for the expected error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      /useAuth must be used within AuthProvider/,
    );

    consoleSpy.mockRestore();
  });
});
