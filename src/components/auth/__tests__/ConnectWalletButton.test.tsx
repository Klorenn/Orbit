import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("wagmi", () => ({
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [{ id: "injected", name: "Injected" }],
  }),
  useAccount: () => ({
    address: null,
    isConnected: false,
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
  }),
  http: vi.fn(),
  createConfig: vi.fn(),
  injected: vi.fn(),
}));

import { ConnectWalletButton } from "../ConnectWalletButton";

describe("ConnectWalletButton", () => {
  it("renders Connect Wallet label when not connected", () => {
    render(<ConnectWalletButton />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });
});
