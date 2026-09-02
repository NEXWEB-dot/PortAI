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

  const clearFile = () => setSelectedFile(null);

  if (compact && selectedFile) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{selectedFile.name}</span>
        {isLoading ? (
          <Loader2 className="ml-auto h-4 w-4 animate-spin" />
        ) : (
          <button onClick={clearFile} className="ml-auto text-muted-foreground hover:text-foreground">
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
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30",
        compact && "px-4 py-4"
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
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
      )}
      <p className="text-sm font-medium">
        {isLoading ? "Parsing resume..." : "Drop your resume here"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">PDF up to 10MB</p>
    </label>
  );
}
