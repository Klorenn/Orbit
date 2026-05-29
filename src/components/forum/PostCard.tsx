"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import type { PostWithAuthor } from "@/types/forum";

type PostCardProps = {
  post: PostWithAuthor;
};

export function PostCard({ post }: PostCardProps) {
  const initials = post.author?.display_name
    ? post.author.display_name.slice(0, 2).toUpperCase()
    : "??";

  return (
    <article
      className={cn(
        "bg-white rounded-2xl p-5 border border-line",
        "flex flex-col gap-3",
      )}
    >
      {/* Category badge */}
      <div>
        {post.category ? (
          <CategoryBadge category={post.category} size="sm" />
        ) : null}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold leading-snug text-ink">
        {post.title}
      </h3>

      {/* Excerpt — 2 lines max */}
      <p className="text-sm text-ink/60 line-clamp-2">
        {post.content_md.slice(0, 200)}
      </p>

      {/* Bottom row: avatar + author + date + stats */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          {post.author ? (
            <>
              <div className="w-7 h-7 rounded-full bg-plum text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium text-ink">
                {post.author.display_name ?? "Anonymous"}
              </span>
            </>
          ) : (
            <span className="text-sm text-ink/50 italic">No author</span>
          )}

          {/* Relative time */}
          <span className="text-xs text-ink/40">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-ink/50">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {post._count?.comments ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" />
            {post._count?.votes ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}
