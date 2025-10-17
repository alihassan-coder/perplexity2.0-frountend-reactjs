import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 p-8 animate-fade-in",
        isBot ? "backdrop-blur-xl bg-card/40 border-y border-border/50" : ""
      )}
    >
      {isBot && (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-primary shadow-glow-primary">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-primary">
          {isBot ? "Perplexity 2.0" : "You"}
        </p>
        <p className="text-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
