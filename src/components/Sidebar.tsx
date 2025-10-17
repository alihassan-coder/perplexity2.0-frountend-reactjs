import { MessageSquarePlus, History, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const menuItems = [
    { icon: MessageSquarePlus, label: "New Chat", active: true },
    { icon: History, label: "Chat History", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <aside
      className={cn(
        "w-64 border-r backdrop-blur-glass bg-glass-background/80 border-glass-border",
        "flex flex-col h-screen",
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

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              item.active
                ? "bg-primary/10 text-primary shadow-glow-primary"
                : "hover:bg-muted text-foreground hover:translate-x-1"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
