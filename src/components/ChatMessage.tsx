import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 p-6 animate-fade-in",
        isBot ? "bg-muted/30" : ""
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          isBot
            ? "bg-gradient-primary shadow-glow-primary"
            : "bg-secondary/20"
        )}
      >
        {isBot ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-secondary" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold">
          {isBot ? "Perplexity 2.0" : "You"}
        </p>
        <p className="text-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
