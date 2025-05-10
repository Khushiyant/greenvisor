import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "./ui/icons";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-2 p-2 m-2">
      {/* Language Switcher */}
      <LanguageSwitcher />
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Icons.moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Icons.sun className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
