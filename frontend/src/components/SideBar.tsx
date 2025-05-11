import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Power, CheckCircle2, Gauge, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";
import { useAddress } from "@/hooks/useAddress";

interface SidebarProps {
  onSwitchBackground: () => void;
  currentBackground: "industrial" | "residential";
}

export default function Sidebar({
  onSwitchBackground,
  currentBackground,
}: SidebarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const { data: address } = useAddress().fetch;

  const handleLogout = useCallback(async () => {
    await logout();
    window.location.href = "/";
  }, [logout]);

  // Helper to check if a route is active
  const isActive = (route: string) => {
    if (route === "/dashboard/check") {
      return pathname.startsWith("/dashboard/check");
    }
    if (route === "/dashboard/potential") {
      return pathname.startsWith("/dashboard/potential");
    }
    if (route === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname === "/" ||
        (!pathname.startsWith("/dashboard/check") &&
          !pathname.startsWith("/dashboard/potential") &&
          pathname.startsWith("/dashboard"))
      );
    }
    return pathname === route;
  };

  return (
    <aside className="w-[280px] h-screen bg-background/80 backdrop-blur-md flex flex-col p-6 space-y-6 rounded-xl shadow-lg border border-border">
      {/* Address Section */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground font-medium mb-1">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 21s-6-5.686-6-10A6 6 0 1 1 18 11c0 4.314-6 10-6 10z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="11"
              r="2.5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="text-muted-foreground text-sm ml-6">{address}</div>
      </div>

      {/* Main Tiles */}
      <div className="flex flex-col gap-3">
        <Button
          asChild
          variant={isActive("/dashboard") ? "secondary" : "outline"}
          className={`justify-start font-semibold text-base bg-white shadow border-green-200 ${
            isActive("/dashboard")
              ? "text-green-600 border-green-600"
              : "text-muted-foreground"
          }`}
        >
          <Link to="/dashboard">
            <Gauge className="w-5 h-5 mr-3" />
            {t("sidebar.Energieprofil", "Energieprofil")}
          </Link>
        </Button>
        <Button
          asChild
          variant={isActive("/dashboard/check") ? "secondary" : "outline"}
          className={`justify-start font-semibold text-base bg-white shadow ${
            isActive("/dashboard/check")
              ? "text-green-600 border-green-600"
              : "text-muted-foreground"
          }`}
        >
          <Link to="/dashboard/check">
            <CheckCircle2 className="w-5 h-5 mr-3" />
            {t("sidebar.Grün.Check", "Grün.Check")}
          </Link>
        </Button>
        <Button
          asChild
          variant={isActive("/dashboard/potential") ? "secondary" : "outline"}
          className={`justify-start font-semibold text-base bg-white shadow ${
            isActive("/dashboard/potential")
              ? "text-green-600 border-green-600"
              : "text-muted-foreground"
          }`}
        >
          <Link to="/dashboard/potential">
            <Home className="w-5 h-5 mr-3" />
            {t("sidebar.Potenziale", "Potenziale")}
          </Link>
        </Button>
      </div>
      <div className="flex-grow" />
      <Button
        onClick={onSwitchBackground}
        variant="ghost"
        className="w-full text-xs text-muted-foreground hover:text-green-600 justify-start"
      >
        {currentBackground === "residential" && (
          <Building className="w-4 h-4 mr-2" />
        )}
        {currentBackground === "industrial" && (
          <Home className="w-4 h-4 mr-2" />
        )}
        {currentBackground === "industrial"
          ? t("sidebar.switchToResidential")
          : t("sidebar.switchToIndustrial")}
      </Button>
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full text-xs text-muted-foreground hover:text-destructive justify-start"
      >
        <Power className="w-4 h-4 mr-2" /> {t("sidebar.Abmelden")}
      </Button>
    </aside>
  );
}
