"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Loader2, X, FileUp } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 rounded-xl border border-gold/15 bg-card/60 px-3 py-2 text-sm backdrop-blur-sm"
      >
        <FileText className="h-4 w-4 shrink-0 text-gold" />
        <span className="truncate">{selectedFile.name}</span>
        {isLoading ? (
          <Loader2 className="ml-auto h-4 w-4 animate-spin text-gold" />
        ) : (
          <button
            onClick={clearFile}
            className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      animate={{
        borderColor: isDragging
          ? "oklch(0.72 0.12 85 / 50%)"
          : "oklch(0.72 0.12 85 / 15%)",
        backgroundColor: isDragging
          ? "oklch(0.72 0.12 85 / 8%)"
          : "oklch(0.72 0.12 85 / 3%)",
      }}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-shadow",
        "hover:shadow-lg hover:shadow-gold/5",
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
      <motion.div
        animate={isLoading ? { rotate: 360 } : { y: [0, -4, 0] }}
        transition={
          isLoading
            ? { repeat: Infinity, duration: 1, ease: "linear" }
            : { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 text-gold" />
        ) : isDragging ? (
          <FileUp className="h-6 w-6 text-gold" />
        ) : (
          <Upload className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
        )}
      </motion.div>
      <p className="text-sm font-medium">
        {isLoading ? "Analyzing your resume..." : "Drop your resume here"}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        PDF format · Up to 10MB
      </p>
    </motion.label>
  );
}
