"use client";

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/builder/theme-toggle";
import { Button } from "@/components/ui/button";
import { PanelRight, PanelRightClose } from "lucide-react";

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
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">PortAi</span>
          {headerExtra}
        </div>
        <div className="flex items-center gap-1">
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={onTogglePreview}
            >
              {showPreview ? (
                <>
                  <PanelRightClose className="h-4 w-4" />
                  Hide preview
                </>
              ) : (
                <>
                  <PanelRight className="h-4 w-4" />
                  Show preview
                </>
              )}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <div className="shrink-0">{input}</div>
      </main>
    </div>
  );
}
