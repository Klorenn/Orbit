import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "../PostCard";
import type { PostWithAuthor } from "@/types/forum";

const mockPost: PostWithAuthor = {
  id: "post-1",
  title: "Test Forum Post Title",
  content_md: "# Hello\n\nThis is the post content that should appear in the excerpt preview.",
  content_html: "<h1>Hello</h1><p>This is the post content.</p>",
  author_id: "author-1",
  category_id: "cat-1",
  status: "published",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
  author: {
    id: "author-1",
    display_name: "Alice",
    avatar_url: null,
    wallet_address: "0x123",
  },
  category: {
    id: "cat-1",
    slug: "reports",
    name: "Reports",
    color: "#0090FF",
  },
  _count: {
    comments: 5,
    votes: 12,
  },
};

describe("PostCard", () => {
  it("renders the post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Test Forum Post Title")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("renders relative time from created_at", () => {
    render(<PostCard post={mockPost} />);
    // date-fns formatDistanceToNow should produce something like "about 2 years ago"
    const timeEl = screen.getByText(/ago/);
    expect(timeEl).toBeInTheDocument();
  });

  it("renders comment count", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders vote count", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("handles missing author gracefully", () => {
    const postNoAuthor: PostWithAuthor = {
      ...mockPost,
      author: null,
      title: "Anonymous Post",
    };
    render(<PostCard post={postNoAuthor} />);
    expect(screen.getByText("Anonymous Post")).toBeInTheDocument();
  });

  it("handles missing category gracefully", () => {
    const postNoCategory: PostWithAuthor = {
      ...mockPost,
      category: null,
      title: "Uncategorized Post",
    };
    render(<PostCard post={postNoCategory} />);
    expect(screen.getByText("Uncategorized Post")).toBeInTheDocument();
  });
});
