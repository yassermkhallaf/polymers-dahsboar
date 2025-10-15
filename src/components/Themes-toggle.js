"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      //   size="icon"
      className="p-2 size-12"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title="Toggle Theme"
    >
      {isDark ? (
        <Sun className="!h-10 !w-10" />
      ) : (
        <Moon className="!h-10 !w-10" />
      )}
    </Button>
  );
}
