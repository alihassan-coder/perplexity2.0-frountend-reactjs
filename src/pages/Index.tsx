import { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { AgentProgress } from "@/components/AgentProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useChatStream } from "@/hooks/useChatStream";
import { Button } from "@/components/ui/button";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentStatus]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleStopGeneration = () => {
    stopGeneration();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-bg overflow-hidden">
      <ThemeToggle />

      <main className="h-screen flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
        {/* Header with Clear Button */}
        {messages.length > 0 && (
          <div className="w-full flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="backdrop-blur-xl bg-card/60 border-border/50 hover:bg-card/80"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 w-full overflow-y-auto flex flex-col">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex items-center justify-center flex-1">
              
              <div className="text-center space-y-6 max-w-3xl px-1">
                {/* Logo with glow & hover animation */}
                <div className="relative inline-block group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500"></div>
                  <img
                    src={logo}
                    alt="Perplexity 2.0"
                    className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
              </div>

            </div>
          ) : (
            // Messages
            <div className="space-y-0 pb-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isGenerating && index === messages.length - 1 && message.isBot}
                />
              ))}

              {/* Agent Progress */}
              {agentStatus && (
                <div className="px-8 pb-4">
                  <AgentProgress status={agentStatus} />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-3 px-8 py-4 mx-4 rounded-2xl backdrop-blur-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          isGenerating={isGenerating}
          onStop={handleStopGeneration}
        />
      </main>
    </div>
  );
};

export default Index;
