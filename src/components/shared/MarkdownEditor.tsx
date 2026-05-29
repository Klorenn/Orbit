"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  return (
    <div className="border border-line rounded-2xl overflow-hidden bg-white">
      {/* Toolbar / Tabs */}
      <div className="flex border-b border-line">
        <button
          type="button"
          onClick={() => setMode("write")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            mode === "write"
              ? "bg-white text-ink border-b-2 border-ink"
              : "text-ink/50 hover:text-ink/80",
          )}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            mode === "preview"
              ? "bg-white text-ink border-b-2 border-ink"
              : "text-ink/50 hover:text-ink/80",
          )}
        >
          Preview
        </button>
      </div>

      {/* Content area */}
      <div className="min-h-[200px]">
        {mode === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-4 text-sm text-ink bg-white resize-y focus:outline-none placeholder:text-ink/30"
            role="textbox"
          />
        ) : (
          <div className="prose prose-sm max-w-none p-4 text-ink">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-ink/30 italic">Nothing to preview</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
