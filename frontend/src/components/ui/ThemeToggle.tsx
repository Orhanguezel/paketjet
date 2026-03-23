"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function ThemeToggle({ className }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch önlemek için mounted kontrolü
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-bg-alt animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-base",
        "text-muted hover:text-foreground hover:bg-bg-alt transition-colors",
        className
      )}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
