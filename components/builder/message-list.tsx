"use client";

import type { ChatMessage } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: ChatMessage[];
  isStreaming?: boolean;
};

export function MessageList({ messages, isStreaming }: MessageListProps) {
  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {message.content}
            {isStreaming &&
              message.role === "assistant" &&
              message.id === messages[messages.length - 1]?.id && (
                <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current" />
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
