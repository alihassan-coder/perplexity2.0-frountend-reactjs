import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="p-6 border-t backdrop-blur-glass bg-glass-background/80 border-glass-border">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className={cn(
            "relative flex items-center gap-3 px-6 py-4 rounded-2xl",
            "backdrop-blur-glass bg-card/60 border-2 border-glass-border",
            "transition-all duration-300",
            "hover:border-primary/50 hover:shadow-glow-primary",
            "focus-within:border-primary focus-within:shadow-glow-primary-lg"
          )}
        >
          {/* Attach Button */}
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className={cn(
              "flex-1 bg-transparent outline-none",
              "text-foreground placeholder:text-muted-foreground"
            )}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-gradient-primary text-white",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-glow-primary-lg hover:scale-105",
              "active:scale-95"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          Powered by advanced AI • Press Enter to send
        </p>
      </form>
    </div>
  );
};
