import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/hooks/useChatStream";
import { marked } from "marked";
import { SearchUrls } from "./SearchUrls";
import { SearchTrail } from "./SearchTrail";

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

// Custom renderer to make all links open in new tabs
const renderer = new marked.Renderer();
renderer.link = function({ href, title, tokens }) {
  const text = tokens.map(token => token.raw).join('');
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer
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
        "w-full animate-fade-in",
        isBot ? "bg-card/50 border-b border-border/30" : "bg-background/30"
      )}
    >
      <div className="px-4 md:px-8 py-6 flex gap-4">
        <div className="flex-shrink-0">
          {isBot ? (
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-primary shadow-glow-primary">
              <Bot className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content - Constrained width */}
        <div className="flex-1 min-w-0 space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-primary">
            {isBot ? "Perplexity 2.0" : "You"}
          </p>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        {/* Show search trail at the top for bot messages with search results */}
        {isBot && message.searchUrls && message.searchUrls.length > 0 && (
          <SearchTrail 
            searchUrls={message.searchUrls} 
            timestamp={message.timestamp}
          />
        )}
        
        {/* AI Response Content */}
        <div className="text-foreground leading-relaxed">
          {isBot ? (
            <div className="space-y-4">
              {/* Response Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">AI Response</span>
              </div>
              
              {/* Formatted Response */}
              <div 
                className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground prose-li:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: marked(message.text)
                }} 
              />
              
              {isStreaming && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="inline-block w-2 h-5 bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Generating...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}
        </div>
        
        {/* Display compact search URLs at the bottom */}
        {isBot && message.searchUrls && message.searchUrls.length > 0 && (
          <SearchUrls urls={message.searchUrls} />
        )}
      </div>
      </div>
    </div>
  );
};
