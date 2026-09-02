"use client";

import { Upload, FileText, Loader2, X } from "lucide-react";
import { useCallback, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

type ResumeDropzoneProps = {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  compact?: boolean;
};

export function ResumeDropzone({
  onFileSelect,
  isLoading,
  compact,
}: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (compact && selectedFile) {
    return (
      <div className="surface flex items-center gap-2 px-3 py-2 text-sm">
        <FileText className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{selectedFile.name}</span>
        {isLoading ? (
          <Loader2 className="ml-auto h-4 w-4 animate-spin" />
        ) : (
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-4 py-8 transition-colors sm:px-6 sm:py-10",
        isDragging
          ? "border-foreground bg-muted"
          : "border-border bg-card hover:border-foreground/40",
        compact && "px-4 py-6"
      )}
    >
      <input
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        disabled={isLoading}
      />
      {isLoading ? (
        <Loader2 className="mb-3 h-6 w-6 animate-spin text-muted-foreground" />
      ) : (
        <Upload className="mb-3 h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
      )}
      <p className="text-sm font-medium">
        {isLoading ? "Parsing resume..." : "Drop PDF resume"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">or tap to browse</p>
    </label>
  );
}
