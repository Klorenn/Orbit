"use client";

import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ThreadComment as ThreadCommentType } from "@/types/forum";

type CommentThreadProps = {
  comments: ThreadCommentType[];
  postId: string;
  onReply: (commentId: string) => void;
  depth?: number;
};

function CommentItem({
  comment,
  onReply,
  depth,
}: {
  comment: ThreadCommentType;
  onReply: (commentId: string) => void;
  depth: number;
}) {
  const initials = comment.author?.display_name
    ? comment.author.display_name.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div
      className={cn(
        "pl-4 border-l-2 border-line",
        depth === 0 && "pl-0 border-l-0",
      )}
    >
      <div className="flex items-start gap-2 py-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-plum text-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header: author + time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-ink">
              {comment.author?.display_name ?? "Anonymous"}
            </span>
            <span className="text-xs text-ink/40">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Markdown body */}
          <div className="text-sm text-ink/80 prose prose-sm max-w-none">
            <ReactMarkdown>{comment.content_md}</ReactMarkdown>
          </div>

          {/* Reply button */}
          <button
            type="button"
            onClick={() => onReply(comment.id)}
            className="mt-1 text-xs font-medium text-blue hover:text-blue/80 transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({
  comments,
  postId: _postId,
  onReply,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-ink/40 py-4 text-center">
        No comments yet. Be the first to reply!
      </p>
    );
  }

  return (
    <div className="divide-y divide-line">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          depth={0}
        />
      ))}
    </div>
  );
}
