import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isGenerating?: boolean;
  onStop?: () => void;
}

export const ChatInput = ({ onSend, isGenerating = false, onStop }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && !isGenerating) {
      textareaRef.current.focus();
    }
  }, [isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      onSend(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-end gap-3 px-5 py-3 rounded-2xl",
          "backdrop-blur-xl bg-card/80 border-2",
          "shadow-lg shadow-primary/5",
          "transition-all duration-300",
          isGenerating 
            ? "border-primary/60 shadow-lg shadow-primary/20" 
            : "border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20"
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about any topic..."
          disabled={isGenerating}
          rows={1}
          className={cn(
            "flex-1 bg-transparent outline-none resize-none",
            "text-foreground placeholder:text-muted-foreground/70",
            "max-h-[150px] py-2 text-sm",
            "disabled:opacity-50"
          )}
        />

        {/* Send/Stop Button */}
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              "bg-destructive/90 text-white",
              "transition-all duration-300",
              "hover:bg-destructive hover:shadow-lg hover:scale-105",
              "active:scale-95"
            )}
            title="Stop generating"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim()}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              "bg-gradient-primary text-white",
              "transition-all duration-300",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "hover:shadow-lg hover:shadow-primary/40 hover:scale-105",
              "active:scale-95"
            )}
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};
