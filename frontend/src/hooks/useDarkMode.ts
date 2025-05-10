import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

/**
 * Custom hook that returns whether dark mode is currently active
 */
export function useDarkMode(): boolean {
  const { theme, systemTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Effect to calculate the actual theme based on system preference when needed
  useEffect(() => {
    const isCurrentlyDark = 
      theme === "dark" || 
      (theme === "system" && systemTheme === "dark");
    
    setIsDarkMode(isCurrentlyDark);
  }, [theme, systemTheme]);

  return isDarkMode;
}