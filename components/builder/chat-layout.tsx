"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/builder/theme-toggle";
import { Button } from "@/components/ui/button";
import { Gem, PanelRight, PanelRightClose } from "lucide-react";

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
    <div className="premium-mesh relative flex h-dvh flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel relative z-10 flex h-16 shrink-0 items-center justify-between px-5"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/20 bg-gold/10"
          >
            <Gem className="h-4 w-4 text-gold" />
          </motion.div>
          <div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Port<span className="gold-gradient-text">Ai</span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio Studio
            </p>
          </div>
          {headerExtra}
        </div>
        <div className="flex items-center gap-1">
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 transition-all hover:bg-gold/10 hover:text-gold"
              onClick={onTogglePreview}
            >
              {showPreview ? (
                <>
                  <PanelRightClose className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide preview</span>
                </>
              ) : (
                <>
                  <PanelRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              )}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </motion.header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">{children}</div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          {input}
        </motion.div>
      </main>
    </div>
  );
}
