"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Describe your vision...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="glass-panel border-t px-4 py-5">
      <div className="mx-auto max-w-3xl">
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 1px oklch(0.72 0.12 85 / 25%), 0 8px 32px oklch(0 0 0 / 8%)"
              : "0 0 0 1px oklch(0.72 0.12 85 / 8%), 0 4px 16px oklch(0 0 0 / 4%)",
          }}
          transition={{ duration: 0.25 }}
          className={cn(
            "relative flex items-end gap-2 rounded-2xl border border-gold/10 bg-card/50 p-2 backdrop-blur-sm"
          )}
        >
          <Sparkles className="mb-3 ml-2 hidden h-4 w-4 shrink-0 text-gold/60 sm:block" />
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="min-h-[48px] max-h-[200px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl bg-gold text-primary-foreground shadow-md shadow-gold/20 hover:bg-gold/90"
              onClick={handleSend}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
            >
              <AnimatePresence mode="wait">
                {disabled ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
        <p className="mt-3 text-center text-[11px] tracking-wide text-muted-foreground">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
