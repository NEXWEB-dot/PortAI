"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: ChatMessage[];
  isStreaming?: boolean;
};

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              delay: index === messages.length - 1 ? 0 : 0,
            }}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                message.role === "user"
                  ? "border-gold/20 bg-gold/10"
                  : "border-border bg-muted/50"
              )}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4 text-gold" />
              ) : (
                <Bot className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                message.role === "user"
                  ? "border border-gold/15 bg-gold/10 text-foreground"
                  : "border border-border/60 bg-card/80 text-foreground backdrop-blur-sm"
              )}
            >
              {message.content}
              {isStreaming &&
                message.role === "assistant" &&
                message.id === messages[messages.length - 1]?.id && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="ml-1 inline-block h-4 w-0.5 bg-gold"
                  />
                )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
