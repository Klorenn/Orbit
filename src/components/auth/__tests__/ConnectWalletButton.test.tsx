import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: {
    Custom: ({ children }: any) => {
      return children({
        account: null,
        chain: null,
        openConnectModal: vi.fn(),
        mounted: true,
      });
    },
  },
}));

import { ConnectWalletButton } from "../ConnectWalletButton";

describe("ConnectWalletButton", () => {
  it("renders Connect Wallet label when not connected", () => {
    render(<ConnectWalletButton />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });
});
