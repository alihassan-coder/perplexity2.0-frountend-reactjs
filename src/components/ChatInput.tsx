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
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="w-full py-6">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={cn(
            "relative flex items-end gap-3 px-6 py-4 rounded-3xl",
            "backdrop-blur-xl bg-card/70 border-2",
            "shadow-2xl shadow-primary/10",
            "transition-all duration-300",
            isGenerating 
              ? "border-primary/60 shadow-glow-primary" 
              : "border-border hover:border-primary/40 focus-within:border-primary focus-within:shadow-glow-primary-lg"
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isGenerating}
            rows={1}
            className={cn(
              "flex-1 bg-transparent outline-none resize-none",
              "text-foreground placeholder:text-muted-foreground",
              "max-h-[200px] py-2",
              "disabled:opacity-50"
            )}
          />

          {/* Send/Stop Button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0",
                "bg-destructive text-white",
                "transition-all duration-300",
                "hover:shadow-lg hover:scale-105",
                "active:scale-95"
              )}
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim()}
              className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0",
                "bg-gradient-primary text-white",
                "transition-all duration-300",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:shadow-glow-primary-lg hover:scale-105",
                "active:scale-95"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Helper Text */}
        {/* <p className="text-xs text-muted-foreground text-center mt-3">
          {isGenerating ? "Generating response..." : "Shift + Enter for new line • Enter to send"}
        </p> */}
      </form>
    </div>
  );
};
