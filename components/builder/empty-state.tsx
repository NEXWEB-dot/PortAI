"use client";

import { FileText, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-semibold tracking-tight">
        Build your portfolio with AI
      </h2>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        Upload your resume or describe yourself. I&apos;ll help you create a
        distinctive landing page that showcases your projects and skills.
      </p>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 rounded-full border px-3 py-1.5">
          <FileText className="h-3.5 w-3.5" />
          Drop a PDF resume
        </span>
        <span className="rounded-full border px-3 py-1.5">
          &quot;I&apos;m a frontend developer with 3 years experience&quot;
        </span>
        <span className="rounded-full border px-3 py-1.5">
          &quot;Generate my portfolio&quot;
        </span>
      </div>
    </div>
  );
}
