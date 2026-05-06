"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileWarning } from "lucide-react";
import { clsx } from "clsx";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File is too large. Maximum size is 25 MB.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-4 w-full min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
          {
            "border-sky-400 bg-sky-50/50 scale-[1.01]": isDragging,
            "border-sage-300 bg-white hover:border-sky-400 hover:bg-sky-50/30":
              !isDragging && !disabled,
            "border-sage-200 bg-sage-50 cursor-not-allowed opacity-60":
              disabled,
          }
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload genetic report PDF"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />

        <div
          className={clsx(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-sky-100" : "bg-sage-100"
          )}
        >
          <Upload
            className={clsx(
              "w-7 h-7 transition-colors",
              isDragging ? "text-sky-600" : "text-sage-500"
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-base font-medium text-slate-700">
            {isDragging ? "Drop your report here" : "Drag your genetic report here"}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            or{" "}
            <span className="text-sky-600 font-medium hover:underline">
              browse files
            </span>{" "}
            &middot; PDF up to 25 MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-sm text-rose-600">
          <FileWarning className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
