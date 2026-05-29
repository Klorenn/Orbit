import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommentThread } from "../CommentThread";
import type { ThreadComment } from "@/types/forum";

const makeComment = (
  overrides: Partial<ThreadComment> = {},
): ThreadComment => ({
  id: "c1",
  post_id: "post-1",
  author_id: "author-1",
  content_md: "This is a **comment**",
  content_html: "<p>This is a <strong>comment</strong></p>",
  parent_id: null,
  created_at: "2024-01-15T10:00:00Z",
  author: {
    id: "author-1",
    display_name: "Alice",
    avatar_url: null,
  },
  ...overrides,
});

const topLevelComments: ThreadComment[] = [
  makeComment({ id: "c1", content_md: "First comment" }),
  makeComment({
    id: "c2",
    author: { id: "author-2", display_name: "Bob", avatar_url: null },
    content_md: "Second comment",
  }),
];

const nestedComments: ThreadComment[] = [
  makeComment({
    id: "c1",
    content_md: "Parent comment",
    replies: [
      makeComment({
        id: "c1-1",
        content_md: "Nested reply",
        parent_id: "c1",
        author: { id: "author-2", display_name: "Bob", avatar_url: null },
        replies: [
          makeComment({
            id: "c1-1-1",
            content_md: "Deeply nested",
            parent_id: "c1-1",
            author: { id: "author-3", display_name: "Charlie", avatar_url: null },
          }),
        ],
      }),
    ],
  }),
];

describe("CommentThread", () => {
  it("renders top-level comments", () => {
    render(
      <CommentThread
        comments={topLevelComments}
        postId="post-1"
        onReply={() => {}}
      />,
    );
    expect(screen.getByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("Second comment")).toBeInTheDocument();
  });

  it("renders author names", () => {
    render(
      <CommentThread
        comments={topLevelComments}
        postId="post-1"
        onReply={() => {}}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders nested replies with indent", () => {
    render(
      <CommentThread
        comments={nestedComments}
        postId="post-1"
        onReply={() => {}}
      />,
    );
    expect(screen.getByText("Parent comment")).toBeInTheDocument();
    expect(screen.getByText("Nested reply")).toBeInTheDocument();
    expect(screen.getByText("Deeply nested")).toBeInTheDocument();
  });

  it("renders a reply button on each comment", () => {
    render(
      <CommentThread
        comments={topLevelComments}
        postId="post-1"
        onReply={() => {}}
      />,
    );
    const replyButtons = screen.getAllByText("Reply");
    expect(replyButtons).toHaveLength(2);
  });

  it("calls onReply with comment id when reply button is clicked", () => {
    const handleReply = vi.fn();
    render(
      <CommentThread
        comments={topLevelComments}
        postId="post-1"
        onReply={handleReply}
      />,
    );
    const replyButtons = screen.getAllByText("Reply");
    fireEvent.click(replyButtons[0]);
    expect(handleReply).toHaveBeenCalledWith("c1");
  });
});
