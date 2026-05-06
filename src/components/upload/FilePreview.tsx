"use client";

import { FileText, X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePreview({
  file,
  onRemove,
  disabled,
}: FilePreviewProps) {
  return (
    <div className="flex items-center gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 animate-fade-in">
      <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-sky-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {file.name}
        </p>
        <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
      </div>
      {!disabled && (
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
