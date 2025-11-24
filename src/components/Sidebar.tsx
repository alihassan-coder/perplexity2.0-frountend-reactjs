import { MessageSquarePlus, History, Settings, Sparkles, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/hooks/useChatHistory";
import { Button } from "./ui/button";

interface SidebarProps {
  className?: string;
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar = ({
  className,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat
}: SidebarProps) => {

  return (
    <aside
      className={cn(
        "w-64 border-r backdrop-blur-glass bg-glass-background/80 border-glass-border",
        "flex flex-col h-screen transition-all duration-300",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Perplexity 2.0
            </h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-glow-primary"
        >
          <MessageSquarePlus className="w-5 h-5" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          History
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200",
              chat.id === currentChatId
                ? "bg-muted/80 text-foreground shadow-sm border border-border/50"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-sm truncate">
              {chat.title || "New Chat"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No chat history
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-glass-border mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
};
