"use client";

import { FileText, MessageSquare, Sparkles, Wand2 } from "lucide-react";

const suggestions = [
  { icon: FileText, label: "Upload resume" },
  { icon: MessageSquare, label: "Describe your work" },
  { icon: Wand2, label: "Generate portfolio" },
];

export function EmptyState() {
  return (
    <div className="animate-fade-up flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:py-16">
      <div className="mb-6 flex h-12 w-12 items-center justify-center border border-border bg-card">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <h2 className="mb-3 max-w-sm text-2xl font-semibold tracking-tight sm:text-3xl">
        Build a portfolio that reads like you
      </h2>

      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        Upload a resume or tell us about your work. We extract the details and
        design a focused landing page around your projects.
      </p>

      <div className="flex w-full max-w-lg flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {suggestions.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center justify-center gap-2 border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground"
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
