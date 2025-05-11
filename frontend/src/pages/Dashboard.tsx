import EnergyEfficiencyScale from "@/components/EnergyEfficiencyScale";
import StatCard from "@/components/StatCard";
import Sidebar from "@/components/SideBar";
import dashboardbg from "@/assets/dashboard.png";
import dashboardbg2 from "@/assets/dashboard2.jpg";
import StatusQuoSummary from "@/components/StatusQuoSummary";
import { useLocation } from "react-router-dom";
import ChatBot from "@/components/ChatBot";
import Potenziale from "./Potenziale";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";

export default function Dashboard() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currProp, setCurrProp] = useState<"residential" | "industrial">(
    "residential"
  );

  return (
    <>
      <Helmet>
        <title>
          {t("app.title")} - {t("dashboard.title", "Dashboard")}
        </title>
        <meta
          name="description"
          content={t(
            "dashboard.description",
            "Your personal dashboard for energy efficiency."
          )}
        />
      </Helmet>
      <div
        className="flex h-screen bg-background relative"
        style={{
          backgroundImage: `url(${
            currProp === "residential" ? dashboardbg : dashboardbg2
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Grey dark overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-20 pointer-events-none z-0" />

        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar
            currentBackground={currProp}
            onSwitchBackground={() => {
              setCurrProp((prev) =>
                prev === "residential" ? "industrial" : "residential"
              );
            }}
          />
        </div>

        {/* Sidebar drawer for mobile */}
        <div className="md:hidden">
          <button
            className="absolute top-4 left-4 z-30 bg-white/80 rounded-full p-2 shadow-md"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Icons.menu className="w-6 h-6 text-gray-700" />
          </button>
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Sidebar */}
              <div className="relative z-50 w-[80vw] max-w-xs h-full bg-background border-0 overflow-y-auto rounded-none shadow-none">
                <button
                  className="absolute top-4 right-4 z-50 bg-white/80 rounded-full p-1 shadow"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <span className="text-xl">&times;</span>
                </button>
                <Sidebar
                  currentBackground={currProp}
                  onSwitchBackground={() => {
                    setCurrProp((prev) =>
                      prev === "residential" ? "industrial" : "residential"
                    );
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <main className="flex-1 p-2 md:p-6 bg-muted/20 overflow-y-auto relative z-10">
          <div className="flex flex-row flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
            <StatCard
              className="flex-1 min-w-[220px]"
              title="Gesamtverbrauch"
              items={[
                { label: "Wärmeverbrauch", value: "~ 20.000 kWh" },
                { label: "Stromverbrauch", value: "~ 4.500 kWh/Jahr" },
              ]}
            />
            <StatCard
              className="flex-1 min-w-[220px]"
              title="Gesamtkosten"
              items={[
                { label: "Heizkosten", value: "~ 2.200 €/Jahr" },
                { label: "Stromkosten", value: "~ 1.200 €/Jahr" },
              ]}
            />
          </div>
          <div className="flex-1 min-w-[220px] flex items-stretch">
            <EnergyEfficiencyScale currentGrade="D" />
          </div>
          {/* Additional dashboard content goes here */}
          {pathname === "/dashboard" && (
            <div className="absolute bottom-6 right-6 z-20 max-w-full w-[95vw] md:w-auto">
              <StatusQuoSummary />
            </div>
          )}
          {pathname === "/dashboard/check" && <ChatBot />}
          {pathname === "/dashboard/potential" && <Potenziale />}
        </main>
      </div>
    </>
  );
}
