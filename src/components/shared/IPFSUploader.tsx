"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type IPFSUploaderProps = {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
};

export function IPFSUploader({
  onUpload,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10 MB default
}: IPFSUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setFileNames(files.map((f) => f.name));
    console.log("IPFSUploader: received files", files.map((f) => f.name));
    onUpload(files);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setFileNames(files.map((f) => f.name));
    console.log("IPFSUploader: dropped files", files.map((f) => f.name));
    onUpload(files);
  };

  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-blue bg-blue/5"
            : "border-line hover:border-ink/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          data-testid="file-input"
          multiple
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-ink/40" />
          <p className="text-sm font-medium text-ink/70">
            Drag files or click to upload
          </p>
          <p className="text-xs text-ink/40">
            Max file size: {formatSize(maxSize)}
          </p>
        </div>
      </div>

      {/* Show uploaded file names */}
      {fileNames.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-ink/50 mb-1">Files selected:</p>
          <ul className="text-xs text-ink/70 space-y-0.5">
            {fileNames.map((name, i) => (
              <li key={i} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coming in Sprint 4 notice */}
      <p className="mt-2 text-xs text-ink/30 italic text-center">
        IPFS upload coming in Sprint 4
      </p>
    </div>
  );
}
