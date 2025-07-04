import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Always white on home, otherwise white in dark mode, black in light mode
  const textColor = isHome ? "text-white" : "text-foreground";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${textColor}`}
        >
          <span className="font-semibold uppercase">
            {i18n.language.slice(0, 2)}
          </span>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("de")}>
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("fr")}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
