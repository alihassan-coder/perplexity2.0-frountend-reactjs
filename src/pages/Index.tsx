import { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { AgentProgress } from "@/components/AgentProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useChatStream } from "@/hooks/useChatStream";
import { useChatHistory } from "@/hooks/useChatHistory";
import { Button } from "@/components/ui/button";
import { ResourcesPanel } from "@/components/ResourcesPanel";

const Index = () => {
  const {
    chats,
    currentChatId,
    createNewChat,
    saveMessageToCurrentChat,
    clearCurrentChat
  } = useChatHistory();

  const {
    isGenerating,
    agentStatus,
    error,
    sendMessage,
    stopGeneration,
  } = useChatStream(currentChatId, saveMessageToCurrentChat);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current chat messages
  const currentChat = chats.find(c => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  const latestBotMessageWithSources = [...messages]
    .reverse()
    .find((message) => message.isBot && message.searchUrls && message.searchUrls.length > 0);

  const latestSearchUrls = latestBotMessageWithSources?.searchUrls ?? [];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentStatus, isGenerating]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleStopGeneration = () => {
    stopGeneration();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-bg overflow-hidden flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-md z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent hidden md:block">
            Perplexity 2.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="w-9 h-9" />
          <Button
            variant="outline"
            size="sm"
            onClick={createNewChat}
            className="backdrop-blur-xl bg-card/60 border-border/50 hover:bg-card/80 transition-all shadow-sm gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">New Chat</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full overflow-hidden relative">
        {/* Chat Area - Full width scrollable */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex items-center justify-center flex-1 px-4">
              <div className="text-center space-y-8 max-w-2xl animate-fade-in">
                {/* Logo with glow & hover animation */}
                <div className="relative inline-block group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <img
                    src="/logo.png"
                    alt="Perplexity 2.0"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent pb-1">
                    Perplexity 2.0
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                    Your advanced AI research assistant with real-time web search capabilities.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Messages - Full width container
            <div className="w-full flex flex-col space-y-2 pb-6 pt-4">
              {messages.map((message, index) => (
                <div key={message.id} className="w-full">
                  <ChatMessage
                    message={message}
                    isStreaming={isGenerating && index === messages.length - 1 && message.isBot}
                  />
                </div>
              ))}

              {/* Agent Progress */}
              {agentStatus && (
                <div className="w-full px-4 md:px-8 py-2 animate-fade-in">
                  <div className="max-w-4xl mx-auto">
                    <AgentProgress status={agentStatus} />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="w-full px-4 md:px-8 py-3">
                  <div className="max-w-4xl mx-auto flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {latestSearchUrls.length > 0 && (
                <div className="w-full px-4 md:px-8 py-2">
                  <div className="max-w-4xl mx-auto">
                    <ResourcesPanel urls={latestSearchUrls} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="w-full border-t border-border/20 bg-background/80 backdrop-blur-xl px-4 md:px-8 py-6 z-40">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              isGenerating={isGenerating}
              onStop={handleStopGeneration}
            />
            <p className="text-center text-xs text-muted-foreground mt-3">
              Perplexity 2.0 can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
