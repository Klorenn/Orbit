import { describe, it, expect } from "vitest";
import type {
  Category,
  Post,
  PostWithAuthor,
  Comment,
  ThreadComment,
  Profile,
  Event,
  Proposal,
  Vote,
} from "./forum";

describe("Forum types", () => {
  it("PostWithAuthor type satisfies the expected shape", () => {
    const post: PostWithAuthor = {
      id: "123",
      title: "Test Post",
      content_md: "# Hello",
      content_html: "<h1>Hello</h1>",
      author_id: "author-1",
      category_id: "cat-1",
      status: "published",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      author: {
        id: "author-1",
        display_name: "Alice",
        avatar_url: "/avatar.png",
        wallet_address: "0x123",
      },
      category: {
        id: "cat-1",
        slug: "reports",
        name: "Reports",
        color: "#0090FF",
      },
      _count: { comments: 5, votes: 12 },
    };

    expect(post.title).toBe("Test Post");
    expect(post.author?.display_name).toBe("Alice");
    expect(post.category?.slug).toBe("reports");
    expect(post._count?.comments).toBe(5);
    expect(post._count?.votes).toBe(12);
  });

  it("ThreadComment supports nested replies", () => {
    const reply: ThreadComment = {
      id: "reply-1",
      post_id: "post-1",
      author_id: "author-2",
      content_md: "Great point!",
      content_html: "<p>Great point!</p>",
      parent_id: "comment-1",
      created_at: "2024-01-02T00:00:00Z",
      author: { id: "author-2", display_name: "Bob", avatar_url: null },
    };

    const parent: ThreadComment = {
      id: "comment-1",
      post_id: "post-1",
      author_id: "author-1",
      content_md: "Hello world",
      content_html: "<p>Hello world</p>",
      parent_id: null,
      created_at: "2024-01-01T00:00:00Z",
      author: { id: "author-1", display_name: "Alice", avatar_url: null },
      replies: [reply],
    };

    expect(parent.replies).toHaveLength(1);
    expect(parent.replies![0].author?.display_name).toBe("Bob");
    expect(parent.parent_id).toBeNull();
  });

  it("Proposal status enum accepts valid values", () => {
    const draft: Proposal = {
      id: "p1",
      title: "Draft Proposal",
      description: "Not ready",
      status: "draft",
      author_id: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const approved: Proposal = {
      id: "p2",
      title: "Approved Proposal",
      description: "Approved!",
      status: "approved",
      author_id: "author-1",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    };

    expect(draft.status).toBe("draft");
    expect(approved.status).toBe("approved");
  });

  it("Vote value accepts 1 or -1 only", () => {
    const upvote: Vote = { id: "v1", post_id: "p1", user_id: "u1", value: 1, created_at: "2024-01-01T00:00:00Z" };
    const downvote: Vote = { id: "v2", post_id: "p1", user_id: "u2", value: -1, created_at: "2024-01-01T00:00:00Z" };

    expect(upvote.value).toBe(1);
    expect(downvote.value).toBe(-1);
  });
});
