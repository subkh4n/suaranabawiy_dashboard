"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 border border-transparent mt-auto" />;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-border mt-auto">
      <button 
        onClick={() => setTheme('light')} 
        className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setTheme('dark')} 
        className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setTheme('system')} 
        className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
