"use client";

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/builder/theme-toggle";
import { Button } from "@/components/ui/button";
import { Layers, PanelRight, PanelRightClose } from "lucide-react";

type ChatLayoutProps = {
  children: ReactNode;
  input: ReactNode;
  headerExtra?: ReactNode;
  showPreview?: boolean;
  onTogglePreview?: () => void;
};

export function ChatLayout({
  children,
  input,
  headerExtra,
  showPreview,
  onTogglePreview,
}: ChatLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-card">
            <Layers className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">PortAi</p>
            <p className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              Portfolio builder
            </p>
          </div>
          {headerExtra}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs sm:px-3"
              onClick={onTogglePreview}
            >
              {showPreview ? (
                <>
                  <PanelRightClose className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Close</span>
                </>
              ) : (
                <>
                  <PanelRight className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              )}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <div className="shrink-0">{input}</div>
      </main>
    </div>
  );
}
