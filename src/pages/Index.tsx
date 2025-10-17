import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Perplexity 2.0, your advanced AI assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm processing your request. This is a demo response to show how the chat interface works with beautiful animations and glassmorphism effects!",
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-bg overflow-hidden">
      <ThemeToggle />

      <main className="h-screen flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
        {/* Chat Area */}
        <div className="flex-1 w-full overflow-y-auto flex flex-col">
          {messages.length === 1 ? (
            // Welcome Screen
            <div className="flex items-center justify-center flex-1">
              <div className="text-center space-y-6 max-w-3xl px-4">
                <div className="inline-block p-6 rounded-3xl bg-gradient-primary shadow-glow-primary-lg animate-glow-pulse backdrop-blur-glass">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>
                <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Perplexity 2.0
                </h1>
                <p className="text-xl text-muted-foreground">
                  Ask me anything - I'm here to help
                </p>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-0 pb-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                />
              ))}
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
