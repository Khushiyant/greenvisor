import { LanguageSwitcher } from "./language-switcher";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <div
      className={`fixed top-0 right-0 z-50 flex items-center gap-2 p-2 m-2 rounde`}
    >
      {/* Language Switcher */}
      <LanguageSwitcher />
      {/* Theme Toggle */}
      <ModeToggle />
    </div>
  );
}
