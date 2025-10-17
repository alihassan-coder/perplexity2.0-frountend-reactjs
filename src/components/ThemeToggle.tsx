import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    root.classList.remove(theme);
    root.classList.add(newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 w-12 h-12 rounded-xl backdrop-blur-glass bg-card/60 border border-glass-border hover:shadow-glow-primary transition-all duration-300 flex items-center justify-center group z-50"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
};
