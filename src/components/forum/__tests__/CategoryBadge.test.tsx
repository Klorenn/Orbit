import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryBadge, CategoryList } from "../CategoryBadge";
import type { Category } from "@/types/forum";

const mockCategories: Category[] = [
  { id: "1", slug: "reports", name: "Reports", description: "Event reports", color: "#0090FF", sort_order: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", slug: "projects", name: "Projects", description: "Community projects", color: "#A855F7", sort_order: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", slug: "events", name: "Events", description: "Filecoin events", color: "#FFD60A", sort_order: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "4", slug: "feedback", name: "Feedback", description: "Feedback", color: "#22C55E", sort_order: 4, created_at: "2024-01-01T00:00:00Z" },
  { id: "5", slug: "announcements", name: "Announcements", description: "Announcements", color: "#EF4444", sort_order: 5, created_at: "2024-01-01T00:00:00Z" },
  { id: "6", slug: "get-started", name: "Get Started", description: "Getting started", color: "#14B8A6", sort_order: 6, created_at: "2024-01-01T00:00:00Z" },
  { id: "7", slug: "governance", name: "Governance", description: "Governance", color: "#6B7280", sort_order: 7, created_at: "2024-01-01T00:00:00Z" },
];

describe("CategoryBadge", () => {
  it("renders the category name", () => {
    render(<CategoryBadge category={mockCategories[0]} />);
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("renders correct label for each category", () => {
    for (const cat of mockCategories) {
      const { unmount } = render(<CategoryBadge category={cat} />);
      expect(screen.getByText(cat.name)).toBeInTheDocument();
      unmount();
    }
  });

  it("applies correct color class for reports (blue)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[0]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("blue");
  });

  it("applies correct color class for projects (purple)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[1]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("purple");
  });

  it("applies correct color class for events (yellow)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[2]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("yellow");
  });

  it("applies correct color class for feedback (green)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[3]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("green");
  });

  it("applies correct color class for announcements (red)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[4]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("red");
  });

  it("applies correct color class for get-started (teal)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[5]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("teal");
  });

  it("applies correct color class for governance (gray)", () => {
    const { container } = render(<CategoryBadge category={mockCategories[6]} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("gray");
  });

  it("renders small size variant", () => {
    render(<CategoryBadge category={mockCategories[0]} size="sm" />);
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });
});

describe("CategoryList", () => {
  it("renders all 7 category badges", () => {
    render(<CategoryList categories={mockCategories} />);
    for (const cat of mockCategories) {
      expect(screen.getByText(cat.name)).toBeInTheDocument();
    }
  });
});
