import EnergyEfficiencyScale from "@/components/EnergyEfficiencyScale";
import StatCard from "@/components/StatCard";
import Sidebar from "@/components/SideBar";
import dashboardbg from "@/assets/dashboard.jpg";
import StatusQuoSummary from "@/components/StatusQuoSummary";
import { useLocation } from "react-router-dom";
import ChatBot from "@/components/ChatBot";
import Potenziale from "./Potenziale";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

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
          backgroundImage: `url(${dashboardbg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Grey dark overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-20 pointer-events-none z-0" />
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 bg-muted/20 overflow-y-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <StatCard
              title="Gesamtverbrauch"
              items={[
                { label: "Wärmeverbrauch", value: "~ 20.000 kWh" },
                { label: "Stromverbrauch", value: "~ 4.500 kWh/Jahr" },
              ]}
            />
            <StatCard
              title="Gesamtkosten"
              items={[
                { label: "Heizkosten", value: "~ 2.200 €/Jahr" },
                { label: "Stromkosten", value: "~ 1.200 €/Jahr" },
              ]}
            />

            <EnergyEfficiencyScale currentGrade="D" />
          </div>
          {/* Additional dashboard content goes here */}
          {pathname === "/dashboard" && (
            <div className="absolute bottom-6 right-6 z-20">
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
