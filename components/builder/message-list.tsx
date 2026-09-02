"use client";

import { useEffect, useRef } from "react";
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
    <div className="flex flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-2.5 sm:gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center border sm:h-8 sm:w-8",
              message.role === "user"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {message.role === "user" ? (
              <User className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </div>
          <div
            className={cn(
              "max-w-[min(85%,28rem)] px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:px-4 sm:py-3",
              message.role === "user"
                ? "bg-foreground text-background"
                : "surface"
            )}
          >
            {message.content}
            {isStreaming &&
              message.role === "assistant" &&
              message.id === messages[messages.length - 1]?.id && (
                <span className="ml-1 inline-block h-4 w-px animate-pulse bg-current" />
              )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
