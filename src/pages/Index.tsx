import { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { AgentProgress } from "@/components/AgentProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useChatStream } from "@/hooks/useChatStream";
import { Button } from "@/components/ui/button";
import { ResourcesPanel } from "@/components/ResourcesPanel";

import logo from "../../public/logo.png";
const Index = () => {
  const {
    messages,
    isGenerating,
    agentStatus,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  } = useChatStream();

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <ThemeToggle />

      <main className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header with Clear Button */}
        {messages.length > 0 && (
          <div className="w-full flex justify-end px-6 py-3 border-b border-border/20 bg-background/50 backdrop-blur-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="backdrop-blur-xl bg-card/60 border-border/50 hover:bg-card/80 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        )}

        {/* Chat Area - Full width scrollable */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex items-center justify-center flex-1 px-4">
              <div className="text-center space-y-8 max-w-2xl">
                {/* Logo with glow & hover animation */}
                <div className="relative inline-block group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500"></div>
                  <img
                    src={logo}
                    alt="Perplexity 2.0"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Perplexity 2.0</h1>
                  <p className="text-muted-foreground text-lg">Your AI research assistant with real-time web search</p>
                </div>
              </div>
            </div>
          ) : (
            // Messages - Full width container
            <div className="w-full flex flex-col space-y-0 pb-6">
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
                <div className="w-full px-4 md:px-8 py-3">
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
                <div className="w-full px-4 md:px-8 py-3">
                  <div className="max-w-4xl mx-auto">
                    <ResourcesPanel urls={latestSearchUrls} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="w-full border-t border-border/20 bg-background/80 backdrop-blur-md px-4 md:px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              isGenerating={isGenerating}
              onStop={handleStopGeneration}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
