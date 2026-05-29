import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AmbassadorAvatar } from "../AmbassadorAvatar";
import type { Profile } from "@/types/forum";

const makeProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: "p1",
  wallet_address: "0x123",
  email: "alice@test.com",
  display_name: "Alice",
  avatar_url: null,
  bio: null,
  city: null,
  verified_nft: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  ...overrides,
});

describe("AmbassadorAvatar", () => {
  it("renders initials when no avatar_url", () => {
    render(<AmbassadorAvatar profile={makeProfile()} />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("renders image when avatar_url exists", () => {
    const profile = makeProfile({ avatar_url: "/avatars/alice.png" });
    render(<AmbassadorAvatar profile={profile} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/avatars/alice.png");
  });

  it("shows verified badge when nft verified", () => {
    const profile = makeProfile({ verified_nft: true });
    render(<AmbassadorAvatar profile={profile} />);
    // Check for the verified checkmark badge
    const badge = screen.getByTestId("verified-badge");
    expect(badge).toBeInTheDocument();
  });

  it("does not show verified badge when not nft verified", () => {
    render(<AmbassadorAvatar profile={makeProfile()} />);
    expect(screen.queryByTestId("verified-badge")).not.toBeInTheDocument();
  });

  it("renders different size variants", () => {
    const profile = makeProfile();
    const { rerender } = render(
      <AmbassadorAvatar profile={profile} size="sm" />,
    );
    expect(screen.getByText("AL")).toBeInTheDocument();

    rerender(<AmbassadorAvatar profile={profile} size="lg" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
