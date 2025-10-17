import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
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

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm processing your request. This is a demo response to show how the chat interface works with beautiful animations and glassmorphism effects!",
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-bg overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative">
        <ThemeToggle />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 1 ? (
            // Welcome Screen
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center space-y-6 max-w-2xl">
                <div className="inline-block p-4 rounded-2xl bg-gradient-primary shadow-glow-primary-lg animate-glow-pulse">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Welcome to Perplexity 2.0
                </h1>
                <p className="text-xl text-muted-foreground">
                  Your next-generation AI assistant with advanced capabilities
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {[
                    "Answer complex questions",
                    "Generate creative content",
                    "Analyze and summarize",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="p-4 rounded-xl backdrop-blur-glass bg-card/40 border border-glass-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary"
                    >
                      <p className="text-sm font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-1">
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
        <ChatInput onSend={handleSendMessage} />
      </main>
    </div>
  );
};

export default Index;
