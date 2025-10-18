import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/hooks/useChatStream";
import { marked } from "marked";
import { SearchUrls } from "./SearchUrls";

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export const ChatMessage = ({ message, isStreaming = false }: ChatMessageProps) => {
  const isBot = message.isBot;
  
  return (
    <div
      className={cn(
        "flex gap-4 p-8 animate-fade-in",
        isBot ? "backdrop-blur-xl bg-card/40 border-y border-border/50" : ""
      )}
    >
      {isBot ? (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-primary shadow-glow-primary">
          <Bot className="w-5 h-5 text-white" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-primary">
            {isBot ? "Perplexity 2.0" : "You"}
          </p>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-foreground leading-relaxed">
          {isBot ? (
            <div 
              className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground prose-li:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
              dangerouslySetInnerHTML={{ 
                __html: marked(message.text)
              }} 
            />
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}
          {isStreaming && isBot && (
            <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
          )}
        </div>
        
        {/* Display search URLs for bot messages */}
        {isBot && message.searchUrls && message.searchUrls.length > 0 && (
          <SearchUrls urls={message.searchUrls} />
        )}
      </div>
    </div>
  );
};
