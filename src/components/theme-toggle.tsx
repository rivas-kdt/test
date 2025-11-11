"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full bg-muted hover:bg-muted/50 hover:text-muted-foreground/50 backdrop-blur-sm border-muted cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun
        className={`
          ${theme === "light" ? "-rotate-90 scale-0" : "rotate-0 scale-100"}
          h-[22px] w-[22px] transition-all
        `}
      />
      <Moon
        className={`${
          theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        } absolute h-[22px] w-[22px] transition-all`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
