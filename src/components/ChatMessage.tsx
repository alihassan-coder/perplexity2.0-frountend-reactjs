import { Bot, User, Sparkles } from "lucide-react";
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
renderer.link = function ({ href, title, tokens }) {
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
    <div className={cn(
      "w-full animate-fade-in py-4 px-4 md:px-8",
      isBot ? "bg-transparent" : "bg-transparent"
    )}>
      <div className={cn(
        "max-w-4xl mx-auto flex gap-4",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-primary shadow-glow-primary">
              <Bot className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted text-muted-foreground border border-border">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "flex-1 min-w-0 space-y-2",
          isBot ? "items-start" : "items-end flex flex-col"
        )}>
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBot ? "Perplexity 2.0" : "You"}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Search Trail (Bot only) */}
          {isBot && message.searchUrls && message.searchUrls.length > 0 && (
            <div className="w-full">
              <SearchTrail
                searchUrls={message.searchUrls}
                timestamp={message.timestamp}
              />
            </div>
          )}

          {/* Content */}
          <div className={cn(
            "rounded-2xl px-5 py-3.5 shadow-sm max-w-full md:max-w-[85%]",
            isBot
              ? "bg-card border border-border/50 text-foreground rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none shadow-glow-primary"
          )}>
            {isBot ? (
              <div className="space-y-3">
                {/* Response Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-border/10">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary/80">AI Response</span>
                </div>

                <div
                  className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50"
                  dangerouslySetInnerHTML={{
                    __html: marked(message.text)
                  }}
                />

                {isStreaming && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  </div>
                )}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
            )}
          </div>

          {/* Search URLs (Bot only) */}
          {isBot && message.searchUrls && message.searchUrls.length > 0 && (
            <div className="w-full pt-2">
              <SearchUrls urls={message.searchUrls} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
