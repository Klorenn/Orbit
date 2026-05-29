"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/forum";

// Tailwind JIT safelist — these strings are referenced dynamically by slug
const _COLOR_CLASSES = [
  "bg-blue-100", "text-blue-800",
  "bg-purple-100", "text-purple-800",
  "bg-yellow-100", "text-yellow-800",
  "bg-green-100", "text-green-800",
  "bg-red-100", "text-red-800",
  "bg-teal-100", "text-teal-800",
  "bg-gray-100", "text-gray-800",
] as const;

const colorMap: Record<string, { bg: string; text: string }> = {
  reports: { bg: "bg-blue-100", text: "text-blue-800" },
  projects: { bg: "bg-purple-100", text: "text-purple-800" },
  events: { bg: "bg-yellow-100", text: "text-yellow-800" },
  feedback: { bg: "bg-green-100", text: "text-green-800" },
  announcements: { bg: "bg-red-100", text: "text-red-800" },
  "get-started": { bg: "bg-teal-100", text: "text-teal-800" },
  governance: { bg: "bg-gray-100", text: "text-gray-800" },
};

type CategoryBadgeProps = {
  category: Pick<Category, "slug" | "name">;
  size?: "sm" | "md";
};

export function CategoryBadge({
  category,
  size = "md",
}: CategoryBadgeProps) {
  const colors = colorMap[category.slug] ?? {
    bg: "bg-gray-100",
    text: "text-gray-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        colors.bg,
        colors.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      {category.name}
    </span>
  );
}

type CategoryListProps = {
  categories: Pick<Category, "id" | "slug" | "name" | "color">[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <CategoryBadge key={cat.id} category={cat} />
      ))}
    </div>
  );
}
