import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockConnect = vi.fn();

vi.mock("wagmi", () => ({
  useConnect: () => ({
    connect: mockConnect,
    connectors: [{ id: "injected", name: "Injected" }],
  }),
  useAccount: () => ({ address: null, isConnected: false }),
  useDisconnect: () => ({ disconnect: vi.fn() }),
  http: vi.fn(),
  createConfig: vi.fn(),
  injected: vi.fn(),
}));

import { ConnectWalletButton } from "../ConnectWalletButton";

describe("ConnectWalletButton", () => {
  it("renders Connect Wallet and connects on click", () => {
    render(<ConnectWalletButton />);
    const btn = screen.getByText("Connect Wallet");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockConnect).toHaveBeenCalledWith({
      connector: { id: "injected", name: "Injected" },
    });
  });
});
